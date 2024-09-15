import * as React from 'react';
import APIaccess from '../../apiaccess';
import {useNavigate} from 'react-router-dom';

import './home.css';

let accessAPI = APIaccess();


export default function FullList({ 
	data, 
	mode, 
	source, 
	setSocketMessage, 
	socketMessage, 
	setFullList, 
	groupID,
	setPostContent,
	postContent,
	setLocationData,
	setIsPrivate,
	suggestions,
	setSuggestions
}) {

	const [dataList, setDataList] = React.useState([]);
	const [selection, setSelection] = React.useState([]);
	const el = React.useRef();

	const handleSubmit = (event) => {

		if(mode == 'remove_pinnedMedia') {

			if(event.target.name == 'remove') {
				if(selection.length == 0) {
					setSocketMessage({
						type: 'error',
						message: 'No items selected'
					})
				}
				else {
					setSocketMessage({
						action: 'removeFromPinnedMedia',
						groupID: groupID,
						content: selection.map(ele => ele.url)
					})
				}
			}
			else if(event.target.name == 'removeAll') {

				setSocketMessage({
					action: 'removeAllFromPinnedMedia',
					groupID: groupID,
					content: dataList.map(ele => ele.url)
				})
			}
		}
		else if(mode == 'remove_pinnedPosts') {

			if(event.target.name == 'remove') {

				if(selection.length == 0) {
					setSocketMessage({
						type: 'error',
						message: 'No items selected'
					})
				}
				else {
					setSocketMessage({
						action: 'removeFromPinnedPosts',
						groupID: groupID,
						content: selection.map(ele => ele.id)
					})
				}
			}
			else if(event.target.name == 'removeAll') {
				setSocketMessage({
					action: 'removeAllFromPinnedPosts',
					groupID: groupID,
					content: dataList.map(ele => ele.id)
				})
			}
		}


		else if(event.target.name == 'remove') {
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

	const setAsPost = (postID) => {
		let post = data.find(post => post._id == postID)

		//content layout
		//{
		//	content: '',
		//	type: type,
		//	index: postContent.length
		//}

		//then
		let fullList = document.getElementById('FullList');
		fullList.classList.add('leave')

		let second = setTimeout(()=> {
			setFullList();	
		}, 200)
	}

	/* For adjusting data before putting in dataList variable */
	React.useEffect(()=> {	

		if(mode == 'remove' || mode.includes('view')) {
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
		else if(mode == 'remove_pinnedMedia') {

			let random = 0;

			let newData = data.map(item => {
				random++;
				return {
					url: item.url,
					place: `${item.url.slice(-5)}${random}`,
					selected: false,
				}
			})

			setDataList(newData);
		}
		else if(mode == 'remove_pinnedPosts') {

			let newData = data.map(post => {

				return {
					title: post.title,
					id: post._id,
					selected: false
				}
			})

			setDataList(newData)
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

	/* Empties Selection and Removes Selected Items after socketMessage confirmation*/
	React.useEffect(()=> {
		if(socketMessage.type == 'confirmation') {
			if (selection.length < 1) {
				setDataList([]);
			}
			else if (socketMessage.message.includes('remove')) {
				let newData = dataList.filter(data => !data.selected);
				setDataList(newData);
				setSelection([]);
			}
		}
	}, [socketMessage])

	//Enter animation
	React.useEffect(()=> {
		let elCurrent = el.current;
		let delay = setTimeout(()=> {
			elCurrent.classList.remove('_enter');	
		}, 200)
	}, [])

	return (
		<div id="FullList" ref={el}>
			
			<h2 id="title">
				{`${mode.includes('view') ? "Viewing" : '' }`}
				{`${mode == 'remove' ? "Removing From" : '' }`}
				{`${mode == 'remove_pinnedMedia' ? "Removing From" : '' }`}
				{`${mode == 'remove_pinnedPosts' ? "Removing From" : '' }`}
				{`${mode == 'pinMedia' ? "Pinning From" : '' }`}
				
				<span>{source}</span>
			</h2>


			<ul id="dataList">
				{(mode == 'pinMedia' || mode.includes('remove')) &&

					dataList.map((entry) => (
						<li className={`${entry.selected == true ? 'selected' : ''}`} key={entry.place}>
							<button onClick={()=> {	

								let copy;

								//else if(mode == 'pinMedia' || mode == 'remove_pinnedMedia') {
								if(mode.includes('edia')) {
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

								else if(mode.includes('remove')) {
									copy = dataList.map(ele => {

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

								setDataList(copy)
							}}>
								<span className={`bullet ${entry.selected == true ? 'selected' : ''} ${mode.includes('edia') ? 'media' : ''}`}>
								</span>

								{(mode == 'remove' || mode == 'remove_pinnedPosts') &&
									<p>{entry.title}</p>
								}
								{(mode == 'pinMedia' || mode == 'remove_pinnedMedia' ) &&
									<img src={entry.url}/>
								}
							</button>	
						</li>
					))
				}
				{mode.includes('view') &&
					dataList.map(entry => (
						<li key={entry._id} className={`view`} onClick={()=> {
							setAsPost(entry.id);
						}}>
							<h3>{entry.title}</h3>
							<p>{entry.content}</p>

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
				}
				{/*may have to use log here*/}
			</ul>


			{/*
				O P T I O N S  o r  E X I T 
			*/}
			{mode.includes('view') &&
				<div id="exitWrapper">
					<button className={`buttonDefault`}
							onClick={()=> {

								let fullList = document.getElementById('FullList');
								fullList.classList.add('leave')

								let second = setTimeout(()=> {
									setFullList();	
								}, 200)
							}}>Exit</button>	
				</div>
			}
			{mode.includes('remove') &&
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