
import React, {useState, useEffect} from 'react';
import './interactions.css';

export default function InteractionsList({apiAddr, userKey, userID, newNotif, notifList, toggleNotifList}) {

	const updateInteractions = async() => {

		let api = apiAddr,
			token = userKey,
			id = userID;

		const request = await fetch(`${api}/users/notif/sendAll`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
        		'Content-length': 0,
        		'Accept': 'application/json',
        		'Host': api,
        		'auth-token': token
			},
			body: JSON.stringify({
				sender: id
			})
		});

		const response = await request.json();
		updateNotifs(response);
	}

	const [notifs, updateNotifs] = useState([]);

	useEffect(()=> {
		updateInteractions();
	}, [])

	return (
		<div 
		className={notifList ? 'active' : 'mute'}
		id='interactions'>
			<h2>Interactions</h2>

			<ul>
			</ul>

			<button onClick={toggleNotifList}>Exit</button>
			{/*10. 16. 2022 this button must also toggle mainMenu button back to regular state*/}
		</div>
	)
}