"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ButtonLogin from "@/components/ui/buttonLogin";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/registro");

  return (
    <header className="w-full bg-black text-white p-4 mb-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">EDITOR DE NIVELES</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.email}</span>
            <ButtonLogin onClick={handleLogout}>
              Cerrar sesión
            </ButtonLogin>
          </div>
        ) : (
          <div className="flex gap-2">
            <ButtonLogin onClick={handleLogin}>
              Iniciar sesión
            </ButtonLogin>
            <ButtonLogin onClick={handleRegister}>
              Registrarse
            </ButtonLogin>
          </div>
        )}
      </div>
    </header>
  );
}
