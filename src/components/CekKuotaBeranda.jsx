import { useState, useEffect } from 'react';
import KuotaService from '../services/KuotaService'; // Pastikan path import ini benar

const CekKuotaBeranda = () => {
  const [tanggalPilih, setTanggalPilih] = useState('2026-07-10');
  const [dataJalurHarian, setDataJalurHarian] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fungsi ini akan otomatis berjalan setiap kali 'tanggalPilih' berubah
  useEffect(() => {
    const ambilDataHarian = async () => {
      setLoading(true);
      try {
        const rawData = await KuotaService.getKuotaDenganJalur();
        
        if (rawData) {
          // 1. Saring data: Hanya ambil data yang tanggalnya sama dengan kalender
          const dataHariIni = rawData.filter(item => item.tanggal === tanggalPilih);
          
          // 2. Format data tersebut agar sesuai dengan desain kartu kita
          const dataFormat = dataHariIni.map((item) => {
            // Menentukan status berdasarkan angka kuota
            let statusBadge = "Tersedia";
            if (item.sisa_kuota <= 0 && item.sisa_kuota > -1) statusBadge = "Penuh";
            else if (item.sisa_kuota > 0 && item.sisa_kuota <= 20) statusBadge = "Terbatas";
            else if (item.sisa_kuota < 0) statusBadge = "Tutup"; // Anggap -1 adalah tutup

            return {
              id: item.id_kuota,
              // Mengambil nama dari tabel relasi jalur_pendakian
              nama: item.jalur_pendakian?.nama_jalur || "Nama Jalur",
              deskripsi: "Jalur pendakian resmi Gunung Prau.",
              sisaKuota: item.sisa_kuota < 0 ? 0 : item.sisa_kuota, 
              status: statusBadge,
              // Gunakan gambar default Unsplash (karena tabel kuota tidak menyimpan gambar)
              gambar: item.jalur_pendakian?.gambar || "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?q=80&w=400&auto=format&fit=crop"
            };
          });

          setDataJalurHarian(dataFormat);
        }
      } catch (error) {
        console.error("Gagal mengambil kuota harian:", error);
      } finally {
        setLoading(false);
      }
    };

    ambilDataHarian();
  }, [tanggalPilih]); // <--- Array dependency ini membuat useEffect memantau perubahan tanggal

  const getBadgeColor = (status) => {
    if (status === 'Penuh' || status === 'Tutup') return 'bg-red-500 text-white';
    if (status === 'Terbatas') return 'bg-yellow-400 text-yellow-900';
    return 'bg-emerald-600 text-white';
  };

  return (
    <section className="py-16 px-8 md:px-16 max-w-7xl mx-auto w-full">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cek Kuota Pendakian</h2>
        <p className="text-gray-500 text-sm">Ketersediaan slot pendakian harian diperbarui secara real-time.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <label className="block text-emerald-800 font-semibold text-sm mb-2">Pilih Tanggal Pendakian</label>
          <div className="relative">
            <input 
              type="date" 
              className="border border-gray-300 rounded-md py-2 px-4 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700"
              // Menyambungkan input kalender dengan state React
              value={tanggalPilih}
              onChange={(e) => setTanggalPilih(e.target.value)}
            />
          </div>
        </div>

        <div className="flex space-x-4 text-xs font-medium text-gray-600">
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mr-2"></span>Tersedia</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-2"></span>Terbatas</div>
          <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>Penuh/Tutup</div>
        </div>
      </div>

      {/* Menampilkan area loading, pesan kosong, atau daftar kartu */}
      {loading ? (
        <div className="py-10 text-center text-emerald-700 font-medium">Memuat data ketersediaan...</div>
      ) : dataJalurHarian.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500 font-medium">Belum ada jadwal pendakian yang dibuka untuk tanggal {tanggalPilih}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataJalurHarian.map((jalur, index) => (
            <div key={jalur.id || index} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition">
              <div 
                className="h-36 w-full bg-cover bg-center relative"
                style={{ 
                  backgroundImage: `url(${jalur.gambar})`,
                  // Jika penuh/tutup, beri efek grayscale pada gambar agar terlihat tidak aktif
                  filter: jalur.status === 'Penuh' || jalur.status === 'Tutup' ? 'grayscale(100%)' : 'none'
                }}
              >
                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-sm ${getBadgeColor(jalur.status)}`}>
                  {jalur.status}
                </span>
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-emerald-800 font-bold text-lg mb-1">{jalur.nama}</h3>
                <p className="text-gray-500 text-xs mb-4 flex-grow">{jalur.deskripsi}</p>
                
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center mt-auto">
                  <span className="text-xs text-gray-400 font-medium tracking-wide">Sisa Kuota</span>
                  <span className={`text-sm font-bold ${jalur.status === 'Penuh' || jalur.status === 'Tutup' ? 'text-red-500' : 'text-emerald-600'}`}>
                    {jalur.sisaKuota} Orang
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CekKuotaBeranda;