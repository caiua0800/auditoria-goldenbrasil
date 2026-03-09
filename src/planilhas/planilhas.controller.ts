import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import csv = require('csv-parser');
import { Planilha } from './planilha.entity';
import { Marcador } from './marcador.entity';

@Controller('planilhas')
export class PlanilhasController {
  constructor(
    @InjectRepository(Planilha)
    private repo: Repository<Planilha>,
    @InjectRepository(Marcador)
    private marcadorRepo: Repository<Marcador>,
  ) {}

  /* ─────────────── Planilhas ─────────────── */

  @Get()
  async listar() {
    return this.repo.find({ order: { dataUpload: 'DESC' } });
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: any) {
    const resultados: any[] = [];

    await new Promise((resolve) => {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => resultados.push(data))
        .on('end', resolve);
    });

    const novaPlanilha = this.repo.create({
      nomeOriginal: file.originalname,
      dados: resultados,
    });

    await this.repo.save(novaPlanilha);
    return { message: 'Planilha salva no banco!' };
  }

  @Get('dados/todas')
  async getTodas() {
    const planilhas = await this.repo.find({ order: { dataUpload: 'DESC' } });
    const resultado: any[] = [];
    for (const p of planilhas) {
      if (Array.isArray(p.dados)) {
        p.dados.forEach((linha) =>
          resultado.push({
            ...linha,
            __planilha__: p.nomeOriginal,
            __id__: p.id,
          }),
        );
      }
    }
    return resultado;
  }

  @Get('dados/:id')
  async getDados(@Param('id') id: number) {
    const planilha = await this.repo.findOneBy({ id });
    return planilha ? planilha.dados : [];
  }

  @Delete(':id')
  @HttpCode(200)
  async deletar(@Param('id') id: number) {
    await this.repo.delete(id);
    return { message: 'Planilha excluída com sucesso.' };
  }

  /* ─────────────── Marcadores ─────────────── */

  @Get('marcadores/lista')
  async listarMarcadores() {
    return this.marcadorRepo.find({ order: { id: 'ASC' } });
  }

  @Post('marcadores')
  async criarMarcador(
    @Body() body: { nome: string; cor: string; descricao?: string },
  ) {
    const marcador = this.marcadorRepo.create({
      nome: body.nome,
      cor: body.cor,
      descricao: body.descricao ?? '',
      vinculos: [],
    });
    return this.marcadorRepo.save(marcador);
  }

  @Put('marcadores/:id')
  async atualizarMarcador(
    @Param('id') id: number,
    @Body() body: { nome?: string; cor?: string; descricao?: string },
  ) {
    const marcador = await this.marcadorRepo.findOneBy({ id });
    if (!marcador) return { error: 'Marcador não encontrado' };
    if (body.nome !== undefined) marcador.nome = body.nome;
    if (body.cor !== undefined) marcador.cor = body.cor;
    if (body.descricao !== undefined) marcador.descricao = body.descricao;
    return this.marcadorRepo.save(marcador);
  }

  @Delete('marcadores/:id')
  @HttpCode(200)
  async deletarMarcador(@Param('id') id: number) {
    await this.marcadorRepo.delete(id);
    return { message: 'Marcador excluído com sucesso.' };
  }

  @Post('vincular-marcador')
  async vincularMarcador(
    @Body() body: { marcadorId: number; planilhaId: number; linhaIndex: number },
  ) {
    const marcador = await this.marcadorRepo.findOneBy({ id: body.marcadorId });
    if (!marcador) return { error: 'Marcador não encontrado' };

    const jaVinculado = marcador.vinculos.some(
      (v) => v.planilhaId === body.planilhaId && v.linhaIndex === body.linhaIndex,
    );

    if (!jaVinculado) {
      marcador.vinculos = [
        ...marcador.vinculos,
        { planilhaId: body.planilhaId, linhaIndex: body.linhaIndex },
      ];
      await this.marcadorRepo.save(marcador);
    }

    return { message: 'Marcador vinculado com sucesso.' };
  }
}
