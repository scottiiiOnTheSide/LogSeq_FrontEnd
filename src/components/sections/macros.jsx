import * as React from 'react';
import APIaccess from '../../apiaccess';

let accessAPI = APIaccess();

export function ManageMacros({current, setCurrent, setSocketMessage}) {

	
	const [sectionOpen, set_sectionOpen] = React.useState([
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
	// let modalCurrent = modal.current;

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
				
				<li className={`option`} id="createNewTag">
					<button className={`header buttonDefault`}>Create Tag</button>
				</li>

				<li className={`option`} id="deleteTags">
					<button className={`header buttonDefault`}>Delete Tags</button>
				</li>

				<li className={`option`} id="createNewCollection">
					<button className={`header buttonDefault`}>New Collection</button>
				</li>

				<li className={`option`} id="editCollections">
					<button className={`header buttonDefault`}>Manage Collections</button>
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