"use client";
import ImageComponent from "./ui/image";
import Button from "./ui/hero/button";
import SquareCard from "./ui/hero/square-card";
import TwoColTextLeft from "./ui/hero/two-col-text-left";
import CollapsibleComponent from "./ui/hero/collapsible";
import Header from "./ui/hero/header";

export default function Hero() {
  const intraSectiongapy = "grid gap-y-20";
  return (
    <div className="grid gap-y-20 text-pretty lg:gap-y-40">
      {/* Fixed header */}
      <Header />
      {/* Main content */}
      <div
        className={`${intraSectiongapy} mx-12 md:mx-40 lg:mx-20 lg:gap-y-40 2xl:mx-56`}
      >
        {/* Big Header */}
        <section
          className={`${intraSectiongapy} items-center justify-between gap-x-12 lg:grid-cols-2`}
        >
          <div>
            <h1 className="mb-5 text-7xl">
              Shopping for course materials made easy
            </h1>
            <Button text="Sign Up" href="" />
          </div>
          <ImageComponent />
        </section>
        {/* Square Cards */}
        <section className={`${intraSectiongapy}`}>
          <h2 className="text-center text-5xl">
            Buy and Sell Within Your Community
          </h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
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
        {/* Features Section */}
        <section className={`${intraSectiongapy}`}>
          <h2 className="text-center text-5xl">Features</h2>
          <TwoColTextLeft
            header="Robust search and filter"
            text="Use our intelligent search to find by title, class or more! In additon, filter based on numerous options to find what you need."
          />
          <TwoColTextLeft
            header="Quickly create listings"
            text="Add images, tags, location, and more! Easily make your listing accessible to people interested."
          />
          <TwoColTextLeft
            header="Save listings for later"
            text="Easily bookmark listings for future reference. Never lose track of a material you need!"
          />
        </section>
        {/* FAQs */}
        <section
          className={`${intraSectiongapy} grid-cols-1 md:grid-cols-[40%_60%]`}
        >
          <h2 className="text-5xl">FAQs</h2>
          <div className="grid gap-5">
            <CollapsibleComponent
              header="What is bookit?"
              text="Bookit is a student made website to buy and sell course materials within your school."
            />
            <CollapsibleComponent
              header="What can I use bookit for?"
              text="After you have taken a class, you can sell the textbook to a student a grade below you. You can also sell uniforms that don't fit anymore, or any school supplies that you dont use."
            />
            <CollapsibleComponent
              header="Where do I meet to buy or sell course materials?"
              text="Typically the purchaser and seller meet on school grounds. This is convenient and safe for both parties."
            />
            <CollapsibleComponent
              header="Does my school have bookit?"
              text="Right now, bookit is only for Peak to Peak Charter school. However, we are hoping to expand in the future."
            />
          </div>
        </section>
        {/* Admin Section */}
        <section className="grid gap-y-10">
          <h2 className="text-center text-5xl">
            Looking to get Bookit for your school?
          </h2>
          <h3 className="text-center text-2xl">
            Take a look at the process and admin features.
          </h3>
          <div className="place-self-center">
            <Button text="Get bookit for you school" />
          </div>
        </section>
      </div>
      {/* Footer */}
      <footer className="bg-blue-50 p-20">
        <p>footer will go here</p>
      </footer>
    </div>
  );
}
