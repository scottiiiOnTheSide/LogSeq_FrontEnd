//07. 07. 2022
/*
	Multi part component responsible for retrieving, organizing and displaying
	events and entries. 

	loadLog function will get user's posts within the current month, and save them
	all into an array of blog objects.

	Each log state: DayLog, WeekList and MonthChart will draw from said array for population

	Future Consideration: So that seperate pages for each post can have access to this data,
	may need to move loadLog to App.css and use context further down the road
*/

import React, { useState, useEffect } from 'react';
import Calendar from '../../components/calendar';
import './blogLog.css';


async function loadLog (user,year) {
	let blogs = [];
	let month = new Date().getMonth();

	return fetch(`http://192.168.1.5:3333/posts/log?month=${month}&year=${year}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Content-length': 0,
			'Accept': 'application/json',
			'Host': 'http://192.168.1.5:3333',
			'auth-token': user
		}
	}).then(data => {
		// return data.json();
		blogs = data.json();
		return blogs;
	}).catch(err => console.log(err));
	/*
		call this func within useEffect within main component, 
		assign it to state? variable containing all posts
	*/
}

function DayLog({log}) {

	console.log(log);

	return (
		<div id='daylog'>
			<h1>{log[0].title}</h1>
		</div>
	)
}

function WeekList() {
}

function MonthChart() {
}

export default function BlogLog({calendar, loggedIn, Daylog, WeekList, MonthChart}) {

	//automatically runs whenever BlogLog mounts, only if log is empty
	let [log, setLog] = useState([]);

	useEffect( ()=> {
		const load_and_set = async () => {
			let year = calendar['currentYear'],
				user = loggedIn;
			let blog = await loadLog(user, year);
			setLog(blog);
		}
		load_and_set();
	}, [])

	//quick control to make sure only Daylog loads
	const active = true;
	return (
		
		<div id='blogLog'> {/*//Wrapper element for other components*/}

			{active &&
				<DayLog log={log}/>
			}
			{!active &&
				<WeekList />
			}
			{!active &&
				<MonthChart />
			}	
			
		</div>
	)
}