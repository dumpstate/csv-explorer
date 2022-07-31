import CodeEditor from '@uiw/react-textarea-code-editor'
import { useEffect, useState } from 'react'

import Split, { Orientation } from './components/Split'
import EntityList from './components/EntityList'
import Modal from './components/Modal'
import ImportForm from './components/ImportForm'
import Spreadsheet from './components/Spreadsheet'
import { Table } from './models/Table'
import SqlStore from './stores/SqlStore'

interface AppProps {
    readonly sqlStore: SqlStore
}

export default function App(props: AppProps) {
    const { sqlStore } = props

    const [query, setQuery] = useState<string>('')
    const [result, setResult] = useState<any[]>([])
    const [tables, setTables] = useState<Table[]>([])
    const [showImportModal, setShowImportModal] = useState<boolean>(false)

    useEffect(() => {loadTables()}, [])

    async function loadTables() {
        const tableNames = await sqlStore.getAllTables()
        const tables = await Promise.all(
            tableNames.map(async (table) => ({
                name: table,
                columns: await sqlStore.getColumns(table)
            })),
        )

        setTables(tables)
    }

    async function runQuery() {
        try {
            const res = await sqlStore.exec(query)
            await loadTables()
            setResult(res)
        } catch(err: any) {
            console.error(err)
            setResult([])
        }
    }

    async function save() {
        await sqlStore.save()
    }

    return (
        <Split>
            <div className='flex flex-col'>
                <div className='flex flex-row'>
                    <button onClick={() => setShowImportModal(true)}>Import CSV</button>
                    <button onClick={() => save()}>Save</button>
                </div>
                <EntityList
                    tables={tables}
                    sqlStore={sqlStore} />
                {showImportModal && <Modal
                    close={() => setShowImportModal(false)}>
                    <ImportForm
                        sqlStore={sqlStore}
                        onDone={async () => {
                            await loadTables()
                            setShowImportModal(false)
                        }} />
                </Modal>}
            </div>
            <Split orientation={Orientation.Vertical}>
                <div className='w-full h-full flex flex-col'>
                    <CodeEditor
                        value={query}
                        language='sql'
                        placeholder='Your SQL query'
                        onChange={(evn) => setQuery(evn.target.value)}
                        padding={15}
                        style={{
                            height: '100%',
                            fontSize: 12,
                            backgroundColor: "#f5f5f5",
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }} />
                    <button
                        className='justify-self-end'
                        onClick={runQuery}>Run</button>
                </div>
                <Spreadsheet data={result} />
            </Split>
        </Split>
    )
}
