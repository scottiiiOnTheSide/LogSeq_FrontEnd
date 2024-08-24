
import * as React from "react";
import { useNavigate } from "react-router-dom";
import APIaccess from '../../apiaccess';
import useUIC from '../../UIcontext';

import '../../index.css';
import './entry.css';

const accessAPI = APIaccess();

/* helps organize formData */
const formReducer = (state, event) => {
	return {
		...state,
		[event.name]: event.value
	}
}


function UserSignUp({
	setSignup,  
	signup, 
	transition, 
	setPopUp,
	signupIsReady, 
	setSignupIsReady,
	isSignUpReady,
	setIsSignUpReady,
	formData, 
	setFormData,
	signupSubmit,
	signupSequence,
	setSignupSequence,
	privacyOption,
	setPrivacyOption,
	profilePhoto,
	setProfilePhoto
}) {

	/**
	 * 09. 17. 2023
	 * Provides user sign up form
	 * On successful submission, notifies user of success
	 * afterwards, user sign in component appears
	 */
	let form = React.useRef();
	let thisForm = form.current;

	const handleChange = (event) => {
		if(event.target.name == 'image') {
			console.log('yes')
			setProfilePhoto(URL.createObjectURL(event.target.files[0]));
		}
		else {
			setFormData({
				name: event.target.name,
				value: event.target.value
			})
		}
		
	}

	/* 
		Animation sequence on mount 
	*/
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
	}, [signup])

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
				if(!signupIsReady) {
					setSignupIsReady();
				}
			}
		}
	}, [formData])


	const [imageButton, setImageButton] = React.useState('Add Photo');
	React.useEffect(()=> {
		if(profilePhoto != undefined) {
			setImageButton('Change Photo');
		}
	}, [profilePhoto])
	
	return (
		<form id="signup" onSubmit={signupSubmit} ref={form} encType='multipart/form-data'>
			{signupSequence == 1 &&
				<fieldset id="signupForm">
					<input name="firstName" placeholder="First Name" onChange={handleChange} />
					<input name="lastName" placeholder="Last Name" onChange={handleChange} />
					<input name="emailAddr" placeholder="Email Address" onChange={handleChange} />
					<input name="userName" placeholder="Your Username" onChange={handleChange} />
					<input name="password" placeholder="Create a Password" onChange={handleChange} />
				</fieldset>
			}
			
			{signupSequence == 2 &&
				<div id="privacyOptions">
					<h2>Adjust Your Privacy Setting</h2>
					<ul id="options">
						<li>
							<button 
								name="privacyOn"
								className={`buttonDefault ${privacyOption == 'On' ? '' : '_inactive'}`} 
								onClick={(e)=> {	
									e.preventDefault()
									setPrivacyOption("On");
								}}>ON</button>	
						</li>
						<li>
							<button 
								name="privacyHalf"
								className={`buttonDefault ${privacyOption == 'Half' ? '' :'_inactive'}`}
								onClick={(e)=> {	
									e.preventDefault()
									setPrivacyOption("Half");
								}}>
								1 / 2</button>	
						</li>
						<li>
							<button 
								name="privacyOff"
										className={`buttonDefault ${privacyOption == 'Off' ? '' :'_inactive'}`}
								onClick={(e)=> {	
									e.preventDefault()
									setPrivacyOption("Off");
								}}>
								OFF</button>	
						</li>
					</ul>

					{privacyOption == 'On' &&
						<p>
							Only Connections see <span>Full name</span>{`\n`}
							Only Connections see <span>Profile Metrics</span>{`\n`}
							No Subscribers{`\n`} 
							All Posts visible only to Connections{`\n`}
							Pinned Posts and Media only visible to Connections
						</p>
					}
					{privacyOption == 'Half' &&
						<p>
							Only Connections see <span>Full name</span>{`\n`}
							Only Connections, Subscribers see <span>Profile Metrics</span>{`\n`}
							Subscribers Can Request{`\n`}
							All Posts visible only to Connections & Subscribers{`\n`}
							Pinned Posts and Media visible to Everyone
						</p>
					}
					{privacyOption == 'Off' &&
						<p>
							Everyone can see <span>Full name</span>{`\n`}
							Everyone can see <span>Profile Metrics</span>{`\n`}
							Subscribers need not Request{`\n`}
							All Posts visible to Everyone{`\n`}
							Pinned Posts and Media visible to Everyone
						</p>
					}
				</div>
			}

			{signupSequence == 3 &&
				<div id="profilePhoto">
					
					<h2>Would you like to add a profile photo?</h2>

					{profilePhoto &&
						<img src={profilePhoto}/>
					}
					<label className="imageAdd" onChange={handleChange} htmlFor="addImage" onClick={()=> {document.getElementById('addImage').click()}}>
						<input hidden
							id='addImage' 
							type="file" 
							accept="image/"
							name='image' 
							hidden />
						{imageButton}
					</label>

				</div>
			}
			
			<div id="transition"></div>
		</form>
	)
}


