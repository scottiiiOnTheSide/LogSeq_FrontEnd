/* * * V I T A L S * * */
import * as React from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import Calendar from '../calendar'
import APIaccess from '../../apiaccess';
import bodyParse from '../bodyParse';
import './blog.css';

/* * * C O M P O N E N T S * * */
import Header from '../../components/base/header';
import Instant from '../../components/notifs/instant';
import InteractionsList from '../../components/notifs/interactionsList';
import FullList from '../../components/base/fullList';

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
	const { postID } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const [postData, setPostData] = React.useState(location.state.post);
	const [comments, setComments] = React.useState([]);
	const [commentCount, setCommentCount] = React.useState('');

	let refreshPost = async() => {

		let updateComments = await accessAPI.updateCommentCount(postID);

		let post = await accessAPI.getBlogPost(postID);
		// let commentCount;

		// if(post.commentCount < 10) {
		// 	commentCount = `00${postData.commentCount}`
		// } 
		// else if (post.commentCount > 10 && post.commentCount < 100) {
		// 	commentCount = `0${postData.commentCount}`
		// }
		// post.commentCount = commentCount;
		let comments = await accessAPI.getComments(postID);
		setComments(comments);
		setPostData(post);
	}

	//for submitting comments
	let handleSubmit = async(e) => {
		e.preventDefault();
		let date = new Date();
		let body = {
			ownerUsername: userName,
			ownerID: userID,
			content: messageContent,
			parentPost: postID,
			postedOn_month: date.getMonth() + 1,
			postedOn_day: date.getDate(),
			postedOn_year: date.getFullYear(),
			commentNumber: access.commentNumber,
			profilePhoto: sessionStorage.getItem('profilePhoto')
		}
		let notif = {
				type: 'comment',
				isRead: false,
				senderID: userID,
				senderUsername: userName,
				postURL: postID,
				recipients: [postData.owner],
				details: JSON.stringify({postTitle: postData.title})
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
			notif.details = JSON.stringify({
				postTitle: postData.title,
				commentID: res
			});

			setSocketMessage(notif);
			console.log(notif)
			refreshPost();
		});

		/***
		 * 12. 23. 2023
		 * These do not toggle when user makes response to their own comment...
		 */
		toggleComment();
		toggleOptions();
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
      		type: 'collection',
      		action: 'addToCollection'
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

	let goToProfile = async(userid) => {
		
		let data = await accessAPI.getSingleUser(userid);
		console.log(data.user._id)

		let delay = setTimeout(()=> {
			navigate(`/user/${data.user.userName}`, {
				state: {
					user: data.user,
					pinnedPosts: data.pinnedPosts
				}
			})
		}, 150)
	}

	let goToMacrosPage = async(groupName, groupID) => {

		let tagData = await accessAPI.getTagData(groupID);
		let tagPosts = await accessAPI.groupPosts({action: 'getPosts', groupID: groupID, groupName: groupName});
		let postsCount = tagPosts.length;

		let doesHaveAccess;
		if(tagData.hasAccess) {
			doesHaveAccess = tagData.hasAccess.filter(el => el == userID);
			doesHaveAccess = doesHaveAccess.length > 0 ? true : false;
		}
		
									
		setTimeout(()=> {
			navigate(`/macros/${tagData.name}`, {
					state: {
						name: tagData.name,
						posts: tagPosts,
						macroID: tagData._id,
						isPrivate: tagData.isPrivate,
						hasAccess: doesHaveAccess,
						ownerUsername: tagData.ownerUsername,
						type: tagData.type,
						userCount: tagData.hasAccess ? tagData.hasAccess.length : null,
						postCount: postsCount ? postsCount : 0
					}
				})
		}, 300)
	}

	React.useEffect(()=> {
		refreshPost()
		pinPost('check')
	}, [])

	/***
	 	P o s t D e t a i l s
	***/
	let cal = Calendar();
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
		let content, split;
		let text = [];
		if( Object.keys(postData.content[0]).length > 10 ) {
			for (let char in postData.content[0]) {
				text.push(postData.content[0][char]);
			}
			text = text.join("");
			split = true;
			// console.log(text)
		} else if ( Object.keys(postData.content[0].length < 10)) {
			content = postData.content;
			split = false;
		}


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


		return <li className="comment" key={comment._id} id={comment._id}>

					<button className={`toProfile`} onClick={()=> {goToProfile(comment.ownerID)}}>
						<img src={comment.profilePhoto}/>
						<span>&#64;{comment.ownerUsername}</span>
					</button>
					<h4>{date} @ {timeStamp}</h4>
					<p>{comment.content}</p>

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
			setCommentHeader(`Replying to ${access.commentUsername}`)
		}
		else {
			setCommentHeader('Your Comment');	
		} 
	}, [access])

	/*
		If user visits page via notif concerning comment
	*/
	let commentsRef = React.useRef()
	let commentsCurrent = commentsRef.current;
	React.useEffect(()=> {
		if(commentsCurrent) {
			if(accessID.commentID) {
				let comment = document.getElementById(accessID.commentID);
				console.log(comment);
				comment.scrollIntoView({behavior: "smooth"});
				/* can add class to comment to make it stand out...*/
			}
		}	
	}, [comments, commentsCurrent]);


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
	}, [element]);

	console.log(postData)

	return (
		<section id="POST" ref={el} className={`${enter == true ? '_enter' : ''}`}>
			<Header cal={cal} 
					isReturnable={true} 
					setNotifList={setNotifList} 
					unreadCount={unreadCount}
					siteLocation={"POST"}/>

			<article>

				<button id="open" className={"buttonDefault"}onClick={openDetails}>Post Details</button>
				<div id="details" className={toggleDetails ? "open" : ""}>

					<h4>Entry Posted On</h4>
					<p>{date} @ {timeStamp} UTC</p>

					<ul id="options">
						{isOwner &&
							<li>
								<button>EDIT</button>
							</li>
						}
						{isOwner &&
							<li>
								<button onClick={()=> {
									setSocketMessage({
										action: 'deletePost',
										postID: postData._id
									})
								}}>DELETE</button>
							</li>
						}
						{!isOwner &&
							<li>
								<button>REPORT</button>
							</li>
						}
					</ul>
				</div>


				{/* * * 
					M A I N   C O N T E N T 
				* * */}

				<div id="mainContent">

					{!isOwner &&
						<button className={`toProfile`} onClick={()=> {goToProfile(postData.owner)}}>
							<img src={postData.profilePhoto}/>
							<span>&#64;{postData.author}</span>
						</button>
					}	
					<h2>{postData.title}</h2>

					{/*Would have ul with map of tagged users*/}

					{split &&
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

					{/*Here would be a div wrapper for the tags*/}
				</div>


				<ul id="tagsList">

					{postData.tags.map(tag => (
						<li>
							<button className={`buttonDefault ${tag._id ? 'tag' : ''} ${tag.isPrivate == true ? 'private' : ''}`}
									onClick={(e)=> {
										e.preventDefault()
										goToMacrosPage(tag.name, tag._id);
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

						<li> {/*Comment Button*/}
							<button className="buttonDefault" onClick={()=> {
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
						{isOwner &&
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

						<li> {/*Exit Button*/}
							<button className="buttonDefault" onClick={(e)=> {
								e.preventDefault()
								setTimeout(()=> {
									navigate(-1)
								}, 500)
							}}>Exit Post</button>
						</li> 

						<li> {/* X Button*/}
							<button className="buttonDefault" onClick={()=> {
								let optionsMenu = document.getElementById('optionsMenu');
								optionsMenu.classList.add('leave')

								let delay = setTimeout(()=> {
									toggleOptions()
								}, 150);
							}}>x</button>
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
                current={current}
                setCurrent={setCurrent}
			/>
		</section>
	)

}