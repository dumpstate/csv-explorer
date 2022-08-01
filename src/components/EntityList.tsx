import { Table } from 'src/models/Table'
import { toCsv } from 'src/services/csv'
import { downloadFile } from 'src/services/files'
import SqlStore from 'src/stores/SqlStore'

interface EntityListProps {
    readonly tables: Table[]
    readonly sqlStore: SqlStore
    readonly onSchemaChange: () => void
}

export default function EntityList(props: EntityListProps) {
    const { tables, sqlStore, onSchemaChange } = props

    async function download(tableName: string) {
        const [columns, data] = await sqlStore.getAllRows(tableName)
        const csv = await toCsv(columns, data)

        downloadFile(`${tableName}.csv`, csv)
    }

    async function drop(tableName: string) {
        await sqlStore.dropTable(tableName)

        onSchemaChange()
    }

    return (
        <ul className='p-2 bg-gray-50'>
            {tables.map((table, ix) =>
                <details key={ix}>
                    <summary className='flex flex-row justify-between'>
                        <div>{table.name}</div>
                        <div className='flex flex-row'>
                            <button onClick={() => download(table.name)}>
                                Download
                            </button>
                            <button onClick={() => drop(table.name)}>
                                Drop
                            </button>
                        </div>
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
