import { signIn, signOut, useSession } from "next-auth/react";

type AuthShowcaseProps = {
  positionStyle?: string;
};

const AuthShowcase = ({ positionStyle }: AuthShowcaseProps): JSX.Element => {
  const { data: sessionData } = useSession();

  return (
    <div className={positionStyle}>
      <button
        className="rounded-full bg-white/20 px-5 py-3 font-semibold text-white no-underline transition hover:bg-white/40 sm:px-10"
        onClick={
          sessionData
            ? () => signOut()
            : () => signIn("google", { callbackUrl: "/pokeList" })
        }
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default AuthShowcase;
