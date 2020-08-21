import { Test, TestingModule } from '@nestjs/testing';
import { TvdbController } from './tvdb.controller';

describe('Tvdb Controller', () => {
  let controller: TvdbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TvdbController],
    }).compile();

    controller = module.get<TvdbController>(TvdbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
