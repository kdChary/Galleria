import { Component } from 'react'
import { BallTriangle } from 'react-loader-spinner'
import { BsSearch } from "react-icons/bs"
import { FcGallery } from "react-icons/fc"

import './index.css'
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
		query: '',
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
		this.setState( { query: category } )
	}

	getImages = async () => {
		const { category } = this.state
		const query = category !== "" ? `query=${category}` : "query=random"
		this.setState( { fetchStatus: apiConstant.inProgress } )

		const url = `https://api.unsplash.com/search/photos/?per_page=20&${query}&${auth}`
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
		const {imagesData} = this.state
		console.log(imagesData)
	}

	displayComponents = () => {
		const { fetchStatus, errMsg } = this.state

		switch ( fetchStatus ) {
			case apiConstant.inProgress:
				return <>{this.loader()}</>

			case apiConstant.success:
				return <h1>Hello</h1>

			case apiConstant.failure:
				return <h1>{errMsg}</h1>

			default:
				break
		}
	}

	render() {
		const { category } = this.state
		return (
			<div className="main-page">
				<div className="header">
					<div className="app-header">
						<FcGallery className='app-icon' />
						<h1 className="app-title">Galleria</h1>
					</div>
					<div className="search-box">
						<input type="search" value={category} className="input" placeholder='Search images' onChange={this.changeQuery} />
						<button type="button" className="search-btn">
							<BsSearch />
						</button>
					</div>
					{/* <div className="category-card">
						contains a list of options to filter
					</div> */}
				</div>
				<ul className="images-list">
				{this.displayComponents()}
				</ul>
			</div>
		)
	}
}

export default MainPage
