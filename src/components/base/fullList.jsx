import * as React from 'react';
import APIaccess from '../../apiaccess';
import {useNavigate} from 'react-router-dom';

import './home.css';

let accessAPI = APIaccess();


/*
	05. 15. 2024
	Displays entire list of data for viewing or editing

	modes:
		view,
		remove,
		pinMedia

	source: name of whatever data is from (a user's posts, a collection)
*/


export default function FullList({ data, mode, source, setSocketMessage, setFullList, groupID }) {

	/* add 'selected' to data items, then add to dataList */
	const [dataList, setDataList] = React.useState([]);
	const [selection, setSelection] = React.useState([]);

	const handleSubmit = (event) => {

		if(event.target.name == 'remove') {
			if(selection.length == 0) {
				setSocketMessage({
					type: 'error',
					message: 'No items selected'
				})
			}
			else {
				setSocketMessage({
					action: 'removeFromCollection',
					groupID: groupID,
					postID: selection.map(ele => ele.id)
				})
			}
		}

		else if(event.target.name == 'removeAll') {}

		else if(event.target.name == 'pinMedia') {}

		else if(event.target.name == 'pinAllMedia') {}
	}


	React.useEffect(()=> {
		let newData = [];

		dataList.map(data => {
			if(data.selected == true) {
				newData.push(data);
			}
			else {
				return null;
			}
		})

		setSelection(newData);
	}, [dataList])

	React.useEffect(()=> {	

		if(mode == 'remove' || mode == 'view') {
			let newData = data.map(post => {

				let content;
				let images = [];
				post.content.some(piece => {
					if(piece.type == 'text') {
						content = piece.content
					}
				})
				post.content.every(piece => {
					if(piece.type == 'media') {
						images.push(piece.media)
					}
				})

				return {
					title: post.title,
					content: content,
					images: images,
					id: post._id,
					selected: false
				}
			})

			setDataList(newData);
		}
		else if(mode == 'pinMedia') {

			let newData = data.map(media => {
				return {
					url: media,
					selected: false
				}
			})
			setDataList(newData);
		}
	}, [])

	console.log(dataList)

	return (
		<div id="FullList">
			
			<h2 id="title">
				{`${mode == 'view' ? "Viewing" : '' }`}
				{`${mode == 'remove' ? "Removing From" : '' }`}
				{`${mode == 'pinMedia' ? "Pinning From" : '' }`}
				
				<span>{source}</span>
			</h2>


			<ul id="dataList">
				{mode == 'pinMedia' || mode == 'remove' &&
					dataList.map((entry, index) => (
						<li className={`${entry.selected == true ? 'selected' : ''}`}>
							<button onClick={()=> {

								let copy = dataList.map(ele => {

									if(ele.title == entry.title && ele.selected != true ) {
										ele.selected = true;
										return ele;
									}
									else if(ele.title == entry.title && ele.selected == true ) {
										ele.selected = false;
										return ele;
									}
									else {
										return ele;
									}
								})

								setDataList(copy)
							}}>
								<span className={`bullet ${entry.selected == true ? 'selected' : ''}`}>
								</span>

								{mode == 'pinMedia' &&
									<img src={entry.imageURL}/>
								}
								{mode == 'remove' &&
									<p>{entry.title}</p>
								}
							</button>	
						</li>
					))
				}
				{/*{mode == 'view' &&
					dataList.map(entry => (
						<li>
							<h3>{entry.title}</h3>
							<p>{entry.excerpt}</p>

							{entry.images.length > 0 &&
								<ul className='images'>
									{entry.images.map(img => (
										<li>
											<img src={img}/>
										</li>
									))}
								</ul>
							}
						</li>
					))
				}*/}
				{/*may have to use log here*/}
			</ul>


			{mode == 'view' &&
				<button>Exit</button>
			}

			{mode == 'remove' &&
				<ul className="optionsMenu" id="deleteMenu">
				
					<li>
						<button 
								name="remove"
								className="buttonDefault"
								onClick={handleSubmit}>Remove {selection.length}</button>
					</li>
					<li>
						<button className="buttonDefault">Remove All</button>
					</li>
					<li>
						<button className="buttonDefault"
								onClick={(e)=> {
									e.preventDefault()
									let fullList = document.getElementById('FullList');
									fullList.classList.add('leave')

									let delay = setTimeout(()=> {
										setFullList()
									}, 150);
								}}>Exit</button>
					</li>
				</ul>
			}
			{mode == 'pinMedia' &&
				<ul className="optionsMenu" id="pinningMenu">
				
					<li>
						<button className="buttonDefault">Pinning {selection.length}</button>
					</li>
					<li>
						<button className="buttonDefault">Pin All</button>
					</li>
					<li>
						<button className="buttonDefault">Exit</button>
					</li>
				</ul>
			}
		</div>
	)
}