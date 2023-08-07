type Props = {
  loading: boolean
}

export default function LoadingBar({ loading = false }: Props) {

  return (
    <div className={`loading-bar ${loading && 'loading-bar--active'}`} />
  )
}