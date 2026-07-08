const Navbar = () => {
  return (
    <nav className="w-full bg-white py-4 px-8 flex justify-between items-center shadow-sm">
      {/* Bagian Kiri: Logo */}
      <div className="text-2xl font-bold text-emerald-800 tracking-wide">
        PRAMAS
      </div>

      {/* Bagian Tengah: Menu Navigasi */}
      <ul className="hidden md:flex space-x-8 text-gray-600 font-medium text-sm">
        <li className="hover:text-emerald-700 cursor-pointer">Beranda</li>
        <li className="text-emerald-700 border-b-2 border-emerald-700 pb-1 cursor-pointer">
          Cek Kuota
        </li>
        <li className="hover:text-emerald-700 cursor-pointer">Panduan</li>
        <li className="hover:text-emerald-700 cursor-pointer">Jalur Pendakian</li>
      </ul>

      {/* Bagian Kanan: Tombol Login */}
      <div>
        <button className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2 rounded-md font-medium transition duration-300">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;