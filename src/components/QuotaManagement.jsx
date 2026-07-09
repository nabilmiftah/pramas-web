import React from 'react';

const QuotaManagement = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      {/* Header & Tombol Darurat */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#0f291e]">Manajemen Kuota</h2>
          <p className="text-gray-500 mt-1 text-sm">Kelola alokasi harian dan pantau kapasitas jalur pendakian.</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          Tutup Jalur Darurat
        </button>
      </div>

      {/* Filter & Update Massal */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 flex gap-4 items-center">
        <select className="border-gray-200 rounded-lg text-sm p-2.5 w-48 border">
          <option>Semua Jalur</option>
        </select>
        <input type="month" className="border-gray-200 rounded-lg text-sm p-2.5 w-48 border" />
        <button className="ml-auto border border-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center hover:bg-gray-50">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          Update Massal
        </button>
      </div>

      {/* Tabel Kuota */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Patak Banteng</th>
              <th className="px-6 py-4">Dieng</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hover:bg-gray-50/50">
              <td className="px-6 py-4 font-semibold">01 Mei 2024 <br/> <span className="text-xs text-gray-400">Rabu</span></td>
              <td className="px-6 py-4">
                 <div className="w-32 h-2 bg-gray-100 rounded-full mb-1"><div className="h-full bg-emerald-700 rounded-full w-[75%]"></div></div>
                 <div className="flex justify-between items-center w-32">
                    <span className="text-sm font-bold">150/200</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded">Tersedia</span>
                 </div>
              </td>
              <td className="px-6 py-4">
                 <div className="w-32 h-2 bg-gray-100 rounded-full mb-1"><div className="h-full bg-red-600 rounded-full w-[100%]"></div></div>
                 <div className="flex justify-between items-center w-32">
                    <span className="text-sm font-bold">100/100</span>
                    <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded">Penuh</span>
                 </div>
              </td>
              <td className="px-6 py-4 text-right">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuotaManagement;