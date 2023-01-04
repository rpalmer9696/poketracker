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

    return data;
  }),
  listPokemon: publicProcedure.query((req) => {
    return prisma.pokemon.findMany() || [];
  }),
  listCaughtPokemon: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(async (req): Promise<Pokemon[]> => {
      const user = await prisma.user.findUnique({
        where: { email: req.input.email },
      });

      const caughtPokemon = await prisma.caughtPokemon.findMany({
        where: {
          userId: user.id,
        },
      });

      return Promise.all(
        caughtPokemon.map(async (pokemon): Promise<Pokemon> => {
          return prisma.pokemon.findUnique({
            where: {
              id: pokemon.pokemonId,
            },
          });
        })
      );
    }),
  addPokemonToUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        region: z.string(),
        regionalDexNo: z.number(),
        email: z.string(),
      })
    )
    .mutation(async (req) => {
      const user = await prisma.user.findUnique({
        where: { email: req.input.email },
      });

      const pokemon = await prisma.pokemon.findFirst({
        where: {
          region: req.input.region,
          regionalDexNo: req.input.regionalDexNo,
        },
      });

      await prisma.caughtPokemon.create({
        data: {
          userId: user.id,
          pokemonId: pokemon.id,
        },
      });

      return pokemon;
    }),
  removePokemonFromUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        region: z.string(),
        regionalDexNo: z.number(),
        email: z.string(),
      })
    )
    .mutation(async (req) => {
      const user = await prisma.user.findUnique({
        where: { email: req.input.email },
      });

      const pokemon = await prisma.pokemon.findFirst({
        where: {
          region: req.input.region,
          regionalDexNo: req.input.regionalDexNo,
        },
      });

      const record = await prisma.caughtPokemon.findFirst({
        where: {
          userId: user.id,
          pokemonId: pokemon.id,
        },
      });

      await prisma.caughtPokemon.delete({
        where: {
          id: record.id,
        },
      });

      return pokemon;
    }),
});
