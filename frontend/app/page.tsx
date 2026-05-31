import { api } from "@/lib/api";
import FrontView from "@/components/FrontView";

export const dynamic = "force-dynamic";

export default async function Home() {
  const D = await api.front();
  return <FrontView D={D} />;
}
