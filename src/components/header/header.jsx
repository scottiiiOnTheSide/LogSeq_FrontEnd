import React, {useState, useReducer} from 'react';
import './header.css';

//Multi purpose header element that changes styles depending on which part of 
//site is currently active 

function Login() {
	return (
		<div>
			<h1 id="login">
				Chronological
				<br/>
				Sequence
			</h1>
		</div>
	)
}

function Home({calendar}) {

	//function to change Day from 'today' to weekday name
	//when no longer looking at current posts
	// console.log(month)

	return (
		<div>
			<h2>Today</h2>
			<h2>
				<span id="month">{calendar['currentMonth']}</span>
				<span id="date">{calendar['currentDate']}</span> 
				<span id="year">{calendar['currentYear']}</span>
			</h2>
		</div>
	)
}


//need to have overaching 'state management' that tells component
//when certain section is active, thus setting corresponding header component
//to be active
export default function header({loggedIn, home, calendar}) {
	return (
		<header>
			{!loggedIn &&
				<Login />
			}

			{(loggedIn || home) &&
				<Home calendar={calendar}/>
			}
		</header>
	)
}