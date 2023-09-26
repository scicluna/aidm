import Player from "@/Model/Player";
import { connectToDB } from "@/utils/dbconnect";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

//get the current player (there will only ever be one player)
export async function GET(req: Request, { params }: Params) {
    const { playerid } = params
    try {
        await connectToDB();
        const response = await Player.findById(playerid)

        if (!response) return new Response("no player initialized")

        return new Response(JSON.stringify(response), { status: 200 })
    } catch (err) {
        return new Response("failed to fetch player", { status: 500 })
    }
}
