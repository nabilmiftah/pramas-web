import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Pastikan path ini disesuaikan dengan lokasi file supabaseClient Anda
import { supabase } from '../services/supabaseClient'; 

const DashboardPendaki = () => {
  const [namaUser, setNamaUser] = useState('Pendaki');
  const [tiketMendatang, setTiketMendatang] = useState(null);
  const [riwayatPendakian, setRiwayatPendakian] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil nama user dari LocalStorage (disimpan saat login)
    const storedName = localStorage.getItem('userNama');
    if (storedName) {
      // Ambil nama depan saja untuk sapaan
      setNamaUser(storedName.split(' ')[0]); 
    }

    // 2. Fungsi untuk mengambil data dari Supabase
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];

        // A. Ambil 1 Tiket Mendatang Terdekat (Tanggal >= Hari Ini)
        // Asumsi: Anda membedakan data berdasarkan kolom 'nama_ketua'
        const { data: upcomingData, error: upcomingError } = await supabase
          .from('booking_transaksi')
          .select(`*, jalur_pendakian(nama_jalur)`) // Join ke tabel jalur jika ada
          .eq('nama_ketua', storedName) // Filter milik user yang sedang login
          .gte('tanggal_naik', today)
          .order('tanggal_naik', { ascending: true })
          .limit(1)
          .single(); // Hanya ambil 1 yang paling dekat

        if (!upcomingError && upcomingData) {
          setTiketMendatang(upcomingData);
        }

        // B. Ambil Riwayat Pendakian (Tanggal < Hari Ini)
        const { data: historyData, error: historyError } = await supabase
          .from('booking_transaksi')
          .select(`*, jalur_pendakian(nama_jalur)`)
          .eq('nama_ketua', storedName)
          .lt('tanggal_naik', today)
          .order('tanggal_naik', { ascending: false })
          .limit(3); // Ambil 3 riwayat terakhir

        if (!historyError && historyData) {
          setRiwayatPendakian(historyData);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (storedName) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Helper untuk memformat tanggal (Contoh: 24 Okt 2024)
  const formatTanggalSingkat = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-700 mb-1">Pendaki Aktif</p>
          {/* NAMA DINAMIS */}
          <h2 className="text-3xl font-bold text-[#0f291e]">Selamat Datang, {namaUser}!</h2>
        </div>
        <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-100 font-medium text-sm">
          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Status: {tiketMendatang ? 'Siap Mendaki' : 'Belum Ada Jadwal'}
        </div>
      </div>

      {/* GRID KONTEN UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === KOLOM KIRI (LEBAR) - Span 2 === */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KARTU 1: TIKET MENDATANG */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden min-h-[250px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-full">Memuat data tiket...</div>
            ) : tiketMendatang ? (
              <>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <span className="bg-[#b8f2c3] text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">Mendatang</span>
                  <div className="flex items-center text-sm font-semibold text-gray-600">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {formatTanggalSingkat(tiketMendatang.tanggal_naik)}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#0f291e] mb-1">Gunung Prau</h3>
                    <div className="flex items-center text-gray-500 text-sm font-medium mb-8">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      Jalur {tiketMendatang.jalur_pendakian?.nama_jalur || tiketMendatang.id_jalur || 'Patak Banteng'}
                    </div>

                    <div className="border-t border-gray-100 pt-6 flex gap-12">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Status</p>
                        <p className={`font-bold ${tiketMendatang.status_pembayaran === 'Lunas' ? 'text-emerald-700' : 'text-yellow-600'}`}>
                          {tiketMendatang.status_pembayaran || 'Pending'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">Kode Booking</p>
                        <p className="font-bold text-[#0f291e] uppercase">{tiketMendatang.id_booking ? tiketMendatang.id_booking.substring(0,8) : 'PRU-XXX'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f0f4f8] p-4 rounded-xl flex flex-col items-center justify-center w-40 flex-shrink-0">
                    <div className="bg-white p-2 rounded-lg mb-3 shadow-sm w-full aspect-square flex items-center justify-center border border-gray-100">
                      <svg className="w-16 h-16 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h-2v2h2v-2zm-2 2h-2v2h2v-2zm2 2h-2v2h2v-2zm-2 2h-2v2h2v-2z"/>
                      </svg>
                    </div>
                    <p className="text-[10px] text-center font-semibold text-gray-500 leading-tight">Tunjukkan QR ini di Basecamp</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-center py-8 relative z-10">
                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path></svg>
                <h3 className="text-lg font-bold text-gray-700 mb-1">Belum Ada Jadwal Mendatang</h3>
                <p className="text-sm text-gray-500 mb-4">Ayo rencanakan petualangan Anda selanjutnya di Gunung Prau.</p>
                <Link to="/cek-kuota" className="bg-[#0f291e] hover:bg-emerald-900 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                  Cek Kuota Sekarang
                </Link>
              </div>
            )}
          </div>

          {/* KARTU 2: PERSIAPAN PENDAKIAN */}
          {/* Sengaja dibiarkan semi-statis sebagai panduan bagi pendaki */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                <h3 className="text-xl font-bold text-[#0f291e]">Persiapan Pendakian</h3>
              </div>
              <span className="bg-[#b8f2c3] text-emerald-900 text-xs font-bold px-3 py-1 rounded-full">2/3 Selesai</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-emerald-600 text-white rounded-full p-1 mr-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f291e] text-sm">Dokumen Identitas (KTP)</p>
                    <p className="text-xs text-gray-500 mt-0.5">Terverifikasi oleh sistem</p>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold text-sm">Valid</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-emerald-600 text-white rounded-full p-1 mr-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0f291e] text-sm">Surat Keterangan Sehat</p>
                    <p className="text-xs text-gray-500 mt-0.5">Diunggah saat registrasi</p>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold text-sm">Valid</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-red-200 shadow-sm">
                <div className="flex items-center">
                  <div className="border-2 border-red-400 rounded-full w-6 h-6 mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-[#0f291e] text-sm">Pengecekan Perlengkapan</p>
                    <p className="text-xs text-gray-500 mt-0.5">Wajib dilakukan di Basecamp</p>
                  </div>
                </div>
                <span className="bg-red-100 text-red-700 font-bold text-xs px-3 py-1 rounded-md">Belum</span>
              </div>
            </div>
          </div>

        </div>

        {/* === KOLOM KANAN (SEMPIT) - Span 1 === */}
        <div className="space-y-6">
          
          {/* KARTU 3: KONDISI TERKINI (Dibiarkan Statis) */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center text-sm font-bold text-[#0f291e]">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                Kondisi Terkini
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center mb-6">
              <h2 className="text-6xl font-bold text-emerald-800 tracking-tighter mb-2">12°C</h2>
              <p className="text-gray-700 font-semibold mb-1">Cerah Berawan</p>
              <p className="text-xs text-gray-400">Gunung Prau, Basecamp</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div className="text-center">
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Angin</p>
                <p className="text-sm font-bold text-[#0f291e]">15 km/j</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 font-semibold uppercase">Status</p>
                <p className="text-sm font-bold text-emerald-700">Normal</p>
              </div>
            </div>
          </div>

          {/* KARTU 4: RIWAYAT PENDAKIAN DINAMIS */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center text-sm font-bold text-[#0f291e]">
                <svg className="w-5 h-5 mr-2 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Riwayat Pendakian
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="text-sm text-gray-500 text-center py-4">Memuat riwayat...</div>
              ) : riwayatPendakian.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4 border-b border-gray-100">Belum ada riwayat pendakian sebelumnya.</div>
              ) : (
                riwayatPendakian.map((item, index) => (
                  <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div>
                      <h4 className="text-sm font-bold text-[#0f291e]">Gunung Prau</h4>
                      <p className="text-xs text-gray-500 mt-1">Jalur {item.jalur_pendakian?.nama_jalur || item.id_jalur || 'TBA'} • {formatTanggalSingkat(item.tanggal_naik)}</p>
                    </div>
                    {item.status_pembayaran === 'Dibatalkan' ? (
                      <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded border border-red-100">Batal</span>
                    ) : (
                      <span className="bg-[#b8f2c3] text-emerald-900 text-[10px] font-bold px-2 py-1 rounded">Selesai</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPendaki;