
import React, { useState, useReducer, useEffect, useRef } from 'react';
import Calendar from './components/calendar';
import './App.css';

import Header from './components/header/header';
import UserEntry from './components/userEntry/userEntry';
import BlogLog from './components/blogLog/blogLog';

function App() {
  //section state variables
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
  const [isLoggedIn, set_isLoggedIn] = useState({});

  //07. 07. 2022 These two should honestly be one in the same. Will couple them later
  const loggedIn = sessionStorage.getItem('userOnline');
  // const user = sessionStorage.getItem('user');
  const loggedIn_set = (status) => sessionStorage.setItem('userOnline', JSON.parse(status)); 
  // const user_set = (token) => sessionStorage.setItem('user', JSON.parse(token));


  return (
    <div className="">
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
          />
      }
      {loggedIn &&
        <BlogLog
          loggedIn={loggedIn}
          calendar={calendar}/>
      }
    </div>
  );
}

export default App;
