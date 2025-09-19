import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { LanguageProvider } from "./contexts/LanguageContext";

export function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
        />
        <title>Think in Sync</title>
        <meta name="description" content="A word puzzle game." />
        <meta name="author" content="Team M1X" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta property="og:image" content="/og-image.webp" />
        <link rel="preconnect" href="https://rrrchnzqzjbnphuurbio.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://y.sonnenhof-zieger.de" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/think-in-sync.webp" />
        <script defer data-domain="think-in-sync.com" src="https://y.sonnenhof-zieger.de/js/script.js"></script>
        <Meta />
        <Links />
      </head>
      <body style={{ height: "100%" }}>
        <div id="root">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <LanguageProvider>
      <Outlet />
    </LanguageProvider>
  );
}