import { z } from "zod";

import { router, publicProcedure } from "../trpc";

import { prisma } from "@/server/db/client";

import { getPokemonData } from "@/utils/getPokemonData";
import config from "@/server/common/config";
import { TRPCError } from "@trpc/server";

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
          userId: user?.id,
        },
      });

      const pokemon = await Promise.all(
        caughtPokemon.map(async (pokemon) => {
          return prisma.pokemon.findUnique({
            where: {
              id: pokemon.pokemonId,
            },
          });
        })
      );

      return pokemon.filter((pokemon) => pokemon !== null) as Pokemon[];
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

      if (user && pokemon) {
        await prisma.caughtPokemon.create({
          data: {
            userId: user.id,
            pokemonId: pokemon.id,
          },
        });

        return pokemon;
      }

      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Either the provided email or pokemon does not exist.",
      });
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
          userId: user?.id,
          pokemonId: pokemon?.id,
        },
      });

      await prisma.caughtPokemon.delete({
        where: {
          id: record?.id,
        },
      });

      return pokemon;
    }),
  searchPokemon: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async (req) => {
      if (!req.input.name) return prisma.pokemon.findMany() || [];
      const pokemon = await prisma.pokemon.findMany({
        where: {
          name: {
            contains: req.input.name,
          },
        },
      });

      return pokemon;
    }),
});
