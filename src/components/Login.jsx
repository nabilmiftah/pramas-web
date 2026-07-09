import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lihatSandi, setLihatSandi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pesanError, setPesanError] = useState('');
  const [pesan, setPesan] = useState({ tipe: '', teks: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesan({ tipe: '', teks: '' });

    // Memanggil fungsi login yang baru saja kita perbarui
    const response = await AuthService.login(email, password);

    if (response.success) {
      setPesan({ tipe: 'sukses', teks: `Selamat datang kembali, ${response.nama}! Mengalihkan...` });
      
      // Tunggu 1,5 detik agar pesan sukses terbaca, lalu arahkan berdasarkan ROLE
      setTimeout(() => {
        if (response.role === 'admin') {
          navigate('/admin'); // Lempar ke Dashboard Admin
        } else {
          navigate('/dashboard'); // Lempar ke Dashboard Pendaki
        }
      }, 1500);

    } else {
      setPesan({ tipe: 'error', teks: response.pesan });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] w-full">
      
      {/* Kolom Kiri: Gambar Pemandangan (Disembunyikan di layar HP) */}
      <div 
        className="hidden md:flex w-1/2 relative bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.pexels.com/photos/35725156/pexels-photo-35725156.jpeg')" }}
      >
        {/* Gradient overlay agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-end p-12 lg:p-20 h-full text-white w-full">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Kembali ke Jalur Anda</h1>
          <p className="text-gray-200 text-lg max-w-md leading-relaxed">
            Lanjutkan manajemen pendakian Anda dan pastikan setiap langkah menuju puncak terencana dengan aman bersama PRAMAS.
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Formulir Login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 bg-[#fafafa]">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#0f291e] mb-2">Selamat Datang Kembali</h2>
          <p className="text-gray-500 mb-8 text-sm">Silakan masuk ke akun manajemen pendakian Anda untuk melanjutkan akses.</p>

          {/* Menampilkan pesan error jika login gagal */}
          {pesanError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm border border-red-100">
              {pesanError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Input Kata Sandi */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Kata Sandi</label>
                <a href="#" className="text-xs text-emerald-700 hover:text-emerald-800 font-medium">Lupa Kata Sandi?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input
                  type={lihatSandi ? "text" : "password"}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setLihatSandi(!lihatSandi)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {lihatSandi ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#0f291e] hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700 transition duration-300 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
              {!loading && (
                <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
              )}
            </button>
          </form>

          {/* Link Pendaftaran */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Belum memiliki akun?{' '}
            <Link to="/register" className="font-semibold text-[#0f291e] hover:underline">
              Daftar Sekarang
            </Link>
          </p>

          {/* Trust Badges */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex justify-center space-x-6">
            <div className="flex items-center text-xs font-semibold text-gray-600 tracking-wider">
              <svg className="w-4 h-4 mr-1 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              AKSES AMAN
            </div>
            <div className="flex items-center text-xs font-semibold text-gray-600 tracking-wider">
              <svg className="w-4 h-4 mr-1 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              LESTARIKAN ALAM
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;