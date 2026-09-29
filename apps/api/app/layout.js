export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui", padding: 24 }}>
        {children}
      </body>
    </html>
  );
}
