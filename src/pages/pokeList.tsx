import type { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import AuthShowcase from "../components/authButton";

const pokemon = [
  "Bulbasaur",
  "Ivysaur",
  "Venusaur",
  "Charmander",
  "Charmeleon",
  "Charizard",
  "Squirtle",
  "Wartortle",
  "Blastoise",
  "Caterpie",
  "Metapod",
  "Butterfree",
  "Weedle",
  "Kakuna",
  "Beedrill",
  "Pidgey",
  "Pidgeotto",
];

const PokeList: NextPage = () => {
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
      <div className="grid auto-cols-auto place-items-center p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {pokemon.map((item, id) => (
          <div key={id}>{item}</div>
        ))}
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
