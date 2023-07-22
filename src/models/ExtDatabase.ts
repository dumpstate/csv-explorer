import { Database } from "sql.js"

export interface ExtDatabase extends Database {
	save: () => Promise<void>
}
