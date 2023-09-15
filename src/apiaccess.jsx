/**
 * 09. 13. 2023
 * Houses all functions for making calls to backend API
 * 
 */

export function APIaccess(apiAddr) {

	async function signupUser(signupCredentials) {
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
	}

	async function loginUser(loginCredentials) {

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

		loggedIn = parseJwt(loggedIn);
		let userID = loggedIn._id
		let userToken = loggedIn;

		return { userID, userToken };

		/**
		 * returns userID and the full JWT token
		 */
	}

	/**
	 * userKey required for all operations conducted
	 * while logged in
	 */

	async function pullUserLog(userKey, pull, lastID) {

		/**
		 * The 'pull' argument differentiates the kind of request for posts
		 * made to the API
		 * initial: when user first logs in
		 * update: get the most recent, new posts
		 * append: get more posts from the past, those before the last postID sent
		 */

		let log = await fetch(`${apiAddr}/posts/log?social=false?pull=${pull}?lastID=${lastID}`, {
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
	}

	async function pullSocialLog(userKey, pull, lastID) {

		let log = await fetch(`${apiAddr}/posts/log?social=true?pull=${pull}?lastID=${lastID}`, {
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
	}

	async function getBlogPost(userKey, postID) {

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
	}

	async function updateBlogPost() {

		/**
		 * 09. 15. 2023
		 * Need to redesign algo for editting posts between Front and Back End
		 * Function will be removed for now, until later update
		 */
	}

	async function deleteBlogPost(userKey, postID) {

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
	}

	async function getInteractions(userKey, lastID) {

	}

	async function getConnections(userKey) {
		
	}
}