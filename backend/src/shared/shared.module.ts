import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath:
            process.env.NODE_ENV === 'production'
              ? '.env.production'
              : '.env.development',
          cache: true,
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const sslEnabled = configService.get('DB_SSL') === 'true';
            const config: any = {
              type: 'postgres',
              host: configService.get('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get('DB_USERNAME'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_DATABASE'),
              entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
              autoLoadEntities: true,
              synchronize: false,
              logging: false,
              extra: {
                keepAlive: true,
                max: 20,
                idleTimeoutMillis: 60000,
                connectionTimeoutMillis: 60000,
              },
            };

            if (sslEnabled) {
              config.ssl = {
                rejectUnauthorized: false,
              };
            }

            return config;
          },
        }),

        TypeOrmModule.forFeature([]),
      ],
      controllers: [],
      providers: [],
      exports: [TypeOrmModule, ConfigModule],
    };
  }
}
