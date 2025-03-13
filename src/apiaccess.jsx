/**
 * 09. 13. 2023
 * Houses all functions for making calls to backend API
 * 
 */


export default function APIaccess(key) {

	const apiAddr = "http://172.19.185.143:3333";
	let savedKey = sessionStorage.getItem('userKey')
	// const userKey = savedKey ? savedKey : key;

	return {

		async getProjectPublicStats() {
			let request = await fetch(`${apiAddr}/publicStats`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept':'application/json'
				}
			}).then(data => data.json());

			return request
		},

		async signupUser(signupCredentials) {
			/**
			 * Form Requirements:
			 * - firstName:
			 * - lastName:
			 * - emailAddr:
			 * - userName:
			 * - password:
			 */

			let request = await fetch(`${apiAddr}/users/newuser`, {
				method: 'POST',
				headers: {
					// 'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: signupCredentials
			}).then(data => data.json());

			/* 09. 14. 2023
			   Returns a true statement if signup successful
			   Checks by submitted emailAddr whether account was made with on prior
			*/
			return request
		},

		async submitRefCode(refCode) {

			let request = await fetch(`${apiAddr}/users/newuser`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					action: 'getReferrer',
					refCode: refCode
				})
			}).then(data => data.json());

			return request;
		},

		async userExistsCheck(body) {

			let request = await fetch(`${apiAddr}/users/newuser`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(body)
			}).then(data => data.json());

			return request;
		},

		async logInUser(loginCredentials) {

			/**
			 * Form Requirements
			 * - emailAddr
			 * - password
			 */

			let parseJwt = (token) => {
			    let base64Url = token.split('.')[1],
			        base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'),
			        jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
			        	return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			        }).join(''));

			    return JSON.parse(jsonPayload);
			};

			let request = await fetch(`${apiAddr}/users/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept':'application/json'
				},
				body: JSON.stringify(loginCredentials)
			}).then(data => data.json());

			if(request.confirm == true) {

				let userToken = request.JWT;

				let userInfo = parseJwt(request.JWT);

				sessionStorage.setItem('userKey', userToken);
				sessionStorage.setItem('userID', userInfo._id);
				sessionStorage.setItem('userName', userInfo._username);
				sessionStorage.setItem('profilePhoto', request.profilePhoto);
				sessionStorage.setItem('privacySetting', request.privacySetting);


				let topicsAsString = request.settings.topics.join(', ');
				console.log(topicsAsString);
				console.log(request.settings);
				sessionStorage.setItem('topicsAsString', topicsAsString);

				return {
					confirm: true,
					settings: request.settings
				}

			} else if (request.error == true) {
				console.log(request);
				return request.message
			}	
		},	

		async pullUserLog(data) {

			/**
			 * The 'pull' argument differentiates the kind of request for posts
			 * made to the API
			 * initial: when user first logs in
			 * update: get the most recent, new posts
			 * append: get more posts from the past, those before the last postID sent
			 */

			//?pull=${pull}?lastID=${lastID} for future update
			let userKey = sessionStorage.getItem('userKey');
			let log = await fetch(`${apiAddr}/posts/log?type=${data.type}&userID=${data.userID}&logNumber=${data.logNumber}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': 0,
					'Accept': 'application/json',
					'Host': apiAddr,
					'auth-token': userKey
				}
			}).then(data => data.json());

			return log;
		},

		async pullSocialLog(pull, lastID) {

			//?pull=${pull}?lastID=${lastID} for future update

			let userKey = sessionStorage.getItem('userKey');
			let log = await fetch(`${apiAddr}/posts/log?type=social`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': 0,
					'Accept': 'application/json',
					'Host': apiAddr,
					'auth-token': userKey
				}
			}).then(data => data.json());

			return log;
		},

		async pullMonthChart(month, day, year, social) {

			let userKey = sessionStorage.getItem('userKey');

			if(day) { /*** Gets all posts per specific day ***/

				let request = await fetch(`${apiAddr}/posts/monthChart?social=${social}&month=${month}&day=${day}&year=${year}`, {
					method: "GET",
					headers: {
						'Content-Type': 'application/json',
		        		'Content-length': 0,
		        		'Accept': 'application/json',
		        		'Host': apiAddr,
		        		'auth-token': userKey
					}
				}).then(data => data.json());

				let reorder = [];
		        for(let i = request.length; i >= 0; i--) {
		          reorder.push(request[i]);
		        }
		        // reorder.splice(0, 1);

				return reorder;

			} else { /*** Gets amount of posts per day in a month ***/

				let request = await fetch(`${apiAddr}/posts/monthChart?social=${social}&month=${month}&year=${year}`, {
					method: "GET",
					headers: {
						'Content-Type': 'application/json',
		        		'Content-length': 0,
		        		'Accept': 'application/json',
		        		'Host': apiAddr,
		        		'auth-token': userKey
					}
				}).then(data => data.json());

				return request;
			}
		},

		async getDrafts() {
			let userKey = sessionStorage.getItem('userKey');
			let log = await fetch(`${apiAddr}/posts/log?type=drafts`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': 0,
					'Accept': 'application/json',
					'Host': apiAddr,
					'auth-token': userKey
				}
			}).then(data => data.json());

			return log;
		},

		async deleteDraft(draftID) {

			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/posts/log?type=deleteDraft&postID=${draftID}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': 0,
					'Accept': 'application/json',
					'Host': apiAddr,
					'auth-token': userKey
				}
			}).then(data => data.json());

			return request;
		},

		async getBlogPost(postID) {

			let userKey = sessionStorage.getItem('userKey');

			let post = await fetch(`${apiAddr}/posts/${postID}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': 0,
					'Accept': 'application/json',
					'Host': apiAddr,
					'auth-token': userKey
				}
			}).then(data => data.json());

			return post;
		},

		async createPost(content) {

			let userKey = sessionStorage.getItem('userKey');

			let post = await fetch(`${apiAddr}/posts/createPost`, {
				method: "POST",
				headers: {
					'auth-token': userKey,
					'Accept': 'application/json'
				},
				body: content,
			}).then(data => data.json())

			//returns true for successful submit, returns false on error
			return post;
		},

		async updatePost() {

			/**
			 * 09. 15. 2023
			 * Need to redesign algo for editting posts between Front and Back End
			 * Function will be removed for now, until later update
			 */
		},

		async deletePost(postID) {

			let userKey = sessionStorage.getItem('userKey');

			let response = await fetch(`${apiAddr}/posts/deletePost?id=${postID}`, {
				method: "DELETE",
				headers: {
					// 'Content-Type': 'application/json',
					// 'Accept': 'application/json',
					'auth-token': userKey
				}
			}).then(data => data.json())

			return response;
			/* simply confirms whether post is deleted or not */
		},

		async getComments(postID) {

			let userKey = sessionStorage.getItem('userKey');

			let response = await fetch(`${apiAddr}/posts/comment/getComments?postID=${postID}`, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
	        		'Content-length': 0,
	        		'Accept': 'application/json',
	        		'Host': apiAddr,
	        		'auth-token': userKey,
				}
			}).then(data => data.json())

			return response;
		},

		async postComment(type, parentID, body) {

			let userKey = sessionStorage.getItem('userKey');

			/**
			 * type: *initial, *response
			 */

			if(body == null) {
				let request = await fetch(`${apiAddr}/posts/comment/${type}/?postID=${parentID}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
		        		'Content-length': 0,
		        		'Accept': 'application/json',
		        		'Host': apiAddr,
		        		'auth-token': userKey,
					}
				}).then(data => data.json());

				return request;
			} else {
				let request = await fetch(`${apiAddr}/posts/comment/${type}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
		        		'Content-length': 0,
		        		'Accept': 'application/json',
		        		'Host': apiAddr,
		        		'auth-token': userKey,
					},
					body: JSON.stringify(body)
				}).then(data => data.json());

				return request;
			}
		},

		async deleteComment(commentID) {

			let userKey = sessionStorage.getItem('userKey');

			let request = await fetch(`${apiAddr}/posts/comment/delete/?commentID=${commentID}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
		       		'Content-length': 0,
		       		'Accept': 'application/json',
		       		'Host': apiAddr,
		       		'auth-token': userKey,
				}
			}).then(data => data.json());

			return request;
		},

		async updateCommentCount(postID, count) {

			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/posts/comment/updateCount/?postID=${postID}&count=${count}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
		        		'Content-length': 0,
		        		'Accept': 'application/json',
		        		'Host': apiAddr,
		        		'auth-token': userKey,
					}
				}).then(data => data.json());

			return request;
		},

		async getInteractions(arg) {

			let userKey = sessionStorage.getItem('userKey');

			if(arg == 'count') {

				const notifs = await fetch(`${apiAddr}/users/notif/sendUnreadCount`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
		        		'Content-length': 0,
		        		'Accept': 'application/json',
		        		'Host': apiAddr,
		        		'auth-token': userKey,
					}
				}).then(data => data.json());

				return notifs;

			} else {

				const notifs = await fetch(`${apiAddr}/users/notif/sendAll`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
		        		'Content-length': 0,
		        		'Accept': 'application/json',
		        		'Host': apiAddr,
		        		'auth-token': userKey,
					}
				}).then(data => data.json());

				return notifs;
			}
		},

		/**
		 * For connection requests, commenting, tagging, group invites
		 */
		async newInteraction(notif) {

			let userKey = sessionStorage.getItem('userKey');

			/**
			 * Notif object requirements:
			 * type: *request, *commentInitial, *commentResponse, *tagging
			 * isRead: boolean,
			 * sender: userID,
			 * recipients: array || userID
			 * url:
			 * message: *sent, *accept, *ignore
			 */

			const request = await fetch(`${apiAddr}/users/notif/${notif.type}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
	        		'Content-length': 0,
	        		'Accept': 'application/json',
	        		'Host': apiAddr,
	        		'auth-token': userKey,
				},
				body: JSON.stringify(notif)
			}).then(data => data.json());

			return request;
		},

		async getConnections(userID) {
			
			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/users/user/${userID}?query=getAllConnects`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
	        		'Content-length': 0,
	        		'Accept': 'application/json',
	        		'Host': apiAddr,
	        		'auth-token': userKey,
				}
			}).then(data => data.json());

			return request;
		},

		async removeConnection(userID) {

			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/users/user/${userID}/?query=removeConnect&remove=${userID}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
	        		'Content-length': 0,
	        		'Accept': 'application/json',
	        		'Host': apiAddr,
	        		'auth-token': userKey,
				}
			}).then(data => data.json());

			return request;
		},

		async removeSubscription(userID, toOrFrom) {

			//if toOrFrom == 'to', removing sub TO user
			//if 'from', removing sub FROM current user
			let direction = toOrFrom == 'to' ? 'removeSubTo' : 'removeSubFrom';

			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/users/user/${userID}/?query=${direction}&remove=${userID}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
	        		'Content-length': 0,
	        		'Accept': 'application/json',
	        		'Host': apiAddr,
	        		'auth-token': userKey,
				}
			}).then(data => data.json());

			return request;
		},

		async getSingleUser(userID) {

			/* For return user's page*/
			let userKey = sessionStorage.getItem('userKey');
			let user = await fetch(`${apiAddr}/users/user/${userID}/?query=singleUser`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
	        		'Content-length': 0,
	        		'Accept': 'application/json',
	        		'Host': apiAddr,
	        		'auth-token': userKey,
				}
			}).then(data => data.json());

			return user;
		},

		async searchUsers(query) {

			let userKey = sessionStorage.getItem('userKey');
			const search = await fetch(`${apiAddr}/users/search/?userName=${query}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
		        	'Content-length': 0,
		        	'Accept': 'application/json',
		        	'Host': apiAddr,
		        	'auth-token': userKey
				}
			}).then(data => data.json());

			return search;
			//returns search results, most likely some array of objects
		},

		async newGroup(body) {

			/***
			 * Necessary body values:
			 * type: tag, collection, group
			 * name: groupName
			 * owner: userID,
			 * admins: [userID],
			 * hasAccess: [userID]
			 * isPrivate: boolean
			 */
			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/groups/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
		        	'Content-length': 0,
		        	'Accept': 'application/json',
		        	'Host': apiAddr,
		        	'auth-token': userKey
				},
				body: JSON.stringify(body)
			}).then(data => data.json());

			return request;
		},

		async groupPosts(body) {

			/***
			 * Action Types:
			 * getPosts, addPost, removePost
			 * 
			 * Necessary body values:
			 * id: groupID,
			 * name: groupName,
			 * postID: 
			 */
			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/groups/posts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
		        	'Content-length': 0,
		        	'Accept': 'application/json',
		        	'Host': apiAddr,
		        	'auth-token': userKey
				},
				body: JSON.stringify(body),
			}).then(data => data.json());

			return request;
		},

		async manageGroup(action, body) {

			/*** 
			 * Action Types:
			 * request, addUser, removeUser, addAdmin, removeAdmin, 
			 * 	deleteGroup, renameGroup, privatizeGroup
			 * 
			 * Necessary body values:
			 * id: groupID,
			 * name: groupName,
			 * userID: 
			 * details: 
			 * 	 - necessary when giving access to private group.
			 *   - should be owner or admin's userID
			 */
			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/groups/manage/${action}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
		        	'Content-length': 0,
		        	'Accept': 'application/json',
		        	'Host': apiAddr,
		        	'auth-token': userKey
				},
				body: JSON.stringify(body),
			}).then(data => data.json());

			return request;
		},

		async getSuggestions() {

			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/groups/posts`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
			        	'Content-length': 0,
			        	'Accept': 'application/json',
			        	'Host': apiAddr,
			        	'auth-token': userKey
					},
					body: JSON.stringify({action: 'getSuggestions'})
			}).then(data => data.json())

			return request;
		},

		async getUserTags() {

			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/groups/posts`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
			        	'Content-length': 0,
			        	'Accept': 'application/json',
			        	'Host': apiAddr,
			        	'auth-token': userKey
					},
					body: JSON.stringify({action: 'getUserTags'})
			}).then(data => data.json())

			return request;
		},

		async getMacros(type) {

			let userKey = sessionStorage.getItem('userKey');

			if(type == 'tags') {

				let request = await fetch(`${apiAddr}/groups/posts`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
			        	'Content-length': 0,
			        	'Accept': 'application/json',
			        	'Host': apiAddr,
			        	'auth-token': userKey
					},
					body: JSON.stringify({action: 'allTagsUsed'})
				}).then(data => data.json());

				return request;
			}
			else if(type == 'private') {

				let request = await fetch(`${apiAddr}/groups/posts`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
			        	'Content-length': 0,
			        	'Accept': 'application/json',
			        	'Host': apiAddr,
			        	'auth-token': userKey
					},
					body: JSON.stringify({action: 'getPrivatePosts'})
				}).then(data => data.json());

				return request;
			}
			else if(type == 'collections') {

				let request = await fetch(`${apiAddr}/groups/posts`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
			        	'Content-length': 0,
			        	'Accept': 'application/json',
			        	'Host': apiAddr,
			        	'auth-token': userKey
					},
					body: JSON.stringify({action: 'getCollections'})
				}).then(data => data.json());

				return request;
			}
		},

		async getTagData(groupID, groupName) {

			let userKey = sessionStorage.getItem('userKey');
			let request = await fetch(`${apiAddr}/groups/posts`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
			        	'Content-length': 0,
			        	'Accept': 'application/json',
			        	'Host': apiAddr,
			        	'auth-token': userKey
					},
					body: JSON.stringify({action: 'getTagInfo', groupID: groupID, groupName: groupName })
				}).then(data => data.json());

				return request;
		},

		async userSettings(body) {

			/**
			 * Necessary Body Values
			 * option: Profile, Privacy, InvitationCount,
			 * username, profilePhoto, bio, changePassword,
			 * updateLocation
			 * 
			 * action: addTopics, removeTopics
			 *
			 **/
				let userKey = sessionStorage.getItem('userKey');

				let request = await fetch(`${apiAddr}/users/settings`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
			        	'Content-length': 0,
			        	'Accept': 'application/json',
			        	'Host': apiAddr,
			        	'auth-token': userKey
					},
					body: JSON.stringify(body),
				}).then(data => data.json());

				return request;
		},

		async userSettings_profilePhoto(body) {

			let userKey = sessionStorage.getItem('userKey');

			let request = await fetch(`${apiAddr}/users/settings`, {
				method: "POST",
				headers: {
					'auth-token': userKey,
				},
				body: body,
			}).then(data => data.json())

			return request;
		}
	}
}




