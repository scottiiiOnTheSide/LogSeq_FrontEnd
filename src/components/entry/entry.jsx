
import * as React from "react";
import { useNavigate } from "react-router-dom";
import APIaccess from '../../apiaccess';
import useAuth from '../../useAuth';

import '../../index.css';
import './entry.css';

// let { useAuth } = useAuth();

/* helps organize formData */
const formReducer = (state, event) => {
	return {
		...state,
		[event.name]: event.value
	}
}


function UserSignUp({accessapi, setSignup, setLogin}) {

	/**
	 * 09. 17. 2023
	 * Provides user sign up form
	 * On successful submission, notifies user of success
	 * afterwards, user sign in component appears
	 */
	const [formData, setFormData] = React.useReducer(formReducer, {});
	const [isReady, setIsReady] = React.useReducer(state => !state, true);

	const handleSubmit = async (event) => {

		event.preventDefault();

		await accessapi.signUpUser({
			firstName: formData.firstName,
			lastName: formData.lastName,
			emailAddr: formData.emailAddr,
			userName: formData.userName,
			password: formData.password
		}).then(data => {
			if(data == true) {

				//could probably initate sequence to change forms here

			} else {
				/**
				 * 09. 17. 2023
				 * would relay error message into notifPopUp function
				 * and then highlight the field in question
				 */
				console.log('login failed')
			}	
		})
	}

	const handleChange = (event) => {
		setFormData({
			name: event.target.name,
			value: event.target.value
		})
	}

	return (
		<form onSubmit={handleSubmit}>
			<fieldset>
				<input name="firstName" placeholder="First Name" onChange={handleChange} />
				<input name="lastName" placeholder="Last Name" onChange={handleChange} />
				<input name="emailAddr" placeholder="Email Address" onChange={handleChange} />
				<input name="userName" placeholder="Your Username" onChange={handleChange} />
				<input name="password" placeholder="Create a Password" onChange={handleChange} />
			</fieldset>
			<button type="submit" className={isReady == true ? 'canUse' : 'cantUse'}>Sign Up</button>
			<button className="switch">Log In</button>
		</form>
	)
}



// Sends user to HOME on successful log in
function UserLogIn({accessapi, setUserID}) {

	/**
	 * 09. 17. 2023
	 * Signs in user and returns necessary auth token for backend and userID
	 */

	const [formData, setFormData] = React.useReducer(formReducer, {});
	const [isReady, setIsReady] = React.useReducer(state => !state, true);
	const { login }  = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		let user = await login({
			emailAddr: formData.emailAddr,
			password: formData.password
		})

		// setUserID(user.userID);
		navigate('/home');
	}

	const handleChange = (event) => {
		setFormData({
			name: event.target.name,
			value: event.target.value
		})
	}



	return (
		<form onSubmit={handleSubmit}>
			<fieldset>
				<input name="emailAddr" placeholder="Email Address" onChange={handleChange} />
				<input name="password" placeholder="password" onChange={handleChange} />
			</fieldset>
			<button type="submit" className={isReady == true ? 'canUse' : 'cantUse'}>Log In</button>
			<button className="switch">Sign Up</button>
		</form>
	)
}





export default function Entry({accessapi, useAuth, setUserID}) {

	/**
	 * 09. 17. 2023
	 * Main component / page: 
	 * Houses both forms and confirmation element
	 */

	const [signup, setSignup] = React.useReducer(state => !state, false);
	const [login, setLogin] = React.useReducer(state => !state, false);


	return (
		<section id="entry">
			<h1 className="title">Welcome to</h1>
			<h1 className="title"><span>Sync</span>hronized</h1>
			<h1 className="title"><span>Seq</span>uences</h1>
			<h1 className="title">.xyz</h1>

			{signup &&
				<UserSignUp accessapi={accessapi}/>
			}
			{login &&
				<UserLogIn accessapi={accessapi} setUserID={setUserID} />
			}

			<div id="loginOrsignup">
				<button onClick={(e)=>{e.preventDefault(); setSignup()}}>Sign Up</button>
				<button onClick={(e)=>{e.preventDefault(); setLogin()}}>Log In</button>
			</div>				
		</section>
	)
}
