import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import APIaccess from '../../apiaccess';
import useUIC from '../../UIcontext';

import '../../components/base/home.css';
import './notifs.css';

let accessAPI = APIaccess();


export default function InteractionsList({setNotifList, unreadCount, setUnreadCount, setSocketMessage, socketMessage, accessID, setAccessID, setUserSettings}) {

	let [notifs, setNotifs] = React.useState([]);
	let username = sessionStorage.getItem('userName');
	let userID = sessionStorage.getItem('userID');
	let navigate = useNavigate();
	const { logout } = useUIC();
	// const [confirm, setConfirm] = React.useReducer(state => !state, false);

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
	let interact = async(arg, ID, username, postID, notif) => {

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
				// setSocketMessage(notif);
				let request = await accessAPI.newInteraction(notif);

				let delay = setTimeout(()=> {
					updateList()
				}, 200)
		} else if(arg == 'viewPost') {

			(async ()=> {
				let post = await accessAPI.getBlogPost(notif.url);
				let details = JSON.parse(notif.details);

				if(notif.commentID)
				setAccessID({
					commentID: details.commentID
				})
				setTimeout(()=> {
					navigate(`/post/${accessID.postURL}`, {
							state: {post: post}
						})
				}, 300)
			})();
		
		}
	}
	let goToUserProfile = async() => {

		let data = await accessAPI.getSingleUser(userID);
		
		let delay = setTimeout(()=> {
			navigate(`/user/${username}`, {
				state: {
					user: data.user,
					pinnedPosts: data.pinnedPosts
				}
			})
		}, 150)
	}
	let goToUserSettings = async() => {

		let settings = await accessAPI.userSettings({option: 'getUserSettings'});

		let delay = setTimeout(()=> {
			navigate(`/settings`, {
				state: {
					data: settings
				}
			})
		}, 150)
	}

	React.useEffect(()=> {
		updateList();
	}, [])

	React.useEffect(()=> {
		updateList();
	}, [socketMessage])


	
	let returnNotifType = (notif) => {

		let details
		if(notif.details) {
			details = JSON.parse(notif.details);	
		}
		
		// save notif._id as key
		return <li className="notif" key={notif._id} onClick={()=> {console.log(notif)}}>
				{notif.isRead == false &&
					<span className="unread">!</span>
				}

				<div id="body">
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
						<p>{notif.senderUsername} left a comment on your post "{details.postTitle}"</p>
					}
					{(notif.type == 'comment' && notif.message == 'response') &&
						<p>{notif.senderUsername} responded to your comment on "{details.postTitle}"</p>
					}
					{(notif.type == 'tagging' && notif.message == 'recieved') &&
						<p>{notif.senderUsername} tagged you in a post {details.postTitle}</p>
					}

					{notif.type == 'comment' && 
						<div className="options">
							<button className="buttonDefault">See Comment</button>
							<button className="buttonDefault"
									onClick={()=> {interact('markRead', notif._id, username )}}>
								Mark Read
							</button>
						</div>
					}
					{notif.type == 'tagging' &&
						<div className="options">
							<button className="buttonDefault">See Post</button>
							<button className="buttonDefault"
									onClick={()=> {interact('markRead', notif._id )}}>
								Mark Read
							</button>
						</div>
					}
					{(notif.type == 'request' && notif.message == 'recieved') &&
						<div className="options">
							<button className="buttonDefault" 
									onClick={()=> {interact('accept', notif.sender, notif.senderUsername)}}>
								Accept
							</button>
							<button className="buttonDefault" 
									onClick={()=> {interact('ignore', notif.sender, notif.senderUsername)}}>
								Ignore
							</button>
							<button className="buttonDefault"
									onClick={()=> {interact('markRead', notif._id )}}>
								Mark Read
							</button>
						</div>
					}
					{(notif.type == 'request' && notif.message == 'accept') &&
						<div className="options">
							<button className="buttonDefault" 
									onClick={()=> {interact('accept', notif.sender, notif.senderUsername)}}>
								Accept
							</button>
							<button className="buttonDefault" 
									onClick={()=> {interact('ignore', notif.sender, notif.senderUsername)}}>
								Ignore
							</button>
							<button className="buttonDefault"
									onClick={()=> {interact('markRead', notif._id )}}>
								Mark Read
							</button>
						</div>
					}
				</div>
			   </li>
	}

	let modal = React.useRef();
	React.useEffect(()=> {
		let modalCurrent = modal.current;
		let delay = setTimeout(()=> {
			modalCurrent.classList.remove('_enter');	
		}, 200)
	}, [])

	return (
		// <div id="interactionsList" ref={el} className={`${enter == true ? '_enter' : ''}`}>
		<div id="interactionsList" ref={modal} className={`_enter`}> 

			<div id="header">
				<h2>Interactions
					<span id='username'>{username}'s</span>
				</h2>
				
				<button onClick={(e)=> {
							e.preventDefault();

							let modalCurrent = modal.current;
							modalCurrent.classList.add('_enter');
							
							let delay = setTimeout(()=> {
								setNotifList();
							}, 300)
				}}>
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
				<button className="buttonDefault"
						onClick={goToUserProfile}>PROFILE</button>
				<button className="buttonDefault" 
						onClick={goToUserSettings}>SETTINGS</button>
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







