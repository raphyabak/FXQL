import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FxqlController } from './fxql.controller';
import { FxqlService } from './fxql.service';
import { CurrencyPair } from './entities/currency-pair.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyPair])],
  controllers: [FxqlController],
  providers: [FxqlService],
})
export class FxqlModule {}