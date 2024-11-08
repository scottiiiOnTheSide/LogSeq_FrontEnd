import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import Slider from 'react-touch-drag-slider';

export default function DragSlider ({ current, setCurrent, siteLocation }) {

	//media for array originally stored in current.gallery
	const [media, setMedia] = React.useState(current.gallery); 
	/*
		{
			content: img url
			postID: 
		}
	*/
	const [index, setIndex] = React.useState(0);
	const [enter, setEnter] = React.useReducer(state => !state, true);
	const navigate = useNavigate();

	const next = () => {
    	if (index <  media.length - 1) setIndex(index + 1);
  	};

  	const previous = () => {
    	if (index > 0) setIndex(index - 1);
  	};

	return (

		<div id='dragSlider' className={`${enter == true ? '_enter' : '_leave'}`}>

			<Slider 
				activeIndex={index}
				threshold={100}
				transition={0.2}
				scaleOnDrag={true}
			>
				{media.map((content, index) => (
					<img src={content.content} key={index} alt={content.type}/>
				))}	
			</Slider>
			
			<div id="buttonWrapper">
				{siteLocation == 'home' &&
					<button className={`buttonDefault`} onClick={async()=> {
						setEnter();
						let delay = setTimeout(async()=> {
							navigate(`/post/${media[index].postID}`, {
								state: {}
							})
						}, 400)
					}}>
						View Post
					</button>
				}
				

				<button className={`buttonDefault`} onClick={()=> {
					setEnter();
					let delay = setTimeout(()=> {
						setCurrent({
							...current,
							gallery: []
						})
					}, 350)
				}}>
					Exit
				</button>

			</div>
		</div>
	)
}