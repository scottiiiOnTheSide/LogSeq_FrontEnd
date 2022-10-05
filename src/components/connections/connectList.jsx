
/*
	Component for housing list of all user's active connections
	with a search bar, allowing them to find and add more
*/

import React, { useState, useEffect, useReducer, useRef } from 'react';
import './connectList.css';


export default function ConnectList({apiAddr, userID, userKey, toggleMainMenu, toggleConnections}) {

	let [connections, setConnections] = useState([]);
	let [searchresults, setSearchresults] = useState([]);

	const updateConnections = async() => {

		let api = apiAddr,
			token = userKey;

		const response = await fetch(`${api}/users/getuser/${userID}?sendConnects=true`, {
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

	const [searchfocus, setSearchFocus] = useReducer(state => !state, false);
	let [results, toggleResults] = useReducer(state => !state, false);

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
				   onFocus={setSearchFocus}
				   onBlur={setSearchFocus}/>

			{!searchfocus &&
				<div id="currentConnections">
					<h2>My Connections</h2>
						
					<ul>
						{connections.map((user, i) => (
							<li key={i} data-id={user.id}>{user.username}</li>
							/*use dataset.id to get and use it*/
						))}
					</ul>
				</div>
			}

			{results &&
				<div id="results">
					<h2>Results</h2>
					<button>Exit</button>

					<ul>
						{searchresults.map((user, i) => (
							<li key={i} data-id={user.id}>{user.username}</li>
							/*use dataset.id to get and use it*/
						))}
					</ul>
				</div>
			}

			<button id="exit" onClick={()=> { toggleMainMenu(); toggleConnections()}}>Exit</button>
		</div>
	)
}