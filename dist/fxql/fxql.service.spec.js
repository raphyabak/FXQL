"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const fxql_service_1 = require("./fxql.service");
const currency_pair_entity_1 = require("./entities/currency-pair.entity");
const common_1 = require("@nestjs/common");
describe('FxqlService', () => {
    let service;
    let repository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                fxql_service_1.FxqlService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(currency_pair_entity_1.CurrencyPair),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get(fxql_service_1.FxqlService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(currency_pair_entity_1.CurrencyPair));
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
            jest.spyOn(repository, 'create').mockReturnValue(mockCurrencyPair);
            jest.spyOn(repository, 'save').mockResolvedValue(mockCurrencyPair);
            const result = await service.parseFxql('USD-GBP {\n BUY 100\n SELL 200\n CAP 93800\n}');
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
            await expect(service.parseFxql('INVALID-FORMAT {\n BUY 100\n SELL 200\n CAP 93800\n}')).rejects.toThrow(common_1.BadRequestException);
        });
        it('should throw BadRequestException when missing required fields', async () => {
            await expect(service.parseFxql('USD-GBP {\n BUY 100\n SELL 200\n}')).rejects.toThrow(common_1.BadRequestException);
        });
    });
});
//# sourceMappingURL=fxql.service.spec.js.map