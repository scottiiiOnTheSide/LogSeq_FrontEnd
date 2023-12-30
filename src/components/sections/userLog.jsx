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

function MultiSelect({suggestions, setSuggestions}) {

	/**
	 * component is input, which houses spans for selected items, +
	 * dropdown with options.
	 * 
	 * typing in input adjusts the results,
	 * selecting item puts it within span container, within input (?)
	 * clicking on selected item removes it from selected
	 * 	- use setState
	 * 
	 */

	// let topics = suggestions.map(el => {el.name);
	// let changer;
	let topics = suggestions;
	const [active, setActive] = React.useState(0);
	const [filtered, setFiltered] = React.useState([]);
	const [isShow, setIsShow] = React.useState(false);
	const [input, setInput] = React.useState("");

	let onChange = (e) => {

		const input = e.currentTarget.value;
		const newFilteredSuggestions = topics.filter(topic => {
			if(topic.name.toLowerCase().indexOf(input.toLowerCase()) > -1) {
				return topic;
			}
			
		});
		setActive(0);
		setFiltered(newFilteredSuggestions);
		setIsShow(true);
		setInput(e.currentTarget.value);
	}

	let onClick = (e) => {
		setActive(0);
		setFiltered([]);
		// setIsShow(false);
		// setInput(e.currentTarget.innerText);

		let copy = suggestions.map(el => {
			if(el.name == e.currentTarget.innerText) {
				return {
					...el,
					selected: true
				}
			} else {
				return el;
			}
		})
		setSuggestions(copy);
	}

	let onKeyDown = (e) => {
		if(e.keyCode === 13) { // the enter key
			e.preventDefault()
			setActive(0);
			setIsShow(false);
			// setInput(filtered[active]);

			console.log(filtered[active])

			let copy = suggestions.map(el => {
				if(el.name == filtered[active].name) {
					return {
						...el,
						selected: true
					}
				} else {
					return el;
				}
			})
			setSuggestions(copy);
		}
	}

	// let removeTag = (name) => {
		
	// }

	let renderAutocomplete = () => {
		if(isShow && input) {
			if(filtered.length) {
				return (
					<ul className="autocomplete">
						{filtered.map((suggestion, index)=> {
							let className;
							if(index === active) {
								className = 'active';
							}
							return (
								<li className={className, suggestion.type} key={suggestion.name} onClick={onClick}>
									{suggestion.name}
								</li>
							)
						})}
					</ul>
				);
			}
			else {
				return (
					<div className="no-autocomplete">
			        	<em>Not found</em>
			        </div>
				)
			}
		}
		return <></>
	}

	/**
	 * 12. 25. 2023
	 * 
	 * implement this into onChange element for input
	 */

	let tagsSelect = React.useRef();
	React.useEffect(()=> {
		let tags = tagsSelect.current;
		let selected = tags.children[0].children[0];
		console.log(getComputedStyle(selected).width)

		if(parseInt(getComputedStyle(selected).width) > (window.innerWidth * 0.45)) {
			tags.children[0].style.flexDirection = 'column';
		} else {
			tags.children[0].style.flexDirection = 'row';
		}
	}, [suggestions])

	return (
		<div id="tagsSelection" ref={tagsSelect}>
			<div id="inputWrapper">
				<ul id="selected">
					{suggestions.map(el => {
						if(el.selected == true) {
							return <li key={el.name}
										onClick={()=> {
											let copy = suggestions.map(sugg => {
			if(sugg.name == el.name) {
				return {
					...sugg,
					selected: false
				}
			} else {
				return sugg;
			}
		})
		setSuggestions(copy);
										}}>
										<p>{el.name}</p>
										<svg xmlns="http://www.w3.org/2000/svg"  
											 viewBox="0 0 50 50" 
											 width="16px" 
											 height="16px">
											 <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"/>
											 </svg>
									</li>
						}
						
					})}
				</ul>
				<input id="tags" placeholder="Type to search tags"
					type="text"
					onChange={onChange}
					onKeyDown={onKeyDown}
					value={input}
				/>
			</div>
			{renderAutocomplete()}
		</div>
	);
}





