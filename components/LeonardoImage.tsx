import Image from "next/image"

type LeonardoImageProps = {
    imageurl: string | null
}

export default function LeonardoImage({ imageurl }: LeonardoImageProps) {

    console.log(imageurl)

    if (!imageurl) {
        return
    }

    return (
        <Image src={imageurl} alt={'evocative background'} fill />
    )
}