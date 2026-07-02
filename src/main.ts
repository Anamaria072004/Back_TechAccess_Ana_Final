// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  //Set global prefix
  app.setGlobalPrefix('api');

  //CORS 
  const corsOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
    : ['*'];
  
  logger.log(`🔧 CORS origins: ${JSON.stringify(corsOrigins)}`);
  
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
  });

  //Pipes globales de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The haptica API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  //Puerto dinámico para Render
  const port = process.env.PORT ?? 3000; 
  await app.listen(port, '0.0.0.0');
  
  // Logs limpios para producción
  logger.log(`🚀 Application running on port: ${port}`);
  logger.log(`📡 CORS allowed origins: ${corsOrigins.join(', ')}`);
  
  // ❌ ELIMINA ESTE CÓDIGO DE DEBUG:
  // const server = app.getHttpServer();
  // const router = server._events.request._router;
  // const routes = router.stack...
  // routes.forEach(route => { ... });
}
bootstrap();
