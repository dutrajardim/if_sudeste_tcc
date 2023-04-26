type Props = {
  loading: boolean
}

export default function LoadingBar({ loading = false }: Props) {

  return (
    <div className={`absolute top-0 left-0 w-screen h-[7px] bg-gradient-to-r from-primary via-white to-secondary loading-bar-animate ${loading ? 'block' : 'hidden'}`} />
  )
}