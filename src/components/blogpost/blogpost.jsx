import React, { useState, useEffect, useReducer } from 'react';
import Calendar from '../../components/calendar';
import bodyParse from '../bodyParse';
import './blogpost.css';

/*
	On change to isReading variable,
	blogpost element is mounted.
	Read from isReading state var to
	determine which blogpost's info
	to use, and whether reader has
	owner permissions to edit the post
	can put second failsafe in backend,
	if user requesting to update post
	doesnt have same id as post, 
	fail request
*/

function DeletePost ({apiAddr, userKey, postID, title, date, openDelete, backToBlogLog, userBlog}) {

	userKey = userKey;
	postID = postID;
	const [deleteConfirmation, setConfirmation] = useReducer(state => !state, false);
	const deletePost = async(event) => {
		event.preventDefault();

		const response = await fetch(`${apiAddr}/posts/deletePost?id=${postID}`, {
			method: "DELETE",
			headers: {
				// 'Content-Type': 'application/json',
				// 'Accept': 'application/json',
				'auth-token': userKey
			}
		})

		let setIt = await response.json();
		setConfirmation(setIt);
		console.log(deleteConfirmation);
	}
	
	return (
		<div id="delete">

			{!deleteConfirmation &&
				<div id="alert">
					<span>operation:</span>
					<h2>Delete Post</h2>
					<h3>"{title}"</h3>
					<p>Posted on: {date}</p>

					<div id="optionsWrapper">
						<p>Are you sure you wish to delete this post?</p>
						<button onClick={openDelete}>Cancel</button>
						<button onClick={deletePost}>Delete Post</button>
					</div>
				</div>
			}
			{deleteConfirmation &&
				<div id="confirmed">
					<h2>It's Gone</h2>
					<button onClick={backToBlogLog}>Return</button>
				</div>
			}

		</div>
	)
}

const formReducer = (state, event) => {
	return {
		...state,
		[event.name]: event.value
	}}

function UpdatePost ({apiAddr, userKey, postID, title, date, openUpdate, backToBlogLog, userBlog, postInfo}) {

	userKey = userKey;
	postID = postID;
	const [updateConfirmation, setConfirmation] = useReducer(state => !state, false);
	const [formData, setFormData] = useReducer(formReducer, {});

	const [inputValues, setInputValues] = useState({
		title: '',
		content: '',
		tags: ''
	})

	const handleChange = (event) => {

		if(event.target.name == 'tags') {
			let value = event.target.value;
			let array = value.split(/[, ]+/);
			setFormData({
				name: event.target.name,
				value: array
			})
			setInputValues({
				...inputValues,
				tags: event.target.value,
			})

		} else if (event.target.name == 'title') {
			setFormData({
				name: event.target.name,
				value: event.target.value
			})
			setInputValues({
				...inputValues,
				title: event.target.value,
			})
		} else if (event.target.name == 'content') {
			setFormData({
				name: event.target.name,
				value: event.target.value
			})
			setInputValues({
				...inputValues,
				content: event.target.value,
			})
		}
		else {
			setFormData({
				name: event.target.name,
				value: event.target.value
			})
		}
	}
	const updatePost = async(event) => {

		event.preventDefault()

		const response = await fetch(`${apiAddr}/posts/updatePost?id=${postID}`, {
			method: "PATCH",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'auth-token': userKey
			},
			body: JSON.stringify({
				title: formData.title,
				content: formData.content,
				tags: formData.tags,
				usePostedByDate: true
			})
		})

		let setIt = await response.json();
		setConfirmation(setIt);
		userBlog.updateLog();
		console.log(updateConfirmation);
	}

	const taglist = () => {
		let tags = '';
		for(let i = 0; i < postInfo.tags.length; i++) {
			tags = tags+ ' ' +postInfo.tags[i];
		}
		return tags;
	}
	let tags = taglist();
	

	return (
		<div id="update">
			{!updateConfirmation &&
				<div id="alert">
					<span>operation:</span>
					<h2>Delete Post</h2>
					<h3>"{title}"</h3>
					<p>Posted on: {date}</p>

					<form onSubmit={updatePost}>
						<fieldset>
							<input name="title" defaultValue={postInfo.title} 
							onChange={(event) => handleChange(event)}/>
							<textarea 
								name="content" 
								defaultValue={postInfo.content} 
								onChange={handleChange}
								rows="10"
								cols="30"></textarea>
							<input name="tags" defaultValue={tags} onChange={handleChange}/>
						</fieldset>
						<button type="submit">Submit</button>
						<button onClick={(event) => {openUpdate(); event.preventDefault()}}>Cancel</button>
					</form>
				</div>
			}
			{updateConfirmation &&
				<div id="confirmed">
					<h2>Post Updated!</h2>
					<button onClick={backToBlogLog}>Return</button>
				</div>
			}
		</div>
	)
}