export function CreatePost({setCurrent, current,  setSocketMessage, selectedDate}) {

	const userID = sessionStorage.getItem('userID');
	const username = sessionStorage.getItem('userName');
	const [formData, setFormData] = React.useState({});
	const [suggestions, setSuggestions] = React.useState([]);
	const [contentCount, setContentCount] = React.useState([0]);
	const [postContent, setPostContent] = React.useState([]);
	const [images, setImages] = React.useState([]);
	let count = 0;
	// console.log(postContent);
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
			setImages([...images, URL.createObjectURL(event.target.files[0])]);
		} 
		else if(event.target.name == 'content') {

			let copy;
			for(let i = 0; i < postContent.length; i++) {
				if(postContent[i].index == event.target.dataset.index) {
					copy = true;
				}
			}

			if(event.target.value == '') {
				return
			} else if (copy == true) {
				if(postContent.length == 1) {
					setPostContent([
						{ 
							content: event.target.value,
							type: "text", 
							index: event.target.dataset.index 
						}		
					])
				} else {
					let _postContent = JSON.parse(JSON.stringify(postContent));
					_postContent.pop();
					setPostContent([
						..._postContent,
						{
							content: event.target.value,
							type: "text", 
							index: event.target.dataset.index
						}
					])
				}
			} else {
				setPostContent([
					...postContent,
					{ 
						content: event.target.value,
						type: "text", 
						index: event.target.dataset.index 

					}		
				])
			}
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
		console.log(postContent)

		if(!formData.title && postContent < 1) {
			setSocketMessage({
				type: 'error',
				message: 'Both a Title and Content are needed to make a post!'
			})
		} else {
			
			let submission = new FormData();

			submission.append('title', formData.title)

			for(let i=0; i < postContent.length; i++){
				if(postContent[i].type == 'text') {
					if(postContent[i].content === '') {
						return null;
					} else {
						let content = postContent[i].content;
						submission.append(`${postContent[i].index}`, content)
					}
					
				} else if(postContent[i].type == 'image') {
					let content = postContent[i].content;
					submission.append(`${postContent[i].index}`, content)
				}
			}

			let tags = suggestions.filter(el => el.selected == true).map(el => el.name);
			submission.append('tags', tags);

			if(selectedDate.day != null) {
				submission.append('usePostedByDate', false);
				submission.append('postedOn_month', selectedDate.month);
				submission.append('postedOn_day', selectedDate.day);
				submission.append('postedOn_year', selectedDate.year);
			} else {
				submission.append('usePostedByDate', true);
			}	
			// console.log(submission);
			console.log(tags);

			let submit = await accessAPI.createPost(submission);

			if(submit.confirm == true) {
				console.log("Post submission successful");
				console.log(submit);
				setCurrent({
					...current,
					modal: false
			}) //closes the createPost component - should change name within component

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
					recipients: recips,
					details: JSON.stringify({postTitle: submit.postTitle})
				})

			} else {
				setSocketMessage({
					confirm: 'postUpload'
				})
			}
			} else if(submit.confirm == false) {
				console.log('Issue with post submission');
			}
		}
	}

	const newCombo = (e) => {
		e.preventDefault();
		setContentCount([
			...contentCount,
			count++
		])
	}
	// console.log(postContent)
	const textareaImageAdd = (index) => {

		let element = <fieldset key={index} className="textareaImageAdd">
			<textarea 
				name="content" 
				placeholder="Content" 
				onBlur={handleChange}
				data-index={index}
				rows="10"
				cols="30"
				/>
				{/*
					onBlur - if any object in postContent has same index as this.index,
					remove it, add this one
				*/}
			<img src={images[index]}/>
			<label className="imageAdd" onChange={handleChange} htmlFor="addImage" onClick={()=> {
				document.getElementsByClassName('addImage')[index].click();
			}}>
				<input hidden
					className={'addImage'} 
					onChange={handleChange} 
					type="file" 
					accept="image/"
					name='image' 
					data-index={index + 0.5}
					hidden />
				Add Image
			</label>
			
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

	const getSuggestions = async() => {

		let topics = await accessAPI.getSuggestions();
		let _topics = topics.map(topic => {
			return {
				name: topic,
				type: 'topic',
				selected: false
			}
		})
		setSuggestions(_topics);
	}

	
	const [tagged, setTagged] = React.useState([]);
	
	const [enter, setEnter] = React.useReducer(state => !state, true);
	const el = React.useRef()
	const element = el.current;

	/* On Mount, fade away pseudo element for transition effect */
	React.useEffect(()=> {
		getConnections();
		getSuggestions();

		if(element) {
			setEnter();
		}
	}, [element]);

	let writtenDate;
	if(selectedDate.day) {
		writtenDate = `${selectedDate.month}. ${selectedDate.day}. ${selectedDate.year}`;
	}

	// console.log(suggestions);

	return (
		<div id="createPost" ref={el} className={`${enter == true ? '_enter' : ''}`}>
			
			<div id="titleWrapper">
				<h3>Creating Entry for</h3>
				{current.monthChart &&
					<h2>{writtenDate}</h2>
				}
				{!current.monthChart &&
					<h2>Today</h2>
				}
			</div>

			<form onSubmit={handleSubmit} encType='multipart/form-data'>
				<fieldset>
					<input name="title" id="title" placeholder="Title" onChange={handleChange}/>
					{contentCount.map((element, index) => (
						textareaImageAdd(index)
					))}
					<button id="newCombo" 
							className={'buttonDefault'} 
							onClick={newCombo}>
							More Content
					</button>

					<DropSelect tagged={tagged} setTagged={setTagged} />

					<MultiSelect suggestions={suggestions} setSuggestions={setSuggestions}/>

					<div id="options">
						<button className={"buttonDefault"} type="submit">Submit</button>
						<button className={"buttonDefault"} onClick={(e)=> {
							e.preventDefault();
							setEnter();
							let delay = setTimeout(()=> {
								setCurrent({
									...current,
									modal: false
								})
							}, 300)
						}}>Close</button>
					</div>
				</fieldset>
			</form>
			
		</div>
	)
}


export default function UserLog({active, setModal, modal, setSocial, setCurrent, current}) {

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
	}, [current.modal])


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