import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  // useLocation digunakan untuk mengetahui kita sedang berada di URL mana
  const location = useLocation();

  // Fungsi dinamis untuk mengubah warna menu yang sedang aktif diklik
  const isActive = (path) => {
    return location.pathname === path 
      ? "text-emerald-700 border-b-2 border-emerald-700 pb-1 font-semibold" 
      : "text-gray-600 hover:text-emerald-700 transition duration-200";
  };

  return (
    <nav className="w-full bg-white py-4 px-8 flex justify-between items-center shadow-md sticky top-0 z-50">
      <div className="text-2xl font-bold text-emerald-800 tracking-wide">
        PRAMAS
      </div>

      <ul className="hidden md:flex space-x-8 font-medium text-sm">
        <li className={isActive('/')}>
          <Link to="/">Beranda</Link>
        </li>
        <li className={isActive('/cek-kuota')}>
          <Link to="/cek-kuota">Cek Kuota</Link>
        </li>
        <li className={isActive('/panduan')}>
          <Link to="/panduan">Panduan</Link>
        </li>
        <li className={isActive('/jalur')}>
          <Link to="/jalur">Jalur Pendakian</Link>
        </li>
      </ul>

      <div>
        <Link to="/login" className="bg-[#0f291e] hover:bg-emerald-900 text-white px-6 py-2 rounded-md font-bold transition duration-300">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;