export default function Blogpost({apiAddr, userKey, userID, isReading, set_isReading, userBlog, socialBlog, toggleMainMenu, monthLog}) {

	let postInfo; 

	if (isReading.isOwner == true) {
		if(isReading.monthLog == true) {
			postInfo = monthLog.find(post => post._id == isReading.blogpostID);
		} else {
			postInfo = userBlog.log.find(post => post._id == isReading.blogpostID);
		}
	} else if (isReading.isOwner == false) {
		if(isReading.monthLog == true) {
			postInfo = monthLog.find(post => post._id == isReading.blogpostID);
		} else {
			postInfo = socialBlog.log.find(post => post._id == isReading.blogpostID);	
		}
		
	}

	let postIDlength = postInfo._id.length;
	let postID = postInfo._id.slice(0, postIDlength);

	let dateInfo = new Date(postInfo.createdAt.slice(0, -1));
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
	let timestamp = hour+ ":" +minute+ " " +AoP;

	let title = postInfo.title;
	let tags = postInfo.tags.map((tag) => <li key="tag">{tag}</li>);
	//key should be tag.id while it's name is displayed
	//console is currently saying keys are the same?
	let id = postInfo._id;
	let owner = postInfo.owner;
	let content;
	if(postInfo.content.match(/\((.*?)\)/g)) {
		content = bodyParse(postInfo.content);
	} else {
		content = postInfo.content
	}

	let backToBlogLog = () => {
		set_isReading({
			...isReading,
			blogpostID: null,
			postOpen: false
		})
		userBlog.updateLog();
	}	

	const [revealInfo, setRevealInfo] = useReducer(state => !state, false);
	const [deleteOpen, openDelete] = useReducer(state => !state, false);
	const [updateOpen, openUpdate] = useReducer(state => !state, false);
	/*
		09. 02. 2022
		Will need to use toggleMainMenu in functions for toggling edit and delete pages
	*/

	return (
		<article id='blogpost'>

			{deleteOpen &&
				<DeletePost 
					postID={postID}
					title={title}
					date={date}
					apiAddr={apiAddr}
					userKey={userKey}
					openDelete={openDelete}
					backToBlogLog={backToBlogLog}
					userBlog={userBlog}/>
			}
			{updateOpen &&
				<UpdatePost 
					postID={postID}
					title={title}
					date={date}
					apiAddr={apiAddr}
					userKey={userKey}
					openUpdate={openUpdate}
					backToBlogLog={backToBlogLog}
					userBlog={userBlog}
					postInfo={postInfo}/>
			}

			<ul id="postDetails"> {/*has an onClick to open menu*/}
				<li id="toggle">
					<button onClick={setRevealInfo}>Post Details</button> {/*also has an onClick, but dissappears when open*/}
				</li>

				{revealInfo &&
					<ul id="info">
						<li>
							Entry Posted
						</li>
						<li>
							<span>{date}</span> &#64; <span>{timestamp}</span>
						</li>
						
						{isReading.isOwner &&
							<li>
								<ul>
									<li className="ownerControls">
										<button onClick={openUpdate}>Edit</button>
									</li>
									<li className="ownerControls"> 
										<button onClick={openDelete}>Delete</button>
									</li>
								</ul>
							</li>
						}
					</ul>
				}
			</ul>

			<h1>{postInfo.title}</h1>

			<p dangerouslySetInnerHTML={{ __html: content }}></p>

			<div id="metabox">
				<ul id="tags">
					{tags}
				</ul>
				<ul id="users">
					{/*dynamically add any tagged users here, if any*/}
				</ul>
			</div>

			<div id="menuWrapper">
				<button onClick={backToBlogLog}>Exit</button> 
				{/*just this, for now...*/}
			</div>

			{/*Will possibly create an outside function for comments, ITF (in the future)*/}


		</article> 
	)
}