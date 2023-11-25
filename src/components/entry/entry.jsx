
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


function UserSignUp({accessapi, setSignup, setLogin, signup, transition}) {

	/**
	 * 09. 17. 2023
	 * Provides user sign up form
	 * On successful submission, notifies user of success
	 * afterwards, user sign in component appears
	 */
	const [formData, setFormData] = React.useReducer(formReducer, {});
	const [isReady, setIsReady] = React.useReducer(state => !state, false);

	const handleSubmit = async (event) => {

		event.preventDefault();

		event.preventDefault();

		if(!isReady) {
			return;
		} else {
			await accessapi.signUpUser({
				firstName: formData.firstName,
				lastName: formData.lastName,
				emailAddr: formData.emailAddr,
				userName: formData.userName,
				password: formData.password
			}).then(data => {

				if(data == true) {
					
					setSignup();
					let delay = setTimeout(()=> {
						transition();
					}, 500)

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
	}

	const handleChange = (event) => {
		setFormData({
			name: event.target.name,
			value: event.target.value
		})
	}

	let form = React.useRef();
	let thisForm = form.current;
	React.useEffect(()=> {
		if(thisForm) {
			if(signup == false) {
				thisForm.classList.remove('_active');
				thisForm.classList.add('_nonActive');

				let delay = setTimeout(()=> {
					thisForm.style.display = 'none';
				}, 550)
			}
			if(signup == true) {
				thisForm.style.display = 'block';
				thisForm.classList.add('_active');
			}	
		}
	}, [signup, form])

	// className={signup == true ? 'active' : 'nonActive'}
	return (
		<form id="signin" onSubmit={handleSubmit} ref={form} onBlur={()=> {
			let check = true;
			if(!formData.firstName || formData.emailAddr.length <= 0) {
				check = false;
			} if(!formData.lastName || formData.lastName.length <= 0) {
				check = false;
			} if(!formData.emailAddr || formData.emailAddr.length <= 0) {
				check = false;
			} if(!formData.userName || formData.userName.length <= 0) {
				check = false;
			} if(!formData.password || formData.password.length <= 0) {
				check = false;
			}

			if(check == true) {
				setIsReady();
			}
		}}>
			<fieldset>
				<input name="firstName" placeholder="First Name" onChange={handleChange} />
				<input name="lastName" placeholder="Last Name" onChange={handleChange} />
				<input name="emailAddr" placeholder="Email Address" onChange={handleChange} />
				<input name="userName" placeholder="Your Username" onChange={handleChange} />
				<input name="password" placeholder="Create a Password" onChange={handleChange} />
			</fieldset>
			<button id="signin"type="submit" className={isReady == true ? 'canUse' : 'cantUse'}>Sign Up</button>
			<button id="switch" className="switch" onClick={()=> {
				setSignup();
				let delay = setTimeout(()=> {
					setLogin();
				}, 500)
			}}>Log In</button>

			<div id="transition"></div>
		</form>
	)
}




function UserLogIn({accessapi, setUserID, logingIn, setLogingIn, setSignup}) {

	/**
	 * 09. 17. 2023
	 * Signs in user and returns necessary auth token for backend and userID
	 */

	const [formData, setFormData] = React.useReducer(formReducer, {});
	const [isReady, setIsReady] = React.useReducer(state => !state, false);
	const { login }  = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if(!isReady) {
			return;
		} else {
			let user = await login({
				emailAddr: formData.emailAddr,
				password: formData.password
			}).then(()=> {
				navigate('/home');
			})
		}		
	}

	const handleChange = (event) => {
		setFormData({
			name: event.target.name,
			value: event.target.value
		})
	}

	let form = React.useRef();
	let thisForm = form.current;
	React.useEffect(()=> {
		if(thisForm) {
			if(logingIn == false) {
				thisForm.classList.remove('_active');
				thisForm.classList.add('_nonActive');

				let delay = setTimeout(()=> {
					thisForm.style.display = 'none';
				}, 550)
			}
			if(logingIn == true) {
				thisForm.style.display = 'block';
				thisForm.classList.add('_active');
			}	
		}
	}, [logingIn, form])

	return (
		<form id="login" onSubmit={handleSubmit} ref={form} onBlur={()=> {
			let check = true;
			if(!formData.emailAddr || formData.emailAddr.length <= 0) {
				check = false;
			} if(!formData.password || formData.password.length <= 0) {
				check = false;
			}

			if(check == true) {
				setIsReady();
			}
		}}>
			<fieldset>
				<input name="emailAddr" placeholder="Email Address" onChange={handleChange} />
				<input name="password" placeholder="Password" onChange={handleChange} />
			</fieldset>
			<button id="login" type="submit" className={isReady == true ? 'canUse' : 'cantUse'}>Log In</button>
			<button id="switch" onClick={()=> {
				setLogingIn();
				let delay = setTimeout(()=> {
					setSignup();
				}, 300);
			}}>Sign Up</button>
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
	const [signUpSuccess, setSignUpSuccess] = React.useReducer(state => !state, false);

	let transition = () => {
		setSignUpSuccess();

		let first = setTimeout(()=> {
			setSignUpSuccess();
		}, 3100)

		let second = setTimeout(()=> {
			setLogin();
		}, 3100)
	}

	const initialChoice = React.useRef()
	return (
		<section id="entry">

			<div id="titleWrapper">
				<h1>Welcome to</h1>
				<h1><span>Sync</span>hronized</h1>
				<h1><span>Seq</span>uences</h1>
				<h1 id="xyz"><span>.xyz</span></h1>
			</div>

			<UserSignUp accessapi={accessapi} signup={signup} setSignup={setSignup} setLogin={setLogin} transition={transition}/>

			{signUpSuccess &&
				<div id="transition">
					<div id="first">
						<p>Sign Up Successful !</p>
					</div>

					<div id="second">
						<p>Now, Please Sign In</p>
					</div>
				</div>
			}
			

			<UserLogIn accessapi={accessapi} setUserID={setUserID} logingIn={login} setLogingIn={setLogin} setSignup={setSignup}/>

			<div id="loginOrSignup" ref={initialChoice}>

				<button onClick={(e)=>{
					e.preventDefault(); 
					setSignup();

					let initialChoiceElement = initialChoice.current;
					initialChoiceElement.style.opacity = 0;
					let delay = setTimeout(()=> {
						initialChoiceElement.style.display = 'none';
					}, 550)
				}}>Sign Up</button>

				<button onClick={(e)=>{
					e.preventDefault(); 
					setLogin();

					let initialChoiceElement = initialChoice.current;
					initialChoiceElement.style.opacity = 0;
					let delay = setTimeout(()=> {
						initialChoiceElement.style.display = 'none';
					}, 550)
				}}>Log In</button>

			</div>				
		</section>
	)
}
