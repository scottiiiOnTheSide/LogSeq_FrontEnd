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

	/*Changes the state variables which switch between 
	  viewing dayLog and a blogpost*/
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

	/* Discerns whether there are any posts made today */
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

	/* Creates the post element within the day log */
	let returnPostElement = (post) => {
			let user = userID;
						let title = post.title;
						let tags = post.tags.length;
						let id = post._id;
						let owner = post.owner;
						let author = post.author;
						let content;
						if(post.content.match(/\((.*?)\)/g)) {
							content = bodyParse(post.content)
						} else {
							content = post.content
						}

						let month, day, year, dateMatch;

						if(monthObserved != post.postedOn_month) {

						 	if (dateObserved != post.postedOn_day) {
								month = post.postedOn_month;
								day = post.postedOn_day;
								year = post.postedOn_year;
								dateMatch = false;
							}
						}

						dateObserved = post.postedOn_day;
						monthObserved = post.postedOn_Month;

						return (
							<div className="entry" key={id} onClick={() => openPost(id, user, owner)}>
								
								{(dateMatch == false) &&
									<span className="postDate">{month + 1} . {day} . {year}</span>
								}
								{(userID !== post.owner) &&  
									<span id="username">&#64;{post.author}</span>
								}
								<h2>{title}</h2>
								<p dangerouslySetInnerHTML={{ __html: content }}></p> 
								<ul>
									<li>{tags} tags</li>
								</ul>
							</div>
						)
		}

	let date = new Date();
	let currentDay = date.getDate(),
		currentMonth = date.getMonth(),
		currentYear = date.getFullYear();
	let dateObserved, monthObserved;

	let [loaded, setLoaded] = useReducer(state => !state, false);
	
	return (
		<div id='daylog'>
			{(postsFromToday(log) !== true) &&
				<h1 id="noPostsToday">No Posts Today</h1>
			}
			{log.map(post => returnPostElement(post))}
		</div>
	)		
} 


