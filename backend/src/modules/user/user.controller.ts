import { Controller, Get } from '@nestjs/common';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { KeycloakRolesEnum } from 'src/common/enums/keycloak-roles.enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Roles({ roles: [KeycloakRolesEnum.UserProfileViewSelf] })
  @Get('get-info')
  findMe(@AuthenticatedUser() user: IUser) {
    return this.userService.findMe(user);
  }
}
