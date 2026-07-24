import { Test, TestingModule } from '@nestjs/testing';
import { TravelTimeService } from './traveltime.service';

describe('TravelTimeService', () => {
  let service: TravelTimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelTimeService],
    }).compile();

    service = module.get<TravelTimeService>(TravelTimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
