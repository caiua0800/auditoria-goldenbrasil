import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, Render } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import csv = require('csv-parser');
import { Planilha } from './planilha.entity';

@Controller('planilhas')
export class PlanilhasController {
  constructor(
    @InjectRepository(Planilha)
    private repo: Repository<Planilha>,
  ) {}

  @Get()
  @Render('planilhas')
  async root() {
    const planilhas = await this.repo.find({ order: { dataUpload: 'DESC' } });
    return { planilhas };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: any) {
    const resultados: any[] = [];
    
    // Processa o CSV para JSON
    await new Promise((resolve) => {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => resultados.push(data))
        .on('end', resolve);
    });

    // Salva no Postgres da DigitalOcean
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
        p.dados.forEach(linha => resultado.push({ ...linha, __planilha__: p.nomeOriginal, __id__: p.id }));
      }
    }
    return resultado;
  }

  @Get('dados/:id')
  async getDados(@Param('id') id: number) {
    const planilha = await this.repo.findOneBy({ id });
    return planilha ? planilha.dados : [];
  }
}