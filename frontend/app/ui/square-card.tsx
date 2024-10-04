import Image from "next/image";

interface CardProps {
  img?: string;
  alt?: string;
  header?: string;
  text?: string;
  bgColor?: string;
  headerColor?: string;
  textColor?: string;
}

export default function SquareCard({
  img,
  alt = "",
  header = "Square Card",
  text = "Description text",
  bgColor = "bg-gradient-to-br from-[#e1f0ff] to-[#f1f4f9]",
  headerColor = "text-black",
  textColor = "text-black",
}: CardProps) {
  const sectionClasses = "h-80 rounded-xl grid justify-items-stretch items-end";
  if (img) {
    return (
      <section
        className={`${bgColor} ${headerColor} ${textColor} ${sectionClasses}`}
      >
        <Image src={img} width={32} height={32} alt={alt} />
        <h3 className="text-center text-2xl">{header}</h3>
        <p>{text}</p>
      </section>
    );
  }
  return (
    <section
      className={`${bgColor} ${headerColor} ${textColor} ${sectionClasses}`}
    >
      <div className="h-4/6">
        <h3 className="mb-5 text-center text-3xl">{header}</h3>
        <p className="mx-10">{text}</p>
      </div>
    </section>
  );
}
