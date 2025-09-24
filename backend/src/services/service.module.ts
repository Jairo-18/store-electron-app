import { CrudServiceUC } from './useCases/crudServiceUC.uc';
import { ServiceUC } from './useCases/serviceUC.uc';
import { ServiceController } from './controllers/service.controller';
import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { ServiceService } from './services/service.service';
import { CrudServiceService } from './services/crudService.service';

@Module({
  imports: [SharedModule.forRoot()],
  controllers: [ServiceController],
  providers: [ServiceService, CrudServiceService, ServiceUC, CrudServiceUC],
})
export class ServiceModule {}
