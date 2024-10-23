"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";
import Button from "../button";
import StyledSelect from "../select";
import DropdownButton from "../button-dropdown";
import { useState } from "react";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const sortBy = searchParams.get("sort") || "Featured";

  const [sort, setSort] = useState(sortBy);

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    const params = new URLSearchParams(searchParams.toString());

    if (value === "") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    setSort(value);
    replace(`${pathname}?${params.toString()}`);
  };

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
        <StyledSelect
          name="Sort By"
          className="rounded-l-none border-l-0"
          value={sort}
          onChange={handleChange}
          options={[
            { label: "Relevance", value: "" },
            { label: "Most saved", value: "saved" },
            { label: "$ low to high", value: "low" },
            { label: "$ high to low", value: "high" },
          ]}
        />
      </div>
    </div>
  );
}
