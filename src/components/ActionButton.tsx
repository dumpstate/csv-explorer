interface ActionButtonProps {
    readonly label: string
    readonly action: () => any
    readonly disabled?: boolean
}

export default function ActionButton(props: ActionButtonProps) {
    const { disabled, label, action } = props

    return (
        <button
            disabled={typeof disabled === 'boolean' ? disabled : false}
            className='my-0.5 mx-0.5 py-1 px-1 font-medium text-xs hover:bg-neutral-300'
            onClick={action}>
            {label}
        </button>
    )
}
