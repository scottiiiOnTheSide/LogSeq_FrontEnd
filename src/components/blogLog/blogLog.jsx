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
import bodyParse from '../bodyParse';
import './blogLog.css';


/* 08. 19. 2022 
   this for socialLog,
   but replaced in App.js */
async function loadLog (user,year,state) {
	let blogs = [];
	let month = new Date().getMonth();

	await fetch(`http://192.168.1.13:3333/posts/social?month=${month}&year=${year}`, {
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
			let tags = postObject.tags.length;
			let id = postObject._id;
			let content;

			if(postObject.content.match(/\((.*?)\)/g)) {
				content = bodyParse(postObject.content)
			} else {
				content = postObject.content
			}

			return (
				<div className="entry" key={id}>
					<h2>{title}</h2>
					<p dangerouslySetInnerHTML={{ __html: content }}></p> 
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

function SocialLog_exp({log, setLog}) {

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
			let tags = postObject.tags.length;
			let id = postObject._id;
			let content;

			if(postObject.content.match(/\((.*?)\)/g)) {
				content = bodyParse(postObject.content)
			} else {
				content = postObject.content
			}

			return (
				<div className="entry_SL" key={id}>
					<h2>{title}</h2>
					<p dangerouslySetInnerHTML={{ __html: content }}></p> 
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


function UserLog({userLog, DayLog, WeekList, MonthChart}) {

	/*function to set one as true, the rest as false*/
	const active = true;
	return (
		<div id='userLog'>

			<div id="sidebar">
				<p>USER <br/>.<br/>LOG</p>
			</div>

			{active &&
				<DayLog log={userLog}/>
			}
			{!active &&
				<WeekList log={userLog} />
			}
			{!active &&
				<MonthChart log={userLog} />
			}
		</div>
	)
}

function SocialLog({socialLog, DayLog, WeekList, MonthChart}) {

	/*function to set one as true, the rest as false*/
	const active = true;
	return (
		<div id='socialLog'>

			<div id="sidebar">
				<p>SOCIAL <br />.<br />LOG</p>
			</div>

			{active &&
				<DayLog log={socialLog} />
			}
			{!active &&
				<WeekList log={socialLog} />
			}
			{!active &&
				<MonthChart log={socialLog} />
			}
		</div>
	)
}


export default function BlogLog({loggedIn, userBlog, socialBlog, Daylog, WeekList, MonthChart}) {

	useEffect( ()=> {
		userBlog.updateLog();
		socialBlog.updateLog();

		const userLog = document.getElementById('userlog');
		// const userLog_sideBar = window.getComputedStyle(userLog, "::before");
		console.log(userLog);
	}, [])

	let userLog = userBlog.log,	
		socialLog = socialBlog.log;

	/* 08. 19. 2022
		run function in here to allow swiping between User.Log & Social.Log
		heirachy should be
		BlogLog
		  -User.log
		    - Day, Week and Month views
		  -Social.log
		     - Day, Week and Month Views
	*/


	//quick control to make sure only Daylog loads
	const active = true;
	return (
		
		<div id='blogLog'> {/*//Wrapper element for other components*/}

			{active &&
				<UserLog userLog={userLog} 
						 DayLog={DayLog}
						 WeekList={WeekList}
						 MonthChart={MonthChart} />
			}
			{!active &&
				<SocialLog socialLog={socialLog}
						   DayLog={DayLog}
						   WeekList={WeekList}
						   MonthChart={MonthChart} />
			}
			
		</div>
	)
}