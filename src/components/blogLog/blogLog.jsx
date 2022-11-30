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



function DayLog({log, userID, set_isReading, isReading}) {

	const openPost = (postID, userID, owner) => {
		if(userID == owner) {
			set_isReading({
					// ...isReading,
					blogpostID: postID,
					isOwner: true,
					postOpen: true
			})
		} else {
			set_isReading({
					// ...isReading,
					blogpostID: postID,
					isOwner: false,
					postOpen: true
			})
		}
	}

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
			let user = userID;
			let title = postObject.title;
			let tags = postObject.tags.length;
			let id = postObject._id;
			let owner = postObject.owner;
			let author = postObject.author;
			let content;

			if(postObject.content.match(/\((.*?)\)/g)) {
				content = bodyParse(postObject.content)
			} else {
				content = postObject.content
			}

			return (
				<div className="entry" key={id} onClick={() => openPost(id, user, owner)}>
					{(userID !== postObject.owner) &&  
						<span id="username">&#64;{postObject.author}</span>
					}
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
	}, [log, log.length > 0])



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


function MonthChart({userID, apiAddr}) {

	let initial = new Date(),
		kyou = initial.getDate(),
		kongetsu = initial.getMonth(),
		kotoshi = initial.getFullYear();

	/* cal.s_ will be manipulatable, will probably put in state,
		and is the var the calendar drawing function will use
	*/
	let [cal, set_cal] = useState({
		sDay: kyou,
		sMonth: kongetsu,
		sYear: kotoshi,
		months: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		],
		days: [
			"S",
			"M",
			"T",
			"W",
			"T",
			"F",
			"S"
		],
	}); 

	let draw = () => {
		let daysInMonth = new Date(kotoshi, kongetsu+1, 0).getDate(), //number of days in current/selected month
			startDay = new Date(kotoshi, kongetsu, 1).getDay(), //first day of the month
			endDay = new Date(kotoshi, kongetsu, daysInMonth).getDay(), //last day of the month
			now = new Date(),
			nowMonth = now.getMonth(),
			nowYear = now.getFullYear(),
			nowDay = kongetsu == nowMonth && kotoshi == nowYear ? now.getDate() : null;

		//local storage component. Shouldn't be necessary, will should remove in time
		cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
  			if (cal.data==null) {
    			localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
    			cal.data = {};
  			} else { 
  				cal.data = JSON.parse(cal.data); 
  			}

  		//Drawing Calculations,
  		//Blank entries for start of month
  		let squares = [];
  		if(cal.sMonth && startDay !=1 )	{
  			let blanks = startDay == 0 ? 7 : startDay ;
  			for(let i = 0; i < blanks; i++) {
  				squares.push("b");
  			}
  		}
  		if(!cal.sMonth && startDay != 0) {
  			for(let i = 0; i < startDay; i++) {
  				squares.push("b");
  			}
  		}

  		//days of the month
  		for (let i = 1; i <= daysInMonth; i++) { 
  			squares.push(i); 
  		}

  		//blank squares at the end of the month
  		if (cal.sMon && endDay != 0) {
    		let blanks = endDay==6 ? 1 : 7-endDay;
    		for (let i=0; i<blanks; i++) { 
    			squares.push("b"); 
    		}
  		}

  		if (!cal.sMon && endDay != 6) {
    		let blanks = endDay==0 ? 6 : 6-endDay;
    		for (let i=0; i<blanks; i++) { 
    			squares.push("b"); 
    		}
  		}

  		// console.log(squares)

	  	let weeksInMonth = squares.length / 7;
	  	// console.log(weeksInMonth)

	  	let daysInWeek = [];
	  	let days = JSON.parse(JSON.stringify(squares))
		for(let i = 1; i <= squares.length / 7; i++) {
		  	let week = days.splice(0, 7);
		  	daysInWeek.push(week);
		}
		// console.log(daysInWeek)
	  		
	  	let calendar = 
	  		<div id="calendar">

	  			{/*//a header for the days of the week*/}
	  			<div id="dayWrapper">
		  			{cal.days.map((d, index) => {
		  				return <div key={index} className="dayOfTheWeek">{d}</div>
		  			})}
		  		</div>

		  		<div id="datesWrapper">

		  			{/*rows for the weeks in a month*/}
			  		{[...Array(weeksInMonth)].map((i, e) => {

			  			return <div key={e} className="row">
			  				{daysInWeek[e].map((s, index) => {
			  					let date = daysInWeek[e][index];
					  			return <div key={index} className={`cell` + `${nowDay == squares[index] ? ' today' : ''}` + `${date == 'b' ? ' blank' : ''}`}>	
					  				{/*unsure if the classname thing works as of yet ....*/}
					  					<div key={index}className="cellDate">
					  						<p>{daysInWeek[e][index]}</p>
					  					</div>
					  				</div>
					  			})
			  				}
			  			</div>
			  		})
			  		}
	  			</div>
	  		</div>

	  	return calendar;

	}

	let calendar = draw();

	useEffect(() => {
		// calendar = draw();
		console.log(cal.sMonth);
	}, [])

	let forwardMonth = () => {
		set_nextClass('nextStart');
		set_prevClass('off');
		if(cal.sMonth + 1 > 11) {
			setTimeout(() => {
				set_yearClass('off');
			}, 200)
			setTimeout(() => {
				set_yearClass('');
			}, 1200)
		}
		set_currentClass('off');
		setTimeout(() => {
			if(cal.sMonth + 1 > 11) {
				set_cal({
					...cal,
					sMonth: 0,
					sYear: cal.sYear + 1
				}); console.log(cal.sMonth);
				set_currentMonth(cal.months[0]);
				set_nextMonth(cal.months[1])
				set_prevMonth(cal.months[11]);
				console.log(cal.sMonth)
			} else if (cal.sMonth + 1 == 11) {
				set_cal({
					...cal,
					sMonth: 11,
				}); console.log(cal.sMonth);
				set_nextMonth(cal.months[0]);
				set_prevMonth(cal.months[cal.sMonth])
				set_currentMonth(cal.months[11]);
			} 
			else {
				set_cal({
					...cal,
					sMonth: cal.sMonth + 1
				}); console.log(cal.sMonth);
				set_currentMonth(cal.months[cal.sMonth + 1]);
				set_nextMonth(cal.months[cal.sMonth + 2])
				set_prevMonth(cal.months[cal.sMonth])
			} 
			
		}, 700)
		setTimeout(() => {
			// if (cal.sMonth == 10) {
			// 	set_nextMonth(cal.months[0])
			// }
			set_nextClass('nextEnd');
			set_prevClass('')
		}, 1000)
	}

	let backwardMonth = () => {
		set_prevClass('prevStart');
		set_nextClass('off');
			//in this case, sMonth is 0 and we've gone back a year
		if(cal.sMonth - 1 < 0) { 
			setTimeout(() => {
				set_yearClass('off');
			}, 200)
			setTimeout(() => {
				set_yearClass('');
			}, 1200)
		}
		set_currentClass('off');
		setTimeout(() => {
			if(cal.sMonth - 1 < 0) {
				set_cal({
					...cal,
					sMonth: 11,
					sYear: cal.sYear - 1
				}); console.log(cal.sMonth);
				set_currentMonth(cal.months[11]);
				set_nextMonth(cal.months[0])
				set_prevMonth(cal.months[10])
				console.log(cal.sMonth)
			} else if (cal.sMonth - 1 == 0) {
				set_cal({
					...cal,
					sMonth: cal.sMonth - 1
				}); console.log(cal.sMonth);
				set_currentMonth(cal.months[cal.sMonth - 1]);
				set_nextMonth(cal.months[10])
				set_prevMonth(cal.months[11])
			} else {
				set_cal({
					...cal,
					sMonth: cal.sMonth - 1
				}); console.log(cal.sMonth);
				set_currentMonth(cal.months[cal.sMonth - 1]);
				set_nextMonth(cal.months[cal.sMonth])
				set_prevMonth(cal.months[cal.sMonth - 2])
			}
			console.log(cal.sMonth)
		}, 700)
		setTimeout(() => {
			set_prevClass('prevEnd');
			set_nextClass('')
		}, 1000)
	}

	//I should be able to have the innerHTML text simply come from the cal state object...
	let [nextClass, set_nextClass] = useState(''),
		[nextMonth, set_nextMonth] = useState(cal.months[kongetsu + 1]),
		[prevClass, set_prevClass] = useState(''),
		[prevMonth, set_prevMonth] = useState(cal.months[kongetsu - 1]),
		[currentClass, set_currentClass] = useState(''),
		[currentMonth, set_currentMonth] = useState(cal.months[kongetsu]),
		[currentYear, set_currentYear] = useState(kotoshi),
		[yearClass, set_yearClass] = useState('');
	let [calClass, set_calClass] = useState('');

	return (
		<div id="monthChart">		
			<div id="header">
				<span id="prev" 
					className={prevClass}
					onClick={backwardMonth}>
				{prevMonth}</span>

				<span id="current" 
					className={currentClass}>
				{currentMonth}</span>

				<span id="year"
					className={yearClass}>
				{cal.sYear}</span>

				<span id="next" 
					className={nextClass} 
					onClick={forwardMonth}>
				{nextMonth}</span>
			</div>

			<div id="calendar" className={calClass}>
				{calendar}
			</div>

			<div id="log">
			</div>
		</div>
	)
}


