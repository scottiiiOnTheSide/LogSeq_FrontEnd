import * as React from 'react';
import './customLogEditor.css';
import APIaccess from '../../../apiaccess';


const accessAPI = APIaccess(); 

export default function CustomLogEditor({current, setCurrent, setSocketMessage, socketMessage}) {

	const userID = sessionStorage.getItem('userID');
	const [currentLog, setCurrentLog] = React.useState(0);
	const [title, setTitle] = React.useState("");
  	const [connections, setConnections] = React.useState([]);
  	const [subscriptions, setSubscriptions] = React.useState([]);
  	const [topics, setTopics] = React.useState([]);
  	const [tags, setTags] = React.useState([]);
  	const [showTopics, setShowTopics] = React.useState(false);
  	const [showTags, setShowTags] = React.useState(false);
  	const [searchTerm, setSearchTerm] = React.useState("");
  	const [selectedLocations, setSelectedLocations] = React.useState([]);
  	const [searchResults, setSearchResults] = React.useState([]);
  	const [isSearchFocused, setIsSearchFocused] = React.useState(false);


  	const getDataForSelections = async() => {
  		//happens whenever component appears

  		//get connections & subscriptions, one call
  		//get topics, one call
  		//get user's tags, one call

  		//add 'selected' field, push them into their respective states
  		let allConnects = await accessAPI.getConnections(userID);
  		let topics = await accessAPI.getSuggestions();
		let userTags = await accessAPI.getUserTags();

		let connections = [];
		let subscriptions = [];

		allConnects.forEach(user => {
			user.selected = false;

			if(user.isConnection == true) {
				connections.push(user)
			}
			else if(user.isSubscription == true) {
				subscriptions.push(user)
			}
		});

		topics = topics.map(topic => {
			return {
				name: topic,
				selected: false
			}
		})

		userTags.forEach(tag => {
			tag.selected = false;
		})

		setConnections(connections);
		setSubscriptions(subscriptions);
		setTopics(topics);
		setTags(userTags);
  	}

  	const getCustomLog = async() => {
  		//selecting a preexisting customLog triggers this

  		//when customLog is selected, compare all values from user's data in their states
  		//to the selections from the customLog, then updated the states to reflect selected
  		//options

 		//also changes sessionStorage.currentLog
  	}

  	//gets all selected options & the log's number,
  	const updateUsersCustomLogs = async(data) => {

  		//add all selected options from each group into new object

  		//send object to backend

  		//include log number

  		let selectedConnections = connections.filter(user => {
  			if(user.selected == true) {
  				return user._id;
  			}
  		});

  		let selectedSubscriptions = subscriptions.filter(user => {
  			if(user.selected == true) {
  				return user._id;
  			}
  		});

  		let selectedTags = tags.filter(tag => {
  			if(tag.selected == true) {
  				return tag._id;
  			}
  		});

  		let selectedTopics = topics.filter(topic => {
  			if(topic.selected == true) {
  				return topic.name;
  			}
  		})

  		//as of rn, selected locations are added straight into the selectedLocations 
  		//state var

  		let request = await accessAPI.userSettings({
  			action: 'saveCustomLog',
  			logNumber: currentLog,
  			connections: selectedConnections,
  			subscriptions: selectedSubscriptions,
  			topics: selectedTopics,
  			tags: selectedTags,
  			locations: selectedLocations
  		})

  		if(request.confirmation == true) {
  			setSocketMessage({
  				type: 'simpleNotif',
  				message: `Custom log ${customLog} updated !`
  			})
  		}
  	}

  	React.useEffect(()=> {
  		getDataForSelections();
  	}, [])


	/* Determine Component Height on Load*/
	let wrapper = React.useRef();
	React.useEffect(()=> {
		let viewportHeight = window.innerHeight;
		let maxHeight = viewportHeight - 160;
		wrapper.current.style.height = `${maxHeight}px`;
	}, [])

	return <div id="customLogEditor" 
			ref={wrapper} 
			className={`${current.transition == true ? 'leave' : ''}`}>
		


	</div>
}