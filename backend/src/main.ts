// 👇 FIX para que pkg no rompa con NestJS/TypeORM en Node 22+
import * as nodeCrypto from 'node:crypto';

// Solo define o complementa si hace falta
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = nodeCrypto;
} else {
  // Agregamos métodos faltantes que esperan algunos paquetes
  if (!(globalThis.crypto as any).randomUUID) {
    (globalThis.crypto as any).randomUUID = nodeCrypto.randomUUID;
  }
  if (!(globalThis.crypto as any).randomBytes) {
    (globalThis.crypto as any).randomBytes = nodeCrypto.randomBytes;
  }
}

import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const id = uuidv4();

// eslint-disable-next-line @typescript-eslint/no-require-imports
import basicAuth = require('express-basic-auth');
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import * as express from 'express';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { AppDataSource } from 'typeorm.config';
import { NestExpressApplication } from '@nestjs/platform-express';

// 👇 Importa tu DataSource central

async function bootstrap() {
  // 👉 Si se arranca con --migrations, corre migraciones y termina
  if (process.argv.includes('--migrations')) {
    try {
      await AppDataSource.initialize();
      console.log('📦 Ejecutando migraciones...');
      const migrations = await AppDataSource.runMigrations();
      console.log('✅ Migraciones ejecutadas:', migrations);
      await AppDataSource.destroy();
      process.exit(0);
    } catch (err) {
      console.error('❌ Error ejecutando migraciones:', err);
      process.exit(1);
    }
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: false,
  });
  app.use(bodyParser.urlencoded({ extended: true }));
  const configService = app.get(ConfigService);
  const swaggerUser = configService.get<string>('swagger.user');
  const swaggerPassword = configService.get<string>('swagger.password');
  app.use(
    '/docs',
    basicAuth({
      challenge: true,
      users: { [swaggerUser]: swaggerPassword },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('STORE API')
    .setDescription('API for managing the web app from "STORE"')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const allowedHeaders = configService.get('app.cors.allowedHeaders');
  const allowedMethods = configService.get('app.cors.allowedMethods');

  app.enableCors({
    origin: true,
    allowedHeaders,
    methods: allowedMethods,
    credentials: true,
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.use(
    '/docs',
    express.static(join(__dirname, '../node_modules/swagger-ui-dist')),
  );

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
  console.log(
    `🚀 App corriendo en el puerto ${port} [${configService.get('app.env')}]`,
  );
}

bootstrap();
