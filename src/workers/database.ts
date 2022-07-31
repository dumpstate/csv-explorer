import { run } from '@dumpstate/web-worker-proxy'
import initSqlJs, { Database } from 'sql.js'

declare module 'sql.js' {
    interface Database {
        save(): Promise<void>
    }
}

function createCache(name: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = self.indexedDB.open('CSVExplorer', 1)

        req.onerror = (evt) => {
            reject(new Error(`IndexedDB error: ${(evt?.target as any)?.errorCode}`))
        }

        req.onsuccess = (evt) => {
            const db = (evt?.target as any)?.result

            if (!db) {
                reject(new Error('Failed to create IndexedDB'))
            } else {
                resolve(db)
            }
        }

        req.onupgradeneeded = (evt) => {
            const db = (evt?.target as any)?.result

            db.createObjectStore(name)
        }
    })
}

async function cache<T>(name: string) {
    const db = await createCache(name)
    const key = `${name}:1`

    return {
        set(value: T): Promise<void> {
            const store = db
                .transaction(name, 'readwrite')
                .objectStore(name)

            return new Promise<void>((resolve, reject) => {
                const req = store.put(value, key)

                req.onsuccess = () => resolve()
                req.onerror = (evt) => {
                    reject(new Error(`Failed to store: ${(evt?.target as any)?.errorCode}`))
                }
            })
        },

        get(): Promise<T> {
            const store = db
                .transaction(name, 'readonly')
                .objectStore(name)

            return new Promise((resolve, reject) => {
                const req = store.get(key)

                req.onsuccess = (evt) => {
                    resolve(req.result)
                }
                req.onerror = (evt) => {
                    reject(new Error(`Failed to get the sqlite: ${(evt?.target as any)?.errorCode}`))
                }
            })
        },
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
