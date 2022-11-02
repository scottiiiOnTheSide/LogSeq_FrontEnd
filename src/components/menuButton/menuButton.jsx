
import React from 'react';
import './menuButton.css';

export default function MenuButton({toggleMainMenu, headsOrTails, toggleNotifList, monthChart, toggleMonthChart}) {

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
			
			<button id='DayMonthToggle' onClick={toggleMonthChart}>
				{!monthChart &&
					<div id="Day">
						<p>Day</p>
						<span>{}</span><span>/</span><span>{}</span>
					</div>
				}
				{monthChart &&
					<div id="Month">
						<p>Month</p>
						<span>{}</span><span>/</span><span>{}</span>
					</div>
				}
			</button> 

		</div>
	)
}