import React from 'react'
import Logo from './logo.svg'
import { useNavigate } from 'react-router-dom'

const Home = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()

  const onButtonClick = () => {
    if (loggedIn) {
      localStorage.removeItem('token')
      props.setLoggedIn(false)
      props.setEmail('')
    }
    navigate('/login')
  }

  return (
    <div className="mainContainer">
        <div className="logoContainer">
            <img className="logo" src={Logo} width={250} height={250}/>
        </div>
      <div className={'titleContainer'}>
        <div>Bienvenue !</div>
      </div>
      <div>Connectez vous pour proposer des musiques :)</div>
      <div className={'buttonContainer'}>
        <input
          className={'inputButton'}
          type="button"
          onClick={onButtonClick}
          value={loggedIn ? 'Connexion' : 'Deconnexion'}
        />
        {loggedIn ? <div>Your email address is {email}</div> : <div />}
      </div>
    </div>
  )
}

export default Home