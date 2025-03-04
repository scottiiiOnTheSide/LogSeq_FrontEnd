/* * * V I T A L S * * */
import React, { useState, useReducer, useEffect } from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import {useNavigate} from 'react-router-dom';
import APIaccess from '../../apiaccess';
import './notifs.css';

const accessAPI = APIaccess();

export default function Instants({
	sendMessage, 
	socketMessage, 
	setSocketMessage, 
	setActive, 
	isActive, 
	accessID, 
	setAccessID, 
	getUnreadCount,
	current,
	setCurrent
}) {

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

			if(data.confirmation == false) {
				setSocketMessage({
					type: 'simpleNotif',
					message: `You have already sent @${notif.recipientUsername} this kind of request`
				})
			}
			else if(data.message == 'connectionRequestSent') {

				setSocketMessage({
					type: 'request',
					message: 'connectionRequestSent',
					username: notif.recipientUsername
				})
				setActive({
					state: true,
					type: 1
				})

				notif.message = 'connectionRequestRecieved';
				notif.originalID = data.originalID; //for reciever to mark read within popUp

				sendMessage(JSON.stringify(notif));
			}
			else if(data.message == 'connectionAcceptedSent') { //confirm: true, message: request
				console.log(data);
				setSocketMessage({
					type: 'request',
					message: data.message,
					person: notif.recipientUsername
				})
				setActive({
					state: true,
					type: 1
				})
				notif.message = 'connectionAcceptedRecieved'
				notif.originalID = data._id;

				sendMessage(JSON.stringify(notif));
			}
			else if(data.message == 'subscribed') {
				console.log(data);
				setSocketMessage({
					type: 'confirmation',
					message: data.message,
					recipientUsername: data.recipientUsername
				})
				setActive({
					state: true,
					type: 1
				})
				notif.originalID = data._id;
				
				sendMessage(JSON.stringify(notif));
			}
			else if(data.message == 'subscriptionRequestSent') {

				console.log(data);
				console.log(notif);
				setSocketMessage({
					type: 'request',
					message: 'subscriptionRequestSent',
					username: notif.recipientUsername
				})
				setActive({
					state: true,
					type: 1
				})
				notif.originalID = data._id; //for the reciever to mark their notif read
				notif.message = 'subscriptionRequestRecieved';

				sendMessage(JSON.stringify(notif));
			}
			else if(data.message == 'subscriptionAccepted') {

				console.log(socketMessage);
				console.log(notif)

				setSocketMessage({
					type: 'confirmation',
					message: 'subscriptionAccepted',
					person: notif.recipientUsername
				})
				setActive({
					state: true,
					type: 1
				})

				notif.originalID = data._id;
				notif.senderUsername = username;
				sendMessage(JSON.stringify(notif));
				// body = {
					// 	type: 'request',
					// 	senderID: userID,
					// 	senderUsername: username,
					// 	recipients: [notif.sender],
					// 	recipientUsername: notif.senderUsername,
					// 	message: 'subscriptionAccepted'
					// }
			}
			// else if(data.message == 'requestRecieved') {
				// 	console.log(data);
				// 	setSocketMessage({
				// 		type: 'confirmation',
				// 		message: data.message
				// 	})
				// 	setActive({
				// 		state: true,
				// 		type: 1
				// 	})
				// 	notif.originalID = data._id;
				// }
		})
	}

	//for connection and subscription requests
	// let makeNotif_sendAcceptRequest = async (notif) => {

	// 	await accessAPI.newInteraction(notif).then((data) => {
	// 		if(data.confirmation == false) {
	// 			setSocketMessage({
	// 				type: 'simpleNotif',
	// 				message: `You and ${notif.senderUsername} are already connected`
	// 			})
	// 		}

	// 		if(data.message == 'subscriptionAccepted') {

	// 			setSocketMessage({
	// 				type: 'confirmation',
	// 				message: 'subscriptionAccepted',
	// 				person: data.recipientUsername
	// 			})
	// 			setActive({
	// 				state: true,
	// 				type: 1
	// 			})

	// 			notif.originalID = data._id;
	// 			sendMessage(JSON.stringify(notif));
	// 			// body = {
	// 			// 	type: 'request',
	// 			// 	senderID: userID,
	// 			// 	senderUsername: username,
	// 			// 	recipients: [notif.sender],
	// 			// 	recipientUsername: notif.senderUsername,
	// 			// 	message: 'subscriptionAccepted'
	// 			// }
	// 		}

	// 		// else if (data.message == 'accepted') {

	// 		// 	sendMessage(JSON.stringify(notif));

	// 		// 	setSocketMessage({
	// 		// 		type: 'confirmation',
	// 		// 		message: 'subscribed',
	// 		// 		person: notif.senderUsername
	// 		// 	})
	// 		// 	setActive({
	// 		// 		state: true,
	// 		// 		type: 1
	// 		// 	})
	// 		// }
	// 	})
	// }

	//for automatic subscription
	// let makeNotif_subscribed = async (notif) => {

	// 	await accessAPI.newInteraction(notif).then((data) => {
	// 		if(data.confirmation == false) {
	// 			setSocketMessage({
	// 				type: 'simpleNotif',
	// 				message: `You are already subscribed to ${notif.senderUsername}`
	// 			})
	// 		}

	// 		if(data.confirm == true) {

	// 			sendMessage(JSON.stringify(notif));

	// 			setSocketMessage({
	// 				type: 'confirmation',
	// 				message: 'subscribed'
	// 			})
	// 			setActive({
	// 				state: true,
	// 				type: 1
	// 			})
	// 		}
	// 	})
	// }

	let makeNotif_sendCommentNotif = async (notif) => {

		if(socketMessage.message == 'response' && userID == socketMessage.respondeeId) {

			console.log('true');
			setSocketMessage({
				type: 'confirmation',
				message: 'comment'
			})
			setActive({
				state: true,
				type: 1
			})

			return;
		}

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
			console.log('something')
			getUnreadCount();

			setActive({
				type: null, 
				state: false
			})
		}
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

		if(request.groupName === 'BOOKMARKS') {
			setSocketMessage({
				type: 'confirmation',
				message: 'emptyBookmarks',
				groupName: request.groupName
			})
			setActive({
				state: true,
				type: 1
			})
		}
		else if(request.confirmation == true) {
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

	let action_addToCollection = async(data) => {
		let request = await accessAPI.groupPosts({
			action: 'addPost', 
			groupID: data.groupID, 
			postID: data.postID,
			postOwner: data.postOwner
		});

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				message: 'addToCollection',
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

	let action_removeFromCollection = async(data) => {
		console.log(data)
		let request = await accessAPI.groupPosts({
			action: 'removePost', 
			groupID: data.groupID, 
			postID: data.postID
		});

		

		if(request.confirmation == true && data.action == 'removeAllFromCollection') {
			setSocketMessage({
				type: 'confirmation',
				message: 'removedAllFromCollection',
				groupName: request.groupName
			})
			setActive({
				state: true,
				type: 1
			})
		}
		else if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				message: 'removedFromCollection',
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

	let action_profilePhoto = async(data) => {

		let body = new FormData();
			body.append('option', 'profilePhoto');
			body.append('photo', data.content)
		// console.log(data.content)
		console.log(body)

		let request = await accessAPI.userSettings_profilePhoto(body);

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				label: 'profilePhoto',
				message: request.message,
				updatedPhoto: request.updatedPhoto	
			})
			setActive({
				state: true,
				type: 1
			})

			sessionStorage.setItem('profilePhoto', )
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

	let action_usernameUpdate = async(data) => {

		let body = {
			newUsername: data.newUsername,
			option: 'username'
		};

		let request = await accessAPI.userSettings(body);

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				label: 'usernameUpdated',
				message: request.message	
			})
			setActive({
				state: true,
				type: 1
			})

			sessionStorage.setItem('userName', data.newUsername);
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

	let action_changePassword = async(data) => {
		let body = {
			option: 'changePassword',
			currentPassword: data.currentPassword,
			newPassword: data.newPassword
		};

		let request = await accessAPI.userSettings(body);

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				label: 'passwordUpdated',
				message: "Password successfully updated"	
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

	let action_updateBio = async(data) => {

		let request = await accessAPI.userSettings(data);

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				label: 'bioUpdated',
				message: "Biography updated!"	
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

	let action_privacySetting = async(data) => {

		let request = await accessAPI.userSettings(data);

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				label: 'privacyUpdated',
				message: `Privacy setting is now ${data.state}` 	
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

	let action_addToPinnedMedia = async(data) => {
		let request = await accessAPI.userSettings({
			option: 'pinnedMedia',
			type: 'add',
			content: data.content
		});

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				label: 'usersPinned',
				message: `Content added to Pinned Media`
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

	let action_removeFromPinnedPosts = async(data) => {
		
		let request = await accessAPI.userSettings({
			option: 'pinnedPosts',
			type: 'remove',
			content: data.content
		});

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				label: 'usersPinned',
				message: `Content removed from Pinned Media`
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

	let action_removeFromPinnedMedia = async(data) => {

		let request = await accessAPI.userSettings({
			option: 'pinnedMedia',
			type: 'remove',
			content: data.content
		});

		if(request.confirmation == true) {
			setSocketMessage({
				type: 'confirmation',
				label: 'usersPinned',
				message: `Content removed from Pinned Media`
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

	let action_updateNotifs = async(data) => {
		sendMessage(JSON.stringify(data));
	}


	/*** 
		Response functions to alerts recieved by user
	***/
	let interact = async(arg, notif) => {

		/* Sets socketMessage to accept connection request */
		if(arg == 'accept') {

			let notifi = {
				type: 'request',
				recipients: [accessID.accept],
				recipientUsername: notif.senderUsername,
				senderID: userID,
				senderUsername: username,
				message: 'connectionAcceptedSent'
			};

			setSocketMessage(notifi);
			setActive({
				type: null,
				state: false
			})
			console.log(accessID);
			console.log(notifi);

			// if(notif.message == 'subscriptionRequested') {

			// 	//should be the same as a regular automatic subscription
			// 	let body = {
			// 		type: 'request',
			// 		senderID: userID,
			// 		senderUsername: username,
			// 		recipients: [notif.sender],
			// 		recipientUsername: notif.senderUsername,
			// 		message: 'subscriptionAccepted'
			// 	}
			// 	setSocketMessage(body);
			// }

			// if(notif.message == 'initial') {//simply notifies requester of connection acceptance	
				
			// }
		}

		else if(arg == 'subscriptionAccepted') {
			let body = {
				type: 'request',
				senderID: userID,
				senderUsername: username,
				recipients: [notif.senderID],
				recipientUsername: notif.senderUsername,
				// message: 'subscriptionAccepted'
				message: 'subscriptionAccepted'
			}

			let sm = {
					type: 'markRead',
					notifID: notif._id,
					userID: userID,
					senderUsername: username
				};
			let request = await accessAPI.newInteraction(sm)

			setActive({type: null, state: false})

			let delay = setTimeout(()=> {
				setSocketMessage(body);	
			}, 400)
			
			console.log(body);
		}

		else if(arg == 'ignore') {
			let notif = {
				type: 'markRead',
				notifID: accessID.notifID,
				userID: userID,
			};
			makeNotif_markNotifRead(notif);

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

				setCurrent({
					...current,
					scrollTo: null
				})

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

			} //remove post
		}

		else if (arg == 'deleteComment') {

			let request = await accessAPI.deleteComment(accessID.remove).then((data)=> {
					if(data.confirm) {
						setSocketMessage({
							type: 'confirmation',
							message: 'deletedComment'
						})
						setActive({
							state: true,
							type: 1
						})
					}
				})
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
	 * execute a make or action function with socketMessage
	 * 
	 * 12. 31. 2023
	 * could probably use switch n case here...
	 */
	useEffect(()=> {

		/* U S E R   S E T T I N G S */
		if(socketMessage.action == 'updateNotifs') {
			action_updateNotifs(socketMessage);
			if(socketMessage.message) {
				setActive({
					state: true,
					type: 1
				});
			}
		}
		else if(socketMessage.action == 'profilePhoto') {
			action_profilePhoto(socketMessage);
		}

		else if(socketMessage.action == 'usernameUpdate') {
			action_usernameUpdate(socketMessage);
		}

		else if(socketMessage.action == 'changePassword') {
			action_changePassword(socketMessage)
		}

		else if(socketMessage.action == 'bioUpdate') {
			action_updateBio(socketMessage)
		}

		else if(socketMessage.action == 'privacy') {
			action_privacySetting(socketMessage)
		}
		else if(socketMessage.action == 'addToPinnedMedia') {
			action_addToPinnedMedia(socketMessage)
		}
		else if(socketMessage.action == 'removeFromPinnedMedia' || socketMessage.action == 'removeAllFromPinnedMedia') {
			action_removeFromPinnedMedia(socketMessage)
		}
		else if(socketMessage.action == 'removeFromPinnedPosts' || socketMessage.action == 'removeAllFromPinnedPosts') {
			action_removeFromPinnedPosts(socketMessage)
		}


		/* P O S T  O P T I O N S */
		else if(socketMessage.action == 'deletePost') {
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

		else if(socketMessage.action == 'deleteComment') {
			setAccessID({
				remove: socketMessage.commentID
			})
			setSocketMessage({
				type: 'confirmation',
				message: 'confirm_deleteComment'
			})
			setActive({
				state: true,
				type: 22
			})
		}


		/* M A N A G E  M A C R O S  F U N C T I O N S */
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
		else if(socketMessage.action == 'addToCollection') {
			action_addToCollection(socketMessage);
		}
		else if(socketMessage.action == 'removeFromCollection') {
			action_removeFromCollection(socketMessage);
		}
		else if(socketMessage.action == 'removeAllFromCollection') {
			action_removeFromCollection(socketMessage);
		}


		/*
			I N T E R A C T I O N S 
		*/
		else if (socketMessage.type == 'request' && socketMessage.message == 'connectionRequestSent') {
			if(!socketMessage.recipients) {
				return
			} else {
				console.log(socketMessage);
				makeNotif_sendInitialRequest(socketMessage);
			}
		}
		else if(socketMessage.type == 'request' && socketMessage.message == 'connectionAcceptedSent') {
			// makeNotif_sendAcceptRequest(socketMessage);
			makeNotif_sendInitialRequest(socketMessage);
		}
		else if(socketMessage.type == 'request' && socketMessage.message == 'subscribed') {
			// makeNotif_subscribed(socketMessage);
			makeNotif_sendInitialRequest(socketMessage);
		}
		else if (socketMessage.type == 'request' && socketMessage.message.includes('sub')) {
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
		else if (socketMessage.confirm === 'postDrafted') {
			setSocketMessage({
				type: 'draft',
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
		else if(socketMessage.type == 'error') { //set socketMessage.message wherever useing this call
			setActive({
				state: true,
				type: 1
			});
		}
		else if(socketMessage.type == 'simpleNotif') { //set socketMessage.message wherever useing this call
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

	/*
		05. 24. 2024
		Update this all so that 'confirmation' messages simply display message
		set within action function. Remove need for 'message.message' 
	*/

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
				{(message.type == 'request' && message.message == 'connectionRequestSent') &&
					<p>You sent @{message.username} a connection request!</p>
				}
				{(message.type == 'request' && message.message == 'connectionRequestRecieved') &&
					<p>{message.senderUsername} sent a connection request</p>
				}
				{(message.type == 'request' && message.message == 'initial') &&
					<p>{message.senderUsername} has sent a connection request!</p>
				}
				{(message.type == 'request' && message.message == 'connectionAcceptedRecieved') &&
					<p>You are connected with {message.senderUsername} !</p>
				}
				{(message.type == 'request' && message.message == 'connectionAcceptedSent') &&
					<p>You are connected with {message.person} !</p>
				}
				{(message.type == 'confirmation' && message.message == 'accepted') &&
					<p>You are now connected !</p>
				}
				{(message.type == 'request' && message.message == 'subscriptionRequestRecieved') &&
					<p>@{message.senderUsername} requests subscription to you</p>
				}
				{(message.type == 'request' && message.message == 'subscriptionRequestSent') &&
					<p>You sent @{message.username} a subscription request</p>
				}
				{(message.type == 'request' && message.message == 'subscriptionAccepted') &&
					<p>You are now subscribed to @{message.senderUsername}</p>
				}
				{/*{(message.type == 'request' && message.message == 'subscriptionAccept') &&
					<p>You are now subscribed to @{message.senderUsername}</p>
				}*/}
				{(message.type == 'request' && message.message == 'subscribed') &&
					<p>@{message.senderUsername} is now subscribed to you!</p>
				}
				{(message.type == 'confirmation' && message.message == 'subscriptionAccepted') &&
					<p>@{message.person} is now a subscriber!</p>
				}
				{(message.type == 'confirmation' && message.message == 'subscribed') &&
					<p>You've subscribed to {message.recipientUsername}</p>
				}
				{(message.type == 'confirmation' && message.message == 'unsubscribed') &&
					<p>You've unsubscribed from {message.username}</p>
				}
				{(message.type == 'confirmation' && message.message == 'request') &&
					<p>Connection Request Sent !</p>
				}
				{(message.type == 'confirmation' && message.message == 'requestRecieved') &&
					<p>Subscription Request Sent !</p>
				}
				{(message.type == 'confirmation' && message.message == 'removal') &&
					<p>Disconnected from {message.username}</p>
				}
				{(message.type == 'confirmation' && message.message == 'confirm_deletePost') &&
					<p>You are about to delete this post</p>
				}
				{(message.type == 'confirmation' && message.message == 'confirm_deleteComment') &&
					<p>Are you sure you wish to delete this comment?</p>
				}
				{(message.type == 'confirmation' && message.message == 'deletedPost') &&
					<p>Post deleted!</p>
				}
				{(message.type == 'confirmation' && message.message == 'deletedComment') &&
					<p>Comment deleted!</p>
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
				{(message.type == 'draft' && message.message == 'post') &&
					<p>Post Drafted!</p>
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
				{(message.type == 'confirmation' && message.message == 'emptyBookmarks') &&
					<p>{message.groupName} have been emptied</p>
				}
				{(message.type == 'confirmation' && message.message == 'deletedCollection') &&
					<p>You've deleted your collection "{message.groupName}"</p>
				}
				{(message.type == 'confirmation' && message.message == 'privatizedCollection') &&
					<p>Collection is now {message.isPrivate}</p>
				}
				{(message.type == 'confirmation' && message.message == 'addToCollection') &&
					<p>Post added to {message.groupName}</p>
				}
				{(message.type == 'confirmation' && message.message == 'removedFromCollection') &&
					<p>Post removed from {message.groupName}</p>
				}
				{(message.type == 'confirmation' && message.message == 'removedAllFromCollection') &&
					<p>All posts removed {message.groupName}</p>
				}
				{(message.type == 'confirmation' && message.message == 'tagDelete') &&
					<p>You've removed {message.groupName} from your tags</p>
				}

				{(message.type == 'confirmation' && message.label == 'profilePhoto') &&
					<p>{message.message}</p>
				}

				{(message.type == 'confirmation' && message.label == 'usernameUpdated') &&
					<p>{message.message}</p>
				}

				{(message.type == 'confirmation' && message.label == 'passwordUpdated') &&
					<p>{message.message}</p>
				}

				{(message.type == 'confirmation' && message.label == 'bioUpdated') &&
					<p>{message.message}</p>
				}

				{(message.type == 'confirmation' && message.label == 'privacyUpdated') &&
					<p>{message.message}</p>
				}

				{(message.type == 'confirmation' && message.label == 'usersPinned') &&
					<p>{message.message}</p>
				}

				{message.type == 'error' &&
					<p>{message.message}</p>
				}
				{message.type == 'simpleNotif' &&
					<p>{message.message}</p>
				}
				{(message.type == 'response' && message.message == 'alreadyExists') &&
					<p>This {message.groupType} already exists. Would you like to join?</p>
				}
				{(message.action == 'updateNotifs' && message.message) &&
					<p>{message.message}</p>
				}
						
				{/*<p>This is some demo text</p>*/}

				{isActive.type == 3 &&
					<ul id="options">
						<li><button className="buttonDefault" onClick={()=> {setActive({type: null, state: false})}}>Close</button></li>
						<li><button className="buttonDefault" onClick={()=> {

							if(message.message == 'connectionRequestRecieved') {
								interact('accept', message)	
							}
							else if (message.message == 'subscriptionRequestRecieved') {
								interact('subscriptionAccepted', message.data)

								// type: 'request',
								// senderID: userID,
								// senderUsername: username,
								// recipients: [notif.sender],
								// recipientUsername: notif.senderUsername,
								// message: 'subscriptionAccepted'
							}

						}}>Accept</button></li> 
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
				{isActive.type == 22 && //for removing posts(?)
					<ul id="options">
						<li><button className="buttonDefault" onClick={()=> {
																setActive({type: null, state: false});
															}}>Cancel</button></li>
						<li><button className="buttonDefault" onClick={()=> {
																setActive({type: null, state: false});
																if(accessID.remove && socketMessage.message == 'confirm_deletePost') {
																	interact('remove');	
																}
																else if(accessID.remove && socketMessage.message == 'confirm_deleteComment') {
																	interact('deleteComment');	
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


