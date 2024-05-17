import './index.css'

const ImageItem = props => {
	const { imageDetails, altVal } = props
	const { description, likes, imageUrl, updatedAt, uploadedBy } = imageDetails

	return (
		<li className="image-item">
			<img src={imageUrl} alt={altVal} className='image' />
		</li>
	)
}

export default ImageItem