function MonthChart(
	{userID, apiAddr, userKey, social, appCal, setAppCal, monthLog, set_monthLog, set_isReading, isReading}) {

	/*
		API call gets array with each index value 
		representing amount of posts per day
	*/
	let s = social;
	const getPostsPerDate = async (month, year) => {

		const api = apiAddr,
			  user = userKey;

		const request = await fetch(`${api}/posts/monthChart?social=${s}&month=${month}&year=${year}`, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
        		'Content-length': 0,
        		'Accept': 'application/json',
        		'Host': api,
        		'auth-token': user
			}
		})

		const response = await request.json();
		setTimeout(() => {
			set_postsPerDate(response);
		}, 1000)
		
		console.log(postsPerDate);
	}

	const allPostsForDate = async (month, day, year) => {

		const api = apiAddr,
			  user = userKey;

		const request = await fetch(`${api}/posts/monthChart?social=${s}&day=${day}&month=${month}&year=${year}`, {
			method: "GET",
			headers: {
				'Content-Type': 'application/json',
        		'Content-length': 0,
        		'Accept': 'application/json',
        		'Host': api,
        		'auth-token': user
			}
		})

		const response = await request.json();

		let reorder = [];
    	for(let i = response.length; i >= 0; i--) {
      		reorder.push(response[i]);
    	}
    	reorder.splice(0, 1);

    	//update the state object that'll hold the posts per day
    	setTimeout(() => {
    		set_monthLog(reorder);
    	})

	}

	/* Setting initial date values*/
	let initial = new Date(),
		kyou = initial.getDate(),
		kongetsu = initial.getMonth(),
		kotoshi = initial.getFullYear();

	/*keeps track of currently selected date info*/
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

	/*
		Creates the C A L E N D A R
		Draws date info from the [cal] state object
	*/
	let draw = () => {
		let daysInMonth = new Date(cal.sYear, cal.sMonth+1, 0).getDate(), //number of days in current/selected month
			startDay = new Date(cal.sYear, cal.sMonth, 1).getDay(), //first day of the month
			endDay = new Date(cal.sYear, cal.sMonth, daysInMonth).getDay(), //last day of the month
			now = new Date(),
			nowMonth = now.getMonth(),
			nowYear = now.getFullYear(),
			nowDay = cal.sMonth == nowMonth && cal.sYear == nowYear ? now.getDate() : null;

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

  		//blank squares at the end of the month (what is cal.sMon !?)
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

	  	let weeksInMonth;
	  	if(squares.length / 7 < 5) {
	  		weeksInMonth = 5;
	  	} else {
	  		weeksInMonth = squares.length / 7;
	  	}
	  	// console.log(weeksInMonth)

	  	let daysInWeek = [];
	  	let days = JSON.parse(JSON.stringify(squares))
		for(let i = 0; i <= squares.length / 7; i++) {
		  	let week = days.splice(0, 7);
		  	daysInWeek.push(week);
		}


	  	let calendar = 
	  		<div id="calendar" className={calClass}>

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
			  					let value = postsPerDate[parseInt(date)];
					  			return <div key={index} 
					  						className={`cell` + `${nowDay == squares[index] ? ' today' : ''}` + `${date == 'b' ? ' blank' : ''}`}
					  						onClick={()=> {
					  							clickSelectedDate(cal.sMonth, daysInWeek[e][index], cal.sYear)
					  							setAppCal({
					  								...appCal,
					  								year_inView: cal.sYear,
    												month_inView: cal.sMonth,
    												date_inView: daysInWeek[e][index]
					  							})
					  							appCal.viewDateInView();
					  					}}>	
					  				{/*unsure if the classname thing works as of yet ....*/}

					  					<div className={`${date == 'b' ? 'hidden' : 'tallyWrapper'}`}>
					  							<span className={`tally` + `${value >= 1 ? ' on' : ''}`}></span>
					  							<span className={`tally` + `${value >= 3 ? ' on' : ''}`}></span>
					  							<span className={`tally` + `${value >= 5 ? ' on' : ''}`}></span>
					  							<span className={`tally` + `${value >= 7 ? ' on' : ''}`}></span>
					  							<span className={`tally` + `${value >= 9 ? ' on' : ''}`}></span>
					  					</div>

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

		/*Initiate calendar leaving animation*/
		set_calClass('next_Leave');

		setTimeout(() => {
			if(cal.sMonth + 1 > 11) {
					set_cal({
						...cal,
						sMonth: 0,
						sYear: cal.sYear + 1
					});
				console.log(cal.sMonth);
				set_currentMonth(cal.months[0]);
				set_prevMonth(cal.months[11]);
				console.log(cal.sMonth)
				setTimeout(() => {
					set_nextMonth(cal.months[1])
				}, 300)
			} else if (cal.sMonth + 1 == 11) {
					set_cal({
						...cal,
						sMonth: 11,
					});
				console.log(cal.sMonth);
				set_prevMonth(cal.months[11])
				set_currentMonth(cal.months[11]);
				setTimeout(() => {
					set_nextMonth(cal.months[0]);
				}, 300)
			} 
			else {
					set_cal({
						...cal,
						sMonth: cal.sMonth + 1
					});
				console.log(cal.sMonth);
				set_currentMonth(cal.months[cal.sMonth + 1]);
				set_prevMonth(cal.months[cal.sMonth])
				setTimeout(() => {
					set_nextMonth(cal.months[cal.sMonth + 2])
				}, 300)
			}
			
			/*Return Calendar*/
			set_calClass('next_Return');
		}, 700)
		setTimeout(() => {
			set_nextClass('nextEnd');
			set_prevClass('')
		}, 1300)

		console.log(postsPerDate);
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

		/*Initiate calendar leave animation*/
		set_calClass('prev_Leave');

		setTimeout(() => {
			if(cal.sMonth - 1 < 0) {
				set_cal({
					...cal,
					sMonth: 11,
					sYear: cal.sYear - 1
				}); console.log(cal.sMonth);
				set_currentMonth(cal.months[11]);
				set_nextMonth(cal.months[0])
				console.log(cal.sMonth)
				setTimeout(() => {
					set_prevMonth(cal.months[10])
				}, 300)
			} else if (cal.sMonth - 1 == 0) {
				set_cal({
					...cal,
					sMonth: cal.sMonth - 1
				}); console.log(cal.sMonth);
				set_currentMonth(cal.months[cal.sMonth - 1]);
				set_nextMonth(cal.months[10])
				setTimeout(() => {
					set_prevMonth(cal.months[11])
				}, 300)
			} else {
				set_cal({
					...cal,
					sMonth: cal.sMonth - 1
				}); console.log(cal.sMonth);
				set_currentMonth(cal.months[cal.sMonth - 1]);
				set_nextMonth(cal.months[cal.sMonth]);
				setTimeout(() => {
					set_prevMonth(cal.months[cal.sMonth - 2])
				}, 300)
			}

			/*Return calendar animation*/
			set_calClass('prev_Return');
		}, 700)
		setTimeout(() => {
			set_prevClass('prevEnd');
			set_nextClass('')
		}, 1000)
	}

	let clickSelectedDate = (month, day, year) => {
		// console.log(month +" "+day+" "+ year)
		allPostsForDate(month, day, year);
	}

	const openPost = (postID) => {
		if(social == true) {
			set_isReading({
					// ...isReading,
					blogpostID: postID,
					isOwner: false,
					postOpen: true,
					monthLog: true
			})
		} else {
			set_isReading({
					// ...isReading,
					blogpostID: postID,
					isOwner: true,
					postOpen: true,
					monthLog: true
			})
		}
	}

	/* Element classes*/
	let [calClass, set_calClass] = useState(''),
		[nextClass, set_nextClass] = useState(''),
		[nextMonth, set_nextMonth] = useState(''), 
		[prevClass, set_prevClass] = useState(''),
		[prevMonth, set_prevMonth] = useState(''),
		[currentClass, set_currentClass] = useState(''),
		[currentMonth, set_currentMonth] = useState(cal.months[kongetsu]),
		[currentYear, set_currentYear] = useState(kotoshi),
		[yearClass, set_yearClass] = useState(''),
		[postsPerDate, set_postsPerDate] = useState({});

	let calendar = draw();
	
	let [selectedDatesPosts, set_selectedDatesPosts] = useState([]);

	/*	Edge cases in displaying the correct Prev and Next months */
	useEffect(()=> {
		if (cal.sMonth - 1 < 0) {
			set_prevMonth(cal.months[11])
		} else if (cal.sMonth - 1 == 0) {
			set_prevMonth(cal.months[0])
		} else {
			set_prevMonth(cal.months[kongetsu - 1])
		} 

		if (cal.sMonth + 1 > 11) {
			set_nextMonth(cal.months[0])
		} else if (cal.sMonth + 1 == 11) {
			set_nextMonth(cal.months[11]);
		} else {
			set_nextMonth(cal.months[kongetsu + 1])
		}

		//Initial Posts Per Date
		getPostsPerDate(cal.sMonth, cal.sYear);

		//Initials Posts For Selected Date
		allPostsForDate(kongetsu, kyou, kotoshi)
	}, [])

	return (
		<div id="monthChart">		
			<div id="header">
				<span id="prev" 
					className={prevClass}
					onClick={
						async ()=> {
							if(cal.sMonth - 1 < 0) {
								await getPostsPerDate('11', cal.sYear - 1);
								console.log('one one')
							} else if (cal.sMonth - 1 == 0) {
								await getPostsPerDate('0', cal.sYear);
								console.log('one two')
							} else {
								await getPostsPerDate(cal.sMonth - 1, cal.sYear)
								console.log('one three')
							}
							backwardMonth();
						}
					}>
				{prevMonth}</span>

				<span id="current" 
					className={currentClass}
					onClick={()=> {console.log(postsPerDate)}}>
				{currentMonth}</span>

				<span id="year"
					className={yearClass}>
				{cal.sYear}</span>

				<span id="next" 
					className={nextClass} 
					onClick={
						async ()=> {
							if(cal.sMonth + 1 > 11) {
								await getPostsPerDate('0', cal.sYear + 1);
								console.log('one')
							} else if (cal.sMonth + 1 == 1){
								await getPostsPerDate('1', cal.sYear);
								console.log('two')
							} else if (cal.sMonth + 1 == 11) {
								await getPostsPerDate(11, cal.sYear);
								console.log('three-ish')
							} else {
								await getPostsPerDate(cal.sMonth + 1, cal.sYear);
								console.log('three')
							}
							forwardMonth();
					}}>
				{nextMonth}</span>
			</div>

			{calendar}

			<div id="log" className={''}>
				{(monthLog.length > 0) &&
					<ul>
						{monthLog.map((post, index) => (
							<li key="index" onClick={()=>{openPost(post._id)}}>
								<h2>{post.title}</h2>
								<ul className="deets">
									{(post.tags.length > 0) &&
										<li>{post.tags.length} tags</li>
									}
									{(post.taggedUsers.length > 0) &&
										<li>{post.taggedUsers.length} invites</li>
									}
								</ul>
							</li>
						))}
					</ul>
				}
				{(monthLog.length == 0) &&
					<h2>No Posts for Today</h2>
				}
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
				<DayLog 
					log={socialLog}
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

function Switch({setLogClasses, socialBlog, userBlog, setSocialSide}) {

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

	let updateSocialLog = socialBlog.updateLog;
	let updateUserBlog = userBlog.updateLog;

	return (
		<div id="switch">
			<button id="right" 
					className={rightButtonClasses} 
					onClick={()=> {setActivity({type:'leftToRight'}) 
								setLogClasses({type:'socialOut_userIn'})
								updateUserBlog()
								setSocialSide(false)}}>User</button>
			<button id="left" 
					className={leftButtonClasses}
					onClick={()=> {setActivity({type:'rightToLeft'}) 
									setLogClasses({type:'userOut_socialIn'})
									updateSocialLog()
									setSocialSide(true)}}>Social</button>
		</div>
	)
}


export default function BlogLog(
	{loggedIn, userBlog, socialBlog, userID, set_isReading, isReading, setLogClasses, logClasses, monthChart, apiAddr, userKey, setSocialSide, socialSide, calendar,setCalendar, monthLog, set_monthLog}) {

	useEffect(()=> {
		userBlog.updateLog();
		socialBlog.updateLog();
	}, [])

	// console.log(socialSide);



	return (
		
		<div id='blogLog' > {/*//Wrapper element for other components*/}

			{!monthChart &&
				<div id="dayLogWrapper">
					<Switch 
						setLogClasses={setLogClasses}
						socialBlog={socialBlog}
						userBlog={userBlog}
						setSocialSide={setSocialSide}/>

					<UserLog 
						userLog={userBlog.log}  
					 	logClasses={logClasses}
					 	userID={userID}
					 	set_isReading={set_isReading} 
					 	isReading={isReading}/>

					<SocialLog 
						socialLog={socialBlog.log}
					 	logClasses={logClasses}
					 	userID={userID}
						set_isReading={set_isReading} 
						isReading={isReading}/>
				</div>
			}
			{monthChart &&
				<div id="monthChartWrapper">
					<MonthChart 
						apiAddr={apiAddr}
						userID={userID}
						userKey={userKey}
						social={socialSide}
						appCal={calendar}
						setAppCal={setCalendar}
						monthLog={monthLog}
						set_monthLog={set_monthLog}
						isReading={isReading}
						set_isReading={set_isReading}/>
				</div>
			}
			
		</div>
	)
}