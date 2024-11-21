import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FxqlDto {
  @ApiProperty({
    example: 'USD-GBP {\n BUY 100\n SELL 200\n CAP 93800\n}',
    description: 'FXQL statement to parse',
  })
  @IsString()
  @IsNotEmpty()
  FXQL: string;
}