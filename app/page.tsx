import ChatWindow from "@/components/ChatWindow";

export default async function Home() {

  //try to fetch heroData on server side
  let heroData: any;
  try {
    const playerJson = await fetch("http://localhost:3000/api/player", {
      method: "GET",
      cache: "no-store"
    })
    const data = await playerJson.json()
    heroData = data[0]
  } catch {
    heroData = null
  }

  return (
    <main className="pt-[10dvh] bg-purple-50">
      <ChatWindow heroData={heroData} />
    </main>
  )
}
