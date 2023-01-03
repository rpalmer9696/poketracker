import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { prisma } from "@/server/db/client";

import { getPokemonData } from "@/utils/getPokemonData";
import config from "@/server/common/config";

type Pokemon = {
  name: string;
  region: string;
  regionalDexNo: number;
  nationalDexNo: number;
};

export const pokemonRouter = router({
  populatePokemon: publicProcedure.query(async (req) => {
    const data = await prisma.pokemon.findMany();

    if (data.length === 0) {
      const pokemonCollection = await getPokemonData(config.region);
      await prisma.pokemon.createMany({ data: pokemonCollection });
    }
  }),
  listPokemon: publicProcedure.query((req) => {
    return prisma.pokemon.findMany() || [];
  }),
  addPokemon: publicProcedure
    .input(
      z.object({
        name: z.string(),
        region: z.string(),
        regionalDexNo: z.number(),
        nationalDexNo: z.number(),
      })
    )
    .mutation((req) => {
      const pokemon: Pokemon = {
        name: req.input.name,
        region: req.input.region,
        regionalDexNo: req.input.regionalDexNo,
        nationalDexNo: req.input.nationalDexNo,
      };

      prisma.pokemon?.create({ data: pokemon });

      return pokemon;
    }),
});
