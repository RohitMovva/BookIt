"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";
import Button from "../button";
import DropdownButton from "../button-dropdown";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="flex h-12 w-full transform items-center justify-center rounded-xl border border-gray-400 pl-12 placeholder:text-gray-500 focus:outline-none"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Image
          src={"/search-interface-symbol.png"}
          height={20}
          width={20}
          alt=""
        />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <DropdownButton
          text="Sort by"
          bgColor="bg-white"
          textColor="text-black"
          border="border-r border-y"
          borderColor="border-gray-400"
          rounded="rounded-r-xl"
          bgHover="hover:bg-gray-400"
          caretBlack={true}
          options={[
            { label: "Profile", href: "/profile" },
            { label: "Settings", href: "/settings" },
            {
              label: "Logout",
            },
          ]} isOpen={false}        />
      </div>
    </div>
  );
}
