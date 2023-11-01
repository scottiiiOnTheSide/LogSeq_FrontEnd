/* * * V I T A L S * * */
import React, { useState, useReducer, useEffect } from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import APIaccess from '../../apiaccess';
import './notifs.css';

const accessAPI = APIaccess();

export default function Instants({sendMessage, socketMessage, setSocketMessage, setActive, isActive, accessID, setAccessID}) {

	let userID = sessionStorage.getItem('userID');
	let username = sessionStorage.getItem('userName');
	let activity = isActive;

	/*** Functions to be used by primary useEffect ***/
	let makeNotif_sendInitialRequest = async (notif) => {
		await accessAPI.newInteraction(notif).then((data) => {
			if(data) {
				console.log(data);
				setSocketMessage({
					type: 'confirmation',
					message: 'request'
				})
				setActive({
					state: true,
					type: 1
				})
				notif.originalID = data._id;
			}
		})

		let pause = setTimeout(()=> {
			sendMessage(JSON.stringify(notif));
		}, 1000)	
	}

	let makeNotif_sendAcceptRequest = async (notif) => {
		let request = await accessAPI.newInteraction(notif);

		if (request == true) {
			let pause = setTimeout(()=> {
				sendMessage(JSON.stringify(notif));
			}, 1000)
		}
		let pause = setTimeout(()=> {
			setSocketMessage({
				type: 'confirmation',
				message: 'accepted'
			})
			setActive({
				state: true,
				type: 1
			})
		}, 2000)
	}

	let makeNotif_sendCommentNotif = async (notif) => {
		await accessAPI.newInteraction(notif).then((data)=> {
			if(data) {
				setSocketMessage({
					type: 'confirmation',
					message: 'comment'
				})
				setActive({
					state: true,
					type: 1
				})
			}
		})

		let pause = setTimeout(()=> {
			sendMessage(JSON.stringify(notif));
		}, 1000)
	}

	let makeNotif_markNotifRead = async(notif) => {
		let request = await accessAPI.newInteraction(notif).then((data)=> {
			setSocketMessage({message: 'notif marked as read'});
		})
	}

	let makeNotif_taggedPost = async(notif) => {
		let request = await accessAPI.newInteraction(notif).then((data) => {
			if(data) {
				console.log(data);
				setSocketMessage({
					type: 'confirmation',
					message: 'post'
				})
				setActive({
					state: true,
					type: 1
				})
			}
		})

		let pause = setTimeout(()=> {
			sendMessage(JSON.stringify(notif));
		}, 1000)	
	}



	let interact = (arg) => {

		/* Sets socketMessage to accept connection request */
		if(arg == 'accept') {

			//purpose of message is simply to notify requester of connection acceptance
			let notif = {
				type: 'request',
				recipients: [accessID.accept],
				senderID: userID,
				senderUsername: username,
				message: 'accept'
			};
			setSocketMessage(notif);
			setActive({
				type: null,
				state: false
			})
			console.log(accessID);
			console.log(notif);

		}
		else if(arg == 'ignore') {
			console.log(socketMessage);
			(async()=> {
				let ignore = await accessAPI.newInteraction({
					originalID: accessID.ignore, 
					message: 'ignore',
					type: 'request',
					senderID: socketMessage.senderID,
					recipients: [socketMessage.recipient]
				})
			})();
			setSocketMessage({
				type:'confirmation',
				message: 'ignore'
			})
			setActive({
				type: 1,
				state: true
			})

		} else if(arg == 'markRead') {

			//a popUp need not be made,
			//but makes sure the notif count updates
			setSocketMessage({
				message: 'a notif marked read'
			})
		}
		//else if (socketMessage.type == 'comment' || socketMessage.type == 'tagging') {

		// }
	}

	/**
	 * Upon change of 'socketMessage'
	 * execute a makeNotif function with socketMessage
	 */
	useEffect(()=> {

		if(socketMessage.type == 'request' && socketMessage.message == 'accept') {
			makeNotif_sendAcceptRequest(socketMessage);
		}
		else if (socketMessage.type == 'request' && socketMessage.message == 'sent') {
			if(!socketMessage.recipients) {
				return
			} else {
				console.log(socketMessage);
				makeNotif_sendInitialRequest(socketMessage);
			}
		}
		else if(socketMessage.type == 'comment') {

			if(socketMessage.message == 'initial') {
				makeNotif_sendCommentNotif(socketMessage);

			}else if(socketMessage.message == 'response-recieved') {

			}
		}
		else if(socketMessage.type == 'tagging') {
			if(socketMessage.message == 'sent') {
				makeNotif_taggedPost(socketMessage);
			}
		}
		else if(socketMessage.type == 'confirmation' && socketMessage.message == 'removal') {
			setActive({
				state: true,
				type: 1
			})
		}
		else if (socketMessage.type == 'confirmation' && socketMessage.message == 'post') {
			setActive({
				state: true,
				type: 1
			});
		}
		else if(socketMessage.type == 'markRead') {
			makeNotif_markNotifRead(socketMessage);
		}
	}, [socketMessage]);

	/**
	 * Returns specific popUp notification type based on
	 * message recieved from webSocket
	 */
	const popUpNotif = React.useRef();
	// React.useEffect(()=> {
	// 	if(isActive == false) {
	// 		let delay = setTimeout(()=> {

	// 		})
	// 	}
	// }, [isActive])

	// console.log(isActive)

	let returnPopUpType = (message) => {

		return (
			<div id="popUpNotif" className={`${isActive.state == true ? 'active' : ''}
											 ${isActive.state == false ? 'nonActive' : ''}}>										`}>

				{(message.type == 'tagging' && message.message == 'recieved') &&
					<p>{message.senderUsername} tagged you in a post "{message.postTitle}"</p>
				}
				{(message.type == 'comment' && message.message == 'initial-recieved') &&
					<p>{socketMessage.senderUsername} left a comment on "{socketMessage.postTitle}"</p>
				}
				{(message.type == 'request' && message.message == 'initial') &&
					<p>{message.senderUsername} has sent a connection request!</p>
				}
				{(message.type == 'request' && message.message == 'accepted') &&
					<p>You are connected with {message.senderUsername} !</p>
				}
				{(message.type == 'confirmation' && message.message == 'accepted') &&
					<p>You are now connected !</p>
				}
				{(message.type == 'confirmation' && message.message == 'request') &&
					<p>Connection Request Sent !</p>
				}
				{(message.type == 'confirmation' && message.message == 'removal') &&
					<p>Disconnected with {message.username}</p>
				}
				{(message.type == 'confirmation' && message.message == 'ignore') &&
					<p>Request Ignored</p>
				}
				{(message.type == 'confirmation' && message.message == 'comment') &&
					<p>Comment Posted</p>
				}
				{(message.type == 'confirmation' && message.message == 'post') &&
					<p>Post Uploaded !</p>
				}
						


				{isActive.type == 3 &&
					<ul id="options">
						<li><button className="buttonDefault" onClick={()=> {setActive({type: null, state: false})}}>Close</button></li>
						<li><button className="buttonDefault" onClick={()=> {interact('accept')}}>Accept</button></li> 
						<li><button className="buttonDefault" onClick={()=> {interact('ignore')}}>Ignore</button></li>
						{/*setSocketMessage for connection request acceptace or ignore: users ID will be saved in state*/}
					</ul>
				}
				{isActive.type == 2 &&
					<ul id="options">
						<li><button className="buttonDefault" onClick={()=> {setActive({type: null, state: false})}}>Close</button></li>
						<li><button className="buttonDefault">Interact</button></li> 
						{/*has button who's function changes based on */}
					</ul>
				}
				{isActive.type == 1 &&
					<ul id="options">
						<li><button className="buttonDefault" onClick={()=> {setActive({type: null, state: false})}}>Close</button></li>
					</ul>
				}
			</div>	
		)	
	}

	// console.log(socketMessage);
	
	return (
		returnPopUpType(socketMessage)
	)
}

/***
 * Format for socketMessage object
 * 
 * type: confirmation, request, comment, tagging
 * sender:
 * recipients:
 * message: 
 */



