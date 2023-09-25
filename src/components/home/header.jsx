/* * * V i t a l s * * */
import * as React from 'react';

export default function Header ({cal}) {

	/**
	 * 09. 18. 2023
	 * Within Short Term, <header> component houses
	 * - interactionsList Toggle
	 * - unread notif count
	 */

	return (
		<header>
			
			<div id="thePresent">
				<h1>Today</h1>
				<span>{cal.currentMonth}</span>
				<span>{cal.currentDate},</span>
				<span>{cal.currentYear}</span>
			</div>

			<button id="interactionsToggle">
				<p>2</p> 
				<span></span>
				<span></span>
				<span></span>
			</button>

		</header>
	)
}