/* * * V i t a l s * * */
import * as React from 'react';
import APIaccess from '../../apiaccess';
import Log from '../blog/log';
import './sections.css';
import './userLog.css';
import FullList from '../../components/base/fullList';

let accessAPI = APIaccess();

function ReturnElement ({el, setCurrent, current}) {

	let [ifLeave, setLeave] = React.useState(false);
	
	let goBack = () => {
		setLeave(true)

		let second = setTimeout(()=> {
			let elCurrent = el.current;
			elCurrent.classList.add('_enter');
		}, 300)
		
		let third = setTimeout(()=> {
			setCurrent({
				...current,
				modal: false
			})
		}, 500)
	}

	return (
		<svg 
			xml version="1.0"
			viewBox="109.21 220.42 140.874 69.937" 
			xmlns="http://www.w3.org/2000/svg"
			id="return"
			className={ifLeave ? "leave" : ""}
			onClick={goBack}>
	  		<polyline 
	  			id="top"
	  			points="249.644 250.369 109.21 250.393 159.165 220.42" 
	  			transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 1.4210854715202004e-14)"/>
	  		<polyline 
	  			id="bottom"
	  			points="250.084 260.408 109.65 260.384 159.605 290.357" 
	  			transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 1.4210854715202004e-14)"/>
		</svg>
	)
}

function DraftIcon ({toggleDrafts}) {

	/* 
		09. 13. 2024
		opens FullList 
		which should be -within- userlog 
		(though this may not be optimal)
	*/

	const [ifHover, setHover] = React.useReducer(state => !state, false);
	const handleClick = () => {
		setHover();
		let delay = setTimeout(()=> {
			toggleDrafts();
			setHover();
		}, 200)
	}

	return (
		<svg 
			id="draftIcon"
			xmlns="http://www.w3.org/2000/svg" 
			width="33.049" 
			height="40.075" 
			viewBox="0 0 33.049 40.075"
			onClick={handleClick}
			className={ifHover ? "hover" : ""}>
		  <g transform="translate(-259 -13.925)">
		    <path class="a" d="M267 20a6.007 6.007 0 0 0-6 6v20a6.007 6.007 0 0 0 6 6h14a6.007 6.007 0 0 0 6-6V26a6.007 6.007 0 0 0-6-6zm0-2h14a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-14a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8"/>
		    <path class="a" d="M278.25 28.5h-12v-1h12Zm3.5 4h-15.5v-1h15.5Zm0 4h-15.5v-1h15.5Zm-3 4h-12.5v-1h12.5Zm3 4h-15.5v-1h15.5Z"/>
		    <rect width="3" height="20" rx="1.5" transform="rotate(30 118.741 547.085)"/>
		    <path d="M1.5 0A1.5 1.5 0 0 1 3 1.5v17a1.5 1.5 0 0 1-3 0v-17A1.5 1.5 0 0 1 1.5 0" transform="rotate(30 118.741 547.085)"/>
		  </g>
		</svg>
	)
}

