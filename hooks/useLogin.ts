"use client";
import { useState, useCallback } from "react";
import { auth, signInWithEmailAndPassword } from "../lib/firebase";
import { useRouter } from "next/router";

export function useLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Función para manejar el login
  const handleLogin = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true); // Actualiza el estado de autenticación
      router.push("/dashboard"); // Redirige al dashboard
    } catch (err) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  }, [email, password, router]);

  // Función para manejar el cambio de email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Función para manejar el cambio de contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return {
    email,
    password,
    error,
    isAuthenticated,
    handleLogin,
    handleEmailChange,
    handlePasswordChange,
  };
}
