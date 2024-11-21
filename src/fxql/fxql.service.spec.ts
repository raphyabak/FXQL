import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FxqlService } from './fxql.service';
import { CurrencyPair } from './entities/currency-pair.entity';
import { BadRequestException } from '@nestjs/common';

describe('FxqlService', () => {
  let service: FxqlService;
  let repository: Repository<CurrencyPair>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FxqlService,
        {
          provide: getRepositoryToken(CurrencyPair),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FxqlService>(FxqlService);
    repository = module.get<Repository<CurrencyPair>>(getRepositoryToken(CurrencyPair));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseFxql', () => {
    it('should successfully parse valid FXQL statement', async () => {
      const mockCurrencyPair = {
        id: 1,
        sourceCurrency: 'USD',
        destinationCurrency: 'GBP',
        buyPrice: 100,
        sellPrice: 200,
        capAmount: 93800,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue(mockCurrencyPair as CurrencyPair);
      jest.spyOn(repository, 'save').mockResolvedValue(mockCurrencyPair as CurrencyPair);

      const result = await service.parseFxql(
        'USD-GBP {\n BUY 100\n SELL 200\n CAP 93800\n}'
      );

      expect(result.code).toBe('FXQL-200');
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual({
        EntryId: 1,
        SourceCurrency: 'USD',
        DestinationCurrency: 'GBP',
        BuyPrice: 100,
        SellPrice: 200,
        CapAmount: 93800,
      });
    });

    it('should throw BadRequestException for invalid currency pair format', async () => {
      await expect(
        service.parseFxql('INVALID-FORMAT {\n BUY 100\n SELL 200\n CAP 93800\n}')
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when missing required fields', async () => {
      await expect(
        service.parseFxql('USD-GBP {\n BUY 100\n SELL 200\n}')
      ).rejects.toThrow(BadRequestException);
    });
  });
});