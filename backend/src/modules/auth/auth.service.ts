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
}
