import Image from "next/image";

export default function TempLogo() {
  return (
    <div>
      <Image
        src="/temp-logo.png"
        width={32}
        height={32}
        alt="Logo of books"
      />
    </div>
  );
}
