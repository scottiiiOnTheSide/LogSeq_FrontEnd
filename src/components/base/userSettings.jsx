import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import APIaccess from '../../apiaccess';
import useAuth from '../../useAuth';

import '../../components/base/home.css';

let accessAPI = APIaccess();



export default function UserSettings({setUserSettings, userSettings, setLogout, setSocketMessage}) {

	let navigate = useNavigate();
	const { logout } = useAuth();
	const username = sessionStorage.getItem('userName');

	const [exit, setExit] = React.useReducer(state => !state, false)
	const [section, setSection] = React.useState([
		{
			profile: false,	
		},
		{
			photo: false,	
		},
		{
			username: false,	
		},
		{
			biography: false,	
		},
		{
			changePassword: false,
		},
		{
			privacy: false,
		},
		{
			invitation: false,
		}
	])
	const [changedUsername, setChangedUsername] = React.useState("");
	const [biography, setBiography] = React.useState("");
	const [currentPass, setCurrentPass] = React.useState("");
	const [newPass, setNewPass] = React.useState("");
	const [profilePhoto, setProfilePhoto] = React.useState({
		url: null,
		content: ''
	});
	const [privacyOption, setPrivacyOption] = React.useState("off"); //on, off, half

	const handleChange = (event) => {
 
		if(event.target.name == 'image') {
			setProfilePhoto({
				url: URL.createObjectURL(event.target.files[0]),
				content: event.target.files[0]
			});
		} 

		else if(event.target.name == 'username') {
			setChangedUsername(event.target.value)
			// console.log(event.target.value)
		}

		else if(event.target.name == 'biography') {
			setBiography(event.target.value)
		}

		else if(event.target.name == 'currentPass') {
			setCurrentPass(event.target.value)
		}
		else if(event.target.name == 'newPass') {
			setNewPass(event.target.value)
		}
	}

	const handleSubmit = (event) => {

		//sends necessary data over via socketMessage
		if(event.target.name == 'photoSubmit') {
			if(profilePhoto.content == "") {
				setSocketMessage({
					type: 'error',
					message: 'Please upload a photo'
				})
			}
			else {
				setSocketMessage({
					content: profilePhoto.content,
					action: 'profilePhoto'
				})
			}
		}

		else if(event.target.name == 'usernameUpdate') {
			if(changedUsername == "") {
				setSocketMessage({
					type: 'error',
					message: 'Please enter a new username'
				})
			} else {
				setSocketMessage({
					action: 'usernameUpdate',
					newUsername: changedUsername
				})
			}
		}

		else if(event.target.name == 'privacyOn') {
			console.log('privacy on')
		}
	}
	return (
		<div id="userSettings" className={`${exit == true ? '_exit' : ''}`}>
			
			<h2 id="mainHeader">User Settings</h2>

			<ul id="mainMenu">
				
				{/*P R O F I L E*/}
				<li id="profile" className={`${section.profile == true ? 'open' : 'close'}`}>
					<button className={`buttonDefault`} onClick={(e)=> {
								e.preventDefault()
								if(section.profile) {
									setSection({
										...section,
										profile: false
									}) 
								} else {
									setSection({
										...section,
										profile: true
									})
								}
					}}>Profile</button>

					<ul>
						{/*P H O T O*/}
						<li id="profilePhoto" className={`${section.photo == true ? 'open' : 'close'}`}>
							<button className={`buttonDefault`} onClick={(e)=> {
								e.preventDefault()
								if(section.photo) {
									setSection({
										...section,
										photo: false
									}) 
								} else {
									setSection({
										...section,
										photo: true
									})
								}
							}}>Photo</button>

							<fieldset id="photoAdd">
								<div id="photo">
									<img src={profilePhoto.url}/>
									<label className="imageAdd" onChange={handleChange} htmlFor="addProfileImage"onClick={()=> {
										document.getElementById('addProfileImage').click();
									}}>
										<input hidden
											id='addProfileImage'
											// onChange={handleChange} 
											type="file" 
											accept="image/"
											name='image'
											hidden />
										ADD IMAGE
									</label>
								</div>
								
								
								<button 
									name="photoSubmit"
									id="submitProfilePhoto"
									className={`buttonDefault`} 
									onClick={handleSubmit}>
								SAVE IMAGE</button>
							</fieldset>
						</li>
							
						{/*U S E R N A M E*/}
						<li id="username" className={`${section.username == true ? 'open' : 'close'}`}>
							<button className={`buttonDefault`} onClick={(e)=> {
								e.preventDefault()
								if(section.username) {
									setSection({
										...section,
										username: false
									}) 
								} else {
									setSection({
										...section,
										username: true
									})
								}
							}}>Username</button>

							<fieldset>
								<input 
									className={`inputDefault`}
									name="username"
									placeholder={`${username}`}
									onChange={handleChange} />
								<button 
									name="usernameUpdate"
									className={`buttonDefault`}
									onClick={handleSubmit}>
								UPDATE</button>
							</fieldset>

						</li>

						<li id="biography" className={`${section.biography == true ? 'open' : 'close'}`}>
							<button className={`buttonDefault`} onClick={(e)=> {
								e.preventDefault()
								if(section.biography) {
									setSection({
										...section,
										biography: false
									}) 
								} else {
									setSection({
										...section,
										biography: true
									})
								}
							}}>Biography</button>

							<fieldset>
								<textarea
									rows="4"
									className={`inputDefault`}
									name="biography"
									placeholder="What should the world know about you?"
									onChange={handleChange}>
								</textarea>
								<button className={`buttonDefault`}
										onClick={(e)=> {
											e.preventDefault()
											// newTag_submit()
								}}>UPDATE</button>
							</fieldset>
						</li>

						<li id="changePassword" className={`${section.changePassword == true ? 'open' : 'close'}`}>
							<button className={`buttonDefault`} onClick={(e)=> {
								e.preventDefault()
								if(section.changePassword) {
									setSection({
										...section,
										changePassword: false
									}) 
								} else {
									setSection({
										...section,
										changePassword: true
									})
								}
							}}>Change Password</button>

							<fieldset>
								<input 
									className={`inputDefault`}
									name="currentPass"
									placeholder="Current Password"
									onChange={handleChange}/>
								<input 
									className={`inputDefault`}
									name="newPass"
									placeholder="New Password"
									onChange={handleChange}/>
								
								<button className={`buttonDefault`}
										onClick={(e)=> {
											e.preventDefault()
											// newTag_submit()
								}}>UPDATE</button>
							</fieldset>
						</li>
					</ul>
				</li>

				<li id="privacy" className={`${section.privacy == true ? 'open' : 'close'}`}>
					<button className={`buttonDefault ${section.privacy == true ? 'open' : 'close'}`} onClick={(e)=> {
								e.preventDefault()
								if(section.privacy) {
									setSection({
										...section,
										privacy: false
									}) 
								} else {
									setSection({
										...section,
										privacy: true
									})
								}
					}}>Privacy</button>

					<div id="optionsWrapper">
						
						<ul id="options">
							<li>
								<button 
									name="privacyOn"
									className={`buttonDefault ${privacyOption == 'on' ? '' : '_inactive'}`}
									onClick={(e)=> {	
										e.preventDefault()
										setPrivacyOption("on");
										handleSubmit(e)
									}}>
									ON</button>	
							</li>
							<li>
								<button 
									className={`buttonDefault ${privacyOption == 'half' ? '' : '_inactive'}`}
									onClick={(e)=> {	
										e.preventDefault()
										setPrivacyOption("half");
										handleSubmit(e)
									}}>
									1 / 2</button>	
							</li>
							<li>
								<button 
									className={`buttonDefault ${privacyOption == 'off' ? '' : '_inactive'}`}
									onClick={(e)=> {	
										e.preventDefault()
										setPrivacyOption("off");
										handleSubmit(e)
									}}>
									OFF</button>	
							</li>
						</ul>

						{privacyOption == 'on' &&
							<p>
								Only Connections see <span>full name</span>{`\n`}
								Only Connections see <span>Profile Metrics</span>{`\n`}
								No Subscribers{`\n`} 
								All Posts visible only to Connections{`\n`}
								Pinned Posts and Media only visible to Connections
							</p>
						}
						{privacyOption == 'half' &&
							<p>
								Only Connections see <span>full name</span>{`\n`}
								Only Connections, Subscribers see <span>Profile Metrics</span>{`\n`}
								Subscribers Can Request{`\n`}
								All Posts visible only to Connections & Subscribers{`\n`}
								Pinned Posts and Media visible to Everyone
							</p>
						}
						{privacyOption == 'off' &&
							<p>
								Everyone can see <span>full name</span>{`\n`}
								Everyone can see <span>Profile Metrics</span>{`\n`}
								Subscribers need not Request{`\n`}
								All Posts visible to Everyone{`\n`}
								Pinned Posts and Media visible to Everyone
							</p>
						}

					</div>
				</li>

				<li id="invites" className={`${section.invitation == true ? 'open' : 'close'}`}>
					<button className={`buttonDefault ${section.invitation == true ? 'open' : 'close'}`} onClick={(e)=> {
								e.preventDefault()
								if(section.invitation) {
									setSection({
										...section,
										invitation: false
									}) 
								} else {
									setSection({
										...section,
										invitation: true
									})
								}
					}}>Invitation</button>

					<div id="mainWrapper">
							
						<h3 id="inviteCount"><span>32</span>Users Invited</h3>

						<h3 id="referralHeader">Referral Link</h3>
						<button className={`buttonDefault`} id="referralLink">CLICK TO COPY</button>
					</div>
				</li>

				<li>
					<button className={`buttonDefault`}>About Project
						<svg 
							xml version="1.0"
							viewBox="109.21 220.42 140.874 69.937" 
							xmlns="http://www.w3.org/2000/svg"
							id="return">
					  		<polyline 
					  			id="top"
					  			points="249.644 250.369 109.21 250.393 159.165 220.42" 
					  			transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 1.4210854715202004e-14)"/>
					  		<polyline 
					  			id="bottom"
					  			points="250.084 260.408 109.65 260.384 159.605 290.357" 
					  			transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 1.4210854715202004e-14)"/>
						</svg>
					</button>
				</li>
				<li>
					<button className={`buttonDefault`} onClick={setLogout}>Log Out</button>
				</li>
			</ul>

			<button id="closeSettings" className={`buttonDefault`} onClick={()=> {
				setExit()
				let delay = setTimeout(()=> {
					setUserSettings()
				}, 300)
			}}>CLOSE</button>
		</div>
	)
}