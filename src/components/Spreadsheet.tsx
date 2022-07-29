import jspreadsheet from 'jspreadsheet-ce'
import { useEffect, useRef } from 'react'

import '../../node_modules/jspreadsheet-ce/dist/jspreadsheet.css'

export default function Spreadsheet() {
    const ref = useRef(null)
    const opts = {
        data: [[]],
        minDimensions: [10, 10],
    }

    useEffect(() => {
        if (!ref?.current?.['jspreadsheet']) {
            jspreadsheet(ref.current, opts)
        }
    }, [opts])

    return <div ref={ref} />
}
