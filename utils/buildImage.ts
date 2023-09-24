
export async function buildImage(lastMessage: string) {
    const url = await fetch('/api/leo', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lastMessage: lastMessage })
    })
    const imageId = await url.json()
    return imageId
}

export async function getImage(imageId: string) {
    const url = await fetch(`/api/leo/${imageId}`)
    const imageUrl = await url.json()
    console.log(imageUrl)
    return imageUrl
}