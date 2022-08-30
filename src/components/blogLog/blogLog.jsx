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

import React, { useState, useEffect, useReducer, useRef } from 'react';
import Calendar from '../../components/calendar';
import bodyParse from '../bodyParse';
import classNames from 'classnames';
// import componentSlide_UserSocial from '../componentSlide';
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

function WeekList({log}) {
}

function MonthChart({log}) {
}


function UserLog({userLog, logClasses}) {

	const [entry, setEntry] = useReducer(state => !state, true);
	const [exit, setExit] = useReducer(state => !state, false);

	// className changes need to be intiated by state var
	// from parent component, that's then accessible by Switch component
	// const classes = classNames({
	// 	'userEntry': entry == true && exit == false,
	// 	'userLeave': exit == true && entry == false
	// })
	const classes = classNames({
		'userEntry': logClasses.userEntry,
		'userLeave': logClasses.userLeave
	})

	const transition = (event) => {
		/*
			setExit true so animation plays.
			then set state for UserLog to false.
			then set state for SocialLog to true + 
				setEntry
		*/ 
	}

	/*function to set one as true, the rest as false*/
	const active = true;
	return (
		<div id='userlog' className={classes}>

			<div id="sidebar">
				<p>USER</p>
			</div>

			{active &&
				<DayLog log={userLog} />
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

function SocialLog({socialLog, logClasses}) {

	const classes = classNames({
		'socialEntry': logClasses.socialEntry,
		'socialLeave': logClasses.socialLeave
	})

	/*function to set one as true, the rest as false*/
	const active = true;
	return (
		<div id='socialLog' className={classes}>

			<div id="sidebar">
				<p>SOCIAL</p>
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

let reducer = (state, action) => {
		let newState;
		switch(action.type) {
			case 'rightToLeft':
				newState = {
					rightActive: false,
					rightNonActive: true,
					leftActive: true,
					leftNonActive: false
				}
				break;
			case 'leftToRight':
				newState = {
					rightActive: true,
					rightNonActive: false,
					leftActive: false,
					leftNonActive: true
				}
		}
		return newState;
	}

const initialState = {
		rightActive: true,
		rightNonActive: false,
		leftActive: false,
		leftNonActive: true
	}

function Switch({setLogClasses}) {

	/*
		Goal for the switch:
		upon selecting one button, 
		  - it's current class is removed,
		  - it gets a new class
		  - the other button get's it's current class removed
		  - new class then added

		will use useReducer to help manage all the variables and toggling
	*/

	const [activity, setActivity] = useReducer(reducer, initialState);

	const leftButtonClasses = classNames({
		'active': activity.leftActive,
		'nonActive': activity.leftNonActive,
	})

	const rightButtonClasses = classNames({
		'active': activity.rightActive,
		'nonActive': activity.rightNonActive,
	})

	useEffect(() => {
		console.log(activity.rightActive);
	}, [])

	return (
		<div id="switch">
			<button id="right" 
					className={rightButtonClasses} 
					onClick={()=> {setActivity({type:'leftToRight'}) 
								setLogClasses({type:'socialOut_userIn'})}}>User</button>
			<button id="left" 
					className={leftButtonClasses}
					onClick={()=> {setActivity({type:'rightToLeft'}) 
									setLogClasses({type:'userOut_socialIn'})}}>Social</button>
		</div>
	)
}

let logStateReducer = (state, action) => {
	let newState;
	switch(action.type) {
		case 'userOut_socialIn':
			newState = {
				userEntry: false,
				userLeave: true,
				socialEntry: true,
				socialLeave: false
			}
			break;
		case 'socialOut_userIn':
			newState = {
				userEntry: true,
				userLeave: false,
				socialEntry: false,
				socialLeave: true
			}
		break;
	}
	return newState;
}

const logStates = {
	userEntry: true,
	userLeave: false,
	socialEntry: false,
	socialLeave: false,
}

export default function BlogLog({loggedIn, userBlog, socialBlog, DayLog, WeekList, MonthChart}) {

	useEffect(()=> {
		userBlog.updateLog();
		socialBlog.updateLog();
	}, [])

	let userLog = userBlog.log,	
		socialLog = socialBlog.log;

	/*
		quick control to make sure only Daylog loads
	    08. 29. 2022
	    create state functions for each log
	    use useEffect for when state changes to
	    - add transition classes to log
	  	- then, toggle it's designated active var to unmount it
	*/

	const [logClasses, setLogClasses] = useReducer(logStateReducer, logStates);

	const active = true;
	return (
		
		<div id='blogLog'> {/*//Wrapper element for other components*/}

			<Switch setLogClasses={setLogClasses}/>

			<UserLog userLog={userLog}  
					 logClasses={logClasses}/>

			<SocialLog socialLog={socialLog}
					 	logClasses={logClasses}/>
			
		</div>
	)
}