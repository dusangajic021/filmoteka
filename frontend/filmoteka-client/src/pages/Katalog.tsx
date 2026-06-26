import { useEffect, useState } from 'react'
import { apiClient } from '../api/apiClient'
import type { Film } from '../types/film'
import { Link } from 'react-router-dom'

// Ovako sada izgleda paket koji nam C# šalje
interface PaginacijaOdgovor {
  filmovi: Film[];
  trenutnaStranica: number;
  ukupnoStranica: number;
  ukupanBrojFilmova: number;
}

export default function Katalog() {
  // Stanja za podatke iz baze
  const [filmovi, setFilmovi] = useState<Film[]>([])
  const [trenutnaStranica, setTrenutnaStranica] = useState(1)
  const [ukupnoStranica, setUkupnoStranica] = useState(1)

  // Stanja za pretragu i filtere
  const [pretraga, setPretraga] = useState('')
  const [godina, setGodina] = useState<number | ''>('')
  const [uBioskopima, setUBioskopima] = useState(false)
  const [zanrId, setZanrId] = useState<number | ''>('')

  // useEffect se sada pali SVAKI PUT kada se promeni pretraga, filter ili stranica
  useEffect(() => {
    apiClient.get<PaginacijaOdgovor>('/filmovi', {
      params: {
        pretraga: pretraga || null,
        godina: godina || null,
        uBioskopima: uBioskopima ? true : null,
        zanrId: zanrId || null,
        stranica: trenutnaStranica,
        poStranici: 2 // Stavio sam 2 filma po stranici da bi ti bilo lakše da testiraš paginaciju!
      }
    })
      .then(response => {
        setFilmovi(response.data.filmovi)
        setUkupnoStranica(response.data.ukupnoStranica)
      })
      .catch(error => console.error("Greška pri povlačenju!", error))
  }, [pretraga, godina, uBioskopima, zanrId, trenutnaStranica]) // <- Ovo omogućava "Live Search"

  return (
    <div>
      <h2>Katalog Filmova</h2>
      <Link to="/dodaj" style={{ display: 'inline-block', marginBottom: '15px', padding: '10px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        + Dodaj novi film
      </Link>

      {/* --- KONTROLNA TABLA ZA FILTERE --- */}
      <div style={{ background: '#f4f4f4', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
        <h4 style={{ marginTop: 0 }}>Pretraga i Filteri</h4>
        
        {/* Live Search */}
        <input 
          type="text" 
          placeholder="Pretraži naslov ili opis..." 
          value={pretraga} 
          onChange={(e) => { setPretraga(e.target.value); setTrenutnaStranica(1); }} 
          style={{ padding: '5px', marginRight: '10px', width: '200px' }}
        />

        {/* Filter po Godini */}
        <input 
          type="number" 
          placeholder="Godina" 
          value={godina} 
          onChange={(e) => { setGodina(e.target.value ? Number(e.target.value) : ''); setTrenutnaStranica(1); }} 
          style={{ padding: '5px', marginRight: '10px', width: '80px' }}
        />

        {/* Filter po Žanru */}
        <select 
          value={zanrId} 
          onChange={(e) => { setZanrId(e.target.value ? Number(e.target.value) : ''); setTrenutnaStranica(1); }}
          style={{ padding: '5px', marginRight: '10px' }}
        >
          <option value="">Svi žanrovi</option>
          <option value="1">Akcija (ID 1)</option>
          <option value="2">Komedija (ID 2)</option>
          <option value="3">Drama (ID 3)</option>
        </select>

        {/* Dostupnost u bioskopu */}
        <label style={{ cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={uBioskopima} 
            onChange={(e) => { setUBioskopima(e.target.checked); setTrenutnaStranica(1); }} 
          />
          Samo u bioskopima
        </label>
      </div>
      
      {/* --- LISTA FILMOVA --- */}
      {filmovi.length === 0 ? (
        <p>Nema filmova koji se poklapaju sa kriterijumima.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filmovi.map(film => (
            <li key={film.id} style={{ background: '#fff', border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
              <strong style={{ fontSize: '18px' }}>{film.naslov}</strong> ({film.godinaIzdanja}.) 
              {film.uBioskopima && <span style={{ background: '#dc3545', color: 'white', padding: '2px 6px', borderRadius: '3px', marginLeft: '10px', fontSize: '12px' }}>U BIOSKOPIMA</span>}
              <p style={{ margin: '5px 0 0 0', color: '#555', fontSize: '14px' }}>{film.opis || "Ovaj film nema dodatni opis."}</p>
            </li>
          ))}
        </ul>
      )}

      {/* --- PAGINACIJA (Dugmići) --- */}
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          disabled={trenutnaStranica === 1} 
          onClick={() => setTrenutnaStranica(trenutnaStranica - 1)}
          style={{ padding: '5px 10px', cursor: trenutnaStranica === 1 ? 'not-allowed' : 'pointer' }}
        >
          ⬅ Prethodna
        </button>
        
        <span style={{ fontWeight: 'bold' }}>Stranica {trenutnaStranica} od {ukupnoStranica === 0 ? 1 : ukupnoStranica}</span>
        
        <button 
          disabled={trenutnaStranica >= ukupnoStranica} 
          onClick={() => setTrenutnaStranica(trenutnaStranica + 1)}
          style={{ padding: '5px 10px', cursor: trenutnaStranica >= ukupnoStranica ? 'not-allowed' : 'pointer' }}
        >
          Sledeća ➡
        </button>
      </div>
    </div>
  )
}