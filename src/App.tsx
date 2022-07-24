import CodeEditor from '@uiw/react-textarea-code-editor'
import { Grid } from 'react-spreadsheet-grid'
import { useEffect, useState } from 'react'

import Split, { Orientation } from './components/Split'
import SqlStore from './stores/SqlStore'
import EntityList from './components/EntityList'
import Modal from './components/Modal'
import ImportForm from './components/ImportForm'

interface AppProps {
    readonly sqlStore: SqlStore
}

interface ActionBarProps {
    readonly onRun?: () => void
    readonly onImportCSV?: () => void
}

function ActionBar(props: ActionBarProps) {
    const {
        onRun,
        onImportCSV,
    } = props

    return (
        <div className='flex flex-row'>
            {onRun && <button onClick={onRun}>Run</button>}
            {onImportCSV && <button onClick={onImportCSV}>Import CSV</button>}
        </div>
    )
}

export default function App(props: AppProps) {
    const { sqlStore } = props

    const [query, setQuery] = useState<string>('')
    const [result, setResult] = useState<any[]>([])
    const [tables, setTables] = useState<string[]>([])
    const [showImportModal, setShowImportModal] = useState<boolean>(false)

    useEffect(() => {loadTables()}, [])

    async function loadTables() {
        setTables(await sqlStore.getAllTables())
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

    return (
        <Split>
            <div className='flex flex-col'>
                <ActionBar onImportCSV={() => setShowImportModal(true)} />
                <EntityList tables={tables} />
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
                <Grid
                    columns={result && result.length
                        ? result[0].columns
                            .map((colName: string, ix: number) => ({
                                title: () => colName,
                                value: (row: any) => <pre>{row.values[ix]}</pre>
                            }))
                        : []}
                    rows={result && result.length
                        ? result[0].values
                            .map((row: any[], ix: number) => ({
                                __ix: ix,
                                values: row,
                            }))
                        : []}
                    getRowKey={(row: any) => row.__ix} />
            </Split>
        </Split>
    )
}
