import * as React from 'react';
import APIaccess from '../../apiaccess';
import {useNavigate} from 'react-router-dom';
import Log from '../blog/log';

import './home.css';

let accessAPI = APIaccess();

let twoWaySVG = 
<svg xmlns="http://www.w3.org/2000/svg" width="30.124" height="21.732" viewBox="0 0 30.124 21.732">
  {/*<defs>
    <style>
      .cls-1 {
        fill: none;
        stroke: rgba(0,0,0,0.4);
        stroke-width: 2px;
      }
    </style>
  </defs>*/}
  <g id="Group_369" data-name="Group 369" transform="translate(-320.376 -352.134)">
    <g id="Group_367" data-name="Group 367" transform="translate(0 -31.5)">
      <g id="Group_224" data-name="Group 224" transform="translate(298.376 358)">
        <line id="Line_146" data-name="Line 146" class="cls-1" x2="25" transform="translate(22.624 32.5)"/>
        <line id="Line_148" data-name="Line 148" class="cls-1" x2="12" transform="translate(22.5 32.5) rotate(-30)"/>
      </g>
      <g id="Group_366" data-name="Group 366" transform="translate(372.5 431) rotate(-180)">
        <line id="Line_146-2" data-name="Line 146" class="cls-1" x2="25" transform="translate(22.624 32.5)"/>
        <line id="Line_148-2" data-name="Line 148" class="cls-1" x2="12" transform="translate(22.5 32.5) rotate(-30)"/>
      </g>
    </g>
  </g>
</svg>

let oneWaySVG = 
<svg xmlns="http://www.w3.org/2000/svg" width="25.624" height="7.866" viewBox="0 0 25.624 7.866">
  <defs>
    {/*<style>
      .cls-1 {
        fill: none;
        stroke: rgba(0,0,0,0.5);
        stroke-width: 2px;
      }
    </style>*/}
  </defs>
  <g id="Group_224" data-name="Group 224" transform="translate(-22 -25.634)">
    <line id="Line_146" data-name="Line 146" class="cls-1" x2="25" transform="translate(22.624 32.5)"/>
    <line id="Line_148" data-name="Line 148" class="cls-1" x2="12" transform="translate(22.5 32.5) rotate(-30)"/>
  </g>
</svg>



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
	setPinLocation,
	setLocationData,
	setPrivate,
	suggestions,
	setSuggestions,
	tagged,
	setTagged,
	setDrafts
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
		let post = data.find(post => post._id == postID);
		
		let updatedDrafts = data.map(original => {
			if(original._id == post._id) {
				return {
					...original,
					selected: true
				}
			}
			else return original	
		})
		setDrafts(updatedDrafts);

		/* Setting Post Content */
		let title = document.getElementById('title');
		title.value = post.title;

		if(post.content.length > 0) {
			post.content.forEach((piece, index) => {
				if(index == 0) {
					setPostContent([
						{
							content: piece.content,
							type: piece.type,
							index: piece.place
						}
					])
				}
				else {
					setPostContent([
						...postContent,
						{
							content: piece.content,
							type: piece.type,
							index: piece.place	
						}
					])
				}
			})
		}

		let updatedTagged = tagged.map(user1 => {
			let user2 = post.taggedUsers.find(user => user._id == user1._id);
			if(user2) {
				return { ...user1, selected: true};
			}
			else return user1;
		});
		setTagged(updatedTagged);
		// console.log(updatedTagged);

		let updatedSuggestions = suggestions.map(tag1 => {
			let tag2 = post.tags.find(tag => tag.name == tag1.name);
			if(tag2) {
				return { ...tag1, selected: true};
			}
			else return tag1;
		});
		setSuggestions(updatedSuggestions);
		// console.log(updatedSuggestions); 

		if(post.isPrivate == true) {
			setPrivate();
		}

		if(post.location) {	
			setPinLocation({
				open: true,
				lon: post.location.lon, 
				lat: post.location.lat,
			});
		}

		/*if(post.location) {	
			setLocationData({
				lon: post.location.lon, 
				lat: post.location.lat,
			})
		}*/

		// document.getElementsByName('lon')[0].value = post.location.lon;
		// document.getElementsByName('lat')[0].value = post.location.lat;

		let fullList = document.getElementById('FullList');
		fullList.classList.add('leave')

		let second = setTimeout(()=> {
			setFullList();	
		}, 500)
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
				{`${mode.includes('allPosts') ? "Public Posts" : '' }`}
				{`${mode.includes('allConnections') ? "Connected To" : '' }`}
				{`${mode == 'remove' ? "Removing From" : '' }`}
				{`${mode == 'remove_pinnedMedia' ? "Removing From" : '' }`}
				{`${mode == 'remove_pinnedPosts' ? "Removing From" : '' }`}
				{`${mode == 'pinMedia' ? "Pinning From" : '' }`}
				
				<span>{source}</span>
			</h2>

			{mode == 'allConnections' &&
				<ul id="connections">
					{data.map((connect, index)=> (
						<li key={index} >
							<img src={connect.profilePhoto} />

							<div className="text">
								<h4>{connect.userName}</h4>
								<span>{`${connect.fullName}`}</span>
							</div>

							<div id="svgWrapper"
								className={`${connect.isConnection == true ? 'connection' : ''} ${connect.isSubsciber == true ? 'subscriber' : ''} ${connect.isSubscription == true ? 'subscription' : ''}`}>
								{connect.isConnection == true ? twoWaySVG : null}
								{connect.isSubscription || connect.isSubsciber ? oneWaySVG : null}
							</div>
						</li>
					))}
				</ul>
			}

			{(mode != 'allPosts' && mode != 'allConnections') &&
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
								if(mode == 'viewDrafts') {
									setAsPost(entry.id);	
								}
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
				</ul>
			}

			{mode == 'allPosts' &&
				<Log data={data} 
				 		section={"fullList"} 
				 		// noHeading={noHeading} 
				 		// current={current} 
				 		// setCurrent={setCurrent}
				 		updateLog={setDataList}/>
			}
			


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
			{mode == 'allPosts' &&
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
			{mode == 'allConnections' &&
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
		</div>
	)
}