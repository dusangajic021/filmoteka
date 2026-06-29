import { useEffect, useState } from 'react'
import { apiClient } from '../api/apiClient'

// Interfejsi da TypeScript zna sa čim radimo
interface Sala { id: number; naziv: string; kapacitet: number; tip: string; }
interface Film { id: number; naslov: string; }
interface Projekcija { id: number; film: string; sala: string; vremePocetka: string; vremeZavrsetka: string; dostupnoMesta: number; }

export default function Bioskop() {
  const [uloga, setUloga] = useState<'Korisnik' | 'Zaposleni' | 'Admin'>('Korisnik')
  
  // Podaci iz baze
  const [sale, setSale] = useState<Sala[]>([])
  const [filmovi, setFilmovi] = useState<Film[]>([])
  const [projekcije, setProjekcije] = useState<Projekcija[]>([])

  // Stanja za Admin formu (Sale)
  const [nazivSale, setNazivSale] = useState('')
  const [kapacitet, setKapacitet] = useState(50)
  const [tipSale, setTipSale] = useState('Standard')

  // Stanja za Zaposleni formu (Projekcije)
  const [odabranFilm, setOdabranFilm] = useState('')
  const [odabranaSala, setOdabranaSala] = useState('')
  const [vremePocetka, setVremePocetka] = useState('')
  const [vremeZavrsetka, setVremeZavrsetka] = useState('')

  // Stanja za Korisnika (Rezervacije)
  const [imeKorisnika, setImeKorisnika] = useState('')

  // Povlačenje podataka sa servera
  const ucitajPodatke = () => {
    apiClient.get('/sale').then(res => setSale(res.data)).catch(console.error)
    apiClient.get('/filmovi').then(res => setFilmovi(res.data.filmovi || res.data)).catch(console.error)
    apiClient.get('/projekcije/dostupne').then(res => setProjekcije(res.data)).catch(console.error)
  }

  useEffect(() => { ucitajPodatke() }, [uloga])

  // ================= FUNKCIJE ZA SLANJE =================
  const kreirajSalu = (e: React.FormEvent) => {
    e.preventDefault()
    apiClient.post('/sale', { naziv: nazivSale, kapacitet, tip: tipSale })
      .then(() => { alert('Sala uspešno kreirana!'); ucitajPodatke(); })
      .catch(err => alert(err.response?.data || 'Greška pri kreiranju sale.'))
  }

  const kreirajProjekciju = (e: React.FormEvent) => {
    e.preventDefault()
    apiClient.post('/projekcije', { 
      filmId: Number(odabranFilm), 
      salaId: Number(odabranaSala), 
      vremePocetka, 
      vremeZavrsetka 
    })
      .then(() => { alert('Projekcija uspešno zakazana!'); ucitajPodatke(); })
      .catch(err => alert(err.response?.data || 'Greška!'))
  }

  const rezervisiKartu = (projekcijaId: number) => {
    if (!imeKorisnika) return alert('Molimo unesite Vaše ime za rezervaciju!')
    apiClient.post('/rezervacije', { imeKorisnika, projekcijaId })
      .then(res => { alert(res.data.poruka); ucitajPodatke(); })
      .catch(err => alert(err.response?.data || 'Greška pri rezervaciji!'))
  }

  // ================= IZGLED STRANICE =================
  return (
    <div>
      <h2>🍿 Bioskop - Kontrolni Centar</h2>
      
      {/* SIMULATOR ULOGA */}
      <div style={{ padding: '10px', background: '#333', color: 'white', borderRadius: '5px', marginBottom: '20px' }}>
        <strong>Simulacija uloge: </strong>
        <select value={uloga} onChange={(e) => setUloga(e.target.value as any)} style={{ marginLeft: '10px', padding: '5px' }}>
          <option value="Korisnik">Korisnik (Kupovina karata)</option>
          <option value="Zaposleni">Zaposleni (Zakazivanje projekcija)</option>
          <option value="Admin">Administrator (Upravljanje salama)</option>
        </select>
      </div>

      {/* 1. ADMIN PANEL */}
      {uloga === 'Admin' && (
        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '5px' }}>
          <h3>Kreiranje nove sale</h3>
          <form onSubmit={kreirajSalu}>
            <input type="text" placeholder="Naziv sale" value={nazivSale} onChange={e => setNazivSale(e.target.value)} required style={{ marginRight: '10px' }}/>
            <input type="number" placeholder="Kapacitet" value={kapacitet} onChange={e => setKapacitet(Number(e.target.value))} required style={{ marginRight: '10px', width: '80px' }}/>
            <select value={tipSale} onChange={e => setTipSale(e.target.value)} style={{ marginRight: '10px' }}>
              <option>Standard</option>
              <option>3D</option>
              <option>IMAX</option>
            </select>
            <button type="submit">Dodaj salu</button>
          </form>
          <br/>
          <strong>Postojeće sale:</strong>
          <ul>{sale.map(s => <li key={s.id}>{s.naziv} ({s.kapacitet} mesta) - {s.tip}</li>)}</ul>
        </div>
      )}

      {/* 2. ZAPOSLENI PANEL */}
      {uloga === 'Zaposleni' && (
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '5px' }}>
          <h3>Zakazivanje projekcije</h3>
          <form onSubmit={kreirajProjekciju}>
            <select value={odabranFilm} onChange={e => setOdabranFilm(e.target.value)} required style={{ marginRight: '10px' }}>
              <option value="">-- Izaberi film --</option>
              {filmovi.map(f => <option key={f.id} value={f.id}>{f.naslov}</option>)}
            </select>
            
            <select value={odabranaSala} onChange={e => setOdabranaSala(e.target.value)} required style={{ marginRight: '10px' }}>
              <option value="">-- Izaberi salu --</option>
              {sale.map(s => <option key={s.id} value={s.id}>{s.naziv}</option>)}
            </select>

            <br/><br/>
            Početak: <input type="datetime-local" value={vremePocetka} onChange={e => setVremePocetka(e.target.value)} required style={{ marginRight: '10px' }}/>
            Kraj: <input type="datetime-local" value={vremeZavrsetka} onChange={e => setVremeZavrsetka(e.target.value)} required style={{ marginRight: '10px' }}/>
            
            <button type="submit">Zakaži projekciju</button>
          </form>
        </div>
      )}

      {/* 3. KORISNIK PANEL */}
      {uloga === 'Korisnik' && (
        <div style={{ background: '#d4edda', padding: '15px', borderRadius: '5px' }}>
          <h3>Dostupne projekcije</h3>
          <div style={{ marginBottom: '15px' }}>
            <label><strong>Tvoje ime (za rezervaciju): </strong></label>
            <input type="text" value={imeKorisnika} onChange={e => setImeKorisnika(e.target.value)} placeholder="Npr. Petar Petrović" />
          </div>

          {projekcije.length === 0 ? <p>Trenutno nema dostupnih projekcija.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {projekcije.map(p => (
                <li key={p.id} style={{ background: '#fff', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                  <strong>🎬 {p.film}</strong> | Sala: {p.sala} <br/>
                  🕒 Od {new Date(p.vremePocetka).toLocaleString()} do {new Date(p.vremeZavrsetka).toLocaleString()} <br/>
                  🎟️ Slobodno mesta: <strong>{p.dostupnoMesta}</strong>
                  <br/><br/>
                  <button onClick={() => rezervisiKartu(p.id)} style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                    Rezerviši kartu
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}