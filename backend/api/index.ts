import { createServer } from 'vercel-node-server';
import { AppModule } from '../src/app.module';
import { NestFactory } from '@nestjs/core';
import type { IncomingMessage, ServerResponse } from 'http';

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'https://dataforge-platform-c2tj.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.init();

  // Get the raw Node.js instance
  const instance = app.getHttpAdapter().getInstance();

  // Delegate the request and response manually
  instance(req, res);
});

export default server;
