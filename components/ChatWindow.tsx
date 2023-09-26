"use client"
import { Message, useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { PlayerBlock } from '@/utils/player';
import { updatePlayer } from '@/utils/updatePlayer';
import CharacterSheet from '@/components/CharacterSheet';
import LeonardoImage from '@/components/LeonardoImage';
import { buildImage, getImage } from '@/utils/buildImage';
import Navbar from './Navbar';
import Journal from './Journal';


type ChatWindowProps = {
    heroData: any | null
}

export default function Chatwindow({ heroData }: ChatWindowProps) {
    const [player, setPlayer] = useState<PlayerBlock>(new PlayerBlock(heroData))
    const [image, setImage] = useState<string | null>(null)
    const [imageLoading, setImageLoading] = useState(false)
    const [darkMode, setDarkMode] = useState(true)

    const { messages, input, handleInputChange, handleSubmit, isLoading, } = useChat({
        onFinish: (async (message: Message) => {
            const newPlayer = await updatePlayer(message, player)
            setPlayer(newPlayer)
            try {
                const newImage = await buildImage(message.content)
                setImageLoading(true)
                const imageUrl = await getImage(newImage)
                setImage(imageUrl)
                setImageLoading(false)
            }
            catch (err) {
                console.log("image failed to load")
                setImageLoading(false)
            }
        })
    });

    const chatContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!chatContainer.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatContainer.current;
        const diff = scrollHeight - (scrollTop + clientHeight);
        const threshold = 200;
        const isAtBottom = diff <= threshold;

        if (true) {
            chatContainer.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div className={`${darkMode ? 'dark' : 'light'}`}>
            <div className={`h-full w-full bg-purple-100 dark:bg-slate-900`}>
                <div className={`mx-auto w-full flex flex-col relative`}>
                    <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                    <div className='flex gap-2 w-full h-full p-2'>
                        <div className='scrollbar h-[80dvh] w-2/3 flex flex-col gap-4 overflow-auto dark:text-gray-100 bg-gray-400 dark:bg-slate-700 bg-opacity-30' ref={chatContainer}>
                            {messages.map((m, i) => (
                                <div key={m.id} className='flex flex-col p-2'>
                                    <p className='font-extrabold'>{m.role === 'user' ? 'User: ' : 'AI: '}</p>
                                    <p>{m.content}</p>
                                </div>
                            ))}
                        </div>
                        <div className='bg-gray-400 dark:bg-slate-700 w-1/2 h-[80dvh] relative flex justify-center items-center'>
                            <LeonardoImage imageurl={image} imageLoading={imageLoading} />
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className='h-[10dvh] fixed w-full bottom-0 flex gap-4 justify-center items-center dark:bg-slate-900'>
                        <input
                            autoComplete='off'
                            className="border border-gray-300 dark:border-slate-600 rounded shadow-xl p-2 w-1/3"
                            value={input}
                            onChange={handleInputChange}
                            name="prompt"
                            placeholder='What do you do?'
                        />
                        <button className='bg-purple-600 dark:text-gray-100 dark:bg-purple-950 px-4 py-2 rounded-full hover:bg-purple-500 hover:dark:bg-purple-800' type="submit" disabled={isLoading}>Send</button>
                    </form>
                    <CharacterSheet player={player} />
                    <Journal journal={player.journal} />
                </div>
            </div>
        </div>
    );
}