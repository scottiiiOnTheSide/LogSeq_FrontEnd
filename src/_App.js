
import React, { useState, useReducer } from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import Calendar from './components/calendar';
import Instant from './components/instant';
import './App.css';

import Header from './components/header/header';
import UserEntry from './components/userEntry/userEntry';
import BlogLog from './components/blogLog/blogLog';
import Blogpost from './components/blogpost/blogpost';
import ConnectList from './components/connections/connectList';
import InteractionList from './components/interactions/interactions';
import UserMenu from './components/userMenu/userMenu';
import MenuButton from './components/menuButton/menuButton';

function App() {

  /*Self explanatory*/
  const apiAddr = 'http://172.19.185.143:3333';

  /*User Log In*/
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
  const userOnline = sessionStorage.getItem('userOnline');

  /*
    section state variables - 
    read if component mounted or mounts it
  */
  const [login, setLogin] = useReducer(state => !state, true);
  const [userSide, set_userSide] = useReducer(state => !state, true);
  const [socialSide, set_socialSide] = useReducer(state => !state, false);
  const [monthChart, set_monthChart] = useReducer(state => !state, false);
  const [menu, set_menu] = useReducer(state => !state, false);
    /* this menu houses inner menus */
  const [menuSide, set_menuSide] = useReducer(state => !state, true);
    /* true is 'default', false is flipside: (settings, notifs, logout) */
  const [notif, set_notif] = useReducer(state => !state, false);
  const [connections, set_connections] = useReducer(state => !state, false);  

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
  const [newNotif, updateNotifs] = useReducer(state => !state, false);
  /*
      10. 16. 2022
      with 'newNotif', once a request is made to backend which prompts a
      new notification being added to the user's list, newNotif gets updated.
      when newNotif changes, the interactionList component also updates

      01. 18. 2023
      This implemetation will be removed once webSockets are implemented...
  */   

  /* 
      U S E R  &  S O C I A L  L o G s 
  */
  const [log, setLog] = useState([]);
  const updateLog = async () => {\

    let month = new Date().getMonth(),
      year = new Date().getFullYear(),
      user = userOnline,
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
    // console.log(data);
  }
  const userBlog = {
    log: log,
    setLog: setLog,
    updateLog: updateLog
  }
  /*
    09. 14. 2023
    For future update:

    let userLog = {
      log: 
      setLog:
      updateLog: get most recent posts
      appendLog: gets more past posts
    } */

  const [socialLog, set_socialLog] = useState([]);
  const updateSocialLog = async () => {
    let month = new Date().getMonth(),
        year = new Date().getFullYear(),
        user = userOnline,
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
    // console.log(data)
  }
  const socialBlog = {
    log: socialLog,
    setLog: set_socialLog,
    updateLog: updateSocialLog
  }

  let [monthLog, set_monthLog] = useState([]);

  /* Check and Set whether a Blogpost active*/
  //01.19.2023 make this into one object, eventually...
  const [isReading, set_isReading] = useState({
    blogpostID: '',
    isOwner: null,
    postOpen: null,
    monthLog: null
  });
  let closePost = () => {
    set_isReading({
      ...isReading,
      isOwner: null,
      blogpostID: null,
      postOpen: null,
    })
    userBlog.updateLog();
  }

  /* Reducer for managing state info regarding 
      User and Social Sides
  */
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

  /* M A I N  A P P */
  return (
   <div id="MAIN">

      <Instant
        userID={userID}
      />

      <Header 
        loggedIn={loggedIn} 
        calendar={calendar} 
        setCalendar={setCalendar}
        set_menuSide={set_menuSide}/>

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
          userOnline={userOnline}
          monthChart={monthChart}
          set_socialSide={set_socialSide}
          socialSide={socialSide}
          calendar={calendar}
          setCalendar={setCalendar}
          monthLog={monthLog}
          set_monthLog={set_monthLog}/>
      }
      {(loggedIn && isReading.postOpen) &&
        <Blogpost
          apiAddr={apiAddr}
          userOnline={userOnline}
          userID={userID}
          isReading={isReading}
          set_isReading={set_isReading}
          userBlog={userBlog}
          socialBlog={socialBlog}
          monthLog={monthLog}
        />
      }
      {(loggedIn && notif) &&
        <InteractionList
          newNotif={newNotif}
          apiAddr={apiAddr}
          userOnline={userOnline}
          userID={userID}
          notif={notif}
          set_notif={set_notif}
          updateSocialBLog={updateSocialLog}
          set_menuSide={set_menuSide}
        />
      }
      {(loggedIn && menu) && 
        <UserMenu 
          apiAddr={apiAddr}
          userID={userID}
          userOnline={userOnline}
          userBlog={userBlog}
          socialBlog={socialBlog}
          Connections={ConnectList}
          logClasses={logClasses}
          calendar={calendar}
          updateNotifs={updateNotifs}
        />
      }
      {(loggedIn) &&
        <MenuButton 
          menu={menu}
          set_menu={set_menu}
          set_notif={set_notif}

          userSide={userSide}
          socialSide={socialSide}
          menuSide={menuSide}
          set_menuSide={set_menuSide}

          isReading={isReading}
          set_isReading={set_isReading}
          closePost={closePost}

          monthChart={monthChart}
          set_monthChart={set_monthChart}

          calendar={calendar}
          setCalendar={setCalendar}

          logStates={logStates}/>
      }
    </div> 
  )
}

export default App;