function DropSelect({tagged, setTagged}) {

	let [active, setActive] = React.useReducer(state => !state, false);

	let returnOption = (option) => {

		let listItem = 
		<li className="option" onClick={()=> {
			setTagged(tagged.map(user => {
				if(user._id == option._id) {

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
			<p>{option.userName}</p>
		</li>

		return listItem
	}

	return (
		<div id="taggedUsers">
			{!tagged.some(user => user.selected == true) &&
				<p onClick={()=> {setActive()}}>Toggle to Tag Others</p>
			}
			<ul id='selected' onClick={()=> {setActive()}}>
				{tagged.filter(user => user.selected == true).map(user => (
					<li key={user.userName}>{user.userName}</li>
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

function MultiSelect({suggestions, setSuggestions, setModal}) {

	/**
	 * component is input, which houses tags as selectable items within
	 * a dropdown
	 * 
	 * typing in input adjusts the results,
	 * selecting item puts it within span container, within input
	 * clicking on selected item removes it from selected
	 * 
	 */
	let changer;
	let topics = suggestions;
	const [active, setActive] = React.useState(0);
	const [filtered, setFiltered] = React.useState([]);
	const [isShow, setIsShow] = React.useState(false);
	const [input, setInput] = React.useState("");
	// console.log(topics);

	let onChange = (e) => {

		const input = e.currentTarget.value;
		// console.log(suggestions[0].name)
		const newFilteredSuggestions = topics.filter((el, index) => {
			if(el.name.toLowerCase().indexOf(input.toLowerCase()) > -1) {
				return el;
			}
		});
		setActive('');
		setFiltered(newFilteredSuggestions);
		setIsShow(true);
		setInput(e.currentTarget.value);
	}

	let onClick = (e) => {
		setActive('');

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

	let renderAutocomplete = () => {
		if(isShow && input) {

			return (
				<div id="resultsWrapper">
					{filtered.length > 0 ?
						<ul id="autocomplete">
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
						</ul> : null
					}
					{filtered.length < 1 ?
						<div id="no-autocomplete">
				         	<p>No Results Found</p>
			         	</div> : null
			        }
					<button className={"buttonDefault"}
							id="makeNewTag"
							onClick={(e)=> {
								e.preventDefault();
								setModal();
								setIsShow(false);
							}}>Create a New Tag</button>
				</div>
			)
		}
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
											setActive('')
											let tagsInput = document.getElementById('tags');
											tagsInput.value = '';
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
				<input id="tags" placeholder="Type to search tags "
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

export function CreatePost({setCurrent, current, socketMessage, setSocketMessage, selectedDate}) {

	const userID = sessionStorage.getItem('userID');
	const username = sessionStorage.getItem('userName');
	const privacySetting = sessionStorage.getItem('privacySetting');
	const [drafts, setDrafts] = React.useState([]);
	const [formData, setFormData] = React.useState({});
	const [suggestions, setSuggestions] = React.useState([]);
	const [tagged, setTagged] = React.useState([]); //user's connections
	const [isPrivate, setPrivate] = React.useReducer(state => !state, false);
	const [postContent, setPostContent] = React.useState([
		{
			content: '',
			type: 'text',
			index: 0
		}
	]);

	//this is set to user's current coordinates when they first toggle 'Pin Location'
	const [locationData, setLocationData] = React.useState({ //values are null until user initially selects pinLocation 
		lon: undefined, //40.6569 
		lat: undefined //-73.9605
	}); 
	const [draftList, setDraftList] = React.useReducer(state => !state, false);
	const el = React.useRef();
	const element = el.current;

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
					type: 'media', 
					index: postContent.length - 0.5,
					url: URL.createObjectURL(event.target.files[0]),
				}		
			])	
		} 
		// else if(event.target.name == 'content') {

		// 	let copy;
		// 	for(let i = 0; i < postContent.length; i++) {
		// 		if(postContent[i].index == event.target.dataset.index) {
		// 			copy = true;
		// 		}
		// 	}

		// 	 if (copy == true) {
		// 		if(postContent.length == 1) {
		// 			setPostContent([
		// 				{ 
		// 					content: event.target.value,
		// 					type: "text", 
		// 					index: event.target.dataset.index 
		// 				}		
		// 			])
		// 		} else {
		// 			let _postContent = JSON.parse(JSON.stringify(postContent));
		// 			_postContent.pop();
		// 			setPostContent([
		// 				..._postContent,
		// 				{
		// 					content: event.target.value,
		// 					type: "text", 
		// 					index: event.target.dataset.index
		// 				}
		// 			])
		// 		}
		// 	} 
		//chatGPT recommended update
		else if (event.target.name == 'content') {
		  let existingItem = postContent.find(item => item.index == event.target.dataset.index);

		  if (existingItem) {
		    // Update existing content
		    setPostContent(postContent.map(item => 
		      item.index == event.target.dataset.index 
		        ? { ...item, content: event.target.value }
		        : item
		    ));
		  } 
		  else {
		    // Add new content
		    setPostContent([
		      ...postContent,
		      {
		        content: event.target.value,
		        type: 'text',
		        index: event.target.dataset.index
		      }
		    ]);
		  }
		} 
		else {
			setFormData({
				...formData,
				[event.target.name]: event.target.value,
			})
		}
	}

	//older submitPost function
	const handleSubmit = async(event) => {
		event.preventDefault();
		console.log(postContent);
		let title = document.getElementById('title');

		if (!title.value.trim() || !postContent.some(content => {
		  if (content.type === 'text') {
		    // Only apply trim to text content
		    return typeof content.content === 'string' && content.content.trim() !== '';
		  } else if (content.type === 'media') {
		    // Check if media content is a valid File object
		    return content.content instanceof File;
		  }
		})) {
		setSocketMessage({
		    type: 'error',
		    message: 'At least a Title, Text, or Media is needed to make a post!'
		  });
		  return;  // Stop the form submission if validation fails
		}  
		else {
			
			element.classList.add('_loading');
			let submission = new FormData();

			submission.append('type', 'entry');
			submission.append('title', formData.title ? formData.title : title.value);
			submission.append('isPrivate', isPrivate);
			submission.append('privacyTogglable', sessionStorage.getItem('privacySetting'));
			submission.append('profilePhoto', sessionStorage.getItem('profilePhoto'));

			for(let i=0; i < postContent.length; i++) {

				const {type, content, index} = postContent[i];

				if(type == 'text') {
					if (typeof content === 'string' && content.trim() === '') {
				      continue;  // Skip empty text content
				    }
					else {
						let content = postContent[i].content;
						submission.append(`${index}`, content)
					}
				} else if(type == 'media') {
					let content = postContent[i].content;
					submission.append(`${index}`, content)
				}
			}

			let tags = suggestions.filter(el => el.selected == true).map(el => el.name);
			if(tags.length > 0) {
				submission.append('tags', tags);	
			} 
			
			let taggedUsers = tagged.filter(user => user.selected == true).map(user => {
				return {
					_id: user._id, 
					username: user.userName
				}
			});
			if(taggedUsers.length > 0) {
				submission.append('taggedUsers', JSON.stringify(taggedUsers));
			}
			console.log(taggedUsers);

			if(selectedDate.day != null) {
				submission.append('usePostedByDate', false);
				submission.append('postedOn_month', selectedDate.month);
				submission.append('postedOn_day', selectedDate.day);
				submission.append('postedOn_year', selectedDate.year);
			} else {
				submission.append('usePostedByDate', true);
			}

			if(pinLocation.open) {
				submission.append('geoLon', pinLocation.lon);
				submission.append('geoLat', pinLocation.lat);
			}	
			console.log(submission);
			console.log(tags);

			let submit = await accessAPI.createPost(submission);

			if(submit.confirm == true) {
				console.log("Post submission successful");
				// console.log(submit);
				element.classList.remove('_enter');
				element.classList.add('_fade');
				let delay = setTimeout(()=> {
					setCurrent({
						...current,
						modal: false
					})
				}, 300)

				let utilizedDraft = drafts.find(post => post.selected == true);
				if(utilizedDraft) {
					await accessAPI.deleteDraft(utilizedDraft._id)	
				}
				
			} else if(submit.message) {
					element.classList.remove('_loading');
					console.log('Issue with post submission');
					setSocketMessage({
						type: 'error',
						message: submit.message
					})
			}
			/**
			 * 10. 27. 2023
			 * setSocketMessage here with info for making notif for tagged users
			 */
			if(tagged.some(user => user.selected == true)) {

				let recips = tagged.filter(user => user.selected == true).map(user => {return user._id});

				setSocketMessage({
					type: 'tagging',
					isRead: false,
					senderID: userID,
					senderUsername: username,
					url: submit.postURL,
					message: 'sent',
					recipients: recips,
					postTitle: title.value
				})

			} else {
				setSocketMessage({
					confirm: 'postUpload'
				})
			}
		}
	}

	const draftPost = async(event) => {

			event.preventDefault();
			console.log(postContent);

			if(!formData.title) {
					setSocketMessage({
						type: 'error',
						message: 'Atleast a Title, Text or Media is needed to make a post!'
					})
			} else if (postContent.length < 1) {
				setSocketMessage({
						type: 'error',
						message: 'Atleast a Title, Text or Media is needed to make a post!'
					})
			}
			else {
				element.classList.add('_loading');
				let submission = new FormData();

				submission.append('type', 'draft');
				submission.append('title', formData.title);
				submission.append('isPrivate', isPrivate);
				submission.append('privacyTogglable', sessionStorage.getItem('privacySetting'));
				submission.append('profilePhoto', sessionStorage.getItem('profilePhoto'));

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
				if(tags.length > 0) {
					submission.append('tags', tags);	
				} 
				
				let taggedUsers = tagged.filter(user => user.selected == true).map(user => {
					return {
						_id: user._id, 
						username: user.userName
					}
				});
				if(taggedUsers.length > 0) {
					submission.append('taggedUsers', JSON.stringify(taggedUsers));
				}
				console.log(taggedUsers);

				if(selectedDate.day != null) {
					submission.append('usePostedByDate', false);
					submission.append('postedOn_month', selectedDate.month);
					submission.append('postedOn_day', selectedDate.day);
					submission.append('postedOn_year', selectedDate.year);
				} else {
					submission.append('usePostedByDate', true);
				}

				if(pinLocation.open) {
					submission.append('geoLon', pinLocation.lon);
					submission.append('geoLat', pinLocation.lat);
				}	
				console.log(submission);
				console.log(tags);

				let submit = await accessAPI.createPost(submission);

				if(submit.confirm == true) {
					console.log(submit);
					element.classList.remove('_enter');
					element.classList.add('_fade');
					let second = setTimeout(()=> {
						setCurrent({
							...current,
							modal: false
						})
					}, 300)

					let third = setTimeout(()=> {
						setSocketMessage({
							confirm: 'postDrafted'
						})
					}, 300)
				} else if(submit.message) {
					element.classList.remove('_loading');
					console.log('Issue with post submission');
					setSocketMessage({
						type: 'error',
						message: submit.message
					})
				}
			}
	}

	const newContent = (type) => {
		setPostContent([
			...postContent,
			{
				content: '',
				type: type,
				index: postContent.length
			}
		])
	}

	const textareaImageAdd = (index, type, info) => {

		if(type == 'text') {
				return	(
					<div >
						<textarea 
							key={index}
							className={"textareaImageAdd"}
							name="content" 
							placeholder="Content" 
							onBlur={handleChange}
							onChange={handleChange}
							data-index={index}
							rows="8"
							cols="30"
							value={info ? info : undefined}
						/>
						{index > 0 &&
							<button className={`buttonDefault remove`}
									onClick={(e)=> {
										e.preventDefault();
										console.log(index);
										let copy2 = postContent.filter(post => post.index != index);
										setPostContent(copy2);
									}}>
								Remove
							</button>
						}
						
					</div>
				)
		}
		else if(type == 'media') {

			// let link = images.find(element => element.index == index);
			return (
				<div >
					<img key={index} src={info}/> 

					<button className={`buttonDefault remove`}
							onClick={(e)=> {
								e.preventDefault();
								let copy2 = postContent.filter(post => post.index != index);
								setPostContent(copy2);
							}}>
						Remove
					</button>
				</div>
				
			)
		}
	}

	const getConnections = async() => {
		let request = await accessAPI.getConnections(userID);
		request.forEach(user => {
			user.selected = false;
		})
		setTagged(request);
	}

	const getSuggestions = async() => {

		let topics = await accessAPI.getSuggestions();
		let userTags = await accessAPI.getUserTags(); //gets all tags 
		console.log(userTags)
		let results = [];
		let _topics = topics.map(topic => {
			return {
				name: topic,
				type: 'topic',
				selected: false
			}
		})
		results.push(..._topics);
		if(userTags != false) {
			let _userTags = userTags.map(topic => {
				return {
					name: topic.name,
					type: 'tag',
					selected: false
				}
			})
			results.push(..._userTags);
		}
		console.log(results)
		setSuggestions(results);
	}

	const getDrafts = async() => {
		let request = await accessAPI.getDrafts();
		setDrafts(request);
	}
	

	const [enter, setEnter] = React.useReducer(state => !state, true);
	const [modal, setModal] = React.useReducer(state => !state, false);
	const [isPrivate_2, setIsPrivate_2] = React.useReducer(state => !state, false);
	const [newTag_value, setNewTag_value] = React.useState('');
	const tagModal = React.useRef();
	

	//should be locationData values by default
	//these values are added to post submission
	const [pinLocation, setPinLocation] = React.useState({
		open: false,
		lon: undefined, 
		lat: undefined
	});

	let writtenDate;
	if(selectedDate.day) {
		writtenDate = `${selectedDate.month + 1}. ${selectedDate.day}. ${selectedDate.year}`;
	}

	let newTag_onChange = (e) => {

		const input = e.currentTarget.value;
		setNewTag_value(e.currentTarget.value);
	}

	let newTag_submit = async(e) => {

		let data = {
			type: 'tag',
			name: newTag_value,
			owner: isPrivate_2 == true ? userID : null,
			admins: [`${isPrivate_2 == true ? userID : null}`],
			ownerUsername: isPrivate_2 == true ? username : null,
			hasAccess: [userID],
			isPrivate: isPrivate_2 == true ? true : false,
			action: 'newTag'
		}
		setSocketMessage(data);
		console.log(data);
		/*
			2nd part of operation in useEffect
		*/
	}

	const onChange = (e) => {
		if(e.target.name == 'lon') {
			setPinLocation({
				...pinLocation,
				lon: e.target.value
			})
		}
		else if(e.target.name == 'lat') {
			setPinLocation({
				...pinLocation,
				lat: e.target.value
			})
		}
	}

	const getGeoInfo_options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	const getGeoInfo_success = (pos) => {
		// setLocationData({
		// 	lon: pos.longitude,
		// 	lat: pos.latitude
		// })
		setPinLocation({
			...pinLocation,
			lon: pos.longitude,
			lat: pos.latitude
		})
		console.log('Location data saved within state')
	}

	const getGeoInfo_error = (err) => {
		console.log(`Error (${err.code}): ${err.message}`)
	}

	//for getting user location details upon toggling 'pinLocation'
	React.useEffect(()=> {
		if(pinLocation.lon) {
			return;
		}

		if(navigator.geolocation) {
			navigator.permissions.query({name: "geolocation"}).then((result)=> {
				console.log(result);

				if(result.state == "granted") {
					navigator.geolocation.getCurrentPosition(getGeoInfo_success, getGeoInfo_error, getGeoInfo_options)
				}
				else if(result.state == "prompt") {
					navigator.geolocation.getCurrentPosition(getGeoInfo_success, getGeoInfo_error, getGeoInfo_options)
				}
				else if(result.state == "denied") {
					//can utilize the popUpNotif to instruct user on how to activate location permissions
					// setLocationData({
					// 	lon: undefined,
					// 	lat: undefined
					// })
					setPinLocation({
						...pinLocation,
						lon: undefined,
						lat: undefined
					})
				}
			})
		}
		else {
			console.log("geolocation permissions not active")
		}
	}, [pinLocation.open])

	//update main data: connections, topics and tags, drafted posts
	React.useEffect(()=> {
		getConnections();
		getSuggestions();
		getDrafts();
	}, []);

	//update tags on new tag creation
	React.useEffect(()=> {

		if(socketMessage.type == 'confirmation' && socketMessage.message == 'tagAdd') {
			getSuggestions();
			setModal();
		}
	}, [socketMessage]);

	//Enter animation
	React.useEffect(()=> {
		let elCurrent = el.current;
		let delay = setTimeout(()=> {
			elCurrent.classList.remove('_enter');	
		}, 200)
	}, [])
	

	return (

		<div id="createPost" ref={el} className={`_enter`}>

			{/*
				H E A D E R
			*/}
			<div id="headerWrapper">

				<ReturnElement el={el} current={current} setCurrent={setCurrent}/>

				<div id="dateSetter">
					<h3>Creating Entry for</h3>
					{current.calendar &&
						<h2>{writtenDate}</h2>
					}
					{!current.calendar &&
						<h2>Today</h2>
					}
				</div>

				<DraftIcon toggleDrafts={setDraftList}/>
			</div>


			{/*
				F O R M
						B O D Y
			*/}
			<form onSubmit={handleSubmit} encType='multipart/form-data'>
				<fieldset>
					<input name="title" id="title" placeholder="Title" onChange={handleChange}/>
					<div id="contentWrapper">
						{/*{contentCount.map((element, index) => {
							if(element == 'text') {
								return textareaImageAdd(index, element)
							}
							else if(element == 'media') {
								return textareaImageAdd(index + 0.5, element)
							}	
						})}*/}
						{postContent.map((element) => {
							if(element.type == 'text') {
								return textareaImageAdd(element.index, element.type, element.content)
							}
							else if(element.type == 'media') {
								return textareaImageAdd(element.index, element.type, element.url)
							}	
						})}
					</div>
					

					<div id="moreContent">
						<button className={'buttonDefault'} 
								onClick={(e)=> {
									e.preventDefault()
									newContent('text')
								}}>
								Add Text
						</button>

						<label className="imageAdd" onChange={handleChange} htmlFor="addImage" onClick={(e)=> {
							document.getElementById('addImage').click();							
						}}>
							<input hidden
								id='addImage' 
								type="file" 
								accept="image/"
								name='image' 
								hidden />
							<p>Add Image</p>
						</label>
					</div>
					

					<DropSelect tagged={tagged} setTagged={setTagged} />

					<MultiSelect suggestions={suggestions} 
								 setSuggestions={setSuggestions} 
								 setModal={setModal}/>

					<button id="setPrivate" 
							className={`buttonDefault ${isPrivate == true ? 'active' : 'nonActive'}`}
							onClick={(e)=> {e.preventDefault(); setPrivate()}}>
						PRIVATE
					</button>

					<button id="pinLocation"
							className={`buttonDefault ${pinLocation.open == true ? 'active' : 'nonActive'}`}
							onClick={(e)=> {
								e.preventDefault(); 
								if(pinLocation.open == false) {
									setPinLocation({
										...pinLocation,
										open: true
									})
								} else {
									setPinLocation({
										...pinLocation,
										open: false
									})
								}
							}}>
						Pin Location
					</button>

					{pinLocation.open &&
						<div id="coordinatesWrapper">
							
							<div id="lonWrap" className={`${pinLocation.lon != locationData.lon ? 'active' : 'inactive'}`}>
								<p className={`${pinLocation.lon != locationData.lon ? 'active' : 'inactive'}`}>LON</p>
								<input type="number"
										name="lon"
										onChange={onChange}
										placeholder={pinLocation.lon}/>
							</div>
							<div id="latWrap" className={`${pinLocation.lon != locationData.lon ? 'active' : 'inactive'}`}>
								<p className={`${pinLocation.lon != locationData.lon ? 'active' : 'inactive'}`}>LAT</p>
								<input type="number"
										name="lat"
										onChange={onChange}
										placeholder={pinLocation.lat}/>
							</div>
							
							
						</div>
					}
					

				</fieldset>
			</form>
			
			<div id="options">
				<button className={"buttonDefault"} onClick={draftPost}>Draft</button>

				<button className={"buttonDefault"} onClick={handleSubmit}>Post</button>
			</div>

			{modal &&
				<div id="createNewTag" ref={tagModal} className={`${modal == true ? 'active' : 'leave'}`}>
					<h2>Create New Tag</h2>
					<input 
						placeholder="Enter a single word phrase"
						onChange={newTag_onChange} 
						value={newTag_value}/>
					<div id="buttonWrapper">
						<button className={`buttonDefault`}
								onClick={(e)=> {
									tagModal.current.classList.remove('active');
									tagModal.current.classList.add('leave');
									setTimeout(()=> {
										setModal();
									}, 250);
								}}>Cancel</button>
						<button 
							className={`buttonDefault ${isPrivate_2 == true ? 'active' : 'nonActive'}`}
							onClick={(e)=> {
								e.preventDefault()
								setIsPrivate_2()
							}}>PRIVATE</button>
						<button className={`buttonDefault`}
								onClick={newTag_submit}>Save</button>
					</div>
				</div>
			}

			{draftList &&
				<FullList 
					data={drafts}
					mode={'viewDrafts'}
					source={`${username}'s Drafts`}
					socketMessage={socketMessage}
					setSocketMessage={setSocketMessage}
					setFullList={setDraftList}
					postContent={postContent}
					setPostContent={setPostContent}
					groupID={''}
					setPinLocation={setPinLocation}
					setLocationData={setLocationData}
					setPrivate={setPrivate}	
					suggestions={suggestions}
					setSuggestions={setSuggestions}
					tagged={tagged}
					setTagged={setTagged}
					setDrafts={setDrafts}
				/>
			}	

		</div>
	)
}



export default function UserLog({active, setCurrent, current, log, setLog}) {

	let [place, setPlace] = React.useState(active == 1 || active == null ? '' : 'not');
	let userID = sessionStorage.getItem('userID');
	let [isModal, openModal] = React.useReducer(state => !state, false);

	/**
	 * For now, get userLog on mount
	 * log.jsx exports component and necessary functions
	 * function to open independant post within log.jsx
	 */
	// let updateLog = async() => {
	// 	let data = await accessAPI.pullUserLog();
	// 	setLog(data);
	// }

	let updateLog = async() => {

		let posts = await accessAPI.pullUserLog({type: 'customLog', logNumber: current.log})
		setLog(posts);
	} 

	React.useEffect(()=> {
		updateLog()
		setCurrent({
			...current,
			social: false
		})
	}, [])

	React.useEffect(()=> {
		updateLog()
	}, [current.modal, current.customizer])


	/* change userLog class based on state from Home component in Main.jsx */
	React.useEffect(()=> {

		if (active == undefined) {
			console.log(active);
			return;
		}
		if(active !== 1 || active == 'x') {
			setPlace('not');
			console.log(active);
		}
	}, [active])

	let noHeading = false;

	return (
		<div id="userLog" className={place}>
			<Log data={log} 
				 section={"user"} 
				 noHeading={noHeading} 
				 current={current} 
				 setCurrent={setCurrent}
				 updateLog={updateLog}/>
		</div>
	)
}