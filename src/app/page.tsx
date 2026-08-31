import HomeContent from "@/components/HomeContent";
import { getAllProperties } from "@/lib/properties";

export default async function Home() {
  const properties = await getAllProperties();
  return <HomeContent properties={properties} />;
}
