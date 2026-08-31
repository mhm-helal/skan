import { getPropertyById } from "@/lib/properties";
import PropertyDetailClient from "./PropertyDetailClient";
import { notFound } from "next/navigation";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPropertyById(Number(id));
  if (!property) return notFound();

  return <PropertyDetailClient property={property} />;
}
