import * as React from 'react';
import APIaccess from '../../apiaccess';

let accessAPI = APIaccess();

export function ManageMacros({current, setCurrent, setSocketMessage, socketMessage}) {

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
			_id: 1234,
			selected: false,
			delete: null,
			rename: null,
			isPrivate: false,
			makePrivate: null
		},
		{
			name: 'They can have spaces',
			selected: false,
			_id: 5678,
			delete: null,
			rename: null,
			isPrivate: false,
			makePrivate: null
		}, 
		{
			name: 'In their names. Unlike Tags',
			selected: false,
			_id: 9101,
			delete: null,
			rename: null,
			isPrivate: false,
			makePrivate: null
		}
	])
	let updateMacros = async() => {

		let tags = await accessAPI.getMacros('tags');
		tags = tags.filter(tag => tag.type == 'tag');
		tags = tags.map(tag => {
			return {
				name: tag.name,
				selected: false,
				id: tag._id
			}})
			// let userPrivatePosts = await accessAPI.getMacros('private');
		// let collections = await accessAPI.getMacros('collections');

		//02. 15. 2024
		//collections need to have 'confirmation, rename and selected' added to 
		//objects when placed within state array
		let collections = await accessAPI.getMacros('collections');
		collections = collections.map(el => {
			return {
				name: el.name,
				_id: el._id,
				selected: false,
				delete: null,
				rename: null,
				isPrivate: el.isPrivate,
				makePrivate: null
			}
		})

		setUserTags(tags);
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
		name: '',
		isPrivate: false,
		description: null
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
					return {
						...ele,
						selected: false
					}
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
	let deleteTag_submit = async(id) => {

		let body = {
			type: 'tag',
			groupID: id,
			action: 'deleteTag'
		}
		setSocketMessage(body);
	}



	let newCollectionName_onChange = (e) => {

		const input = e.currentTarget.value;
		setNewCollection({
			...newCollection,
			name: e.currentTarget.value
		});
	}
	let newCollectionDescription_onChange = (e) => {

		const input = e.currentTarget.value;
		setNewCollection({
			...newCollection,
			description: e.currentTarget.value
		});
	}
	let newCollection_submit = async() => {

		let body = {
			type: 'collection',
            name: newCollection.name,
            owner: userID,
            isPrivate: newCollection.isPrivate == true ? true : false,
            details: newCollection.description,
            action: 'newCollection'
		}
		console.log(body);
		setSocketMessage(body);
		setNewCollection({
			name: '',
			description: '',
			isPrivate: false
		})
	}



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
				else if(type == 'makePrivate') {
					return {
						...ele,
						selected: false,
						makePrivate: value 
					}
				}
				else if(type == 'delete') {
					return {
						...ele,
						selected: false,
						delete: value 
					}
				}
			} else {
				return {
					...ele,
					selected: false,
					rename: false,
					delete: false,
					makePrivate: false 
				}
			}
		})
		setUserCollections(newVer);
	}
	let [editCollection, setEditCollection] = React.useState({
		newName: '',
		isPrivate: null,
		id: null
	})

	let editCollectionName_onChange = (e) => {

		const input = e.currentTarget.value;
		setEditCollection({
			...editCollection,
			newName: e.currentTarget.value
		});
	}

	let renameCollection = async(groupID) => {

		let body = {
			newName: editCollection.newName,
			groupID: groupID,
			action: 'renameCollection'
		}
		setSocketMessage(body);

		setEditCollection({
			...editCollection,
			newName: ''
		})
	}

	let privatizeCollection = async(isPrivate, groupID) => {

		console.log(isPrivate)
		console.log(groupID)

		let body = {
			isPrivate: isPrivate,
			groupID: groupID,
			action: 'privatizeCollection',
		}
		setSocketMessage(body);
	}

	let deleteCollection = async(groupID) => {
		console.log('si')

		setSocketMessage({
			groupID: groupID,
			action: 'deleteCollection'
		});
	}
	
	// console.log(socketMessage);

	/* For opening animation */
	let modal = React.useRef();

	React.useEffect(()=> {
		let modalCurrent = modal.current;
		let delay = setTimeout(()=> {
			modalCurrent.classList.remove('_enter');	
		}, 200)

		updateMacros();
	}, [])

	/*
		on response from socketMessage, any open menu option closes.
		!update so that it only closes on success responses
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
		updateMacros();
	}, [socketMessage])

	console.log(userCollections)

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
								className={`${userTags[index].selected == true ? 'selected' : ''}`}>
								<button onClick={()=> {selectDeleteTag(tag.name, index)}}>{tag.name}</button>
								<div className={`confirmation`}>
									<p>Are You Sure?</p>

									<div className={`buttonWrapper`}>
										<button className={`buttonDefault`} 
												onClick={(e)=> {
													e.preventDefault()
													deleteTag_submit(tag.id);
												}}>Yes</button>
										<button className={`buttonDefault`}
												onClick={(e)=> {
													e.preventDefault()
													selectDeleteTag(tag.name, index)
												}}>No</button>
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
						<input  placeholder="Enter a Name"
								name="collectionName" 
							   	onChange={newCollectionName_onChange} 
							   	value={`${newCollection.name}`}/>
						<textarea name="collectionDescription" 
									placeholder="Enter Description" 
									rows="4" 
									cols="20"
									onChange={newCollectionDescription_onChange}>
						</textarea>

						<div id="buttonWrapper">
							<button className={`buttonDefault ${newCollection.isPrivate == true ? '' : '_inactive'}`} onClick={(e)=> {
								e.preventDefault()
								if(newCollection.isPrivate == true) {
									setNewCollection({
										...newCollection,
										isPrivate: false
									})
								} else {
									setNewCollection({
										...newCollection,
										isPrivate: true
									})
								}
							}}>Private</button>

							<button className={`buttonDefault`} onClick={(e)=> {
								e.preventDefault()
								newCollection_submit()
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
									manageCollections();
								} else {
									setSection({
										...section,
										collections: true
									})
									manageCollections();
								}
					}}>Manage Collections</button>

					<ul id="collections">
						{userCollections.map((item, index) => (
							<li key={item.id}
								className={`${userCollections[index].selected == true ? 'selected' : ''} 
											${userCollections[index].rename == true ? '_rename' : ''}
											${userCollections[index].delete == true ? '_confirm' : ''}
											${userCollections[index].makePrivate == true ? '_confirm' : ''}`}
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
										<button className={`buttonDefault ${userCollections[index].isPrivate == true ? '' : '_inactive'}`}
												onClick={(e)=> {
													e.preventDefault();
													setTimeout(()=> {
														manageCollections(item.name, 'makePrivate', true);
													}, 100)
												}}>Private</button>
										<button className={`buttonDefault`}
												onClick={(e)=> {
													e.preventDefault();
													setTimeout(()=> {
														manageCollections(item.name, 'delete', true);
													}, 100)
												}}>Delete</button>
									</div>

									<div className={`confirm `}>
											<p>Are You Sure?</p>

											<div className={`choiceWrapper`}>
												<button className={`buttonDefault`}
														onClick={(e)=> {
															e.preventDefault()
															console.log(item.name)
															if(userCollections[index].delete == true) {
																deleteCollection(item._id)
															}
															else if(userCollections[index].makePrivate == true) {
																let change = userCollections[index].isPrivate == true ? false : true;
																privatizeCollection(change, item._id);
															}
														}}>Yes</button>

												<button className={`buttonDefault`}
														onClick={(e)=> {
															e.preventDefault();
															console.log('thing');
															setTimeout(()=> {
																manageCollections();
															}, 100)
												}}>No</button>
											</div>
										</div>

									<form className={` `}>
											<input placeholder="Enter New Title" 
												   value={`${editCollection.newName}`}
												   onChange={editCollectionName_onChange}/>
											<div className={'wrapper'}>
												<button className={`buttonDefault`}
														onClick={(e)=> {
															e.preventDefault();
															setTimeout(()=> {
																manageCollections(item.name, 'rename', false);
															}, 100)
															setEditCollection({
																...editCollection,
																newName: '',
															})
												}}>Cancel</button>
												<button className={`buttonDefault`}
														onClick={(e)=> {
															e.preventDefault();
															renameCollection(item._id)
												}}>Save</button>	
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





export default function Macros({active, current, setCurrent}) {

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

	React.useEffect(()=> {
		updateMacros();
	}, [current])

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