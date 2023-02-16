
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
		}
		else if(event.target.name == 'content') {
			let value = event.target.value;
			setPostContent([
				...postContent,
				{ 
					content: event.target.value, 
					index: event.target.dataset.index 
				}		
			])
		}
		else {
			setFormData({
				...formData,
				[event.target.name]: event.target.value,
			})
		}
	}

	const handleSubmit = async(event) => {
		event.preventDefault();

		let response;

		setFormData({
			...formData,
			content: postContent,
		})

		console.log(formData)

		// if(!calendar.date_inView) {
		// 	response = await fetch(`${apiAddr}/posts/createPost`, {
		// 		method: "POST",
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			'Accept': 'application/json',
		// 			'auth-token': userKey
		// 		},
		// 		body: JSON.stringify({
		// 			title: formData.title,
		// 			content: ,
		// 			tags: formData.tags,
		// 			usePostedByDate: true
		// 		})
		// 	})
		// }
		// else if(calendar.date_inView) {
		// 	response = await fetch(`${apiAddr}/posts/createPost`, {
		// 		method: "POST",
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 			'Accept': 'application/json',
		// 			'auth-token': userKey
		// 		},
		// 		body: JSON.stringify({
		// 			title: formData.title,
		// 			content: formData.content,
		// 			tags: formData.tags,
		// 			usePostedByDate: false,
		// 			postedOn_month: calendar.month_inView,
		// 			postedOn_day: calendar.date_inView,
		// 			postedOn_year: calendar.year_inView
		// 		})
		// 	})
		// }

		// const newPost = await response.json();
		// updateLog();
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
			<input id="addImage" type="file" name='image'/>
			<img /> 
		</fieldset>

		return element;
	}
	return (
		//form with title, content tags
		<div id="createPost">
			<form onSubmit={handleSubmit}>
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