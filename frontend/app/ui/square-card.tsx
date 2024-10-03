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
  bgColor = "bg-blue-100",
  headerColor = "text-black",
  textColor = "text-black",
}: CardProps) {
  const sectionClasses =
    "h-72 rounded-xl grid justify-items-center items-center";
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
      <h3 className="text-center text-2xl">{header}</h3>
      <p>{text}</p>
    </section>
  );
}
