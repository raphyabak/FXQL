import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyPair } from './entities/currency-pair.entity';
import { FxqlResponseDto } from './dto/fxql-response.dto';

@Injectable()
export class FxqlService {
  constructor(
    @InjectRepository(CurrencyPair)
    private currencyPairRepository: Repository<CurrencyPair>,
  ) { }

  async parseFxql(fxqlStatement: string): Promise<FxqlResponseDto> {
    try {

      const normalizedStatement = fxqlStatement.replace(/\\n/g, '\n');

      const statements = this.splitStatements(normalizedStatement);
      if (statements.length > 1000) {
        throw new BadRequestException('Maximum 1000 currency pairs allowed per request');
      }

      const parsedPairs = await Promise.all(
        statements.map(async (statement) => {
          const parsed = this.parseStatement(statement);
          return this.saveCurrencyPair(parsed);
        })
      );

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
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid FXQL statement format');
    }
  }

  private splitStatements(fxqlStatement: string): string[] {

    const statements = fxqlStatement
      .split(/}\s*\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s + (s.endsWith('}') ? '' : '}'));

    return statements;
  }

  private parseStatement(statement: string): Omit<CurrencyPair, 'id' | 'createdAt' | 'updatedAt'> {
    const currencyPairRegex = /^([A-Z]{3})-([A-Z]{3})\s*{/;
    const buyRegex = /BUY\s+(\d+(\.\d+)?)/;
    const sellRegex = /SELL\s+(\d+(\.\d+)?)/;
    const capRegex = /CAP\s+(\d+)/;

    const currencyMatch = statement.match(currencyPairRegex);
    if (!currencyMatch) {
      throw new BadRequestException('Invalid currency pair format');
    }

    const buyMatch = statement.match(buyRegex);
    const sellMatch = statement.match(sellRegex);
    const capMatch = statement.match(capRegex);

    if (!buyMatch || !sellMatch || !capMatch) {
      throw new BadRequestException('Missing required fields (BUY, SELL, or CAP)');
    }

    return {
      sourceCurrency: currencyMatch[1],
      destinationCurrency: currencyMatch[2],
      buyPrice: parseFloat(buyMatch[1]),
      sellPrice: parseFloat(sellMatch[1]),
      capAmount: parseInt(capMatch[1], 10),
    };
  }

  private async saveCurrencyPair(parsedData: Omit<CurrencyPair, 'id' | 'createdAt' | 'updatedAt'>): Promise<CurrencyPair> {
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
}