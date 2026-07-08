import { useState, useEffect } from 'react';
import KuotaService from '../services/KuotaService';

const CekKuota = () => {
  const [loading, setLoading] = useState(true);
  const [dataKuota, setDataKuota] = useState([]);

  useEffect(() => {
    const fetchAndFormatData = async () => {
      try {
        setLoading(true);
        const rawData = await KuotaService.getKuotaDenganJalur();
        
        if (rawData) {
          // Trik Logika: Mengelompokkan data berdasarkan tanggal (Pivot)
          const groupedData = {};

          rawData.forEach(item => {
            const tgl = item.tanggal;
            // Mengambil nama jalur dari tabel relasi (pastikan properti ini sesuai dengan query Anda)
            const namaJalur = item.jalur_pendakian?.nama_jalur || 'Unknown'; 
            const kuota = item.sisa_kuota;

            // Jika tanggal ini belum ada di wadah, buat wadah baru
            if (!groupedData[tgl]) {
              groupedData[tgl] = { tanggal: tgl };
            }
            
            // Masukkan angka kuota ke dalam nama jalur yang sesuai
            groupedData[tgl][namaJalur] = kuota;
          });

          // Mengubah wadah objek menjadi array agar bisa di-map ke dalam tabel
          const formattedArray = Object.values(groupedData);
          setDataKuota(formattedArray);
        }
      } catch (error) {
        console.error("Gagal memproses data kuota:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFormatData();
  }, []);

  // Fungsi untuk mengubah format tanggal '2026-07-10' menjadi 'Jumat, 10 Jul 2026'
  const formatTanggal = (tglString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(tglString);
    return date.toLocaleDateString('id-ID', options);
  };

  // Logika tampilan badge status
  const renderBadge = (kuota) => {
    // Jika data tidak ditemukan di database untuk jalur dan tanggal ini
    if (kuota === undefined || kuota === null) return <span className="text-gray-400 font-medium">-</span>;
    
    // Jika menggunakan -1 untuk status Tutup
    if (kuota < 0) return <span className="text-gray-500 font-medium">Tutup</span>;
    
    if (kuota === 0) return <span className="bg-red-100 text-red-700 py-1 px-6 rounded font-bold">{kuota}</span>;
    if (kuota > 0 && kuota <= 20) return <span className="bg-yellow-100 text-yellow-800 py-1 px-6 rounded font-bold">{kuota}</span>;
    
    return <span className="bg-green-100 text-green-700 py-1 px-6 rounded font-bold">{kuota}</span>;
  };

  return (
    <section className="py-12 px-8 md:px-12 bg-white w-full max-w-7xl mx-auto mt-10 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cek Kuota Terpadu</h2>
        <p className="text-gray-600">
          Pantau ketersediaan slot pendakian secara real-time untuk semua jalur resmi Gunung Prau.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <label className="text-gray-600 font-medium text-sm">Bulan & Tahun</label>
          <select className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>Juli 2026</option>
            <option>Agustus 2026</option>
          </select>
        </div>

        <div className="flex space-x-4 border border-gray-200 rounded-md px-4 py-2 bg-gray-50 text-sm">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-600 mr-2"></span>Tersedia</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-600 mr-2"></span>Terbatas</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>Penuh</div>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="py-4 px-6 font-medium">Tanggal</th>
              <th className="py-4 px-6 font-medium text-center">Jalur Patak Banteng</th>
              <th className="py-4 px-6 font-medium text-center">Jalur Dieng</th>
              <th className="py-4 px-6 font-medium text-center">Jalur Wates</th>
              <th className="py-4 px-6 font-medium text-center">Jalur Dwarawati</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 mr-3"></div>
                    Memuat data kuota harian...
                  </div>
                </td>
              </tr>
            ) : dataKuota.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-10 text-center text-gray-500">Data kuota belum tersedia untuk periode ini.</td>
              </tr>
            ) : (
              dataKuota.map((data, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-gray-800 font-medium">{formatTanggal(data.tanggal)}</td>
                  
                  {/* PENTING: Nama di dalam kurung siku harus SAMA PERSIS dengan isi kolom 'nama_jalur' di database */}
                  <td className="py-4 px-6 text-center">{renderBadge(data['Jalur Patak Banteng'])}</td>
                  <td className="py-4 px-6 text-center">{renderBadge(data['Jalur Dieng'])}</td>
                  <td className="py-4 px-6 text-center">{renderBadge(data['Jalur Wates'])}</td>
                  <td className="py-4 px-6 text-center">{renderBadge(data['Jalur Dwarawati'])}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CekKuota;