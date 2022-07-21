import { ReactNode } from 'react'

interface ModalProps {
    readonly children: ReactNode
    readonly show: boolean
    readonly close: () => void
}

export default function Modal(props: ModalProps) {
    if (!props.show) {
        return null
    }

    return (
        <div
            className='w-full h-full fixed z-10 left-0 top-0 overflow-auto bg-gray-400/60'>

            <div
                className='bg-slate-50 mt-[5%] m-auto p-3 border border-solid border-black w-1/2'>
                <span
                    className='float-right font-bold text-2xl cursor-pointer'
                    onClick={props.close}>&times;</span>
                <p>{props.children}</p>
            </div>
        </div>
    )
}
