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


export default function FullList({ data, mode, source, setSocketMessage, socketMessage, setFullList, groupID }) {

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

		else if(event.target.name == 'removeAll') {
			setSocketMessage({
					action: 'removeAllFromCollection',
					groupID: groupID,
					postID: dataList.map(ele => ele.id)
				})
		}

		else if(event.target.name == 'pinMedia') {
			if(selection.length == 0) {
				setSocketMessage({
					type: 'error',
					message: 'No items selected'
				})
			}
			else {
				setSocketMessage({
					action: 'addToPinnedMedia',
					groupID: groupID,
					content: selection.map(ele => {
						return {
							url: ele.url,
							postID: groupID
						}
					})
				})
			}
		}

		else if(event.target.name == 'pinAllMedia') {
			setSocketMessage({
					action: 'addToPinnedMedia',
					groupID: groupID,
					content: dataList.map(ele => {
						return {
							url: ele.url,
							postID: groupID
						}
					})
				})
		}
	}

	/* Empties Selection and Removes Selected Items after socketMessage confirmation*/
	React.useEffect(()=> {
		if(socketMessage.type == 'confirmation') {
			if (socketMessage.message == 'removedFromCollection') {
				let newData = dataList.filter(data => !data.selected);
				setDataList(newData);
				setSelection([]);
			}
			else if(socketMessage.message == 'removedAllFromCollection') {
				setDataList([]);
			}
		}
	}, [socketMessage])

	/* For adjusting data before putting in dataList variable */
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

			let newData = data.content.filter(item => item.type == 'media').map(item => {
				return {
					url: item.content,
					place: item.place,
					selected: false
				}
			})
			setDataList(newData);
			console.log(dataList)
		}
	}, [])

	/* Adds selected content to state array */
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

	// console.log(dataList)

	return (
		<div id="FullList">
			
			<h2 id="title">
				{`${mode == 'view' ? "Viewing" : '' }`}
				{`${mode == 'remove' ? "Removing From" : '' }`}
				{`${mode == 'pinMedia' ? "Pinning From" : '' }`}
				
				<span>{source}</span>
			</h2>


			<ul id="dataList">
				{(mode == 'pinMedia' || mode == 'remove') &&

					dataList.map((entry) => (
						<li className={`${entry.selected == true ? 'selected' : ''}`} key={entry.place}>
							<button onClick={()=> {	

								let copy;
								if(mode == 'remove') {
									copy = dataList.map(ele => {
										// console.log(ele.place);
										// console.log(entry.place);
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
								}
								
								else if(mode == 'pinMedia') {
									copy = dataList.map(ele => {
										if(entry.place == ele.place && ele.selected != true ) {
											ele.selected = true;
											return ele;
										}
										else if(entry.place == ele.place && ele.selected == true ) {
											ele.selected = false;
											return ele;
										}
										else {
											return ele;
										}
									});
								}

								setDataList(copy)
							}}>
								<span className={`bullet ${entry.selected == true ? 'selected' : ''} ${mode == 'pinMedia' ? 'media' : ''}`}>
								</span>

								{mode == 'remove' &&
									<p>{entry.title}</p>
								}
								{mode == 'pinMedia' &&
									<img src={entry.url}/>
									// <p>{entry.selected}</p>
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
						<button name="removeAll"
								className="buttonDefault"
								onClick={handleSubmit}>Remove All</button>
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
						<button name="pinMedia"
								className="buttonDefault"
								onClick={handleSubmit}>Pinning {selection.length}</button>
					</li>
					<li>
						<button name="pinAllMedia"
								className="buttonDefault"
								onClick={handleSubmit}>Pin All</button>
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
		</div>
	)
}