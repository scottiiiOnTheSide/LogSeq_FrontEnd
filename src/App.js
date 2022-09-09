
import React, { useState, useReducer } from 'react';
import Calendar from './components/calendar';
import './App.css';

import Header from './components/header/header';
import UserEntry from './components/userEntry/userEntry';
import BlogLog from './components/blogLog/blogLog';
import Blogpost from './components/blogpost/blogpost';
import UserMenu from './components/userMenu/userMenu';
import MenuButton from './components/menuButton/menuButton';

function App() {
  //section state variables
  const apiAddr = 'http://192.168.1.142:3333';
  const cal = Calendar();
  const [calendar, setCalendar] = useState({
    currentMonth: cal.currentMonth,
    currentDate: cal.currentDate,
    currentDay: cal.currentDay,
    currentYear: cal.currentYear,
    year_inView: null,
    month_inView: null,
    date_inView: null
  });
  const [login, setLogin] = useReducer(state => !state, true);
  const [home, setHome] = useReducer(state => !state, false);
  const [mainMenu, toggleMainMenu] = useReducer(state => !state, false);
  
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

    const response = await fetch(`${apiAddr}/posts/log?month=${month}&year=${year}`, {
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

    let reorder = [];
    for(let i = data.length; i >= 0; i--) {
      reorder.push(data[i]);
    }
    reorder.splice(0, 1);
    setLog(reorder);
  }

  const updateSocialLog = async () => {
    let month = new Date().getMonth(),
        year = new Date().getFullYear(),
        user = userKey,
        api = apiAddr;

    const response = await fetch(`${apiAddr}/posts/socialLog?month=${month}&year=${year}`, {
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

    let reorder = [];
    for(let i = data.length; i >= 0; i--) {
      reorder.push(data[i]);
    }
    reorder.splice(0, 1);
    set_socialLog(reorder);
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



  return (
    <div id="MAIN">
      <Header 
        loggedIn={loggedIn} 
        home={home} 
        calendar={calendar} 
        setCalendar={setCalendar}/>

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
          userBlog={userBlog}/>
      }
      {(loggedIn && mainMenu) && 
        <UserMenu 
          apiAddr={apiAddr}
          user={userKey}
          userBlog={userBlog}/>
      }
      {(loggedIn && !isReading.postOpen) &&
        <MenuButton 
          toggleMainMenu={toggleMainMenu}/>
      }
      {(loggedIn && isReading.postOpen) &&
        <Blogpost
          apiAddr={apiAddr}
          userKey={userKey}
          userID={userID}
          isReading={isReading}
          set_isReading={set_isReading}
          isReading={isReading}
          userBlog={userBlog}
          toggleMainMenu={toggleMainMenu}
          userBlog={userBlog}
          socialBlog={socialBlog}
        />
      }
    </div>
  );
}

export default App;
