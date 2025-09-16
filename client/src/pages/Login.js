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

    axios.post("http://localhost:3000/auth/login", { email, password })
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
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
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
        <button onClick={() =>  navigate('/Signup')}>S'inscrire</button>
      </form>
    </div>
  )
}