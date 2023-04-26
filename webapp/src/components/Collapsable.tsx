import { PropsWithChildren, useEffect, useRef, useState } from "react"

interface Props {
  collapsed?: boolean
}

export default function Collapsable({ children, collapsed = false }: PropsWithChildren<Props>) {

  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (collapsed) setHeight(0)
    else {
      let newSize = Array.from(ref.current?.children ?? []).reduce((acc, cur) => acc + (cur as HTMLElement).offsetHeight, 0)
      if (height !== newSize) setHeight(newSize)
    }
  }, [collapsed, children])

  return (
    <div className="overflow-hidden transition-[height] duration-300" ref={ref} style={{ height }}>
      {children}
    </div>
  )
}