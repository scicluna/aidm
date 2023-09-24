import rollDice from "./diceroller.js"

type HeroData = {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    lvl: number;
    armor: number;
    wpn: number;
    inventory: { item: string, quantity: number, type: string, stat?: number }[]
    journal: { number: number, entry: string }[]
} | null

export class PlayerBlock {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    lvl: number;
    armor: number;
    wpn: number;
    inventory: { item: string, quantity: number, type: string, stat?: number }[]
    journal: { number: number, entry: string }[]

    constructor(heroData: HeroData = null) {
        if (!heroData) {
            this.str = rollDice('4d6d1');
            this.dex = rollDice('4d6d1');
            this.con = rollDice('4d6d1');
            this.int = rollDice('4d6d1');
            this.wis = rollDice('4d6d1');
            this.cha = rollDice('4d6d1');
            this.armor = 0
            this.wpn = 1
            this.lvl = 1
            this.inventory = [{ item: "clothes", quantity: 1, type: "msc" }, { item: "dagger", quantity: 1, type: "wpn" }];
            this.journal = [{ number: 0, entry: "And so I headed out on my first adventure! I wonder what I will find!" }];
        } else {
            this.str = heroData.str;
            this.dex = heroData.dex;
            this.con = heroData.con;
            this.int = heroData.int;
            this.wis = heroData.wis;
            this.cha = heroData.cha;
            this.armor = heroData.armor
            this.wpn = heroData.wpn
            this.lvl = heroData.lvl
            this.inventory = heroData.inventory
            this.journal = heroData.journal
        }

    }

    get hp(): number {
        return 10 + (6 + Math.floor((this.con - 10) / 2)) * (this.lvl - 1);
    }

    get ac(): number {
        return 10 + Math.floor((this.dex - 10) / 2) + this.armor;
    }

    get atk(): number {
        return this.lvl + Math.max(Math.floor((this.str - 10) / 2), Math.floor((this.dex - 10) / 2));
    }

    get dmg(): number {
        return Math.max(Math.floor((this.str - 10) / 2), Math.floor((this.dex - 10) / 2)) + this.wpn;
    }

    equipBestGear(): void {
        // Find the best weapon
        const bestWeapon = this.inventory
            .filter(item => item.type === "wpn")
            .reduce<{ item: string, quantity: number, type: string, stat?: number } | null>((best, current) => {
                if (!best || (current.stat && current.stat > (best.stat || 0))) {
                    return current;
                }
                return best;
            }, null);

        const bestArmor = this.inventory
            .filter(item => item.type === "armor")
            .reduce<{ item: string, quantity: number, type: string, stat?: number } | null>((best, current) => {
                if (!best || (current.stat && current.stat > (best.stat || 0))) {
                    return current;
                }
                return best;
            }, null);

        // Update the weapon and armor properties
        if (bestWeapon) {
            this.wpn = bestWeapon.stat || 0; // Default to 1 if no stat is provided
        }
        if (bestArmor) {
            this.armor = bestArmor.stat || 0; // Default to 0 if no stat is provided
        }
    }

    addToInventory(item: { item: string, quantity: number, type: string, stat?: number }): void {
        // Check if item already exists in inventory
        const existingItem = this.inventory.find(i => i.item === item.item);
        if (existingItem) {
            existingItem.quantity += item.quantity; // Increase quantity
            if (item.stat) {
                existingItem.stat = item.stat; // Update stat if provided
            }
        } else {
            this.inventory.push(item);
        }

        // Automatically equip the best gear after adding the item
        this.equipBestGear();
    }

    removeFromInventory(itemName: string, quantity: number): void {
        // Find the item in the inventory
        const existingItem = this.inventory.find(i => i.item === itemName);
        if (!existingItem) {
            console.warn(`Item "${itemName}" not found in inventory.`);
            return;
        }

        // Reduce the quantity or remove the item entirely
        if (quantity >= existingItem.quantity) {
            this.inventory = this.inventory.filter(i => i.item !== itemName);
        } else {
            existingItem.quantity -= quantity;
        }

        // Re-evaluate the best gear in case the removed item was equipped
        this.equipBestGear();
    }
}