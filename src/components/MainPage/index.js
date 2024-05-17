import { Component } from 'react'
import { BallTriangle } from 'react-loader-spinner'
import { BsSearch } from "react-icons/bs"
import { FcGallery } from "react-icons/fc"

import './index.css'
import ImageItem from '../ImageItem'

const apiConstant = {
	initial: 'INITIAL',
	inProgress: 'IN_PROGRESS',
	success: 'SUCCESS',
	failure: 'FAILURE',
}
const auth = 'client_id=P8GK1HbpjR523iGowQpMeivYXmgxLnmPM_p15XCIMok'

class MainPage extends Component {
	state = {
		imagesData: [],
		fetchStatus: apiConstant.initial,
		category: '',
		query: 'random',
		errMsg: '',
	};

	componentDidMount() {
		this.getImages()
	}

	changeQuery = event => {
		this.setState( { category: event.target.value } )
	}

	searchClicked = () => {
		const { category } = this.state
		this.setState( { query: category }, ()=> this.getImages( category ) )
	}

	getImages = async ( val ) => {
		const query = val === "" || undefined ? "query=random" : `query=${val}`
		this.setState( { fetchStatus: apiConstant.inProgress } )

		const url = `https://api.unsplash.com/search/photos/?per_page=30&${query}&${auth}`
		const options = {
			method: 'GET',
		}

		const response = await fetch( url, options )
		const data = await response.json()
		// console.log(data);

		if ( response.ok ) {
			const modifyData = data.results.map( ( image ) => ( {
				id: image.id,
				description:
					image.description !== null
						? image.description.slice( 0, 25 )
						: image.alt_description.slice( 0, 25 ),
				uploadedAt: image.updated_at,
				uploadedBy: image.user.name,
				imageUrl: image.urls.small,
				likes: image.likes
			} ) )
			this.setState( {
				fetchStatus: apiConstant.success,
				imagesData: modifyData,
			} )

			// console.log(modifyData);
		} else {
			this.setState( {
				fetchStatus: apiConstant.failure,
				errMsg: data[ "errors" ],
			} )
		}
	};

	loader = () => (
		<div className="loader">
			<BallTriangle
				height={100}
				width={100}
				radius={5}
				color="#4fa94d"
				ariaLabel="ball-triangle-loading"
				wrapperStyle={{}}
				wrapperClass=""
				visible={true}
			/>
		</div>
	);

	renderImages = () => {
		const { imagesData, category } = this.state

		return (
			<ul className="images-list">
				{imagesData.map( image => <ImageItem key={image.id} imageDetails={image} altVal={category} /> )}
			</ul>
		)
	}

	showError = () => {
		const { errMsg } = this.state

		return (
			<p className='error-msg'>{errMsg}</p>
		)
	}

	displayComponents = () => {
		const { fetchStatus } = this.state

		switch ( fetchStatus ) {
			case apiConstant.inProgress:
				return <>{this.loader()}</>

			case apiConstant.success:
				return <>{this.renderImages()}</>

			case apiConstant.failure:
				return <>{this.showError()}</>

			default:
				break
		}
	}

	render() {
		const { category, query } = this.state
		return (
			<div className="main-page">
				<div className="header">

					<div className="app-header">
						<FcGallery className='app-icon' />
						<h1 className="app-title">Galleria</h1>
					</div>

					<div className="search-box">
						<input type="search" value={category} className="input" placeholder='Search images' onChange={this.changeQuery} />

						<button type="button" className="search-btn" onClick={this.searchClicked}>
							<BsSearch />
						</button>
					</div>
				</div>

				<div className="image-container">
					<h3 className="image-title">{query}</h3>
					<hr className="line" />
					{this.displayComponents()}
				</div>
			</div>
		)
	}
}

export default MainPage
