import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const QuotaManagement = () => {
  const navigate = useNavigate();

  // State untuk Jalur (Default: 2 untuk Dieng, atau 1 untuk Patak Banteng)
  const [selectedJalur, setSelectedJalur] = useState(2);
  
  // State untuk Kontrol Bulan Kalender (Dinamis berdasarkan tanggal hari ini)
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State untuk menampung data kuota dari database
  const [kuotaMap, setKuotaMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // State untuk tanggal yang sedang diklik/dipilih di kalender
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
  });

  // Ambil tahun dan bulan aktif
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 - 11

  // Array nama bulan untuk header kalender
  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // 1. Fetch Data Kuota dari Supabase Berdasarkan Bulan & Jalur yang Dipilih
  useEffect(() => {
    const fetchKuotaBulanIni = async () => {
      setIsLoading(true);
      try {
        // Format string awal dan akhir bulan untuk query Supabase (Contoh: 2026-08-01 s/d 2026-08-31)
        const awalBulan = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        // Mendapatkan tanggal terakhir di bulan tersebut
        const akhirBulanObj = new Date(year, month + 1, 0);
        const akhirBulan = `${year}-${String(month + 1).padStart(2, '0')}-${String(akhirBulanObj.getDate()).padStart(2, '0')}`;

        const { data, error } = await supabase
          .from('kuota_harian')
          .select('tanggal, sisa_kuota')
          .eq('id_jalur', selectedJalur)
          .gte('tanggal', awalBulan)
          .lte('tanggal', akhirBulan);

        if (error) throw error;

        // Ubah array data menjadi Object mapping agar mudah dipanggil berdasarkan tanggal (Key-Value)
        // Contoh: { '2026-08-08': 250, '2026-08-09': 230 }
        const mapData = {};
        if (data) {
          data.forEach(item => {
            // Format tanggal dari database seringkali berformat ISO, kita ambil YYYY-MM-DD-nya saja
            const tglKey = item.tanggal.split('T')[0];
            mapData[tglKey] = item.sisa_kuota;
          });
        }
        setKuotaMap(mapData);

      } catch (error) {
        console.error("Gagal memuat kuota:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKuotaBulanIni();
  }, [year, month, selectedJalur]);

  // 2. Navigasi Bulan (Tombol Panah < dan >)
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 3. Kalkulasi Hari dalam Bulan Tersebut untuk Render Grid Kalender
  const jumlahHari = new Date(year, month + 1, 0).getDate(); // Total hari di bulan ini (misal: 31)
  
  // Buat array tanggal dari 1 sampai jumlahHari
  const listHari = Array.from({ length: jumlahHari }, (_, i) => {
    const dayNum = i + 1;
    const formattedDay = String(dayNum).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dateString = `${year}-${formattedMonth}-${formattedDay}`;
    
    // Default kuota jika belum diatur di database adalah 500
    const sisa = kuotaMap[dateString] !== undefined ? kuotaMap[dateString] : 500;
    
    return {
      dateString,
      dayNum,
      sisa
    };
  });

  // Helper untuk format tanggal di Card Detail Pilihan (Contoh: 8 Agustus 2026)
  const formatDetailTanggal = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Helper nama jalur
  const teksJalur = selectedJalur === 1 ? 'Patak Banteng' : 'Dieng';
  const sisaKuotaTerpilih = kuotaMap[selectedDate] !== undefined ? kuotaMap[selectedDate] : 500;

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#0f291e]">Cek Ketersediaan Kuota</h2>
          <p className="text-gray-500 mt-1 text-sm">Pilih jalur dan tanggal untuk melihat sisa kuota pendakian Gunung Prau.</p>
        </div>
        
        {/* Dropdown Jalur Pendakian Dinamis */}
        <div>
          <select 
            value={selectedJalur}
            onChange={(e) => setSelectedJalur(parseInt(e.target.value))}
            className="border border-gray-200 rounded-lg text-sm p-2.5 bg-white font-semibold text-gray-700 shadow-sm focus:outline-none focus:border-emerald-600"
          >
            <option value={1}>Patak Banteng</option>
            <option value={2}>Dieng</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Kalender & Detail Pilihan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOTAK KIRI: Kalender Interaktif (Porsi 2 Kolom) */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          
          {/* Header Kalender & Tombol Bulan */}
          <div className="flex justify-between items-center mb-6 px-4">
            <button 
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            <h3 className="font-bold text-lg text-gray-900">{namaBulan[month]} {year}</h3>
            
            <button 
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          {/* Nama Hari */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 uppercase mb-4">
            <div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div><div>Min</div>
          </div>

          {/* Grid Tanggal Bulan Ini */}
          {isLoading ? (
            <div className="py-20 text-center text-sm text-gray-400">Memuat data kuota dari database...</div>
          ) : (
            <div className="grid grid-cols-7 gap-3">
              {listHari.map((item) => {
                const isSelected = selectedDate === item.dateString;
                const isPenuh = item.sisa <= 0;
                const isTerbatas = item.sisa > 0 && item.sisa < 150;

                // Tentukan warna border dan background kartu kalender
                let cardStyle = "bg-white border-gray-200 text-gray-800 hover:border-emerald-600";
                let badgeText = "Tersedia";
                let badgeColor = "text-emerald-700 bg-emerald-50";

                if (isPenuh) {
                  cardStyle = "bg-red-50/30 border-red-200 text-red-800";
                  badgeText = "Penuh";
                  badgeColor = "text-red-600 bg-red-100";
                } else if (isTerbatas) {
                  badgeText = "Terbatas";
                  badgeColor = "text-amber-700 bg-amber-50";
                }

                if (isSelected) {
                  cardStyle = "border-2 border-emerald-700 bg-emerald-50/20 shadow-sm";
                }

                return (
                  <div 
                    key={item.dateString}
                    onClick={() => setSelectedDate(item.dateString)}
                    className={`border rounded-xl p-3 flex flex-col justify-between h-24 cursor-pointer transition-all ${cardStyle}`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>{item.dayNum}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-700"></span>}
                    </div>
                    
                    <div className="text-center">
                      <div className="text-base font-extrabold">{item.sisa}</div>
                      <div className={`text-[9px] font-bold uppercase tracking-wider inline-block px-1.5 py-0.5 rounded mt-1 ${badgeColor}`}>
                        {badgeText}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* KOTAK KANAN: Detail Pilihan & Tombol Booking */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 text-base mb-6">Detail Pilihan</h3>
            
            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500">Tanggal</span>
                <span className="font-bold text-gray-900">{formatDetailTanggal(selectedDate)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-3">
                <span className="text-gray-500">Jalur</span>
                <span className="font-bold text-gray-900">{teksJalur}</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-gray-500">Sisa Kuota</span>
                <span className={`font-extrabold text-base ${sisaKuotaTerpilih <= 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {sisaKuotaTerpilih} Orang
                </span>
              </div>
            </div>

            <button 
              disabled={sisaKuotaTerpilih <= 0}
              onClick={() => {
                // Navigasi ke halaman form registrasi dengan membawa data pilihan (opsional lewat state router)
                navigate('/registration', { state: { jalur: selectedJalur, tanggal: selectedDate } });
              }}
              className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors ${
                sisaKuotaTerpilih <= 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-[#0f291e] hover:bg-[#184232] text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              {sisaKuotaTerpilih <= 0 ? 'Kuota Habis' : 'Booking Sekarang'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuotaManagement;