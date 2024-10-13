import ListingGallery from "./ui/home/listing-gallery";

export default async function Test({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  return (
    <>
      <section>
        <ListingGallery />
      </section>
    </>
  );
}
