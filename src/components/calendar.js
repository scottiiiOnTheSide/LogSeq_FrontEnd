
import React, {useRef} from 'react';

export default function Calendar() {

  const d = new Date(); //initial get date
  const date = useRef(d); //set reference for date
  const fullDate = date.current; //set reference for current date
  const month = fullDate.getMonth(); //set var for current month from ref
  const dateNumber = fullDate.getDate(); 
  const dayNumber = fullDate.getDay();

  let start = new Date(d.getFullYear(), 0, 0);
  let diff = (d - start) + ((start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
  let oneDay = 1000 * 60 * 60 * 24
  let dayOfTheYear = Math.floor(diff / oneDay);
  let getAmountOfDays = (year) => {
    return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
  }
  let year = d.getFullYear();
  let amountOfDays = getAmountOfDays();
  let monthInNum = d.getMonth() + 1;

  
  let currentMnth = (month) => {
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
      return months[month];
  };

  let currentDate = (date) => {
      // let date = date.getDate();
      if(date == 1) {
        return `${date}st`;
      }
      else if(date == 2) {
        return `${date}nd`;
      }
      else if(date == 3) {
        return `${date}rd`;
      }
      else if(date == 21) {
        return `${date}st`;
      }
      else if(date == 22) {
        return `${date}nd`;
      }
      else if(date == 23) {
        return `${date}rd`;
      } 
      else if(date == 31) {
        return `${date}st`;
      }
      else {
        return `${date}th`;
      }
  };

  let currentDay = (day) => {
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ]
      return days[day];
  };

  return {
  	currentMonth: currentMnth(month),
  	currentDate: currentDate(dateNumber),
  	currentDay: currentDay(dayNumber),
  	currentYear: fullDate.getFullYear(),
    getCurrentMonth: currentMnth(),
    getCurrentDate: currentDate(),
    dayOfTheYear: dayOfTheYear,
    amountOfDays: amountOfDays,
    monthInNum: monthInNum
    // intention is to export these functions so that they can be used without set values
  }
}