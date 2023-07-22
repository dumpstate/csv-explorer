import { useState } from "react"
import { parseCsv } from "src/services/csv"
import SqlStore from "src/stores/SqlStore"
import ActionButton from "./ActionButton"

interface ImportFormProps {
	readonly sqlStore: SqlStore
	readonly onClose: () => void
	readonly onDone: () => void
}

function normalize(name: string): string {
	return name
		.split(/\s+/)
		.map((part) => part.replace(/\W/g, "").toLowerCase())
		.join("_")
}

function normalizeEntry(entry: string): string {
	return entry.replace(/"/g, "").trim()
}

export default function ImportForm(props: ImportFormProps) {
	const { sqlStore, onClose, onDone } = props

	const [name, setName] = useState<string>()
	const [file, setFile] = useState<File>()

	function onImport() {
		if (!file) {
			return
		}

		const reader = new FileReader()
		reader.readAsText(file, "utf-8")
		reader.onload = async (evt) => {
			const data = await parseCsv(evt.target?.result as any)
			const header = data[0].map(normalize)

			await sqlStore.exec(`CREATE TABLE ${name} (${header.join(", ")})`)

			data.slice(1).forEach(async (row: string[]) => {
				const values = row
					.map(normalizeEntry)
					.map((entry) => `"${entry}"`)
					.join(", ")
				const stmt = `INSERT INTO ${name} VALUES (${values})`
				try {
					await sqlStore.exec(stmt)
				} catch (_) {}
			})

			onDone()
		}
		reader.onerror = (err) => {
			console.error(err)
			onDone()
		}
	}

	return (
		<div
			id="importForm"
			className="flex flex-col font-light text-sm p-2 space-y-4"
		>
			<div className="flex flex-row w-full space-x-4">
				<span className="self-center">Table name</span>
				<input
					className="grow p-1"
					type="text"
					onChange={(evt) => setName(evt.target.value)}
				/>
			</div>
			<input
				type="file"
				accept=".csv"
				onChange={(evt) => setFile(evt.target.files?.[0])}
			/>
			<div className="flex flex-row justify-center">
				<ActionButton
					id="importForm-importButton"
					disabled={!name || !file}
					label="Import"
					action={onImport}
				/>
				<ActionButton
					id="importForm-cancelButton"
					label="Cancel"
					action={onClose}
				/>
			</div>
		</div>
	)
}
