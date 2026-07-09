import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi kecil untuk mengecek apakah menu sedang aktif (di-klik)
  const isAktif = (path) => {
    return location.pathname.includes(path);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    
    localStorage.removeItem('role');
    localStorage.removeItem('userNama');
    
    navigate('/login');
  };
  return (
    <div className="flex h-screen bg-[#f9fafc] font-sans">
      
      {/* Sidebar (Sisi Kiri) */}
      <aside className="w-64 bg-[#fbfcfc] border-r border-gray-200 flex flex-col justify-between hidden md:flex">
        
        {/* Bagian Atas Sidebar */}
        <div>
          {/* Logo PRAMAS */}
          <div className="px-6 pt-8 pb-6">
            <h1 className="text-2xl font-bold text-[#0f291e] tracking-tight">PRAMAS</h1>
            <p className="text-xs text-gray-500 font-medium">Mountain Management</p>
          </div>

          {/* Tombol Aksi Utama */}
          <div className="px-6 mb-6">
            <button className="w-full bg-[#0f291e] hover:bg-emerald-900 text-white text-sm font-semibold py-2.5 px-4 rounded-md transition duration-300 flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Registration
            </button>
          </div>

          {/* Menu Navigasi Utama */}
          <nav className="px-4 space-y-1">
            <Link 
              to="/dashboard" 
              className={`flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                isAktif('/dashboard') ? 'bg-[#b8f2c3] text-[#0f291e]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Dashboard
            </Link>

            <Link 
              to="/bookings" 
              className={`flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                isAktif('/bookings') ? 'bg-[#b8f2c3] text-[#0f291e]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
              Bookings
            </Link>

            <Link 
              to="/quota" 
              className={`flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                isAktif('/quota') ? 'bg-[#b8f2c3] text-[#0f291e]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Quota Management
            </Link>

            {/* Menu Hiker Tracking dinonaktifkan sementara sesuai permintaan */}
            {/* 
            <Link to="/tracking" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Hiker Tracking
            </Link>
            */}
          </nav>
        </div>

        {/* Bagian Bawah Sidebar (Footer Nav) */}
        <div className="p-4 border-t border-gray-200">
          <nav className="space-y-1">
            <Link to="/help" className="flex items-center px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Help Center
            </Link>
            <Link to="/settings" className="flex items-center px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Settings
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors mt-2"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Area Konten Utama (Ruang Kosong untuk Dashboard Pendaki/Admin) */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12">
        {/* <Outlet /> adalah tempat komponen halaman aktual (Dashboard Pendaki atau Admin) akan disisipkan */}
        <Outlet /> 
      </main>

    </div>
  );
};

export default DashboardLayout;