import { Leonardo } from "@leonardo-ai/sdk";

export async function POST(req: Request) {
    const sdk = new Leonardo({
        security: {
            bearerAuth: process.env.LEO_API!
        }
    })

    const parsedreq = await req.json()
    const { lastMessage } = parsedreq

    try {
        const data = await sdk.generation.createGeneration({
            height: 512,
            modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
            prompt: lastMessage.slice(0, Math.max(lastMessage.length, 100)),
            width: 512
        })
        if (!data.createGeneration200ApplicationJSONObject?.sdGenerationJob?.generationId) {
            console.log(data)
            return new Response('Failed to generate image', { status: 500 })
        }
        return new Response(JSON.stringify(data.createGeneration200ApplicationJSONObject?.sdGenerationJob?.generationId), { status: 200 })
    }
    catch (err) {
        console.log(err)
        return new Response('Failed to post character', { status: 500 })
    }
}