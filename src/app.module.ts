import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlanilhasModule } from './planilhas/planilhas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Removi os parâmetros da URL para deixar a configuração apenas no objeto SSL
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, 
      ssl: {
        rejectUnauthorized: false, // O "pulo do gato" para ignorar o erro de self-signed
        ca: fs.readFileSync(join(process.cwd(), 'ca-certificate.crt')).toString(),
      },
    }),
    PlanilhasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}