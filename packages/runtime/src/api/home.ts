import { request } from "#src/utils/request";
import { unwrap } from "#src/utils/request/envelope";

export interface PieDataType {
	value: number
	code: string
}
export function fetchPie(data: { by: string | number }): Promise<PieDataType[]> {
	return unwrap(request
		.get("home/pie", { searchParams: data })
		.json());
}

export function fetchLine(data: { range: string }): Promise<number[]> {
	return unwrap(request
		.post("home/line", { json: data })
		.json());
}
