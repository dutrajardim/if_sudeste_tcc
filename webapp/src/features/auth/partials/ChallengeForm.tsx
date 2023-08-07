import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHooks"
import { selectChallengeRequiredAttributes, selectSignInState } from "../authSlice"
import { completeNewPasswordChallenge } from "../asyncThunks"

// help configure on change handler based in an given react state setter
const changeHandler = (setter: React.Dispatch<React.SetStateAction<string>>) => ({ target }: React.ChangeEvent<HTMLInputElement>) => setter(target?.value || "")

export default function ChallegeForm() {

  const [newPassword, setNewPassword] = useState("")
  const [name, setName] = useState("")
  const [telephone, setTelephone] = useState("")
  const [email, setEmail] = useState("")

  const requiredAttributes = useAppSelector(selectChallengeRequiredAttributes)
  const sigInState = useAppSelector(selectSignInState)
  const dispatch = useAppDispatch()

  // try to complete cognito new password chanllenge (this occurs in first login when users are required to change password)
  const completeNewPasswordHandler = async () =>
    dispatch(completeNewPasswordChallenge({
      requiredAttributes: { name, 'phone_number': telephone },
      newPassword,
    }))

  return (
    <form onSubmit={e => e.preventDefault()}>

      {(requiredAttributes.includes('name')) && (
        <div className="text-edit mb-6">
          <input type="text" placeholder="Name" autoComplete="on" value={name} onChange={changeHandler(setName)} />
          <label>Nome</label>
        </div>
      )}

      {(requiredAttributes.includes('phone_number')) && (
        <div className="text-edit mb-6">
          <input type="text" placeholder="Telephone" autoComplete="on" value={telephone} onChange={changeHandler(setTelephone)} />
          <label>Telefone</label>
        </div>
      )}

      {(requiredAttributes.includes('email')) && (
        <div className="text-edit mb-6">
          <input type="email" placeholder="Email" autoComplete="on" value={email} onChange={changeHandler(setEmail)} />
          <label>Email</label>
        </div>
      )}

      <div className="text-edit mb-6">
        <input type="password" placeholder="New Password" autoComplete="on" value={newPassword} onChange={changeHandler(setNewPassword)} />
        <label>Nova senha</label>
      </div>

      <button type="submit" className="button button--primary w-full" onClick={completeNewPasswordHandler} disabled={sigInState === 'pending'} >
        Salvar
      </button>

    </form>
  )
}