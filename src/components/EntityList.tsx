import { Table } from 'src/models/Table'
import { toCsv } from 'src/services/csv'
import { downloadFile } from 'src/services/files'
import SqlStore from 'src/stores/SqlStore'
import ActionButton from './ActionButton'

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
        <ul className='bg-neutral-50'>
            {tables.map((table, ix) =>
                <details key={ix} className='hover:bg-neutral-100'>
                    <summary className='flex flex-row justify-between p-1'>
                        <div className='font-light text-sm self-center'>{table.name}</div>
                        <div className='flex flex-row'>
                            <ActionButton
                                label='Download'
                                action={() => download(table.name)} />
                            <ActionButton
                                label='Drop'
                                action={() => drop(table.name)} />
                        </div>
                    </summary>
                    <ul>
                        {table.columns.map((col: string, ic: number) =>
                            <div key={ic} className='font-light text-xs p-1'>{col}</div>
                        )}
                    </ul>
                </details>
            )}
        </ul>
    )
}
