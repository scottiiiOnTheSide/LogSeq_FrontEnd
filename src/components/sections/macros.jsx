import * as React from 'react';
import APIaccess from '../../apiaccess';

let accessAPI = APIaccess();

export function ManageMacros({current, setCurrent, setSocketMessage}) {

	const userID = sessionStorage.getItem('userID');
	const [userTags, setUserTags] = React.useState([
		{
			name: 'thisIs',
			selected: false,
			id: 1234
		},
		{
			name: 'aListOf',
			selected: false,
			id: 5678
		}, 
		{
			name: 'tagsToBe',
			selected: false,
			id: 9101
		},
		{
			name: 'deleted',
			selected: false,
			id: 1123
		}
	]) 
	const [userCollections, setUserCollections] = React.useState([
		{
			name: 'This is a Collection',
			selected: false,
			id: 1234,
			confirmation: null,
			rename: null
		},
		{
			name: 'They can have spaces',
			selected: false,
			id: 5678,
			confirmation: null,
			rename: null 
		}, 
		{
			name: 'In their names. Unlike Tags',
			selected: false,
			id: 9101,
			confirmation: null,
			rename: null
		}
	])
	let updateMacros = async() => {

		let tags = await accessAPI.getMacros('tags');
		// let userPrivatePosts = await accessAPI.getMacros('private');
		let collections = await accessAPI.getMacros('collections');

		setUserTags(tags); 
		// setPrivatePosts(userPrivatePosts);
		setUserCollections(collections);
	}

	
	
	//state for <ManageMacros > Options
	const [section, setSection] = React.useState([
		{
			newTag: false
		},
		{
			deleteTags: false
		},
		{
			newCollection: false
		},
		{
			collections: false
		}
	])
	const [newTag_value, setNewTag_value] = React.useState({
		name: '',
		isPrivate: null
	});
	const [newCollection, setNewCollection] = React.useState({
		name: null,
		isPrivate: null,
	});

	let newTag_onChange = (e) => {
		const input = e.currentTarget.value;
		setNewTag_value({
			...newTag_value,
			name: e.currentTarget.value
		});
	}
	let newTag_submit = async() => {

		let body = {
			 type: "tag",
			 name: newTag_value.name,
			 owner: newTag_value.isPrivate == true ? userID : null,
			 admins: [`${newTag_value.isPrivate == true ? userID : null}`],
			 hasAccess: [userID],
			 isPrivate: newTag_value.isPrivate == true ? true : false,
			 action: 'newTag'
		}
		console.log(body);
		setSocketMessage(body);
		//need to include catch for when newTag_value has spaces
	}


	let selectDeleteTag = (name, index) => {
		let tags = userTags.map(ele => {
			if(ele.name == name) {
				
				if(ele.selected == false) {
					return {
						...ele,
						selected: true
					}
				}
				else if(ele.selected == true) {
					return ele;
				} 
			} else {
				return {
					...ele,
					selected: false
				}
			}
		})
		setUserTags(tags);
		console.log(tags);
		// console.log(deleteTags[index].selected)
	}
	let deleteTag_submit = async(name, id) => {

		let body = {
			name: name,
			groupID: id 
		}
		let request = await accessAPI.manageGroup('deleteGroups', body);
		
		if(request == true) {
			setSocketMessage({
				type: 'confirmation',
				message: 'tagRemove',
				groupName: name
			})
		}else {
			setSocketMessage({
				type: 'error',
				message: request.message
			})
		}
		updateMacros();
	}



	let newCollection_onChange = (e) => {

		const input = e.currentTarget.value;
		setNewTag_value(e.currentTarget.value);
	}
	let newCollection_submit = async() => {}



	let manageCollections = (name, type, value) => {
		let newVer = userCollections.map(ele => {
			if(ele.name == name) {

				if(type == 'selected') {
					return {
						...ele,
						selected: value 
					}
				}
				else if(type == 'rename') {
					return {
						...ele,
						selected: false,
						rename: value
					}
				}
				else if(type == 'confirmation') {
					return {
						...ele,
						selected: false,
						confirmation: value 
					}
				}
			} else {
				return {
					...ele,
					selected: false
				}
			}
		})
		setUserCollections(newVer);
		console.log(newVer);
	}
	


	/* For opening animation */
	let modal = React.useRef();

	React.useEffect(()=> {
		let modalCurrent = modal.current;
		let delay = setTimeout(()=> {
			modalCurrent.classList.remove('_enter');	
		}, 200)
	}, [])

	/*
		on response message from socket, any open menu option closes
		update so that it only closes on success responses
	*/
	React.useEffect(()=> {
		setSection([
			{
				newTag: false
			},
			{
				deleteTags: false
			},
			{
				newCollection: false
			},
			{
				collections: false
			}
		])
	}, [setSocketMessage])


	return (
		// <div id="ManageMacros" ref={modal} className={`${current.transition == false ? '_enter' : ''}`}>
		<div id="ManageMacros" ref={modal} className={'_enter'}>

			
			<h2>Macros</h2>

			<ul id="mainMenu">
				
				{/* Create New Tag */}
				<li className={`option ${section.newTag == true ? 'open' : 'close'}`} id="createNewTag">
					<button className={`header buttonDefault`}
							onClick={(e)=> {
								e.preventDefault()
								if(section.newTag) {
									setSection({
										...section,
										newTag: false
									}) 
								} else {
									setSection({
										...section,
										newTag: true
									})
								}
					}}>Create Tag</button>

					<div className={"newTagWrapper"}>
						
						<input 
							placeholder="Enter a single word phrase"
							onChange={newTag_onChange} 
							value={`${newTag_value.name}`}/>
						<div className={'buttonWrapper'}>
							<button className={`buttonDefault ${newTag_value.isPrivate == true ? '' : '_inactive'}`} 
									onClick={(e)=> {
								e.preventDefault()

								if(newTag_value.isPrivate == true) {
									setNewTag_value({
										...newTag_value,
										isPrivate: false
									})
								} else {
									setNewTag_value({
										...newTag_value,
										isPrivate: true
									})
								}
							}}>Private</button>
							<button className={`buttonDefault`}
									onClick={(e)=> {
										e.preventDefault()
										newTag_submit()
							}}>Save</button>
						</div>
					</div>
				</li>

				{/*Delete Tags*/}
				<li className={`option ${section.deleteTags == true ? 'open' : 'close'}`} id="deleteTags">
					<button className={`header buttonDefault`}
							onClick={(e)=> {
								e.preventDefault()
								if(section.deleteTags) {
									setSection({
										...section,
										deleteTags: false
									}) 
								} else {
									setSection({
										...section,
										deleteTags: true
									})
								}
					}}>Delete Tags</button>

					<ul id="deleteTags">
						{userTags.map((tag, index) => (
							<li key={tag.id}
								className={`${userTags[index].selected == true ? 'selected' : ''}`}
								onClick={()=> {selectDeleteTag(tag.name, index)}}>
								<p>{tag.name}</p>
								<div className={`confirmation`}>
									<p>Are You Sure?</p>

									<div className={`buttonWrapper`}>
										<button className={`buttonDefault`}>Yes</button>
										<button className={`buttonDefault`}>No</button>
									</div>
								</div>
							</li>
						))}
					</ul>
				</li>

				{/*New Collection*/}
				<li className={`option ${section.newCollection == true ? 'open' : 'close'}`} id="createNewCollection">
					<button className={`header buttonDefault`}
							onClick={(e)=> {
								e.preventDefault()
								if(section.newCollection) {
									setSection({
										...section,
										newCollection: false
									}) 
								} else {
									setSection({
										...section,
										newCollection: true
									})
								}
					}}>New Collection</button>

					<form id="newCollection">
						<input name="collectionName" placeholder="Enter Name" />
						<textarea name="collectionDescription" placeholder="Enter Description" rows="4" cols="20">
						</textarea>

						<div id="buttonWrapper">
							<button className={`buttonDefault ${newCollection.isPrivate == true ? '' : '_inactive'}`} onClick={(e)=> {
								e.preventDefault()
								if(newCollection.isPrivate == true) {
									setNewCollection({
										...newTag_value,
										isPrivate: false
									})
								} else {
									setNewCollection({
										...newTag_value,
										isPrivate: true
									})
								}
							}}>Private</button>

							<button className={`buttonDefault`} onClick={(e)=> {
								e.preventDefault()
							}}>Save</button>
						</div>
					</form>
				</li>

				{/*Manage Collections*/}
				<li className={`option ${section.collections == true ? 'open' : 'close'}`} id="manageCollections">
					<button className={`header buttonDefault`}
							onClick={(e)=> {
								e.preventDefault()
								if(section.collections) {
									setSection({
										...section,
										collections: false
									}) 
								} else {
									setSection({
										...section,
										collections: true
									})
								}
					}}>Manage Collections</button>

					<ul id="collections">
						{userCollections.map((item, index) => (
							<li key={item.id}
								className={`${userCollections[index].selected == true ? 'selected' : ''} 
											${userCollections[index].rename == true ? '_rename' : ''}
											${userCollections[index].confirmation == true ? '_confirm' : ''}`}
								onClick={(e)=> {
									e.preventDefault()
									manageCollections(item.name, 'selected', true);
								}}>
								<p>{item.name}</p>
								<div className={`options`}>

									<div className={`initialChoiceWrapper`}>
										<button className={`buttonDefault`}
												onClick={(e)=> {
													e.preventDefault();
													setTimeout(()=> {
														manageCollections(item.name, 'rename', true);
													}, 100)
												}}>Rename</button>
										<button className={`buttonDefault`}
												onClick={(e)=> {
													e.preventDefault();
													setTimeout(()=> {
														manageCollections(item.name, 'confirmation', true);
													}, 100)
												}}>Private</button>
										<button className={`buttonDefault`}
												onClick={(e)=> {
													e.preventDefault();
													setTimeout(()=> {
														manageCollections(item.name, 'confirmation', true);
													}, 100)
												}}>Delete</button>
									</div>

									<div className={`confirm `}>
											<p>Are You Sure?</p>

											<div className={`choiceWrapper`}>
												<button className={`buttonDefault`}>Yes</button>
												<button className={`buttonDefault`}
														onClick={(e)=> {
															e.preventDefault();
															console.log('thing');
															setTimeout(()=> {
																manageCollections(item.name, 'confirmation', false);
															}, 100)
												}}>No</button>
											</div>
										</div>

									<form className={` `}>
											<input placeholder="Enter New Title" />
											<div className={'wrapper'}>
												<button className={`buttonDefault`}
														onClick={(e)=> {
															e.preventDefault();
															setTimeout(()=> {
																manageCollections(item.name, 'rename', false);
															}, 100)
												}}>Cancel</button>
												<button className={`buttonDefault`}>Private</button>
												<button className={`buttonDefault`}>Save</button>
											</div>
										</form>
								</div>
							</li>
						))}
					</ul>
				</li>
			</ul>

			<button id="exit" 
					className={`buttonDefault`} 
					onClick={(e)=> {
						e.preventDefault();
						let modalCurrent = modal.current;
						modalCurrent.classList.add('_enter');	

						let secondDelay = setTimeout(()=> {
							setCurrent({
								...current,
								modal: false
							})
						}, 400)
					}}>Exit
			</button>
		</div>
	)
}





