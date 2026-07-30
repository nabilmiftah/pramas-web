import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const QuotaManagement = () => {
  const [jalurList, setJalurList] = useState([]);
  const [selectedJalur, setSelectedJalur] = useState('');
  
  // State untuk navigasi bulan kalender
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Set default ke Juli 2026 sesuai database Anda
  const [kuotaData, setKuotaData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Modal Update Kuota
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [newQuota, setNewQuota] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchJalur();
  }, []);

  useEffect(() => {
    if (selectedJalur) {
      fetchKuota();
    }
  }, [selectedJalur, currentDate]);

  const fetchJalur = async () => {
    try {
      const { data, error } = await supabase.from('jalur_pendakian').select('*');
      if (error) throw error;
      setJalurList(data);
      if (data.length > 0) setSelectedJalur(data[0].id_jalur);
    } catch (error) {
      console.error("Gagal memuat jalur:", error);
    }
  };

  const fetchKuota = async () => {
    setIsLoading(true);
    try {
      // Cari tanggal awal dan akhir bulan yang dipilih
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      // Format ke YYYY-MM-DD untuk query Supabase
      const startDateStr = startOfMonth.toISOString().split('T')[0];
      const endDateStr = endOfMonth.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('kuota_harian')
        .select('*')
        .eq('id_jalur', selectedJalur)
        .gte('tanggal', startDateStr)
        .lte('tanggal', endDateStr);

      if (error) throw error;
      setKuotaData(data || []);
    } catch (error) {
      console.error("Gagal memuat kuota:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logika Pembuatan Kalender
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    let days = [];
    // Kotak kosong untuk penyeimbang hari di awal bulan
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4 bg-gray-50/30 rounded-xl border border-transparent"></div>);
    }

    // Kotak tanggal
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Cari data kuota dari database untuk tanggal ini
      const kuotaHariIni = kuotaData.find(k => k.tanggal === dateStr);
      const sisa = kuotaHariIni ? kuotaHariIni.sisa_kuota : 'Belum Diatur';
      
      // Pewarnaan dinamis
      let bgColor = 'bg-white border-gray-200';
      let textColor = 'text-gray-900';
      if (sisa === 0) {
        bgColor = 'bg-red-50 border-red-200';
        textColor = 'text-red-700 font-bold';
      } else if (typeof sisa === 'number' && sisa < 50) {
        bgColor = 'bg-yellow-50 border-yellow-200';
        textColor = 'text-yellow-700 font-bold';
      } else if (typeof sisa === 'number') {
        bgColor = 'bg-[#eef8eb] border-[#c3e3bc]';
        textColor = 'text-emerald-800 font-bold';
      }

      days.push(
        <div 
          key={day} 
          onClick={() => openModal(dateStr, sisa, kuotaHariIni?.id_kuota)}
          className={`relative flex flex-col p-4 border rounded-xl transition-all cursor-pointer hover:shadow-md hover:border-emerald-500 h-28 ${bgColor}`}
        >
          <span className="text-sm font-semibold text-gray-500">{day}</span>
          <div className="mt-auto text-center">
            <span className={`block text-xl mb-1 ${textColor}`}>
              {sisa}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              {typeof sisa === 'number' ? 'Sisa Kuota' : 'Klik untuk Set'}
            </span>
          </div>
        </div>
      );
    }
    return days;
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const openModal = (dateStr, currentQuota, id_kuota) => {
    setSelectedDay({ dateStr, id_kuota });
    setNewQuota(typeof currentQuota === 'number' ? currentQuota : '');
    setIsModalOpen(true);
  };

  const handleSaveQuota = async () => {
    setIsSaving(true);
    try {
      const quotaValue = parseInt(newQuota);
      if (isNaN(quotaValue) || quotaValue < 0) {
        alert("Masukkan angka yang valid!");
        setIsSaving(false);
        return;
      }

      if (selectedDay.id_kuota) {
        // UPDATE jika data sudah ada di database
        const { error } = await supabase
          .from('kuota_harian')
          .update({ sisa_kuota: quotaValue })
          .eq('id_kuota', selectedDay.id_kuota);
        if (error) throw error;
      } else {
        // INSERT jika belum pernah diatur
        const { error } = await supabase
          .from('kuota_harian')
          .insert([{ 
            id_jalur: selectedJalur, 
            tanggal: selectedDay.dateStr, 
            sisa_kuota: quotaValue 
          }]);
        if (error) throw error;
      }

      // Refresh data kalender
      fetchKuota();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan kuota:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      
      {/* HEADER & FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#0f291e] mb-1">Manajemen Kuota</h2>
          <p className="text-gray-500 text-sm">Atur batas maksimal pendaki harian untuk setiap jalur.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-600">Pilih Jalur:</label>
          <select 
            value={selectedJalur}
            onChange={(e) => setSelectedJalur(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
          >
            {jalurList.map(j => (
              <option key={j.id_jalur} value={j.id_jalur}>{j.nama_jalur}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KALENDER KONTROL */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        
        <div className="flex justify-between items-center mb-8">
          <button onClick={prevMonth} className="p-2 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 rounded-lg transition-colors border border-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          
          <h3 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
            {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </h3>
          
          <button onClick={nextMonth} className="p-2 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 rounded-lg transition-colors border border-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        {/* NAMA HARI */}
        <div className="grid grid-cols-7 gap-4 mb-4 text-center text-xs font-extrabold text-gray-400 uppercase tracking-wider">
          <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
        </div>

        {/* GRID TANGGAL */}
        {isLoading ? (
          <div className="h-64 flex items-center justify-center text-emerald-700 font-semibold">Memuat kalender...</div>
        ) : (
          <div className="grid grid-cols-7 gap-4">
            {renderCalendar()}
          </div>
        )}
      </div>

      {/* MODAL EDIT KUOTA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Ubah Kuota Harian</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Atur kuota untuk tanggal <span className="font-bold text-gray-900">{selectedDay?.dateStr}</span>
              </p>
              
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Jumlah Maksimal Pendaki</label>
              <input 
                type="number" 
                value={newQuota}
                onChange={(e) => setNewQuota(e.target.value)}
                className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-emerald-600 focus:outline-none text-xl font-bold text-gray-800 text-center"
                placeholder="Misal: 250"
              />
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveQuota}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Kuota'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuotaManagement;