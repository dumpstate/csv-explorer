import { parse } from "csv-parse/browser/esm"
import { stringify } from "csv-stringify/browser/esm"

export function parseCsv(
	content: Buffer | string | null | undefined,
): Promise<any> {
	if (!content) {
		return Promise.reject(new Error("Empty buffer"))
	}

	return new Promise((resolve, reject) => {
		parse(content, {}, (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	})
}

export function toCsv(columns: string[], data: any[]): Promise<string> {
	return new Promise((resolve, reject) => {
		stringify(
			data,
			{
				columns,
				header: true,
			},
			(err, content) => {
				if (err) {
					reject(err)
				} else {
					resolve(content)
				}
			},
		)
	})
}
