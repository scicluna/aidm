import { NextRequest } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BytesOutputParser } from 'langchain/schema/output_parser';
import { PromptTemplate } from 'langchain/prompts';

export const runtime = 'edge';

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`;
};

const TEMPLATE = `
Rules:
{rules}

Player status:
{player_status}

Current conversation:
{chat_history}
 
User: {input}
AI:`;

/*
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req: NextRequest) {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const playerJson = await fetch("http://localhost:3000/api/player", { method: "GET" })
    const player = await playerJson.json()

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    /**
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
        temperature: 0.9,
    });

    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and encoding.
     */
    const outputParser = new BytesOutputParser();

    /*
     * Can also initialize as:
     *
     * import { RunnableSequence } from "langchain/schema/runnable";
     * const chain = RunnableSequence.from([prompt, model, outputParser]);
     */
    const chain = prompt.pipe(model).pipe(outputParser);

    const ruleSet = "Here are the rules. You are a dungeon master for an RPG. You control the world and weave compelling narratives to the player. You have access to their stats, inventory, and journal. To level up a player say 'Level Up' and only Level Up a player if they have done something amazing. To give an item to the player use with no quotations and replacing the parenthesis with the thing in question.'Loot: {item: (item name), quantity (number of the item), type (msc/wpn/armor), stat? (stat is for wpn and armor and determines their efficacy (1 is worst))}. To remove an item from a player say 'Remove Item: (item name)x(how many to remove)'. When important events happen or quests are established end the message with: Entry: 'this is the thing that happened or is important. You never make decisions for or speak for the player. NEVER take a user's turn. You should always end messages with something happening and a call for action. Resolve rolls for the player. Rolls can be made using the ability score modifiers of the scores provided in the player object. Loot, entries, level ups, and removals should happen at the very end of text blocks if at all."

    const stream = await chain.stream({
        rules: ruleSet,
        player_status: JSON.stringify(player),
        chat_history: formattedPreviousMessages.join('\n'),
        input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
}