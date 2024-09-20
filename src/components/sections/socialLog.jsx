/* * * V i t a l s * * */
import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import APIaccess from '../../apiaccess';

import Log from '../blog/log';
import './sections.css';
import './socialLog.css';

let accessAPI = APIaccess();


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

	const requestConnection = async(recipientID) => {
		let notif = {
			type: 'request',
			senderID: userID,
			senderUsername: userName,
			recipients: [recipientID],
			message: 'sent'
		}
		setSocketMessage(notif);
	}

	const removeConnection = async(userID, username) => {
		let remove = await accessAPI.removeConnection(userID);
		if(remove == true) {
			setSocketMessage({
				type: 'confirmation',
				message: 'removal',
				username: username,
			})
		}
		updateConnections();
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
			navigate(`/user/${data.user.userName}`, {
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
								
								<div id="optionsWrapper">
									<button className={`buttonDefault`}
											onClick={()=> {goToProfile(user._id)}}>
										Profile
									</button>
									<button className={`buttonDefault`}
											onClick={()=> {removeConnection(user._id, user.userName)}}>
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
											onClick={()=> {requestConnection(user.id)}}>
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