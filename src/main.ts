// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

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
  
  // Mostrar todas las rutas disponibles (para debug)
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const routes = router.stack
    .filter(layer => layer.route)
    .map(layer => ({
      path: layer.route?.path,
      methods: Object.keys(layer.route?.methods || {}).join(', ').toUpperCase(),
    }));
  
  logger.log('📋 Rutas registradas:');
  routes.forEach(route => {
    logger.log(`  ${route.methods} ${route.path}`);
  });
}
bootstrap();