function UserLog({userLog, logClasses, userID, set_isReading, isReading}) {

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
		<div id='userlog' className={classes} >

			<div id="sidebar">
				<p>USER</p>
			</div>

			{active &&
				<DayLog 
					log={userLog} 
					userID={userID}
					set_isReading={set_isReading} 
					isReading={isReading} />
			}
			{!active &&
				<MonthChart log={userLog} />
			}
		</div>
	)
}

function SocialLog({socialLog, logClasses, userID, set_isReading, isReading}) {

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
				<DayLog log={socialLog}
					userID={userID}
					set_isReading={set_isReading} 
					isReading={isReading} />
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

function Switch({setLogClasses, socialBlog}) {

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
		// console.log(activity.rightActive);
	}, [])

	let updateSocialLog = socialBlog.updateLog;

	return (
		<div id="switch">
			<button id="right" 
					className={rightButtonClasses} 
					onClick={()=> {setActivity({type:'leftToRight'}) 
								setLogClasses({type:'socialOut_userIn'})}}>User</button>
			<button id="left" 
					className={leftButtonClasses}
					onClick={()=> {setActivity({type:'rightToLeft'}) 
									setLogClasses({type:'userOut_socialIn'})
									updateSocialLog()}}>Social</button>
		</div>
	)
}


export default function BlogLog(
	{loggedIn, userBlog, socialBlog, userID, set_isReading, isReading, setLogClasses, logClasses, monthChart, apiAddr}) {

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

	

	const active = true;
	return (
		
		<div id='blogLog'> {/*//Wrapper element for other components*/}

			{!monthChart &&
				<div id="dayLogWrapper">
					<Switch 
						setLogClasses={setLogClasses}
						socialBlog={socialBlog}/>

					<UserLog 
						userLog={userLog}  
					 	logClasses={logClasses}
					 	userID={userID}
					 	set_isReading={set_isReading} 
					 	isReading={isReading}/>

					<SocialLog socialLog={socialLog}
					 	logClasses={logClasses}
					 	userID={userID}
						set_isReading={set_isReading} 
						isReading={isReading}/>
				</div>
			}
			{monthChart &&
				<div id="monthChartWrapper">
					<MonthChart 
						userID={userID}/>
				</div>
			}
			
		</div>
	)
}