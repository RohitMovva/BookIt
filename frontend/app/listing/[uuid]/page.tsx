interface ListingPageProps {
  params: {
    uuid: string;
  };
}

export default function ListingPage({ params }: ListingPageProps) {
  const { uuid } = params;

  return (
    <div>
      <h1>UUID: {uuid}</h1>
    </div>
  );
}
