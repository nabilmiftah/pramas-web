import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CekKuota from './components/CekKuota';

function App() {
  return (
    // Router membungkus seluruh aplikasi agar fitur pindah halaman bisa bekerja
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        <Navbar />
        
        <main>
          <Routes>
            {/* Halaman Beranda (URL: / ) hanya menampilkan Hero Section */}
            <Route path="/" element={<Hero />} />
            
            {/* Halaman Cek Kuota (URL: /cek-kuota ) menampilkan tabel CekKuota */}
            <Route path="/cek-kuota" element={<CekKuota />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;