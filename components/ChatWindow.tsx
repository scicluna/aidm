"use client"
import { useChat } from 'ai/react';

export default function Chatwindow() {
    const { messages, input, handleInputChange, handleSubmit } = useChat();

    return (
        <div className="mx-auto w-full max-w-md flex flex-col">
            <div className='h-[80dvh] flex flex-col'>
                {messages.map(m => (
                    <div key={m.id}>
                        {m.role === 'user' ? 'User: ' : 'AI: '}
                        {m.content}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className='h-[10dvh] fixed w-full max-w-md bottom-0 flex gap-4 items-center'>
                <label htmlFor='prompt'>
                    Say something...
                </label>
                <input
                    className="border border-gray-300 rounded shadow-xl p-2"
                    value={input}
                    onChange={handleInputChange}
                    name="prompt"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}