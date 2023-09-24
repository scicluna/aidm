"use client"
import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { PlayerBlock } from '@/utils/player';
import { updatePlayer } from '@/utils/updatePlayer';
import CharacterSheet from '@/components/CharacterSheet';
import LeonardoImage from '@/components/LeonardoImage';
import { buildImage, getImage } from '@/utils/buildImage';


type ChatWindowProps = {
    hero: PlayerBlock | null
}

export default function Chatwindow({ hero }: ChatWindowProps) {
    const [player, setPlayer] = useState<PlayerBlock>(hero ?? new PlayerBlock())
    const [image, setImage] = useState<string | null>(null)
    const { messages, input, handleInputChange, handleSubmit, isLoading, } = useChat({
        onFinish: (async message => {
            const newPlayer = await updatePlayer(message, player)
            setPlayer(newPlayer)
            const newImage = await buildImage(message.content)
            const imageUrl = await getImage(newImage)
            setImage(imageUrl)
        })
    });

    const chatContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!chatContainer.current) return;

        const { scrollTop, scrollHeight, clientHeight } = chatContainer.current;
        const diff = scrollHeight - (scrollTop + clientHeight);
        const threshold = 100;
        const isAtBottom = diff <= threshold;

        if (isAtBottom) {
            chatContainer.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div className="mx-auto w-full flex flex-col relative">
            <div className='flex gap-2 w-full h-full p-2'>
                <div className='h-[80dvh] w-2/3 flex flex-col gap-4 overflow-auto bg-gray-400 bg-opacity-30' ref={chatContainer}>
                    {messages.map((m, i) => (
                        <div key={m.id} className='flex flex-col p-2'>
                            <p className='font-extrabold'>{m.role === 'user' ? 'User: ' : 'AI: '}</p>
                            <p>{m.content}</p>
                        </div>
                    ))}
                </div>
                <div className='bg-gray-400 w-1/2 h-[80dvh] relative'>
                    <LeonardoImage imageurl={image} />
                </div>
            </div>
            <form onSubmit={handleSubmit} className='h-[10dvh] fixed w-full bottom-0 flex gap-4 justify-center items-center'>
                <input
                    autoComplete='off'
                    className="border border-gray-300 rounded shadow-xl p-2 w-1/3"
                    value={input}
                    onChange={handleInputChange}
                    name="prompt"
                    placeholder='What do you do?'
                />
                <button className='bg-purple-600 p-2 rounded-lg hover:bg-purple-500' type="submit" disabled={isLoading}>Send</button>
            </form>
            <CharacterSheet player={player} />
        </div>
    );
}