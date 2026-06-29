import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Katalog from './pages/Katalog'
import DodajFilm from './pages/DodajFilm'
import Bioskop from './pages/Bioskop'

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Navigacioni meni na vrhu sajta */}
        <nav style={{ display: 'flex', gap: '15px', background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>🎬 Katalog Filmova</Link>
          <Link to="/bioskop" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>🍿 Bioskop & Rezervacije</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<Katalog />} />
          <Route path="/dodaj" element={<DodajFilm />} />
          <Route path="/bioskop" element={<Bioskop />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App