/* * * V i t a l s * * */
import * as React from 'react';

import './sections.css'

import UserLog from './userLog';
import SocialLog from './socialLog';
import GroupsList from './groupsList';
import Macros from './macros';
import HomeLog from './homeLog';

export default function SectionsWrapper({current, setCurrent}) {

	/*** Set Wrapper Height ***/
	let wrapper = React.useRef()
	React.useEffect(()=> {
		let viewportHeight = window.innerHeight;
		let maxHeight = viewportHeight - 215;
		wrapper.current.style.height = `${maxHeight}px`;
	}, [])

	let prePanes = {
		groups: false, //0
		socialLog: false, //1
		userLog: false, //2
		macros: false, //3
		home: false //4
	}
	// let prePanes = {};
	let [panes, setPanes] = React.useState({
		groups: current.section == 0 ? true : false, //0
		socialLog: current.section == 1 ? true : false, //1
		userLog: current.section == 2 ? true : false, //2
		macros: current.section == 3 ? true : false, //3
		home: current.section == 4 ? true : false
	});
	let [active, setActive] = React.useState(current.section); 
	let currentSection = current.section;
	// when is number corresponding to section, said section is active
	// switch to null for no active classes
	// console.log(active);
	// console.log(currentSection)
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

	console.log(currentSection);
	console.log(panes)
	console.log(active)

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
			}, 1100)	

		} else if(currentSection == 3) {

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
				prePanes.macros = true;
				setPanes(prePanes);
				console.log(panes);
			}, 1100)
		}
	}, [currentSection])

	return (
		<div id="sectionsWrapper" ref={wrapper}>

			{panes.socialLog &&
				<SocialLog active={active} 
						   current={current}
						   setCurrent={setCurrent} />
			}
			{panes.userLog &&
				<UserLog active={active} 
						 current={current} 
						 setCurrent={setCurrent} />
			}
			{panes.macros &&
				<Macros active={active} 
						current={current} 
						setCurrent={setCurrent} />
			}
			{panes.groups &&
				<GroupsList active={active} />
			}
			{panes.home &&
				<HomeLog active={active} />
			}
			
		</div>
	)

}