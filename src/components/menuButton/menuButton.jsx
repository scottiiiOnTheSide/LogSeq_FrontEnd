
import React from 'react';
import './menuButton.css';

export default function MenuButton({toggleMainMenu}) {

	return (
		<div id="buttonWrapper_userMenu">
			<button id="menuToggle" onClick={toggleMainMenu}>Menu</button>
		</div>
	)
}