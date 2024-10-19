import Image from "next/image";

export default function Logo() {
  return (
    <div>
      <Image
        src="/logo.png"
        width={32}
        height={32}
        alt="Logo of books"
      />
    </div>
  );
}
