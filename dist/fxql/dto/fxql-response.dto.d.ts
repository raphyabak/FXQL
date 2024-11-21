declare class CurrencyPairDto {
    EntryId: number;
    SourceCurrency: string;
    DestinationCurrency: string;
    SellPrice: number;
    BuyPrice: number;
    CapAmount: number;
}
export declare class FxqlResponseDto {
    message: string;
    code: string;
    data: CurrencyPairDto[];
}
export {};
