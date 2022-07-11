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

	let postsFromToday = (posts) => {
		let postsFromToday;
		let today = new Date().getDate();
		for (let i = 0; i < posts.length; i++) {
				if(posts[i].postedBy_date == today) {
					postsFromToday = true;
				} else {
					postsFromToday = false;
				}
			}
			return postsFromToday;
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
	let today;

	useEffect(() => {
		if(log.length > 0) {

			log.forEach((post, index) => {
				let entry = returnPostElement(post);
				blogs.push(entry);
			});
		}
		setLoaded(true);
		let today = postsFromToday(log);
		console.log(blogs);

	}, [log.length > 0])

	//conditional rendering statement
	if(loaded == true) {

		if(today) {
			return (
				<div id='daylog'>
					{log.map((post, index) => (
						returnPostElement(post)
					))}
				</div>
			)
		} else if (!today) {
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

export default function BlogLog({calendar, loggedIn, Daylog, WeekList, MonthChart}) {

	//automatically runs whenever BlogLog mounts, only if log is empty
	let [log, setLog] = useState([]);

	const fetchData = async () => {
		let month = new Date().getMonth(),
			year = calendar['currentYear'],
			user = loggedIn;

		const response = await fetch(`http://192.168.1.5:3333/posts/log?month=${month}&year=${year}`, {
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