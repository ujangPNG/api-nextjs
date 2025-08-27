// src/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo atau Nama Aplikasi */}
        <Link href="/" className="text-xl font-bold hover:text-blue-400">
          apa aj bole
        </Link>

        {/* Menu Navigasi */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hover:text-blue-400">
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}