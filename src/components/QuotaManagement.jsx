import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const QuotaManagement = () => {
  const navigate = useNavigate();

  // State untuk Data Jalur dari Database
  const [jalurList, setJalurList] = useState([]);
  const [selectedJalur, setSelectedJalur] = useState('');
  
  // State untuk Kontrol Bulan Kalender
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State untuk menampung data kuota dari database
  const [kuotaMap, setKuotaMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // State untuk tanggal yang sedang diklik/dipilih
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // 1. Fetch Daftar Jalur Secara Dinamis
  useEffect(() => {
    const fetchJalur = async () => {
      try {
        const { data, error } = await supabase.from('jalur_pendakian').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          setJalurList(data);
          // Set default jalur ke ID pertama dari database jika belum ada yang terpilih
          if (!selectedJalur) {
            setSelectedJalur(data[0].id_jalur);
          }
        }
      } catch (error) {
        console.error("Gagal memuat daftar jalur:", error.message);
      }
    };
    fetchJalur();
  }, []);

  // 2. Fetch Data Kuota Berdasarkan Bulan & Jalur
  useEffect(() => {
    if (!selectedJalur) return; // Jangan fetch jika jalur belum termuat

    const fetchKuotaBulanIni = async () => {
      setIsLoading(true);
      try {
        const awalBulan = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const akhirBulanObj = new Date(year, month + 1, 0);
        const akhirBulan = `${year}-${String(month + 1).padStart(2, '0')}-${String(akhirBulanObj.getDate()).padStart(2, '0')}`;

        const { data, error } = await supabase
          .from('kuota_harian')
          .select('tanggal, sisa_kuota')
          .eq('id_jalur', selectedJalur)
          .gte('tanggal', awalBulan)
          .lte('tanggal', akhirBulan);

        if (error) throw error;

        const mapData = {};
        if (data) {
          data.forEach(item => {
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

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // 3. Kalkulasi Render Kalender
  const jumlahHari = new Date(year, month + 1, 0).getDate(); 
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // Untuk mengatur sel kosong di awal bulan
  // Menggeser hari agar Senin = 0, Minggu = 6
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
  
  const listHari = Array.from({ length: jumlahHari }, (_, i) => {
    const dayNum = i + 1;
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    
    // PERBAIKAN: Jika undefined (admin belum set), kita jadikan null, bukan 500
    const sisa = kuotaMap[dateString] !== undefined ? kuotaMap[dateString] : null; 
    return { dateString, dayNum, sisa };
  });

  const formatDetailTanggal = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Mencari nama jalur yang sedang aktif untuk ditampilkan
  const activeJalurObj = jalurList.find(j => j.id_jalur === parseInt(selectedJalur));
  const teksJalur = activeJalurObj ? activeJalurObj.nama_jalur : 'Memuat...';
  
  const sisaKuotaTerpilih = kuotaMap[selectedDate] !== undefined ? kuotaMap[selectedDate] : null;
  const isBisaBooking = sisaKuotaTerpilih !== null && sisaKuotaTerpilih > 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-8 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0f291e]">Cek Ketersediaan Kuota</h2>
          <p className="text-gray-500 mt-1 text-sm">Pilih jalur dan tanggal untuk melihat sisa kuota pendakian Gunung Prau.</p>
        </div>
        
        {/* DROPDOWN DINAMIS */}
        <div className="w-full md:w-auto">
          <select 
            value={selectedJalur}
            onChange={(e) => setSelectedJalur(e.target.value)}
            className="w-full md:w-auto border border-gray-200 rounded-lg text-sm p-2.5 bg-white font-semibold text-gray-700 shadow-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          >
            {jalurList.length === 0 && <option value="">Memuat Jalur...</option>}
            {jalurList.map((jalur) => (
              <option key={jalur.id_jalur} value={jalur.id_jalur}>
                {jalur.nama_jalur}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOTAK KIRI: Kalender */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          
          <div className="flex justify-between items-center mb-6 px-2">
            <button onClick={handlePrevMonth} className="p-2 bg-gray-50 hover:bg-emerald-50 rounded-lg text-gray-500 transition-colors border border-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <h3 className="font-bold text-lg text-gray-900 uppercase tracking-widest">{namaBulan[month]} {year}</h3>
            <button onClick={handleNextMonth} className="p-2 bg-gray-50 hover:bg-emerald-50 rounded-lg text-gray-500 transition-colors border border-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold text-gray-400 uppercase mb-4">
            <div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div><div>Min</div>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-emerald-700 font-semibold animate-pulse">Menyelaraskan data dengan server...</div>
          ) : (
            <div className="grid grid-cols-7 gap-3">
              {/* Render sel kosong di awal bulan agar hari sesuai */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24"></div>
              ))}

              {/* Render Hari */}
              {listHari.map((item) => {
                const isSelected = selectedDate === item.dateString;
                const isBelumDibuka = item.sisa === null;
                const isPenuh = item.sisa === 0;
                const isTerbatas = item.sisa > 0 && item.sisa < 50;

                let cardStyle = "bg-white border-gray-200 text-gray-800 hover:border-emerald-600 hover:shadow-md cursor-pointer";
                let badgeText = "Tersedia";
                let badgeColor = "text-emerald-700 bg-emerald-50";
                let sisaTampil = item.sisa;

                // Pengkondisian Warna Berdasarkan Status
                if (isBelumDibuka) {
                  cardStyle = "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-70";
                  badgeText = "Tutup";
                  badgeColor = "text-gray-400 bg-gray-200/50";
                  sisaTampil = "-";
                } else if (isPenuh) {
                  cardStyle = "bg-red-50/40 border-red-200 text-red-800 cursor-not-allowed";
                  badgeText = "Penuh";
                  badgeColor = "text-red-600 bg-red-100";
                } else if (isTerbatas) {
                  badgeText = "Terbatas";
                  badgeColor = "text-amber-700 bg-amber-50";
                }

                if (isSelected && !isBelumDibuka) {
                  cardStyle = "border-2 border-emerald-600 bg-emerald-50/30 shadow-sm transform -translate-y-0.5";
                }

                return (
                  <div 
                    key={item.dateString}
                    onClick={() => {
                      if (!isBelumDibuka) setSelectedDate(item.dateString);
                    }}
                    className={`border rounded-xl p-2 md:p-3 flex flex-col justify-between h-20 md:h-24 transition-all ${cardStyle}`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>{item.dayNum}</span>
                      {isSelected && !isBelumDibuka && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                    </div>
                    <div className="text-center mt-auto">
                      <div className="text-sm md:text-xl font-extrabold leading-none mb-1">{sisaTampil}</div>
                      <div className={`text-[8px] md:text-[9px] font-bold uppercase tracking-wider inline-block px-1 md:px-1.5 py-0.5 rounded ${badgeColor}`}>
                        {badgeText}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* KOTAK KANAN: Detail & Booking */}
        <div className="space-y-6 h-fit">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 text-lg mb-6">Detail Pilihan</h3>
            
            <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-5 mb-8 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-gray-500 text-sm">Tanggal</span>
                <span className="font-bold text-gray-900 text-sm text-right">{formatDetailTanggal(selectedDate)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-gray-500 text-sm">Jalur</span>
                <span className="font-bold text-gray-900 text-sm">{teksJalur}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-500 text-sm">Sisa Kuota</span>
                <span className={`font-extrabold text-base ${sisaKuotaTerpilih === null ? 'text-gray-400' : sisaKuotaTerpilih === 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                  {sisaKuotaTerpilih === null ? 'Belum Buka' : `${sisaKuotaTerpilih} Orang`}
                </span>
              </div>
            </div>

            <button 
              disabled={!isBisaBooking}
              onClick={() => {
                navigate('/registration', { state: { jalur: selectedJalur, tanggal: selectedDate } });
              }}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ${
                !isBisaBooking
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                  : 'bg-[#0f291e] hover:bg-emerald-800 text-white hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              {sisaKuotaTerpilih === null ? 'Jadwal Belum Dibuka' : sisaKuotaTerpilih === 0 ? 'Kuota Habis' : 'Booking Sekarang'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuotaManagement;