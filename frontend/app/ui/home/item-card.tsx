import ImageComponent from "../image";

interface cardProps {
    title?: string;
    description?: string;
    price?: string;
    image?: string;
}

export default function ItemCard({
    title = "Parrot",
    description = "Description description description description description",
    price = "20",

}: cardProps) {
    return (
        <>
            <ImageComponent />
        </>
    );
}