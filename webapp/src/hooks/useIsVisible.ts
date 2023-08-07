import { RefObject, useEffect, useState } from "react";

/**
 * Thanks for this function in 
 * https://dev.to/jmalvarez/check-if-an-element-is-visible-with-react-hooks-27h8
 */
export default function useIsVisible<T extends Element>(ref: RefObject<T>) {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false)

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    if (ref.current) {
      observer = new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting))

      observer.observe(ref.current)
    }

    return () => { observer && observer.disconnect() }
  }, [ref])

  return isIntersecting
}