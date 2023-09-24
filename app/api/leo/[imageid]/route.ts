import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Error from "next/error";

export async function GET(req: Request, { params }: Params) {
    const { imageid } = params

    const url = `https://cloud.leonardo.ai/api/rest/v1/generations/${imageid}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: `Bearer ${process.env.LEO_API}`
        }
    };

    let attempts = 0;
    const maxAttempts = 10; // for example, adjust as needed

    while (attempts < maxAttempts) {
        try {
            const imageUrl = await fetch(url, options);
            const bigUrl = await imageUrl.json();

            if (bigUrl.generations_by_pk.status !== 'PENDING') {
                return new Response(JSON.stringify(bigUrl.generations_by_pk.generated_images[0].url));
            }
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
            return new Response('Failed to get image', { status: 500 })
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 3000)); // wait for 2 seconds
    }

    return new Response('Request Timeout', { status: 400 })
}