interface EntityListProps {
    readonly tables: string[]
}

export default function EntityList(props: EntityListProps) {
    return (
        <ul>
            {props.tables.map((table, ix) =>
                <li key={ix}>{table}</li>
            )}
        </ul>
    )
}
