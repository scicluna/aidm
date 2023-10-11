import { HeroData } from "@/utils/player"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useRef } from "react"

type HeroSelectProps = {
    heroData: HeroData[]
    selectHero: (index: number) => void
    createNewHero: (e: React.FormEvent, name: string) => void
}

export default function HeroSelect({ heroData, selectHero, createNewHero }: HeroSelectProps) {
    const heroName = useRef<HTMLInputElement>(null)

    return (
        <div className="flex flex-col text-2xl font-extrabold pt-20 gap-2 justify-start items-center w-full h-[90dvh] dark:text-white bg-purple-200 dark:bg-slate-900">
            <h1 className="py-10 text-4xl">SELECT YOUR HERO</h1>
            {heroData && heroData.map((hero, i) => (
                <button className="py-2 px-4 rounded-md max-w-md dark:hover:bg-slate-800 dark:bg-slate-950 bg-slate-400 hover:bg-slate-300 transition-all" key={hero?._id}
                    onClick={() => selectHero(i)}>
                    <b>{hero?.name}</b> {hero?.title} {hero?.lvl}
                </button>
            ))}
            <Popover>
                <PopoverTrigger className="hover:text-slate-400 transition-all">New Character</PopoverTrigger>
                <PopoverContent>
                    <form onSubmit={(e) => createNewHero(e, heroName.current!.value)} className="flex gap-2 items-center">
                        <Input id="name" type="text" placeholder="Name" ref={heroName} />
                        <button>Start!</button>
                    </form>
                </PopoverContent>
            </Popover>

        </div>
    )
}