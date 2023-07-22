import jspreadsheet from "jspreadsheet-ce"
import { useEffect, useRef } from "react"

import "../../node_modules/jspreadsheet-ce/dist/jspreadsheet.css"

interface SpreadsheetProps {
	readonly data: any[] | null | undefined
	readonly error: string | null | undefined
}

export default function Spreadsheet(props: SpreadsheetProps) {
	const ref = useRef(null)
	const { data, error } = props

	useEffect(() => {
		const opts = {
			columns:
				(data &&
					data.length &&
					data[data.length - 1].columns.map((title: string) => ({
						type: "text",
						title,
						readOnly: true,
						width: 100,
					}))) ||
				[],
			data: (data && data.length && data[data.length - 1].values) || [[]],
			onbeforepaste: () => false,
			contextMenu: () => false,
		}
		const count = opts.data[0].length
		const spreadsheet = ref?.current?.["jspreadsheet"] as any

		if (spreadsheet) {
			spreadsheet.destroy()
		}

		if (count > 0) {
			jspreadsheet(ref.current, opts)
		}
	}, [data])

	if (!data && error) {
		return <pre className="bg-neutral-50">{error}</pre>
	}

	if (!data || !data.length) {
		return <div className="bg-neutral-50">No results</div>
	}

	return <div id="spreadsheet" className="bg-neutral-50" ref={ref} />
}
