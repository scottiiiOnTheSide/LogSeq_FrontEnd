
import React, {useState, useReducer, useEffect} from 'react';
import './userMenu.css';


function CreatePost({apiAddr, userKey, updateLog, calendar}) {

	const [formData, setFormData] = useState({});
	const [content, setContent] = useState([
		{
			content: null,
			index: null
		}
	]);
	let contents = [];

	const handleChange = (event, index) => {

		if(event.target.name == 'tags') {
			let value = event.target.value;
			let array = value.split(/[, ]+/);
			setFormData({
				...formData,
				name: event.target.name,
				value: array
			})
		}
		else {
			setFormData({
				...formData,
				name: event.target.name,
				value: event.target.value
			})
		}
	}

	const handleSubmit = async(event) => {
		event.preventDefault();

		// console.log(formData);

		let response;

		if(!calendar.date_inView) {
			response = await fetch(`${apiAddr}/posts/createPost`, {
				method: "POST",
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
		}
		else if(calendar.date_inView) {
			response = await fetch(`${apiAddr}/posts/createPost`, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'auth-token': userKey
				},
				body: JSON.stringify({
					title: formData.title,
					content: formData.content,
					tags: formData.tags,
					usePostedByDate: false,
					postedOn_month: calendar.month_inView,
					postedOn_day: calendar.date_inView,
					postedOn_year: calendar.year_inView
				})
			})
		}

		const newPost = await response.json();
		updateLog();
	}

	const newCombo = (e) => {
		e.preventDefault();

		setContent([
			...content,
			{
				content: null,
				index: null,
			}
		])
		console.log(content);
	}

	let textareaImageAdd = () => {
		let element = <fieldset className="textareaImageadd">
			<textarea 
				name="content" 
				placeholder="Content" 
				onChange={handleChange}
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
					{content.map((element, index) => (
						textareaImageAdd()
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