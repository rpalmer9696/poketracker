import { type NextPage } from "next";
import AuthShowcase from "../components/authButton";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          PokeTracker
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">Ready to track some Pokemon?</p>
          <AuthShowcase positionStyle="flex flex-col items-center justify-center gap-4" />
        </div>
      </div>
    </div>
  );
};

export default Home;
