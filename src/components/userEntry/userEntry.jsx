//06. 18. 2022
//Intention for this component is for it to switch between a user signup form and login 
//in form depending on the button pressed

import React, { useReducer, useState, useEffect, useRef } from 'react';
import './userEntry.css';

const formReducer = (state, event) => {
		return {
			...state,
			[event.name]: event.value
		}
	}

async function signupUser(loginCredentials) {
	return fetch('http://192.168.1.12:3333/users/newuser', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(loginCredentials)
	}).then(data => data.json());
}

/**
 * First Component 
 * */
function UserSignUp({userSignUp_set, userLogIn_set, confirmSignUp_set}) {

	//is placeholder function for now, will wait till response is given from API
	const [formData, setFormData] = useReducer(formReducer, {});
	const [submitting, setSubmission] = useState(false);
	const [isSignedUp, isSignedUp_set] = useState(false);
	const [signUpSuccess, signUpSuccess_set] = useState(false);
	const [isSwitched, isSwitched_set] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		//setSubmission(true);

		let signedUp = await signupUser({
			firstName: formData.firstName,
			lastName: formData.lastName,
			emailAddr: formData.emailAddr,
			userName: formData.userName,
			password: formData.password
		})

		console.log(signedUp);
		isSignedUp_set(signedUp);
		// signUpSuccess_set(true);

		// sessionStorage.setItem('userStatus', 'online');
	}
	//a component internal function for getting the specific data, 
	//to then pass to the higher level function
	const handleChange = (event) => {
		setFormData({
			name: event.target.name,
			value: event.target.value
		})
	}

	useEffect(() => {
		if(signUpSuccess) {
			console.log("before first");

			let first = setTimeout(() => {
				userSignUp_set(false)
			}, 100);
			let second = setTimeout(() => {
				confirmSignUp_set(true)
			}, 300);
			let third = setTimeout(() => {
				confirmSignUp_set(false)
			}, 1000);
			let last = setTimeout(() => {
				userLogIn_set(true)
			}, 1300);
		}
	}, [isSignedUp]);

	const onSwitch = () => {
		const first = setTimeout(()=> {
			userSignUp_set(false)
		}, 100);
		const second = setTimeout(()=> {
			userLogIn_set(true)
		}, 1000);
	}

	return (
		<form onSubmit={handleSubmit}>
			<fieldset> {/*disabled={submitting} //will disable forms while 'submitting' is true*/}
				<input name="firstName" placeholder="First Name" 
				  onChange={handleChange} value={formData.firstName || ''}/>
				<input name="lastName" placeholder="Last Name" onChange={handleChange}/>
				<input name="emailAddr" placeholder="Email Address" onChange={handleChange}/>
				<input name="userName" placeholder="Choose a User Name" onChange={handleChange}/>
				<input name="password" placeholder="Create a Password" onChange={handleChange}/>
			</fieldset>
			<button type="submit">Submit</button>
			<button id="switch" onClick={(e)=> {onSwitch(); e.preventDefault();}}>Log In</button>
			{/*{submitting &&
				<p>Submitting...</p>
				//put this in button to change text during submission

				//getting / organizing data function
				Object.entries(formData).map(([name, value])
			}*/}
		</form>
	)
}

//when this is run, set data to state variable that is passed up to App.js
// once data is recieved, set login to false, so userEntry can unmount
async function loginUser(loginCredentials) {
	return fetch('http://192.168.1.12:3333/users/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(loginCredentials)
	}).then(data => data.json());
}

/**
 * Second Component 
 * */
function UserLogIn({userSignUp_set, userLogIn_set, set_isLoggedIn, loggedIn_set}) {

	// const [loginCredentials, set_loginCredentials] = useState({});
	const [formData, setFormData] = useReducer(formReducer, {});
	const [submitting, setSubmission] = useState(false);
	const [isSwitched, isSwitched_set] = useReducer(state => !state, false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		let loggedIn = await loginUser({
			emailAddr: formData.emailAddr,
			password: formData.password
		});
		// 07. 03. 2022 returns user auth token to be kept in sessionStorage, downTheLine
		loggedIn = JSON.stringify(loggedIn);
		console.log(loggedIn);
		//when top level app.js reads this variable has data,
		//userEntry.js will unmount and home components mount
		set_isLoggedIn(loggedIn);
		loggedIn_set(true);
		
		//Not necessary to have them both

		//setSubmission(true);
	}
	//a component internal function for getting the specific data, 
	//to then pass to the higher level function
	const handleChange = (event) => {
		setFormData({
			name: event.target.name,
			value: event.target.value
		})
	}

	const onSwitch = () => {
		const first = setTimeout(()=> {
			userLogIn_set(false)
		}, 100);
		const second = setTimeout(()=> {
			userSignUp_set(true)
		}, 1000);
	}

	return (
		<form onSubmit={handleSubmit}>
			<fieldset>
				<input name="emailAddr" placeholder="Your Email Address" 
					onChange={handleChange}/>
				<input name="password" placeholder="Your Password" onChange={handleChange}/>
			</fieldset>
			<button type="submit">Submit</button>
			<button id="switch" onClick={(e)=> {onSwitch(); e.preventDefault();}}>Sign Up</button>
			{/*{submitting &&
				<p>Submitting...</p>
				//put this in button to change text during submission
			}*/}
		</form>
	)
}

export default function UserEntry({login, set_isLoggedIn, userState_set, loggedIn_set}) {

	//upon successful login, setLogin to unmount component

	const [userSignUp, userSignUp_set] = useReducer(state => !state, false);
	const [userLogIn, userLogIn_set] = useReducer(state => !state, false);
	const [confirmSignUp, confirmSignUp_set] = useReducer(state => !state, false);
	const [selected, setSelected] = useReducer(state => !state, false);

	useEffect(()=> {
		if(selected) {
			let buttons = Array.from(document.getElementsByClassName("initial"));
			buttons.forEach((element)=> {
				element.style.display = 'none';
			})
		}
	})

	return (
		<div id="userEntry">

			<div id="buttonWrapper">
				<button className="initial" 
					onClick={()=> {userSignUp_set(); setSelected(true);}}>
					Sign Up
				</button>
				<button className="initial" 
					onClick={()=> {userLogIn_set(); setSelected(true);}}>
					Log In
				</button>
			</div>

			{userSignUp &&
				<UserSignUp 
					userSignUp_set={userSignUp_set} 
					userLogIn_set={userLogIn_set}
					confirmSignUp_set={confirmSignUp_set}/>
			}
			{confirmSignUp &&
				<div id="confirmSignUp">
					<p>Account Created!
					<br/>
					Now please log in</p>
				</div>
			}
			{userLogIn &&
				<UserLogIn 
					set_isLoggedIn={set_isLoggedIn}
					userSignUp_set={userSignUp_set} 
					userLogIn_set={userLogIn_set}
					loggedIn_set={loggedIn_set}/>
			}
		</div>
	)
}

