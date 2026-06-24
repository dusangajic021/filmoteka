import { useState } from 'react'
import { apiClient } from '../api/apiClient'
import { useNavigate, Link } from 'react-router-dom'

export default function DodajFilm() {
  const [naslov, setNaslov] = useState('')
  const [godina, setGodina] = useState(2024)
  const navigate = useNavigate() // Služi nas da nas automatski prebaci nazad nakon čuvanja

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // Sprečava osvežavanje cele stranice
    
    // Šaljemo onaj isti JSON koji smo slali kroz Swagger malopre
    apiClient.post('/filmovi', {
      naslov: naslov,
      godinaIzdanja: godina,
      zanr: { naziv: "Zanr iz Reacta" } 
    })
    .then(() => {
      navigate('/') // Vraćamo se na početnu stranu kada API kaže OK
    })
    .catch(error => console.error("Desila se greška", error))
  }

  return (
    <div>
      <h2>Dodaj novi film</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Naslov: </label>
          <input type="text" value={naslov} onChange={(e) => setNaslov(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Godina: </label>
          <input type="number" value={godina} onChange={(e) => setGodina(Number(e.target.value))} required />
        </div>
        <button type="submit" style={{ padding: '5px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Sačuvaj u bazu
        </button>
      </form>
      <br />
      <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>⬅ Nazad na katalog</Link>
    </div>
  )
}