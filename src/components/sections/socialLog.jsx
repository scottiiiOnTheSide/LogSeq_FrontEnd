/* * * V i t a l s * * */
import * as React from 'react';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';

let accessAPI = APIaccess();



function ManageConnections() {

	/* element dimensions to be 100% viewport */
	return (
		<div id="manageConnections"></div>
	)
}

export default function SocialLog({active}) {

	let [log, setLog] = React.useState([]);
	let userID = sessionStorage.getItem('userID');
	let [modal, setModal] = React.useReducer(state => !state, false);
	let isActive = active;

	let updateLog = async() => {
		let data = await accessAPI.pullSocialLog();
		setLog(data);
		console.log(log);
	} 

	React.useEffect(()=> {
		updateLog();
	}, [])

	return (
		<div id="socialLog" className={isActive == 1 ? 'active' : 'not'}>

			<Log data={log} userID={userID} />
			
			{modal &&
				<ManageConnections />
			}
		</div>
	)
}