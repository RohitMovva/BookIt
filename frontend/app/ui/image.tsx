import Image from "next/image";

interface imageProps {
  img?: string;
  alt?: string;
  h?: string;
  w?: string;
}

export default function ImageComponent({
  img = "/placeholderparrot.jpg",
  alt = "",
  h = "",
  w = "",
}: imageProps) {
  return (
    <div className={`relative w-full overflow-hidden rounded-xl ${h} ${w}`}>
      <Image src={img} fill className="object-cover" alt={alt} />
    </div>
  );
}
