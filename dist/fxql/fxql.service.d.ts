import { Repository } from 'typeorm';
import { CurrencyPair } from './entities/currency-pair.entity';
import { FxqlResponseDto } from './dto/fxql-response.dto';
export declare class FxqlService {
    private currencyPairRepository;
    constructor(currencyPairRepository: Repository<CurrencyPair>);
    parseFxql(fxqlStatement: string): Promise<FxqlResponseDto>;
    private splitStatements;
    private parseStatement;
    private saveCurrencyPair;
}
