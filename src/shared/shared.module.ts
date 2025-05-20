import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/user/entities/user.entity';
import { SharedService } from './shared.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [SharedService],
  exports: [MongooseModule, SharedService],
})
export class SharedModule {}
