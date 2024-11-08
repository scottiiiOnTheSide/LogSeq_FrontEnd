/* * * V I T A L S * * */
import * as React from 'react';
import {useParams, useLocation, useLoaderData} from 'react-router-dom';
import CalInfo from '../calInfo'
import APIaccess from '../../apiaccess';
import {useNavigate} from 'react-router-dom';

import './macros.css';

/* * * C O M P O N E N T S * * */
import Header from '../../components/base/header';
import Instant from '../../components/notifs/instant';
import NotificationsList from '../../components/notifs/notifsList';
import Log from '../../components/blog/log';
import FullList from '../../components/base/fullList';
import DragSlider from '../../components/base/dragSlider';


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
    setCurrent,
    tags,
    setTags,
    userTopics,
    setUserTopics
}) {

	const userID = sessionStorage.getItem('userID');
	let userSettings = sessionStorage.getItem('settings');
	const data = useLoaderData();
	const navigate = useNavigate();
	const [postData, setPostData] = React.useState(data.macroPosts);
	const [macroInfo, setMacroInfo] = React.useState(data.macroInfo);
	const macroID = macroInfo._id;
	const cal = CalInfo();
	// console.log(macroInfo)
	// console.log(postData)
	// console.log(userTopics)

	let goToProfile = async(userID) => {

		let elCurrent = el.current;
		elCurrent.classList.add('_enter');

		let data = await accessAPI.getSingleUser(userID);
		
		let delay = setTimeout(()=> {
			navigate(`/user/${data.user.userName}/${data.user._id}`, {
				state: {
					user: data.user,
					pinnedPosts: data.pinnedPosts,
					collections: data.collections
				}
			})
		}, 150)
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
	const [fullList, toggleFullList] = React.useReducer(state => !state, false);
	const source = macroInfo.name == 'BOOKMARKS' ? `${macroInfo.ownerUsername}'s ${macroInfo.name}` : macroInfo.name;
	let [ARRD, setARRD] = React.useState();
	// let ARRD;

	let addRemoveRequestDelete = async() => {
		if(ARRD == 'delete') {
			let request = await accessAPI.manageGroup('deleteGroup', {
				type: 'tag',
				groupID: macroInfo._id,
			});

			if(request.confirmation) {
				navigate(-1);
				let delay = setTimeout(()=> {
					setSocketMessage({
						type: 'simpleNotif',
						message: `Deleted "${macroInfo.name}"`
					})
				}, 200)
			}
		}

		else if(ARRD == 'remove') {

			if(macroInfo.type == 'topic') {

				let request = await accessAPI.manageGroup('removeUser', {
					topic: macroInfo.name
				}).then((data) => {
					if(data.confirmation == true) {
						setARRD('add')
					}
				})
				setSocketMessage({
					type: 'simpleNotif',
					message: `Removed "${macroInfo.name}" from your topics`
				})
			}
			else {
				let request = await accessAPI.manageGroup('removeUser', {
					groupID: macroInfo._id,
				}).then((data) => {
					if(data.confirmation == true) {
						if(macroInfo.isMacroPrivate) {
							setARRD('request')
							// ARRD = 'request'
						}
						else {
							setARRD('add')
							// ARRD = 'add'
						}
					}
				})
				setSocketMessage({
					type: 'simpleNotif',
					message: `Removed "${macroInfo.name}" to your tags`
				})
			}
		}

		else if(ARRD == 'request') {

			let request = accessAPI.newInteraction({
				type: 'request',
				message: 'accessRequested',
				senderID: userID,
				recipients: [macroInfo.ownerID],
				recipientUsernames: macroInfo.ownerUsername,
				groupID: macroID,
				groupName: macroInfo.name
			}).then(data => {
				if(data.confirmation == true) {
					console.log('request sent')

					setSocketMessage({
						message: `Request for access sent to @${macroInfo.ownerUsername}`,
						recipients: [macroInfo.ownerID],
						action: 'updateNotifs'
					})
				}
				else {
					setSocketMessage({
						type: 'error',
						message: data.message
					})
				}
			})
		}

		else if(ARRD == 'add') {
			if(macroInfo.type == 'topic') {
				let request = await accessAPI.manageGroup('addUser', {
					topic: macroInfo.name
				}).then((data) => {
					if(data.confirmation == true) {
						setARRD('remove')
					}
				})
				setSocketMessage({
					type: 'simpleNotif',
					message: `Added "${macroInfo.name}" to your topics`
				})
			}
			else {
				let request = accessAPI.manageGroup('addUser', {
					groupID: macroInfo._id,
				}).then((data) => {
					if(data.confirmation == true) {
						setARRD('remove')
					}
				})
				setSocketMessage({
					type: 'simpleNotif',
					message: `Added "${macroInfo.name}" to your tags`
				})
			}
		}
	}

	React.useEffect(()=> {

		document.title = 'Syncseq.xyz/macro'

		console.log(macroInfo.name)
		console.log(userTopics.includes(macroInfo.mame))
		if(userTopics.includes(macroInfo.mame)) {
			setMacroInfo({
				...macroInfo,
				userHasAccess: true
			})
		}
		console.log(macroInfo)
	}, [])

	let el = React.useRef();
	React.useEffect(()=> {
		let elCurrent = el.current;
		let delay = setTimeout(()=> {
			elCurrent.classList.remove('_enter');	
		}, 300)

		if(macroInfo.ownerID == userID) { 
			setARRD('delete')
			// ARRD = 'delete'
		}
		// if hasAccess and not owner -> remove
		else if(macroInfo.userHasAccess == true) {
			setARRD('remove')
			// ARRD = 'remove'
		}
		// if noaccess and is not private -> add
		else if(!macroInfo.userHasAccess && macroInfo.admins) {
			setARRD('request')
			// ARRD = 'request'
		}
		// if no access and is private -> request
		else if(!macroInfo.userHasAccess && !macroInfo.isMacroPrivate) {
			setARRD('add')
			// ARRD = 'add'
		}
	}, []);

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
					{macroInfo.name != 'BOOKMARKS' &&
						<button className={`buttonDefault`}
								id="addRemoveRequest"
								onClick={()=> {addRemoveRequestDelete()}}>
							{ARRD}
						</button>
					}
					
				
					<h3 id="subHeading">
						{/*	
							Topic: public
							Tag, Private or Not: username
							Collection: username
						*/}
						<span className={`${macroInfo.type != 'topic' ? "toUserProfile" : ''}`}
							  onClick={()=> {
							  	if(macroInfo.type != 'topic') {
							  		goToProfile(macroInfo.ownerID)	
							  	}
							  	else return;
							  }}>
							{macroInfo.type != 'topic' ? '@' : null}
							{macroInfo.type != 'topic' ? macroInfo.ownerUsername : 'PUBLIC'}
						</span> / {macroInfo.type} /
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

				{(macroInfo.isMacroPrivate && !macroInfo.userHasAccess) &&
					<h2 id='noAccess'>You Must Request Access from the User</h2>
				}

				{(macroInfo.isMacroPrivate && macroInfo.userHasAccess) &&
					<Log data={postData} 
					 	userID={userID} 
					 	noHeading={true} 
					 	current={current} 
					 	setCurrent={setCurrent}
					 	isUnified={false}/>
				}
				{!macroInfo.isMacroPrivate &&
					<Log data={postData} 
					 	userID={userID} 
					 	noHeading={true} 
					 	current={current} 
					 	setCurrent={setCurrent}
					 	isUnified={false}/>
				}
				
			</div>

			<div id="menuBar">
						
				{(macroInfo.type == 'tag' || macroInfo.type == 'topic') &&
					<button className="buttonDefault"
							onClick={()=> {
								setTimeout(()=> {
									navigate(-1)
								}, 300);
							}}>return</button>
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

			{current.gallery.length > 0 &&
	          <DragSlider current={current} setCurrent={setCurrent} siteLocation={'home'}/>
	        }
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