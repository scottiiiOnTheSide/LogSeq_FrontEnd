
import React from 'react';
import './menuButton.css';

export default function MenuButton({toggleMainMenu}) {

	return (
		<div id="buttonWrapper">
			<button id="menuToggle" onClick={toggleMainMenu}>Menu</button>
		</div>
	)
}