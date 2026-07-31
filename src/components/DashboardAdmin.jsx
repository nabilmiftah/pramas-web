import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalAktif: 0,
    menungguVerifikasi: 0,
    sisaKuota: 0,
    persentaseKuota: 100
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mendapatkan tanggal hari ini
  const today = new Date();
  const todayDateStr = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  const formattedDate = today.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Ambil jumlah pesanan yang Menunggu Verifikasi / Pending
      const { count: pendingCount, error: pendingError } = await supabase
        .from('booking_transaksi')
        .select('*', { count: 'exact', head: true })
        .in('status_pembayaran', ['pending', 'menunggu verifikasi']);
      
      if (pendingError) throw pendingError;

      // 2. Ambil total Pendaki Aktif (Status Lunas & Tanggal berada di rentang pendakian)
      const { data: aktifData, error: aktifError } = await supabase
        .from('booking_transaksi')
        .select('jumlah_anggota')
        .eq('status_pembayaran', 'lunas')
        .lte('tanggal_naik', todayDateStr)
        .gte('tanggal_turun', todayDateStr);

      if (aktifError) throw aktifError;
      const totalPendaki = aktifData ? aktifData.reduce((sum, item) => sum + (item.jumlah_anggota || 0), 0) : 0;

      // 3. Ambil sisa kuota hari ini dari semua jalur
      const { data: kuotaData, error: kuotaError } = await supabase
        .from('kuota_harian')
        .select('sisa_kuota')
        .eq('tanggal', todayDateStr);

      if (kuotaError) throw kuotaError;
      const totalSisaKuota = kuotaData ? kuotaData.reduce((sum, item) => sum + (item.sisa_kuota || 0), 0) : 0;
      
      // Asumsi total kapasitas per hari untuk semua jalur adalah 500 (bisa disesuaikan)
      const kapasitasMaksimal = 500;
      const persentase = ((kapasitasMaksimal - totalSisaKuota) / kapasitasMaksimal) * 100;

      // 4. Ambil aktivitas terkini (4 transaksi terakhir)
      const { data: logData, error: logError } = await supabase
        .from('booking_transaksi')
        .select('id_booking, status_pembayaran, jumlah_anggota, created_at')
        .order('created_at', { ascending: false })
        .limit(4);

      if (logError) throw logError;

      // Simpan ke state
      setStats({
        totalAktif: totalPendaki,
        menungguVerifikasi: pendingCount || 0,
        sisaKuota: totalSisaKuota,
        persentaseKuota: Math.max(0, Math.min(100, persentase)) // Batasi 0 - 100
      });
      setRecentLogs(logData || []);

    } catch (error) {
      console.error("Gagal memuat data dasbor:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi pembantu untuk memformat waktu (misal: "2 jam yang lalu")
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now - past) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    return `${Math.floor(diffInHours / 24)} hari yang lalu`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      
      {/* HEADER DASHBOARD ADMIN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#0f291e]">Ringkasan Operasional</h2>
          <p className="text-gray-500 mt-1 text-sm">Memantau aktivitas pendakian hari ini, {formattedDate}.</p>
        </div>
        <button onClick={fetchDashboardData} className="flex items-center bg-[#eef2f6] text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition border border-gray-200">
          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Segarkan Data
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-emerald-700 font-bold">Menyinkronkan data dengan server...</div>
      ) : (
        <>
          {/* GRID ATAS: 3 KARTU STATISTIK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* KARTU 1: Total Pendaki Aktif */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <div className="bg-[#eaf8f1] p-2.5 rounded-lg">
                  <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Pendaki Naik Hari Ini</p>
                <h3 className="text-4xl font-bold text-[#0f291e] tracking-tight">{stats.totalAktif}</h3>
              </div>
            </div>

            {/* KARTU 2: Menunggu Verifikasi */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <div className="bg-yellow-50 p-2.5 rounded-lg border border-yellow-100">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Menunggu Verifikasi</p>
                <h3 className="text-4xl font-bold text-[#0f291e] tracking-tight">{stats.menungguVerifikasi}</h3>
              </div>
            </div>

            {/* KARTU 3: Sisa Kuota Hari Ini */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-50 pointer-events-none ${stats.sisaKuota < 50 ? 'bg-red-50' : 'bg-emerald-50'}`}></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="bg-[#eaf8f1] p-2.5 rounded-lg">
                  <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                </div>
                {stats.sisaKuota < 50 && <span className="text-red-600 text-xs font-bold">Hampir Penuh</span>}
              </div>
              <div className="relative z-10">
                <p className="text-xs text-gray-500 font-semibold mb-1">Sisa Kuota Global (Hari Ini)</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <h3 className="text-4xl font-bold text-[#0f291e] tracking-tight">{stats.sisaKuota}</h3>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${stats.sisaKuota < 50 ? 'bg-red-500' : 'bg-emerald-700'} h-2 rounded-full transition-all duration-1000`} style={{ width: `${stats.persentaseKuota}%` }}></div>
                </div>
              </div>
            </div>

          </div>

          {/* GRID BAWAH: GRAFIK & AKTIVITAS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* KOLOM KIRI (LEBAR): Tren Pendaki (Tetap Wireframe) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#0f291e]">Tren Pendaki Mingguan</h3>
              </div>
              <div className="flex-1 w-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                <p className="text-gray-400 font-semibold text-sm">Integrasi Grafik Chart.js akan ditempatkan di sini</p>
              </div>
            </div>

            {/* KOLOM KANAN (SEMPIT): Aktivitas Terkini (Dinamis) */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[400px]">
              <div className="p-6 border-b border-gray-50">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                  <h3 className="text-xl font-bold text-[#0f291e]">Aktivitas Terkini</h3>
                </div>
              </div>

              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {recentLogs.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm mt-10">Belum ada aktivitas.</p>
                ) : (
                  recentLogs.map((log) => (
                    <div key={log.id_booking} className="flex items-start">
                      <div className={`p-2 rounded-full mr-4 flex-shrink-0 ${
                        log.status_pembayaran?.toLowerCase() === 'lunas' ? 'bg-emerald-50 text-emerald-600' :
                        log.status_pembayaran?.toLowerCase() === 'dibatalkan' ? 'bg-red-50 text-red-600' :
                        'bg-yellow-50 text-yellow-600'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0f291e] uppercase">#{log.id_booking.substring(0, 8)}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Status: <span className="font-semibold">{log.status_pembayaran}</span> ({log.jumlah_anggota} Orang)
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">{getTimeAgo(log.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default DashboardAdmin;