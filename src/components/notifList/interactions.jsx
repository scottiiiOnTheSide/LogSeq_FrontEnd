
import React, {useState, useEffect} from 'react';
import './interactions.css';

export default function InteractionsList({apiAddr, userKey, userID, newNotif, notifList, toggleNotifList, updateSocialBlog}) {

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

		let response = await request.json();

		response = response.map((data) => {
			let info = data[0]['connectionRequest'];
			return info;
		});

		let reorder = [];
    	for(let i = response.length; i >= 0; i--) {
      		reorder.push(response[i]);
    	}
    	reorder.splice(0, 1);

		updateNotifs(reorder);
	}

	const acceptConnection = async(recipient) => {

		let api = apiAddr,
			token = userKey,
			id = userID;

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
				sender: id,
				recipient: recipient,
				status: "accepted"
			})
		});

		//after accepting request, component should first dissappear then reappear
		//in order to show change
		updateInteractions()
		updateSocialBlog()
	}

	const ignoreRequest = async() => {}

	const [notifs, updateNotifs] = useState([]);
	const toggle = notifList == true ? 'true' : 'false';

	useEffect(()=> {
		updateInteractions();
		console.log(notifs[0]);
	}, [toggle])

	return (
		<div 
		className={notifList ? 'active' : 'mute'}
		id='interactions'>
			<h2>Interactions</h2>

			<ul>
				{notifs.map((data, i) => (

					<li key={i}>
						{data.sender == userID && data.status == 'sent' ? 
							<p>You sent {data.recipientUsername} a connection request</p>
						: null}
						{data.sender !== userID && data.status == 'sent' ?
							<div>
								<p>{data.senderUsername} sent you an connection request</p>
								<button onClick={()=> {acceptConnection(data.sender)}}>Accept</button>
								<button onClick={ignoreRequest}>Ignore</button>
							</div>
						: null}
						{data.status == 'accepted' ?
							<p>
								Connection made with {data.acceptee}
							</p>
						: null}
					</li>
				))}
			</ul>

			<button onClick={toggleNotifList}>Exit</button>
			{/*10. 16. 2022 this button must also toggle mainMenu button back to regular state*/}
		</div>
	)
}