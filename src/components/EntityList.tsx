import { Table } from 'src/models/Table'

interface EntityListProps {
    readonly tables: Table[]
}

export default function EntityList(props: EntityListProps) {
    const { tables } = props

    return (
        <ul className='p-2'>
            {tables.map((table, ix) =>
                <details key={ix}>
                    <summary>{table.name}</summary>
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
