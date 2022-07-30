import { useState } from 'react'
import { parseCsv } from 'src/services/csv'
import SqlStore from 'src/stores/SqlStore'

interface ImportFormProps {
    readonly sqlStore: SqlStore
    readonly onDone: () => void
}

function normalize(name: string): string {
    return name
        .split(/\s+/)
        .map(part => part
            .replace(/\W/g, '')
            .toLowerCase())
        .join('_')
}

function normalizeEntry(entry: string): string {
    return entry
        .replace(/"/g, '')
        .trim()
}

export default function ImportForm(props: ImportFormProps) {
    const {
        sqlStore,
        onDone,
    } = props

    const [name, setName] = useState<string>()
    const [file, setFile] = useState<File>()

    function onImport() {
        if (!file) {
            return
        }

        const reader = new FileReader()
        reader.readAsText(file, 'utf-8')
        reader.onload = async (evt) => {
            const data = await parseCsv(evt.target?.result as any)
            const header = data[0].map(normalize)

            await sqlStore.exec(`CREATE TABLE ${name} (${header.join(', ')})`)

            data.slice(1).forEach(async (row: string[]) => {
                const values = row
                    .map(normalizeEntry)
                    .map(entry => `"${entry}"`).join(', ')
                const stmt = `INSERT INTO ${name} VALUES (${values})`
                try {
                    await sqlStore.exec(stmt)
                } catch(_) {}
            })

            onDone()
        }
        reader.onerror = (err) => {
            console.error(err)
            onDone()
        }
    }

    return (
        <div className='flex flex-col'>
            <input
                type='text'
                onChange={(evt) => setName(evt.target.value)}/>
            <input
                type='file'
                accept='.csv'
                onChange={(evt) => setFile(evt.target.files?.[0])} />
            <button
                disabled={!name || !file}
                onClick={onImport}>Import</button>
        </div>
    )
}
