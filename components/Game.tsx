'use client'

import { HeroData, PlayerBlock } from "@/utils/player"
import { useState } from "react"
import ChatWindow from "./ChatWindow"
import HeroSelect from "./HeroSelect"
import Navbar from "./Navbar"

type GameProps = {
    heroData: HeroData[]
}

export default function Game({ heroData }: GameProps) {
    const [darkMode, setDarkMode] = useState<boolean>(true)
    const [hero, setHero] = useState<PlayerBlock | null>(null)
    const [newPlayer, setNewPlayer] = useState<boolean>(false)

    function selectHero(heroIndex: number) {
        const selectedHero = heroData[heroIndex]
        setHero(new PlayerBlock(selectedHero, selectedHero?.name || "Hero"))
    }

    function createNewHero(e: React.FormEvent, name: string) {
        e.preventDefault()
        setHero(new PlayerBlock(null, name))
        setNewPlayer(true)
    }

    return (
        <main className={`${darkMode ? 'dark' : 'light'} h-full w-full `}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
            {hero
                ? <ChatWindow newPlayer={newPlayer} hero={hero} darkMode={darkMode} />
                : <HeroSelect heroData={heroData} selectHero={selectHero} createNewHero={createNewHero} />}
        </main>
    )
}