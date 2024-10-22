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
  // const user = 
  return (
    <>
      <section>
        <ListingGallery hasUser={true}/>
      </section>
    </>
  );
}
