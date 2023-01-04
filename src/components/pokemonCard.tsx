import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";

type PokemonData = {
  name: string;
  region: string;
  regionalDexNo: number;
  nationalDexNo: number;
};

type PokemonProps = {
  pokemon: PokemonData;
  isCaught: boolean;
};

const togglePokemon = (
  e: ChangeEvent<HTMLInputElement>,
  email: string,
  pokemon: PokemonData,
  addPokemonToUser: any,
  removePokemonFromUser: any
) => {
  if (e.target.checked) {
    addPokemonToUser.mutate({
      name: pokemon.name,
      region: pokemon.region,
      regionalDexNo: pokemon.regionalDexNo,
      email: email,
    });

    return;
  }

  removePokemonFromUser.mutate({
    name: pokemon.name,
    region: pokemon.region,
    regionalDexNo: pokemon.regionalDexNo,
    email: email,
  });
};

const PokemonCard = ({ pokemon, isCaught }: PokemonProps): JSX.Element => {
  const [caught, setCaught] = useState(isCaught);
  const { data: sessionData } = useSession();
  const addPokemonToUser = trpc.pokemon.addPokemonToUser.useMutation();
  const removePokemonFromUser =
    trpc.pokemon.removePokemonFromUser.useMutation();

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white/20 p-4 shadow-lg hover:bg-white/40">
      <div className="flex flex-row items-center">
        <input
          type="checkbox"
          checked={caught}
          className="mr-2 h-6 w-6 cursor-pointer"
          onClick={(e) => setCaught(!caught)}
          onChange={(e) =>
            togglePokemon(
              e,
              sessionData?.user?.email as string,
              pokemon,
              addPokemonToUser,
              removePokemonFromUser
            )
          }
        />
        <p className="text-xl text-white sm:text-2xl">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </p>
      </div>
      <Image
        alt={pokemon.name}
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.nationalDexNo}.png`}
        width={256}
        height={256}
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
};

export default PokemonCard;
