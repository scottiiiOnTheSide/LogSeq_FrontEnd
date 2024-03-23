/* * * V I T A L S * * */
import * as React from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import Calendar from '../calendar'
import APIaccess from '../../apiaccess';
import bodyParse from '../bodyParse';
import './blog.css';

/* * * C O M P O N E N T S * * */
import Header from '../../components/home/header';
import Instant from '../../components/instants/instant';
import InteractionsList from '../../components/instants/interactionsList';

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
	getUnreadCount
}) {
	let { postID } = useParams();
	let	location = useLocation();
	let navigate = useNavigate();
	let [postData, setPostData] = React.useState(location.state.post);
	let [comments, setComments] = React.useState([]);
	let [commentCount, setCommentCount] = React.useState('');
	// let commentCount;

	let cmntcount = 0;
	let countComments = (comments) => {

		for(let cmnt of comments) {
			cmntcount++;
			countComments(cmnt.replies)
		}
		
		return cmntcount;
	}
	let getPost = async() => {
		let post = await accessAPI.getBlogPost(postID);
		setPostData(post);
		setComments(post.comments)
		let count = countComments(post.comments);
		count = count - (count / 2); //may be able to remove this line in production...

		if(count < 10) {
			count = `00${count}`;
		} else if (count > 100) {
			count = `0${count}`;
		}

		setCommentCount(count)
	};

	/*** 
	 	updates post & comments on initial load and page refresh 
	***/
	React.useEffect(()=> {
		getPost();
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

		let userID = sessionStorage.getItem('userID');
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
	const [access, setAccess] = React.useState({
		type: null, //"initial" or "response"
		commentID: null, 
		commentNumber: null,
		commentOwner: null //owner id
	})
	let optionsButton = React.useRef();

	let handleMessage = (e) => {
		setMessage(e.target.value);
	}
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

			body.parentID = access.commentID;
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
			getPost()
		});

		/***
		 * 12. 23. 2023
		 * These do not toggle when user makes response to their own comment...
		 */
		toggleComment();
		toggleOptions();
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

					<h3>{comment.ownerUsername}</h3>
					<h4>{date} @ {timeStamp}</h4>
					<p>{comment.content}</p>

					<button className="buttonDefault"
							onClick={()=> {

								setAccess({
									type: 'response',
									commentID: comment._id,
									commentNumber: `${comment.commentNumber} - ${comment.replies.length + 1}`,
									commentOwner: comment.ownerID
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

	let getCollections = async()=> {
		let collections = await accessAPI.getMacros('collections');
		collections.shift();
		setCollections(collections);
	}

	let addToBookmarks = ()=> {

		let body = {
			groupID: collections[0]._id,
      		postID: postID,
      		type: 'collection',
      		action: 'addToCollection'
		}
		setSocketMessage(body);
	}
	console.log(collections)

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

	return (
		<section id="POST" ref={el} className={`${enter == true ? '_enter' : ''}`}>
			<Header cal={cal} isReturnable={true} setNotifList={setNotifList} unreadCount={unreadCount}/>

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
						<h4>{postData.author}</h4>
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


				{/* * * 
					C O M M E N T S 
				* * */}
				<div id="commentsWrapper">
					<h2><span id="commentCount">{commentCount}</span>Comments</h2>

					<ul id="commentBox" ref={commentsRef}>
						{comments.map(comment => (
							createComment(comment)
						))}
					</ul>

				</div>
			</article>



			{/* * * 
					O P T I O N S  B A R  
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
							<button className="buttonDefault" onClick={(e)=> {
								e.preventDefault()
								addToBookmarks()
								let delay = setTimeout(()=> {
									toggleOptions()
								}, 150);
							}}>Bookmark</button>
						</li>

						<li>
							<button className="buttonDefault" onClick={(e)=> {
								e.preventDefault();
								toggleCollections();
								let delay = setTimeout(()=> {
									toggleOptions()
								}, 50);
							}}>Add to Collection</button>
						</li>

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
						<h3>Comment #{access.commentNumber}</h3>
						<textarea name="content" rows="10" onChange={handleMessage}></textarea>

						<div id="buttonBox">
							<button className="buttonDefault" onClick={toggleComment}>Close</button>
							<button className="buttonDefault" type="submit">Submit</button>
						</div>
					</form>
				}
				{isCollections &&
						<ul id="collections">
							{collections.map(item => (
								<li key={item._id}>
									<button className={`buttonDefault`}>
										{item.name}
									</button>
								</li>
							))
							}
							<li>
								<button className="buttonDefault" onClick={()=> {
									// let optionsMenu = document.getElementById('optionsMenu');
									// optionsMenu.classList.add('leave')

									toggleCollections()
									let delay = setTimeout(()=> {
										toggleOptions()
									}, 50);
								}}>x</button>
							</li>
						</ul>

				}
			</div>
			

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