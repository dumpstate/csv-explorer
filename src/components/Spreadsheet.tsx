import jspreadsheet from 'jspreadsheet-ce'
import { useEffect, useRef } from 'react'

import '../../node_modules/jspreadsheet-ce/dist/jspreadsheet.css'

interface SpreadsheetProps {
    readonly data: any[] | null | undefined
    readonly error: string | null | undefined
}

export default function Spreadsheet(props: SpreadsheetProps) {
    const ref = useRef(null)
    const { data, error } = props;

    const opts = {
        columns: (data && data.length && data[0].columns
            .map((title: string) => ({
                type: 'text',
                title,
                readOnly: true,
                width: 100,
            }))) || [],
        data: (data && data.length && data[0].values) || [[]],
        onbeforepaste: () => false,
        contextMenu: () => false,
    }
    const count = opts.data[0].length

    useEffect(() => {
        const spreadsheet = ref?.current?.['jspreadsheet'] as any

        if (spreadsheet) {
            spreadsheet.destroy()
        }

        if (count > 0) {
            jspreadsheet(ref.current, opts)
        }
    }, [data])

    if (!data && error) {
        return (
            <pre>{error}</pre>
        )
    }

    return (
        count > 0
            ? <div ref={ref} />
            : <div>No results</div>
    )
}
