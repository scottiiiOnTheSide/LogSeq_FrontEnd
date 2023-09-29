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


	console.log(active);
	let [place, setPlace] = React.useState(active == 2 || active == null ? '' : 'not');
	let [log, setLog] = React.useState([]);
	let userID = sessionStorage.getItem('userID');
	let [modal, setModal] = React.useReducer(state => !state, false);

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
		console.log(place);
	}, [])

	React.useEffect(()=> {

		console.log(active);
		if (active == undefined) {
			console.log(active);
			return;
		}
		if(active !== 2 || active == 'x') {
			setPlace('not');
			console.log(active);
		}
	}, [active])


	return (
		<div id="userLog" className={place}>

			<Log data={log} userID={userID} />
			
			{modal &&
				<CreatePost />
			}
		</div>
	)
}