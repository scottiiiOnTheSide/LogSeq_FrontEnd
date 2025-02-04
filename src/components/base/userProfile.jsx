import * as React from 'react';
import APIaccess from '../../apiaccess';
import CalInfo from '../calInfo'
import {useNavigate, useLocation, useLoaderData, useParams } from 'react-router-dom';


import Header from '../../components/base/header';
import Instant from '../../components/notifs/instant';
import NotificationList from '../../components/notifs/notifsList';
import FullList from '../../components/base/fullList';
import DragSlider from '../../components/base/dragSlider';
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
	const username = sessionStorage.getItem('userName');
	// const location = useLocation();
	const dataData = useLoaderData();
	const [data, setData] = React.useState(dataData);
	const navigate = useNavigate();
	const location = useLocation();
	const { userid } = useParams();
	const cal = CalInfo();
	const isOwner = data.user._id == userID ? true : false;
	const [userInfo, setUserInfo] = React.useState(data.user);
	const [pinnedPosts, setPinnedPosts] = React.useState(data.pinnedPosts)
	const [collections, setCollections] = React.useState(data.collections)

	const updateProfilePage = async() => {
		let data = await accessAPI.getSingleUser(userInfo._id);
		setData(data);
		setUserInfo(data.user);
		setPinnedPosts(data.pinnedPosts);
		setCollections(data.collections);

		let connectedUsers = data.user.connections.length + data.user.subscribers.length + data.user.subscriptions.length;
		setData({
			...data,
			connectedUsers: connectedUsers
		})
	}

	const goToUserSettings = async() => {

		let settings = await accessAPI.userSettings({option: 'getUserSettings'});

		let delay = setTimeout(()=> {
			navigate(`/${userInfo.userName}/settings`, {
				state: {
					data: settings
				}
			})
		}, 150)
	}

	const goToPost = async(postID) => {

		//use apiaccess to get post data, 
		//then use navigate to go to post page,
		//put post data within navigate state
		let post = await accessAPI.getBlogPost(postID);

		setTimeout(()=> {
			navigate(`/post/${post._id}`, {
				state: {post: post}
			});
		}, 600)
	}

	let goToMacrosPage = async(tag) => {

		let tagInfo = await accessAPI.getTagData(tag._id, tag.name);
		let posts = await accessAPI.groupPosts({action: 'getPosts', groupID: tag._id, groupName: tag.name});
		let postsCount = posts.length;

		/* 09. 22. 2024
			This check should always be done when going to a macro,
			but is unnecessary here - as user does have access to
			their own recently used tags
		*/
		let doesHaveAccess;
		if(tagInfo.hasAccess) {
			doesHaveAccess = tagInfo.hasAccess.filter(el => el == userID);
			doesHaveAccess = doesHaveAccess.length > 0 ? true : false;
		}
		
		console.log(tagInfo);
									
		setTimeout(()=> {
			navigate(`/macros/${tag.name}/${tag._id}`, {
					state: {
						name: tag.name,
						posts: posts,
						macroID: tag._id,
						isPrivate: tagInfo.isPrivate,
						hasAccess: tagInfo.hasAccess ? doesHaveAccess : true,
						ownerUsername: tagInfo.adminUsernames ? tagInfo.adminUsernames[0] : null,
						ownerID: tagInfo.admins ? tagInfo.admins[0] : null,
						type: tagInfo.type == undefined ? 'topic' : tagInfo.type,
						userCount: tagInfo.hasAccess ? tagInfo.hasAccess.length : null,
						postCount: postsCount ? postsCount : 0
					}
				})
		}, 200)
	}

	const requestConnection = async(recipientID) => {
		let notif = {
			type: 'request',
			senderID: userID,
			senderUsername: username,
			recipients: [recipientID],
			recipientUsername: userInfo.userName,
			message: 'connectionRequestSent'
		}
		setSocketMessage(notif);

		let optionsMenu = document.getElementById('profileOptions');
		optionsMenu.classList.add('leave')
		let delay = setTimeout(()=> {
			setOptions()
		}, 150);
	}

	const removeConnection = async(userID, username) => {
		let remove = await accessAPI.removeConnection(userID);
		if(remove == true) {

			updateProfilePage();

			let optionsMenu = document.getElementById('profileOptions');
			optionsMenu.classList.add('leave')

			let delay = setTimeout(()=> {
				setOptions()
			}, 150);

			let delayTwo = setTimeout(()=> {
				setSocketMessage({
					type: 'confirmation',
					message: 'removal',
					username: username,
				})
			}, 500);
			
		}
	}

	const requestSubscription = async(recipientID) => {
		let notif = {
			type: 'request', //type is request initially, switches to confirmation
			senderID: userID,
			senderUsername: username,
			recipients: [recipientID],
			recipientUsername: userInfo.userName,
			message: userInfo.privacySetting == 'Off' ? 'subscribed' : 'subscriptionRequestSent'
		}

		setSocketMessage(notif);
		setData({
			...data,
			isSubscribed: false
		})


		let optionsMenu = document.getElementById('profileOptions');
		optionsMenu.classList.add('leave')
		let delay = setTimeout(()=> {
			setOptions()
		}, 150);
	}

	const removeSubscription = async(userID) => {

		setOptions();

		let remove = await accessAPI.removeSubscription(userID, 'to').then(data => {
			if(data.confirm == true) {
				
				//may leave or need to find other way of implementing update
				// setData({
				// 	...data,
				// 	isSubscribed: false
				// })

				// let delayOne = setTimeout(()=> {
					updateProfilePage();
				// }, 200)

				let delayTwo = setTimeout(()=> {
					setSocketMessage({
						type: 'confirmation',
						message: 'unsubscribed',
						username: userInfo.userName,
					})
				}, 400)
			}
		})
		
	}
	
	/* UI Element Related */
	const [exit, setExit] = React.useReducer(state => !state, false);
	const [notifList, setNotifList] = React.useReducer(state => !state, false);
	const [fullList, setFullList] = React.useReducer(state => !state, false);
	const [settings, setSettings] = React.useReducer(state => !state, false);
	const [options, setOptions] = React.useReducer(state => !state, false);
	const [fullListData, setFullListData] = React.useState({
		data: '',
		source: ''
	})

	React.useEffect(()=> {
		updateProfilePage()
	}, [fullList])

	React.useEffect(()=> {
		updateProfilePage();
		if(userInfo._id != userid) {
			navigate(0)
		}
	}, [userid ])

	React.useEffect(()=> {

		document.title = 'Syncseq.xyz/user'

		updateProfilePage()
	}, [])

	return (
		<section id="USERPROFILE" key={userid} className={`${exit == true ? '_exit' : ''}`}>

			<Header 
					isReturnable={true} 
					setNotifList={setNotifList} 
					unreadCount={unreadCount}
					siteLocation={userInfo._id == userID ? 'PROFILE' : 'USER'}/>


			<div id="main">
				
				<div id="profilePhotoWrapper">
					<img id="userPhoto" src={userInfo.profilePhoto}/>	
				</div>
				

				<div id="title">
					<h2>{userInfo.userName}</h2>
					<h3>{`${userInfo.firstName} ${userInfo.lastName}`}</h3>
				</div>

				{userInfo.bio &&
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
				}


				{/*
					S T A T S
				*/}
				<div id="stats">

					{/*v i e w  P O S T S*/}
					<button className={`buttonDefault`} onClick={async(e)=> {
						e.preventDefault();
						console.log(userInfo._id)
						let data = await accessAPI.pullUserLog(undefined, undefined, userInfo._id).then((data) => {
									
							// console.log(data);

							setFullListData({
								data: data,
								mode: 'allPosts',
								source: `from @${userInfo.userName}` 
							});

							setFullList();
						})
					}}>
						{/*9*/}
						{data.postCount}
						<span>Posts</span>
					</button>


					{/* A C T I O N  C O U N T*/}
					<p>
						{userInfo.interactionCount}
						<span>Actions</span>
					</p>


					{/*v i e w  C O N N E C T I O N S*/}
					<button className={`buttonDefault`} onClick={async(e)=> {
						let data = await accessAPI.getConnections(userInfo._id);

						setFullListData({
							data: data,
							mode: 'allConnections',
							source: `@${userInfo.userName}` 
						});

						setFullList();
					}}>
						{data.connectedUsers}
						<span>USER{data.connectedUsers > 1 ? 'S' : ''}</span>
					</button>
				</div>

				<div id="pinnedMedia">

					<h2>Pinned Media</h2>
					{userInfo.pinnedMedia.length < 1 &&
						<h2 className="none">None</h2>
					}

					{userInfo.pinnedMedia.length > 0 && 
						<ul>
							{userInfo.pinnedMedia.map((data, index) => (
								<li key={index}>
									<img src={data.url} onClick={(e)=> {
										e.stopPropagation();

										let gallery = userInfo.pinnedMedia.map(data => ({
		  										content: data.url,
		  										postID: data.postID,
		  										type: 'media'
		  									}));

										setCurrent({
											...current,
											gallery: gallery
										})
									}}/>
								</li>	
							))}
						</ul>
					}
				</div>

				<div id="pinnedPosts">
					
					<h2>Pinned Posts</h2>

					{pinnedPosts.length < 1 &&
						<h2 className="none">None</h2>
					}

					{pinnedPosts.length > 0 &&
						<ul>
							{pinnedPosts.map(post => {

								// let commentCount;
								// let cmntcount = 0;
								// let countComments = (comments) => {
									
								// 	for(let cmnt of comments) {
								// 		cmntcount++;
								// 		countComments(cmnt.replies)
								// 	}

								// 	commentCount = cmntcount;
								// }
								// countComments(post.comments)

								return (
									<li onClick={()=> {
										setTimeout(()=> {
											navigate(`/post/${post._id}`, {
												state: {post: post}
											});
										}, 300)
									}}>
										<span className="date">{post.postedOn_month} . {post.postedOn_day} . {post.postedOn_year}</span>
										<h3>{post.title}</h3>
										{post.commentCount > 0 &&
											<span className="details">{post.commentCount} comments</span>
										}
										{post.tags.length > 0 &&
											<span className="details">{post.tags.length} tags</span>
										}
									</li>
								)
							})
							}
						</ul>
					}		
				</div>

				<div id="collections" className={``}> 
					<h2>Collections</h2>

					{collections.length < 1 &&
						<h2 className="none">None</h2>
					}			

					<ul className={`collectionsWrapper`}>
						{collections.length > 0 &&
							collections.map(item => {

								return (
									<li onClick={()=> {goToMacrosPage(item)}}>
										<h3>{item.name}</h3>
									</li>
								)
							})
						}
					</ul>
				</div>
			</div>


			<div id="menuBar">
				<button className={`buttonDefault`} onClick={setOptions}>Options</button>
			</div>

			{/*USER IS OWNER*/}
			{(options && isOwner) &&
				<ul id="profileOptions">
					<li>
						<button className={`buttonDefault`} onClick={()=> {

							setFullListData({
								data: userInfo.pinnedMedia,
								mode: 'remove_pinnedMedia',
								source: `${userInfo.userName}'s Pinned Media` 
							});

							setFullList();

							setTimeout(()=> {
								setOptions()
							}, 100)
						}}>Edit Pinned Media</button>
					</li>

					<li>
						<button className={`buttonDefault`} onClick={()=> {

							setFullListData({
								data: pinnedPosts,
								mode: 'remove_pinnedPosts',
								source: `${userInfo.userName}'s Pinned Posts` 
							});

							setFullList();

							setTimeout(()=> {
								setOptions()
							}, 100)
						}}>Edit Pinned Posts</button>
					</li>

					<li>
						<button className={`buttonDefault`} 
								onClick={goToUserSettings}>
							Settings
						</button>
					</li>

					<li id="close">
						<button className="buttonDefault" onClick={()=> {
								let optionsMenu = document.getElementById('profileOptions');
								optionsMenu.classList.add('leave')

								let delay = setTimeout(()=> {
									setOptions()
								}, 150);
							}}>⨉</button>
					</li>
				</ul>
			}
			{/*USER IS NOT OWNER*/}
			{(options && !isOwner) &&
				<ul id="profileOptions">

					{(!data.isConnected && !data.isSubscribed) &&
						<li>
							<button className={`buttonDefault`} 
							onClick={()=> {requestConnection(userInfo._id)}}>
								Request Connection
							</button>
						</li>
					}
					{data.isConnected &&
						<li>
							<button className={`buttonDefault`} 
							onClick={()=> {removeConnection(userInfo._id, userInfo.userName)}}>
								Disconnect
							</button>
						</li>
					}
					
					{(data.isSubscribed && !data.isConnected) &&
						<li>
							<button className={`buttonDefault`} 
							onClick={()=> {removeSubscription(userInfo._id)}}>
								Remove Subscription
							</button>
						</li>
					}
					{(!data.isSubscribed && !data.isConnected) &&
						<li>
							<button className={`buttonDefault`} 
							onClick={()=> {requestSubscription(userInfo._id)}}>
								{userInfo.privacySetting == 'Half' ? 'Request Subscription' : 'Subscribe'}
							</button>
						</li>
					}
			

					<li id="close">
						<button className="buttonDefault" onClick={()=> {
								let optionsMenu = document.getElementById('profileOptions');
								optionsMenu.classList.add('leave')

								let delay = setTimeout(()=> {
									setOptions()
								}, 150);
							}}>⨉</button>
					</li>
				</ul>
			}


			{current.gallery.length > 0 &&
          		<DragSlider current={current} setCurrent={setCurrent} siteLocation={'home'}/>
        	}
			{fullList &&
				<FullList 
					data={fullListData.data}
					mode={fullListData.mode}
					source={fullListData.source}
					socketMessage={socketMessage}
					setSocketMessage={setSocketMessage}
					setFullList={setFullList}
					groupID={''}/>
			}
			{notifList &&
	          <NotificationList 
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