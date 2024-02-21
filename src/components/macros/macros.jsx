/* * * V I T A L S * * */
import * as React from 'react';
import {useParams, useLocation} from 'react-router-dom';
import Calendar from '../calendar'
import APIaccess from '../../apiaccess';
import {useNavigate} from 'react-router-dom';

import './macros.css';

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
		userHasAccess: location.state.hasAccess, //boolean
		userCount: location.state.hasAccess.length,
		isMacroPrivate: location.state.isPrivate,
		ownerUsername: location.state.ownerUsername,
		name: location.state.name,
		type: location.state.type
	})
	const macroID = location.state.macroID;
	const cal = Calendar();
	console.log(macroInfo)
	

	/* Opening animation */
	let el = React.useRef();

	React.useEffect(()=> {
		let elCurrent = el.current;
		let delay = setTimeout(()=> {
			elCurrent.classList.remove('_enter');	
		}, 200)
	}, []);

	let addRemoveRequest;
	if(macroInfo.userHasAccess == true) {
		addRemoveRequest = 'Remove'
	}
	if(macroInfo.isMacroPrivate == false && macroInfo.userHasAccess == false) {
		addRemoveRequest = 'Add To Macros'
	}	
	if(macroInfo.isMacroPrivate == true && macroInfo.userHasAccess == false) {
		addRemoveRequest = 'Request'
	}

	return (
		<section id="MACROS" ref={el} className={`_enter`}>
			<Header cal={cal} isReturnable={true} unreadCount={unreadCount}/>

			<div id="pageHeader">
				
				<button className={`buttonDefault`} id="addRemoveRequest">{addRemoveRequest}</button>

				<h3 id="subHeading">
					{`${macroInfo.isMacroPrivate == true ? macroInfo.ownerUsername : 'PUBLIC'}`} / {macroInfo.type} /
				</h3>

				<h2 id="macroName">{macroInfo.name}</h2>

				<h4 id="postCount">
					{/*{postData.length}*/}
					128
					<span>Posts</span>
				</h4>

				<h4 id="userCount">
					{/*{macroInfo.userCount}*/}
					64K
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