import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Katalog from './pages/Katalog'
import DodajFilm from './pages/DodajFilm'

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>🎬 Filmoteka - React SPA</h1>
        <hr />
        
        {/* Ovde Ruter odlučuje koju stranicu da prikaže na osnovu linka u brauzeru */}
        <Routes>
          <Route path="/" element={<Katalog />} />
          <Route path="/dodaj" element={<DodajFilm />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App