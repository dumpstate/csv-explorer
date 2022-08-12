interface ActionButtonProps {
    readonly label: string
    readonly action: () => any
}

export default function ActionButton(props: ActionButtonProps) {
    const { label, action } = props

    return (
        <button
            className='my-0.5 mx-0.5 py-1 px-1 font-medium text-xs hover:bg-neutral-300'
            onClick={action}>
            {label}
        </button>
    )
}
