import { type NextPage } from "next";
import AuthShowcase from "@/components/authButton";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  trpc.pokemon.populatePokemon.useQuery();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          PokeTracker
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">Ready to track some Pokemon?</p>
          {sessionData ? (
            <Link href="/pokeList">
              <a className="text-l text-blue-200 underline">Go to Tracker</a>
            </Link>
          ) : (
            ""
          )}
          <AuthShowcase positionStyle="flex flex-col items-center justify-center gap-4" />
        </div>
      </div>
    </div>
  );
};

export default Home;
