interface CodeEditorProps {
    readonly onChange: (stmt: string) => void
}

export default function CodeEditor(props: CodeEditorProps) {
    const { onChange } = props

    return (
        <textarea onChange={e => onChange(e.target.value)}></textarea>
    )
}
