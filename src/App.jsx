import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CekKuotaBeranda from './components/CekKuotaBeranda';
import CekKuota from './components/CekKuota';
import Panduan from './components/Panduan';
import JalurPendakian from './components/JalurPendakian';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
// route dashboard
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPendaki from './components/DashboardPendaki';
import DashboardAdmin from './components/DashboardAdmin';
import Bookings from './components/Bookings';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Konten halaman seperti Hero, Panduan, dll akan dirender di sini */}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={
            <>
              <Hero />
              <CekKuotaBeranda />
            </>
          } />
          <Route path="/cek-kuota" element={<CekKuota />} />
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/jalur" element={<JalurPendakian />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* GRUP 2: Halaman Terlindungi / Dashboard (Hanya menggunakan Sidebar, TANPA Navbar Utama) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPendaki />} />
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;