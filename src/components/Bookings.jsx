import React, { useState, useEffect } from 'react';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('Semua');
  const role = localStorage.getItem('role');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    let { data, error } = await supabase.from('booking_transaksi').select('*');
    if (!error) setBookings(data);
  };

  const tabs = ['Semua', 'Menunggu', 'Disetujui', 'Ditolak'];

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <h2 className="text-2xl font-bold text-[#0f291e] mb-6">Manajemen Pemesanan</h2>

      {role === 'admin' ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* TAB FILTER */}
          <div className="p-6 border-b border-gray-100 flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === tab ? 'bg-emerald-50 text-emerald-800' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab} ({bookings.length})
              </button>
            ))}
          </div>

          {/* TABEL */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">ID Booking</th>
                  <th className="px-6 py-4">Ketua Rombongan</th>
                  <th className="px-6 py-4">Jalur Pendakian</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0f291e]">{b.id_booking}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                          {b.nama_ketua.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-700">{b.nama_ketua}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.jalur}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{b.tgl_pendakian}</td>
                    <td className="px-6 py-4">
                      {/* Status Badge Dinamis */}
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                        b.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-700' : 
                        b.status === 'Ditolak' ? 'bg-red-50 text-red-600' : 
                        'bg-yellow-50 text-yellow-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition">
                        Tinjau
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAMPILAN KARTU PENDAKI (Bisa kita rapikan nanti) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* ... kode kartu pendaki ... */}
        </div>
      )}
    </div>
  );
};

export default Bookings;