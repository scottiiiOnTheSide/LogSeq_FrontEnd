/* * * V I T A L S * * */
import * as React from 'react';
import {useParams, useLocation} from 'react-router-dom';
import Calendar from '../calendar'
import APIaccess from '../../apiaccess';
import {useNavigate} from 'react-router-dom';

import './macros.css';

/* * * C O M P O N E N T S * * */
import Header from '../../components/base/header';
import Instant from '../../components/notifs/instant';
import InteractionsList from '../../components/notifs/interactionsList';
import Log from '../../components/blog/log';


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
    set_selectedDate,
    current,
    setCurrent
}) {

	const userID = sessionStorage.getItem('userID');
	const location = useLocation();
	const [postData, setPostData] = React.useState(location.state.posts);
	const [macroInfo, setMacroInfo] = React.useState({
		userHasAccess: location.state.hasAccess, //boolean
		userCount: location.state.hasAccess ? location.state.hasAccess.length : undefined,
		isMacroPrivate: location.state.isPrivate,
		ownerUsername: location.state.ownerUsername,
		name: location.state.name,
		type: location.state.type,
		userCount: location.state.userCount,
		postCount: location.state.postCount
	})
	const macroID = location.state.macroID;
	const cal = Calendar();
	console.log(macroInfo)
	console.log(postData)


	let removeThyself = async(groupID) => {

	}

	let addThyself = async(groupID) => {

	}
	

	/* Element Related */
	const [notifList, setNotifList] = React.useReducer(state => !state, false);
	let el = React.useRef();

	React.useEffect(()=> {
		let elCurrent = el.current;
		let delay = setTimeout(()=> {
			elCurrent.classList.remove('_enter');	
		}, 200)

		if(macroInfo.userHasAccess == true) {
			set_addRemoveRequest('Remove')
		}
		if(macroInfo.isMacroPrivate == false && macroInfo.userHasAccess == false) {
			set_addRemoveRequest("Add To Macros")
		}	
		if(macroInfo.isMacroPrivate == true && macroInfo.userHasAccess == false) {
			set_addRemoveRequest('Request')
		}
	}, []);

	/* For addRemoveRequest Button atop the page */
	let [addRemoveRequest, set_addRemoveRequest] = React.useState("")
	

	return (
		<section id="MACROS" ref={el} className={`_enter`}>

			<Header cal={cal} isReturnable={true} setNotifList={setNotifList} unreadCount={unreadCount}/>

			<div id="mainWrapper">
				
				<div id="pageHeader">
					{macroInfo.type != 'collection' &&
						<button className={`buttonDefault`} 
								id="addRemoveRequest"
								onClick={()=> {
									if(addRemoveRequest == 'Remove') {
										let body = {
											type: macroInfo.type,
											groupID: macroID,
											action: 'deleteTag'
										}
										setSocketMessage(body);
										set_addRemoveRequest("Add To Macros")
									}
									else if(addRemoveRequest == 'Add To Macros') {
										let body = {
											type: macroInfo.type,
											groupID: macroID,
											action: 'addTag'
										}
										setSocketMessage(body);
										set_addRemoveRequest('Remove')
									}
								}}>{addRemoveRequest}</button>
					}
				
				<h3 id="subHeading">
					{`${macroInfo.isMacroPrivate == true ? macroInfo.ownerUsername : 'PUBLIC'}`} / {macroInfo.type} /
				</h3>

				<h2 id="macroName">{macroInfo.name}</h2>

				<div id="infoWrapper">
					<h4 id="postCount">
						{macroInfo.postCount}
						<span>Posts</span>
					</h4>

					{macroInfo.type != 'topic' &&
						<h4 id="userCount">
							{macroInfo.userCount}
							<span>Users Engaged</span>
						</h4>
					}
				</div>
					
			</div>

			<Log data={postData} 
				 userID={userID} 
				 noHeading={true} 
				 current={current} 
				 setCurrent={setCurrent}
				 isUnified={true}/>

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

			</div>
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