import ImageComponent from "./image";

interface props {
  header?: string;
  text?: string;
  img?: string;
  alt?: string;
}

export default function TwoColTextLeft({
  header = "Header",
  text = "Description text",
  img = "/placeholderparrot.jpg",
  alt = "",
}: props) {
  const leftSide = (
    <article className="grid content-center p-5">
      <h3 className="mb-5 text-4xl">{header}</h3>
      <p>{text}</p>
    </article>
  );
  return (
    <section className="grid gap-4 rounded-xl lg:grid-cols-2">
      {leftSide}
      <ImageComponent />
    </section>
  );
}
