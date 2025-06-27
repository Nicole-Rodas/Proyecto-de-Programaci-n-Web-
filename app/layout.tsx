// app/layout.tsx

import Header from "@/components/Header";  // Importamos el Header
import "./globals.css";  // Asegúrate de que los estilos globales se mantengan

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;  // Este prop representa el contenido de cada página que se va a renderizar
}>) {
  return (
    <html lang="es">
      <body>
        {/* Renderizamos solo el Header en todas las páginas */}
        <Header />

        {/* Aquí se renderiza el contenido de cada página */}
        <main>{children}</main>
      </body>
    </html>
  );
}
