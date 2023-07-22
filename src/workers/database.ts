import { KVStore } from "@dumpstate/ixdb-kv-store"
import { run } from "@dumpstate/web-worker-proxy"
import initSqlJs from "sql.js"
import { LOCAL_STORE_NAME, LOCAL_STORE_SQLITE_KEY } from "../constants"
import { ExtDatabase } from "../models/ExtDatabase"

async function createDatabase(): Promise<ExtDatabase> {
	try {
		const SQL = await initSqlJs({
			locateFile: (_: string, __: string) => "../wasm/sql-wasm.wasm",
		})
		const localStore = await KVStore.tryCreate(LOCAL_STORE_NAME)
		const data = await localStore?.get<Uint8Array>(LOCAL_STORE_SQLITE_KEY)

		class _Database extends SQL.Database {
			async save(): Promise<void> {
				return localStore?.set(LOCAL_STORE_SQLITE_KEY, this.export())
			}
		}

		return new _Database(data)
	} catch (err) {
		throw new Error(`Failed to initialize SQL.js: ${err}`)
	}
}

run(createDatabase)
