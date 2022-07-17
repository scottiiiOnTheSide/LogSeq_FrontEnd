
import React, {useState, useReducer} from 'react';
import './userMenu.css';

const formReducer = (state, event) => {
	return {
		...state,
		[event.name]: event.value
	}
}

function LogControls({toggleCreateForm, toggleUpdateList, toggleDeleteList}) {

	//Later, will add read variables from these states so that
	//classes can be added / removed upon toggling

	let toggleOne = toggleCreateForm;

	return (
		<ul id="logControls">
			<li>
				<button onClick={toggleCreateForm}>Create</button>
			</li> 
			<li>
				<button onClick={toggleUpdateList}>Update</button>
			</li>
			<li>
				<button onClick={toggleDeleteList}>Delete</button>
			</li>
		</ul>
	)
}

function CreateForm({apiAddr, user, updateLog}) {

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
					<input name="content" placeholder="Content" onChange={handleChange}/>
					<input name="tags" placeholder="tags" onChange={handleChange}/>
				</fieldset>
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}

function UpdateList() {}

function DeleteList() {}

export default function UserMenu({apiAddr, user, userBlog}) {

	const [is_createFormOpen, toggleCreateForm] = useReducer(state => !state, false);
	const [is_updateListOpen, toggleUpdateList] = useReducer(state => !state, false);
	const [is_deleteListOpen, toggleDeleteList] = useReducer(state => !state, false);

	//will pass the read var from State to components, 
	//so that classes / css rules can be added upon change

	return (
		<div id="userMenu">
			<LogControls 
				toggleCreateForm={toggleCreateForm}
				toggleUpdateList={toggleUpdateList}
				toggleDeleteList={toggleDeleteList}/>

			{is_createFormOpen &&
				<CreateForm apiAddr={apiAddr} user={user} updateLog={userBlog.updateLog}/>
			}
			{is_updateListOpen &&
				<UpdateList />
			}
			{is_deleteListOpen &&
				<DeleteList />
			}
		</div>		
	)

}