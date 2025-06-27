"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "@/lib/firebase";

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const db = getFirestore();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Guardar perfil en Firestore
      await setDoc(doc(db, "usuarios", uid), {
        nombre,
        email,
        rol: "usuario",
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError("Error al registrar: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <form onSubmit={handleRegistro} className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Registro</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="p-2 border rounded mb-2 w-full"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded mb-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded mb-4 w-full"
          required
        />
        <button type="submit" className="bg-black text-white py-2 rounded hover:bg-gray-800 w-full">
          Registrarse
        </button>
      </form>
    </div>
  );
}
