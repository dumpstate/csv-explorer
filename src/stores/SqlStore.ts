import { ProxyType, workerProxy } from '@dumpstate/web-worker-proxy'
import { string } from 'prop-types'
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

    public async getAllRows(table: string): Promise<[string[], any[]]> {
        const db = await this.proxy
        const res = await db.exec(`select * from ${table}`)

        if (!res || res.length === 0) {
            return [[], []]
        }

        const columns = res[0].columns
        const data: any[] = columns
            .reduce((acc: any, col: string, cix: number) => {
                res[0].values.forEach((row, rix) => {
                    acc[rix][col] = row[cix]
                })

                return acc
            }, res[0].values.map(() => ({})))

        return [columns, data]
    }

    public async exec(stmt: string): Promise<QueryExecResult[]> {
        const db = await this.proxy

        return db.exec(stmt)
    }
}
