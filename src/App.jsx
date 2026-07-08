import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Memanggil komponen Navbar */}
      <Navbar />

      {/* Area Konten Utama nantinya akan diletakkan di bawah sini */}
      <main>
        <Hero />
      </main>
    </div>
  );
}

export default App;