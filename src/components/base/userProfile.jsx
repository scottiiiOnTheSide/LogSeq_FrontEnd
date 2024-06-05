import * as React from 'react';
import APIaccess from '../../apiaccess';
import Calendar from '../calendar'
import {useNavigate, useLocation} from 'react-router-dom';


import Header from '../../components/base/header';
import Instant from '../../components/notifs/instant';
import InteractionsList from '../../components/notifs/interactionsList';
import './home.css';

let accessAPI = APIaccess();

export default function UserProfile({
	socketURL,
	socketMessage,
    setSocketMessage,     
    sendMessage,
    isActive,
    setActive,
    accessID,
    setAccessID,
    unreadCount,
    setUnreadCount,
    getUnreadCount,
    lastMessage,
    selectedDate,
    set_selectedDate,
    current,
    setCurrent
}) {
	/* Component Function Related*/
	const userID = sessionStorage.getItem('userID');
	const location = useLocation();
	const navigate = useNavigate();
	const cal = Calendar();
	const isOwner = location.state.userID == userID ? true : false;
	const [userInfo, setUserInfo] = React.useState(location.state.data);

	const goToPost = async(postID) => {

		//use apiaccess to get post data, 
		//then use navigate to go to post page,
		//put post data within navigate state
	}
	
	/* UI Element Related */
	const [exit, setExit] = React.useReducer(state => !state, false);
	const [notifList, setNotifList] = React.useReducer(state => !state, false);
	const [settings, setSettings] = React.useReducer(state => !state, false);
	const [options, setOptions] = React.useReducer(state => !state, false);

	return (
		<section id="USERPROFILE" className={`${exit == true ? '_exit' : ''}`}>

			<Header cal={cal} 
					isReturnable={true} 
					setNotifList={setNotifList} 
					unreadCount={unreadCount}
					siteLocation={'USER'}/>


			<div id="main">
				
				<img id="userPhoto" src={userInfo.profilePhoto}/>

				<div id="title">
					<h2>{userInfo.userName}</h2>
					<h3>{`${userInfo.firstName} ${userInfo.lastName}`}</h3>
				</div>

				<div id="bio">

					<svg viewBox="0 0 8.4667997 10.583499624999998" version="1.1" x="0px" y="0px">
					  <g transform="translate(-76.30897,-154.3344)">
					    {/*<path d="m 77.90625,155.92187 c -0.289117,10e-6 -0.527331,0.24018 -0.527344,0.5293 -2.06e-4,4.77801 -2.6e-5,3.19311 0,4.23242 7e-6,0.28912 0.238227,0.5293 0.527344,0.5293 h 0.800781 c 0.272802,0 0.513281,-0.19112 0.574219,-0.45703 l 0.974609,-4.25195 c 0.06696,-0.29218 -0.165098,-0.58204 -0.464843,-0.58204 z m 0,0.5293 h 1.818359 l -0.958984,4.1875 c -0.0065,0.0283 -0.02957,0.0449 -0.05859,0.0449 H 77.90625 c -2.6e-5,-1.03938 -2.06e-4,0.54558 0,-4.23242 z" fill="#000000" stroke-linecap="round" stroke-linejoin="round" />*/}
					    {/*<path d="m 81.347656,155.92187 c -0.289116,0 -0.529297,0.24019 -0.529297,0.5293 v 4.23242 c 0,0.28912 0.240179,0.5293 0.529297,0.5293 h 0.798828 c 0.272803,0 0.513281,-0.19112 0.574219,-0.45703 l 0.974609,-4.25195 c 0.06696,-0.29217 -0.165099,-0.58204 -0.464843,-0.58204 z m 0,0.5293 h 1.816406 l -0.958984,4.1875 c -0.0065,0.0283 -0.02957,0.0449 -0.05859,0.0449 h -0.798828 z" fill="#000000" stroke-linecap="round" stroke-linejoin="round" />*/}
					    <path d="m 83.231244,156.18655 h -1.884461 a 0.26458287,0.26458287 135 0 0 -0.264583,0.26458 v 4.23333 a 0.26458587,0.26458587 45 0 0 0.264586,0.26459 h 0.800434 a 0.32368784,0.32368784 141.45373 0 0 0.315509,-0.25138 l 0.974542,-4.25254 a 0.21136831,0.21136831 51.453726 0 0 -0.206027,-0.25858 z" fill="#000000" fill-opacity="1" stroke="none" />
					    <path d="m 79.791662,156.18655 h -1.884448 c -0.146126,0 -0.264589,0.11846 -0.264596,0.26458 -2.05e-4,4.77801 -1.7e-5,3.19399 9e-6,4.23334 4e-6,0.14612 0.118462,0.26458 0.264588,0.26458 h 0.800427 a 0.3236857,0.3236857 141.45373 0 0 0.315507,-0.25138 l 0.974542,-4.25254 a 0.21136967,0.21136967 51.453726 0 0 -0.206029,-0.25858 z" fill="#000000" fill-opacity="1" stroke="none" />
					  </g>
					</svg>

					<p id="bio">{userInfo.bio}</p>

					<svg viewBox="0 0 8.4667997 10.583499624999998" version="1.1" x="0px" y="0px">
					  <g transform="translate(-76.30897,-154.3344)">
					    {/*<path d="m 77.90625,155.92187 c -0.289117,10e-6 -0.527331,0.24018 -0.527344,0.5293 -2.06e-4,4.77801 -2.6e-5,3.19311 0,4.23242 7e-6,0.28912 0.238227,0.5293 0.527344,0.5293 h 0.800781 c 0.272802,0 0.513281,-0.19112 0.574219,-0.45703 l 0.974609,-4.25195 c 0.06696,-0.29218 -0.165098,-0.58204 -0.464843,-0.58204 z m 0,0.5293 h 1.818359 l -0.958984,4.1875 c -0.0065,0.0283 -0.02957,0.0449 -0.05859,0.0449 H 77.90625 c -2.6e-5,-1.03938 -2.06e-4,0.54558 0,-4.23242 z" fill="#000000" stroke-linecap="round" stroke-linejoin="round" />*/}
					    {/*<path d="m 81.347656,155.92187 c -0.289116,0 -0.529297,0.24019 -0.529297,0.5293 v 4.23242 c 0,0.28912 0.240179,0.5293 0.529297,0.5293 h 0.798828 c 0.272803,0 0.513281,-0.19112 0.574219,-0.45703 l 0.974609,-4.25195 c 0.06696,-0.29217 -0.165099,-0.58204 -0.464843,-0.58204 z m 0,0.5293 h 1.816406 l -0.958984,4.1875 c -0.0065,0.0283 -0.02957,0.0449 -0.05859,0.0449 h -0.798828 z" fill="#000000" stroke-linecap="round" stroke-linejoin="round" />*/}
					    <path d="m 83.231244,156.18655 h -1.884461 a 0.26458287,0.26458287 135 0 0 -0.264583,0.26458 v 4.23333 a 0.26458587,0.26458587 45 0 0 0.264586,0.26459 h 0.800434 a 0.32368784,0.32368784 141.45373 0 0 0.315509,-0.25138 l 0.974542,-4.25254 a 0.21136831,0.21136831 51.453726 0 0 -0.206027,-0.25858 z" fill="#000000" fill-opacity="1" stroke="none" />
					    <path d="m 79.791662,156.18655 h -1.884448 c -0.146126,0 -0.264589,0.11846 -0.264596,0.26458 -2.05e-4,4.77801 -1.7e-5,3.19399 9e-6,4.23334 4e-6,0.14612 0.118462,0.26458 0.264588,0.26458 h 0.800427 a 0.3236857,0.3236857 141.45373 0 0 0.315507,-0.25138 l 0.974542,-4.25254 a 0.21136967,0.21136967 51.453726 0 0 -0.206029,-0.25858 z" fill="#000000" fill-opacity="1" stroke="none" />
					  </g>
					</svg>
				</div>

				<div id="stats">
					<p>
						9
						<span>Posts</span>
					</p>
					<p>
						{userInfo.connections.length}
						<span>Connections</span>
					</p>
				</div>

				<div id="pinnedMedia">

					<h2>Pinned Media</h2>
					{userInfo.pinnedMedia.length < 1 &&
						<h2 class="none">No Pinned Media</h2>
					}

					<ul>
						{userInfo.pinnedMedia.map(data => (
							<li key={data.postID}>
								<img src={data.url} onClick={()=> {

								}}/>
							</li>
						))}
						
					</ul>
				</div>

				<div id="pinnedPosts">
					
					<h2>Pinned Posts</h2>
					{userInfo.pinnedPosts.length < 1 &&
						<h2 class="none">No Pinned Posts</h2>
					}
				</div>
			</div>


			<div id="menuBar">
				
				{isOwner &&
					<button className={`buttonDefault`}>Settings</button>
				}
				{!isOwner &&
					<button className={`buttonDefault`}>Options</button>
				}
			</div>

			{

			}		


			{notifList &&
	          <InteractionsList 
	            setNotifList={setNotifList} 
	            unreadCount={unreadCount}
	            setUnreadCount={setUnreadCount}
	            setSocketMessage={setSocketMessage}/>
	        }
			<Instant 
				socketURL={socketURL}
                socketMessage={socketMessage}
                setSocketMessage={setSocketMessage}
                sendMessage={sendMessage}
                isActive={isActive}
                setActive={setActive}
                accessID={accessID}
                setAccessID={setAccessID}
                getUnreadCount={getUnreadCount}
			/>
		</section>
	)
}