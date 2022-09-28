
import React, {useState, useReducer, useEffect} from 'react';
import './userMenu.css';

function LogControls({toggleCreateForm, toggleConnections, logClasses}) {

	//Later, will add read variables from these states so that
	//classes can be added / removed upon toggling

	let toggleOne = toggleCreateForm;
	let right, left;

	// useEffect(()=> {
		if(logClasses.userEntry == true) {
			right = true;
			left = false;
		} else if (logClasses.socialEntry == true) {
			left = true;
			right = false;
		}
	// }, [])

	return (
		<ul id="logControls">
			{(right && !left) &&
				<li>
					<button onClick={toggleCreateForm}>Create Post</button>
				</li> 
			}
			{(left && !right) &&
				<li>
					<button onClick={toggleConnections}>Manage Connections</button>
				</li> 
			}
		</ul>
	)
}

const formReducer = (state, event) => {
	return {
		...state,
		[event.name]: event.value
	}
}

function CreateForm({apiAddr, user, updateLog, toggleCreateForm}) {

	const [formData, setFormData] = useReducer(formReducer, {});

	const handleChange = (event) => {

		if(event.target.name == 'tags') {
			let value = event.target.value;
			let array = value.split(/[, ]+/);
			setFormData({
				name: event.target.name,
				value: array
			})
		}
		else {
			setFormData({
				name: event.target.name,
				value: event.target.value
			})
		}
	}

	const handleSubmit = async(event) => {
		event.preventDefault();

		console.log(formData);

		const response = await fetch(`${apiAddr}/posts/createPost`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'auth-token': user
			},
			body: JSON.stringify({
				title: formData.title,
				content: formData.content,
				tags: formData.tags,
				usePostedByDate: true
			})
		})

		const newPost = await response.json();
		updateLog();
	}

	return (
		//form with title, content tags
		<div id="createPost">
			<form onSubmit={handleSubmit}>
				<fieldset>
					<input name="title" placeholder="Title" onChange={handleChange}/>
					<textarea 
						name="content" 
						placeholder="Content" 
						onChange={handleChange}
						rows="10"
						cols="30"></textarea>
					<input name="tags" placeholder="tags" onChange={handleChange}/>
				</fieldset>
				<button type="submit">Submit</button>
			</form>

			<button onClick={toggleCreateForm}>Close</button>
		</div>
	)
}


export default function UserMenu({apiAddr, user, userBlog, toggleConnections, logClasses}) {

	const [is_createFormOpen, toggleCreateForm] = useReducer(state => !state, false);
	// const [is_updateListOpen, toggleUpdateList] = useReducer(state => !state, false);
	// const [is_deleteListOpen, toggleDeleteList] = useReducer(state => !state, false);

	//will pass the read var from State to components, 
	//so that classes / css rules can be added upon change

	return (
		<div id="userMenu">
			<LogControls 
				toggleCreateForm={toggleCreateForm}
				toggleConnections={toggleConnections}
				logClasses={logClasses}/>

			{is_createFormOpen &&
				<CreateForm 
					apiAddr={apiAddr} 
					user={user} 
					updateLog={userBlog.updateLog}
					toggleCreateForm={toggleCreateForm}/>
			}
		</div>		
	)

}