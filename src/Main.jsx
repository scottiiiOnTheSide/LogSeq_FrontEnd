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
import APIaccess from './apiaccess';
import useAuth from "./useAuth";
import Calendar from './components/calendar'

import './Main.css';
import './components/home/home.css';

/* * * C o m p o n e n t s * * */
import Entry from './components/entry/entry';
import Header from './components/home/header';
import CarouselNav from './components/home/carouselNav';
import SectionsWrapper from './components/sections/sectionsWrapper';

import Post, {loader as postLoader} from './components/blog/post';



/* * * I n i t i a l i z e * * */
const accessAPI = APIaccess();




/* * * Supporting Functions * * */
function HomeOrEntry({ children }) {

  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? ( children ) : <Navigate to="/entry" replace state={{ path: location.pathname }} />
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
//   // {
//   //   path: "/home",
//   //   element: <HomeOrEntry> <Home /> </HomeOrEntry>
//   // },
//   // {
//   //   path: "/:user",
//   //   element: <HomeOrEntry> <Userpage /> </HomeOrEntry>
//   // },
//   // {
//   //   path: "/:blogpost",
//   //   element: <HomeOrEntry> <Blogpost /> </HomeOrEntry>
//   // },
//   // {
//   //   path: "/user/:username/settings",
//   //   element: <HomeOrEntry> <UserSetting /> </HomeOrEntry>
//   // },
//   // {
//   //   path: "/:username/:collectionName",
//   //   element: <HomeOrEntry> <Collection /> </HomeOrEntry>
//   // },
//   // {
//   //   path: "/group/:groupname",
//   //   element: <HomeOrEntry> <GroupPage /> </HomeOrEntry>
//   // },
//   // {
//   //   path: "/tag/:tagname",
//   //   element: <HomeOrEntry> <TagPage /> </HomeOrEntry>
//   // },
//   // {
//   //   path: "/global",
//   //   element: <HomeOrEntry> <Global /> </HomeOrEntry>
//   // },
//   // {
//   //   path: "/about",
//   //   element: <About />
//   // },
//   // {
//   //   path: "/error",
//   //   element: <ErrorPage />
//   // }
// ])


function Home() {

  let cal = Calendar();

  const [currentSection, setSection] = React.useState(2);
  const [isModal, setModal] = React.useReducer(state => !state, false)

  return (
    <section id="HOME">  
        <Header cal={cal} />
        <CarouselNav currentSection={currentSection} setSection={setSection}/>

        <Outlet />

        <SectionsWrapper currentSection={currentSection} />

    </section>
  )
}

export default function Main() {
  return(
      <Routes>

        <Route path="/" element={
            <HomeOrEntry> 
              <Home />
            </HomeOrEntry>
          } 
        />

        <Route path="/entry" element={<Entry/>} 
        />

        <Route path="/home" element={
            <HomeOrEntry>
              <Home />
            </HomeOrEntry>
          }
        />

        <Route path="/post/:id" loader={postLoader} element={
            <HomeOrEntry>
              <Post />
            </HomeOrEntry>
          } 
        />

      </Routes>
  )
}