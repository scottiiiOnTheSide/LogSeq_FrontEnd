/* * * B a s e  L a y e r * * */
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Routes,
  Route,
  Outlet,
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation
} from "react-router-dom";
import useWebSocket, {ReadyState} from 'react-use-websocket';
import APIaccess from './apiaccess';
import useAuth from "./useAuth";
import Calendar from './components/calendar'
import {UIContextProvider, UIContext} from './UIcontext';

import './Main.css';
import './components/home/home.css';

/* * * C o m p o n e n t s * * */
import Entry from './components/entry/entry';
import Header from './components/home/header';
import InteractionsList from './components/instants/interactionsList';
import CarouselNav from './components/home/carouselNav';
import ButtonBar from './components/home/buttonBar';
import SectionsWrapper from './components/sections/sectionsWrapper';
import Macros from './components/macros/macros';
import Post from './components/blog/post';
import Instant from './components/instants/instant'

/*** Sub Sections ***/
import { CreatePost } from './components/sections/userLog';
import { ManageConnections } from './components/sections/socialLog';
import { ManageMacros } from './components/macros/macros';
import MonthChart from './components/monthChart/monthChart';
import './components/sections/sections.css';


/* * * I n i t i a l i z e * * */
const accessAPI = APIaccess();




/* * * Supporting Functions * * */
function HomeOrEntry({ children }) {

  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? ( children ) : <Navigate to="/entry" replace state={{ path: location.pathname }} />
}

/* * * H O M E  C o m p o n e n t * * */
function Home({
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
  current,
  setCurrent,
  cal,
  selectedDate,
  set_selectedDate
}) {
  const [notifList, setNotifList] = React.useReducer(state => !state, false);
  const isPost = false;
  const [dateInView, set_dateInView] = React.useState({
    month: null,
    day: null,
    year: null,
  })

  const [enter, setEnter] = React.useReducer(state => !state, true);
  let el = React.useRef();
  let element = el.current

  React.useEffect(()=> {
    if(element) {
      setEnter();
    }
  }, [element])

  return (
    <section id="HOME" ref={el} className={`${enter == true ? '_enter' : ''}`}>  
        <Header cal={cal} isPost={isPost} setNotifList={setNotifList} unreadCount={unreadCount}/>
        <CarouselNav current={current} setCurrent={setCurrent}/>

        {notifList &&
          <InteractionsList 
            setNotifList={setNotifList} 
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
            setSocketMessage={setSocketMessage}
            socketMessage={socketMessage}
            accessID={accessID}
            setAccessID={setAccessID}/>
        }

        <SectionsWrapper current={current} setCurrent={setCurrent} />

        {(current.modal && current.section == 2) &&
          <CreatePost setCurrent={setCurrent}
                      current={current} 
                      socketMessage={socketMessage}
                      setSocketMessage={setSocketMessage} 
                      selectedDate={selectedDate}/>
        }
        {(current.modal && current.section == 1) &&
          <ManageConnections current={current} 
                             setCurrent={setCurrent} 
                             setSocketMessage={setSocketMessage}/>
        }

        {(current.modal && current.section == 3) &&
          <ManageMacros current={current} 
                        setCurrent={setCurrent} 
                        setSocketMessage={setSocketMessage}/>
        }

        <ButtonBar cal={cal} 
                   current={current} 
                   setCurrent={setCurrent}
                   dateInView={dateInView}
                   set_dateInView={set_dateInView}
                   current={current}
                   setCurrent={setCurrent}
                   selectedDate={selectedDate}
                   set_selectedDate={set_selectedDate}/>

        {current.monthChart &&
          <MonthChart 
            setCurrent={setCurrent} 
            current={current}
            cal={cal} 
            set_dateInView={set_dateInView}
            selectedDate={selectedDate}
            set_selectedDate={set_selectedDate}/>
        }

          <Instant 
            socketMessage={socketMessage} 
            setSocketMessage={setSocketMessage}
            sendMessage={sendMessage}
            isActive={isActive}
            setActive={setActive}
            accessID={accessID}
            setAccessID={setAccessID}
            getUnreadCount={getUnreadCount}
          />
        
    </section>
  )
}









