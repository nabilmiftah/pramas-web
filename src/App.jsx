import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FasilitasBeranda from './components/FasilitasBeranda';
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
import QuotaManagement from './components/QuotaManagement';
import CekKuotaPendaki from './components/CekKuotaPendaki';
import Registration from './components/Registration';
import BookingDetail from './components/BookingDetail';
import BookingPayment from './components/BookingPayment';

// --- KOMPONEN PUBLIC LAYOUT ---
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

// --- KOMPONEN PROTECTED ROUTE (Sistem Keamanan Akses URL) ---
const ProtectedRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem('role');

  // 1. Jika belum login, tendang ke halaman login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // 2. Jika role tidak sesuai izin (misal pendaki memaksa masuk URL /admin)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Arahkan kembali ke dashboard masing-masing
    return <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  // 3. Jika aman, izinkan masuk ke komponen
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* GRUP 1: Halaman Publik (Bisa diakses siapa saja) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<><Hero /><FasilitasBeranda /></>} />
          <Route path="/cek-kuota" element={<CekKuota />} />
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/jalur" element={<JalurPendakian />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* GRUP 2: Halaman Terlindungi / Dashboard */}
        <Route element={<DashboardLayout />}>
          
          {/* Rute Khusus Pendaki ('pendaki') */}
          <Route element={<ProtectedRoute allowedRoles={['pendaki']} />}>
            <Route path="/dashboard" element={<DashboardPendaki />} />
            {/* Pindahkan /quota ke sini agar bisa diakses Pendaki */}
            <Route path="/quota" element={<QuotaManagement />} />
          </Route>

          {/* Rute Khusus Admin ('admin') */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            {/* Pindahkan /jadwal-kuota ke sini agar khusus untuk Admin */}
            <Route path="/jadwal-kuota" element={<CekKuotaPendaki />} />
          </Route>

          {/* Rute Bersama (Bisa diakses Admin & Pendaki) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'pendaki']} />}>
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/booking-detail/:id" element={<BookingDetail />} />
            <Route path="/pembayaran/:id" element={<BookingPayment />} />
          </Route>

        </Route>

        {/* GRUP 3: Halaman Registrasi (Hanya untuk Pendaki) */}
        <Route element={<ProtectedRoute allowedRoles={['pendaki']} />}>
          <Route path="/registration" element={<Registration />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;