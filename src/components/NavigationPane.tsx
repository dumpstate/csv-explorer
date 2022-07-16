import { useEffect, useState } from 'react'
import SqlStore from 'src/stores/SqlStore'

interface EntityListProps {
    readonly sqlStore: SqlStore
}

export default function NavigationPane(props: EntityListProps) {
    const { sqlStore } = props
    const [tables, setTables] = useState<any>([])

    useEffect(() => {
        const loadTables = async () => {
            const tbs = await sqlStore.getAllTables()
            console.log('Tables', tbs)
            setTables(tbs)
        }

        loadTables()
    }, [])

    return (
        <div>List of entities</div>
    )
}
