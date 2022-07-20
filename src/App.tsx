import CodeEditor from '@uiw/react-textarea-code-editor'

import Split, { Orientation } from './components/Split'
import SqlStore from './stores/SqlStore'
import EntityList from './components/EntityList'
import { useEffect, useState } from 'react'

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
            {onImportCSV && <button onClick={onImportCSV}></button>}
        </div>
    )
}

export default function App(props: AppProps) {
    // const [error, setError] = useState<Error | null>(null)
    // const [file, setFile] = useState<any>(null)
    // const [sqlStore, setSqlStore] = useState<ProxyType<Database> | null>(null)

    // useEffect(() => {
    //     const init = async () => {
    //         const proxy = await workerProxy<Database>('./sqlStore.js')

    //         setSqlStore(proxy)
    //     }

    //     init()
    // }, [])

    // function normalize(name: string): string {
    //     return name
    //         .split(/\s+/)
    //         .map(part => part
    //             .replace(/\W/g, '')
    //             .toLowerCase())
    //         .join('_')
    // }

    // function normalizeEntry(entry: string): string {
    //     return entry
    //         .replace(/"/g, '')
    //         .trim()
    // }

    // const onFileChange = (evt: any) => {
    //     if (!sqlStore) {
    //         throw Error('sql.js not ready')
    //     }

    //     const file = evt.target.files[0]

    //     setFile(file)

    //     const reader = new FileReader()
    //     reader.readAsText(file, 'utf-8')
    //     reader.onload = async (evt: any) => {
    //         parse(evt.target.result, {}, async (err, data) => {
    //             console.log('Got data', data)
    //             const header = data[0]
    //                 .map(normalize)

    //             await sqlStore.run(`CREATE TABLE foo (${header.join(', ')})`)
    //             data.slice(1).forEach(async (row: string[]) => {
    //                 const values = row
    //                     .map(normalizeEntry)
    //                     .map(entry => `"${entry}"`).join(', ')
    //                 const stmt = `INSERT INTO foo VALUES (${values})`
    //                 try {
    //                     await sqlStore.run(stmt)
    //                 } catch(_) {}
    //             })

    //             const content = await sqlStore.exec('SELECT * FROM foo')

    //             console.log(content)
    //         })
    //     }
    //     reader.onerror = (_: any) => {
    //         setError(new Error('error reading file'))
    //     }
    // }

    // if (error) {
    //     return <h4>Error: ${error.toString()}</h4>
    // }

    // if (!sqlStore) {
    //     return <h4>Loading...</h4>
    // }

    // return (
    //     <div>
    //         <h4>sql.js ready!</h4>
    //         <input type="file" accept=".csv" onChange={onFileChange} />
    //     </div>
    // )

    const { sqlStore } = props
    const [query, setQuery] = useState<string>('')
    const [result, setResult] = useState<string>('')
    const [tables, setTables] = useState<string[]>([])

    useEffect(() => {loadTables()}, [])

    async function loadTables() {
        setTables(await sqlStore.getAllTables())
    }

    async function runQuery() {
        try {
            const res = await sqlStore.exec(query)
            await loadTables()
            setResult(JSON.stringify(res, undefined, 2))
        } catch(err: any) {
            console.error(err)
            setResult(err.toString())
        }
    }

    function importCSV() {
        console.log('Import CSV :: not implemented')
    }

    return (
        <Split>
            <div className='flex flex-col'>
                <ActionBar onImportCSV={importCSV} />
                <EntityList tables={tables} />
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
                <pre className='w-full h-full'>{result}</pre>
            </Split>
        </Split>
    )
}
