import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanilhasController } from './planilhas.controller';
import { Planilha } from './planilha.entity';
import { Marcador } from './marcador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Planilha, Marcador])],
  controllers: [PlanilhasController],
})
export class PlanilhasModule {}
