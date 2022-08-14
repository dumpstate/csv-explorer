import { KVStore } from '@dumpstate/ixdb-kv-store'
import { run } from '@dumpstate/web-worker-proxy'
import initSqlJs, { Database } from 'sql.js'
import { LOCAL_STORE_NAME, LOCAL_STORE_SQLITE_KEY } from '../constants'

declare module 'sql.js' {
    interface Database {
        save(): Promise<void>
    }
}

async function createDatabase(): Promise<Database> {
    try {
        const SQL = await initSqlJs({
            locateFile: (_: string, __: string) => '../wasm/sql-wasm.wasm',
        })
        const localStore = await KVStore.create(LOCAL_STORE_NAME)
        const data = await localStore.get<Uint8Array>(LOCAL_STORE_SQLITE_KEY)

        SQL.Database.prototype.save = async function () {
            return localStore.set(LOCAL_STORE_SQLITE_KEY, this.export())
        }

        return new SQL.Database(data)
    } catch (err) {
        throw new Error(`Failed to initialize SQL.js: ${err}`)
    }
}

run(createDatabase)
