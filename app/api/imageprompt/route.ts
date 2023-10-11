import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {

    const chat = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo-16k',
        temperature: 0.9
    });

    const parsedreq = await req.json()

    //handle our prompt
    let { lastMessage } = parsedreq

    const chain = new ConversationChain({ llm: chat })

    const res1 = await chain.run("summarize this paragraph briefly using evocative and descriptive language focused on the surorunding environments and landscapes in 80 characters or less. be very brief, preferring to summarize with singular adjectives if possible.")
    const res2 = await chain.run(`${lastMessage}`)

    return new Response(JSON.stringify(res2));
}