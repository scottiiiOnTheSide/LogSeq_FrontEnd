
import * as React from 'react';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import './calendar.css';

let accessAPI = APIaccess();

export default function Calendar ({current, setCurrent, cal, set_dateInView, selectedDate, setSelectedDate}) {

	const [tallyPerDate, set_tallyPerDate] = React.useState({});
	const [postsPerDate, set_postsPerDate] = React.useState([]);

	let getTallyPerDate = async(month, year) => {
		let day;
		let request = await accessAPI.pullMonthChart(month, day, year, current.social);
		set_tallyPerDate(request);
	}

	let getPostsPerDate = async(month, day, year) => {

		let request = await accessAPI.pullMonthChart(month, day, year, current.social);
		request.shift();
		set_postsPerDate(request);
	}

	const hajime = new Date(),
      kyou = hajime.getDate(),
      kongetsu = hajime.getMonth(),
      kotoshi = hajime.getFullYear();

	//loads necessary data on initial and reload
	React.useEffect(()=> {
		//Initial Posts Per Date
		getTallyPerDate(kongetsu, kotoshi);

		//Initials Posts For Selected Date
		getPostsPerDate(kongetsu, kyou, kotoshi);
	}, [])

	let [calClass, set_calClass] = React.useState('');
	let drawCalendar = () => {

		let daysInMonth = new Date(selectedDate.year, selectedDate.month+1, 0).getDate(), //number of days in current/selected month
			startDay = new Date(selectedDate.year, selectedDate.month, 1).getDay(), //first day of the month,
			endDay = new Date(selectedDate.year, selectedDate.month, daysInMonth).getDay(), //last day of the month
			now = new Date(),
			currentMonth = now.getMonth(),
			currentYear = now.getFullYear(),
			currentDay = selectedDate.month == currentMonth && selectedDate.Year == currentYear ? now.getDate() : null,
			months = cal.monthsAbrv,
			dayInitials = cal.dayInitials,
			squares = [];

		if(selectedDate.month && startDay !=1 )	{
  			let blanks = startDay == 0 ? 7 : startDay ;
  			for(let i = 0; i < blanks; i++) {
  				squares.push("b");
  			}
  		}
  		if(!selectedDate.month && startDay != 0) {
  			for(let i = 0; i < startDay; i++) {
  				squares.push("b");
  			}
  		}

  		//days of the month
  		for (let i = 1; i <= daysInMonth; i++) { 
  			squares.push(i); 
  		}

  		
  		if (endDay != 0) { //original condition (cal.sMon && endDay != 0) 
    		let blanks = endDay==6 ? 1 : 7-endDay;
    		for (let i=0; i<blanks; i++) { 
    			squares.push("b"); 
    		}
  		}
  		
  		if (endDay != 6) { //original condition (!cal.sMon && endDay != 6)
    		let blanks = endDay==0 ? 6 : 6-endDay;
    		for (let i=0; i<blanks; i++) { 
    			squares.push("b"); 
    		}
  		}

  		// Limit the total number of squares to 35 (5 rows of 7 days)
		// if (squares.length > 35) {
		//     squares = squares.slice(0, 35); // Remove any extra days beyond the 5th week
		// }

  		let weeksInMonth;
	  	if(squares.length / 7 < 5) {
	  		weeksInMonth = 5;
	  	} else {
	  		weeksInMonth = squares.length / 7;
	  		weeksInMonth = Math.floor(weeksInMonth);
	  	}
	  	// let weeksInMonth = Math.floor(squares.length / 7);
	  	// if(weeksInMonth < 5) {
	  	// 	weeksInMonth = 5;
	  	// }

	  	let daysInWeek = [];
	  	let days = JSON.parse(JSON.stringify(squares))
		for(let i = 0; i <= squares.length / 7; i++) {
		  	let week = days.splice(0, 7);
		  	daysInWeek.push(week);
		}
		if(daysInWeek.length == 7) {

			let count = 0;
			for(let i = 0; i <= daysInWeek[0].length; i++) {
				if(daysInWeek[0][i] == 'b') {
					count++
				}
			}
			if(count == 7) {
				daysInWeek.shift()
			}
		}

		console.log(daysInWeek);
		
		let calendar = 
		<div id="calendar" className={calClass}>
			
			<div id="daysOfTheWeek">
				{dayInitials.map((d, index) => {
					return <div key={index} className="day">{d}</div>
				})}
			</div>

			<div id="dates">
			{[...Array(weeksInMonth)].map((i, e) => {

					return <div key={e} className='row' id={`row${e}`}>
						       {daysInWeek[e].map((s, index) => {

						       		let date = daysInWeek[e][index],
						       			value = tallyPerDate[parseInt(date)];

						       		return <button key={index} 
						       					id={`cell${daysInWeek[e][index]}`}
						       					className={`cell` + `${selectedDate.day == daysInWeek[e][index] ? ' today' : ''}` + `${date == 'b' ? ' blank' : ''}`}
						       					onClick={()=> {

						       							setSelectedDate({
							       							month: selectedDate.month,
							       							day: daysInWeek[e][index],
							       							year: selectedDate.year,
							       						})
							       						getPostsPerDate(selectedDate.month, daysInWeek[e][index], selectedDate.year);
						       					}}>
						       					{value > 0 &&
						       						<div className={`${date == 'b' ? 'hidden' : 'tallyWrapper'}`}>
							  							<span className={`tally` + `${value >= 1 ? ' on' : ''}`}></span>
							  							<span className={`tally` + `${value >= 3 ? ' on' : ''}`}></span>
							  							<span className={`tally` + `${value >= 5 ? ' on' : ''}`}></span>
							  							<span className={`tally` + `${value >= 7 ? ' on' : ''}`}></span>
							  							<span className={`tally` + `${value >= 9 ? ' on' : ''}`}></span>
						  							</div>
						       					}
						       					
					  							<div key={index} className="cellDate">
							  						<p>{daysInWeek[e][index]}</p>
							  					</div>
						       			   </button>
						       })}
						   </div>
					// }
				})}
			</div>
		</div>

		return calendar;
	}
	let calendar = drawCalendar();


	/*
		Element Class Names via State
	*/
	
	let	[nextClass, set_nextClass] = React.useState(''),
		[nextMonth, set_nextMonth] = React.useState(''), 
		[prevClass, set_prevClass] = React.useState(''),
		[prevMonth, set_prevMonth] = React.useState(''),
		[currentClass, set_currentClass] = React.useState(''),
		[currentMonth, set_currentMonth] = React.useState(cal.monthsAbrv[selectedDate.month]),
		[currentYear, set_currentYear] = React.useState(selectedDate.year),
		[yearClass, set_yearClass] = React.useState(''),
		noHeading = true,
		[dateSelect, setDateSelect] = React.useState({
			open: false,
			month: selectedDate.month,
			year: selectedDate.year
		})

	const onChange = (e) => {

		setDateSelect({
			...dateSelect,
			year: e.target.value
		})
		if(e.target.value.length == 4) {
			setSelectedDate({
				...selectedDate,
				year: e.target.value
			})
		}
	}

	let forwardMonth = () => {

		set_postsPerDate([]);
		set_nextClass('nextStart');
		set_currentClass('off');
		

		/* if year changes */
		if(selectedDate.month + 1 > 11) {
			setTimeout(() => {
				set_yearClass('off');
			}, 200)
			setTimeout(() => {
				set_yearClass('');
			}, 1200)
		}
		set_prevClass('off');
		
		/*Initiate calendar leaving animation*/
		set_calClass('leave');

		setTimeout(() => {
			if(selectedDate.month + 1 > 11) {
				setSelectedDate({
					day: null,
					month: 0,
					year: selectedDate.year + 1
				});

				set_currentMonth(cal.monthsAbrv[0]);
				set_prevMonth(cal.monthsAbrv[11]);

				setTimeout(() => {
					set_nextMonth(cal.monthsAbrv[1])
				}, 300)

			} else if (selectedDate.month + 1 == 11) {
					setSelectedDate({
						day: null,
						month: 11,
						year: selectedDate.year
					});

				set_prevMonth(cal.monthsAbrv[10])
				set_currentMonth(cal.monthsAbrv[11]);
				setTimeout(() => {
					set_nextMonth(cal.monthsAbrv[0]);
				}, 300)
			} 
			else {
				setSelectedDate({
					day: null,
					month: selectedDate.month + 1,
					year: selectedDate.year
				});

				set_currentMonth(cal.monthsAbrv[selectedDate.month + 1]);
				set_prevMonth(cal.monthsAbrv[selectedDate.month])
				setTimeout(() => {
					set_nextMonth(cal.monthsAbrv[selectedDate.month + 2])
				}, 300)
			}
			/*Return Calendar*/
			set_calClass('return');
		}, 700)
		setTimeout(() => {
			set_currentClass('');
			set_nextClass('nextEnd');
			set_prevClass('')
		}, 1000)
	}

	let backwardMonth = () => {

		set_postsPerDate([]);
		set_prevClass('prevStart');
		set_nextClass('off');

			//in this case, sMonth is 0 and we've gone back a year
		if(selectedDate.month - 1 < 0) { 
			setTimeout(() => {
				set_yearClass('off');
			}, 200)
			setTimeout(() => {
				set_yearClass('');
			}, 1200)
		}
		set_currentClass('off');

		/*Initiate calendar leave animation*/
		set_calClass('leave');

		setTimeout(() => {
			if(selectedDate.month - 1 < 0) {
				setSelectedDate({
					day: null,
					month: 11,
					year: selectedDate.year - 1
				}); 

				set_currentMonth(cal.monthsAbrv[11]);
				set_nextMonth(cal.monthsAbrv[0])

				setTimeout(() => {
					set_prevMonth(cal.monthsAbrv[10])
				}, 300)

			} else if (selectedDate.month - 1 == 0) {

				setSelectedDate({
					day: null,
					month: 0,
					year: selectedDate.year
				}); 

				set_currentMonth(cal.monthsAbrv[selectedDate.month - 1]);
				set_nextMonth(cal.monthsAbrv[10])
				setTimeout(() => {
					set_prevMonth(cal.monthsAbrv[11])
				}, 300)
			} else {
				setSelectedDate({
					day: null,
					month: selectedDate.month - 1,
					year: selectedDate.year
				}); 

				set_currentMonth(cal.monthsAbrv[selectedDate.month - 1]);
				set_nextMonth(cal.monthsAbrv[selectedDate.month]);
				setTimeout(() => {
					set_prevMonth(cal.monthsAbrv[selectedDate.month - 2])
				}, 300)
			}

			/*Return calendar animation*/
			set_calClass('return');
		}, 700)
		setTimeout(() => {
			set_currentClass('');
			set_prevClass('prevEnd');
			set_nextClass('')
		}, 1000)
	}

	/* 
		Ensure correct date is set initially 
	*/
	React.useEffect(()=> {
			if (selectedDate.month - 1 < 0) {
				set_prevMonth(cal.monthsAbrv[11])
			} else if (selectedDate.month - 1 == 0) {
				set_prevMonth(cal.monthsAbrv[0])
			} else {
				set_prevMonth(cal.monthsAbrv[selectedDate.month - 1])
			} 

			if (selectedDate.month + 1 > 11) {
				set_nextMonth(cal.monthsAbrv[0])
			} else if (selectedDate.month + 1 == 11) {
				set_nextMonth(cal.monthsAbrv[11]);
			} else {
				set_nextMonth(cal.monthsAbrv[selectedDate.month + 1])
			}
	}, [selectedDate, ])

	/*
		Changes Text for Currently viewed Month when new one is selected in 
		dateSelect modal
	*/
	React.useEffect(()=> {

		if(dateSelect.month != kongetsu) {
			set_currentMonth(cal.monthsAbrv[dateSelect.month]);
			setSelectedDate({
				...selectedDate,
				month: dateSelect.month
			})
		}
		getTallyPerDate(selectedDate.month, selectedDate.year);
	}, [dateSelect])


	const [leave, setLeave] = React.useReducer(state => !state, true);

	return (

		<div id="monthChart" className={`${current.transition == true ? 'leave' : ''}`}>

			<div id="header">
				
				<span id="prev" className={prevClass} onClick={ async()=> {
					set_tallyPerDate('');
					let delay = setTimeout(async()=> {
						if(selectedDate.month - 1 < 0) {
							await getTallyPerDate('11', selectedDate.year - 1);
							console.log('one one')
						} else if (selectedDate.month - 1 == 0) {
							await getTallyPerDate('0', selectedDate.year);
							console.log('one two')
						} else {
							await getTallyPerDate(selectedDate.month - 1, selectedDate.year)
							console.log('one three')
						}
					}, 1500)
					backwardMonth();
				}}>{prevMonth}</span>

				<div id="current" onClick={(e)=> {
					setDateSelect({
						...dateSelect,
						open: true
					})
					let delay = setTimeout(()=> {
						document.getElementById('dateSelection').classList.remove('_enter');				
					}, 200)
				}}>
					<p id="month" className={currentClass}>{currentMonth}</p>
					<span id="year" className={yearClass}>{selectedDate.year}</span>
				</div>

				<span id="next" className={nextClass} onClick={	async()=> {
					set_tallyPerDate('');
					let delay = setTimeout(async()=> {
						if(selectedDate.month + 1 > 11) {
							await getTallyPerDate('0', selectedDate.year + 1);
							console.log('one')
						} else if (selectedDate.month + 1 == 1){
							await getTallyPerDate('1', selectedDate.year);
							console.log('two')
						} else if (selectedDate.month + 1 == 11) {
							await getTallyPerDate(11, selectedDate.year);
							console.log('three-ish')
						} else {
							await getTallyPerDate(selectedDate.month + 1, selectedDate.year);
							console.log('three')
						}
					}, 1500 )
					forwardMonth();
				}}>{nextMonth}</span>
			</div>

			{calendar}

			{dateSelect.open &&
				<div id="dateSelection" className={`_enter`}>

					<p id="firstNotice">Select the month, type in a year and then close this modal to set a new month</p>

					<ul id="monthSelection">

						{cal.monthsAbrv.map((month, index)=> {

							return (
								<li key={month}>
									<button className={`buttonDefault ${dateSelect.month == index ? 'selected' : ''}`}
											onClick={(e)=> {
												e.preventDefault();
												setDateSelect({
													...dateSelect,
													month: index
												})
											}}>
									{month}</button>
								</li>
							)
						})}
					</ul>

					<input 
						name="yearSelect"
						type="number"
						maxLength="4"
						value={dateSelect.year}
						onChange={onChange}
						/>
					<p id="secondNotice">Input between 1900 - 2100</p>

					<button id="exit"
							className={`buttonDefault`}
							onClick={(e)=> {
								e.preventDefault();
								document.getElementById('dateSelection').classList.add('_enter');
								
								let delay = setTimeout(()=> {
									setDateSelect({
										...dateSelect,
										open: false
									})
								}, 200)
							}}>
						CLOSE
					</button>
				</div>
			}

			{postsPerDate.length == 0 &&
				<h2 id="noPosts">No Posts</h2>
			}
			{postsPerDate.length > 0 &&
				<Log data={postsPerDate} noHeading={noHeading} current={current} setCurrent={setCurrent}/>
			}
		</div>

	)

}







