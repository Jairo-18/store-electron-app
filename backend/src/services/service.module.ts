import { CrudServiceUC } from './useCases/crudServiceUC.uc';
import { ServiceUC } from './useCases/serviceUC.uc';
import { ServiceController } from './controllers/service.controller';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from '../shared/shared.module';
import { ServiceService } from './services/service.service';
import { CrudServiceService } from './services/crudService.service';

@Module({
  imports: [
    SharedModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ServiceController],
  providers: [ServiceService, CrudServiceService, ServiceUC, CrudServiceUC],
})
export class ServiceModule {}
