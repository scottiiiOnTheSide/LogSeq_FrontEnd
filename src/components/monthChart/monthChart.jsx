
import * as React from 'react';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import './monthChart.css';

let accessAPI = APIaccess();

export default function MonthChart ({social, cal, set_dateInView}) {

	const [tallyPerDate, set_tallyPerDate] = React.useState({});
	const [postsPerDate, set_postsPerDate] = React.useState([]);

	const hajime = new Date(),
		  kyou = hajime.getDate(),
		  kongetsu = hajime.getMonth(),
		  kotoshi = hajime.getFullYear();
	const [selectedDate, set_SelectedDate] = React.useState({
		day: kyou,
		month: kongetsu,
		year: kotoshi
	})

	let getTallyPerDate = async(month, year) => {
		let day;
		let request = await accessAPI.pullMonthChart(month, day, year, social);
		set_tallyPerDate(request);
	}

	let getPostsPerDate = async(month, day, year) => {

		let request = await accessAPI.pullMonthChart(month, day, year, social);
		request.shift();
		set_postsPerDate(request);
	}

	React.useEffect(()=> {
		//Initial Posts Per Date
		getTallyPerDate(selectedDate.month, selectedDate.year);

		//Initials Posts For Selected Date
		getPostsPerDate(kongetsu, kyou, kotoshi)
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

  		let weeksInMonth;
	  	if(squares.length / 7 < 5) {
	  		weeksInMonth = 5;
	  	} else {
	  		weeksInMonth = squares.length / 7;
	  		weeksInMonth = Math.floor(weeksInMonth);
	  	}

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
		// if(daysInWeek.length == 6) {
		// 	if(daysInWeek[daysInWeek.length - 1].length == 0) {
		// 		daysInWeek.pop()
		// 	}
		// }

		let calendar = 
		<div id="calendar" className={calClass}>
			
			<div id="daysOfTheWeek">
				{dayInitials.map((d, index) => {
					return <div key={index} className="day">{d}</div>
				})}
			</div>

			<div id="dates">
				{[...Array(weeksInMonth)].map((i, e) => {

					return <div key={e} className="row">
						       {daysInWeek[e].map((s, index) => {
						       		let date = daysInWeek[e][index],
						       			value = tallyPerDate[parseInt(date)];

						       		return <div key={index} 
						       					className={`cell` + `${currentDay == squares[index] ? ' today' : ''}` + `${date == 'b' ? ' blank' : ''}`}
						       					onClick={()=> {
						       						set_dateInView({
						       							month: selectedDate.month,
						       							day: daysInWeek[e][index],
						       							year: selectedDate.year,
						       						})
						       						getPostsPerDate(selectedDate.month, daysInWeek[e][index], selectedDate.year);
						       						console.log(selectedDate.month + '. ' +daysInWeek[e][index] + '. '  +selectedDate.year);
						       					}}>

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
						       })}
						   </div>
				})}
			</div>
		</div>

		return calendar;
	}
	let calendar = drawCalendar()


	/*
		Element Class Names via State
	*/
	
	let	[nextClass, set_nextClass] = React.useState(''),
		[nextMonth, set_nextMonth] = React.useState(''), 
		[prevClass, set_prevClass] = React.useState(''),
		[prevMonth, set_prevMonth] = React.useState(''),
		[currentClass, set_currentClass] = React.useState(''),
		[currentMonth, set_currentMonth] = React.useState(cal.monthsAbrv[kongetsu]),
		[currentYear, set_currentYear] = React.useState(kotoshi),
		[yearClass, set_yearClass] = React.useState(''),
		noHeading = true;


	let forwardMonth = () => {

		set_nextClass('nextStart');
		set_prevClass('off');

		if(selectedDate.month + 1 > 11) {
			setTimeout(() => {
				set_yearClass('off');
			}, 200)
			setTimeout(() => {
				set_yearClass('');
			}, 1200)
		}
		set_currentClass('off');

		/*Initiate calendar leaving animation*/
		set_calClass('leave');

		setTimeout(() => {
			if(selectedDate.month + 1 > 11) {
				set_SelectedDate({
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
					set_SelectedDate({
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
				set_SelectedDate({
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
			set_nextClass('nextEnd');
			set_prevClass('')
		}, 1300)
	}

	let backwardMonth = () => {

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
				set_SelectedDate({
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

				set_SelectedDate({
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
				set_SelectedDate({
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
			set_prevMonth(cal.monthsAbrv[kongetsu - 1])
		} 

		if (selectedDate.month + 1 > 11) {
			set_nextMonth(cal.monthsAbrv[0])
		} else if (selectedDate.month + 1 == 11) {
			set_nextMonth(cal.monthsAbrv[11]);
		} else {
			set_nextMonth(cal.monthsAbrv[kongetsu + 1])
		}
	}, [])

	console.log(postsPerDate)

	return (

		<div id="monthChart">

			<div id="header">
				
				<span id="prev" className={prevClass} onClick={ async()=> {
					if(selectedDate.month - 1 < 0) {
						await getTallyPerDate('11', selectedDate.year - 1);
						console.log('one one')
					} else if (cal.sMonth - 1 == 0) {
						await getTallyPerDate('0', selectedDate.year);
						console.log('one two')
					} else {
						await getTallyPerDate(selectedDate.month - 1, selectedDate.year)
						console.log('one three')
					}
					backwardMonth();
				}}>{prevMonth}</span>

				<span id="current" className={currentClass} onClick={()=> {}}>{currentMonth}</span>

				<span id="year" className={yearClass} onClick={()=> {}}>{selectedDate.year}</span>

				<span id="next" className={nextClass} onClick={	async()=> {
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
					forwardMonth();
				}}>{nextMonth}</span>
			</div>

			{calendar}

			
				<Log data={postsPerDate} noHeading={noHeading} />
			
			

		</div>

	)

}







