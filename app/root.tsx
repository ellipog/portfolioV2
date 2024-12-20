import { Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import styles from "./tailwind.css?url";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/start_logo.png" />
        <link rel="stylesheet" href="/font/PixeloidMono.ttf" />
        <link rel="stylesheet" href={styles} />
        <Meta />
      </head>
      <body className="h-screen w-screen bg-black">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
