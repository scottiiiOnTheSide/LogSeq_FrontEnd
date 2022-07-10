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


async function loadLog (user,year,state) {
	let blogs = [];
	let month = new Date().getMonth();

	await fetch(`http://192.168.1.13:3333/posts/log?month=${month}&year=${year}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Content-length': 0,
			'Accept': 'application/json',
			'Host': 'http://192.168.1.5:3333',
			'auth-token': user
		}
	}).then((data) => {
		data.json()
	})
	.then((result) => {
		state(result);
		console.log(result);
	}).catch(err => console.log(err));
	// return data.json();
		// blogs = data.json();
		// return blogs;
	/*
		call this func within useEffect within main component, 
		assign it to state? variable containing all posts
	*/
}

function DayLog({log}) {

	/* The logic: 
		If there are no posts from today, display h1 No posts today
		For each subsequent post with a different day, display h1 date
		before new post
	*/

	return (
		<div id='daylog'>
		{log.length > 0 &&
		 	<h1>{log[0].title}</h1>
		}
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

	const fetchData = async () => {
		let month = new Date().getMonth(),
			year = calendar['currentYear'],
			user = loggedIn;

		const response = await fetch(`http://192.168.1.13:3333/posts/log?month=${month}&year=${year}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Content-length': 0,
				'Accept': 'application/json',
				'Host': 'http://192.168.1.5:3333',
				'auth-token': user
			}
		})

		const data = await response.json();
		setLog(data);
		console.log(data);
	}

	useEffect( ()=> {
		fetchData();
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