export default function Main() {

  /**
   * W e b  S o c k e t
   * A n d
   * N o t i f i c a t i o n s
   */
  const { authed } = useAuth();
  let userID = sessionStorage.getItem('userID');
  const [socketURL, setSocketURL] = React.useState(``);
  const {sendMessage, lastMessage, readyState} = useWebSocket(socketURL);
  const [socketMessage, setSocketMessage] = React.useState({
    type: null,
    message: null
  });
  const [accessID, setAccessID] = React.useState({})
  const [isActive, setActive] = React.useState({
    type: null,   //type of popUp notif to appear
    state: null,  //set class for it to popUp 
  })
  const [unreadCount, setUnreadCount] = React.useState('');  

  /**
   * Fetches unread count of interactions on initial load
   * and when new interactions occur
   */
  let getUnreadCount = async() => {
    let count = await accessAPI.getInteractions('count');
    if(count < 10) {
      count = '0' + count;
    } else if (count > 99) {
      count = '99';
    }
    setUnreadCount(count);
  }
  /**
   * Connects to webSocket server upon verifying user log in
   * & gets unreadNotif count
   */
  React.useEffect(()=> {
    if(authed == true) {
      setSocketURL(`ws://172.19.185.143:3333/?${userID}`);
      getUnreadCount();
    }
  }, [authed])
  React.useEffect(()=> {
    getUnreadCount();
  }, [socketMessage])


  
  

  // could possibly implement reconnect redundancy here
  React.useEffect(() => { 
    if(readyState === ReadyState.OPEN) {
      console.log('Websocket connection established')
    } else if (readyState === ReadyState.CLOSED) {
      console.log('socket connection has closed')
    }
  }, [readyState])

  /**
   * when socket connection R E C I E V E S messages
   */
  useWebSocket(socketURL, {
    onMessage: (e)=> {
      let data = JSON.parse(e.data);
      let details;
      if(data.details) {
        details = JSON.parse(data.details)
      }
      console.log(data);

      // if(data.recipients.includes(userID) {
        //need to implement
      // })

      if(data.type == 'request' && data.message == 'initial') {
        setSocketMessage(data);
        setAccessID({
          ...accessID,
          accept: data.senderID,
          ignore: data.originalID,
        });
        setActive({
          type: 3,
          state: true
        })
        console.log(data);
        console.log(accessID);
      }
      else if (data.type == 'request' && data.message == 'accept') {
        setSocketMessage({
          senderUsername: data.senderUsername,
          type: 'request',
          message: 'accepted'
        });
        setActive({
          type: 1,
          state: true
        })
      }
      else if(data.type == 'comment' && data.message == 'initial-recieved') {
        setSocketMessage({
          senderUsername: data.senderUsername,
          type: 'comment',
          message: 'initial-recieved',
          postTitle: data.postTitle,
        });
        setActive({
          type: 2,
          state: true
        })
        // setAccessID({ postURL: data.postURL, notifID: data._id, commentID: details.commentID });
        setAccessID({ postURL: data.postURL, notifID: data._id });
        console.log(data);
      }
      else if(data.type == 'comment' && data.message == 'response-recieved') {
        setSocketMessage({
          senderUsername: data.senderUsername,
          type: 'comment',
          message: 'response-recieved',
          postTitle: data.postTitle,
        });
        setActive({
          type: 2,
          state: true
        })
        // setAccessID({ postURL: data.postURL, notifID: data._id, commentID: details.commentID });
        setAccessID({ postURL: data.postURL, notifID: data._id });
        console.log(data);
      }
      else if(data.type == 'tagging' && data.message == 'recieved') {
        setSocketMessage(data)
        setActive({
          type: 2,
          state: true
        })
        setAccessID({ postURL: data.url, notifID: data._id });
      }
    }
  })


  
  const cal = Calendar();
  const [current, setCurrent] = React.useState({
    section: 2, //0, 1, 2, 3, 4
    social: false, //true, false or social
    monthChart: false, //true or false
    scrollTo: null,
    transition: false //for components mounted dependant on this stateVar, indicates before unmount
  });
  const hajime = new Date(),
      kyou = hajime.getDate(),
      kongetsu = hajime.getMonth(),
      kotoshi = hajime.getFullYear();
  const [selectedDate, set_selectedDate] = React.useState({
    day: kyou,
    month: kongetsu,
    year: kotoshi
  })

  
  return(
      <UIContextProvider>
        <Routes>

          <Route path="/" element={
              <HomeOrEntry>
                <Home 
                  // socket & notif stuff 
                  socketURL={socketURL}
                  socketMessage={socketMessage}
                  setSocketMessage={setSocketMessage}
                  sendMessage={sendMessage}
                  isActive={isActive}
                  setActive={setActive}
                  accessID={accessID}
                  setAccessID={setAccessID}
                  unreadCount={unreadCount}
                  setUnreadCount={setUnreadCount}
                  getUnreadCount={getUnreadCount}
                  lastMessage={lastMessage}
                  // socket & notif stuff
                  cal={cal}
                  current={current}
                  setCurrent={setCurrent}
                  selectedDate={selectedDate}
                  set_selectedDate={set_selectedDate}
                />
              </HomeOrEntry>
            }>
            {/*<Route path=":macros" element={}/>*/}
          </Route>

          <Route path="/entry" element={<Entry />} 
          />

          <Route path="/home" element={
              <HomeOrEntry>
                <Home 
                  // socket & notif stuff
                  socketURL={socketURL}
                  socketMessage={socketMessage}
                  setSocketMessage={setSocketMessage}
                  sendMessage={sendMessage}
                  isActive={isActive}
                  setActive={setActive}
                  accessID={accessID}
                  setAccessID={setAccessID}
                  unreadCount={unreadCount}
                  setUnreadCount={setUnreadCount}
                  getUnreadCount={getUnreadCount}
                  lastMessage={lastMessage}
                  // socket & notif stuff
                  cal={cal}
                  current={current}
                  setCurrent={setCurrent}
                  selectedDate={selectedDate}
                  set_selectedDate={set_selectedDate}
                />
              </HomeOrEntry>
            }>
            {/*<Route path=":macros" element={}/>*/}
          </Route>

          <Route path="/post/:postID" element={
              <HomeOrEntry>
                <Post 
                  // socket stuff
                  socketURL={socketURL}
                  socketMessage={socketMessage}
                  setSocketMessage={setSocketMessage}
                  sendMessage={sendMessage}
                  isActive={isActive}
                  setActive={setActive}
                  accessID={accessID}
                  setAccessID={setAccessID}
                  unreadCount={unreadCount}
                  setUnreadCount={setUnreadCount}
                  getUnreadCount={getUnreadCount}
                  lastMessage={lastMessage}
                  // socket stuff
                  selectedDate={selectedDate}
                  set_selectedDate={set_selectedDate}
                />
              </HomeOrEntry>
            } 
          />

          <Route path="/macros/:name" element={
              <HomeOrEntry>
                <Macros 
                  // socket stuff
                  socketURL={socketURL}
                  socketMessage={socketMessage}
                  setSocketMessage={setSocketMessage}
                  sendMessage={sendMessage}
                  isActive={isActive}
                  setActive={setActive}
                  accessID={accessID}
                  setAccessID={setAccessID}
                  unreadCount={unreadCount}
                  setUnreadCount={setUnreadCount}
                  getUnreadCount={getUnreadCount}
                  lastMessage={lastMessage}
                  // socket stuff
                  selectedDate={selectedDate}
                  set_selectedDate={set_selectedDate}
                />
              </HomeOrEntry>
            } 
          />

        </Routes>
      </UIContextProvider>
  )
}

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element:  <HomeOrEntry> 
//                   <Entry 
//                     accessAPI={accessAPI}
//                     useAuth={useAuth}
//                   /> 
//               </HomeOrEntry>
//   },
//   {
//     path: "/entry",
//     element: <Entry />
//   },
//   {
//     path: "/home",
//     element: <HomeOrEntry> <Home /> </HomeOrEntry>
//   },
//   {
//     path: "/:user",
//     element: <HomeOrEntry> <Userpage /> </HomeOrEntry>
//   },
//   {
//     path: "/:blogpost",
//     element: <HomeOrEntry> <Blogpost /> </HomeOrEntry>
//   },
//   {
//     path: "/:username/:collectionName",
//     element: <HomeOrEntry> <Collection /> </HomeOrEntry>
//   },
//   {
//     path: "/group/:groupname",
//     element: <HomeOrEntry> <GroupPage /> </HomeOrEntry>
//   },
//   {
//     path: "/tag/:tagname",
//     element: <HomeOrEntry> <TagPage /> </HomeOrEntry>
//   },
//   {
//     path: "/global",
//     element: <HomeOrEntry> <Global /> </HomeOrEntry>
//   },
//   {
//     path: "/about",
//     element: <About />
//   },
//   {
//     path: "/error",
//     element: <ErrorPage />
//   }
// ])
