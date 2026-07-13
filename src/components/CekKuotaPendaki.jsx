import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CekKuotaPendaki = () => {
  // State untuk melacak pilihan pengguna
  const [selectedJalur, setSelectedJalur] = useState('Patak Banteng');
  const [selectedDate, setSelectedDate] = useState(8);

  // Data tiruan (dummy) untuk kalender sesuai desain Anda
  const calendarDays = [
    { date: 1, quota: 250, status: 'Tersedia' },
    { date: 2, quota: 210, status: 'Tersedia' },
    { date: 3, quota: 45, status: 'Terbatas' },
    { date: 4, quota: 0, status: 'Penuh' },
    { date: 5, quota: 180, status: 'Tersedia' },
    { date: 6, quota: 250, status: 'Tersedia' },
    { date: 7, quota: 250, status: 'Tersedia' },
    { date: 8, quota: 250, status: 'Tersedia' },
    { date: 9, quota: 230, status: 'Tersedia' },
    { date: 10, quota: 12, status: 'Terbatas' },
    { date: 11, quota: 0, status: 'Penuh' },
  ];

  // Fungsi untuk menentukan gaya warna sel kalender berdasarkan kuota
  const getCellStyles = (day) => {
    if (day.quota === 0) {
      return 'bg-red-50 border-red-200 text-red-600';
    } else if (day.quota < 50) {
      return 'bg-[#f4f7e6] border-[#d4dca4] text-[#7a8a3a]'; // Warna kekuningan/hijau muda untuk terbatas
    } else {
      return 'bg-[#eef8eb] border-[#c3e3bc] text-emerald-800'; // Hijau untuk tersedia
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      
      {/* 1. HEADER HALAMAN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cek Ketersediaan Kuota</h1>
          <p className="text-gray-500 text-sm">Pilih jalur dan tanggal untuk melihat sisa kuota pendakian Gunung Prau.</p>
        </div>
        <div className="relative">
          <select 
            value={selectedJalur}
            onChange={(e) => setSelectedJalur(e.target.value)}
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm font-semibold shadow-sm"
          >
            <option value="Patak Banteng">Jalur Patak Banteng</option>
            <option value="Dieng">Jalur Dieng</option>
            <option value="Wates">Jalur Wates</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* 2. GRID KONTEN UTAMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Kalender (Porsi 2/3) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Navigasi Bulan */}
          <div className="flex justify-between items-center mb-6 px-4">
            <button className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900">Agustus 2024</h2>
            <button className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          {/* Header Hari */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-semibold text-gray-500">
            <div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div><div>Min</div>
          </div>

          {/* Grid Tanggal */}
          <div className="grid grid-cols-7 gap-2">
            {/* Sel Kosong untuk perataan hari pertama (Rabu) */}
            <div className="p-2"></div>
            <div className="p-2"></div>
            
            {/* Render Tanggal */}
            {calendarDays.map((day) => {
              const isSelected = selectedDate === day.date;
              return (
                <div 
                  key={day.date}
                  onClick={() => day.quota > 0 && setSelectedDate(day.date)}
                  className={`relative flex flex-col p-3 border rounded-xl transition-all cursor-pointer h-24
                    ${getCellStyles(day)}
                    ${isSelected ? 'border-2 border-emerald-700 shadow-md transform -translate-y-0.5' : 'hover:border-emerald-400 opacity-90'}
                    ${day.quota === 0 ? 'cursor-not-allowed opacity-60' : ''}
                  `}
                >
                  <span className="text-sm font-semibold mb-1">{day.date}</span>
                  <div className="mt-auto text-center">
                    <span className="block font-bold text-lg leading-none mb-1">{day.quota}</span>
                    {isSelected ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800">Dipilih</span>
                    ) : (
                      <span className="text-[9px] font-semibold uppercase tracking-wider opacity-80">{day.status}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Detail Pilihan (Porsi 1/3) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="font-bold text-gray-900 text-xl mb-6">Detail Pilihan</h3>
          
          <div className="bg-[#f8fafc] border border-gray-100 rounded-xl p-5 mb-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-500 text-sm">Tanggal</span>
              <span className="font-bold text-gray-900 text-sm">{selectedDate} Agustus 2024</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-500 text-sm">Jalur</span>
              <span className="font-bold text-gray-900 text-sm">{selectedJalur}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500 text-sm">Sisa Kuota</span>
              <span className="font-bold text-emerald-700 text-sm">250 Orang</span>
            </div>
          </div>

          <Link 
            to="/registration"
            className="w-full bg-[#0f291e] hover:bg-emerald-900 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            Booking Sekarang
          </Link>
        </div>

      </div>

      {/* 3. BANNER BAWAH */}
      <div className="mt-8 relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-sm group">
        <img 
          src="https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?auto=format&fit=crop&w=1200&q=80" 
          alt="Gunung Prau Landscape" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide text-shadow-sm">
            Siapkan Petualangan Anda di Gunung Prau
          </h2>
        </div>
      </div>

    </div>
  );
};

export default CekKuotaPendaki;