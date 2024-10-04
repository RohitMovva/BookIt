"use client";
import TempLogo from "./ui/temp-logo";
import Button from "./ui/button";
import Image from "next/image";
import SquareCard from "./ui/square-card";

export default function Page() {
  return (
    <div className="grid gap-y-20 md:gap-y-40">
      <header>
        <ul className="flex h-16 justify-between p-10">
          <div className="flex h-full items-center space-x-4">
            <li>
              <TempLogo />
            </li>
            <li>
              <p className="text-3xl text-blue-400">bookit</p>
            </li>
          </div>
          <div className="flex h-full items-center space-x-4">
            <li>
              <Button text="Sign Up" href="/databasetest" />
            </li>
            <li>
              <Button
                text="Log In"
                border="border"
                borderColor="border-black"
                bgColor="bg-white"
                textColor="text-black"
              />
            </li>
          </div>
        </ul>
      </header>
      <div className="mx-12 grid gap-y-20 md:mx-40 lg:gap-y-40 xl:mx-56">
        <section className="grid grid-cols-1 items-center justify-between gap-10 lg:grid-cols-2">
          <div>
            <h1 className="mb-8 text-7xl">
              Shopping for course materials made easy
            </h1>
            <Button text="Sign Up" href="" />
          </div>
          <Image
            src="/placeholderparrot.jpg"
            width={750}
            height={500}
            alt="Parrot"
          />
        </section>
        <section className="grid gap-y-16">
          <h2 className="text-center text-5xl">
            Buy and Sell Within Your Community
          </h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <SquareCard
              header="Save Time"
              text="Spend less time searching for required course materials online."
            />
            <SquareCard
              header="Save money"
              text="Lower prices with no shipping costs. A convenient solution to a common problem."
            />
            <SquareCard
              header="It's eco-friendly"
              text="Reuse course materials with no need for shipping."
            />
          </div>
        </section>
        <section></section>
      </div>
    </div>
  );
}
