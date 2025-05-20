import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import KeycloakConnect from 'keycloak-connect';
import { Model } from 'mongoose';
import { KEYCLOAK_INSTANCE } from 'nest-keycloak-connect';
import { SharedService } from 'src/shared/shared.service';
import { User, UserDocument } from '../user/entities/user.entity';
import { IRole } from '../user/interfaces/role.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly sharedService: SharedService,
    @Inject(KEYCLOAK_INSTANCE)
    private readonly keycloak: KeycloakConnect.Keycloak,
    private readonly configService: ConfigService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    console.log(registerDto);
    const { email, username, password, confirmPassword, firstName, lastName } =
      registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const adminClient = await this.sharedService.getAdminClient();
    const groups = [this.configService.get('KEYCLOAK_DEFAULT_GROUP_ID')];
    const clients: string[] = [];
    clients.pop();
    try {
      await Promise.all(
        groups.map(
          async (group) =>
            new Promise(
              async (resolve, reject) =>
                await adminClient.groups
                  .findOne({
                    id: group,
                    realm: this.configService.get('KEYCLOAK_REALM'),
                  })
                  .then((group) => {
                    if (clients.indexOf(group?.attributes?.['client'][0]) == -1)
                      clients.push(group?.attributes?.['client'][0]);
                    resolve(group);
                  })
                  .catch((error) => {
                    console.log(error);
                    reject(error);
                  }),
            ),
        ),
      ).catch((error) => {
        console.log(error);
        throw new BadRequestException(error);
      });

      const profile = new User();
      profile._id = randomUUID();
      const user = await adminClient.users.create({
        username,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
        email,
        firstName,
        lastName,
        realm: this.configService.get('KEYCLOAK_REALM'),
        enabled: true,
        attributes: {
          profile_id: profile._id,
          clients: [clients.join('##')],
        },
      });
      console.log(user);
      await Promise.all(
        groups.map(async (group) => {
          await adminClient.users.addToGroup({
            realm: this.configService.get('KEYCLOAK_REALM'),
            id: user.id,
            groupId: group,
          });
        }),
      );
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.email = email;
      profile.username = username;
      profile.groups = groups;
      profile.clients = clients;
      profile.kid = user.id;
      const userRoles: IRole[] = [];
      const keyclaokGroups = await adminClient.users.listGroups({
        id: user.id,
        realm: this.configService.get('KEYCLOAK_REALM'),
      });
      console.log(keyclaokGroups);
      for (const group of keyclaokGroups) {
        const roleMappings = await adminClient.groups.listRoleMappings({
          id: group.id as string,
          realm: this.configService.get('KEYCLOAK_REALM'),
        });
        const clientMappings = roleMappings.clientMappings || {};
        for (const clientId in clientMappings) {
          const clientRoles = clientMappings[clientId].mappings;
          for (const role of clientRoles) {
            userRoles.push({
              id: role.id,
              title: role.name,
              client_id: clientId,
            });
          }
        }
      }
      profile.roles = userRoles;
      const profileSave = new this.userModel(profile);
      await profileSave.save();

      const tokens = await this.keycloak.grantManager.obtainDirectly(
        username,
        password,
      );
      if (!tokens.access_token || !tokens.refresh_token) {
        throw new BadRequestException('Failed to obtain tokens');
      }
      return {
        access_token: tokens.access_token['token'],
        refresh_token: tokens.refresh_token['token'],
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const tokens = await this.keycloak.grantManager.obtainDirectly(
      username,
      password,
    );
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new BadRequestException('Failed to obtain tokens');
    }
    return {
      access_token: tokens.access_token['token'],
      refresh_token: tokens.refresh_token['token'],
    };
  }

  async googleAuth(id_token: string) {
    try {
      // Get the token endpoint URL from config
      const keycloakHost = this.configService.get('KEYCLOAK_HOST');
      const keycloakRealm = this.configService.get('KEYCLOAK_REALM');
      const clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
      const clientSecret = this.configService.get('KEYCLOAK_SECRET');
      console.log(keycloakHost, keycloakRealm, clientId, clientSecret);
      // Validate configuration
      if (!keycloakHost || !keycloakRealm || !clientId || !clientSecret) {
        throw new BadRequestException('Missing Keycloak configuration');
      }

      const tokenEndpoint = `${keycloakHost}/realms/${keycloakRealm}/protocol/openid-connect/token`;

      // Create form data for token exchange
      const formData = new URLSearchParams();
      formData.append(
        'grant_type',
        'urn:ietf:params:oauth:grant-type:token-exchange',
      );
      formData.append('client_id', clientId);
      formData.append('client_secret', clientSecret);
      formData.append('subject_token', id_token);
      formData.append(
        'subject_token_type',
        'urn:ietf:params:oauth:token-type:access_token',
      );
      formData.append('subject_issuer', 'google');

      console.log('Token exchange request data:', {
        endpoint: tokenEndpoint,
        clientId: clientId,
        // Don't log the client secret for security
      });

      // Make the token exchange request
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      // Parse the response
      const data = await response.json();

      if (data.error) {
        console.error('Token exchange error:', data);
        throw new BadRequestException(
          data.error_description || 'Failed to authenticate with Google',
        );
      }

      // Create or find user in our database if needed
      // This would typically involve extracting user info from the token
      // and creating a user record if one doesn't exist

      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      };
    } catch (error) {
      console.error('Google auth error:', error);
      throw new BadRequestException(
        error.message || 'Failed to authenticate with Google',
      );
    }
  }
}
