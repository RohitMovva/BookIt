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
  bgColor = "bg-gray-500",
  headerColor = "text-black",
  textColor = "text-black",
}: CardProps) {
  const cardText = (
    <div className="grid items-center justify-items-center">
      <h3 className="text-2xl">{header}</h3>
      <p>{text}</p>
    </div>
  );
  const sectionClasses =
    "min-h-64 min-w-64 rounded-xl grid justify-items-center items-center";
  if (img) {
    return (
      <section
        className={`${bgColor} ${headerColor} ${textColor} ${sectionClasses}`}
      >
        <Image src={img} width={32} height={32} alt={alt} />
        {cardText}
      </section>
    );
  }
  return (
    <section
      className={`${bgColor} ${headerColor} ${textColor} ${sectionClasses}`}
    >
      {cardText}
    </section>
  );
}
