import BaseService from './BaseService.js';

// JalurService mewarisi (extends) semua kemampuan dari BaseService
class JalurService extends BaseService {
  constructor() {
    // super() digunakan untuk mengirim nama tabel ke Class Induk (BaseService)
    super('Jalur_Pendakian');
  }

  // Karena sudah menggunakan 'extends', class ini otomatis memiliki 
  // fungsi getAll() dan getById() tanpa perlu kita tulis ulang!
  
  // Nanti kita bisa menambahkan fungsi khusus di sini, 
  // misalnya: getJalurTermurah() atau getJalurDenganKuotaTerbanyak()
}

// Kita langsung mengekspor sebagai objek agar siap dipakai
export default new JalurService();