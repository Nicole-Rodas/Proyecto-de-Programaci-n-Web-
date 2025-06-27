"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore();

export default function Dashboard() {
  const [plantillas, setPlantillas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
    });

    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "plantillas"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPlantillas(data);
      setLoading(false);
    };

    fetchData();

    return () => unsub();
  }, [router]);

  if (loading) return <p className="p-4">Cargando...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Plantillas</h1>
      <ul className="space-y-2">
        {plantillas.map((p) => (
          <li key={p.id} className="p-4 bg-white rounded shadow flex justify-between">
            <span>{p.nombre || "Plantilla sin nombre"}</span>
            <Link href={`/editor/${p.id}`} className="text-blue-500 hover:underline">
              Editar
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
