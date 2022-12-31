
import React, { useState, useReducer } from 'react';
import Calendar from './components/calendar';
import './App.css';

import Header from './components/header/header';
import UserEntry from './components/userEntry/userEntry';
import BlogLog from './components/blogLog/blogLog';
import Blogpost from './components/blogpost/blogpost';
import ConnectList from './components/connections/connectList';
import InteractionList from './components/notifList/interactions';
import UserMenu from './components/userMenu/userMenu';
import MenuButton from './components/menuButton/menuButton';

function App() {

  //section state variables
  const apiAddr = 'http://172.30.217.87:3333';
  const cal = Calendar();
  const [calendar, setCalendar] = useState({
    currentMonth: cal.currentMonth,
    currentDate: cal.currentDate,
    currentDay: cal.currentDay,
    currentYear: cal.currentYear,
    dayOfTheYear: cal.dayOfTheYear,
    amountOfDays: cal.amountOfDays,
    monthInNum: cal.monthInNum,
    year_inView: null,
    month_inView: null,
    date_inView: null,
    viewDateInView: ()=> {
      console.log(calendar.month_inView +" "+ calendar.date_inView +" "+ calendar.year_inView, )
    }
  });
  const [login, setLogin] = useReducer(state => !state, true);
  const [home, setHome] = useReducer(state => !state, false);
  const [mainMenu, toggleMainMenu] = useReducer(state => !state, false);
  const [menuHeadsOrTails, toggleMenuFlip] = useReducer(state => !state, true);
  const [connections, toggleConnections] = useReducer(state => !state, false);
  const [notifList, toggleNotifList] = useReducer(state => !state, false);
  const [newNotif, updateNotifs] = useReducer(state => !state, false);
  const [monthChart, toggleMonthChart] = useReducer(state => !state, false);
  /*
      10. 16. 2022
      with 'newNotif', once a request is made to backend which prompts a
      new notification being added to the user's list, newNotif gets updated.
      when newNotif changes, the interactionList component also updates
  */ 
  
  //07. 07. 2022 These two should honestly be one in the same. Will couple them later
  const [isLoggedIn, set_isLoggedIn] = useState({});
  const [loggedIn, loggedIn_set] = useState(() => {
    if(sessionStorage.getItem('userOnline')) {
      return true;
    } else {
      return false;
    }
  })

  const userID = sessionStorage.getItem('userKey');
  const userKey = sessionStorage.getItem('userOnline');



  /* 
      U S E R  &  S O C I A L  L o G s 
  */
  let [log, setLog] = useState([]);
  let [socialLog, set_socialLog] = useState([]);

  const updateLog = async () => {
    let month = new Date().getMonth(),
      year = new Date().getFullYear(),
      user = userKey,
      api = apiAddr;

    const response = await fetch(`${apiAddr}/posts/log?social=false`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Content-length': 0,
        'Accept': 'application/json',
        'Host': apiAddr,
        'auth-token': user
      }
    })

    const data = await response.json();
    setLog(data);
    console.log(data);
  }
  const updateSocialLog = async () => {
    let month = new Date().getMonth(),
        year = new Date().getFullYear(),
        user = userKey,
        api = apiAddr;

    const response = await fetch(`${apiAddr}/posts/log?social=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Content-length': 0,
        'Accept': 'application/json',
        'Host': apiAddr,
        'auth-token': user
      }
    });
    const data = await response.json();
    set_socialLog(data);
    console.log(data)
  }
  const userBlog = {
    log: log,
    setLog: setLog,
    updateLog: updateLog
  }
  const socialBlog = {
    log: socialLog,
    setLog: set_socialLog,
    updateLog: updateSocialLog
  }

  const [isReading, set_isReading] = useState({
    blogpostID: '',
    isOwner: null,
    postOpen: null,
  });

    let logStateReducer = (state, action) => {
      let newState;
      switch(action.type) {
        case 'userOut_socialIn':
          newState = {
            userEntry: false,
            userLeave: true,
            socialEntry: true,
            socialLeave: false
          }
          break;
        case 'socialOut_userIn':
          newState = {
            userEntry: true,
            userLeave: false,
            socialEntry: false,
            socialLeave: true
          }
        break;
      }
      return newState;
    }
    const logStates = {
      userEntry: true,
      userLeave: false,
      socialEntry: false,
      socialLeave: false, 
    }

  const [logClasses, setLogClasses] = useReducer(logStateReducer, logStates);
  const [socialSide, setSocialSide] = useReducer(state => !state, false);

  return (
    <div id="MAIN">
      <Header 
        loggedIn={loggedIn} 
        home={home} 
        calendar={calendar} 
        setCalendar={setCalendar}
        toggleMenuFlip={toggleMenuFlip}/>

      {!loggedIn && 
          <UserEntry 
            login={login} 
            loggedIn_set={loggedIn_set}
            set_isLoggedIn={set_isLoggedIn}
            apiAddr={apiAddr}
          />
      }
      {loggedIn  &&
        <BlogLog
          loggedIn={loggedIn}
          userBlog={userBlog}
          socialBlog={socialBlog}
          isReading={isReading}
          set_isReading={set_isReading}
          userID={userID}
          setLogClasses={setLogClasses}
          logClasses={logClasses}
          apiAddr={apiAddr}
          userKey={userKey}
          monthChart={monthChart}
          setSocialSide={setSocialSide}
          socialSide={socialSide}
          calendar={calendar}
          setCalendar={setCalendar}/>
      }
      {(loggedIn && isReading.postOpen) &&
        <Blogpost
          apiAddr={apiAddr}
          userKey={userKey}
          userID={userID}
          isReading={isReading}
          set_isReading={set_isReading}
          isReading={isReading}
          toggleMainMenu={toggleMainMenu}
          userBlog={userBlog}
          socialBlog={socialBlog}
        />
      }
      {loggedIn &&
        <InteractionList
          newNotif={newNotif}
          apiAddr={apiAddr}
          userKey={userKey}
          userID={userID}
          notifList={notifList}
          toggleNotifList={toggleNotifList}
          updateSocialBLog={updateSocialLog}
        />
      }
      {(loggedIn && mainMenu) && 
        <UserMenu 
          apiAddr={apiAddr}
          userID={userID}
          userKey={userKey}
          userBlog={userBlog}
          socialBlog={socialBlog}
          Connections={ConnectList}
          logClasses={logClasses}
          calendar={calendar}
          updateNotifs={updateNotifs}
          toggleMainMenu={toggleMainMenu}
        />
      }
      {(loggedIn && !isReading.postOpen) &&
        <MenuButton 
          mainMenu={mainMenu}
          toggleMainMenu={toggleMainMenu}
          headsOrTails={menuHeadsOrTails}
          toggleNotifList={toggleNotifList}
          logClasses={logClasses}
          monthChart={monthChart}
          toggleMonthChart={toggleMonthChart}
          calendar={calendar}
          setCalendar={setCalendar}
          logStates={logStates}
          socialSide={socialSide}/>
      }
      
    </div>
  );
}

export default App;
