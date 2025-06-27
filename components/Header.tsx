"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
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
            <Button onClick={handleLogout} variant="outline">
              Cerrar sesión
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleLogin} className="bg-white text-black hover:bg-gray-300">
              Iniciar sesión
            </Button>
            <Button onClick={handleRegister} variant="outline">
              Registrarse
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

