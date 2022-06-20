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

function Home() {
	let calendar = new Date();
	let date = calendar.getDate();
	//function to return either th, nd, rd with number
	let dateED = (date) => {

	}
	let mon = calendar.getMonth();
	let month = (mon) => {
		let months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"November",
			"December"
		]
		return months[mon];
	}
	let year = calendar.getFullYear();

	//function to change Day from 'today' to weekday name
	//when no longer looking at current posts

	return (
		<div>
			<h2>Today</h2>
			<h2>
				<span id="month">{month}</span>
				<span id="date">{dateED}</span> 
				<span id="year">{year}</span>
			</h2>
		</div>
	)
}


//need to have overaching 'state management' that tells component
//when certain section is active, thus setting corresponding header component
//to be active
export default function header({login, home}) {
	return (
		<header>
			{login &&
				<Login />
			}

			{home &&
				<Home />
			}
		</header>
	)
}