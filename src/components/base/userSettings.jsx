import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import APIaccess from '../../apiaccess';
import useAuth from '../../useAuth';

import '../../components/base/home.css';

let accessAPI = APIaccess();



export default function UserSettings({setUserSettings, userSettings }) {

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


	return (
		<div id="userSettings" className={`${exit == true ? '_exit' : ''}`}>
			
			<h2>User Settings</h2>

			<ul id="mainMenu">
				
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
						<li className={`${section.photo == true ? 'open' : 'close'}`}>
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

						</li>
							
						<li className={`${section.username == true ? 'open' : 'close'}`}>
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

						</li>

						<li className={`${section.biography == true ? 'open' : 'close'}`}>
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

						</li>

						<li className={`${section.changePassword == true ? 'open' : 'close'}`}>
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
						</li>
					</ul>

				</li>

				<li className={`${section.privacy == true ? 'open' : 'close'}`}>
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
				</li>

				<li className={`${section.invitation == true ? 'open' : 'close'}`}>
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
				</li>

				<li>
					<button className={`buttonDefault`}>About Project</button>
				</li>
				<li>
					<button className={`buttonDefault`}>Log Out</button>
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