/**
 * 09. 13. 2023
 * Houses all functions for making calls to backend API
 * 
 */


export default function APIaccess () {

	const apiAddr = "http://172.19.185.143:3333";
	const userKey = sessionStorage.getItem('userKey');

	return {

		async signUpUser(signupCredentials) {
			/**
			 * Form Requirements:
			 * - firstName:
			 * - lastName:
			 * - emailAddr:
			 * - userName:
			 * - password:
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
			let userID = userInfo._id

			return { userID, userToken };
			// return true;
		},	

		/**
		 * userKey required for all operations conducted
		 * while logged in
		 * 
		 * 09. 16. 2023 
		 * Have userID passed as a prop as well.
		 * would be available, saved into storage after login
		 */

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

		async getBlogPost(postID) {

			let post = await fetch(`${apiAddr}/posts/?id=${postID}`, {
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

		async updateBlogPost() {

			/**
			 * 09. 15. 2023
			 * Need to redesign algo for editting posts between Front and Back End
			 * Function will be removed for now, until later update
			 */
		},

		async deleteBlogPost(postID) {

			const response = await fetch(`${apiAddr}/posts/deletePost?id=${postID}`, {
				method: "DELETE",
				headers: {
					// 'Content-Type': 'application/json',
					// 'Accept': 'application/json',
					'auth-token': userKey
				}
			}).then(data => data)

			return response;
			/* simply confirms whether post is deleted or not */
		},

		async getInteractions(userID, currentNum) {

			const notifs = await fetch(`${apiAddr}/users/notif/getAll?userID=${userID}?currentNum=${currentNum}`, {
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
		},

		async newInteraction(body) {

			/**
			 * Notif object requirements:
			 * type:
			 * isRead: boolean,
			 * sender: userID,
			 * recipients: array || userID
			 * url:
			 * message: *request, *accepted, *ignored
			 */

			const request = await fetch(`${apiAddr}/users/notif`, {
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

			return request.message;
		},

		async getConnections(userID) {
			
			let request = await fetch(`${apiAddr}/users/${userID}/?query=all`, {
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

		async removeConnection(userID, removalID) {

			let request = await fetch(`${apiAddr}/users/${userID}/?query=remove?removalID=${removalID}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
	        		'Content-length': 0,
	        		'Accept': 'application/json',
	        		'Host': apiAddr,
	        		'auth-token': userKey,
				}
			}).then(data => data.json());

			return request.message;
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
		}
	}
}