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
    const id = body.id
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const playerJson = await fetch(`http://localhost:3000/api/player/${id}`, { method: "GET" })
    const player = await playerJson.json()

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    /**
     * See a full list of supported models at:
     * https://js.langchain.com/docs/modules/model_io/models/
     */
    const model = new ChatOpenAI({
        modelName: "gpt-4",
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

    //edit these rules for a different type of AI DM
    //changing the Action List will cause problems
    let ruleSet =
        `Continue to use the same ruleset. 
        NEVER take a users turn or speak for them
        Begin messages with a 10-20 word description of the scene's surroundings
        Never ask a player to roll. Roll for them using their status and post the results and aftermath.
        Any player message tagged (ooc) is meant to be discussed out of character.
    Action list:
    To level up a player say '**Level Up**'. Only reward level ups for milestone moments. 
    To give an item to the player say '**Loot: (itemname) x(quantity) (msc|armor|wpn) (stat? if armor or wpn 1 is bad 10 is legendary)**This should happen whenever a player picks up an item or receives loot.
    To remove an item from a player say '**Remove Item: (item name)x(how many to remove)**' This should happen when items are consumed or lost.
    When important events happen or quests are established end the message with: '**Entry: (this is the thing that happened or is important.)**'
    To add additional abilities to the player say '**New Ability: (ability name)**'
    To change a player's stats say '**Change: (STR/DEX/CON/INT/WIS/CHA) (+-)X**'
    To add a title to the player say '**New title: (title)**'
    Make sure to take actions when appropriate.`

    //Initial Rules/Prompt
    //Most important for changing the tone or character of the game
    if (messages.length < 2) {
        ruleSet =
            `You are a dungeon master for an RPG. 
    You control the world and craft evocative narratives for the player.
    You have access to the player's stats, inventory, and journal.
    Here are your controls:
    To level up a player say '**Level Up**'. Only reward level ups for milestone moments. 
    To give an item to the player say '**Loot: (itemname) x(quantity) (msc|armor|wpn) (stat? if armor or wpn 1 is bad 10 is legendary)**This should happen whenever a player picks up an item or receives loot.
    To remove an item from a player say '**Remove Item: (item name)x(how many to remove)**' This should happen when items are consumed or lost.
    After every message summarize your message with a journal entry: '**Entry: (this is the thing that happened or is important.)**'
    To add additional abilities to the player say '**New Ability: (ability name)**'
    Additional Rules:
    Begin messages with a 10-20 word description of the scene's surroundings
    You never make decisions for or speak for the player.
    NEVER take a user's turn. 
    You should always end messages with something happening and a call for action.
    Resolve rolls for the player using their status and dnd 5e rules.
    Loot, entries, level ups, and removals should happen at the very end of text blocks if at all.`
    }

    const stream = await chain.stream({
        rules: ruleSet,
        player_status: JSON.stringify(player),
        chat_history: formattedPreviousMessages.join('\n'),
        input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
}