import { router } from "../trpc";
import { authRouter } from "./auth";
import { pokemonRouter } from "./pokemon";

export const appRouter = router({
  auth: authRouter,
  pokemon: pokemonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
