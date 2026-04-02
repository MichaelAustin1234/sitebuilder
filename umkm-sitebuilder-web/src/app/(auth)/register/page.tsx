"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterPayload } from "@/lib/types";

interface RegisterForm extends RegisterPayload {}

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data);
    } catch (err: unknown) {
      const res = err as { message?: string; data?: { errors?: Record<string, string[]> } };
      if (res.data?.errors) {
        Object.entries(res.data.errors).forEach(([field, messages]) => {
          setError(field as keyof RegisterForm, { message: messages[0] });
        });
      } else {
        setError("root", { message: res.message ?? "Registrasi gagal. Coba lagi." });
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Buat akun baru</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {errors.root.message}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register("name", { required: "Nama wajib diisi", minLength: { value: 2, message: "Minimal 2 karakter" } })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Budi Santoso"
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email", { required: "Email wajib diisi", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Format email tidak valid" } })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="nama@email.com"
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password", { required: "Password wajib diisi", minLength: { value: 8, message: "Minimal 8 karakter" } })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
          <input
            id="password_confirmation"
            type="password"
            autoComplete="new-password"
            {...register("password_confirmation", {
              required: "Konfirmasi password wajib diisi",
              validate: (v) => v === password || "Password tidak cocok",
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="••••••••"
          />
          {errors.password_confirmation && <p className="text-red-600 text-xs mt-1">{errors.password_confirmation.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-indigo-600 hover:underline font-medium">
          Masuk di sini
        </Link>
      </p>
    </>
  );
}

