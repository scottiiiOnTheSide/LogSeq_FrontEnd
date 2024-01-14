import * as React from 'react';
import APIaccess from '../../apiaccess';

let accessAPI = APIaccess();

export function ManageMacros({current, setCurrent, setSocketMessage}) {

	
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
			editCollections: false
		}
	])
	const [enter, setEnter] = React.useReducer(state => !state, true);
	let modal = React.useRef();

	let updateMacros = async() => {

		let tags = await accessAPI.getMacros('tags');
		// let userPrivatePosts = await accessAPI.getMacros('private');
		// let collections = await accessAPI.getMacros('collections');

		setDeleteTags(tags);
		// setPrivatePosts(userPrivatePosts);
		// setCollections(collections);
	}


	/* Creating a New Tag */
	const [newTag_value, setNewTag_value] = React.useState('');
	let newTag_onChange = (e) => {

		const input = e.currentTarget.value;
		setNewTag_value(e.currentTarget.value);
	}

	const [deleteTags, setDeleteTags] = React.useState([
		{
			name: 'thisIs',
			id: 1234
		},
		{
			name: 'aListOf',
			id: 5678
		}, 
		{
			name: 'tagsToBe',
			id: 9101
		},
		{
			name: 'deleted',
			id: 1123
		}
	])
	let requestTagDelete = async(name, id) => {

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


	/* For opening animation */
	React.useEffect(()=> {
		let modalCurrent = modal.current;
		let delay = setTimeout(()=> {
			modalCurrent.classList.remove('_enter');	
		}, 200)
	}, [])

	return (
		// <div id="ManageMacros" ref={modal} className={`${current.transition == false ? '_enter' : ''}`}>
		<div id="ManageMacros" ref={modal} className={'_enter'}>

			
			<h2>Macros</h2>

			<ul id="mainMenu">
				
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
							value={newTag_value}/>
						<div className={'buttonWrapper'}>
							<button className={`buttonDefault`}>Private</button>
							<button className={`buttonDefault`}>Save</button>
						</div>
					</div>
				</li>

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
						{deleteTags.map(tag => (
							<li key="tag.id">
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
				</li>

				<li className={`option ${section.editCollections == true ? 'open' : 'close'}`} id="editCollections">
					<button className={`header buttonDefault`}
							onClick={(e)=> {
								e.preventDefault()
								if(section.editCollection) {
									setSection({
										...section,
										editCollection: false
									}) 
								} else {
									setSection({
										...section,
										editCollection: true
									})
								}
					}}>Manage Collections</button>
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

	console.log(tags);

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