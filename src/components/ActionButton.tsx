interface ActionButtonProps {
    readonly id: string
    readonly label: string
    readonly action: () => any
    readonly disabled?: boolean
}

export default function ActionButton(props: ActionButtonProps) {
    const { disabled, id, label, action } = props

    return (
        <button
            id={id}
            disabled={typeof disabled === 'boolean' ? disabled : false}
            className='my-0.5 mx-0.5 py-1 px-1 font-medium text-xs hover:bg-neutral-300'
            onClick={action}>
            {label}
        </button>
    )
}
