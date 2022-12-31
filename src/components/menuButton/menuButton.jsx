
import React, {useState, useEffect} from 'react';
import './menuButton.css';

export default function MenuButton(
	{mainMenu, toggleMainMenu, headsOrTails, toggleNotifList, monthChart, toggleMonthChart, calendar, setCalendar, logStates, socialSide}) {

	let cal = calendar;
	let [buttonText, setButtonText] = useState('');

	useEffect(() => {

		/* 12. 31. 2022
			With CSS addition, text and monthChart Toggle should fade and reappear
		*/
		if(mainMenu) {
			setButtonText('Close')
		}
		if(!mainMenu && socialSide) {
			setButtonText('Connections')
		} else if(!mainMenu & !socialSide) {
			setButtonText('Add Post')
		}
	}, [socialSide, mainMenu])
	

	return (
		<div id="buttonWrapper_userMenu">
			{headsOrTails &&

				<button id="menuToggle" onClick={toggleMainMenu}>{buttonText}</button>
			}
			{!headsOrTails &&
				<ul id='altMenu'>
					<li>
						<button onClick={toggleNotifList}>Interactions</button>
						<span id="notifCount"></span>
					</li>
					<li>
						<button>Log Out</button>
					</li>
				</ul>
			}
			
			<button id='dayMonthToggle' onClick={() => {
				toggleMonthChart()
				if(calendar.date_inView) {
					setCalendar({
						...calendar,
						year_inView: null,
    					month_inView: null,
    					date_inView: null
					})
				}
			}}>
				{!monthChart &&
					<div id="Day">
						<p>Day</p>
						<span>{cal.dayOfTheYear} </span><span>/</span><span> {cal.amountOfDays}</span>
					</div>
				}
				{monthChart &&
					<div id="Month">
						<p>Month</p>
						<span>{cal.monthInNum} </span><span>/</span><span> 12</span>
					</div>
				}
			</button> 

		</div>
	)
}