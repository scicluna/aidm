import { Leonardo } from "@leonardo-ai/sdk";
import { SdGenerationSchedulers } from "@leonardo-ai/sdk/dist/sdk/models/shared";

export async function POST(req: Request) {

    //fire off our leonardo instance
    const sdk = new Leonardo({
        security: {
            bearerAuth: process.env.LEO_API!
        }
    })

    const parsedreq = await req.json()

    //handle our prompt
    let { promptMessage } = parsedreq
    let processedPromptMessage = 'dnd art stylized artwork illustration bold-lines art high quality vector illustration landscapes ' + promptMessage.slice(0, Math.min(promptMessage.length, 85))

    //call the leonardo api and return the image id
    try {
        const data = await sdk.generation.createGeneration({
            height: 800,
            modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
            prompt: processedPromptMessage,
            width: 800,
            promptMagic: true,
            promptMagicVersion: 'v2',
            scheduler: SdGenerationSchedulers.DpmSolver,
            guidanceScale: 7,
            numImages: 1,
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