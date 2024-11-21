import { ApiProperty } from '@nestjs/swagger';

class CurrencyPairDto {
  @ApiProperty()
  EntryId: number;

  @ApiProperty()
  SourceCurrency: string;

  @ApiProperty()
  DestinationCurrency: string;

  @ApiProperty()
  SellPrice: number;

  @ApiProperty()
  BuyPrice: number;

  @ApiProperty()
  CapAmount: number;
}

export class FxqlResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ type: [CurrencyPairDto] })
  data: CurrencyPairDto[];
}