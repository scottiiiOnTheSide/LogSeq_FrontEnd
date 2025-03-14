import * as React from 'react';
import './customLogEditor.css';
import APIaccess from '../../../apiaccess';


const accessAPI = APIaccess(); 

export default function CustomLogEditor({current, setCurrent, setSocketMessage, socketMessage}) {

	const userID = sessionStorage.getItem('userID');
	const [currentLog, setCurrentLog] = React.useState(0);
	const [logs, setLogs] = React.useState([]);
	const [title, setTitle] = React.useState("");
  	const [connections, setConnections] = React.useState([]);
  	const [subscriptions, setSubscriptions] = React.useState([]);
  	const [topics, setTopics] = React.useState([]);
  	const [tags, setTags] = React.useState([]);
  	const [showTopics, setShowTopics] = React.useState(false);
  	const [showTags, setShowTags] = React.useState(false);
  	const [searchTerm, setSearchTerm] = React.useState("");
  	const [inputType, setInputType] = React.useState("");
  	const [selectedLocations, setSelectedLocations] = React.useState([]);
  	const [searchResults, setSearchResults] = React.useState([]);
  	const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  	const [showDropdown, setShowDropdown] = React.useState({
	    connections: false,
	    subscriptions: false
	});
	const searchInputRef = React.useRef(null);

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
				selected: false,
				id: topic
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

  	const setLogItems = async() => {

  		let amountOfLogs = await accessAPI.userSettings({action: 'getLogAmount'});

  		let array = [];
  		for(let i = 0; i < amountOfLogs; i++) {
  			array.push(i);
  		}

  		setLogs(array);
  	}

  	const updateLogItems = () => {
  		setLogs(logs => [...logs, logs.length + 1]);
  	}

  	const getCustomLog = async(logNumber) => {
  		//selecting a preexisting customLog triggers this

  		//when customLog is selected, compare all values from user's data in their states
  		//to the selections from the customLog, then updated the states to reflect selected
  		//options

 		//also changes sessionStorage.currentLog
 		let logInfo = await accessAPI.userSetting({action: 'getCustomLog', logNumber: logNumber});

 		let updatedConnections = connections.map(user => ({
 			...user,
 			selected: logInfo.connections.includes(user._id)
 		}))

 		let updatedSubscriptions = subscriptions.map(user => ({
 			...user,
 			selected: logInfo.subscriptions.includes(user._id)
 		}))

 		let updatedTopics = topics.map(topic => ({
 			...topic,
 			selected: logInfo.topics.includes(topic.name)
 		}))

 		let updatedTags = connections.map(tag => ({
 			...tag,
 			selected: logInfo.tags.includes(tag._id)
 		}))

 		setConnections(updatedConnections);
 		setSubscriptions(updatedSubscriptions);
 		setTopics(updatedTopics);
 		setTags(updatedTags);
 		setSelectedLocations(logInfo.locations)

 		let updateCurrentLog = await accessAPI.userSetting({
 			action: 'setCurrentLog', 
 			currentLog: logInfo.logNumber
 		})
  	}

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
  				message: `Custom log ${currentLog} updated !`
  			})
  		}
  	}

  	const setCustomLog = async(logNumber) => {

  		getCustomLog(logNumber);
  		setCurrentLog(logNumber);
  		setCurrent({
  			...current,
  			log: logNumber
  		})
  		sessionStorage.setItem('currentLog', logNumber);
  	}



  	const toggleSelection = (id, type) => {
	    const setState = {
	      connections: setConnections,
	      subscriptions: setSubscriptions,
	      topics: setTopics,
	      tags: setTags
	    }[type];

	    setState(prev =>
	      prev.map(item =>
	        item.id === id ? { ...item, selected: !item.selected } : item
	      )
	    );
	};

	const toggleList = (type) => {
	    if (type === "topics") setShowTopics(!showTopics);
	    if (type === "tags") setShowTags(!showTags);
	};

	const toggleDropdown = (type) => {
	    setShowDropdown(prev => ({
	      ...prev,
	      [type]: !prev[type]
	    }));
	};

  	const getLocationSuggestions = async(query) => {
  		try {
  			// if(!query.trim()) {
  			// 	setSearchResults([]);
  			// 	return;
  			// }

  			// setLoadingResults(true)
  			const response = await accessAPI.userSettings({
  				option: 'searchLocation',
  				query: query
  			});

  			if(response.length > 0) {
  				setSearchResults(response);
  			}
  			else {
  				throw new Error('Failed to fetch places');
  			}

  		}
  		catch (err) {
  			console.error('Error fetching suggestions:', err);
      		// setError(err.message);
  		}
  		// finally {
  		// 	setLoadingResults(false);
  		// }
  	}

  	const handleSearch = (e) => {
  		setInputType(e.nativeEvent.inputType);
  		setSearchTerm(e.target.value)
  		// setIsSearchFocused(true);
  	}

  	const selectLocation = (location) => {
	    if (!selectedLocations.includes(location.description)) {
	      setSelectedLocations([...selectedLocations, location]);
	    }
	    setSearchTerm("");
	    setSearchResults([]);
	};

	const removeLocation = (location) => {
		setSelectedLocations(selectedLocations.filter((loc) => loc.description !== location));
	}

  	React.useEffect(()=> {

  		getDataForSelections();
  		setLogItems();

  	}, [])

  	React.useEffect(()=> {
  		if (inputType === "deleteContentBackward") {
	      	return;
	    }

  		if(searchTerm.length < 2) {
  			// console.log('empty')
  			setSearchResults([]);
  			return;
  		}

  		getLocationSuggestions(searchTerm)
  	}, [searchTerm])


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
		
			<div id="logListWrapper">
				
				<ul id="logList">

					<li className={`${currentLog == 0 ? 'selected' : ''}`}onClick={()=> { setCustomLog(0) }}>User Only</li>

					{logs.map(num => (
						<li key={num}
							className={`${currentLog == num ? 'selected' : ''}`} 
							onClick={()=> {setCustomLog(num)}}>{num}</li>
					))}

				</ul>

				<button onClick={updateLogItems}>+</button>
			</div>

			{/*U S E R  O N L Y  N O T I C E*/}
			{currentLog == 0 &&
				<div id="userOnlyNotice">
					This feed is for a user's own posts. Click the + button in the upper right corner of 
					this panel to create a new custom feed
				</div>
			}

			{/*L O G  E D I T O R*/}
			{currentLog > 0 &&
				<div id="fieldsWrapper">
					
					<input
						id="title"
				        type="text"
				        placeholder={`Custom Log #${currentLog}`}
				        value={title}
				        onChange={(e) => setTitle(e.target.value)}
				      />

				    {/*
				    	C o n n e c t i o n s
				    */}
				    <label onClick={() => toggleDropdown("connections")}>
				        Connections: {connections.filter(item => item.selected).length} selected
				        {showDropdown.connections ? <span>▲</span> : <span>▼</span>}
				    </label>
				   	{showDropdown.connections &&
				   		<ul className="dropdown">
				          {connections.map(item => (
				            <li key={item.id} onClick={() => toggleSelection(item.id, "connections")}>
				              <input type="checkbox" checked={item.selected} readOnly />
				              {item.userName}
				            </li>
				          ))}
				        </ul>
				   	}

				   	{/*
				   		S u b s c r i p t i o n s 
				   	*/}
				   	<label onClick={() => toggleDropdown("subscriptions")}>
				        Subscriptions: {subscriptions.filter(item => item.selected).length} selected 
				        {showDropdown.subscriptions ? <span>▲</span> : <span>▼</span>}
				    </label>
				      {showDropdown.subscriptions && (
				        <ul className="dropdown">
				          {subscriptions.map(item => (
				            <li key={item.id} onClick={() => toggleSelection(item.id, "subscriptions")}>
				              <input type="checkbox" checked={item.selected} readOnly />
				              {item.userName}
				            </li>
				          ))}
				        </ul>
				      )}

				    {/* 
				    	Topics Toggle List 
				    */}
				    <button className="listToggle" onClick={() => toggleList("topics")}>
				        Topics: {topics.filter(item => item.selected).length} selected
				    </button>
				    {showTopics && (
				        <ul className="rows">
				          {topics.map(item => (
				            <li key={item.id} onClick={() => toggleSelection(item.id, "topics")}>
				              <input type="checkbox" checked={item.selected} readOnly />
				              {item.name}
				            </li>
				          ))}
				        </ul>
				    )}


				    {/* Tags Toggle List */}
				    <button className="listToggle" onClick={() => toggleList("tags")}>
				        Tags: {tags.filter(item => item.selected).length} selected
				    </button>
				    {showTags && (
				        <ul className="rows">
				          {tags.map(item => (
				            <li key={item.id} onClick={() => toggleSelection(item.id, "tags")}>
				              <input type="checkbox" checked={item.selected} readOnly />
				              {item.name}
				            </li>
				          ))}
				        </ul>
				    )}


				    {/* Location Search */}

				    <div id="searchWrapper">
					    {!isSearchFocused ? (
					    	<label onClick={() => {
					    		setIsSearchFocused(true)
					    		setTimeout(()=> {
					    			searchInputRef.current?.focus()
					    		}, 0)
					    	}}>
						        Locations: {selectedLocations.length} selected
						    </label>

					    ) : (
					    	<input
					    		ref={searchInputRef}
						        type="text"
						        value={searchTerm}
						        onChange={handleSearch}
						        placeholder="Search City or Country"
						        onBlur={()=> {
						        	setTimeout(()=> {
						        		setIsSearchFocused(false)
						        		setSearchResults([]);
						        	}, 500)
						        }}
						    />
					   	)}
				   	</div>
				    {(isSearchFocused && searchResults.length > 0) && 
				        <ul className="dropdown">

				          <li className="header">Selected Locations</li>
				          {selectedLocations.map((loc, index) => (
				            <li key={`saved-${index}`}
				            	onClick={()=> removeLocation(loc.description)}>
				            	<strong>{loc.description}</strong>
				            </li>
				          ))}

				          <hr />

				          <li className="header">Search Results</li>
				          {searchResults.map((result, index) => (
				            <li key={`result-${index}`} onClick={() => selectLocation(result)}>
				              {result.description}
				            </li>
				          ))}
				        </ul>
				    }


				    <div id="buttonWrapper">
				    	<button className={`buttonDefault`}>Delete</button>
				    	<button className={`buttonDefault`}>Save & Exit</button>
				    </div>
				</div>
			}

	</div>
}