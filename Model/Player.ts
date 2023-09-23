import { Schema, model, models } from "mongoose";

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
    inventory: [{
        item: String,
        quantity: Number,
        type: String,
    }],
    journal: [{
        number: Number,
        entry: String
    }]
},
    {
        timestamps: true
    }
);

const Player = models.Player || model("player", PlayerSchema);
export default Player