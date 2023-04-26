
import React, {useState, useReducer, useEffect} from 'react';
import './userMenu.css';

let count = 0;

function CreatePost({apiAddr, userKey, updateLog, calendar}) {

	const [formData, setFormData] = useState({});
	const [contentCount, setContentCount] = useState([0]);
	const [postContent, setPostContent] = useState([]);

	const handleChange = (event) => {

		if(event.target.name == 'tags') {
			let value = event.target.value;
			let array = value.split(/[, ]+/);
			setFormData({
				...formData,
				[event.target.name]: event.target.value,
			})
		} else if(event.target.name == 'image') {
			setPostContent([
				...postContent,
				{ 
					content: event.target.files[0],
					type: event.target.name, 
					index: event.target.dataset.index 
				}		
			])
		} else if(event.target.name == 'content') {
			setPostContent([
				...postContent,
				{ 
					content: event.target.value,
					type: "text", 
					index: event.target.dataset.index 

				}		
			])
		} else {
			setFormData({
				...formData,
				[event.target.name]: event.target.value,
			})
		}
	}

	const handleSubmit = async(event) => {
		event.preventDefault();

		let response;

		let submission = new FormData();
		submission.append('title', formData.title)
		submission.append('tags', formData.tags)
		for(let i=0; i < postContent.length; i++){
			if(postContent[i].type == 'text') {
				submission.append(`${postContent[i].index}`, postContent[i].content)
			} else if(postContent[i].type == 'image') {
				let content = postContent[i].content;
				submission.append(`${postContent[i].index}`, content)
			}
		}

		for(let obj of submission) {
			console.log(obj)
		}

		if(!calendar.date_inView) {

			submission.append('usePostedByDate', 'true');

			response = await fetch(`${apiAddr}/posts/createPost`, {
				method: "POST",
				headers: {
					// 'Content-Type': 'multipart/form-data; boundary=---logseqmedia',
					// 'Accept': 'multipart/form-data',
					'auth-token': userKey,
				}, 
				body: submission,
			})
		}
		else if(calendar.date_inView) {
			response = await fetch(`${apiAddr}/posts/createPost`, {
				method: "POST",
				headers: {
					'Content-Type': 'multipart/form-data; boundary=---logseqmedia',
					'Accept': 'multipart/form-data',
					'auth-token': userKey
				},
				body: JSON.stringify({
					title: formData.title,
					content: postContent,
					tags: formData.tags? formData.tags : null,
					usePostedByDate: false,
					postedOn_month: calendar.month_inView,
					postedOn_day: calendar.date_inView,
					postedOn_year: calendar.year_inView,
					media: null,
				})
			})
		}

		const newPost = await response.json();
		updateLog();
	}

	const newCombo = (e) => {
		e.preventDefault();
		setContentCount([
			...contentCount,
			count++
		])
		console.log(contentCount);
	}

	let textareaImageAdd = (func, index) => {
		let element = <fieldset key={index} className="textareaImageadd">
			<textarea 
				name="content" 
				placeholder="Content" 
				onBlur={handleChange}
				data-index={index}
				rows="10"
				cols="30">
			</textarea>
			<input 
				id="addImage" 
				onChange={handleChange} 
				type="file" 
				accept="image/"
				name='image' 
				data-index={index + 0.5}/>
			<img /> 
		</fieldset>

		return element;
	}

	return (
		//form with title, content tags
		<div id="createPost">
			<form onSubmit={handleSubmit} encType='multipart/form-data'>
				<fieldset>
					<input name="title" placeholder="Title" onChange={handleChange}/>
					{contentCount.map((element, index) => (
						textareaImageAdd(handleChange, index)
					))}
					<input name="tags" placeholder="tags" onChange={handleChange}/>
				</fieldset>
				<button type="submit">Submit</button>
				<button onClick={newCombo}>New TextArea + ImageAdd</button>
			</form>

			{/*<button onClick={toggleCreateForm}>Close</button>*/}
		</div>
	)
}


export default function UserMenu(
	{apiAddr, userKey, userID, userBlog, socialBlog, Connections, logClasses, calendar, updateNotifs}) {

	let right, left;
	if(logClasses.userEntry == true) {
		right = true;
		left = false;
	} else if (logClasses.socialEntry == true) {
		left = true;
		right = false;
	}

	const [is_createFormOpen, toggleCreateForm] = useReducer(state => !state, false);

	//will pass the read var from State to components, 
	//so that classes / css rules can be added upon change

	return (
		<div id="userMenusWrapper">
			{(right && !left) && 
		 		<CreatePost 
		 			apiAddr={apiAddr}
		 			userKey={userKey}
		 			updateLog={userBlog.updateLog}
		 			calendar={calendar}
		 		/>
		 	}
		 	{(left && !right) &&
		 		<Connections
          			apiAddr={apiAddr}
          			userID={userID}
          			userKey={userKey}
          			updateNotifs={updateNotifs}
          			updateSocialLog={socialBlog.updateLog}
        		/>
		 	}
		</div>
	)

}