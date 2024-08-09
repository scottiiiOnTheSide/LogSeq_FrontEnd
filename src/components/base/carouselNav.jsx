/* * * V i t a l s * * */
import * as React from 'react';

export default function CarouselNav({current, setCurrent}) {

	const opts = [
		// {name: "Groups", active: false, key: 0},
		{name: "Social", active: false, key: 1},
		{name: "User", active: true, key: 2}, //middle is default
		{name: "Macros", active: false, key: 3},
		// {name: "Home", active: false, key: 4}
	]
	const [options, setOptions] = React.useState(opts); 
	const list = React.useRef();

	// function moveLeft() {
	// 	let currentt = parseInt(getComputedStyle(list.current).left);

	// 	if(currentt == "160") {
	// 		return null;
	// 	} else {
	// 		setLeft(true);
	// 		setCurrent({
	// 			...current,
	// 			section:current.section - 1,
	// 			scrollTo: null
	// 		});
	// 		currentt = currentt + 80;
	// 		list.current.style.left = `${currentt}px`;
	// 	}
	// }

	// function moveRight() {
	// 	let currentt = parseInt(getComputedStyle(list.current).left);

	// 	if(currentt == "-160") {
	// 		return null;
	// 	} else {
	// 		setRight(true);
	// 		setCurrent({
	// 			...current,
	// 			section:current.section + 1,
	// 			scrollTo: null
	// 		});
	// 		// console.log(current);
	// 		currentt = currentt - 80;
	// 		list.current.style.left = `${currentt}px`;	
	// 	}
	// }

	// React.useEffect(()=> {
	// 	let num;
	// 	if(current.section == 0 || current.section == 1) {
	// 		num = current.section + 1;
	// 	}
	// 	else {
	// 		num = 2;
	// 	}
	// 	opts[num].active = false;
	// 	opts[current.section].active = true;
	// 	// setOptions(opts);

	// 	setLeft(false);
	// }, [left])

	// React.useEffect(()=> {
	// 	let num = current.section - 1;
	// 	opts[num].active = false;
	// 	opts[current.section].active = true;
	// 	// setOptions(opts);

	// 	setCurrent({
	// 		...current,
	// 		scrollTo: null,
	// 	})
	// 	setRight(false);
	// }, [right])

	React.useEffect(()=> {

		// if(current.section == 0) {
		// 	list.current.style.left = '160px'
		// }

		if(current.section == 0) {
			list.current.style.left = '80px';
		}

		else if(current.section == 2) {
			list.current.style.left = '-80px';
		}

		// else if(current.section == 4) {
		// 	list.current.style.left = '-160px';
		// }

	}, [])


	/*
		Current process is:
			- move_()
				- get ul#list current left style attribute
					if left or rightmost, do nothing
					else, set current.section to new section: 0, 1, 2
				- toggle the 'left' state var
					- current section has already been set to new section,
						set options, the one were still on, to inactive
					- set options section were going to active
				- set current section to the next section
				- adjust ul#list left styling
	*/

	/*
		New Algo:
			if left option is chosen:
				if center is active,
					move ul#list by left 80 ->
				if right is active 
					move ul#list by left -80 <-

			if center option is chosen
				move ul#list to left 0, recenter

			if right option is chosen 
				if center is active,
					move ul#list by left -80
				is left is active,
					move ul#list by left -80

		for switching sections:
		set new var to num of current section,
		set current.section to new section
		set options with new var to inactive
		set options with new section to active
	*/

	const selectOption = (option) => {

		let previousSection = current.section;
		console.log(previousSection)

		opts[previousSection].active = false;
		if(option != 1) {
			opts[1].active = false;
		}
		opts[option].active = true;
		console.log(opts)
		setOptions(opts);

		setCurrent({
			...current,
			section: option,
			scrollTo: null
		})

		if(option == 1) { //center option

			let delay = setTimeout(()=> {
				list.current.style.left = `0px`;
			}, 100)
		}
		else if(option == 0) { //left option

			let delay = setTimeout(()=> {
					list.current.style.left = `80px`;
				}, 100)
		}
		else if(option == 2) { //right option

			let delay = setTimeout(()=> {
					list.current.style.left = `-80px`;
				}, 100)
		}
	}

	console.log(options)
	console.log(current.section)

	return (
		<nav>
			{/*<button id="leftToggle" onClick={moveLeft}></button>*/}

			<ul ref={list}>
				{/*{options.map((opt) => (
					<li className={opt.active ? "active" : "not"} key={opt.key}>
						<button className={`buttonDefault`} onClick={()=> {

						}}>
							{opt.name}
						</button>
					</li>
				))}*/}
				<li className={options[0].active ? "active" : "not"}>
					<button className={`buttonDefault`} onClick={()=> {
						
						// if(opts[1].active || opts[2].active) {
						// 	moveLeft();
						// }
						selectOption(0);
					}}>
						{options[0].name}
					</button>
				</li>

				<li className={options[1].active ? "active" : "not"}>
					<button className={`buttonDefault`} onClick={()=> {
						// if(opts[0].active) {
						// 	moveRight()
						// }
						// else if(opts[2].active) {
						// 	moveLeft()
						// }
						selectOption(1);
					}}>
						{options[1].name}
					</button>
				</li>

				<li className={options[2].active ? "active" : "not"}>
					<button className={`buttonDefault`} onClick={()=> {
						// if(opts[1].active || opts[0].active) {
						// 	moveRight();
						// }

						selectOption(2);
					}}>
						{options[2].name}
					</button>
				</li>
			</ul>

			{/*<button id="rightToggle" onClick={moveRight}></button>*/}
		</nav>
	)
}