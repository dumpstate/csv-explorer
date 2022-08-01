import { run } from '@dumpstate/web-worker-proxy'
import initSqlJs, { Database } from 'sql.js'
import { cache } from '../services/cache'

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
        const sqliteCache = await cache<Uint8Array>('sqlite')
        const data = await sqliteCache.get()

        SQL.Database.prototype.save = async function () {
            return sqliteCache.set(this.export())
        }

        return new SQL.Database(data)
    } catch (err) {
        throw new Error(`Failed to initialize SQL.js: ${err}`)
    }
}

run(createDatabase)
