import Image from "next/image";

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
    <article className="grid place-content-center p-5">
      <h3 className="mb-5 text-4xl">{header}</h3>
      <p className="">{text}</p>
    </article>
  );
  return (
    <section className="grid gap-4 rounded-xl lg:grid-cols-2">
      {leftSide}
      <Image
        className="place-self-center justify-self-center rounded-xl"
        src={img}
        width={750}
        height={500}
        alt={alt}
      />
    </section>
  );
}
