import { FxqlService } from './fxql.service';
import { FxqlDto } from './dto/fxql.dto';
import { FxqlResponseDto } from './dto/fxql-response.dto';
export declare class FxqlController {
    private readonly fxqlService;
    constructor(fxqlService: FxqlService);
    parseFxql(fxqlDto: FxqlDto): Promise<FxqlResponseDto>;
}
