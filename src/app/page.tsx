import HomeContent from "@/components/HomeContent";
import { getAllProperties } from "@/lib/properties";

export default function Home() {
  const properties = getAllProperties();
  return <HomeContent properties={properties} />;
}
