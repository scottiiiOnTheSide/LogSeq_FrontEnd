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
import NotificationsList from '../../components/notifs/notifsList';
import Log from '../../components/blog/log';
import FullList from '../../components/base/fullList';


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
	const navigate = useNavigate();
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
	
	let updatePosts = async() => {
		let posts = await accessAPI.groupPosts({action: 'getPosts', type: 'collection', groupID: macroID});
		if(posts.length > 0) {
			setPostData(posts);
			setMacroInfo({
				...macroInfo,
				postCount: posts.length
			})
		}
	}

	/* Element Related */
	const [notifList, setNotifList] = React.useReducer(state => !state, false);
	const [menu, toggleMenu] = React.useReducer(state => !state, false);
	/* For addRemoveRequest Button atop the page */
	let [addRemoveRequest, set_addRemoveRequest] = React.useState("")
	const [fullList, toggleFullList] = React.useReducer(state => !state, false);
	const source = macroInfo.name == 'BOOKMARKS' ? `${macroInfo.ownerUsername}'s ${macroInfo.name}` : macroInfo.name;

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

	console.log(macroInfo)
	// Update posts when fullList is closed
	React.useEffect(()=> {
		updatePosts()
	}, [fullList])

		
	return (
		<section id="MACROS" ref={el} className={`_enter`}>

			<Header cal={cal} 
					isReturnable={true} 
					setNotifList={setNotifList} 
					unreadCount={unreadCount}
					siteLocation={'MACROS'}/>

			<div id="mainWrapper">
				
				<div id="pageHeader">
					
					{/*{macroInfo.type == 'tag' &&
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
					}*/}
				
					<h3 id="subHeading">
						{/*	
							topic: public
							Tag and Private or Not: username
							collection: username
						*/}
						{`${macroInfo.type == 'tag' && macroInfo.isPrivate == false ? 'PUBLIC' : macroInfo.ownerUsername ? macroInfo.ownerUsername : 'PUBLIC' }`} / {macroInfo.type} /
					</h3>

					<h2 id="macroName">{macroInfo.name}</h2>

					<div id="infoWrapper">
						<h4 id="postCount">
							{macroInfo.postCount}
							<span>Posts</span>
						</h4>

						{(macroInfo.type != 'topic' && macroInfo.name != 'BOOKMARKS') &&
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
				 	isUnified={false}/>
			</div>

			<div id="menuBar">
						
				{(macroInfo.type == 'tag' || macroInfo.type == 'topic') &&
					<button className="buttonDefault"
							onClick={()=> {
								setTimeout(()=> {
									navigate(-1)
								}, 300);
							}}>EXIT</button>
				}
				{macroInfo.type == 'collection' &&
					<button className="buttonDefault" onClick={toggleMenu}>MENU</button>
				}
				{menu &&
					<ul id="menu">
						<li>
							<button className="buttonDefault" 
									onClick={()=> {
										toggleFullList()
										let delay = setTimeout(()=> {
											toggleMenu()	
										}, 200)
										
									}}>REMOVE ITEMS</button>
						</li>
						<li>
							<button className="buttonDefault">SHARE</button>
						</li>
						<li>
							<button className="buttonDefault"
									onClick={(e)=> {
										e.preventDefault()
										let menu = document.getElementById('menu');
										menu.classList.add('leave')

										let delay = setTimeout(()=> {
											toggleMenu()
										}, 150);
									}}>x</button>
						</li>
					</ul>
				}					
			</div>

			{fullList &&
				<FullList 
					mode={'remove'}
					data={postData}
					source={source}
					setFullList={toggleFullList}
					setSocketMessage={setSocketMessage}
					socketMessage={socketMessage}
					groupID={macroID}/>
			}

			{notifList &&
	          <NotificationsList 
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

// state {
// 	posts: resultingArrayFromAPI
// 	macroID: is macro _id
//	isPrivate: macro.isPrivate
//	hasAccess: is macro.hasAccess
//  	to check whether user is included or not, 
//		for add button and privacy

//	Run filter on hasAccess before navigate() to page
// }