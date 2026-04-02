"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import type { LoginPayload } from "@/lib/types";

interface LoginForm extends LoginPayload {}

export default function LoginPage() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
    } catch (err: unknown) {
      const res = err as { message?: string; data?: { errors?: Record<string, string[]> } };
      // Laravel validation errors (422)
      if (res.data?.errors) {
        Object.entries(res.data.errors).forEach(([field, messages]) => {
          setError(field as keyof LoginForm, { message: messages[0] });
        });
      } else {
        setError("root", { message: res.message ?? "Login gagal. Periksa email dan password." });
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Masuk ke akun</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {errors.root.message}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email", { required: "Email wajib diisi" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="nama@email.com"
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password", { required: "Password wajib diisi" })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Belum punya akun?{" "}
        <Link href="/register" className="text-indigo-600 hover:underline font-medium">
          Daftar sekarang
        </Link>
      </p>
    </>
  );
}

