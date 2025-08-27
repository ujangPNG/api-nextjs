// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm"; // 👈 Impor 'eq' untuk query 'where'

/**
 * @description Mengambil semua data user
 * @method GET
 */
export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return NextResponse.json(allUsers, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * @description Membuat user baru
 * @method POST
 */
export async function POST(request: Request) {
  try {
    const newUser = await request.json();

    if (!newUser.fullName || !newUser.email) {
      return NextResponse.json(
        { message: "Full name and email are required" },
        { status: 400 }
      );
    }

    // Langkah 1: Masukkan user baru (tanpa .returning())
    await db.insert(users).values(newUser);

    // Langkah 2: Ambil kembali data user yang baru saja dibuat berdasarkan email
    const insertedUser = await db
      .select()
      .from(users)
      .where(eq(users.email, newUser.email));

    // Pastikan user ditemukan sebelum mengirim respons
    if (insertedUser.length === 0) {
      return NextResponse.json(
        { message: "Failed to retrieve user after creation" },
        { status: 500 }
      );
    }

    return NextResponse.json(insertedUser[0], { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    // Cek jika error karena email duplikat
    if (error instanceof Error && error.message.includes('Duplicate entry')) {
        return NextResponse.json({ message: "Email already exists" }, { status: 409 }); // 409 Conflict
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}