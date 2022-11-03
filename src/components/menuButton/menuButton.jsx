
import React from 'react';
import './menuButton.css';

export default function MenuButton({toggleMainMenu, headsOrTails, toggleNotifList, monthChart, toggleMonthChart, calendar}) {

	let cal = calendar;

	return (
		<div id="buttonWrapper_userMenu">
			{headsOrTails &&
				<button id="menuToggle" onClick={toggleMainMenu}>Menu</button>
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
			
			<button id='dayMonthToggle' onClick={toggleMonthChart}>
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