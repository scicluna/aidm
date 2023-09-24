import Player from "@/Model/Player";
import { connectToDB } from "@/utils/dbconnect";

//get the current player (there will only ever be one player)
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

//update our player or build a new player.
export async function POST(req: Request) {
    const parsedreq = await req.json()
    const { str, dex, con, int, wis, cha, lvl, hp, armor, wpn, ac, atk, dmg, inventory, journal, otherAbilities } = parsedreq

    try {
        await connectToDB()
        const playerRecord = await Player.findOne()
        if (!playerRecord) {
            const response = await Player.create({
                str, dex, con, int, wis, cha, lvl, hp, armor, wpn, ac, atk, dmg, inventory, journal, otherAbilities
            })
            return new Response(JSON.stringify(response), { status: 200 })
        } else {
            const response = await Player.findByIdAndUpdate({ _id: playerRecord._id }, {
                str, dex, con, int, wis, cha, lvl, hp, armor, wpn, ac, atk, dmg, inventory, journal, otherAbilities
            }, { new: true })
            return new Response(JSON.stringify(response), { status: 200 })
        }
    } catch (err) {
        console.log(err)
        return new Response('Failed to post character', { status: 500 })
    }
}