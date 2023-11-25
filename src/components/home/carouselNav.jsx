/* * * V i t a l s * * */
import * as React from 'react';

export default function CarouselNav({current, setCurrent}) {

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
		let currentt = parseInt(getComputedStyle(list.current).left);

		if(currentt == "160") {
			return null;
		} else {
			setLeft();
			setCurrent({
				...current,
				section:current.section - 1,
				scrollTo: null
			});
			currentt = currentt + 80;
			list.current.style.left = `${currentt}px`;
		}
	}

	function moveRight() {
		let currentt = parseInt(getComputedStyle(list.current).left);

		if(currentt == "-160") {
			return null;
		} else {
			setRight();
			setCurrent({
				...current,
				section:current.section + 1,
				scrollTo: null
			});
			// console.log(current);
			currentt = currentt - 80;
			list.current.style.left = `${currentt}px`;	
		}
	}

	React.useEffect(()=> {
		let num = current.section + 1;
		opts[num].active = false;
		opts[current.section].active = true;
		setOptions(opts);

		setCurrent({
			...current,
			scrollTo: null,
		})
	}, [left])

	React.useEffect(()=> {
		let num = current.section - 1;
		opts[num].active = false;
		opts[current.section].active = true;
		setOptions(opts);

		setCurrent({
			...current,
			scrollTo: null,
		})
	}, [right])

	React.useEffect(()=> {

		if(current.section == 0) {
			list.current.style.left = '160px'
		}

		else if(current.section == 1) {
			list.current.style.left = '80px';
		}

		else if(current.section == 3) {
			list.current.style.left = '-80px';
		}

		else if(current.section == 4) {
			list.current.style.left = '-160px';
		}

	}, [])

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