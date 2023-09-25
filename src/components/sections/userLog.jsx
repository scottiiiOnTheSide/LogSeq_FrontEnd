/* * * V i t a l s * * */
import * as React from 'react';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';

let accessAPI = APIaccess();


function CreatePost() {

	/* element dimensions to be 100% viewport */
	return (
		<div id="createPost"></div>
	)
}

export default function UserLog({active}) {

	let [log, setLog] = React.useState([]);
	let userID = sessionStorage.getItem('userID');
	let [modal, setModal] = React.useReducer(state => !state, false);
	let isActive = active;

	/**
	 * For now, get userLog on mount
	 * log.jsx exports component and necessary functions
	 * function to open independant post within log.jsx
	 */
	let updateLog = async() => {
		let data = await accessAPI.pullUserLog();
		setLog(data);
		console.log(log);
	} 

	React.useEffect(()=> {
		updateLog();
	}, [])

	return (
		<div id="userLog" className={isActive == 2 ? 'active' : 'not'}>

			<Log data={log} userID={userID} />
			
			{modal &&
				<CreatePost />
			}
		</div>
	)
}