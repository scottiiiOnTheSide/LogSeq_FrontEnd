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

function DayLog({log, setLog}) {

	let postsFromToday = (posts) => {
		let fromToday;
		let today = new Date().getDate();
		for (let i = 0; i < posts.length; i++) {
				if(posts[i].postedOn_day == today) {
					fromToday = true;
					break;
				} else {
					fromToday = false;
				}
			}
			return fromToday;
	}

	let returnPostElement = (postObject) => {
			let title = postObject.title;
			let content = postObject.content; //this needs to be parsed
			let tags = postObject.tags.length;
			let id = postObject._id;

			return (
				<div className="entry" key={id}>
					<h2>{title}</h2>
					<p>{content}</p>
					<ul>
						<li>{tags} tags</li>
					</ul>
				</div>
			)
		}

	let currentDay = new Date().getDate();
	let [loaded, setLoaded] = useState(false);
	let blogs = [];

	useEffect(() => {
		setLoaded(true);
	}, [log.length > 0])



//conditional rendering statement
	if(loaded == true) {

		// console.log(blogs);

		if(postsFromToday(log) == true) {
			return (
				<div id='daylog'>
					{log.map((post, index) => (
						returnPostElement(post)
					))}
				</div>
			)
		} else if (postsFromToday(log) !== true) {
			return (
				<div id='daylog'>
					<h1>No Posts Today</h1>
					{log.map((post, index) => (
						returnPostElement(post)
					))}
				</div>
			)
		}	
	}
}

function WeekList() {
}

function MonthChart() {
}

export default function BlogLog({calendar, loggedIn, Daylog, WeekList, MonthChart, apiAddr}) {

	//automatically runs whenever BlogLog mounts, only if log is empty
	let [log, setLog] = useState([]);

	const fetchData = async () => {
		let month = new Date().getMonth(),
			year = calendar['currentYear'],
			user = loggedIn,
			api = apiAddr

		const response = await fetch(`${api}/posts/log?month=${month}&year=${year}`, {
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

		let reorder = [];
		for(let i = data.length; i >= 0; i--) {
			reorder.push(data[i]);
		}
		reorder.splice(0, 1);
		setLog(reorder);
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
				<DayLog log={log} setLog={setLog}/>
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