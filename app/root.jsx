import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
// import { LinksFunction } from "@remix-run/node"; // or cloudflare/deno

import stylesheet from "./tailwind.css?url";

export const links = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <script src="https://cdn.tailwindcss.com"></script>
        {/* <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        /> */}
        <Meta />
        <Links />
      </head>
      <body>
        <h1 className="bg-red-500">Hello World</h1>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
