
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


function UserSignUp({accessapi, setSignup, setLogin, signup, transition, setPopUp}) {

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

			/*
				check that all inputs have value
			*/
			let inputs = Array.from(thisForm.children[0].children);
			let check = 0;

			inputs.forEach(input => {
				if(input.value != '') {
					check++;
				}
			})

			if(check != 5) {
				setPopUp({
					active: true,
					message: 'Please fill in all fields'
				})
			} else {

				let request = await accessapi.signUpUser({
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
						setPopUp({
							active: true,
							message: data
						})
						console.log('login failed');
					}	
				})

			}
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

	/*
		check whether all inputs have value before making submit button active
	*/
	React.useEffect(()=> {

		if(thisForm) {
			let inputs = Array.from(thisForm.children[0].children);
			let check = 0;

			inputs.forEach(input => {
				if(input.value != '') {
					check++;
				}
			})

			if(check == 5) {
				if(!isReady) {
					setIsReady();
				}
			}
		}
	}, [formData])

	
	return (
		<form id="signin" onSubmit={handleSubmit} ref={form}>
			<fieldset>
				<input name="firstName" placeholder="First Name" onChange={handleChange} />
				<input name="lastName" placeholder="Last Name" onChange={handleChange} />
				<input name="emailAddr" placeholder="Email Address" onChange={handleChange} />
				<input name="userName" placeholder="Your Username" onChange={handleChange} />
				<input name="password" placeholder="Create a Password" onChange={handleChange} />
			</fieldset>
			<button id="signin"type="submit" className={isReady == true ? 'canUse' : 'cantUse'}>Sign Up</button>
			<button id="switch" className="switch" onClick={(e)=> {
				e.preventDefault();
				setSignup();
				let delay = setTimeout(()=> {
					setLogin();
				}, 500)
			}}>Log In</button>

			<div id="transition"></div>
		</form>
	)
}




function UserLogIn({accessapi, setUserID, logingIn, setLogingIn, setSignup, setPopUp, exitSequence}) {

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

			let inputs = Array.from(thisForm.children[0].children);
			let check = 0;

			inputs.forEach(input => {
				if(input.value != '') {
					check++;
				}
			})

			if(check != 2) {
				setPopUp({
					active: true,
					message: 'Please fill in all fields'
				})
			} else {

				let user = await login({
					emailAddr: formData.emailAddr,
					password: formData.password
				});

				if(user == true) {
					exitSequence();
				} else {
					console.log(user);
					setPopUp({
						active: true,
						message: user
					})
				}

			}	
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

	/*
		check whether all inputs have value before making submit button active
	*/
	React.useEffect(()=> {

		if(thisForm) {
			let inputs = Array.from(thisForm.children[0].children);
			let check = 0;

			inputs.forEach(input => {
				if(input.value != '') {
					check++;
				}
			})

			if(check == 2) {
				if(!isReady) {
					setIsReady();
				}
			}
		}
	}, [formData])

	return (
		<form id="login" onSubmit={handleSubmit} ref={form}>
			<fieldset>
				<input name="emailAddr" placeholder="Email Address" onChange={handleChange} />
				<input name="password" placeholder="Password" onChange={handleChange} />
			</fieldset>
			<button id="login" type="submit" className={isReady == true ? 'canUse' : 'cantUse'}>Log In</button>
			<button id="switch" onClick={(e)=> {
				e.preventDefault()
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
	const [popUp, setPopUp] = React.useState({
		active: false,
		message: null
	})
	const navigate = useNavigate();

	let transition = () => {
		setSignUpSuccess();

		let first = setTimeout(()=> {
			setSignUpSuccess();
		}, 3100)

		let second = setTimeout(()=> {
			setLogin();
		}, 3100)
	}

	let exitSequence = () => {
		setEnter()
		let delay = setTimeout(()=> {
			navigate('/home');
		}, 550)
	}

	const [enter, setEnter] = React.useReducer(state => !state, false);
	const initialChoice = React.useRef()
	const el = React.useRef();

	return (
		<section id="entry" ref={el} className={`${enter == true ? '_enter' : ''}`}>
							
			<div id="titleWrapper">
				<h1>Welcome to</h1>
				<h1><span>Sync</span>hronized</h1>
				<h1><span>Seq</span>uences</h1>
				<h1 id="xyz"><span>.xyz</span></h1>
			</div>

			<UserSignUp accessapi={accessapi} 
						signup={signup} 
						setSignup={setSignup} 
						setLogin={setLogin} 
						transition={transition}
						setPopUp={setPopUp}/>

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
			
			<UserLogIn accessapi={accessapi} 
						setUserID={setUserID} 
						logingIn={login} 
						setLogingIn={setLogin} 
						setSignup={setSignup}
						setPopUp={setPopUp}
						exitSequence={exitSequence}/>

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

			{popUp.active &&
				<div id="popUp">
					<p>{popUp.message}</p>
					<button className={"buttonDefault"}onClick={()=> {setPopUp({ active: false, message: null })}}>Close</button>
				</div>
			}

		</section>
	)
}
