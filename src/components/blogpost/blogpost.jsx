import React, { useState, useEffect } from 'react';
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



export default function Blogpost({userID, isReading, set_isReading, userBlog}) {

	// let dateFromObjectId = function (objectId) {
	// 	return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
	// };
	// let postDateInfo = dateFromObjectId(isReading.blogpostID);
	let postInfo = userBlog.log.find(post => post.id == isReading.blogpostID);

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
			postOpen: false
		})
	}

	//where does isReading get read which prompts this component to display/mount?
	return (
		<article id='aBlogpost'>

			<ul id="postDetails"> {/*has an onClick to open menu*/}
				<li>Post Details</li> {/*also has an onClick, but dissappears when open*/}
				<li>
					Entry Posted <span></span> &#38; <span></span>
				</li>
				{/*use whitespace: pre-line for first span element in mobile*/}
				<li className="ownerControls">
					<button>Edit</button>
				</li>
				<li className="ownerControls"> 
					<button>Delete</button>
				</li>
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