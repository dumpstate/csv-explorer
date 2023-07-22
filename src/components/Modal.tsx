import { ReactNode } from "react"

interface ModalProps {
	readonly children: ReactNode
}

export default function Modal(props: ModalProps) {
	return (
		<div className="w-full h-full fixed z-10 left-0 top-0 overflow-auto bg-neutral-400/60">
			<div className="bg-slate-50 mt-[5%] m-auto p-3 border w-1/3">
				{props.children}
			</div>
		</div>
	)
}
