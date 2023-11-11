/* * * V i t a l s * * */
import * as React from 'react';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import './sections.css';

let accessAPI = APIaccess();


function DropSelect({tagged, setTagged}) {

	let [active, setActive] = React.useReducer(state => !state, false);

	let returnOption = (option) => {

		let listItem = 
		<li className="option" onClick={()=> {
			setTagged(tagged.map(user => {
				if(user.id == option.id) {

					if(user.selected == false) {
						return {
							...user,
							selected: true
						}
					} else if (user.selected == true){
						return {
							...user,
							selected: false
						}
					}

				} else {
					return user
				}
			}))
		}}>
			<span>•</span>
			<p>{option.userName}</p>
		</li>

		return listItem
	}

	return (
		<div id="taggedUsers">
			{!tagged.some(user => user.selected == true) &&
				<p onClick={()=> {setActive()}}>Tag Connections</p>
			}
			<ul id='selected' onClick={()=> {setActive()}}>
				{tagged.filter(user => user.selected == true).map(user => (
					<li>{user.userName}</li>
				))
				}
			</ul>
			{active &&
				<ul id="options">
					{tagged.map(user => 
						returnOption(user)
					)}
				</ul>
			}
		</div>
	)
}


export function CreatePost({setModal, setSocketMessage, selectedDate}) {

	const userID = sessionStorage.getItem('userID');
	const username = sessionStorage.getItem('userName');
	const [formData, setFormData] = React.useState({});
	const [contentCount, setContentCount] = React.useState([0]);
	const [postContent, setPostContent] = React.useState([]);
	let count = 0;

	const handleChange = (event) => {

		if(event.target.name == 'tags') {
			let value = event.target.value;
			let array = value.split(/[, ]+/);
			setFormData({
				...formData,
				[event.target.name]: event.target.value,
			})
		} 
		else if(event.target.name == 'image') {
			setPostContent([
				...postContent,
				{ 
					content: event.target.files[0],
					type: event.target.name, 
					index: event.target.dataset.index 
				}		
			])
		} 
		else if(event.target.name == 'content') {
			setPostContent([
				...postContent,
				{ 
					content: event.target.value,
					type: "text", 
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

		let submission = new FormData();
		submission.append('title', formData.title)
		submission.append('tags', formData.tags)
		for(let i=0; i < postContent.length; i++){
			if(postContent[i].type == 'text') {
				let content = postContent[i].content;
				submission.append(`${postContent[i].index}`, content)
			} else if(postContent[i].type == 'image') {
				let content = postContent[i].content;
				submission.append(`${postContent[i].index}`, content)
			}
		}

		if(selectedDate.day != null) {
			submission.append('usePostedByDate', false);
			submission.append('postedOn_month', selectedDate.month);
			submission.append('postedOn_day', selectedDate.day);
			submission.append('postedOn_year', selectedDate.year);
		} else {
			submission.append('usePostedByDate', true);
		}	
			console.log(submission);

			let submit = await accessAPI.createPost(submission);

			/*
				do something on confirmation
			*/
			if(submit.confirm == true) {
				console.log("Post submission successful");
				setModal(); //closes the createPost component - should change name within component

				/**
				 * 10. 27. 2023
				 * setSocketMessage here with info for making notif for tagged users
				 */
				if(tagged.some(user => user.selected == true)) {

					let recips = tagged.filter(user => user.selected == true).map(user => {return user.id});

					setSocketMessage({
						type: 'tagging',
						isRead: false,
						senderID: userID,
						senderUsername: username,
						url: submit.postURL,
						message: 'sent',
						postTitle: submit.postTitle,
						recipients: recips
					})

				} else {
					setSocketMessage({
						type: 'confirmation',
						message: 'post'
					})
				}

			} else if(submit == false) {
				console.log('Issue with post submission');
			}
		}


	const newCombo = (e) => {
		e.preventDefault();
		setContentCount([
			...contentCount,
			count++
		])
	}
	const textareaImageAdd = (index) => {

		let element = <fieldset key={index} className="textareaImageAdd">
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
		</fieldset>

		return element;
	}
	const getConnections = async() => {
		let request = await accessAPI.getConnections();
		request.forEach(user => {
			user.selected = false;
		})
		setTagged(request);
	}
	React.useEffect(()=> {
		getConnections();
	}, []);

	const [tagged, setTagged] = React.useState([
		{
			userName: 'One',
			userID: 123,
			selected: false
		},
		{
			userName: 'Two',
			userID: 456,
			selected: false
		},
		{
			userName: 'Three',
			userID: 789,
			selected: false
		},
	])

	return (
		<div id="createPost">
			
			<form onSubmit={handleSubmit} encType='multipart/form-data'>
				<fieldset>
					<input name="title" placeholder="title" onChange={handleChange}/>
					{contentCount.map((element, index) => (
						textareaImageAdd(index)
					))}
					<button onClick={newCombo}>New Text Area + Image Upload</button>

					<DropSelect tagged={tagged} setTagged={setTagged} />

					<input name="tags" placeholder="tags" onChange={handleChange} />

					<div id="options">
						<button type="submit">Submit</button>
						<button onClick={setModal}>Close</button>
					</div>
				</fieldset>
			</form>
		</div>
	)
}



export default function UserLog({active, setModal, modal, setSocial, setCurrent, current}) {

	console.log(active);
	let [place, setPlace] = React.useState(active == 2 || active == null ? '' : 'not');
	let [log, setLog] = React.useState([]);
	let userID = sessionStorage.getItem('userID');
	let [isModal, openModal] = React.useReducer(state => !state, false);

	/**
	 * For now, get userLog on mount
	 * log.jsx exports component and necessary functions
	 * function to open independant post within log.jsx
	 */
	let updateLog = async() => {
		let data = await accessAPI.pullUserLog();
		setLog(data);
		console.log(log);
	} 
	React.useEffect(()=> {
		updateLog();
		setCurrent({
			...current,
			social: false
		})
	}, [])
	React.useEffect(()=> {
		updateLog();
	}, [modal])


	/* change userLog class based on state from Home component in Main.jsx */
	React.useEffect(()=> {
		console.log(active);
		if (active == undefined) {
			console.log(active);
			return;
		}
		if(active !== 2 || active == 'x') {
			setPlace('not');
			console.log(active);
		}
	}, [active])

	let noHeading = false;

	return (
		<div id="userLog" className={place}>

			<Log data={log} userID={userID} noHeading={noHeading} current={current} setCurrent={setCurrent}/>

		</div>
	)
}