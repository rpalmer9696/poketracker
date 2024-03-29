import Head from "next/head";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>PokeTracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-cyan-500 to-blue-500">
        {children}
        <footer className="flex h-24 w-full flex-col items-center justify-center">
          <p className="text-white">
            Made with ❤️ by{" "}
            <Link
              href="https://github.com/rpalmer9696"
              className="text-underline text-blue-200"
            >
              @rpalmer9696
            </Link>
          </p>
        </footer>
      </main>
    </>
  );
}
