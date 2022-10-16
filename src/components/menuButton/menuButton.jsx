
import React from 'react';
import './menuButton.css';

export default function MenuButton({toggleMainMenu, headsOrTails, toggleNotifList}) {

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
		</div>
	)
}