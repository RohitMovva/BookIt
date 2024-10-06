import Image from "next/image";

interface imageProps {
  img?: string;
  alt?: string;
  h?: string;
}

export default function ImageComponent({
  img = "/placeholderparrot.jpg",
  alt = "",
  h = "h-96",
}: imageProps) {
  return (
    <div className={`relative w-full overflow-hidden rounded-xl ${h}`}>
      <Image src={img} fill className="object-cover" alt={alt} />
    </div>
  );
}
