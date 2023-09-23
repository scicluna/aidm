import { useEffect } from 'react';
import { Player } from '@/utils/player';
import { Message } from 'ai';

export function usePlayerUpdates(messages: Message[], player: Player) {
    useEffect(() => {
        // Get the latest message
        const latestMessage = messages[messages.length - 1];

        // Check if the latest message is from the AI
        if (latestMessage && latestMessage.role === 'assistant') {
            // React to "Level Up"
            if (latestMessage.content.includes("Level Up")) {
                player.lvl += 1;
            }

            // React to "Loot: {object}"
            const lootMatch = latestMessage.content.match(/Loot: (\{.*?\})/);
            if (lootMatch) {
                const loot = JSON.parse(lootMatch[1]);
                player.addToInventory(loot);
            }

            // React to "Entry: ..."
            const entryMatch = latestMessage.content.match(/Entry: (.*)/);
            if (entryMatch) {
                const entry = entryMatch[1];
                player.journal.push({ number: player.journal.length, entry });
            }
        }
    }, [messages]);
}
