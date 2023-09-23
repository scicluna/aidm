import Player from "@/Model/Player";
import { connectToDB } from "@/utils/dbconnect";

export async function GET(req: Request) {
    try {
        console.log("get player")
        await connectToDB();
        const response = await Player.find()

        if (!response) return new Response("no player initialized")

        return new Response(JSON.stringify(response), { status: 200 })
    } catch (err) {
        return new Response("failed to fetch player", { status: 500 })
    }
}

export async function POST(req: Request) {
    const parsedreq = await req.json()
    const { str, dex, con, int, wis, cha, lvl, hp, armor, wpn, ac, atk, dmg, inventory, journal } = parsedreq

    try {
        await connectToDB()
        const playerRecord = await Player.findOne()
        if (!playerRecord) {
            console.log("build new character")
            const response = await Player.create({
                str, dex, con, int, wis, cha, lvl, hp, armor, wpn, ac, atk, dmg, inventory, journal
            })
            return new Response(JSON.stringify(response), { status: 200 })
        } else {
            console.log('update')
            const response = await Player.findByIdAndUpdate({ _id: playerRecord._id }, {
                str, dex, con, int, wis, cha, lvl, hp, armor, wpn, ac, atk, dmg, inventory, journal
            }, { new: true })
            return new Response(JSON.stringify(response), { status: 200 })
        }
    } catch (err) {
        console.log(err)
        return new Response('Failed to post character', { status: 500 })
    }
}