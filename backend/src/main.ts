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
  
//   // ULTRA-SIMPLE CORS - Remove all complexity
//   app.enableCors({
//     origin: 'https://dataforge-platform-c2tj.vercel.app',
//     credentials: true,
//   });

//   // Add global middleware to handle CORS headers manually
//   app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'https://dataforge-platform-c2tj.vercel.app');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-CSRF-Token');
//     res.header('Access-Control-Allow-Credentials', 'true');
    
//     // Handle preflight requests
//     if (req.method === 'OPTIONS') {
//       res.sendStatus(200);
//     } else {
//       next();
//     }
//   });
 
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


// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

let app;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  app.enableCors({
    origin: 'https://dataforge-platform-c2tj.vercel.app',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('CRUD Platform API')
    .setDescription('Auto-generated CRUD + RBAC Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3001);
  console.log(`🚀 Server running on port ${process.env.PORT || 3001}`);
}

// Export for Vercel
export default async (req: any, res: any) => {
  if (!app) {
    await bootstrap();
  }
  return app.getHttpAdapter().getInstance()(req, res);
};

// Start for non-serverless environments
if (require.main === module) {
  bootstrap();
}