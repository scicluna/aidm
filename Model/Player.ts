import { Schema, model, models } from "mongoose";

const InventorySchema = new Schema({
    item: String,
    quantity: Number,
    type: String,
});

const JournalSchema = new Schema({
    number: Number,
    entry: String
});

const PlayerSchema = new Schema({
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
},
    {
        timestamps: true
    }
);




const Player = models.Player || model("Player", PlayerSchema);
export default Player