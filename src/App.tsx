import Split, { Orientation } from './components/Split'
import SqlStore from './stores/SqlStore'
import NavigationPane from './components/NavigationPane'

interface AppProps {
    readonly sqlStore: SqlStore
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

    return (
        <Split>
            <NavigationPane sqlStore={props.sqlStore} />
            <Split orientation={Orientation.Vertical}>
                <div>SQL Editor Pane</div>
                <div>Result Pane</div>
            </Split>
        </Split>
    )
}
