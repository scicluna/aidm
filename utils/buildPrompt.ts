export async function buildPrompt(lastMessage: string) {
    const prompt = await fetch('/api/imageprompt', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lastMessage: lastMessage })
    })
    const promptMessage = await prompt.json()
    return promptMessage
}