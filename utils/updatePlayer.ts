import { Message } from "ai/react";
import { PlayerBlock } from "./player";

export async function updatePlayer(message: Message, player: PlayerBlock) {
    if (message && message.role === 'assistant') {

        // React to **Level Up**
        if (message.content.includes("**Level Up**")) {
            player.lvl += 1;
        }

        // React to **Loot: **
        const lootPattern = /\*\*Loot: (.*?) x(\d+) \(?(\w+)\)?(?: (\d+))?\*\*/g;
        const lootMatches = Array.from(message.content.matchAll(lootPattern));

        for (const lootMatch of lootMatches) {
            const item: { item: string, quantity: number, type: string, stat?: number } = {
                item: lootMatch[1].trim(),
                quantity: parseInt(lootMatch[2], 10),
                type: lootMatch[3].trim()
            };

            // Check if the stat property is present and add it to the item
            if (lootMatch[4]) {
                item.stat = parseInt(lootMatch[4], 10);
            }
            player.addToInventory(item);
        }

        //React to **Remove Item: thing x2**
        const removeMatch = message.content.match(/\*\*Remove Item: (.*?) x(\d+)\*\*/)
        if (removeMatch) {
            const itemName = removeMatch[1].trim();
            const quantityToRemove = parseInt(removeMatch[2], 10);
            player.removeFromInventory(itemName, quantityToRemove)
        }

        //React to **Entry: blahblah blah**
        const entryMatch = message.content.match(/\*\*Entry: (.*)\*\*/);
        if (entryMatch) {
            const entry = entryMatch[1];
            player.journal.push({ number: player.journal.length, entry });
        }

        //React to **New Ability: ability**
        const addAbilityMatch = message.content.match(/\*\*New Ability: ([^*]+)\*\*/);
        if (addAbilityMatch) {
            const ability = addAbilityMatch[1];
            player.addAbility(ability)
        }

        //React to **New Title: (title)**
        const addNewTitleMatch = message.content.match(/\*\*New Title: ([^*]+)\*\*/)
        if (addNewTitleMatch) {
            const title = addNewTitleMatch[1]
            player.addTitle(title)
        }

        const statPattern = /\*\*(STR|DEX|CON|INT|WIS|CHA): ([+-])(\d+)\*\*/g;
        const statMatches = Array.from(message.content.matchAll(statPattern));
        for (const newStatMatch of statMatches) {
            const stat = newStatMatch[1];
            const operand = newStatMatch[2];
            const change = parseInt(newStatMatch[3], 10);

            if (operand === "+") {
                player.changeStat(stat, change);
            } else {
                player.changeStat(stat, -change);
            }
        }
    }

    //update player after each message prompt finishes processing
    await fetch('/api/player', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: player.name,
            title: player.title,
            str: player.str,
            dex: player.dex,
            con: player.con,
            int: player.int,
            wis: player.wis,
            cha: player.cha,
            lvl: player.lvl,
            hp: player.hp,
            ac: player.ac,
            atk: player.atk,
            dmg: player.dmg,
            wpn: player.wpn,
            armor: player.armor,
            inventory: player.inventory,
            journal: player.journal,
            otherAbilities: player.otherAbilities
        })
    })
    return player
}
