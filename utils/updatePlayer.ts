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
        let lootMatch;

        while ((lootMatch = lootPattern.exec(message.content)) !== null) {
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
    }

    //update player after each message prompt finishes processing
    await fetch('/api/player', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