export default function Macros({active}) {

	let isActive = active;
	let [modal, setModal] = React.useReducer(state => !state, false);
	let [sectionOpen, set_sectionOpen] = React.useState([
		{
			expand0: false
		},
		{
			expand1: false
		},
		{
			expand2: false
		}
	])

	let [tags, setTags] = React.useState([]);
	let [privatePosts, setPrivatePosts] = React.useState([]);
	let [collections, setCollections] = React.useState([])

	let updateMacros = async() => {

		let tags = await accessAPI.getMacros('tags');
		let userPrivatePosts = await accessAPI.getMacros('private');
		// let collections = await accessAPI.getMacros('collections');

		setTags(tags);
		setPrivatePosts(userPrivatePosts);
		// setCollections(collections);
	}

	// console.log(tags);

	React.useEffect(()=> {

		updateMacros();
	}, [])

	return (
		<div id="macros" className={`${isActive == 3 ? 'active' : 'not'}`}>
			
			<div id="userTags" className={`${sectionOpen.expand0 ? 'open' : 'close'}`}>
				<div className={`headerWrapper`}>
					<h2>Your Tags</h2>
					<button className={`buttonDefault`} onClick={()=> {
						if(sectionOpen.expand0) {
							set_sectionOpen({
								...sectionOpen,
								expand0: false
							})
						} else {
							set_sectionOpen({
								...sectionOpen,
								expand0: true
							})
						}
					}}>See All</button>
				</div>

				<ul className={`tagsWrapper`}>
					{tags.map(tag => (
						<li className={tag.type} key={tag.name}>
							{tag.name}
						</li>
					))}
				</ul>
			</div>

			<div id="privatePosts" className={`${sectionOpen[1].expand ? 'open' : 'close'}`}>
				<div className={`headerWrapper`}>
					<h2>Private Posts</h2>
					<button className={`buttonDefault`} onClick={()=> {
						if(sectionOpen.expand1) {
							set_sectionOpen({
								...sectionOpen,
								expand1: false
							})
						} else {
							set_sectionOpen({
								...sectionOpen,
								expand1: true
							})
						}
					}}>See All</button>
				</div>

				<ul className={`postsWrapper`}>
					
				</ul>

			</div>

			<div id="collections" className={`${sectionOpen[2].expand ? 'open' : 'close'}`}> 
				<div className={`headerWrapper`}>
					<h2>Collections</h2>
					<button className={`buttonDefault`} onClick={()=> {
						if(sectionOpen.expand2) {
							set_sectionOpen({
								...sectionOpen,
								expand2: false
							})
						} else {
							set_sectionOpen({
								...sectionOpen,
								expand2: true
							})
						}
					}}>See All</button>				
				</div>

				<div className={`collectionsWrapper`}>
					
				</div>
			</div>
			
		</div>
	)
}