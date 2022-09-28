
/*
	Component for housing list of all user's active connections
	with a search bar, allowing them to find and add more
*/

import React, { useState, useEffect, useReducer, useRef } from 'react';
import './connectList.css';


export default function ConnectList({apiAddr, userID, toggleMainMenu, toggleConnections}) {

	const updateConnections = async() => {
		/*
			get the user, using userKey
			to get their connections list as a var 
			use api endpoint for getting single user
		*/
		const response = await fetch(`${apiAddr}/getuser/:${userID}`, {
			'Content-Type': 'application/json',
        	'Content-length': 0,
        	'Accept': 'application/json',
        	'Host': apiAddr,
        	'auth-token': user
		})

		const user = await response.json()
		console.log(user);
	}

	const [searchfocus, setSearchFocus] = useReducer(state => !state, false);
	let [results, toggleResults] = useReducer(state => !state, false);

	const handleSubmit = async(event) => {
		if(event.key === 'Enter') {

		}
	}

	useEffect(() => {
		//call updateConnection on mount
	}, [])

	return (
		<div id="connectList">

			<input type="text" 
				   id="search" 
				   placeholder="Search Users" 
				   onKeyDown={handleSubmit}
				   onFocus={setSearchFocus}/>

			{!searchfocus &&
				<div id="currentConnections">
					<h2>My Connections</h2>
						
					<ul>
						{/*connections.map((item,i) => 
	        				<li key={i}>item.name</li>
	      				) */}
					</ul>
				</div>
			}

			{results &&
				<div id="results">
					<h2>Results</h2>
					<button>Exit</button>

					<ul>
						{/*results.map((item,i) => 
        					<li key={i}>item.name</li>
      					) */}
					</ul>
				</div>
			}

			<button id="exit" onClick={()=> { toggleMainMenu(); toggleConnections()}}>Exit</button>
		</div>
	)
}