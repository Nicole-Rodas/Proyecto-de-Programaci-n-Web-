"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import LoginForm from "./login/LoginForm";
import RegisterForm from "./registro/RegisterForm";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"login" | "registro">("login");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      } else {
        setLoading(false); // Solo mostramos formulario si no está logueado
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        <div className="flex justify-around mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`px-4 py-2 rounded ${
              activeTab === "login" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setActiveTab("registro")}
            className={`px-4 py-2 rounded ${
              activeTab === "registro" ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            Registrarse
          </button>
        </div>

        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
