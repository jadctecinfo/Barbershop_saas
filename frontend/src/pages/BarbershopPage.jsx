import { useParams } from "react-router";

export default function BarbershopPage() {
const { slug } = useParams();

return (
<main>
<h1>Barbería</h1>

<p>
Slug público: {slug}
</p>
</main>
);
}