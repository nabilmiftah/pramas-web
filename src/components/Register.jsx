import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Register = () => {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    noTelepon: '',
    password: '',
    konfirmasiPassword: '',
  });
  
  const [setujuSyarat, setSetujuSyarat] = useState(false);
  const [lihatSandi, setLihatSandi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState({ tipe: '', teks: '' }); // tipe bisa 'error' atau 'sukses'
  
  const navigate = useNavigate();

  // Menangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setPesan({ tipe: '', teks: '' });

    // 1. Validasi Persetujuan
    if (!setujuSyarat) {
      setPesan({ tipe: 'error', teks: 'Anda harus menyetujui Ketentuan Layanan dan Pedoman Lingkungan.' });
      return;
    }

    // 2. Validasi Konfirmasi Password
    if (formData.password !== formData.konfirmasiPassword) {
      setPesan({ tipe: 'error', teks: 'Kata sandi dan Konfirmasi sandi tidak cocok.' });
      return;
    }

    // 3. Validasi Panjang Password (opsional, Supabase defaultnya butuh min 6 karakter)
    if (formData.password.length < 6) {
      setPesan({ tipe: 'error', teks: 'Kata sandi harus terdiri dari minimal 6 karakter.' });
      return;
    }

    setLoading(true);

    // 4. Memanggil AuthService
    // Catatan: Jika tabel pengguna Anda butuh no_telepon, Anda harus menyesuaikan AuthService.js
    const response = await AuthService.register(
      formData.email, 
      formData.password, 
      formData.namaLengkap,
      formData.noTelepon
    );
    
    if (response.success) {
      setPesan({ tipe: 'sukses', teks: 'Pendaftaran berhasil! Mengalihkan ke halaman Login...' });
      
      // Tunggu 2 detik agar pesan sukses terbaca, lalu pindah ke halaman login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setPesan({ tipe: 'error', teks: response.pesan || 'Gagal mendaftar. Email mungkin sudah digunakan.' });
    }
    
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] w-full">
      
      {/* Kolom Kiri: Gambar Pemandangan (Mirip dengan Login) */}
      <div 
        className="hidden md:flex w-1/2 relative bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=1200&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 lg:p-20 h-full text-white w-full">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Mulai Langkah Anda<br/>Menuju Puncak</h1>
          <p className="text-gray-200 text-lg max-w-md leading-relaxed">
            Bergabunglah dengan komunitas pendaki yang mengutamakan keselamatan dan kelestarian alam bersama sistem manajemen pendakian Gunung Prau yang terpercaya.
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Formulir Registrasi */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-16 bg-[#fafafa]">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#0f291e] mb-2">Buat Akun Baru</h2>
          <p className="text-gray-500 mb-8 text-sm">Lengkapi data diri Anda untuk memulai perencanaan pendakian yang lebih aman.</p>

          {/* Menampilkan Pesan Error atau Sukses */}
          {pesan.teks && (
            <div className={`p-3 rounded-md mb-6 text-sm border ${pesan.tipe === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-200'}`}>
              {pesan.teks}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Input Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <input
                  type="text"
                  name="namaLengkap"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                  placeholder="Masukkan nama lengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                  placeholder="contoh@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Input Nomor Telepon */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nomor Telepon (WhatsApp)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                </div>
                <input
                  type="tel"
                  name="noTelepon"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                  placeholder="0812..."
                  value={formData.noTelepon}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Input Kata Sandi & Konfirmasi bersebelahan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <input
                    type={lihatSandi ? "text" : "password"}
                    name="password"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Konfirmasi Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  </div>
                  <input
                    type={lihatSandi ? "text" : "password"}
                    name="konfirmasiPassword"
                    required
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm"
                    placeholder="••••••••"
                    value={formData.konfirmasiPassword}
                    onChange={handleChange}
                  />
                  {/* Tombol Lihat/Sembunyi Sandi hanya di kolom Konfirmasi */}
                  <button
                    type="button"
                    onClick={() => setLihatSandi(!lihatSandi)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                     <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {lihatSandi ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        )}
                      </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox Persetujuan */}
            <div className="flex items-start mt-4 mb-6">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-emerald-300 accent-emerald-700"
                  checked={setujuSyarat}
                  onChange={(e) => setSetujuSyarat(e.target.checked)}
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-xs text-gray-500">
                Saya menyetujui <a href="#" className="font-semibold text-emerald-700 hover:underline">Ketentuan Layanan</a> dan <a href="#" className="font-semibold text-emerald-700 hover:underline">Pedoman Lingkungan</a> yang berlaku.
              </label>
            </div>

            {/* Tombol Buat Akun */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#0f291e] hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700 transition duration-300 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Memproses...' : 'Buat Akun'}
            </button>
          </form>

          {/* Link Login */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-semibold text-[#0f291e] hover:underline">
              Masuk Sekarang
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;