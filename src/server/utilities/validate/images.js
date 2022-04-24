const isDuplicated = function (image, index, images) {
	return images.indexOf(image) !== index
}
const isImage = function (image) {
	const dataStart = image.indexOf(',')+1
	const data = image.slice(dataStart)
	const hex = Buffer.from(data, 'base64').toString('hex')
	const fileSignature = hex.slice(0,28) // first 14 bytes of the image file, to verify that it is an image
	return (
		fileSignature.slice(0, 6)  == 'ffd8ff' || // jpeg
		fileSignature.slice(0, 16) == '89504e470d0a1a0a' || // png
		fileSignature.slice(0, 8)  == '52494646' && fileSignature.slice(16, 28) == '574542505650' || // webp
		fileSignature.slice(0, 12) == '474946383961' || fileSignature.slice(0, 12) == '474946383761' || // gif
		fileSignature.slice(0, 8)  == '00000100' || fileSignature.slice(0, 8) == '00000200' || // ico
		fileSignature.slice(0, 8)  == '69636e73' || // icns
		fileSignature.slice(0, 8) == '49492a00' || fileSignature.slice(0, 8) == '4d4d002a' || // tiff
		fileSignature.slice(0, 8) == '425047fb' || // bpg
		fileSignature.slice(0, 24) == '0000000c6a5020200d0a870a' || // jpeg 2000
		fileSignature.slice(0, 24) == '0000000c4a584c200d0a870a' // jpeg xl
	)
}

module.exports = function (images) {
	return images instanceof Array && 
	       images.length >= 1 && 
				 !images.some(isDuplicated) &&
				 images.every(isImage)
}