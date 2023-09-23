import ChatWindow from "@/components/ChatWindow";
import { PlayerBlock } from "@/utils/player";

export default async function Home() {
  const playerJson = await fetch("http://localhost:3000/api/player", { method: "GET" })
  const hero = await playerJson.json()

  return (
    <main className="pt-[10dvh] bg-purple-50">
      <ChatWindow hero={hero[0] ?? null} />
    </main>
  )
}
