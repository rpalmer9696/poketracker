import type { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import AuthShowcase from "@/components/authButton";
import PokemonCard from "@/components/pokemonCard";
import { trpc } from "@/utils/trpc";

const PokeList: NextPage = () => {
  const { data: sessionData } = useSession();
  const pokemonData = trpc.pokemon.listPokemon.useQuery();

  const caughtPokemon = trpc.pokemon.listCaughtPokemon.useQuery({
    email: sessionData?.user?.email as string,
  });

  const caughtPokemonData = caughtPokemon.data;

  return (
    <>
      <div className="flex flex-row items-center justify-between p-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-5xl">
          PokeTracker
        </h1>
        <AuthShowcase />
      </div>
      <div className="p-4">
        <input
          className="w-full rounded p-4"
          placeholder="Search for a Pokemon"
          type="search"
        />
      </div>
      <div className="grid auto-cols-auto place-items-center gap-4 p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {pokemonData.data?.map((item, id) => {
          return (
            <PokemonCard
              key={id}
              pokemon={item}
              isCaught={checkPokemonIsCaught(item, caughtPokemonData)}
            />
          );
        })}
      </div>
    </>
  );
};

export default PokeList;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

const checkPokemonIsCaught = (pokemon, caughtPokemon) => {
  return caughtPokemon.some((p) => {
    return p.regionalDexNo === pokemon.regionalDexNo;
  });
};
