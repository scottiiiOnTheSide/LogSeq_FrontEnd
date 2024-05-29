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

	// const getUserInfo = async() => {

	// 	let request = await accessAPI.getSingleUser(location.state.userID);
	// 	setUserInfo(request);
	// 	console.log(request);
	// }

	// React.useEffect(()=> {
	// 	getUserInfo();
	// }, [])





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

				<p id="bio">{userInfo.bio}</p>

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
				</div>

				<div id="pinnedPosts">
					
					<h2>Pinned Posts</h2>
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