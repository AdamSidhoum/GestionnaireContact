import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    axios.post("https://gestionnairecontact-2.onrender.com/auth/login", { email, password })
      .then(res => {
        console.log("res data token = ", res.data.token);
        console.log("res data  = ", res.data);
        localStorage.setItem("token", res.data.token) 
        navigate("/Contact") 
      })
      .catch(err => {
        console.error(err)
        setError("Email ou mot de passe incorrect")
      })
  }

  return (
    <div>
      <h2 style={{ margin: "10px" }}>Connexion</h2>
      <form onSubmit={handleSubmit} style={{ margin: "10px" }}>
        <div>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email"  
            onChange={(e)=> setEmail(e.target.value)} 
            required
          />
        </div>

        <div>
          <label htmlFor="password">Mot de passe</label>
          <input 
            type="password" 
            name="password"  
            onChange={(e)=> setPassword(e.target.value)} 
            required
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Se connecter</button>
        <br></br>
        Vous n'avez pas encore de compte ?
        <button onClick={() =>  navigate('/Signup')} style={{ margin: "10px" }}>S'inscrire</button>
      </form>
    </div>
  )
}