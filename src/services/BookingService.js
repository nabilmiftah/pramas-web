import BaseService from './BaseService.js';

class BookingService extends BaseService {
  constructor() {
    // Mengirim nama tabel 'Booking_Transaksi' ke BaseService
    super('booking_transaksi');
  }

  // Method KHUSUS untuk menambahkan data booking baru (Insert)
  // Ini menunjukkan bahwa class anak bisa punya kemampuan spesifik
  async createBooking(dataBooking) {
    const { data, error } = await this.db
      .from(this.tableName)
      .insert([dataBooking])
      .select(); // Mengembalikan data yang baru saja dimasukkan

    if (error) {
      console.error(`Error membuat booking baru:`, error.message);
      throw new Error(error.message);
    }
    return data;
  }
}

export default new BookingService();