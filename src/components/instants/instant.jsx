/* * * V I T A L S * * */
import React, { useState, useReducer, useEffect } from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import {useNavigate} from 'react-router-dom';
import APIaccess from '../../apiaccess';
import './notifs.css';

const accessAPI = APIaccess();

export default function Instants({sendMessage, socketMessage, setSocketMessage, setActive, isActive, accessID, setAccessID, getUnreadCount}) {

	const navigate = useNavigate();
	let userID = sessionStorage.getItem('userID');
	let username = sessionStorage.getItem('userName');
	let activity = isActive;

	/***
	 * 12. 20. 2023
	 * 
	 * All <manage* > component api functions to be processed through <instant>
	 * as to streamline UX of user making decisions
	 * 
	 */

	/*** 
		Functions to be used by primary useEffect 
	***/
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
			notif._id = data;
		})

		let pause = setTimeout(()=> {
			sendMessage(JSON.stringify(notif));
		}, 1000)
	}

	let makeNotif_markNotifRead = async(notif) => {
		console.log(notif);
		let request = await accessAPI.newInteraction(notif);

		if(request) {
			setSocketMessage({message: 'mark read'});
			console.log('something')
		}
		getUnreadCount();
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
				notif._id = data;
			}
		})

		let pause = setTimeout(()=> {
			sendMessage(JSON.stringify(notif));
		}, 1000)	
	}

	let action_NewTag = async(data) => {

		console.log(data);
		let request = await accessAPI.newGroup(data);

			if(request.alreadyExists) {
				setSocketMessage({
					type: 'response',
					message: 'alreadyExists',
					groupID: request.id
				})
				setActive({
					state: true,
					type: 2
				})
			}
			else if (request.confirm) {
				setSocketMessage({
					type: 'confirmation',
					message: 'tagAdd',
					groupName: request.name
				})
				setActive({
					state: true,
					type: 1
				})
			}
	}

	let action_addTag = async(data) => {

		let request = await accessAPI.manageGroup('addUser', data);

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				message: 'tagAdd',
				groupName: request.groupName
			})
			setActive({
				state: true,
				type: 1
			})
		}
		else if(request.message) {
			setSocketMessage({
				type: 'error',
				message: request.message
			})
			setActive({
				state: true,
				type: 1
			})
		}
	}

	let action_deleteTag = async(data) => {

		let request = await accessAPI.manageGroup('deleteGroup', data);

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				message: 'tagDelete',
				groupName: request.groupName
			})
			setActive({
				state: true,
				type: 1
			})
		}
		else if(request.message) {
			setSocketMessage({
				type: 'error',
				message: request.message
			})
			setActive({
				state: true,
				type: 1
			})
		}
	}

	let action_newCollection = async(data) => {
		let request = await accessAPI.newGroup(data);

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				message: 'newCollection',
				groupName: request.name
			})
			setActive({
				state: true,
				type: 1
			})
		}
		else if(request.alreadyExists) {
			setSocketMessage({
				type: 'error',
				message: request.alreadyExists
			})
			setActive({
				state: true,
				type: 1
			})
		}
	}

	let action_renameCollection = async(data) => {
		let request = await accessAPI.manageGroup('renameGroup', data);

		if(request == true) {
			setSocketMessage({
				type: 'confirmation',
				message: 'renamedCollection',
			})
			setActive({
				state: true,
				type: 1
			})
		}
		else if(request.message) {
			setSocketMessage({
				type: 'error',
				message: request.message
			})
			setActive({
				state: true,
				type: 1
			})
		}
	}

	let action_deleteCollection = async(data) => {

		let request = await accessAPI.manageGroup('deleteGroup', data);

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				message: 'deletedCollection',
				groupName: request.groupName
			})
			setActive({
				state: true,
				type: 1
			})
		}
		else if(request.message) {
			setSocketMessage({
				type: 'error',
				message: request.message
			})
			setActive({
				state: true,
				type: 1
			})
		}
	}

	let action_privatizeCollection = async(data) => {
		let request = await accessAPI.manageGroup('privatizeGroup', data);

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				message: 'privatizedCollection',
				isPrivate: request.isPrivate
			})
			setActive({
				state: true,
				type: 1
			})
		}
		else if(request.message) {
			setSocketMessage({
				type: 'error',
				message: request.message
			})
			setActive({
				state: true,
				type: 1
			})
		}
	}


	/*** 
		Response functions to alerts recieved by user
	***/
	let interact = async(arg) => {

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
		} 

		else if(arg == 'markRead') {

			let notif = {
				type: 'markRead',
				notifID: accessID.notifID,
				userID: userID,
			};
			makeNotif_markNotifRead(notif);
		} 

		else if(arg == 'viewPost') {

			let post = await accessAPI.getBlogPost(accessID.postURL);
			setAccessID({
				commentID: accessID.commentID
			})
			setTimeout(()=> {
				navigate(`/post/${accessID.postURL}`, {
						state: {post: post}
					})
			}, 300)
		} 

		else if (arg == 'remove') {

			if(socketMessage.message == 'confirm_deletePost') {

				navigate(`/home`);

				let request = await accessAPI.deletePost(accessID.remove).then((data)=> {
					if(data) {
						setSocketMessage({
							type: 'confirmation',
							message: 'deletedPost'
						})
						setActive({
							state: true,
							type: 1
						})
					}
				})

			} else if(socketMessage.message == 'confirm_deleteComment') {

			}
		}

		else if(arg == 'joinGroup') {
			setActive({
				type: null,
				state: false
			})

			let data = {
				groupID: socketMessage.groupID,
				userID: userID
			}

			let request = await accessAPI.manageGroup('addUser', data).then((data)=> {
				if(data.message == 'noAccess') {
					setSocketMessage({
						type: 'error',
						message: `This ${data.type} is private`,
						groupID: data.id
					})
					setActive({
						state: true,
						type: 1
					})
				} else if(data.confirm == true) {
					setSocketMessage({
						type: 'confirmation',
						message: 'group',
						groupName: data.name
					})
					setActive({
						state: true,
						type: 1
					})
				}
			})
		}
	}

	/**
	 * Primary useEffect
	 * Upon change of 'socketMessage'
	 * execute a makeNotif function with socketMessage
	 * 
	 * 12. 31. 2023
	 * could probably use switch n case here...
	 */
	useEffect(()=> {

		if(socketMessage.action == 'deletePost') {
			setAccessID({
				remove: socketMessage.postID
			})
			setSocketMessage({
				type: 'confirmation',
				message: 'confirm_deletePost'
			})
			setActive({
				state: true,
				type: 22
			});
		}
		/* 
			M A N A G E  M A C R O S  F U N C T I O N S
		*/
		else if(socketMessage.action == 'newTag') {
			action_NewTag(socketMessage);
		}
		else if(socketMessage.action == 'addTag') {
			action_addTag(socketMessage);
		}
		else if(socketMessage.action == 'deleteTag') {
			action_deleteTag(socketMessage)
		}
		
		else if(socketMessage.action == 'newCollection') {
			action_newCollection(socketMessage);
		}
		else if(socketMessage.action == 'renameCollection') {
			action_renameCollection(socketMessage);
		}
		else if(socketMessage.action == 'privatizeCollection') {
			action_privatizeCollection(socketMessage);
		}
		else if(socketMessage.action == 'deleteCollection') {
			console.log('recieved');
			action_deleteCollection(socketMessage);
		}


		/*
			I N T E R A C T I O N S 
		*/
		else if(socketMessage.type == 'request' && socketMessage.message == 'accept') {
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

			if(socketMessage.message == 'initial' || socketMessage.message == 'response') {
				makeNotif_sendCommentNotif(socketMessage);
			} else {
				return
			}
		}
		else if(socketMessage.type == 'tagging') {
			if(socketMessage.message == 'sent') {
				makeNotif_taggedPost(socketMessage);
			}
		}


		else if(socketMessage.confirm === 'postRemoval') {
			setSocketMessage({
				type: 'confirmation',
				message: 'removal'
			})
			setActive({
				state: true,
				type: 1
			})
		}
		else if (socketMessage.confirm === 'postUpload') {
			setSocketMessage({
				type: 'confirmation',
				message: 'post'
			})
			setActive({
				state: true,
				type: 1
			});
		}
		else if(socketMessage.type == 'markRead') {
			makeNotif_markNotifRead(socketMessage);
		}
		else if(socketMessage.type == 'error') {
			setActive({
				state: true,
				type: 1
			});
		}
	}, [socketMessage]);

	
	const popUpNotif = React.useRef();

	/**
	 * Returns specific popUp notification type based on
	 * message recieved from webSocket
	 * 
	 * level indicates significance of alert:
	 *    blue --- post / comment / updateSetting / cancel 
	 * 	  green --- acceptRequest / acceptInvite / tagging 
	 * 	  orange --- ignore / flag / confirmRemoval 
	 *    magenta --- error
	 * 	
	 */
	let [level, setLevel] = React.useState('')

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
				{(message.type == 'comment' && message.message == 'response-recieved') &&
					<p>{socketMessage.senderUsername} responded to your comment on "{socketMessage.postTitle}"</p>
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
				{(message.type == 'confirmation' && message.message == 'confirm_deletePost') &&
					<p>You are about to delete this post</p>
				}
				{(message.type == 'confirmation' && message.message == 'deletedPost') &&
					<p>Post deleted!</p>
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
				{(message.type == 'confirmation' && message.message == 'tagAdd') &&
					<p>You've added <span>"{message.groupName}"</span> to your tags</p>
				}
				{(message.type == 'confirmation' && message.message == 'newCollection') &&
					<p>New collection <span>"{message.groupName}"</span> created </p>
				}
				{(message.type == 'confirmation' && message.message == 'renamedCollection') &&
					<p>Collection has been renamed</p>
				}
				{(message.type == 'confirmation' && message.message == 'deletedCollection') &&
					<p>You've deleted your collection "{message.groupName}"</p>
				}
				{(message.type == 'confirmation' && message.message == 'privatizedCollection') &&
					<p>Collection is now {message.isPrivate}</p>
				}
				{(message.type == 'confirmation' && message.message == 'tagDelete') &&
					<p>You've removed {message.groupName} from your tags</p>
				}
				{message.type == 'error' &&
					<p>{message.message}</p>
				}
				{(message.type == 'response' && message.message == 'alreadyExists') &&
					<p>This {message.groupType} already exists. Would you like to join?</p>
				}
						
				{/*<p>This is some demo text</p>*/}

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
						<li><button className="buttonDefault" onClick={()=> {
																setActive({type: null, state: false});
																if(accessID.notifID) {
																	interact('markRead');	
																}
															}}>Close</button></li>
						<li><button className="buttonDefault" onClick={()=> {
																setActive({type: null, state: false});
																if(accessID.postURL) {
																	interact('viewPost');	
																	console.log(accessID.postID)
																}
																else if(message.message == 'alreadyExists') {
																	interact('joinGroup');
																}
															}}>Interact</button></li> 
						{/*has button who's function changes based on 
							message.buttonText to contain varying wording
						*/}
					</ul>
				}
				{isActive.type == 22 &&
					<ul id="options">
						<li><button className="buttonDefault" onClick={()=> {
																setActive({type: null, state: false});
															}}>Cancel</button></li>
						<li><button className="buttonDefault" onClick={()=> {
																setActive({type: null, state: false});
																if(accessID.remove) {
																	interact('remove');	
																}
															}}>Delete</button></li> 
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
	// console.log(accessID)
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

/**
 * For error alerts:
 * setSocketMessage({
 	type: 'error',
 	message: 'exactly what needs to be communicated to user'
 * })
 */


