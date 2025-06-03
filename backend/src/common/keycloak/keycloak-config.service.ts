import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
} from 'nest-keycloak-connect';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createKeycloakConnectOptions():
    | Promise<KeycloakConnectOptions>
    | KeycloakConnectOptions {
    return {
      authServerUrl: this.configService.get('KEYCLOAK_HOST'),
      realm: this.configService.get('KEYCLOAK_REALM'),
      clientId: this.configService.get('KEYCLOAK_CLIENT_ID'),
      secret: this.configService.get('KEYCLOAK_SECRET')!,
    };
  }
}
