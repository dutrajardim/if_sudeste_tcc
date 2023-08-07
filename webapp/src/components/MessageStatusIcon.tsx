import { ArrowUpOnSquareIcon, CheckIcon } from "@heroicons/react/20/solid"

interface Props {
  status?: string
}

export default function ({ status }: Props): JSX.Element {

  return (
    <>
      {
        {
          'sent': <ArrowUpOnSquareIcon className="h-4 w-4 text-slate-500" />,
          'delivered': <CheckIcon className="h-4 w-4 text-slate-400" />,
          'read': <CheckIcon className="h-4 w-4 text-blue-500" />,
        }[status ?? '']
      }
    </>
  )
}