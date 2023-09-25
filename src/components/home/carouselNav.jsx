/* * * V i t a l s * * */
import * as React from 'react';

export default function CarouselNav({currentSection, setSection}) {

	const opts = [
		{name: "Groups", active: false, key: 0},
		{name: "Social", active: false, key: 1},
		{name: "User", active: true, key: 2}, //middle is default
		{name: "Macros", active: false, key: 3},
		{name: "Home", active: false, key: 4}
	]
	const [options, setOptions] = React.useState(opts); 
	const [right, setRight] = React.useReducer(state => !state, false);
	const [left, setLeft] = React.useReducer(state => !state, false);

	const list = React.useRef();

	function moveLeft() {
		let current = parseInt(getComputedStyle(list.current).left);

		if(current == "160") {
			return null;
		} else {
			setLeft();
			setSection(currentSection - 1);
			current = current + 80;
			list.current.style.left = `${current}px`;
		}
	}

	function moveRight() {
		let current = parseInt(getComputedStyle(list.current).left);

		if(current == "-160") {
			return null;
		} else {
			setRight();
			setSection(currentSection + 1);
			// console.log(current);
			current = current - 80;
			list.current.style.left = `${current}px`;	
		}
	}

	React.useEffect(()=> {
		let num = currentSection + 1
		opts[num].active = false;
		opts[currentSection].active = true;
		setOptions(opts);
	}, [left])

	React.useEffect(()=> {
		let num = currentSection - 1;
		opts[num].active = false;
		opts[currentSection].active = true;
		setOptions(opts);
	}, [right])


	return (
		<nav>
			<button id="leftToggle" onClick={moveLeft}></button>

			<ul ref={list}>
				{options.map((opt) => (
					<li className={opt.active ? "active" : "not"} key={opt.key}>
						{opt.name}
					</li>
				))}
			</ul>

			<button id="rightToggle" onClick={moveRight}></button>
		</nav>
	)
}