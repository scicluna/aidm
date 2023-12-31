//generates an image and returns its ID
export async function buildImage(promptMessage: string) {
    const url = await fetch('/api/leo', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ promptMessage: promptMessage })
    })
    const imageId = await url.json()
    return imageId
}

//takes the image ID and fetches the picture
export async function getImage(imageId: string) {
    const url = await fetch(`/api/leo/${imageId}`)
    const imageUrl = await url.json()

    return imageUrl
}