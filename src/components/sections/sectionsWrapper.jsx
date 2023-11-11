/* * * V i t a l s * * */
import * as React from 'react';

import './sections.css'

import UserLog from './userLog';
import SocialLog from './socialLog';
import GroupsList from './groupsList';
import MacrosList from './macrosList';
import HomeLog from './homeLog';

export default function SectionsWrapper({current, setCurrent, setModal, modal, setSocial}) {

	/*** Set Wrapper Height ***/

	let wrapper = React.useRef()
	React.useEffect(()=> {
		let viewportHeight = window.innerHeight;
		let maxHeight = viewportHeight - 180;
		wrapper.current.style.height = `${maxHeight}px`;
	}, [])

	let prePanes = {
		groups: false, //0
		socialLog: false, //1
		userLog: true, //2
		macros: false, //3
		home: false //4
	}
	let [panes, setPanes] = React.useState(prePanes);
	let [active, setActive] = React.useState(); 
	let currentSection = current.section;
	// when is number corresponding to section, said section is active
	// switch to null for no active classes
	console.log(active);
	console.log(currentSection)
	/**
	 * 09. 21. 2023
	 * On currentSection change,
	 * change active to null, switching active pane class to 'non'
	 * then, after delay, set state object key value for section to false 
	 * 
	 * Another delay,
	 * set state object for currentSection to true,
	 * change active state var to number of currentSection;
	 */

	React.useEffect(()=> {

		setActive(currentSection);

		if(currentSection == 2 && active == undefined) {

			let nextStep = setTimeout(()=> {
				Object.keys(prePanes).forEach(value => {
					prePanes[value] = false;
				})
				console.log(prePanes);
				setPanes(prePanes);
			}, 550)

			let thirdStep = setTimeout(()=> {
				setActive(currentSection);
				prePanes.userLog = true;
				setPanes(prePanes);
				console.log(panes);
			}, 1100)

		} else if(currentSection == 2) {

			setActive('x');

			let nextStep = setTimeout(()=> {
				Object.keys(prePanes).forEach(value => {
					prePanes[value] = false;
				})
				console.log(prePanes);
				setPanes(prePanes);
			}, 550)

			let thirdStep = setTimeout(()=> {
				setActive(currentSection);
				prePanes.userLog = true;
				setPanes(prePanes);
				console.log(panes);
			}, 1100)

		} else if (currentSection == 1){

			setActive('x');

			let nextStep = setTimeout(()=> {
				Object.keys(prePanes).forEach(value => {
					prePanes[value] = false;
				})
				console.log(prePanes);
				setPanes(prePanes);
			}, 550)

			let thirdStep = setTimeout(()=> {
				setActive(currentSection);
				prePanes.socialLog = true;
				setPanes(prePanes);
				console.log(panes);
			}, 700)			
		}

	}, [currentSection])

	return (
		<div id="sectionsWrapper" ref={wrapper}>

			{panes.socialLog &&
				<SocialLog active={active} 
						   current={current}
						   setCurrent={setCurrent}/>
			}
			{panes.userLog &&
				<UserLog active={active} 
						 current={current} 
						 setCurrent={setCurrent} 
						 setSocial={setSocial}/>
			}
			{panes.macros &&
				<MacrosList active={active} modal={modal} setModal={setModal}/>
			}
			{panes.groups &&
				<GroupsList active={active} modal={modal} setModal={setModal}/>
			}
			{panes.home &&
				<HomeLog active={active} modal={modal} setModal={setModal}/>
			}
			
		</div>
	)

}