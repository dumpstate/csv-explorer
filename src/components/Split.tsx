import { MouseEvent, ReactNode, useRef } from 'react'

export enum Orientation {
    Horizontal,
    Vertical,
}

interface SplitProps {
    readonly orientation: Orientation
    readonly children: ReactNode[]
}

export default function Split(props: SplitProps) {
    if (props.children.length != 2) {
        throw new Error('Exactly two children required for Split')
    }

    const gutter = useRef<HTMLDivElement>(null)
    const leftPane = useRef<HTMLDivElement>(null)
    const rightPane = useRef<HTMLDivElement>(null)

    function gutterOnMouseDown(mouseDownEvt: MouseEvent<HTMLDivElement, globalThis.MouseEvent>): void {
        const offsetLeft = gutter.current?.offsetLeft || 0
        const leftWidth = leftPane.current?.offsetWidth || 0
        const rightWidth = rightPane.current?.offsetWidth || 0

        document.onmousemove = (evt: globalThis.MouseEvent) => {
            const dx = Math.min(
                Math.max(evt.clientX - mouseDownEvt.clientX, -leftWidth),
                rightWidth,
            )

            if (gutter.current) {
                gutter.current.style.left = `${offsetLeft + dx}px`
            }
            if (leftPane.current) {
                leftPane.current.style.width = `${leftWidth + dx}px`
            }
            if (rightPane.current) {
                rightPane.current.style.width = `${rightWidth - dx}px`
            }
        }

        document.onmouseup = () => {
            document.onmousemove = document.onmouseup = null
        }
    }

    return (
        <div className='w-full h-full flex'>
            <div
                ref={leftPane}
                className='w-1/5 h-full min-w-[100px] bg-neutral-100'>
                {props.children[0]}
            </div>
            <div
                ref={gutter}
                className='w-1 h-full cursor-col-resize bg-neutral-200 select-none'
                onMouseDown={gutterOnMouseDown}></div>
            <div 
                ref={rightPane}
                className='w-4/5 h-full min-w-[100px] bg-neutral-50'>
                {props.children[1]}
            </div>
        </div>
    )
}