function UserLogIn({setUserID, logingIn, setLogingIn, setSignup, setPopUp, exitSequence}) {

	/**
	 * 09. 17. 2023
	 * Signs in user and returns necessary auth token for backend and userID
	 */

	const [formData, setFormData] = React.useReducer(formReducer, {});
	const [isReady, setIsReady] = React.useReducer(state => !state, false);
	const { login }  = useUIC();
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


function ReferralPanel({setPopUp, setRefPanel, setSwitchToSignup, setSignup, referee, setReferee}) {

	const [buttonMode, setButtonMode] = React.useState('close');
	const [referralCode, setReferralCode] = React.useState('');
	const [panelStates, setPanelStates] = React.useState({
		panel: '', //_leave or _enter
		classOne: '',
		displayOne: true, //default true
		classTwo: '',
		displayTwo: false //default false
	})

	const handleInput = (event) => {

		if(event.target.name == 'referralCode') {
			setReferralCode(event.target.value)
		}
	}

	const handleButton = () => {

		if(buttonMode == 'close') {

			setPanelStates({
				...panelStates,
				panel: '_leave'
			})

			let delay = setTimeout(()=> {
				setRefPanel()
			}, 350)
		}

		else if(buttonMode == 'enter') {
			submitRefCode();
		}

		else if(buttonMode == 'continue') {

			setSwitchToSignup();
			setPanelStates({
				...panelStates,
				panel: "_leave"
			})

			let secondStep = setTimeout(()=> {
				setRefPanel();
				setSignup();
			}, [1100])
		}
	}

	//contains transition sequence from first panel to second
	const submitRefCode = async() => {

		let request = await accessAPI.submitRefCode(referralCode);

		if(request.username) {
			console.log(request)
			setReferee(request);
			setPanelStates({
				...panelStates,
				panel: '_leave'
			});

			let second = setTimeout(()=> {
				setPanelStates({
					...panelStates,
					displayOne: false,
					displayTwo: true,
					panel: '_return'
				});
				setButtonMode('continue');
			}, 500)
		}
		else if(request.message) {
			setPopUp({
				active: true,
				message: 'This Code is Invalid'
			})
		}
	}


	//Changes buttonMode based on change in referralCode
	React.useEffect(()=> {
		if(referralCode.length == 8) {
			setButtonMode('enter');
		}
		else {
			setButtonMode('close');
		}
	}, [referralCode])

	return (
		<div id="referralPanel" className={`${panelStates.panel}`}>

			{panelStates.displayOne &&
				<div id="firstPanel" className={`${panelStates.classOne}`}>

					<span>i</span>

					<h2>This Project is in Early Development</h2>

					<p>
						In order to ensure that this project grows at a steady rate and maintains a quality of being subtle and low profile, new user sign ups are restricted to invitations only.
					</p>

					<input 
						className={`inputDefault`}
						name="referralCode"
						maxLength="8"
						value={referralCode}
						onChange={handleInput}
						onKeyDown={(e)=> {if(e.key == 'Enter') submitRefCode();}}
						placeholder="Enter Referral Code" />
				</div>
			}
			
			{panelStates.displayTwo &&
				<div id="secondPanel" className={`${panelStates.classTwo}`}>

					<h2>Invited By</h2>

					<img src={referee.profilePic}></img>
					<h3>@{referee.username}</h3>
					<h4>{referee.firstName} {referee.lastName}</h4>
				</div>
			}

			<button className={`buttonDefault ${buttonMode}`} 
					onClick={handleButton}>
				{buttonMode}
			</button>

		</div>
	)

}

/**
 * 09. 17. 2023
 * Main component / page: 
 * Houses both forms and confirmation element
 */
export default function Entry({useAuth, setUserID}) {

	/* For Sign Up */
	const [signup, setSignup] = React.useReducer(state => !state, false);
	const [signupIsReady, setSignupIsReady] = React.useReducer(state => !state, false);
	const [switchToSignup, setSwitchToSignup] = React.useReducer(state => !state, false);
	const [signupSequence, setSignupSequence] = React.useState(1);
	const [signUpSuccess, setSignUpSuccess] = React.useReducer(state => !state, false);
	const [formData, setFormData] = React.useReducer(formReducer, {});
	const [privacyOption, setPrivacyOption] = React.useState('Off');
	const [profilePhoto, setProfilePhoto] = React.useState();
	const [referee, setReferee] = React.useState({
		profilePic: '',
		username: '',
		firstName: '',
		lastName: '',
		_id: ''
	})

	const formValidation = (formData) => {
		const {emailAddr, password, firstName, lastName, userName} = formData;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const nameRegex = /^[a-zA-Z]{2,}$/; // Allows only alphabetic characters, minimum 2 characters
		const usernameRegex = /^[a-zA-Z0-9_]{3,}$/; // Alphanumeric characters and underscores, minimum 3 characters
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one letter and one number

		//validating fields
		const isEmailValid = emailRegex.test(emailAddr);
		const isFirstnameValid = nameRegex.test(firstName);
		const isLastnameValid = nameRegex.test(lastName);
		const isUsernameValid = usernameRegex.test(userName);
		const isPasswordValid = passwordRegex.test(password);

		//arrange invalid fields
		const invalidFields = [];
  		if (!isEmailValid) invalidFields.push("Email");
  		if (!isFirstnameValid) invalidFields.push("First Name");
  		if (!isLastnameValid) invalidFields.push("Last Name");
  		if (!isUsernameValid) invalidFields.push("Username");
  		if (!isPasswordValid) invalidFields.push("Password. It must have a minimum of 8 characters, only letters and numbers");

  		const errorMessage = invalidFields.length > 0 ? `There is an error with ${invalidFields.join(', ')}.` : null;

		return typeof(errorMessage) == 'string' ? errorMessage : true
	}

	const signupSubmit = async() => {

		let logoWrapper = document.getElementById('logoWrapper');
		let signupSuccessButton = document.getElementById('forSignupProcess');

		if(!signupIsReady) {
			return;
		} else {

				// logoWrapper.classList.add('_leave');
				// signupSuccessButton.classList.add('_leave');
				// let delay = setTimeout(()=> {
				// 	transition();
				// }, 500)


				let submission = new FormData();
				submission.append('firstName', formData.firstName);
				submission.append('lastName', formData.lastName);
				submission.append('emailAddr', formData.emailAddr);
				submission.append('userName', formData.userName);
				submission.append('password', formData.password);
				submission.append('privacyOption', privacyOption);
				submission.append('profilePhoto', profilePhoto);
				submission.append('referrer', referee._id);
				submission.append('action', 'create');
				
				console.log(submission);

				let request = await accessAPI.signupUser(submission);

					if(request.confirm == true) {
						// setSignup();
						// let delay = setTimeout(()=> {
						// 	transition();
						// }, 500)
						logoWrapper.classList.add('_leave');
						signupSuccessButton.classList.add('_leave');
						let delay = setTimeout(()=> {
							transition();
						}, 500)

					} else {
						// setPopUp({
						// 	active: true,
						// 	message: data
						// })
						console.log('login failed');
					}	
		}
	}

	const signupSequencer = () => {
		let signupForm = document.getElementById('signupForm');
		let privacyOptions = document.getElementById('privacyOptions');
		let profilePhoto = document.getElementById('profilePhoto');
		

		if(signupIsReady && signupSequence == 1) {

			let validation = formValidation(formData);

			if(validation == true) {
				signupForm.classList.add('_leave');

				let delay = setTimeout(()=> {
					setSignupSequence(2)
				}, 350);
			}
			else {
				setPopUp({
					active: true,
					message: validation
				})
			}
			
		}
		else if(signupSequence == 2) {

			privacyOptions.classList.add('_leave');

			let delay = setTimeout(()=> {
				setSignupSequence(3)
			}, 550);
		}
		else if(signupSequence == 3) {

			profilePhoto.classList.add('_leave');

			let delay = setTimeout(()=> {
				signupSubmit();
			}, 550);
		}
	}


	const [refPanel, setRefPanel] = React.useReducer(state => !state, false);
	const [login, setLogin] = React.useReducer(state => !state, false);
	const [popUp, setPopUp] = React.useState({
		active: false,
		message: null
	});
	const [sequenceButton, setSequenceButton] = React.useState('continue');
	const [sequenceButtonTrigger, setSequenceButtonTrigger] = React.useReducer(state => !state, false);
	const [enter, setEnter] = React.useReducer(state => !state, false);
	const initialChoice = React.useRef()
	const el = React.useRef();
	const navigate = useNavigate();

	let transition = () => {
		setSignUpSuccess();

		let first = setTimeout(()=> {
			setSignUpSuccess();
		}, 3100)

		// let second = setTimeout(()=> {
		// 	setLogin();
		// }, 3100)
	}

	let exitSequence = () => {
		setEnter()
		let delay = setTimeout(()=> {
			navigate('/home');
		}, 550)
	}

	return (
		<section id="entry" ref={el} className={`${enter == true ? '_enter' : ''}
												 ${refPanel == true ? 'panelOpen' : ''}`}>
							
			{!signup && 
				<div id="titleWrapper" className={`${switchToSignup ? '_leave' : ''}`}>
					<h1>Welcome to</h1>
					<h1><span>Sync</span>hronized</h1>
					<h1><span>Seq</span>uences</h1>
					<h1 id="xyz"><span>.xyz</span></h1>
				</div>
			}

			{signup &&
				<div id="logoWrapper">
					<h1>ss.xyz</h1>
				</div>
			}

			{refPanel &&
				<ReferralPanel 
							setPopUp={setPopUp}
							setRefPanel={setRefPanel}
							setSwitchToSignup={setSwitchToSignup}
							setSignup={setSignup}
							setFormData={setFormData}
							referee={referee}
							setReferee={setReferee}/>
			}
			
			<UserSignUp signup={signup} 
						setSignup={setSignup} 
						setLogin={setLogin} 
						transition={transition}
						setPopUp={setPopUp}
						signupIsReady={signupIsReady}
						setSignupIsReady={setSignupIsReady}
						formData={formData}
						setFormData={setFormData}
						signupSequence={signupSequence}
						setSignupSequence={setSignupSequence}
						privacyOption={privacyOption}
						setPrivacyOption={setPrivacyOption}
						profilePhoto={profilePhoto}
						setProfilePhoto={setProfilePhoto}/>

			{signUpSuccess &&
				<div id="transition">
					<div id="first">
						<p>Sign Up Successful !</p>
					</div>

					<div id="second">
						<p>Now Signing In...</p>
					</div>
				</div>
			}
			
			<UserLogIn 
						setUserID={setUserID} 
						logingIn={login} 
						setLogingIn={setLogin} 
						setSignup={setSignup}
						setPopUp={setPopUp}
						exitSequence={exitSequence}/>

			{!signup &&
				<div id="loginOrSignup" ref={initialChoice} 
										className={`${switchToSignup ? '_leave' : ''}`}>

					<button onClick={(e)=>{
						e.preventDefault(); 
						setRefPanel();

						// let initialChoiceElement = initialChoice.current;
						// initialChoiceElement.style.opacity = 0;
						// let delay = setTimeout(()=> {
						// 	initialChoiceElement.style.display = 'none';
						// }, 550)
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
			}
			

			{signup &&
				<button id="forSignupProcess" 
						className={`buttonDefault ${signupIsReady == true ? 'canUse' : 'cantUse'}`}
						onClick={signupSequencer}>
					{sequenceButton}
				</button>
			}	

			{popUp.active &&
				<div id="popUp">
					<p>{popUp.message}</p>
					<button className={"buttonDefault"}onClick={()=> {setPopUp({ active: false, message: null })}}>Close</button>
				</div>
			}

		</section>
	)
}
