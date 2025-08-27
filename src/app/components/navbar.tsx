// src/components/Navbar.tsx
import Link from 'next/link';
// import { getServerSession } from "next-auth"; // Akan kita gunakan nanti
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Akan kita gunakan nanti

// Ubah fungsi menjadi async
export default async function Navbar() {
  // const session = await getServerSession(authOptions); // 👈 Baris ini akan mengambil sesi user di server
  const session = null; // 👈 Untuk sementara, kita anggap user belum login

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-blue-400">
          ap aja bole
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            // Jika user SUDAH login
            <>
              {/* <p>Halo, {session.user?.name}</p> */}
              <p>Halo, User!</p>
              <Link
                href="/api/auth/signout"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </Link>
            </>
          ) : (
            // Jika user BELUM login
            <>
              <Link href="/login" className="hover:text-blue-400">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}