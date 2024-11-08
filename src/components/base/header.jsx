/* * * V i t a l s * * */
import * as React from 'react';
import { useNavigate } from 'react-router-dom'; 


function ReturnElement ({}) {

	let navigate = useNavigate();
	let [ifLeave, setLeave] = React.useState(false);
	let goBack = () => {
		/* function to return one step backwards using router history */
		setLeave(true)
		setTimeout(()=> {
			navigate(-1)
		}, 575);
	}

	return (
		<svg 
			xml version="1.0"
			viewBox="109.21 220.42 140.874 69.937" 
			xmlns="http://www.w3.org/2000/svg"
			id="return"
			className={ifLeave ? "leave" : ""}
			onClick={goBack}>
	  		<polyline 
	  			id="top"
	  			points="249.644 250.369 109.21 250.393 159.165 220.42" 
	  			transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 1.4210854715202004e-14)"/>
	  		<polyline 
	  			id="bottom"
	  			points="250.084 260.408 109.65 260.384 159.605 290.357" 
	  			transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 1.4210854715202004e-14)"/>
		</svg>
	)
}


export default function Header ({ isReturnable, setNotifList, unreadCount, siteLocation}) {

	/**
	 * 09. 18. 2023
	 * Within Short Term, <header> component houses
	 * - interactionsList Toggle
	 * - unread notif count
	 */
	// let setter = isPost;
	let [returnable, setReturnable] = React.useState(isReturnable);

	return (
		<header>

			{returnable &&
				<ReturnElement />
			}
			<div id="location">
				<h1>{siteLocation}</h1>
			</div>

			<button id="interactionsToggle" onClick={setNotifList}>
				<p>{unreadCount}</p> 
				<span></span>
				<span></span>
				<span></span>
			</button>

		</header>
	)
}