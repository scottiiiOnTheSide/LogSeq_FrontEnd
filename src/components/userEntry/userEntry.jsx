
//06. 18. 2022
//Intention for this component is for it to switch between a user signup form and login 
//in form depending on the button pressed

import React, { useReducer, useState } from 'react';
import './userEntry.css';

const formReducer = (state, event) => {
		return {
			...state,
			[event.name]: event.value
		}
	}

function UserSignUp() {

	//is placeholder function for now, will wait till response is given from API
	const [formData, setFormData] = useReducer(formReducer, {});
	const [submitting, setSubmission] = useState(false);
	const handleSubmit = (event) => {
		event.preventDefault();
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
	return fetch('http://192.168.1.8:3333/users/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify(loginCredentials)
	}).then(data => data.json());
}

function UserLogIn({set_isLoggedIn}) {

	// const [loginCredentials, set_loginCredentials] = useState({});
	const [formData, setFormData] = useReducer(formReducer, {});
	const [submitting, setSubmission] = useState(false);
	const handleSubmit = async (event) => {
		event.preventDefault();

		// set_loginCredentials({
		// 	...loginCredentials,
		// 	emailAddr: formData.emailAddr,
		// 	password: formData.password
		// })

		let loginCredentials = {
			emailAddr: formData.emailAddr,
			password: formData.password
		}

		console.log(loginCredentials);
		const loggedIn = await loginUser({
			emailAddr: formData.emailAddr,
			password: formData.password
		});

		//when top level app.js reads this variable has data,
		//userEntry.js will unmount and home components mount
		set_isLoggedIn(loggedIn);

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


	return (
		<form onSubmit={handleSubmit}>
			<fieldset>
				<input name="emailAddr" placeholder="Your Email Address" 
					onChange={handleChange}/>
				<input name="password" placeholder="Your Password" onChange={handleChange}/>
			</fieldset>
			<button type="submit">Submit</button>
			{/*{submitting &&
				<p>Submitting...</p>
				//put this in button to change text during submission
			}*/}
		</form>
	)
}

export default function UserEntry({login, set_isLoggedIn}) {

	//upon successful login, setLogin to unmount component

	const [userSignUp, userSignUp_set] = useReducer(state => !state, false);
	const [userLogIn, userLogIn_set] = useReducer(state => !state, false);

	return (
		<div id="userEntry">

			<div id="buttonWrapper">
				<button onClick={userSignUp_set}>Sign Up</button>
				<button onClick={userLogIn_set}>Log In</button>
			</div>

			{userSignUp &&
				<UserSignUp />
			}
			{userLogIn &&
				<UserLogIn set_isLoggedIn={set_isLoggedIn}/>
			}

		</div>
	)
}

