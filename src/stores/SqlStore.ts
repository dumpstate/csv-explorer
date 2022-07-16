import { ProxyType, workerProxy } from '@dumpstate/web-worker-proxy'
import { Database } from 'sql.js'

export default class SqlStore {

    private proxy: Promise<ProxyType<Database>>

    constructor(dbWorkerScript: string) {
        this.proxy = workerProxy<Database>(dbWorkerScript)
    }

    public async getAllTables(): Promise<string[]> {
        const db = await this.proxy

        await db.exec('create table if not exists foo(id integer primary key)')

        const tables = await db.exec(`
            select name
            from sqlite_schema
            where type = 'table' and
                  name not like 'sqlite_%'
        `)

        return tables.map(({ values }) => values[0].toString())
    }
}
