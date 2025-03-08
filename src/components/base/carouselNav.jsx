/* * * V i t a l s * * */
import * as React from 'react';

export default function CarouselNav({current, setCurrent, navOptions, setNavOptions}) {

	const opts = [
		// {name: "Groups", active: false, key: 0},
		{name: "Social", active: false, key: 1},
		{name: "Home", active: true, key: 2}, //middle is default
		{name: "Macros", active: false, key: 3},
		// {name: "Home", active: false, key: 4}
	]
	const list = React.useRef();

	React.useEffect(()=> {

		// setNavOptions(opts);
		if(current.section == 0) {
			list.current.style.left = '80px';
		}

		else if(current.section == 2) {
			list.current.style.left = '-80px';
		}

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
		// console.log(opts)
		setNavOptions(opts);

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

	// console.log(options)
	// console.log(current.section)

	return (
		<nav>
			
			<ul ref={list}>
				<li className={navOptions[0].active ? "active" : "not"}>
					<button className={`buttonDefault navButton`} onClick={()=> {
						console.log(opts);
						selectOption(0);
					}}>
						{opts[0].name}
					</button>
				</li>

				<li className={`${navOptions[1].active ? "active" : "not"} ${current.customizer ? "customizer" : ""}`} id="home">
					<button className={`buttonDefault navButton`} onClick={()=> {

						if(navOptions[1].active == false) {
							selectOption(1);
						}
						
						else if(opts[1].active == true && current.customizer == false) {
							setCurrent({
								...current,
								customizer: true
							})
						}
						else if(opts[1].active == true && current.customizer == true) {
							setCurrent({
								...current,
								transition: true
							})
							let delay = setTimeout(()=> {
								setCurrent({
									...current,
									customizer: false,
									transition: false
								})
							}, 300)
						}
					}}>
						{opts[1].name}
					</button>
				</li>

				<li className={navOptions[2].active ? "active" : "not"}>
					<button className={`buttonDefault navButton`} onClick={()=> {
						selectOption(2);
					}}>
						{opts[2].name}
					</button>
				</li>
			</ul>
		</nav>
	)
}