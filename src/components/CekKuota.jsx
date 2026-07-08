import { useState, useEffect } from 'react';
// import JalurService from '../services/JalurService'; // Nanti diaktifkan saat disambung ke database

const CekKuota = () => {
  const [loading, setLoading] = useState(false);
  
  // Data sementara (dummy) agar sesuai dengan desain UI teman Anda.
  // Nantinya, data ini akan diganti dengan hasil fetch dari JalurService.
  const [dataKuota, setDataKuota] = useState([
    { tanggal: '1 Nov 2024, Jumat', patakBanteng: 120, dieng: 85, kalilembu: 50, wekas: 30 },
    { tanggal: '2 Nov 2024, Sabtu', patakBanteng: 0, dieng: 15, kalilembu: 0, wekas: 5 },
    { tanggal: '3 Nov 2024, Minggu', patakBanteng: 25, dieng: 40, kalilembu: 10, wekas: 20 },
    { tanggal: '4 Nov 2024, Senin', patakBanteng: 'Tutup', dieng: 'Tutup', kalilembu: 'Tutup', wekas: 'Tutup' },
    { tanggal: '5 Nov 2024, Selasa', patakBanteng: 150, dieng: 100, kalilembu: 50, wekas: 50 },
  ]);

  // Fungsi khusus untuk mengatur warna angka kuota otomatis (Dynamic Styling)
  const renderBadge = (kuota) => {
    if (kuota === 'Tutup') return <span className="text-gray-500 font-medium">Tutup</span>;
    
    // Jika penuh (0), warna merah
    if (kuota === 0) return <span className="bg-red-100 text-red-700 py-1 px-6 rounded font-bold">{kuota}</span>;
    
    // Jika terbatas (di bawah 20), warna kecoklatan/kuning
    if (kuota > 0 && kuota <= 20) return <span className="bg-yellow-100 text-yellow-800 py-1 px-6 rounded font-bold">{kuota}</span>;
    
    // Jika tersedia banyak, warna hijau
    return <span className="bg-green-100 text-green-700 py-1 px-6 rounded font-bold">{kuota}</span>;
  };

  return (
    <section className="py-12 px-8 md:px-12 bg-white w-full max-w-7xl mx-auto mt-10 rounded-2xl shadow-sm border border-gray-100">
      {/* Header Bagian */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cek Kuota Terpadu</h2>
        <p className="text-gray-600">
          Pantau ketersediaan slot pendakian secara real-time untuk semua jalur resmi Gunung Prau.
        </p>
      </div>

      {/* Filter dan Keterangan */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <label className="text-gray-600 font-medium text-sm">Bulan & Tahun</label>
          <select className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>November 2024</option>
            <option>Desember 2024</option>
          </select>
        </div>

        {/* Legend / Keterangan Warna */}
        <div className="flex space-x-4 border border-gray-200 rounded-md px-4 py-2 bg-gray-50 text-sm">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-600 mr-2"></span>Tersedia</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-600 mr-2"></span>Terbatas</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-600 mr-2"></span>Penuh</div>
        </div>
      </div>

      {/* Tabel Kuota */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="py-4 px-6 font-medium">Tanggal</th>
              <th className="py-4 px-6 font-medium text-center">Jalur Patak Banteng</th>
              <th className="py-4 px-6 font-medium text-center">Jalur Dieng</th>
              <th className="py-4 px-6 font-medium text-center">Jalur Kalilembu</th>
              <th className="py-4 px-6 font-medium text-center">Jalur Wekas</th>
            </tr>
          </thead>
          <tbody>
            {dataKuota.map((data, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="py-4 px-6 text-gray-800">{data.tanggal}</td>
                <td className="py-4 px-6 text-center">{renderBadge(data.patakBanteng)}</td>
                <td className="py-4 px-6 text-center">{renderBadge(data.dieng)}</td>
                <td className="py-4 px-6 text-center">{renderBadge(data.kalilembu)}</td>
                <td className="py-4 px-6 text-center">{renderBadge(data.wekas)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CekKuota;