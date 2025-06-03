import AdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SharedService {
  constructor(private readonly configService: ConfigService) {}
  config: {
    realmName: string;
    baseUrl: string;
  };
  adminClient: AdminClient;

  async onModuleInit() {
    await this.getAdminClient();
  }

  async getAdminClient() {
    this.config = {
      realmName: this.configService.get<string>(
        'KEYCLOAK_ADMIN_REALM',
      ) as string,
      baseUrl: this.configService.get<string>('KEYCLOAK_ADMIN_HOST') as string,
    };
    this.adminClient = new AdminClient(this.config);
    await this.adminClient.auth({
      password: this.configService.get('KEYCLOAK_ADMIN_PASSWORD'),
      username: this.configService.get('KEYCLOAK_ADMIN_USERNAME'),
      grantType: 'password',
      clientId: this.configService.get<string>(
        'KEYCLOAK_ADMIN_CLIENT_ID',
      ) as string,
    });
    return this.adminClient;
  }
}
