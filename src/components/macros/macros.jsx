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
		_id: location.state.macroID,
		userHasAccess: location.state.hasAccess, //boolean
		userCount: location.state.hasAccess ? location.state.hasAccess.length : undefined,
		isMacroPrivate: location.state.isPrivate,
		ownerUsername: location.state.ownerUsername,
		ownerID: location.state.ownerID,
		name: location.state.name,
		type: location.state.type,
		userCount: location.state.userCount,
		postCount: location.state.postCount
	})
	const macroID = location.state.macroID;
	const cal = Calendar();
	console.log(macroInfo)
	console.log(postData)

	let goToProfile = async(userid) => {

		let elCurrent = el.current;
		elCurrent.classList.add('_enter');

		let data = await accessAPI.getSingleUser(userid);

		let delay = setTimeout(()=> {
			navigate(`/user/${macroInfo.ownerUsername}`, {
				state: {
					user: data.user,
					pinnedPosts: data.pinnedPosts
				}
			})
		}, 200)
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
				})

				if(request.confirmation) {
					setSocketMessage({
						type: 'simpleNotif',
						message: `Removed "${macroInfo.name}"`
					})
				}
			}
			else {
				let request = await accessAPI.manageGroup('removeUser', {
					groupID: macroInfo._id,
				})

				if(request == true) {
					setSocketMessage({
						type: 'simpleNotif',
						message: `Removed "${macroInfo.name}" from your tags`
					})

					if(macroInfo.isMacroPrivate) {
						setARRD('request')
					}
					else {
						setARRD('add')
					}
				}
			}
		}

		else if(ARRD == 'request') {

		}

		else if(ARRD == 'add') {
			if(macroInfo.type == 'topic') {
				let request = await accessAPI.manageGroup('addUser', {
					topic: macroInfo.name
				})

				if(request.confirmation) {
					setSocketMessage({
						type: 'simpleNotif',
						message: `Added "${macroInfo.name}"`
					})
				}
			}
			else {
				let request = accessAPI.manageGroup('addUser', {
					groupID: macroInfo._id,
				})

				if(request == true) {
					setSocketMessage({
						type: 1,
						message: `Added "${macroInfo.name}" from your tags`
					})
					setARRD('remove')
				}
			}
		}
	}

	/* Element Related */
	const [notifList, setNotifList] = React.useReducer(state => !state, false);
	const [menu, toggleMenu] = React.useReducer(state => !state, false);
	/* For addRemoveRequest Button atop the page */
	// let [addRemoveRequest, set_addRemoveRequest] = React.useState("")
	const [fullList, toggleFullList] = React.useReducer(state => !state, false);
	const source = macroInfo.name == 'BOOKMARKS' ? `${macroInfo.ownerUsername}'s ${macroInfo.name}` : macroInfo.name;
	let [ARRD, setARRD] = React.useState();

	let el = React.useRef();
	React.useEffect(()=> {
		let elCurrent = el.current;
		let delay = setTimeout(()=> {
			elCurrent.classList.remove('_enter');	
		}, 300)

		// if owner, arrd -> delete
		if(macroInfo.ownerID == userID) { 
			setARRD('delete')
		}
		// if hasAccess and not owner -> remove
		else if(macroInfo.userHasAccess) {
			setARRD('remove')
		}
		// if noaccess and is not private -> add
		else if(!macroInfo.userHasAccess && macroInfo.isMacroPrivate) {
			setARRD('request')
		}
		// if no access and is private -> request
		else if(!macroInfo.userHasAccess && !macroInfo.isMacroPrivate) {
			setARRD('add')
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

					<button className={`buttonDefault`}
							id="addRemoveRequest"
							onClick={addRemoveRequestDelete}>
						{ARRD}
					</button>
				
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
							{macroInfo.type == 'tag' ? '@' : null}
							{macroInfo.type == 'tag' ? macroInfo.ownerUsername : 'PUBLIC'}
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