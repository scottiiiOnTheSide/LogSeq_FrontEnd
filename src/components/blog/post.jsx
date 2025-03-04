/* * * V I T A L S * * */
import * as React from 'react';
import {useParams, useLocation, useNavigate, useLoaderData} from 'react-router-dom';
import CalInfo from '../calInfo'
import APIaccess from '../../apiaccess';
import bodyParse from '../bodyParse';
import './blog.css';

/* * * C O M P O N E N T S * * */
import Header from '../../components/base/header';
import Instant from '../../components/notifs/instant';
import NotificationsList from '../../components/notifs/notifsList';
import FullList from '../../components/base/fullList';
import DragSlider from '../../components/base/dragSlider';

const accessAPI = APIaccess(); 

export function EditPost({ postData }) {

	/**
	 * 11. 29. 2023
	 * 
	 * content is present within textboxes as the default values
	 * images have "delete" and "pin options"
	 * 
	 * on save,
	 * array of objects 
	 */
}

export default function Post({
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
	setCurrent,
	current
}) {
	const userID = sessionStorage.getItem('userID');
	const data = useLoaderData();
	// console.log(data);
	const { postID } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	// const [postData, setPostData] = React.useState(location.state.post);
	const [postData, setPostData] = React.useState(data);
	const [comments, setComments] = React.useState([]);
	const [commentCount, setCommentCount] = React.useState('');

	let refreshPost = async() => {

		let updateComments = await accessAPI.updateCommentCount(postID);

		let post = await accessAPI.getBlogPost(postID);

		let comments = await accessAPI.getComments(postID);
		setComments(comments);
		setPostData(post);
	}

	//for submitting comments
	let handleSubmit = async(e) => {
		e.preventDefault();
		let date = new Date();
		let body = { //comment body
			ownerUsername: userName,
			ownerID: userID,
			content: messageContent,
			parentPost: postID,
			postedOn_month: date.getMonth() + 1,
			postedOn_day: date.getDate(),
			postedOn_year: date.getFullYear(),
			commentNumber: access.commentNumber,
			profilePhoto: sessionStorage.getItem('profilePhoto'),
			respondeeId: access.commentOwner,
			postOwner: postData.owner
		}
		let notif = { //notification body
				type: 'comment',
				isRead: false,
				senderID: userID,
				senderUsername: userName,
				postURL: postID,
				recipients: [postData.owner],
				postTitle: postData.title,
				postOwner: postData.owner
		}

		if(access.type == 'initial') {

			body.parentID = postID;
			notif.message = 'initial';

		} else if (access.type == 'response') {

			body.parentComment = access.commentID;
			if(access.commentOwner == userID) {
				//removes post owner from notifList if user responds to their own comment
				notif.recipients.shift(); 
			}
			if(postData.owner != access.commentOwner) {
				notif.recipients.push(access.commentOwner);
			}
			notif.message = 'response';
		}

		let request = await accessAPI.postComment(access.type, postID, body).then(res => {
			console.log(res)
			notif.commentID = res;

			setSocketMessage(notif);
			console.log(notif)
			refreshPost();
		});

		toggleComment();
		// toggleOptions();
	}

	let deleteComment = async(commentID) => {

		setSocketMessage({
			action: 'deleteComment',
			commentID: commentID
		})

	}

	let getCollections = async()=> {
		let collections = await accessAPI.getMacros('collections');
		let filtered = collections.map(item => {
            if(item.posts.includes(postID)) {
                return {
                	...item,
                    hasThisPost: true,
			    }
            }
            else {
            	return {
                    ...item,
                    hasThisPost: false
                }
            }
        })
		setCollections(filtered);
	}

	let addToCollections = (collectionID)=> {

		let body = {
			groupID: collectionID == undefined ? collections[0]._id : collectionID,
      		postID: postID,
      		action: 'addToCollection',
      		type: 'collection',
      		postOwner: postData.owner
		}
		setSocketMessage(body);
	}

	let removeFromCollections = (collectionID) => {

		let body = {
			groupID: collectionID == undefined ? collections[0]._id : collectionID,
      		postID: postID,
      		type: 'collection',
      		action: 'removeFromCollection'
		}
		setSocketMessage(body);
	}

	let pinPost = async(condition) => {

		if(condition == 'check') {

			// run api request checking whether postID is within user's pinnedPosts array
			let request = await accessAPI.userSettings({
				option: 'pinnedPosts',
				type: 'check',
				postID: postID
			}).then(data => {
				if(data.confirmation == true) {
					setPinnedPost('true')
				}
			})
		}
		else if(condition == 'add') {

			let request = await accessAPI.userSettings({
				option: 'pinnedPosts',
				type: 'add',
				postID: postID
			});

			if(request.confirmation == true) {
				setPinnedPost('true');
				setSocketMessage({
					type: 'simpleNotif',
					message: 'Post added to Pinned Posts'
				})
			}
		}
		else if(condition == 'remove') {
			let request = await accessAPI.userSettings({
				option: 'pinnedPosts',
				type: 'remove',
				postID: postID
			});

			if(request.confirmation == true) {
				setPinnedPost('false')
				setSocketMessage({
					type: 'simpleNotif',
					message: 'Post removed from Pinned Posts'
				})
			}
		}
	}

	let goToProfile = async(userID) => {

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

	let goToMacrosPage = async(tag) => {

		let tagInfo = await accessAPI.getTagData(tag._id, tag.name);
		let posts = await accessAPI.groupPosts({action: 'getPosts', groupID: tag._id, groupName: tag.name});
		let postsCount = posts.length;

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
						hasAccess: doesHaveAccess,
						ownerUsername: tagInfo.adminUsernames ? tagInfo.adminUsernames[0] : null,
						ownerID: tagInfo.admins ? tagInfo.admins[0] : null,
						type: tagInfo.type == undefined ? 'topic' : tagInfo.type,
						userCount: tagInfo.hasAccess ? tagInfo.hasAccess.length : null,
						postCount: postsCount ? postsCount : 0
					}
				})
		}, 200)
	}

	/***
	 	P o s t D e t a i l s
	***/
	let cal = CalInfo();
		let dateInfo = new Date(postData.createdAt.slice(0, -1));
		let date = dateInfo.toString().slice(4, 15);
		let hour = dateInfo.toString().slice(16, 18);
		let minute = dateInfo.toString().slice(19, 21);
		let AoP;
		if(hour > 12) {
			AoP = 'pm';
			hour = hour - 12;
		} else {
			AoP = 'am';
		}
		let timeStamp = hour+ ":" +minute+ " " +AoP;
		let userName = sessionStorage.getItem('userName');
		let isOwner = postData.owner == userID ? true : false;

		//to be removed once old posts gone
		// let content, split;
		// let text = [];
		// if( Object.keys(postData.content[0]).length > 10 ) {
		// 	for (let char in postData.content[0]) {
		// 		text.push(postData.content[0][char]);
		// 	}
		// 	text = text.join("");
		// 	split = true;
		// 	// console.log(text)
		// } else if ( Object.keys(postData.content[0].length < 10)) {
		// 	content = postData.content;
		// 	split = false;
		// }


	/*** 
	  	C o m p o n e n t  F u n c t i o n a l i t y
	***/
	const [notifList, setNotifList] = React.useReducer(state => !state, false);
	const [toggleDetails, openDetails] = React.useReducer(state => !state, false);
	const [isOptionsOpen, toggleOptions] = React.useReducer(state => !state, false);
	const [isComment, toggleComment] = React.useReducer(state => !state, false);
	const [isCollections, toggleCollections] = React.useReducer(state => !state, false);
	const [messageContent, setMessage] = React.useState('');
	const [collections, setCollections] = React.useState([]);
	const [pinnedPost, setPinnedPost] = React.useState('');
	const [pinnedMedia, setPinnedMedia] = React.useReducer(state => !state, false);
	const [access, setAccess] = React.useState({
		type: null, //"initial" or "response"
		commentID: null, 
		commentNumber: null,
		commentOwner: null, //owner id
		commentUsername: null,
	})
	const [commentHeader, setCommentHeader] = React.useState('');

	let optionsButton = React.useRef();

	let handleMessage = (e) => {
		setMessage(e.target.value);
	}

	let createComment = (comment) => {

		let date = `${comment.postedOn_month}. ${comment.postedOn_day}. ${comment.postedOn_year}`;

		let dateInfo = new Date(comment.createdAt.slice(0, -1));
		let datee = dateInfo.toString().slice(4, 15);
		let hour = dateInfo.toString().slice(16, 18);
		let minute = dateInfo.toString().slice(19, 21);
		if(hour > 12) {
			AoP = 'pm';
			hour = hour - 12;
		} else {
			AoP = 'am';
		}
		let timeStamp = hour+ ":" +minute+ " " +AoP;
		// let timeStamp;
		let deleted = comment.ownerID == '' ? true : false;


		return <li className="comment" key={comment._id} id={comment._id}>

					<button className={`toProfile`} onClick={()=> {goToProfile(comment.ownerID)}}>
						{!deleted &&
							<img src={comment.profilePhoto}/>
						}
						{!deleted &&
							<span>&#64;{comment.ownerUsername}</span>
						}
					</button>
					<h4>{date} @ {timeStamp}</h4>
					<p>{comment.content}</p>

					<div id="optionsWrapper">
						<button className="buttonDefault"
							onClick={()=> {

								setAccess({
									type: 'response',
									commentID: comment._id,
									commentNumber: `${comment.commentNumber} - ${comment.replies.length + 1}`,
									commentOwner: comment.ownerID,
									commentUsername: comment.ownerUsername
								});

								toggleComment()
						}}>Reply</button>

						{comment.ownerID == userID &&
							<button className="buttonDefault" onClick={()=> {deleteComment(comment._id)}}>
								Delete	
							</button>
						}

					</div>
					
					{comment.replies &&
						<ul id="replies">
							{comment.replies.map(comment => (
								createComment(comment)
							))}
						</ul>
					}
			</li>
	}

	/* Changes header of Comment Box based on whether initial comment
		or response */
	React.useEffect(()=> {
		if(access.type == 'response') {
			setCommentHeader(`Replying to @${access.commentUsername}`)
		}
		else {
			setCommentHeader('Your Comment');	
		} 
	}, [access])

	React.useEffect(()=> {
		if(socketMessage.message == 'deletedComment') {
			refreshPost();
		}
	}, [socketMessage])

	/*
		If user visits page via notif concerning comment
	*/
	let commentsRef = React.useRef()
	let commentsCurrent = commentsRef.current;
	React.useEffect(()=> {

		let goToComment = location.state.commentID ? location.state.commentID : null;

		if(goToComment != null) {

			console.log('we has comment');

			if(commentsCurrent) {
				let comment = document.getElementById(location.state.commentID);
				console.log(comment);
				comment.scrollIntoView({behavior: "smooth"});
				/* can add class to comment to make it stand out...*/
			}
		}	
	}, [comments]);


	/*
		Transition Effect for Arriving on page
	*/
	const [enter, setEnter] = React.useReducer(state => !state, true);
	const initialLoad = React.useRef(true);
	let hasLoaded = initialLoad.current;
	const el = React.useRef()
	const element = el.current;

	React.useEffect(()=> {
		if(hasLoaded) {
			console.log(hasLoaded);
			if(element) {
				setEnter();
			}
			hasLoaded = false;
			return
		}

		getCollections();
		console.log(postData);
	}, [element]);


	React.useEffect(()=> {
		refreshPost()
		pinPost('check')
		
		document.title = 'Syncseq.xyz/post';

		if(current.gallery.length > 0) {
			setCurrent({
				...current,
				gallery: []
			})
			console.log('true');
		}
	}, [])


	return (
		<section id="POST" ref={el} className={`${enter == true ? '_enter' : ''}`}>
			<Header cal={cal} 
					isReturnable={true} 
					setNotifList={setNotifList} 
					unreadCount={unreadCount}
					siteLocation={"POST"}/>

			<article>
				{/* * * 
					M A I N   C O N T E N T 
				* * */}
				<div id="mainContent">

					{!isOwner &&
						<button className={`toProfile`} onClick={()=> {goToProfile(postData.owner)}}>
							<img src={postData.profilePhoto}/>
							<span>&#64;{postData.author} 
							{postData.taggedUsers.length > 0 &&
								<span>{` with ${postData.taggedUsers.length} other ${postData.length > 1 ? 's' : ''}`}</span>
							}
							</span>
						</button>
					}	
					<h2>{postData.title}</h2>

					{/*Would have ul with map of tagged users*/}

					{/*{split &&
						<p>{text}</p>
					}
					{!split &&
						content.map((data) => {
								if(data.type == 'text') {
									if(data.content.match(/\((.*?)\)/g)) {
										return (<p dangerouslySetInnerHTML={{ __html: bodyParse(data.content)}} key={data.place}></p>)
									} else {
										return (<p dangerouslySetInnerHTML={{ __html: data.content}} key={data.place}></p>)
									}
								} else if(data.type == 'media') {
									return <img src={data.content}/>
								}
							}
						)
					}
					*/}
					
					{postData.content.map((data) => {
						if(data.type == 'text') {
							if(data.content.match(/\((.*?)\)/g)) {
								return (<p dangerouslySetInnerHTML={{ __html: bodyParse(data.content)}} key={data.place}></p>)
							} else {
								return (<p dangerouslySetInnerHTML={{ __html: data.content}} key={data.place}></p>)
							}
						} else if(data.type == 'media') {
							return <img src={data.content} onClick={(e)=> {
								e.stopPropagation();

								let gallery = postData.content.filter(data => data.type === 'media')
  									.map(data => ({
    									...data,   // Spread existing properties
    									postID: postData._id 
  									}));

								setCurrent({
									...current,
									gallery: gallery
								})
							}}/>
						}
					})}
				</div>


				{/* * * 
					T A G S L I S T
				* * */}
				<ul id="tagsList" className={`${postData.tags.length > 3 ? 'alot' : ''}`}>

					{postData.tags.map((tag, index) => (
						<li>
							<button className={`buttonDefault ${tag._id ? 'tag' : ''} ${tag.isPrivate == true ? 'private' : ''}`}
									onClick={(e)=> {
										e.preventDefault()
										goToMacrosPage(tag);
									}}>
								{tag.name}
							</button>
						</li>
					))}
				</ul>


				{/* * * 
					C O M M E N T S 
				* * */}
				<div id="commentsWrapper">
					<h2>
						{postData.commentCount < 10 &&
							<span id="commentCount">00{postData.commentCount}</span>
						}
						{(postData.commentCount > 10 && postData.commentCount > 100) &&
							<span id="commentCount">0{postData.commentCount}</span>
						}
						Comments
					</h2>

					<ul id="commentBox" ref={commentsRef}>
						{comments.map(comment => (
							createComment(comment)
						))}
					</ul>
				</div>
			</article>



			{/* * * 
					M E N U   
			* * */}
			<div id='optionsBar'>
				<button id="optionsToggle"className="buttonDefault" ref={optionsButton} onClick={toggleOptions}>OPTIONS</button>

				{isOptionsOpen &&
					<ul id="optionsMenu">

						{/* * * 
							I N F O 
						* * */}
						<li id="info">
							<h4>Entry Posted On</h4>
							<p>{date} @ {timeStamp} UTC</p>

							{postData.taggedUsers.length > 0 &&
								<ul>
									<li>Tagged Users: </li>
									{postData.taggedUsers.map(user => (
										<li>
											<button className={`buttonDefault`}
													onClick={()=> {goToProfile(user._id)}}>
												@{user.username}
											</button>
										</li>
									))}
								</ul>
							}
						</li>

						<li> {/*Comment Button*/}
							<button className="buttonDefault" onClick={()=> {
								toggleOptions();
								toggleComment(); 
								console.log(comments.length)
								setAccess({
									type: 'initial',
									commentNumber: `${comments.length + 1}`
								})

							}}>Comment</button>
						</li>

						<li> {/*Bookmark Button*/}
							<button className={`buttonDefault ${collections[0].hasThisPost == true ? '_inactive' : ''}`} 
									onClick={(e)=> {
										e.preventDefault()
										if(collections[0].hasThisPost == true) {
											removeFromCollections()
										} else {
											addToCollections()
										}
										let delay = setTimeout(()=> {
											toggleOptions()
											getCollections()
										}, 150);
							}}>Bookmark</button>
						</li>

						<li>{/*Add to Collections Button*/}
							<button className="buttonDefault" onClick={(e)=> {
								e.preventDefault();
								toggleCollections();
								let delay = setTimeout(()=> {
									toggleOptions()
								}, 50);
							}}>Add to Collection</button>
						</li>

						{isOwner &&
							<li>{/*Pin Post Button*/}
								<button className={`buttonDefault ${pinnedPost == 'true' ? '_inactive' : ''}`}  onClick={(e)=> {
									e.preventDefault();
									
									if(pinnedPost == 'true') {
										pinPost('remove');
										setPinnedPost('false');
									} else {
										pinPost('add');
										setPinnedPost('true');
									}

									let delay = setTimeout(()=> {
										toggleOptions()
									}, 50);
								}}>Pin Post</button>
							</li>
						}
						{(isOwner && postData.content.some(piece => piece.type == 'media')) &&
							<li>{/*Pin Media Button*/}
								<button className={`buttonDefault`} 
										onClick={(e)=> {
											e.preventDefault()
											setPinnedMedia()
											let delay = setTimeout(()=> {
												toggleOptions()	
											}, 200)
										}}>
								Pin Media</button>
							</li>
						}
						{isOwner &&
							<li>
								<button className={`buttonDefault`} 
										onClick={(e)=> {
											e.preventDefault()
											toggleOptions()
											setSocketMessage({
												action: 'deletePost',
												postID: postData._id
											})
										}}>
								Delete</button>
							</li>
						}

						<li> {/*Exit Button*/}
							<button className="buttonDefault" onClick={(e)=> {
								e.preventDefault()
								setTimeout(()=> {
									navigate(-1)
								}, 500)
							}}>Exit Post</button>
						</li> 

						<li> {/* X Button*/}
							<button className={`buttonDefault`} id="exit" onClick={()=> {
								let optionsMenu = document.getElementById('optionsMenu');
								optionsMenu.classList.add('leave')

								let delay = setTimeout(()=> {
									toggleOptions()
								}, 150);
							}}>⨉</button>
						</li>
					</ul>
				}
				

				{isComment &&
					<form onSubmit={handleSubmit}>
						<h3>{commentHeader}</h3>
						<textarea name="content" rows="10" onChange={handleMessage}></textarea>

						<div id="buttonBox">
							<button className="buttonDefault" onClick={toggleComment}>Close</button>
							<button className="buttonDefault" type="submit">Submit</button>
						</div>
					</form>
				}
				{isCollections &&
						<ul id="collections">
							{collections.map((item, index) => (
								<li key={item._id}>
									<button className={`buttonDefault ${collections[index].hasThisPost == true ? '_inactive' : ''}`}
											onClick={(e)=> {

												e.preventDefault()
												if(collections[index].hasThisPost == true) {
													removeFromCollections(item._id)
												} else {
													addToCollections(item._id)
												}
												let delay = setTimeout(()=> {
													// toggleOptions()
													toggleCollections()
													getCollections()
												}, 150);
											}}>{item.name}
									</button>
								</li>
							))
							}
							<li>
								<button className={`buttonDefault`} 
										onClick={()=> {

											toggleCollections()
											let delay = setTimeout(()=> {
												toggleOptions()
											}, 50);
								}}>x</button>
							</li>
						</ul>

				}
			</div>

			{current.gallery.length > 0 &&
				<DragSlider current={current} setCurrent={setCurrent} siteLocation={'post'}/>
			}
			{pinnedMedia &&
				<FullList 
					data={postData}
					mode={'pinMedia'}
					source={postData.title}
					socketMessage={socketMessage}
					setSocketMessage={setSocketMessage}
					setFullList={setPinnedMedia}
					groupID={postID}/>
			}
			{notifList &&
	          <NotificationsList 
	            setNotifList={setNotifList} 
	            unreadCount={unreadCount}
	            setUnreadCount={setUnreadCount}
	            setSocketMessage={setSocketMessage}
	            accessID={accessID}
	            setAccessID={setAccessID}/>
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
                current={current}
                setCurrent={setCurrent}
			/>
		</section>
	)

}