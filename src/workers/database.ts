import { run } from '@dumpstate/web-worker-proxy'
import initSqlJs, { Database } from 'sql.js'

async function createDatabase(): Promise<Database> {
    try {
        const SQL = await initSqlJs({
            locateFile: (_: string, __: string) => '../wasm/sql-wasm.wasm',
        })

        return new SQL.Database()
    } catch (err) {
        throw new Error(`Failed to initialize SQL.js: ${err}`)
    }
}

run(createDatabase)
