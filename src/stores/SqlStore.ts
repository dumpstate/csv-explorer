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

    public async getColumns(table: string): Promise<string[]> {
        const db = await this.proxy
        const res = await db.exec(`pragma table_info(${table})`)

        return res.flatMap(({ values }) =>
            values.map(entry => `${entry[1]} (${entry[2]})`))
    }

    public async exec(stmt: string): Promise<QueryExecResult[]> {
        const db = await this.proxy

        return db.exec(stmt)
    }
}
