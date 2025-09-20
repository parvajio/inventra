import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatebaseModule } from './datebase/datebase.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatebaseModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
