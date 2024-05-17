import { Popup } from 'reactjs-popup'

import './index.css'



const ImageItem = props => {
	const { imageDetails, altVal } = props
	const { description, likes, imageUrl, uploadedBy } = imageDetails
	const position = 'top center'

	return (

		<li className="image-item">
			<Popup
				trigger={open => (
					<img src={imageUrl} alt={altVal} className='image' /> )} closeOnDocumentClick position='top center' on={[ 'hover', 'focus' ]} arrow={position !== 'center center'}>

				<p>{description}</p>
				<p>likes: {likes}</p>
				<p>clicked by: {uploadedBy}</p>
			</Popup >
		</li>
	)
}

export default ImageItem