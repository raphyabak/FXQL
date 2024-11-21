"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FxqlService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const currency_pair_entity_1 = require("./entities/currency-pair.entity");
let FxqlService = class FxqlService {
    constructor(currencyPairRepository) {
        this.currencyPairRepository = currencyPairRepository;
    }
    async parseFxql(fxqlStatement) {
        try {
            const normalizedStatement = fxqlStatement.replace(/\\n/g, '\n');
            const statements = this.splitStatements(normalizedStatement);
            if (statements.length > 1000) {
                throw new common_1.BadRequestException('Maximum 1000 currency pairs allowed per request');
            }
            const parsedPairs = await Promise.all(statements.map(async (statement) => {
                const parsed = this.parseStatement(statement);
                return this.saveCurrencyPair(parsed);
            }));
            return {
                message: 'FXQL Statement Parsed Successfully.',
                code: 'FXQL-200',
                data: parsedPairs.map((pair) => ({
                    EntryId: pair.id,
                    SourceCurrency: pair.sourceCurrency,
                    DestinationCurrency: pair.destinationCurrency,
                    SellPrice: pair.sellPrice,
                    BuyPrice: pair.buyPrice,
                    CapAmount: pair.capAmount,
                })),
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Invalid FXQL statement format');
        }
    }
    splitStatements(fxqlStatement) {
        const statements = fxqlStatement
            .split(/}\s*\n+/)
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(s => s + (s.endsWith('}') ? '' : '}'));
        return statements;
    }
    parseStatement(statement) {
        const currencyPairRegex = /^([A-Z]{3})-([A-Z]{3})\s*{/;
        const buyRegex = /BUY\s+(\d+(\.\d+)?)/;
        const sellRegex = /SELL\s+(\d+(\.\d+)?)/;
        const capRegex = /CAP\s+(\d+)/;
        const currencyMatch = statement.match(currencyPairRegex);
        if (!currencyMatch) {
            throw new common_1.BadRequestException('Invalid currency pair format');
        }
        const buyMatch = statement.match(buyRegex);
        const sellMatch = statement.match(sellRegex);
        const capMatch = statement.match(capRegex);
        if (!buyMatch || !sellMatch || !capMatch) {
            throw new common_1.BadRequestException('Missing required fields (BUY, SELL, or CAP)');
        }
        return {
            sourceCurrency: currencyMatch[1],
            destinationCurrency: currencyMatch[2],
            buyPrice: parseFloat(buyMatch[1]),
            sellPrice: parseFloat(sellMatch[1]),
            capAmount: parseInt(capMatch[1], 10),
        };
    }
    async saveCurrencyPair(parsedData) {
        const existingPair = await this.currencyPairRepository.findOne({
            where: {
                sourceCurrency: parsedData.sourceCurrency,
                destinationCurrency: parsedData.destinationCurrency,
            },
        });
        if (existingPair) {
            Object.assign(existingPair, parsedData);
            return this.currencyPairRepository.save(existingPair);
        }
        const newPair = this.currencyPairRepository.create(parsedData);
        return this.currencyPairRepository.save(newPair);
    }
};
exports.FxqlService = FxqlService;
exports.FxqlService = FxqlService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(currency_pair_entity_1.CurrencyPair)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FxqlService);
//# sourceMappingURL=fxql.service.js.map