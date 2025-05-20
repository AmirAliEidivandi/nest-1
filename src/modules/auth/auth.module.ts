import { Module } from '@nestjs/common';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { KeycloakConfigModule } from 'src/common/keycloak/keycloak-config.module';
import { KeycloakConfigService } from 'src/common/keycloak/keycloak-config.service';
import { SharedModule } from 'src/shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeycloakConfigModule],
    }),
    SharedModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
