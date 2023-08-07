import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks"
import { selectSignInState, } from "../authSlice"
import { signIn } from "../asyncThunks"

// help configure on change handler based in an given react state setter
const changeHandler = (setter: React.Dispatch<React.SetStateAction<string>>) => ({ target }: React.ChangeEvent<HTMLInputElement>) => setter(target?.value || "")

export default function LoginForm() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const signInState = useAppSelector(selectSignInState)
  const dispatch = useAppDispatch()

  // try to sign in to cognito
  const signInHandler = () =>
    dispatch(signIn({ username, password }))

  return (
    <form onSubmit={e => e.preventDefault()}>

      <div className="text-edit mb-6">
        <input type="text" placeholder="Email" value={username} onChange={changeHandler(setUsername)} />
        <label>Email</label>
      </div>


      <div className="text-edit mb-6">
        <input type="password" placeholder="Senha" autoComplete="on" value={password} onChange={changeHandler(setPassword)} />
        <label>Senha</label>
      </div>

      {/* <div className="my-6 flex items-center justify-end">
        <a href="#!" className="text-primary hover:text-blue-900">Esqueceu?</a>
      </div> */}

      <button className="button button--primary w-full" type="submit" onClick={signInHandler} disabled={signInState === 'pending'}>Entrar</button>

    </form>
  )
}