import * as React from 'react';
import APIaccess from '../../apiaccess';

import '../../components/home/home.css';
import './notifs.css';

let accessAPI = APIaccess();


export default function InteractionsList({setNotifList, unreadCount, setUnreadCount, setSocketMessage, socketMessage }) {

	let [notifs, setNotifs] = React.useState([]);
	let username = sessionStorage.getItem('userName');
	let userID = sessionStorage.getItem('userID');

	let updateList = async() => {
		let data = await accessAPI.getInteractions(); 

		let count = 0;
	     for(let i = 0; i < data.length; i++) {
	        if(data[i].isRead == false) {
	            count++;
	        }
	      }
	    if(count < 10) {
	      count = '0' + count;
	    } else if (count > 99) {
	      count = '99';
	    }
	    setUnreadCount(count);
		setNotifs(data);
	}
	React.useEffect(()=> {
		updateList();
	}, [])
	React.useEffect(()=> {
		updateList();
	}, [socketMessage])


	let interact = (arg, ID, username, postID) => {

		/* 
			set middle two arguments as 'undefined' when using
			function for posts / comments
		*/

		if(arg == 'accept') {

			let notif = {
				type: 'request',
				recipients: [userID],
				senderID: ID,
				senderUsername: username,
				message: 'accept'
			};
			setSocketMessage(notif);

		} else if(arg == 'ignore') {

			let notif = {
				type: 'request',
				recipients: [userID],
				senderID: ID,
				senderUsername: username,
				message: 'ignore'
			};
			setSocketMessage(notif);

		} else if(arg == 'markRead') {

				let notif = {
					type: 'markRead',
					notifID: ID,
					userID: userID,
					senderUsername: username
				};
				setSocketMessage(notif);

				let delay = setTimeout(()=> {
					updateList()
				}, 200)
		}
	}


	let returnNotifType = (notif) => {

		// save notif._id as key
		return <li className="notif" key={notif._id}>
				{notif.isRead == false &&
					<span className="unread">!</span>
				}
				{(notif.type == 'request' && notif.message == 'sent') &&
					<p>You sent {notif.recipientUsername} a request</p>
				}
				{(notif.type == 'request' && notif.message == 'recieved') &&
					<p>You recieved a request from {notif.senderUsername}</p>
				}
				{(notif.type == 'request' && notif.message == 'accept') &&
					<p>You and {notif.senderUsername} are now connected!</p>
				}
				{(notif.type == 'comment' && notif.message == 'initial') &&
					<p>{notif.senderUsername} left a comment on your post {notif.postTitle}</p>
				}
				{(notif.type == 'comment' && notif.message == 'response') &&
					<p>{notif.senderUsername} responded to your comment on {notif.postTitle}</p>
				}
				{(notif.type == 'tagging' && notif.message == 'recieved') &&
					<p>{notif.senderUsername} tagged you in a post {notif.postTitle}</p>
				}

				{notif.type == 'comment' && 
					<div className="options">
						<button className="buttonDefault">See Comment</button>
						<button className="buttonDefault"
								onClick={()=> {interact('markRead', notif._id, username )}}>Mark Read</button>
					</div>
				}
				{notif.type == 'tagging' &&
					<div className="options">
						<button className="buttonDefault">See Post</button>
						<button className="buttonDefault"
								onClick={()=> {interact('markRead', notif._id )}}>Mark Read</button>
					</div>
				}
				{(notif.type == 'request' && notif.message == 'recieved') &&
					<div className="options">
						<button className="buttonDefault" 
								onClick={()=> {interact('accept', notif.sender, notif.senderUsername)}}>Accept</button>
						<button className="buttonDefault" 
								onClick={()=> {interact('ignore', notif.sender, notif.senderUsername)}}>Ignore</button>
					</div>
				}
			   </li>
	}

	// console.log(notifs[0])

	return (
		<div id="interactionsList"> 

			<div id="header">
				<h2>Interactions
					<span id='username'>{username}'s</span>
				</h2>
				
				<button onClick={setNotifList}>
					<p>{unreadCount}</p>
					<span>x</span>
				</button>
			</div>


			<ul id="notifList">
				{notifs.map(notif => (
					returnNotifType(notif)
				))}
			</ul>


			<div id="buttonBar">
				<button className="buttonDefault">PROFILE</button>
				<button className="buttonDefault">LOGOUT</button>
			</div>
		</div>
	)

}


/***
 * Format for socketMessage object
 * 
 * type: confirmation, request, comment, tagging
 * sender:
 * recipients:
 * message: 
 * 
 * 
 * if comment: see comment & mark read
 * if tag: see post & mark read
 * if request: accept & ignore (both mark read)
 */







