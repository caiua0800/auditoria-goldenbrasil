import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanilhasController } from './planilhas.controller';
import { Planilha } from './planilha.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Planilha])],
  controllers: [PlanilhasController],
})
export class PlanilhasModule {}