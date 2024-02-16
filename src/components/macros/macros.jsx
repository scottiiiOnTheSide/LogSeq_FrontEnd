/* * * V I T A L S * * */
import * as React from 'react';
import {useParams, useLocation} from 'react-router-dom';
import Calendar from '../calendar'
import APIaccess from '../../apiaccess';

/* * * C O M P O N E N T S * * */
import Header from '../../components/home/header';
import Instant from '../../components/instants/instant';
import InteractionsList from '../../components/instants/interactionsList';


const accessAPI = APIaccess(); 




export default function Macrospage({
	socketURL,
	socketMessage,
    setSocketMessage,     
    sendMessage,
    isActive,
    setActive,
    accessID,
    setAccessID,
    unreadCount,
    setUnreadCount,
    getUnreadCount,
    lastMessage,
    selectedDate,
    set_selectedDate
}) {

	const location = useLocation();
	const [postData, setPostData] = React.useState(location.state.posts);
	const macroID = location.state.macroID;
	const cal = Calendar();
	

	/* Opening animation */
	let el = React.useRef();

	React.useEffect(()=> {
		let elCurrent = el.current;
		let delay = setTimeout(()=> {
			elCurrent.classList.remove('_enter');	
		}, 200)
	}, [])

	return (
		<section id="MACROS" ref={el} className={`_enter`}>
			<Header cal={cal} isPost={false} unreadCount={unreadCount}/>


		</section>
	)
}

// state {
// 	posts: resultingArrayFromAPI
// 	macroID: is macro _id
// }