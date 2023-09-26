import { Schema, model, models } from "mongoose";

const InventorySchema = new Schema({
    item: String,
    quantity: Number,
    type: String,
    stat: Number
});

const JournalSchema = new Schema({
    number: Number,
    entry: String
});

const PlayerSchema = new Schema({
    name: {
        type: String
    },
    title: {
        type: String
    },
    str: {
        type: Number
    },
    dex: {
        type: Number
    },
    con: {
        type: Number
    },
    int: {
        type: Number
    },
    wis: {
        type: Number
    },
    cha: {
        type: Number
    },
    lvl: {
        type: Number
    },
    wpn: {
        type: Number
    },
    armor: {
        type: Number
    },
    hp: {
        type: Number
    },
    atk: {
        type: Number
    },
    dmg: {
        type: Number
    },
    ac: {
        type: Number
    },
    inventory: [InventorySchema],
    journal: [JournalSchema],
    otherAbilities: {
        type: [String]
    }
},
    {
        timestamps: true
    }
);




const Player = models.Player || model("Player", PlayerSchema);
export default Player