import { useEffect, useState } from 'react'
import { apiClient } from '../api/apiClient'
import type { Film } from '../types/film'
import { Link } from 'react-router-dom'

export default function Katalog() {
  const [filmovi, setFilmovi] = useState<Film[]>([])

  useEffect(() => {
    apiClient.get<Film[]>('/filmovi')
      .then(response => setFilmovi(response.data))
      .catch(error => console.error("Greška!", error))
  }, [])

  return (
    <div>
      <h2>Katalog Filmova</h2>
      {/* Ovo Link dugme menja klasičan <a> tag da se stranica ne bi refrešovala */}
      <Link to="/dodaj" style={{ display: 'inline-block', marginBottom: '15px', padding: '10px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        + Dodaj novi film
      </Link>
      
      {filmovi.length === 0 ? (
        <p>Trenutno nema filmova u bazi.</p>
      ) : (
        <ul>
          {filmovi.map(film => (
            <li key={film.id} style={{ marginBottom: '10px' }}>
              <strong>{film.naslov}</strong> ({film.godinaIzdanja}.)
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}