import { Table } from 'src/models/Table'
import { toCsv } from 'src/services/csv'
import { downloadFile } from 'src/services/files'
import SqlStore from 'src/stores/SqlStore'

interface EntityListProps {
    readonly tables: Table[]
    readonly sqlStore: SqlStore
}

export default function EntityList(props: EntityListProps) {
    const { tables, sqlStore } = props

    async function download(tableName: string) {
        const [columns, data] = await sqlStore.getAllRows(tableName)
        const csv = await toCsv(columns, data)

        downloadFile(`${tableName}.csv`, csv)
    }

    return (
        <ul className='p-2'>
            {tables.map((table, ix) =>
                <details key={ix}>
                    <summary className='flex flex-row justify-between'>
                        <div>{table.name}</div>
                        <button onClick={() => download(table.name)}>
                            Download
                        </button>
                    </summary>
                    <ul>
                        {table.columns.map((col: string, ic: number) =>
                            <div key={ic}>{col}</div>
                        )}
                    </ul>
                </details>
            )}
        </ul>
    )
}
