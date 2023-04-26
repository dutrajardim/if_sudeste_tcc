import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LoadingBar from "../../components/LoadingBar"
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks"
import { completeNewPasswordChallenge, getUser, selectChallengeName, selectLoggedInUser, selectLoginError, selectLoginPending, selectRequiredAttributes, signIn } from "./userSlice"

export default function LoginPage() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [name, setName] = useState("")
  const [telephone, setTelephone] = useState("")

  const loginPending = useAppSelector(selectLoginPending)
  const challengeName = useAppSelector(selectChallengeName)
  const requiredAttributes = useAppSelector(selectRequiredAttributes)
  const loginError = useAppSelector(selectLoginError)
  const loggedInUser = useAppSelector(selectLoggedInUser)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loggedInUser)
      dispatch(getUser())
  }, [])

  useEffect(() => {
    if (loginError) {
      console.log(loginError)
      alert(loginError.message)
    }
  }, [loginError])

  useEffect(() => {
    if (loggedInUser)
      navigate("/assistances")
  }, [loggedInUser])

  // help configure on change handler based in an given react state setter
  const changeHandler = (setter: React.Dispatch<React.SetStateAction<string>>) => ({ target }: React.ChangeEvent<HTMLInputElement>) => setter(target?.value || "")

  const isNewPasswordRequired = challengeName === "NEW_PASSWORD_REQUIRED"

  // try to sign in to cognito
  const signInHandler = () => {
    if (!(username && password)) {
      alert("As credenciais são necessárias para prosseguir.")
      return
    }

    dispatch(signIn({ username, password }))
  }

  // try to complete cognito new password chanllenge (this occurs in first login when users are required to change password)
  const completeNewPasswordHandler = async () => {
    // creating empty object for required attributes
    const requiredAttributesArg: Record<string, string> = {}

    // checking if name attribute is required and saving it if true
    if ('name' in requiredAttributes)
      requiredAttributesArg.name = name

    // checking if phone_number attribute is required and saving it if true
    if ('phone_number' in requiredAttributes)
      requiredAttributesArg.phone_number = telephone

    // verifying if any of required attributes is empty
    if (Object.keys(requiredAttributesArg).find(key => !requiredAttributesArg[key])) {
      alert("Todos os campos complementares são obrigatários")
      return
    }

    // verifying if password is empty
    if (!newPassword) {
      alert("O campo nova senha é obrigatório")
      return
    }

    dispatch(completeNewPasswordChallenge({ newPassword, requiredAttributes: requiredAttributesArg }))
  }

  return (
    <section className="h-screen">

      <LoadingBar loading={loginPending} />

      <div className="container h-full px-6 py-24 mx-auto">
        <div className="flex h-full flex-wrap items-center gap-6 justify-center lg:justify-between">

          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
            <img src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="w-full max-w-md-[400px] max-w-[600px]" alt="Phone image" />
          </div>


          <div className="w-full md:w-8/12 lg:ml-6 lg:w-5/12">

            {!isNewPasswordRequired ? (

              <form onSubmit={e => e.preventDefault()}>

                <div className="form-edit mb-6">
                  <input type="text" className="peer form-edit__input" placeholder="Email address" value={username} onChange={changeHandler(setUsername)} />
                  <label className="form-edit__label">Email</label>
                </div>


                <div className="form-edit mb-6">
                  <input type="password" className="peer form-edit__input" placeholder="Password" autoComplete="on" value={password} onChange={changeHandler(setPassword)} />
                  <label className="form-edit__label">Senha</label>
                </div>

                <div className="my-6 flex items-center justify-end">
                  <a href="#!" className="text-primary hover:text-blue-900">Esqueceu?</a>
                </div>

                <button type="submit" className="button--primary w-full" onClick={signInHandler} disabled={loginPending} >
                  Entrar
                </button>

              </form>

            ) : (

              <form onSubmit={e => e.preventDefault()}>

                {('name' in requiredAttributes) && (
                  <div className="form-edit mb-6">
                    <input type="text" className="form-edit__input peer" placeholder="Name" autoComplete="on" value={name} onChange={changeHandler(setName)} />
                    <label className="form-edit__label">Nome</label>
                  </div>
                )}

                {('phone_number' in requiredAttributes) && (
                  <div className="form-edit mb-6">
                    <input type="text" className="form-edit__input peer" placeholder="Telephone" autoComplete="on" value={telephone} onChange={changeHandler(setTelephone)} />
                    <label className="form-edit__label">Telefone</label>
                  </div>
                )}

                <div className="form-edit mb-6">
                  <input type="password" className="form-edit__input peer" placeholder="New Password" autoComplete="on" value={newPassword} onChange={changeHandler(setNewPassword)} />
                  <label className="form-edit__label">Nova senha</label>
                </div>

                <button type="submit" className="button--primary w-full" onClick={completeNewPasswordHandler} disabled={loginPending} >
                  Salvar
                </button>

              </form>

            )}
          </div>
        </div>
      </div>
    </section>
  )
}