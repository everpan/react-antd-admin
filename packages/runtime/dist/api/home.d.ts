export interface PieDataType {
    value: number;
    code: string;
}
export declare function fetchPie(data: {
    by: string | number;
}): Promise<ApiResponse<PieDataType[]>>;
export declare function fetchLine(data: {
    range: string;
}): Promise<ApiResponse<string[]>>;
