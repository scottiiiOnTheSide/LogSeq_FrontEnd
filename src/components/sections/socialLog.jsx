/* * * V i t a l s * * */
import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import APIaccess from '../../apiaccess';

import Log from '../blog/log';
import './sections.css';
import './socialLog.css';

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


/**
 * Exported to Main.jsx
 */
export function ManageConnections({setCurrent, current, setSocketMessage}) {

	const navigate = useNavigate(),
		  userID = sessionStorage.getItem('userID'),
		  userName = sessionStorage.getItem('userName'),
		  [connections, setConnections] = React.useState([]),
		  [searchQuery, setSearchQuery] = React.useState(''),	
		  [searchResults, setSearchResults] = React.useState([]),
		  // [searchFocus, setSearchFocus] = React.useReducer(state => !state, false),
		  [searchFocus, setSearchFocus] = React.useState(false),
		  [results, toggleResults] = React.useReducer(state => !state, false),
		  [headerText, setHeaderText] = React.useState("Connections");

	const onChange = (e) => {
		setSearchQuery(e.target.value)
	}

	//searches for users
	const handleSubmit = async(event) => {
		
		if(event.key === 'Enter') {
			event.preventDefault();
			let query = event.target.value;
			let searchResults = await accessAPI.searchUsers(query);

			searchResults = searchResults.map(user => {
				return {
					...user,
					selected: false
				}
			});

			setSearchResults(searchResults);
			toggleResults();
		}
	}

	const requestConnection = async(recipientID, username) => {
		let notif = {
			type: 'request',
			senderID: userID,
			senderUsername: userName,
			recipients: [recipientID],
			message: 'sent',
			recipientUsername: username
		}
		setSocketMessage(notif);
	}

	const removeConnection = async(userID, username) => {
		let remove = await accessAPI.removeConnection(userID);
		
		updateConnections();

		// if(remove == true) {
		// 	setSocketMessage({
		// 		type: 'confirmation',
		// 		message: 'removal',
		// 		username: username,
		// 	})
		// }
	}

	const removeSubscription = async(userID, username, direction) => {
		// let removeRequest = await accessAPI.removeSubscription(userID, direction).then((data)=> {

		// })
		let removeRequest = await accessAPI.removeSubscription(userID, direction);

		updateConnections();

		// if(removeRequest == true) {
		// 	setSocketMessage({
		// 		type: 'confirmation',
		// 		message: 'removal',
		// 		username: username,
		// 	})
		// }
	}

	const updateConnections = async()=> {
		let connections = await accessAPI.getConnections(userID);

		connections = connections.map(user => {
			return {
				...user,
				selected: false
			}
		})

		setConnections(connections);
	}

	let selectConnection = (id) => {

		let newList = connections.map(user => {
			if(user._id == id) {

				return {
					...user,
					selected: true
				}
			}
			else {

				return {
					...user,
					selected: false
				}
			}
		})
		setConnections(newList)
	}

	let selectResult = (id) => {

		let newList = searchResults.map(user => {
			if(user.id == id) {

				return {
					...user,
					selected: true
				}
			}
			else {

				return {
					...user,
					selected: false
				}
			}
		})
		setSearchResults(newList)
	}

	let goToProfile = async(userid) => {
		
		let data = await accessAPI.getSingleUser(userid);

		let delay = setTimeout(()=> {
			navigate(`/user/${data.user.userName}/${data.user._id}`, {
				state: {
					user: data.user,
					pinnedPosts: data.pinnedPosts
				}
			})
		}, 150)
	}

	//update main data on every reload
	React.useEffect(()=> {
		updateConnections();
	}, [])

	// Changes Section Header
	React.useEffect(()=> {
		if(searchFocus == true) {
			setHeaderText('Search')
		}
		else {
			setHeaderText('Connections')	
		}
	}, [searchFocus])


	// Enter / Exit Animation
	let modal = React.useRef();
	React.useEffect(()=> {
		let modalCurrent = modal.current;
		let delay = setTimeout(()=> {
			modalCurrent.classList.remove('_enter');	
		}, 200)
	}, [])

	//Enter and Leave Fade Effect
	// let [enter, setEnter] = React.useReducer(state => !state, true)
	// let el = React.useRef();
	// let element = el.current;
	
	return (
		// <div id="manageConnections" ref={el} className={`${enter == true ? '_enter' : ''}`}>
		<div id="manageConnections" ref={modal} className={`_enter`}>

			<h2>{headerText}</h2>

			<form id="searchWrapper">
				<input type="text" 
				   id="search"
				   value={searchQuery}
				   onChange={onChange} 
				   placeholder="Search Users" 
				   onKeyDown={handleSubmit}
				   onFocus={()=> {setSearchFocus(true)}}
				   onBlur={()=> {
				   	if(results.length < 1) {
				   		setSearchFocus(false);
				   		toggleResults();
				   	}
				   }}
				/>
				<button className={`buttonDefault`}
						onClick={(e)=> {
							e.preventDefault();
							setSearchResults([]); //empties results
							setSearchFocus(false);
							setSearchQuery('');

							if(searchResults < 1) {
								setSearchFocus(false);
							}
						}}>
					Clear
				</button>
			</form>
			{searchFocus &&
				<p id="aboutClearButton">Press Clear to Exit Search Results</p>
			}
			
			{/* C O N N E C T I O N S 
				{(!searchFocus && !results) &&
			*/}
				{(searchResults.length < 1 && !searchFocus) &&
				<div id="currentConnections">
					<ul>
						{connections.map((user, i) => (
							<li key={i} 
								data-id={user._id} 
								className={`${user.selected == true ? 'selected' : ''}`}
								onClick={(e)=> {
									e.preventDefault()
									selectConnection(user._id)
								}}>

								<p>{user.userName} <span>{user.fullName}</span></p>

								<div id="svgWrapper"
									className={`${user.isConnection == true ? 'connection' : ''} ${user.isSubscriber == true ? 'subscriber' : ''} ${user.isSubscription == true ? 'subscription' : ''}`}>
									{user.isConnection == true ? twoWaySVG : null}
									{user.isSubscription || user.isSubscriber ? oneWaySVG : null}
								</div>
								
								<div id="optionsWrapper">
									<button className={`buttonDefault`}
											onClick={()=> {goToProfile(user._id)}}>
										Profile
									</button>
									<button className={`buttonDefault`}
											onClick={()=> {

												if(user.isConnection == true) {
													removeConnection(user._id, user.userName);
												}
												if(user.isSubscriber == true) {
													removeSubscription(user._id, user.userName, 'from');
												}
												if(user.isSubscription == true) {
													removeSubscription(user._id, user.userName, 'to');	
												}
												
											}}>
										Remove
									</button>
								</div>
							</li>
							/*use dataset.id to get and use it*/
						))}
					</ul>
				</div>
			}

			{/* S E A R C H   R E S U LTS*/}
			{searchResults.length > 1 &&
				<div id="searchResults">
					<ul>
						{searchResults.map((user, i) => (
							<li key={i} 
								data-id={user.id}
								className={`${user.selected == true ? 'selected' : ''}`}
								onClick={(e)=> {
									e.preventDefault()
									selectResult(user.id)
								}}>
								<p>{user.username} <span>{user.fullname}</span></p>
								
								<div id="optionsWrapper">
									<button className={`buttonDefault`}
											onClick={()=> {goToProfile(user.id)}}>
										Profile
									</button>
									<button className={`buttonDefault`}
											onClick={()=> {requestConnection(user.id, user.username)}}>
										Request
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			}


			<button id="exit" className={"buttonDefault"} onClick={(e)=> {
				e.preventDefault();

				let modalCurrent = modal.current;
				modalCurrent.classList.add('_enter');

				let delay = setTimeout(()=> {
					setCurrent({
						...current,
						modal: false
					})
				}, 300)
				
			}}>Exit</button>
		</div>
	)
}

export default function SocialLog({active, current, setCurrent, log, setLog }) {

	// let [log, setLog] = React.useState([]);
	let userID = sessionStorage.getItem('userID');
	let isActive = active;
	// let [updateLog, setUpdateLog] = React.useReducer(state => !state, false);

	let updateLog = async() => {
		let data = await accessAPI.pullSocialLog();
		setLog(data);
	} 

	React.useEffect(()=> {
		updateLog();
		setCurrent({
			...current,
			social: true
		})
	}, [])

	React.useEffect(()=> {
		updateLog();
	}, [current.modal])

	let noHeading = false;

	return (
		<div id="socialLog" className={isActive == 0 ? 'active' : 'not'}>

			<Log data={log}
				 section={"social"} 
				 noHeading={noHeading} 
				 current={current} 
				 setCurrent={setCurrent}
				 updateLog={updateLog}/>
			
		</div>
	)
}