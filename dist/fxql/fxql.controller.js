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
exports.FxqlController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fxql_service_1 = require("./fxql.service");
const fxql_dto_1 = require("./dto/fxql.dto");
const fxql_response_dto_1 = require("./dto/fxql-response.dto");
let FxqlController = class FxqlController {
    constructor(fxqlService) {
        this.fxqlService = fxqlService;
    }
    async parseFxql(fxqlDto) {
        return this.fxqlService.parseFxql(fxqlDto.FXQL);
    }
};
exports.FxqlController = FxqlController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Parse FXQL statement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully parsed FXQL statement', type: fxql_response_dto_1.FxqlResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fxql_dto_1.FxqlDto]),
    __metadata("design:returntype", Promise)
], FxqlController.prototype, "parseFxql", null);
exports.FxqlController = FxqlController = __decorate([
    (0, swagger_1.ApiTags)('FXQL'),
    (0, common_1.Controller)('fxql-statements'),
    __metadata("design:paramtypes", [fxql_service_1.FxqlService])
], FxqlController);
//# sourceMappingURL=fxql.controller.js.map