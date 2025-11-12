// // backend/src/main.ts
// import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,
//   }));
  
//  app.enableCors({
//   origin: [
//     'https://dataforge-platform-c2tj.vercel.app',
//     'http://localhost:3001'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// });

 
//   const config = new DocumentBuilder()
//     .setTitle('CRUD Platform API')
//     .setDescription('Auto-generated CRUD + RBAC Platform')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);

//   const port = process.env.PORT || 3001;
//   await app.listen(port);
//   console.log(`🚀 Server running on http://localhost:${port}`);
//   console.log(`📚 API Documentation: http://localhost:${port}/api`);
// }

// bootstrap();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VercelRequest, VercelResponse } from '@vercel/node';

let cachedServer: any;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.enableCors({
      origin: [
        'https://dataforge-platform-c2tj.vercel.app',
        'http://localhost:3001',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    const config = new DocumentBuilder()
      .setTitle('CRUD Platform API')
      .setDescription('Auto-generated CRUD + RBAC Platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }

  return cachedServer;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await bootstrapServer();

  // ✅ Manually handle preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://dataforge-platform-c2tj.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.status(204).end();
    return;
  }

  return server(req, res);
}
