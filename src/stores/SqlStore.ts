import { ProxyType, workerProxy } from '@dumpstate/web-worker-proxy'
import { Database, QueryExecResult } from 'sql.js'

export default class SqlStore {

    private proxy: Promise<ProxyType<Database>>

    constructor(dbWorkerScript: string) {
        this.proxy = workerProxy<Database>(dbWorkerScript)
    }

    public async getAllTables(): Promise<string[]> {
        const db = await this.proxy

        await db.exec('create table if not exists foo(id integer primary key)')

        const res = await db.exec(`
            select name
            from sqlite_schema
            where type = 'table' and
                  name not like 'sqlite_%'
        `)

        return res.flatMap(({ values }) =>
            values.map(value => value.toString()))
    }

    public async exec(stmt: string): Promise<QueryExecResult[]> {
        const db = await this.proxy

        return db.exec(stmt)
    }
}
