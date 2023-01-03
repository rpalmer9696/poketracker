type PokeDatum = {
  entry_number: number;
  pokemon_species: {
    name: string;
    url: string;
  };
};

type Pokemon = {
  name: string;
  region: string;
  regionalDexNo: number;
  nationalDexNo: number;
};

export async function getPokemonData(region: string): Promise<Pokemon[]> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokedex/${region}`);
  const data = await res.json();

  const allPokemon = await Promise.all(
    data.pokemon_entries.map(async (pokedatum: PokeDatum) => {
      const pokeSpecies = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokedatum.pokemon_species.name}`
      );
      const pokeSpeciesData = await pokeSpecies.json();

      const nationalDexNumber = pokeSpeciesData.pokedex_numbers.find(
        (pokedexNumber: any) => {
          if (pokedexNumber.pokedex.name === "national") {
            return true;
          }
        }
      );

      return {
        name: pokedatum.pokemon_species.name,
        region: region,
        regionalDexNo: pokedatum.entry_number,
        nationalDexNo: nationalDexNumber.entry_number,
      };
    })
  );

  allPokemon.sort((a, b) => a.regionalDexNo - b.regionalDexNo);
  return allPokemon;
}
