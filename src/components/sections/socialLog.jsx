/* * * V i t a l s * * */
import * as React from 'react';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import './sections.css';

let accessAPI = APIaccess();


/**
 * Exported to Main.jsx
 */
export function ManageConnections({setCurrent, current, setSocketMessage}) {

	const userID = sessionStorage.getItem('userID'),
		  userName = sessionStorage.getItem('userName');
	const [connections, setConnections] = React.useState([]),
		  [searchResults, setSearchResults] = React.useState([]),
		  [searchFocus, setSearchFocus] = React.useReducer(state => !state, false),
		  [results, toggleResults] = React.useReducer(state => !state, false);

	//searches for users
	const handleSubmit = async(event) => {
		
		if(event.key === 'Enter') {
			let query = event.target.value;
			let search = await accessAPI.searchUsers(query);
			console.log(search)
			setSearchResults(search);
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
		setConnections(connections);
		// console.log(connections)
	}

	let [enter, setEnter] = React.useReducer(state => !state, true)
	let el = React.useRef();
	let element = el.current;

	React.useEffect(()=> {
		updateConnections();
		if(element) {
			setEnter();
		}
	}, [element, ])
	
	return (
		<div id="manageConnections" ref={el} className={`${enter == true ? '_enter' : ''}`}>
			
			<input type="text" 
				   id="search" 
				   placeholder="Search Users" 
				   onKeyDown={handleSubmit}
				   onFocus={()=> {setSearchFocus(); toggleResults()}}
			/>

			{!searchFocus &&
				<div id="currentConnections">
					<h2>My Connections</h2>
						
					<ul>
						{connections.map((user, i) => (
							<li key={i} data-id={user.id}>
								<p>{user.userName} <span>{user.fullName}</span></p>
								<button onClick={()=> {removeConnection(user.id, user.userName)}}>&#x2716;</button>
							</li>
							/*use dataset.id to get and use it*/
						))}
					</ul>
				</div>
			}

			{results &&
				<div id="results">
					<h2>Results</h2>
					
					<ul>
						{searchResults.map((user, i) => (
							<li key={i} data-id={user.id}>
								<p>{user.username} <i>{user.fullname}</i></p>
								<button onClick={()=> {requestConnection(user.id)}}>Connect</button>
							</li>
							/*use dataset.id to get and use it*/
						))}
					</ul>

					/* have menu closing button clear search bar */
					<button onClick={()=> {toggleResults(); setSearchFocus()}}>Close Search</button>
				</div>
			}
			<button id="exit" className={"buttonDefault"} onClick={(e)=> {
				e.preventDefault();
				setEnter()
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

export default function SocialLog({active, current, setCurrent}) {

	let [log, setLog] = React.useState([]);
	let userID = sessionStorage.getItem('userID');
	let isActive = active;

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
		<div id="socialLog" className={isActive == 1 ? 'active' : 'not'}>

			<Log data={log} userID={userID} noHeading={noHeading} current={current} setCurrent={setCurrent}/>
			
		</div>
	)
}