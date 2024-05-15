import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    // Set initial error values to empty
    setEmailError('')
    setPasswordError('')
  
    // Check if the user has entered both fields correctly
    if ('' === email) {
      setEmailError('Merci de rentrer votre adresse email')
      return
    }
  
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Merci de rentrer une adresse email valide')
      return
    }
  
    if ('' === password) {
      setPasswordError('Merci de rentrer votre mot de passe')
      return
    }
  
    if (password.length < 7) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
  
    // Authentication calls will be made here...
  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Connexion</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Entrez votre email ici"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Entrez votre mot de passe ici"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Connexion'} />
      </div>
    </div>
  )
}

export default Login