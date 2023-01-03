import Image from "next/image";

type PokemonData = {
  name: string;
  nationalDexNo: number;
};

type PokemonProps = {
  pokemon: PokemonData;
};

const PokemonCard = ({ pokemon }: PokemonProps): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white/20 p-4 shadow-lg hover:bg-white/40">
      <p className="text-xl text-white sm:text-2xl">{pokemon.name}</p>
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
