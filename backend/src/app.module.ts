// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DynamicModelsModule } from './dynamic-models/dynamic-models.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, DynamicModelsModule],
  controllers:[AppController]
})
export class AppModule {}