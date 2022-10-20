
/*
	Component for housing list of all user's active connections
	with a search bar, allowing them to find and add more
*/

import React, { useState, useEffect, useReducer, useRef } from 'react';
import './connectList.css';


export default function ConnectList({apiAddr, userID, userKey, toggleMainMenu, toggleConnections, updateNotifs}) {

	const updateConnections = async() => {

		let api = apiAddr,
			token = userKey;

		const response = await fetch(`${api}/users/getuser/${userID}/?query=sendConnects`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
        		'Content-length': 0,
        		'Accept': 'application/json',
        		'Host': api,
        		'auth-token': token
			}
		})

		const usersConnections = await response.json()
		setConnections(usersConnections);
	}

	const requestConnection = async(to) => {

		let api = apiAddr,
			token = userKey,
			from = userID;

		const request = await fetch(`${api}/users/notif/connection`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
        		'Content-length': 0,
        		'Accept': 'application/json',
        		'Host': api,
        		'auth-token': token
			},
			body: JSON.stringify({
				sender: from,
				recipient: to,
				status: "sent"
			})
		});

		let response = await request.json();
		updateNotifs();
	}

	const removeConnection = async(remove) => {

		let api = apiAddr,
			token = userKey;

		const request = 
		await fetch(`${api}/users/getuser/${userID}/?query=removeConnect&remove=${remove}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
        		'Content-length': 0,
        		'Accept': 'application/json',
        		'Host': api,
        		'auth-token': token
			}
		})

		const response = await request.json();
		updateConnections();
	}

	const runSearch = async(query) => {

		let	api = apiAddr,
			token = userKey;

		const search = await fetch(`${api}/users/search/?query=${query}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
	        	'Content-length': 0,
	        	'Accept': 'application/json',
	        	'Host': api,
	        	'auth-token': token
			}
		});

		let results = await search.json();
		setSearchresults(results);
	}

	const [connections, setConnections] = useState([]);
	const [searchresults, setSearchresults] = useState([]);
	const [searchfocus, setSearchFocus] = useReducer(state => !state, false);
	const [results, toggleResults] = useReducer(state => !state, false);

	const handleSubmit = async(event) => {
		if(event.key === 'Enter') {

			let query = event.target.value;
			runSearch(query);
			console.log(searchresults);
			// toggleResults();
		}
	}

	useEffect(() => {
		updateConnections();
		console.log(connections);
	}, [])

	return (
		<div id="connectList">

			<input type="text" 
				   id="search" 
				   placeholder="Search Users" 
				   onKeyDown={handleSubmit}
				   onFocus={()=> {setSearchFocus(); toggleResults()}}
				   // onBlur={()=> {setSearchFocus(); toggleResults()}}
			/>

			{!searchfocus &&
				<div id="currentConnections">
					<h2>My Connections</h2>
						
					<ul>
						{connections.map((user, i) => (
							<li key={i} data-id={user.id}>
								{user.username}
								<button onClick={() => removeConnection(user.id)}>&#x2716;</button>
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
						{searchresults.map((user, i) => (
							<li key={i} data-id={user.id}>
								{user.username} <i>{user.name}</i>
								<button onClick={()=> requestConnection(user.id)}>Connect</button>
							</li>
							/*use dataset.id to get and use it*/
						))}
					</ul>

					<button onClick={()=> {toggleResults(); setSearchFocus()}}> Close Search</button>
				</div>
			}

			<button id="exit" onClick={()=> { toggleMainMenu(); toggleConnections()}}>Exit</button>
		</div>
	)
}