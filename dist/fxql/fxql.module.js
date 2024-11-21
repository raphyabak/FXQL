"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FxqlModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fxql_controller_1 = require("./fxql.controller");
const fxql_service_1 = require("./fxql.service");
const currency_pair_entity_1 = require("./entities/currency-pair.entity");
let FxqlModule = class FxqlModule {
};
exports.FxqlModule = FxqlModule;
exports.FxqlModule = FxqlModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([currency_pair_entity_1.CurrencyPair])],
        controllers: [fxql_controller_1.FxqlController],
        providers: [fxql_service_1.FxqlService],
    })
], FxqlModule);
//# sourceMappingURL=fxql.module.js.map