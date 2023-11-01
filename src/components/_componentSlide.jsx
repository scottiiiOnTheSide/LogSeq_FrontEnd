
export default function componentSlide_UserSocial (User, Social){

	let isDragging = false,
	startPos = 0,
	currentTranslate = 0,
	prevTranslate = 0,
	animationID = 0,
	currentIndex = 0,
	getPositionX = (event) => {
		return event.type.includes('mouse') 
			? event.pageX 
			: event.touches[0].clientX;
	},
	getPositionY = (event) => {
		return event.type.includes('mouse') 
			? event.pageY 
			: event.touches[0].clientY;
	},
	setSliderPosition = (axis) => {
		if(axis == 'x') {
			components[currentIndex].style.transform = `translateX(${currentTranslate}px)`	
		}
		else if (axis == 'y') {
			components[currentIndex].style.transform = `translateY(${currentTranslate}px)`
		}
		
	},
	animationX = (element) => {
		if(isDragging) {
				setSliderPosition('x');
				requestAnimationFrame(animationX);
			}
	},
	animationY = (element) => {
		if(isDragging) {
			setSliderPosition('y');
			requestAnimationFrame(animationY);
		}
	},
	setPositionByIndexY = () => {
		currentTranslate = currentIndex * -window.innerHeight;
		prevTranslate = currentTranslate;
		setSliderPosition('y');
	},
	setPositionByIndexX = () => {
		currentTranslate = currentIndex * -window.innerWidth;
		prevTranslate = currentTranslate;
		setSliderPosition('x');
	};

	let components = [User, Social];

	components.forEach((element, index, array) => {
		// const image = element.firstElementChild;
		// image.addEventListener('dragstart', (e) => {e.preventDefault() });

			//touch events
			element.addEventListener('touchstart', touchStart(index, element))
			// element.onTouchStart={touchStart(index, element)};
			element.addEventListener('touchend', touchEnd(index))
			element.addEventListener('touchmove', touchMove)


			//mouse events
			element.addEventListener('mousedown', touchStart(index, element))
			element.addEventListener('mouseup', touchEnd(index))
			element.addEventListener('mouseleave', touchEnd(index))
			element.addEventListener('mousemove', touchMove)
	});

	function touchStart(index) {
		return function(event) {

			//should prevent top of screen from being pulled down 
			event.stopPropagation()

			currentIndex = index;
			
			if(window.innerWidth >= 1024) {
				startPos = getPositionX(event);
				console.log('X read');
			}


			
			isDragging = true;

			if(window.innerWidth >= 1024) {
				animationID = requestAnimationFrame(animationX);	
			} else {
				animationID = requestAnimationFrame(animationY);
			}
			components[currentIndex].add('grabbing');
		}
	}

	function touchMove(event) {

		//should prevent top of screen from being pulled down 
		event.stopPropagation()

		if(isDragging) {
			var currentPosition = getPositionX(event);
			currentTranslate = prevTranslate + currentPosition - startPos;
		}
	}

	function touchEnd(index) {
		return function(event) {
			if(isDragging == true) {
				isDragging = false;
		    	cancelAnimationFrame(animationID)

				const movedBy = currentTranslate - prevTranslate;
				//for mobile
				if(movedBy < -100 && currentIndex < components.length - 1) {
					currentIndex += 1;
					let place = currentIndex + 1;
					console.log(place);
				}
				if(movedBy > 100 && currentIndex > 0) {
					currentIndex -= 1;
					let place = currentIndex + 1;
					console.log(place);
				}

				components[index].style.opacity = 0;
				components[currentIndex].style.opacity = 0;
				components[currentIndex].style.transform = 'scale(0.85)'
				setTimeout(() => {
					components[index].style.display = 'none';

				}, 350);
				setTimeout(()=> {	
					components[currentIndex].style.display = 'block';
				}, 375)
				setTimeout(()=> {
					components[currentIndex].style.transform = 'scale(1)'	
					components[currentIndex].style.opacity = 1;
				}, 400)

				//prevent image disappeareance if it is last
				// didn't need to add further implementation :D 
				
			}
		components[currentIndex].remove('grabbing');
		currentTranslate = 0;
		}
	}
}