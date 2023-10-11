import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export async function GET(req: Request, { params }: Params) {
    const { imageid } = params

    //fetch url to get our image
    const url = `https://cloud.leonardo.ai/api/rest/v1/generations/${imageid}`;

    //wait for leonardo to finish the image and fetch it
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
        try {
            console.log("trying")
            const imageUrl = await fetch(url, {
                cache: 'no-store',
                method: "GET",
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${process.env.LEO_API}`
                }
            });
            const bigUrl = await imageUrl.json();

            if (bigUrl.generations_by_pk.status !== 'PENDING') {
                return new Response(JSON.stringify(bigUrl.generations_by_pk.generated_images[0].url));
            }
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            return new Response('Failed to get image', { status: 500 })
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
    }
    console.error("TIMEOUT")
    return new Response('Request Timeout', { status: 400 })
}