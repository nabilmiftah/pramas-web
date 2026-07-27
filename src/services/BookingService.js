import BaseService from './BaseService.js';

class BookingService extends BaseService {
  constructor() {
    // Mengirim nama tabel 'booking_transaksi' ke BaseService
    super('booking_transaksi');
  }

  // Method KHUSUS untuk menambahkan data booking baru (Insert 1 tabel - bawaan Anda)
  async createBooking(dataBooking) {
    const { data, error } = await this.db
      .from(this.tableName)
      .insert([dataBooking])
      .select(); 

    if (error) {
      console.error(`Error membuat booking baru:`, error.message);
      throw new Error(error.message);
    }
    return data;
  }

  // Method BARU untuk transaksi lengkap (Insert 2 tabel: Booking & Anggota)
  async submitBooking(bookingHeader, daftarAnggota) {
    try {
      // 1. Insert ke tabel booking_transaksi
      const { data: insertedBooking, error: bookingError } = await this.db
        .from(this.tableName)
        .insert([bookingHeader])
        .select()
        .single(); // Ambil 1 baris data yang baru saja masuk agar kita dapat id_booking-nya

      if (bookingError) throw bookingError;

      // 2. Format array daftarAnggota agar sesuai dengan struktur kolom di tabel database
      // 2. Format array daftarAnggota agar sesuai dengan struktur kolom di tabel database lama Anda
      const anggotaToInsert = daftarAnggota.map((anggota) => {
        // Ambil huruf pertama dari gender (Laki-laki -> 'L', Perempuan -> 'P')
        // Pastikan menangani case jika user belum memilih (undefined/null)
        const formatGender = anggota.gender ? anggota.gender.charAt(0).toUpperCase() : '-';

        return {
          id_booking: insertedBooking.id_booking, 
          nama_anggota: anggota.nama,             
          nik_identitas: anggota.nik,             
          jenis_kelamin: formatGender             // Sekarang hanya mengirim 'L' atau 'P'
        };
      });
      // 3. Insert ke tabel anggota_rombongan (Bulk Insert)
      const { error: anggotaError } = await this.db
        .from('anggota_rombongan')
        .insert(anggotaToInsert);

      if (anggotaError) throw anggotaError;

      return { success: true, data: insertedBooking };
      
    } catch (error) {
      console.error("Terjadi kesalahan saat menyimpan booking:", error.message);
      return { success: false, error: error.message };
    }
  }
}

export default new BookingService();