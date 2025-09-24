import { CrudUserUC } from './useCases/crudUserUC';
import { UserService } from './services/user.service';
import { Module } from '@nestjs/common';
import { SharedModule } from './../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { CrudUserService } from './services/crudUser.service';
import { UserUC } from './useCases/userUC.uc';

@Module({
  imports: [SharedModule.forRoot()],
  controllers: [UserController],
  providers: [UserUC, CrudUserUC, CrudUserService, UserService],
  exports: [UserService],
})
export class UserModule {}
