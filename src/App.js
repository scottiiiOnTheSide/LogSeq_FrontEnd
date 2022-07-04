
import React, { useState, useReducer, useEffect, useRef } from 'react';
import Calendar from './components/calendar';
import './App.css';

import Header from './components/header/header';
import UserEntry from './components/userEntry/userEntry';

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

  const loggedIn_set = (status) => sessionStorage.setItem('userOnline', JSON.parse(status)); 
  const loggedIn = sessionStorage.getItem('userOnline');


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
            // setLogin={setLogin}
            // loggedIn={loggedIn}
          />
      }
    </div>
  );
}

export default App;
