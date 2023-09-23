import Player from "@/Model/Player";
import { connectToDB } from "@/utils/dbconnect";

export async function GET(req: Request) {
    try {
        await connectToDB();
        const response = await Player.find()

        if (!response) return new Response("no player initialized")

        return new Response(JSON.stringify(response), { status: 200 })
    } catch (err) {
        return new Response("failed to fetch player", { status: 500 })
    }
}

export async function Post(req: Request) {
    const parsedreq = await req.json()
    const { str, dex, con, int, wis, cha, lvl, hp, armor, wpn, atk, dmg, inventory, journal } = parsedreq

    try {
        await connectToDB()
        const player = await Player.findOne()
        console.log(player)
        if (!player) {
            const response = Player.create({
                str,
                dex,
                con,
                int,
                wis,
                cha,
                lvl,
                hp,
                armor,
                wpn,
                atk,
                dmg,
                inventory,
                journal
            })
            return new Response(JSON.stringify(response), { status: 200 })
        } else {
            const response = Player.updateOne({ _id: player._id }, {
                str,
                dex,
                con,
                int,
                wis,
                cha,
                lvl,
                hp,
                armor,
                wpn,
                atk,
                dmg,
                inventory,
                journal
            })
            return new Response(JSON.stringify(response), { status: 200 })
        }
    } catch (err) {
        return new Response('Failed to post chat', { status: 500 })
    }
}