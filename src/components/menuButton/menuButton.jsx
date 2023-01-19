
import React, {useState, useEffect} from 'react';
import './menuButton.css';

export default function MenuButton(
	{menu, set_menu, menuSide, set_menuSide, notif, set_notif, monthChart, set_monthChart, calendar, setCalendar, logStates, userSide, socialSide, isReading, set_isReading, closePost}) {

	let cal = calendar;
	let [buttonText, setButtonText] = useState('');

	useEffect(() => {
		/* 12. 31. 2022
			With CSS addition, text and monthChart Toggle should fade and reappear
		*/
		if(menu) {
			setButtonText('Close')
		} 
		if(!menu && socialSide) {
			setButtonText('Connections')
		} else if(!menu & !socialSide) {
			setButtonText('ADD POST')
		}
	}, [socialSide, menu, notif, isReading])


	return (
		<div id="buttonWrapper">
			{(menuSide && isReading.postOpen == null) &&
				<>	
					<button id="menuToggle" onClick={set_menu}>{buttonText}</button>

					{!menu &&
						<button id='dayMonthToggle' onClick={() => {
								set_monthChart();

								/* resets the cal._inView values */
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
										<span>{cal.dayOfTheYear} </span>
										<span>/</span>
										<span> {cal.amountOfDays}</span>
									</div>
								}
								{monthChart &&
									<div id="Month">
										<p>Month</p>
										<span>{cal.monthInNum}</span>
										<span>/</span>
										<span>12</span>
									</div>
								}
						</button>
					}
				</>
			}
			{(menuSide && isReading.postOpen == true) &&
				<ul id="postOptions">
					<li>
						<button onClick={closePost}>Exit</button>
					</li>
					<li>
						<button>Options</button>
					</li>
				</ul>
			}
			{!menuSide &&
				<ul id='altMenu'>
					<li>
						<button onClick={()=> {set_notif()}}>Interactions</button>
						<span id="notifCount"></span>
					</li>
					<li>
						<button>Log Out</button>
					</li>
				</ul>
			}
		</div>
	)
}