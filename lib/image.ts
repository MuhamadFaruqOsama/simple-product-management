import sharp from "sharp"

export async function processProductImage(file: File) {
    try {
        const buffer = Buffer.from(await file.arrayBuffer())

        const processedImage = await sharp(buffer)
            .resize({
                width: 1200,
                height: 1200,
                fit: "inside",
                withoutEnlargement: true
            })
            .webp({
                quality: 80
            })
            .toBuffer()

        if(!processedImage) {
            return false
        }

        return processedImage
        
    } catch (error) {
        console.error(error)
        return false
    }
}