import { Sun, Moon } from "lucide-react"
import Image from "next/image"
import aidmicon from "@/public/aidm2.webp"

type NavbarProps = {
    darkMode: boolean
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Navbar({ darkMode, setDarkMode }: NavbarProps) {
    return (
        <nav className="fixed top-0 w-full h-[10dvh] bg-purple-100 dark:bg-slate-950 bg-opacity-80 flex justify-between items-center">
            <div className="p-4 relative flex gap-2 items-center">
                <Image src={aidmicon} alt={'aidm logo of robot with wizard hat'} width={50} height={50} className="object-fill" />
                <h1 className="dark:text-white text-3xl font-extrabold">AI DM</h1>
            </div>
            <div className="p-4">
                <button onClick={() => setDarkMode(prev => !prev)}>
                    {darkMode ? <Sun width={50} height={50} stroke="white" /> : <Moon width={50} height={50} />}
                </button>
            </div>
        </nav>
    )
}