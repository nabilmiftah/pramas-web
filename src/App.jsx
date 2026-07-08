import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CekKuotaBeranda from './components/CekKuotaBeranda';
import CekKuota from './components/CekKuota';
import Panduan from './components/Panduan';
import JalurPendakian from './components/JalurPendakian';
import Footer from './components/Footer';

function App() {
  return (
    // Router membungkus seluruh aplikasi agar fitur pindah halaman bisa bekerja
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <CekKuotaBeranda />
              </>
            } />
            <Route path="/cek-kuota" element={<CekKuota />} />
            <Route path="/panduan" element={<Panduan />} />
            <Route path="/jalur" element={<JalurPendakian />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;