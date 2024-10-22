import ListingGallery from "../ui/home/listing-gallery";

export default async function Page({
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
        <ListingGallery onlySaved={true}/>
      </section>
    </>
  );
}
