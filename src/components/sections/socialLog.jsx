/* * * V i t a l s * * */
import * as React from 'react';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import './sections.css';
import './socialLog.css';

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
		  [results, toggleResults] = React.useReducer(state => !state, false),
		  [headerText, setHeaderText] = React.useState("Connections");

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
		setConnections(newList)
	}

	React.useEffect(()=> {
		if(searchFocus == true) {
			setHeaderText('Search')
		}
		else {
			setHeaderText('Connections')	
		}
	}, [searchFocus])

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

			<h2>{headerText}</h2>

			<form id="searchWrapper">
				<input type="text" 
				   id="search" 
				   placeholder="Search Users" 
				   onKeyDown={handleSubmit}
				   onFocus={()=> {setSearchFocus(); toggleResults()}}
				/>
				<button className={`buttonDefault`}
						onClick={(e)=> {
							e.preventDefault();
							toggleResults(); 
							setSearchFocus()}}>
					Clears
				</button>
			</form>
			{results &&
				<p id="aboutClearButton">Press Clear to Exit Search Results</p>
			}
			
			{/* C O N N E C T I O N S */}
			{!searchFocus &&
				<div id="currentConnections">
					<ul>
						{connections.map((user, i) => (
							<li key={i} 
								data-id={user.id} 
								className={`${user.selected == true ? 'selected' : ''}`}
								onClick={(e)=> {
									e.preventDefault()
									selectConnection(user.id)
								}}>

								<p>{user.userName} <span>{user.fullName}</span></p>
								
								<div id="optionsWrapper">
									<button className={`buttonDefault`}>Profile</button>
									<button className={`buttonDefault`}
											onClick={()=> {removeConnection(user.id, user.userName)}}>
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
			{results &&
				<div id="results">
					<ul>
						{searchResults.map((user, i) => (
							<li key={i} data-id={user.id}>
								<p>{user.username} <i>{user.fullname}</i></p>
								<button onClick={()=> {requestConnection(user.id)}}>Connect</button>
							</li>
							/*use dataset.id to get and use it*/
						))}
					</ul>
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
		<div id="socialLog" className={isActive == 1 ? 'active' : 'not'}>

			<Log data={log}
				 section={"social"} 
				 noHeading={noHeading} 
				 current={current} 
				 setCurrent={setCurrent}
				 updateLog={updateLog}/>
			
		</div>
	)
}