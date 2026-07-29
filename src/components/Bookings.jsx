import React from 'react';
import BookingAdmin from './BookingAdmin';
import BookingPendaki from './BookingPendaki';

const Bookings = () => {
  // Ambil role dari local storage
  const role = localStorage.getItem('role') || 'pendaki';

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-fade-in">
      {/* Render komponen secara kondisional berdasarkan role */}
      {role === 'admin' ? <BookingAdmin /> : <BookingPendaki />}
    </div>
  );
};

export default Bookings;