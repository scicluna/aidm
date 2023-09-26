import ChatWindow from "@/components/ChatWindow";
import Game from "@/components/Game";

export default async function Home() {

  //grab all save slots or null
  let heroData: any;
  try {
    const playerSaves = await fetch("http://localhost:3000/api/player", {
      method: "GET",
      cache: "no-store"
    })
    heroData = await playerSaves.json()
  } catch {
    heroData = null
  }

  //Before chatwindow -> make load save file window
  return (
    <main className="pt-[10dvh] bg-purple-50">
      <Game heroData={heroData} />
    </main>
  )
}
