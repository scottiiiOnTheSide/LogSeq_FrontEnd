
import React from 'react';
import './menuButton.css';

export default function MenuButton({toggleMainMenu, headsOrTails}) {

	return (
		<div id="buttonWrapper_userMenu">
			{headsOrTails &&
				<button id="menuToggle" onClick={toggleMainMenu}>Menu</button>
			}
			{!headsOrTails &&
				<ul id='altMenu'>
					<li>
						<button>Interactions</button>
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