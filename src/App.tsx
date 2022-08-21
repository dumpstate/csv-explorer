import { KVStore } from '@dumpstate/ixdb-kv-store'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { ReactNode, useEffect, useState } from 'react'

import ActionButton from './components/ActionButton'
import Split, { Orientation } from './components/Split'
import EntityList from './components/EntityList'
import Modal from './components/Modal'
import ImportForm from './components/ImportForm'
import Spreadsheet from './components/Spreadsheet'
import { Table } from './models/Table'
import SqlStore from './stores/SqlStore'
import { LOCAL_STORE_NAME, LOCAL_STORE_QUERY_KEY } from './constants'

interface AppProps {
    readonly sqlStore: SqlStore
}

interface ActionBarProps {
    children: ReactNode | ReactNode[]
}

function ActionBar(props: ActionBarProps) {
    return (
        <div className='flex flex-row bg-neutral-200'>
            {props.children}
        </div>
    )
}

export default function App(props: AppProps) {
    const { sqlStore } = props

    const [query, setQuery] = useState<string>('')
    const [queryError, setQueryError] = useState<string>()
    const [selection, setSelection] = useState<[number, number]>([0, 0])
    const [result, setResult] = useState<any[] | null>()
    const [tables, setTables] = useState<Table[]>([])
    const [showImportModal, setShowImportModal] = useState<boolean>(false)
    const [localStore, setLocalStore] = useState<KVStore | null>()

    useEffect(() => {
        const init = async () => {
            await loadTables()

            const localStore = await KVStore.tryCreate(LOCAL_STORE_NAME)
            const cachedQuery = await localStore?.get<string>(LOCAL_STORE_QUERY_KEY)
            cachedQuery && setQuery(cachedQuery)
            setLocalStore(localStore)
        }

        init()
    }, [])

    async function onEditorChange(query: string | null, selection: [number, number] | null) {
        if (query != null) {
            await localStore?.set(LOCAL_STORE_QUERY_KEY, query)

            setQuery(query)
        }

        if (selection != null) {
            setSelection(selection)
        }
    }

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
        const [start, end] = selection
        const subQuery = start === end
            ? query
            : query.slice(start, end)

        try {
            const res = await sqlStore.exec(subQuery)
            await loadTables()
            setResult(res)
        } catch(err: any) {
            console.error(err)
            setQueryError(err.message)
            setResult(null)
        }
    }

    async function save() {
        await sqlStore.save()
    }

    return (
        <Split>
            <div className='flex flex-col'>
                <ActionBar>
                    <ActionButton
                        id='importCsvButton'
                        label='Import CSV'
                        action={() => setShowImportModal(true)} />
                    <ActionButton
                        id='saveButton'
                        label='Save'
                        action={save} />
                </ActionBar>
                <EntityList
                    tables={tables}
                    sqlStore={sqlStore}
                    onSchemaChange={loadTables} />
                {showImportModal && <Modal>
                    <ImportForm
                        sqlStore={sqlStore}
                        onClose={() => setShowImportModal(false)}
                        onDone={async () => {
                            await loadTables()
                            setShowImportModal(false)
                        }} />
                </Modal>}
            </div>
            <Split orientation={Orientation.Vertical}>
                <div id='editorPane' className='w-full h-full flex flex-col'>
                    <ActionBar>
                        <ActionButton
                            id='runButton'
                            label='Run'
                            action={runQuery} />
                    </ActionBar>
                    <div className='grow overflow-auto'>
                        <CodeEditor
                            value={query}
                            language='sql'
                            placeholder='Your SQL query'
                            onChange={(evn) => onEditorChange(evn.target.value, null)}
                            onSelect={(evn) => onEditorChange(null, [
                                evn.currentTarget.selectionStart,
                                evn.currentTarget.selectionEnd,
                            ])}
                            padding={15}
                            style={{
                                fontSize: 12,
                                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                            }} />
                    </div>
                </div>
                <Spreadsheet data={result} error={queryError} />
            </Split>
        </Split>
    )
}
