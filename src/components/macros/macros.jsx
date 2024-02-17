/* * * V I T A L S * * */
import * as React from 'react';
import {useParams, useLocation} from 'react-router-dom';
import Calendar from '../calendar'
import APIaccess from '../../apiaccess';

/* * * C O M P O N E N T S * * */
import Header from '../../components/home/header';
import Instant from '../../components/instants/instant';
import InteractionsList from '../../components/instants/interactionsList';


const accessAPI = APIaccess(); 




export default function Macrospage({
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
    set_selectedDate
}) {

	const location = useLocation();
	const [postData, setPostData] = React.useState(location.state.posts);
	const [macroInfo, setMacroInfo] = React.useState({
		userHasAccess: location.state.userHasAccess, //boolean
		userCount: location.state.userCount,
		isMacroPrivate: location.state.isPrivate,
		ownerUsername: location.state.ownerUsername,
		name: location.state.name,
		type: location.state.macroType
	})
	const macroID = location.state.macroID;
	const cal = Calendar();
	

	/* Opening animation */
	let el = React.useRef();

	React.useEffect(()=> {
		let elCurrent = el.current;
		let delay = setTimeout(()=> {
			elCurrent.classList.remove('_enter');	
		}, 200)
	}, [])

	return (
		<section id="MACROS" ref={el} className={`_enter`}>
			<Header cal={cal} isReturnable={true} unreadCount={unreadCount}/>

			<div id="pageHeader">
				
				<button>
					{/*
						Three modes: 
							Add To Macros (if public), 
							Request (if private), 
							Remove (if user is member)
					*/}
				</button>

				<h3 id="subHeading">
					{`${macroInfo.isMacroPrivate == true ? macroInfo.ownerUsername : 'PUBLIC'}`} /
					{macroInfo.type}
				</h3>

				<h2>{macroInfo.name}</h2>

				<h4 id="postAmount">
					{postData.length}
					<span>Posts</span>
				</h4>

				<h4 id="userAmount">
					{macroInfo.userCount}
					<span>Users Engaged</span>
				</h4>
			</div>

			{/*log component to go here*/}

		</section>
	)
}

// state {
// 	posts: resultingArrayFromAPI
// 	macroID: is macro _id
//	isPrivate: macro.isPrivate
//	hasAccess: is macro.hasAccess
//  	to check whether user is included or not, 
//		for add button and privacy

//	Run filter on hasAccess before navigate() to page
// }