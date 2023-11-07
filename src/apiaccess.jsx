/**
 * 09. 13. 2023
 * Houses all functions for making calls to backend API
 * 
 */


export default function APIaccess () {

	const apiAddr = "http://192.168.1.176:3333";
	const userKey = sessionStorage.getItem('userKey');

	return {

		async signUpUser(signupCredentials) {
			/**
			 * Form Requirements:
			 * - firstName:
			 * - lastName:
			 * - emailAddr:
			 * - userName:
			 * - password:s
			 */

			return await fetch(`${apiAddr}/users/newuser`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(signupCredentials)
			}).then(data => data.json());

			/* 09. 14. 2023
			   Returns a true statement if signup successful
			   Checks by submitted emailAddr whether account was made with on prior
			*/
			return true;
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

			let loggedIn = await fetch(`${apiAddr}/users/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept':'application/json'
				},
				body: JSON.stringify(loginCredentials)
			}).then(data => data.json());

			let userToken = loggedIn;

			let userInfo = parseJwt(loggedIn);
			let userID = userInfo._id;
			let userName = userInfo._username;
			console.log(userInfo);

			return { userID, userName, userToken };
			// return true;
		},	

		async pullUserLog(pull, lastID) {

			/**
			 * The 'pull' argument differentiates the kind of request for posts
			 * made to the API
			 * initial: when user first logs in
			 * update: get the most recent, new posts
			 * append: get more posts from the past, those before the last postID sent
			 */

			//?pull=${pull}?lastID=${lastID} for future update

			let log = await fetch(`${apiAddr}/posts/log?social=false`, {
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

			let log = await fetch(`${apiAddr}/posts/log?social=true`, {
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

		async getBlogPost(postID) {

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

			console.log(content);

			let post = await fetch(`${apiAddr}/posts/createPost`, {
				method: "POST",
				headers: {
					'auth-token': userKey,
					// 'Content-Type': 'multipart/form-data; boundary=----logseqmedia',
					// 'Accept': 'multipart/form-data',
					// 'Content-Length': 0,
					// 'accept': 'application/json',
					// 'Host': apiAddr,
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

			const response = await fetch(`${apiAddr}/posts/deletePost?id=${postID}`, {
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

		async postComment(type, parentID, body) {

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

		async getInteractions(arg) {

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

		async getConnections() {
			
			let request = await fetch(`${apiAddr}/users/user?query=getAllConnects`, {
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

			let request = await fetch(`${apiAddr}/users/user?query=removeConnect&remove=${userID}`, {
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
			let user = await fetch(`${apiAddr}/users/${userID}/?query=singleUser`, {
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
		}
	}
}




