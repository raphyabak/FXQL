import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FxqlService } from './fxql.service';
import { FxqlDto } from './dto/fxql.dto';
import { FxqlResponseDto } from './dto/fxql-response.dto';

@ApiTags('FXQL')
@Controller('fxql-statements')
export class FxqlController {
  constructor(private readonly fxqlService: FxqlService) {}

  @Post()
  @ApiOperation({ summary: 'Parse FXQL statement' })
  @ApiResponse({ status: 200, description: 'Successfully parsed FXQL statement', type: FxqlResponseDto })
  async parseFxql(@Body() fxqlDto: FxqlDto): Promise<FxqlResponseDto> {
    return this.fxqlService.parseFxql(fxqlDto.FXQL);
  }
}