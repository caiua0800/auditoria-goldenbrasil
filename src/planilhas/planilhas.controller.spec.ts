import { Test, TestingModule } from '@nestjs/testing';
import { PlanilhasController } from './planilhas.controller';

describe('PlanilhasController', () => {
  let controller: PlanilhasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanilhasController],
    }).compile();

    controller = module.get<PlanilhasController>(PlanilhasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
