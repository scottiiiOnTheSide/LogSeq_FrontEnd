
## S y n c S e q . x y z
#### Project Notes & Planning
-----------------------------------------------------------------------------------------


### 05. 13. 2024
@1625 I made a mistake saving this Notes file, as a few days worth of notes was missing 
			after a push. Fortunately, I was able to view an older version of it on the github
			website and restore some....


****To Do Next:
		- change option opening method so only one is open at a time ✅
		- subroute for getting userSetting details
		- have Social option for Log route filter out isPrivate:true posts
		- for now, have subroute option for tags filter out posts with privacyToggleable: On

****Side Quests:
		- for topics, need to address issue preventing page from opening...
			- issue with length variable
		- Upon deleting a post, clear 'scrollToView' from access global state var
		- replace full page components opening and closing animations
				1.) full page components have 'enter' animation by default
				2.) use useReducer toggle to add 'exit' class, adding 'leave' animation
				3.) animation speed of 0.2s - close component with setTimeout after 300ms
		- in <CreatePost> make sure info for current date is taken AT THE TIME the post is made - not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays

Will need memoization for homepage...at some point

****Additions until 1.0A...
		- ManageConnections CSS 
		- User Profile
			- fullList
			- pinning posts and media
		- Editting posts
			- pinning media


### 05. 09. 2024
@1510 There was some issue with changing the username back to 'admin' again, but it seemed
			to have worked regardless

@1235 
****To Do Next:
		- finish all backend subroutes for userSettings
				- profilePhoto ✅
				- username ✅
				- biography ✅
				- changePassword ✅
				- privacySetting ✅
		- change option opening method so only one is open at a time
		- subroute for getting userSetting details
		- add privacyToggleable to <Posts> model in backEnd ✅
		- have Social option for Log route filter out isPrivate:true posts
		- for now, have subroute option for tags filter out posts with privacyToggleable: On

@1055 profilePhoto upload works ( T-T)b 

!!! Make settings option for sending user details,
		profile photo,
		bio,
		privacy,
		invitation count
		get info and fill data upon opening user settings 

### 05. 08. 2024
@1155
!!! Unable to access images from GCS
		(05. 09. 2024) For some reason, the old images aren't accessible, yet new uploads are
		will have to monitor the situation to see when, if, it reoccurs.

!!! Upon deleting a post, clear 'scrollToView' from access global state var


### 05. 07. 2024
@1920 added all necessary parts for 'profilePhoto' option within <UserSettings>
			however nothing is included in the formData and the backend recieves nothing...

### 04. 24. 2024
@1310 Working on submit function for profilePhoto. Copy functionality from <CreatePostt> 


### 04. 18. 2024
@0150 Done with logout modal - however, entirity of it is blurry... pls find fix ✅

****To Do Next:
		- add logout functionality ✅
		- add svg arrow to 'About Project' ✅
		- plan and add subroute options for userSettings on backEnd
		- change option opening method so only one is open at a time
		- move logoutModal to Main.jsx instead, fixes blurry issue ✅

****Side Mission:
		- replace full page components opening and closing animations


****Additions until 1.0A...
- ManageConnections CSS 
- User Profile
	- fullList
	- pinning posts and media
- Editting posts
	- pinning media


!!! for topics, need to address issue preventing page from opening...
Will need memoization for homepage...
All data reloads upon revisiting page


### 04. 16. 2024
@0940 HTML & CSS done for invitation section


### 04. 14. 2024
@1440 
****To Do Next:
		- active / inactive states for privacy options ✅
		- Invitation option html/css ✅
		- Log Out Confimation modal ✅

@1350 
!!! all forms, when in focus within profile subOption causes blurriness of elements.... 
		unsure how to fix currently...


### 04. 12. 2024
@1220 
!!! image upload for profile photo glitches and needs to be selected twice? see if we can fix

!!! Everything in <Macros> section IS in fact blurry. Due to some fixed height somewhere or 
		something else. find and fix ✅


### 04. 11. 2024
@1640 added submenu options and functionality for Profile option

****To Do Next:
		- Create html elements for
			- Profile sub options ✅
			- Privacy: 3 buttons and underlying text which changes based on option active ✅
			- Invitation: number count behind text, referral link with user's referral code (click to copy) ✅
			- Add arrow svg to 'About Project'
			- Log Out: full page element confirming log out (exclaimation mark within cirle) ✅

****Side Mission:
		- replace full page components opening and closing animations

@1425 CSS done for layout in <UserSettings>

!!! new format for opening / closing animations.
		1.) full page components have 'enter' animation by default
		2.) use useReducer toggle to add 'exit' class, adding 'leave' animation
		3.) animation speed of 0.2s - close component with setTimeout after 300ms


### 04. 09. 2024
@1700 made skeleton for <UserSettings>. Can open via button in <InteractionsList> and close from
			within itself

****To Do Next
		- CSS for elementss

!!! Will need to plan changes to backEnd, including user model and adding routes forr settings

### 03. 27. 2024
@2115 Last thing necessary for Collections are the page options (delete & share) and the <FullList> component
			for deleting posts from one

Leaving aside for now . . .
Now commencing <UserSettings>

Options to be added:
- profile
  - userName
  - profilePicture
  - bio
- privacy
	On:
		- Only Connections see *fullName*
		- only connections see *profileDetails*
		- No subscribers (can be added)
		- All Posts only visible to connections
		- Pinned Stuff only visible to connections

	1/2
		- Only Connections see *fullName*
		- only connections see *profileDetails*
		- Subscribers can request
		- All Posts visible to Subscribers, Connections
		- Pinnned Stuff visible to anyone

	Off
		- anyone can see *fullName*
		- anyone can view *profileDetails*
		- anyone can subscribe
		- posts visible to anyone

		*profileDetails* includes Posts, Connections and Subscription Count and Lists

- logout
( About Project & Invitation can be added much later . . .)



### 03. 24. 2024
@1000 menuBar to say 'Manage' within collections, 'Delete', 'Delete All', 'Share' to be 
			options...
			URL may need have more details in order for it to be shareable...


### 03. 23. 2024
@1240
Roadmap to 1.0A...
- Collections 3/4
- Styling <ManageConnections>
- User Profile & Settings

@1230 moved collectionsCheck to frontEnd. Functionality added for BOOKMARKS, need to add
			for rest of collection options

*** To Do Next:
		- functionality to collections options: add, remove, is inactive based on whether collection
			already has current post ✅
		- in <Macros > page for collections, menuButton toggles 'delete' option to appear over
			posts within list...
				- will have to create div within those li's that only appear upon menuButton being toggled

@0420 in posts/collectionsCheck subroute, filter user's collections by whether current post
is already within any of them. if so, add 'hasCurrentPost', field to them. can possibly use
filter then .includes on arrays within each collection

remove bookmarks from collections.map (filter then map)
use hasCurrentPost field to discern whether bookmark option should appear faded or not,
ternary in className


### 03. 20. 2024
@0100 Fixed issue with scrolling back to original post in <Log> after returning from <Post>


### 03. 18. 2024
@1655 
****To Do Next:
		- create route option on backEnd posts/checkPost that discerns whether viewed post
			is already in any of a user's collections ✅
		- change 'groupPosts' apiaccess func to 'POST' instead of 'GET'
			(when necessary to delete multiple posts at once, this will be necessary)
		- have subMenu in <Posts> for other collections ✅
			- both BOOKMARKS option and any collection should be faded if post is already within it

!!! Will need to add 'remove' option for posts within <Log>
		selecting a post will add it t the [access] stateVar, which can be seen in <Macros > (will nest
			down from <Home>)
??? other options with <Macros> page???
		- share & delete for collections

@1610 !!! going back to post in log (scroll to post) after returning from a <Post> is off

### 03. 17. 2024
@1455 working on emptying bookmarks when deleting them...

@0105 
To Do Next:
- clicking on collection titles goes to <Macros > page. make sure necessary changes to
	page layout ✅
- make BOOKMARKS first in macros section and manageMacros ✅
	- add unique option in backEnd where deleting BOOKMARKS simply empties it ✅
- add options for BOOKMARK and collections in <Post> ✅
	- use api function to get collections ✅


### 03. 15. 2024
@0945 !!! in <CreatePost> make sure info for current date is taken AT THE TIME the post is made - not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays


### 03. 08. 2024
@1025 
Roadmap to 1.0A...
- Collections
- Styling <ManageConnections>
- User Profile

****To Do Next
		- make several private posts so that we can create the expand function for
			the sections... ✅
		- make seperate note of all the small fixes and changes I've made recently...
		- create BOOKMARKS collection for user ✅
			- should have a special case on backEnd where deleting BOOKMARKS simply empties it
			- all users should have BOOKMARKS collection upon signup
		- adjust details for collections on <Macros >page ✅
		- add functions for adding to collections on <Post> page ✅

!!! in <Macros > page for collections, menuButton toggles 'delete' option to appear over
		posts within list...
		- will have to create div within those li's that only appear upon menuButton being toggled


### 03. 06. 2024
@0800 
- Clean up style of privatePosts list in <Macros >section ✅ 
	- navigate() function for posts within list ✅
- <Home> exit animation needs to be linked to a prop 


### 03. 05. 2024
@1515 Remember for sections within <Macros > sections, have a minimum height 5 rows worth for
			(5 posts or 5 rows of tags)
			See all button expands said lists...

@1400 issue with scrolling + header fixed in <Macros >
!!! Need to make sure new posts get added to Tag's internal list of post
		as of now: postCount in <Macros > page is based on initial amount pulled,
								will eventually need true total

!!! current section in <SectionWrapper> needs to be saved when refreshing page on /home

!!! when posts are sent for Tags and Topics, have order reversed and remove any with future
		date.
		for collections, just reverse


### 03. 04. 2024
@1030 header gets messed up when returning to <Macros > page from a <Post > ✅


### 03. 03. 2024
Organize list of task most necessary for Macros section work to be complete
- subroute option for when topic's posts are needed, rather than a tag's ✅
- postAmount and userAmount info to be sent with tag / topic ✅

- create a private post, have them be displayed in <Macros > section ✅
- display user's collections within <Macros > section
	- option for bookmarks & collections needs to be added to <Post> 

- Need to have clicking on a tag or collection trigger the <Home > exit animation...
	will probably need to create stateVar to toggle this...
- speed up transition animations between sections
- apply menu opening animation code in <Macros > section to the others

@2350 isUnified option added to <Log> component. Displays user's post to the right, everyone
			else's to the left

@0225 <Macros > page now displays revelant posts, for tags

addition to To Be Done:
- have user's posts on right, everyone else on left ✅

- needs to work for: Topics & Collections


### 03. 02. 2024
@1715 Remove & Add functions of addRemoveRequest now functional (request to be implemented
			at a later time...)

addition to To Be Done: 
post amount and hasAccess amount should always be sent when tags
are sent...

could something equivalent for topics - <Macros > page does api request on load for the info...


### 02. 27. 2024
@0815 Site is now able to be viewed, used in 100% full screen on mobile browsers :D
			Will be able to commence unifying and appropiately sizing text elements for more 
			clean UI design

****To Be Done Next:
		- finish <Macros > page...
			- functionality for addRemoveRequest button ✅
			- display posts within macro ✅
			- postAmount and userAmount should be accurate ✅
			- display user's collections within <Macros > section ✅
			- create a private post, have them be displayed in <Macros > section ✅

Some minor things to note:
- Need to have clicking on a tag or collection trigger the <Home > exit animation...
	will probably need to create stateVar to toggle this...

- functionality for 'See Comment' button in <interactionList>
	it works in the <popUpNotif >

- speed up transition animations between sections

- apply menu opening animation code in <Macros > section to the others

LONG TERM
- let each option in navBar be selectable if present. 
	animation for navBar should be similar (moves opposite of direction of section chosen)
	transitions between sections themselves should be same as well...


@0800 "Pull Up on Header to Make FullScreen" addition to body...somehow

@0700 Created rysnc command for copying project over to Windows side, in order to host
			publicly on network and view project from mah phone.


### 02. 21. 2024
@1215 CSS added for <Macros > page. 

Need to have clicking on a tag or collection trigger the <Home > exit animation...


### 02. 20. 2024
@1115 Fixed issue with api call for getting a macro's posts ...

@0820 started working on navigate function to <Macros > page
			api call for tags's posts (accessAPI.groupPosts) currently not working
			not being recieved by back end when called...


### 02. 16. 2024
@1355 Skeleton created for <Macros > page ...

@1315 for security measures, may need to more of the user confirmation on the backEnd
			When user clicks private collection or tag, privateMacro's owner name should be
			send from backEnd.
			request to join macro should result in backEnd sending a adding a request notif
			in user's notifList - without sending owner's ID to frontEnd 

@1245 Started building out <Macros > page . . .
			Will list objective tasks ...

@1240 <Log > when showing combination of user's and other's posts should have user's on right
							and others on the left.

@1210 for Macros section, Tags and Collections to be links to <Macros > page...
			onClick needs to:
				- get all posts for tag or within collection,
					add to location.state
				- navigate() to macros, using name of Tag or Collection as param


### 02. 15. 2024
@1605 Privatize and Delete funcs now working :D !
			Collection's private button active state now dependant on isPrivate value

@0515 it worked on the first try :D !!!
			code written for all <ManageMacros > functions.
			Rename func tested and works perfectly d(T- T)
			will test Delete later, and Privatize.

To Do Next:
	- have 'private' button class be dependant on collection.isPrivate ✅
	- test to ensure Privatize and Delete funcs work ✅
	- !!! groupPages !!! ✅


### 02. 14. 2024
@0100 Added 'renameCollection' process 
(button function in <ManageMacros> --> <Instant> call action function)

To Do Next:
 - add privatize and delete collection functions ✅
 		- front and backend ✅

 - create new collections, test functions ✅
 - clean up <ManageMacros>
 		- populate tags and collection state arrays from backEnd ✅


### 02. 02. 2024
@0850 
added:
	- newCollection works as intended b(^.^)b 

After plugging in the manageCollection functions...
gotta make the groupPages :D
Then, styling the <ManageSocial> section

and finally, profile pages
the most involved aspects being to
	- pin posts
	- pin media 


### 02. 01. 2024
@1140 
added:
	- <Macros > refreshes data when <ManageMacros > closes
	-	Main options in <ManageMacros > close after submission response
		- may leave manageCollections option open after edit... 

@0955 deleting tags works T- T (so much little errors)
need to clean up UI process after success response
also need to have <Macros > data refreshed after closing the menu...

!? use same process for main options in <ManageMacros > for sections
	 in <Macros >, the 'see all' button


### 01. 31. 2024
@1210 newTag functionality already in place in <Instants >. Connected to the option within
	    <ManageMacros > works just as expected :D ! It's great to see previous, well planned
	    functionality be reimplemented to smoothly...

****To Do Next:
		- remaining functionality
			- in <ManageMacros > create body object, then use setSocketMessage
			- in <Instant > intepret socketMessage state change with conditional within Initial useEffect
			- write action_ functions for
				- deleting a tag ( accessAPI.manageGroup() )
				- newCollection ( accessAPI.newGroup() )
				- renaming a collection, deleting or making collection private ( accessAPI.manageGroup() )
			- write 'makePrivate' conditional within groups/manage/:makePrivate


### 01. 27. 2024
@1425 Options for manageCollections option in menu now working.
Note: implementation is -abit- glitchy, but suffices for now...

****To Do Next:
		- plug in functionality...
			plan beforehand, pls


### 01. 25. 2024
@1445 finish building skeleton&style for NewCollection & ManageCollections options

****To Do Next:
		- functionality for option selection in ManageCollections list
			- initial tap prompts div.initialChoiceWrapper
			- selecting delete or private closes div.initialChoiceWrapper, opens div.confirm
				- on click, make change to collection based on which item is selected in State var
					- then check whether 'delete' or 'private' was also selected
			- selecting rename opens form


### 01. 21. 2024
@0140 It's been a week (T- T) Gomenasai desu yooo
Anyhow,
selecting deleteTag options shows the confirmation options

****To Do Next:
		- build out NewCollection & ManageCollections options
		- connect <ManageMacros > to backEnd

Gotta look into lazy loading for the logs with images...


### 01. 14. 2024
@0150 Began building out the deleteTags section of <ManageMacros >

****To Do Next:
		- copy onClick effect from <MonthChart> for li within deleteTags so that confirmation
			div can appear ✅
		- connect buttons with backend api via <Instant>
			- routing from initial useEffect, doAction & responses and or interaction options


### 01. 13. 2024
@2330 Made subroute for deleting groups (api/groups/manageGroups/deleteGroup)
			verify to ensure it works:
				- deleting a private tag
				- being removing oneself from a public tag
					(this route needs to include removing same tag from all user posts)


### 01. 11. 2024
@0245 further development of <ManageMacros > menu options
			Will limit height of options which have indefinite lists

****To Be Done:
		- finish layout frontEnd for <ManageMacros > options
		- connect frontEnd to backEnd functions via <Instant>
			- routing from initial useEffect, doAction & responses and or interaction options
		and then
		- macros subpages!


### 01. 10. 2024
@1405 Alternative solution found to the loading affect for <ManageMacros >
			is also slightly cleaner than the other implementation used on other sections...
			may switch them all to this one ...

@0825 done some styling for <ManageMacros >

@0815 issue with the setEnter state func within <ManageMacros >
			seeming like the useEffect wont trigger when the modal is active...


### 01. 09. 2024
@2130 began some skeleton work for <ManageMacros>

need to have ::before psuedo class to main div for fading in and out on arrive and leave
header buttons in main menu expand wrapper li to fit content, height wise
	- should be limited to size of header button before hand

@1330 getting user's previously used tags works. Currently displaying in <Macros >

****To Do Next:
		- differentiate userTags from topics
		- make test private posts, make sure they display properly
		- macro subpages!

Then, commence <ManageMacros >



@1140 solved the issue by pulling the userKey in each API request.
			Not a very DRY approach at all, will redesign that at some point...

@1030 api call on intial sign in still not working...

@0925 previous suggestions issue fixed...

@0855 userID via sessionStorage is broken, again :/
			really infuriating, as no code related to that had changed

Currently, suggestions array isnt being read properly by filter function within onChange func
within the tags selection component...


### 01. 08. 2024
@0230 added initial styling for Macros sections, their headers and functionality to expand
			said sections

****To Do Next:
		- fix issue where selecting an option from suggestions removes it xD (probably the filtered array) ✅
		- differentiate userTags from topics
		- ensure function for getting used tags and private posts works correctly ✅
		- displaying tags and private posts within sections 1/2
		- macro subpages!


### 01. 07. 2024
@1615 made changes so that <Macros> section actually appears
Below is still currentmost task...

@1520 Current Task: Create User Tags Section for Macros
Layout:
- Headers for each section containing expansion button
- For tags:
	- each tag listed is styled different according to whether it's a
		topic (no style) public tag (default) private user tag (faded)
	- selecting each tag or topic leads to individual subpage

Add all the basic stuff to new <Macros> external page


### 01. 06. 2024
@0730 Create New Tag -> Add New Tag


### 01. 04. 2024
@2010 creating and getting user created tags works :D !

Reminder: make special exception for 'admin' tag: 
make it private tag everyone automatically subscribed to

****To Do Next:
		- fix issue where selecting an option from suggestions removes it xD (probably the filtered array)
		- differentiate userTags from topics
		- plan out macros section :D !

Macros Section:
- User tags and topics, their private posts and collections
- macros subpage, which contains the posts in each section
  - make variant of tags page
- collections list initially expands macros page - each list
	leads to it's own subpage



@1900 write 2nd part of newTab submission process in useEffect watching for change to 
			socketMessage. 


### 01. 03. 2024
@1350 newTag submission now works!

****To Do Next:
		- confirm process for adding new tag on backEnd + frontEnd response work properly ✅
		- refresh suggestions within <CreatePost> on submit (regardless of confirmation should be fine) ✅
		- make sure getting user tags they saved works properly ✅
		- differentiate tags and topics in suggestions list

upon all above working correctly, can commence building out <Macros> section


@1345 backEnd now having issue running find() on Group model...

@1320 set up process for creating new tag:
			setSocketMessage with data on submit within <CreatePost>
			primary useEffect in <Instant> socketMessage.action
			- runs doAction_newTag
				- if already exists, gives user option to join (should added whether already exists
				and is private...)
				- otherwise creates new tag

****To Do Next:
		- current issue is something wrong with the body included in the api call, seems like it
			isnt being added ✅

@0140 added styles to newTag modal
			Added functionality for opening and closing it

****To Do Next:
		- add functionality for creating new tag ✅
		  - this process will be the same (more or less) for all <Manage* > functions


### 01. 02. 2024
@1300 issue truly fixed now - had menuButton reset the date to the current date whenever
			closing the monthChart

@1230 Fixed issue with monthChart - frontEnd would crash after returning to monthChart on
a different month

@1110 fixed backend issue concerning returning old posts


### 01. 01. 2024
@1930 added skeleton for modal for creating new tags

Not getting posts from last year, as it's a new year
need to fix backend code...



H A P P Y  
	N E W
		Y E A R S !!!
2  0  2  4



### 12. 31. 2023
@1420 additions made checked off below...

made alternate class state for <CreatePost> for underlay when <NewTag> is up

****To Do Next:
		- create modal for newTag creation
		- begin making additions to <Instant> for channelling <Manage* > functions
		- may need to make <popUpNotif> zIndex higher than <CreatePost> ...

### 12. 30. 2023
@1400 additions made:
			selected tags wrapper adjusts when size expands too far 
			&
			can now click selected tags in order to remove them

****To Do Next:
		- add private button to toggle isPrivate ✅
		- edit ul#autocomplete so that 
		  - it's within a wrapper ✅
			- height is limited ✅
			- button to open modal for newTag is always at bottom ✅
		- create modal for newTag creation
		- begin making additions to <Instant> for channelling <Manage* > functions


### 12. 29. 2023
@2350 tags inclusion within post submission works :D !
need to display tags on post page ...


### 12. 25. 2023
@0810 added some basic styling for "tags within input" design. Still some more work to do,
			but great headway

****To Do Next:
		- give spans onClick function, so tags can be deSelected... ✅
		- implement flex direction change when inputWrapper gets too long ✅
		- add selected suggestions as tags in post . . . ✅
		- add private button to toggle isPrivate
		- discern logics for creating a tag from <CreatePost>

group management to be routed through <instants> component for responsiveness...
Where are my notes on that???


### 12. 24. 2023
@0100 Autocomplete search bar works for tags, bare minimum

****To Do Next:
		- make li options in results toggleable, so that selecting a tag marks it
		  as read within state 1/2
		- make span wrapper within input which holds selected options
			- use setSuggestions somewhere in here... ✅
		- add suggestions as tags in post . . .

nothing needs to be done to tags within a post... onBackend
still thinking I should add the _ to topics, for differentiation...


### 12. 16. 2023
@1030 added route option for group invites created within user/notif route 

on frontEnd, when accepting request, (groups/addUser), req.body must include
id of either owner or groupAdmin

**** To Do Next
		 - write function in <interactionsList> for accepting and ignoring invitations
		 - begin skeleton for <Macros> section...
		 - list of generic topics?

### 12. 15. 2023
@0940 added route for posts: getAll, add, remove.
			added route for manage: addUser (if public), removeUser (if Public or hasAccess)

****To Do Next:
		- create frontEnd apiAccess functions for tag & collection operations ✅
		- write algo for requests

outsideUser to owner:
	- outside sends request (notif in owners list)
	- on frontEnd, owner accepts request:
	  - adding user (one route)
	  - making notif (2nd route)
	- if ignore, remove notif from owner's notifs


### 12. 13. 2023
@2320 Begun setting up groups route for backEnd
			creation routes all completed (need to verify, ofc)

****To Do Next:
		- write out posts route
		- backEnd logic for editing posts


### 12. 12. 2023
@0815 added Try / Catch to all routes.
			No error _should_ be able to crash the api now...


### 12. 11. 2023
@1230 As of now, its seeming as though i may have brought a
a very premature end to my beloved PC . . . 

Fortunately, i believe the very last changes that I made to
this project were indeed commited.
Evenmoreso, the project looks and works great on mobile !!!

Current Issues:
- cannot make site full full screen and thus cannot access 
  the Post / exit button from the <CreatePost> component
- menuBar is transparent in <Post>
- visible lag when first selecting a post... this may be due
  to the fact that post data is gotten when link is
  clicked? or it has something to do with the animation....


### 12. 06. 2023
@1145 commentCount concern, solution provided. FrontEnd counts comments - updates on loads
			and comments for posts


### 12. 05. 2023
@1445
****To Do Next - finishing CSS
		- style comments ✅
		- style notifications ✅
		- fix styling of post options & commentBox ✅
		- monthChart styling ✅
			- signify current day some way ✅
			- transition effect ✅

- deleting comments
- Cleaning up the backend


@0335 CSS for <CreatePost> added

****To Do Next:
		- create array of image thumbnails for posts within <Log> ✅ 
		- on post click, slide element before going to <Post> ✅


### 12. 03. 2023
@1400 only needed to add animation by default to <Entry>
			mount transition effect also added for <Post>

@0545 Added the transition animations effects to current sections and pages (other than Post)
			but current implementation is abit shoddy

Will switch to giving elements a default entrance animation
the ::before to appear when component dismount


### 11. 30. 2023
@1555 added ::before psuedo element to <Entry>

latent components, i.e <CreatePost>, to have ::before opacity1 by default
onMount: use state to change component className to leave

****To Do:
		- add _latent_ toggle animations to...
			<CreatePost> ✅   
			<manageConnections> ✅
			<interactionList> ✅ 
		- add _regular_ toggle animations to
		  <Entry> ✅
		  <Home> ✅

For Latent:
	load with enter, true
	 - wait 100, then enter, false
	 on leave - enter, true


### 11. 29. 2023
@1230 
****To Do Next:
		- come up with process for editing a post
		- Clean up backend code and CSS . . .

Finishing 1.0A
- implement editing post & deleting comments & adding all comments

@1130 notifs are weird - but they work for now. Will remain as is with the whole double nested issue...
			however, all old notifs removed - working to implement notif.details now
			in both <InteractionsList>


### 11. 28. 2023
@1520 new comments and comment replies now created and added to Post doc without creating 
			individual docs 

****To Do Next:
		- process for deleting comments
		- adding notifs to user's notifList -correctly-
		- adjust route for marking a notif read
		- process for editing a post
			- replace text in content fields with new data
			- delete photos or add to pinned media 
			- option to pin post in details box


@0410 comment created and added to post Doc - however, will need to change getComments function
			within posts, as comments are no longer individual docs.
			simply get postData again after each comment upload 
			- will have to write function to count all nested comments


### 11. 27. 2023
@0355 add sanbanbaka and make post tagging user to investigate below notes

@0345 worked on CSS for <Home> and <InteractionsList> components

@1225 

****To Do:
		- Discern whether creating post makes seperate docs in DB for each content 
			( 11. 28. 2023 | it doesnt - never did lol) ✅
		- can new comment be created and added to post without saving directly?
			( 11. 28. 2023 | done ) ✅
		- can notifs be created and added to user's list without being saved ???
			( 11. 28. 2023 | Current processes work well enough as is)




### 11. 25. 2023
@1950 Deleted all DB groups, other than users
			Have noticed that my user notifications remain, and I can mark them read without
		  the supposed doc being editted (external doc doesnt exist)

Will look to take this approach with post content...
Also must make sure no new notifs are then created xD


@1115 <Entry> page CSS complete!
- checks whether all fields in form have input
- returns error messages with popUp notif
- transition animations between signUp and logIn
- animation for successful sign up (will add svgs later)

****To Do Next:
		- CSS for all <Home> & <Post> components

		- delete all DB content and users, start from scratch
		- document and organize all functions, make sure they work as intended
			- fix what doesn't work


@0100 
****To Do Next:
		- create error popUp alert. Activates when ✅
			- error from API
			- input field is missing value

same format: popUp stateVar,
	active: true, false
	message: API error or frontEnd check for missing field



### 11. 24. 2023
@1230 
****To Do Next:
		- add check for whether inputs have value onSubmit, if not:
			error message pop up 'please fill in all inputs'

- after successful signup,  ✅
	set transition state var in main component,
	when set true,
	- set signup false
	  delay. 
	  then set transition component on (same set up as other components)
	  after sequence complete,
	  turn off transition component then turn on log in

	  two elements in transition component
	  delay in animation sequence for second element
	  can define element within main Entry component



### 11. 23. 2023

@1145 added animation styling for loginOrSignup and the forms
      added toggling between the different forms

****To Do:
	  - form submit buttons "login" & "signup" to be nonActive and do nothing unless all
	  	inputs have values ✅
	  	- can check ref form.children[0].children for value
	  	- map array of input details, returned element can have value={state}

@1000 for initial button choice, on option select, loginOrSignup dissappears


### 11. 22. 2023
@1200 element toggle stateVar changes element class:

if true: element.class = on
- animation to display, then opacity 1

if false: element.class = off
- animation to opacity 0, display none

To Do Next:
- add animation classes to <forms> - same for both ✅
- for loginOrSignup, it dissappears on first click. ✅
	- can useRef and inline js for change
- fadeOut page on navigate


### 11. 19. 2023
@1955 Unexpected end of JSON error for user responding to their own comment...

implemented change to commentsSchema - now have field for parentPost, so that
all comments can be deleted alongside post



@1355 added component flow for deleting posts via <popUpNotif> :D
on backEnd - need to implement measure for deleting ALL comments associated with a post ...

@1245 comments issues fixed :D

@1100 Fixed the postConfirmation popUp issue - however, now posting comments doesnt cause
			a pop up... atleast, when user comments on own post

another user commenting on post give them a popUp, but also a notif about the comment as well
so, theres a mix up...


### 11. 18. 2023
@2350 postConfirmation keeps popping up after successful submit - fix

@2340 fixed concerning newLines in <CreatePost> 
		  Issue was the newLines would cause repeated entry of the same textArea, with new content
		  now update to textarea updates content in at respective index

newLines aren't maintained from submission to display (both comments and post)... will work on

@2110 userLog and unreadNotif count retrieved upon initial login
have to get the userKey with every api call - which is how it was done in the previous ver.


### 11. 17. 2023
@1620 perhaps in a preStep to 1.0A, after creating new accounts and data, 
-go to post from interactionsList- can be added.

As of now, new notifs will have change, but not previous. 
for notifs, postTitle, commentID is kept in notif.details
anything placed in details is JSON object


### 11. 15. 2023
@1500 will consider the scrollToComment issue 'closed' for now. May be able tp fix eventually
		  with CSS cleanup

@1405 scrollToComment does actually work now - but section#POST moving still an issue...

@1045 section#POST moves up by a tiny bit when scrollToComment is active
scrollToComment still not working however...


### 11. 13. 2023
@1725 need <Post> to reRender after initial load, so that it can find the comment and scrollTo...

@1425 commentCount function to be active for 1.0A (old posts dont have commentCount field)

@0655
****To Do
		- work on issue with frontEnd comment count ✅
		- work on commentCount issue ✅
		- tagged and comment notifs 'interact' to take user to post ✅
		- content within textbox for comments + postBody needs to be single string WHILE finding
			way to preserve newlines \nl 
			- could reuse bodyParse

@0640 Marking notif (atleast about comments) as read works, but the unReadcount doesnt update
      upon doing so ....
      I may just have to accept this as an 'up in the air' issue for now...
      it isn't experience breaking...



### 11. 12. 2023
@1350 api call for post isn't returning the object sent from backend - the ID. just keeps sending
		  true...
		  need id from successful notif to be passed to <instant> via socketMessage...

@1320
interactionList now updates immediately after marking a notif as read 

****'interact' option for tag alerts and comments to navigate to post (import navigate into <Instant>)
		!? scroll distance lost once selected
		!? backButton on post specifically returns user home -> UI concern???

### 11. 11. 2023
@1900 Issues fixed:
			- scroll distance and section maintained once returning from a post
			- user no longer recieves notif about their own comment on a their own post
			- all posts in <Log>are in descending order

Next:
- put notif.id in socketMessage after recieving confirmation, so that it can be marked read
  in the popUpNotif
- content within textbox needs to be single string 
  - how to preserve new lines

and something is currently wrong with marking posts asRead...




@1020 'option' created for error messages via <instant>

@0800 
****To Do . . . After
		- work on algo, middleware, for managing tags:
		   - creating, adding tags to posts - adding posts in tags' list

@0745 removed manageTags middleware & tags model from backend . . . intend to replace with
			'Groups' . . . 

Thus, new algo needs to be ordained for 
- creating tags
- adding tags to post
&
- adding posts to tags

This group model is also to be used for: User collections and Groups...

For 1.0A, will only have tags - private and nonPrivate


### 11. 10. 2023
@2230 Proactive & retroactive posts via monthChart now working :D !
there should REALLY be some indication as to whether a retro/pro post was made ...


@2220 date saved when returning from viewing post from <MonthChart>
			Change implemented so that <Log> doesn't save selectedPost when
			viewing on monthChart.

@2025 App recalls where user was on <MonthChart> when viewing post,
		  need to have date saved as well...

@1225 setting stateVar for current within the <Main> component and passing it down is a
	    successful solution to maintaining scroll distance & section user is viewing

selectedDate state var within <MonthChart> needs to be moved to <Main>
dateInView will be replaced by selectedDate as well...
^should allow <monthChart> to be maintained when pulling up a post

for <log> if monthChart is true, dont save post index 

and, in <Post> reAdd contingency for when selectedDate.date has value,
so createdPost is a retro/pro post


@0815 base function for scrolling to post within log works! 
	    now need to find method for getting index of post when selected to save ...


### 11. 09. 2023
@1830 scrollIntoView on element itself works...

@0715 Got the <Log> component to work within the <monthChart> 
		  however... clicking on the post goes to the <post> page, 
		  removing the chart from being up...

May have to implement router. Current research says that the contextProvider
can go around the <Routes> component in the MAIN return statement... we shall see

Context data would need to maintain the date info for the calendar
would also like it to maintain the currentSection and scrollDistance...
or, we could even use good ole js scrollToLink....


### 11. 08. 2023
@1845 reusing the <log> component within the <monthChart> doesnt seem to be working, so will
	    make another function for handling posts within it... 

### 11. 07. 2023
@1330 Calendar base functions working !
		  April 2024 month is organized incorrectly...

**** To Do Next
	   - fix issue with getting pattern for April 2024
	     - also happens with June 2024
	   - october 2023 has full blank array? check for and remove ✅
	   - fix css animation for calendar during transition
	   - add list below for postsPerDate
	     - shooould be able to simply add <log> component here...

@1040 backEnd is actually returning right amount of postsPerDate . . .

@0255 calendar now renders correctly :D !!!
**** To Do Next:
		 - backEnd is returning incorrect amount of postsPerDate ❌
		 - come up with more efficient / clean solution for changing months

@0200 Api calls now work (issue was fetch func had 'header' instead of 'headers T- T')
	    but now cal isnt rendering :/


### 11. 06. 2023
@1600 The bare minimum to have the calendar render has been imported over. 
		  Currently having issue with the api calls for the necessary data, says
		  call is unauthorized...


### 11. 01. 2023
@1155 apiAccess functions written for monthChart calls. previous api routes should be fine, left
	  as is. 
	  removed code which removes first entry from the reversed array of posts...
	  We'll see if it's necessary


### 10. 31. 2023
@1255 Found a better fix :D
**** To Be Done:
	 - Import Month Chart !
	 - work on subIssues

!? number one addition to make to API once finalizing 1.0A is all routes should have catch for errors
   if one received, send error message to frontEnd (to appear in <popUpNotif>) so that the server
   stays up regardless of errors

@1245 current solution to <popUpNotif> flash appearing whenever a page is loaded:
	  removed the nonActive class. component simply disappears after closing

@1155 
Sub issues to work on ...
- prevent user from getting notifs about their own comments
- component flow for deleting posts
- content within textbox needs to be made into one string
  - will have to work on bodyParse...
  ? how to preserve new lines
- disable submission if 'title' and 'content' are empty
- marking notif as read doesn't update component the first time, but does on the second...
- put notifID in socketMessage after confirming notif upload in <Instant>


@1150 it was the most simple issue preventing the popUp from appearing T- T
	  - im not sure if comment replies are causing notifications...

@1100 component flow for deleting post:
	  - pressing delete button prompts popUp with confirmation request
	    - socketMessage houses postID necessary for api req
	  - on confirmation, return user to <Home> then popUp with confirm message

@0808 Need to make sure text content is always ONE STRING...

@0150 backEnd websocket not recieving message...
      notif type concerning tagged posts, in <interactionList> not displaying text

!!! also, delete function needs to be added back ...


### 10. 30. 2023
@2020 skeleton for dropSelection component for selecting users to tag is done

Next:
- get user's connectionList on <CreatePost> mount
- go through stateVar housing selected users upon submission, include
  their ID's in socketMessage
- <Instant> route for taggedPosts
- backend Instant.js for taggedPosts
- API - DB route for making notifs for taggedPosts


!!! disable submission if 'title' and 'content' are empty


### 10. 29. 2023
@1345 userLog now updates after a post is made :D
	  will have to look into having posts log properly organized - new posts should be
	  at the top of the current day's list

****To Do Next
	- have backend send user's connectionList upon making a post
	- make check box with user's connections, 
		- frontEnd sends socketMessage & makes DB update to recipients notifs list
		  (done through <Instant>)
	and then
	- import monthChart and get it working 

@1340 I changed nothing, yet making uploads with post content having newlines now works...
	  the newline doesn't transfer over, ofc...

!? posts made same day appear in bottom up order: most recent post is at bottom of list for that day

@1310 successful posting results in a popUp notif

?! however, entering a newline within a post's content area
	causes the upload to fail, due to the way the data is sent over / or saved due to the unique
	form...

?! also, userLog isn't updating after an upload

@1130 marking a notif as read now updates the list :D !

@0755 MarkRead API-DB call works, however frontEnd isn't updating the notifList after 
	  the response from backend...  does update upon remounting...


### 10. 27. 2023
****To Do Next
	- markRead function on frontEnd & backEnd ✅
	- successfully uploading a post to trigger confirmation popUp ✅
	and then
	- have backend send user's connectionList upon making a post ✅
	- make check box with user's connections, ✅
		- frontEnd sends socketMessage & makes DB update to recipients notifs list
		  (done through <Instant>)
	and then
	- import monthChart and get it working

after which, all functionality for 1.0A will be complete

@1930 Works as intended - interactionsList updates when new socketMessage comes in

@1920 user's unread interaction count now available upon log in, and when interationsList 
	  updates
	  also set interactionList to update on socketMessage change,
	  let's see if it works as intended...


### 10. 26. 2023
@2010 will have to run experiment at some point to see

@1345 Comment notification for both parties works as intended
	  need to clean up the wording of the whole notif / popUpNotif arrangement T- T

****To Do Next:
	- make sure process works when post owner and comment author are different.... ✅
	  - notif gets added to both recipients, !HOWEVER need specific notif message for replies ...
	- have commenting update the post correctly ✅
	- have backend send unread notifAmount on signIn ✅
	- have backend send user's connectionList upon making a post
	!!! add functionality for tagging users !!!


@1330 comments arent updating corrently after a post . . .

!!! socketMessage set AFTER recieving a message can't have same exact message and type T_T xD !!!

!!! will also need to add function for deleting all comments associated with a post ... 



### 10. 25. 2023
@1430 currently setting socketMessage from handleSubmit() in <Post> to send notif data
	  with comment info

@1110 
- set up api subroute for adding comment to respective users notifications ✅
- set up instant.js on backend for comment messages... ✅
- new accessAPI function call... ✅
- <Instant> to have condition for comment message types ✅
	- when sending comments
	- when recieving comments
- commenting initiates everything above ✅



@1050 webSockets (seemingly) successfully moved to main
	  <Posts> now has <interactionList> and <popUpNotif>

setSocketMessage for when comments are made on post.
a notif and socketMessage needs to be made from the info...

@0930 deep nesting comments works :D !
Absolute win

****To Do Next
	- Move webSockets to <Main> ✅
		- have notif count in main as well...
	- add <interactionList> and <popUpNotif> to <Post> ✅

### 10. 24. 2023
@1725 issue resolved T-T it was an issue with asynchronicity, as i'd suspected

to do: find out whats happening to reply of a reply

@1645 created script to get comment replies (currently unsure if it works for 3 times nested
	  comments, but it should)
	  issue is - on initial page load, only the initial comments appear. Replies to comments
	  show up A F T E R making a change to the file, causing the page to update (not reload)

!!! need to figure out how to have ALL comments loaded and diplayed on initial page load


### 10. 23. 2023
@1320 . . . .
backend recieves random id number when I send it for post comments . . .

getting post comments seperately shows first nesting, yet was unable to make
a second nested commented

It is an issue on the back end, that nesting sub documents only goes 2 docs deep....

@0905 will try creating a seperate fetch function for post comments,
	  which gets post comments upon load...

would also need to create function for counting all comments to a post...



### 10. 22. 2023
@1414 Having trouble with nested comments on backend. Need to find correct way to nest comments in commments

@0845 Algo for responding to comments:

onClick of reply:
- get commentID in stateVar, comment number & number of replies
	- set type to reply
- directly open comment form
- for handleSubmit function, discern whether state type is 'initial' or 'reply'
	- if reply, parentID is ID of comment being replied to





### 10. 20. 2023
@1850 commenting now works :D !!!

But there's so much to clean up T- T
will need to find out how to make reloading a post page fetch the postData from the backEnd ...

**** To Do Next !
	 - make post body scrollable
	 - clean up comment skeleton style

!? reorganize component structure so that <Posts> utilizes same webSocket info 
	(meaning, initialize it in the <Main> component )

!? add popUp notif and interactionsList to <Post>



@1120 finished skeleton for optionsMenu in <Post> + comment box

for now, user comments to only have 'reply' button which also triggers
the same comment box to open.

**** Will need function to fetch post data so that page may be updated upon commenting
	12:07 getPost() satistfies this requirement


### 10. 19. 2023
@1600 useRef to reference optionToggling button in <Post> 
	  on toggle, it fades and display: none,
	  options take its place and buttonBar element slides upwards
on exit, reverse action


@1535 interacting with notifs a la interact() now working correctly...


### 10. 18. 2023
@1235 Initial layout and styling complete for interactionsList

**** To Be Done:
	 - setUp interact function to setSocketMessage for accepting and ignoring requests
	 !? (can add interact function for going to posts after I add commenting and tagging)

Need to add 'recieved' notif message for notifs T- T ✅


### 10. 13. 2023
@2200 a lil more work on the component...

@1315 set up some skeleton for the interactionList messages per notif
	  - the response object is currently an array, inside an array ...
	    another weird thing to account for during dev

@1140 ignoring a request now works :D


### 10. 12. 2023
@1515 process now fixed and working completely as intended T-T 

**** To Do
	 - add interact function option for ignoring connection request ✅
	 ! begin interactionsList

- after, begin work on commenting.
	- initial comment on post, and responding to other comments

	- post page to have it's own buttonBar...

!!! Need to change notifications in user model to be array of subDocs
!!! removing connections seems to display array of some info...?

@1500 the process for adding connections through the notif pop seems to be completing on the backend
	  SOMETIMES.
	  Others, it gets caught in a loop (current cant find cause)
	  or if it goes through, confirmation from the DB function isn't returned to frontEnd
	  to initiate webSocket message to original requester...

At one point, it seemed as though the server was becoming confused between the websocket message
and the http one T- T
Only solved this by changing the websocket message that the server is supposed to SEND


@0735 Current idea is to create a stateVar in the Main component so that all the other
	  pages can draw from it for: interactionsList & socketConnection
Everytime the user accesses a new page, the webSocket will reconnect, but the notifs
will always draw from the same store


### 10. 11. 2023
@2200 
To Do Next
  - finish connectionRequest functions in Instant.js popUpNotif 
    accept or ignore should get sender's ID from accessID stateVar

  - build interactionsList - list out different versions of notification

  - Would like to move post as sub route of home - however, I may need to
  	find some solution to having the Instant component available on other
  	pages....

@1540 it all works now 😩 i believe the issue was primarily with the fact that I was using 
	  JSON.stringify instead of parse T- T

@0900 webSocket + http call works well from first client to server
	  second client recieves the message - but react is not updating upon recieving it

current idea for a solution is to move the reception algos into a useEffect function,
which listens to the change of 'lastMessage' state var...



### 10. 10. 2023
@1640 reverse order of notifs before they're sent to frontEnd

@1020 newNotif api request works ...



### 10. 09. 2023
@1340 Set up front end so that on connectionRequest, requested user should get new notif + popUp notif
	  need to replace notif route in backend with the update, however....

	  once it works, finish with request options and start interactionsList

??? should closing a popUp mark the notif as read??
	individual notifs may need to be saved, in DB, in order to mark them as read...

@0655 WEB SOCkET FUNCTIONALITY IS WORKING :D !!!

**** To Do Next:
	  - reception of message triggers popUp
	  - complete connections process with http api calls

On reception of any message, instant should prompt interactionsList to update



### 10. 08. 2023
@0100 need to parse messages through JSON for websockets

@1205 Set up general outline of data.types for <Instant> to listen and respond to



### 10. 07. 2023
@1915 Had to reassess my plan for implementing the websockets...

Instant.js returns the popUp notifs (different variants) based on messages recieved.
Also responsible for sending webSocket messages based on message.type change

**** Will need to have all other external pages (like posts, groupPages and global) as nested
routes through the <Outlet> within the home component, so that instant is always available

@1255 need to utilize context for instants websockets...


### 10. 06. 2023
@1630 Algo for Notifs and Pop Ups:

* When an action ON FRONT END involves creating a notif, setWebSocket message is also 
  triggered This is a stateObj with the setup:

  type: 
  		-requestSent, 
  		-requestAccepted, 
  		-requestIgnored,
  		-commentInitial, 
  		commentResponse, 
  		tagging
  sender: initiator of notif
  recipients: those to notify of action
  
  frontEnd and backEnd websocket function will discern object type

* in instant.js, message type is the first check to determine what notif gets sent
  - an http request is sent based on message & same message object gets sent to backEnd websockets



@0830 Fuzzy search within <manageConnections> now works !!!
	  Next to work on is the interactionsList, a simple pull request and display, mattaku ne...

Real work commences with instant.js...

### 10. 04. 2023

@1645 users connections now get pulled correctly. (pretty sure that removal button doesn't
	  work tho)

**** To Do Next:
	 - fix search (only on backend: front end fetch working fine)✅

?! Requests to be done through notif route



### 10. 03. 2023
@2135 turns out issue is actually - only one user object is being sent, and its outside
	  of an array. The function to reduce the user object also doesn't seem to be working.

**** Tend to backend to fix issue ....

@2130 Currently having issue with <manageConnections > component
	  Opening it and running api request on mount for connections
	  seems to be causing the issue...?

@1305 Moved <CreatePost> component to HOME in Main.jsx

**** To Do Next
	 - Create confirmation modal which opens upon successful submission❌
	 - make sure postUpload works correctly ✅

   - Import manageConnections ✅
   - import interactionsList

   - Finally, commence work on instant.jsx


@0910 Will need to place the section's inner managing component within the HOME component 
	  in Main.jsx (i.e, userLog -> createPost, socialLog -> manageConnects)

**** To Do:
	 - Export and Move managingComponents to Home ✅
	 - For each section, if openModal = true && currentSection is it's number, then it opens ✅


### 10. 02. 2023
@2000 Fixed front and backend issue with the posts being arranged in the correct, sequential
	  order + each post made on an individual day having a date header

**** To Do Next -> createPost & manageConnections





### 09. 29. 2023
@1225 Initial ButtonBar html & css done 
	  Currently not toggling the opening of modal element, despite current implementation


### 09. 28. 2023
@1730 To Do Next
	  - import over buttonBar ✅
	  - recreate createPost & manageConnections sections
	  - recreate interactionsList
	  - finish instant, websocket handler and popUpNotif component

@1655 it was an issue with using null this whole time T- T 
	  But issue with the userLog doubleloading is now fixed !
	  In future, will need to create a context for managing the currentSection,
	  amonst some other things. However, that can easily be replaced retroactively

@1330 still having issue

@1030 on initial load, need to set class of userLog element to 'not' when prop, active, 
	  changes. classname will change however, when coming back to section


### 09. 27. 2023
@2025 Create overlay element in index.html 
	  Whenever home element mounts, get it and change to opacity: 0 and display none
	  display block and fade in on page changes

@1820 copy over postDetails set up

@0905 return button svg added to post page

@0150 Router to open post now works, with using params to get post - despite loaderData
	  with BrowserRouter not working...
	  HomeOrEntry not reRouting user to intended location, however . . .
	  I ***think*** something needs to be adjusted within Entry.jsx itself . . .

Also, the posts need to be correctly reordered . . .

****To Do Next
	- modify header, so that when on a post, a back button appears at the top ✔️
	- build out the post page ✔️
		- make contingency for currently seperated post content T- T ✔️

### 09. 26. 2023
@1815 On first log in, frontEnd is unable to get user's log as credentials dont seem to
	  to be immediately avaiable . . . .
	  Could try delaying the redirect - either way, need to fix


### 09. 25. 2023
@0100 Now working on importing blogpost ...


### 09. 23. 2023
@1435 Now got to create new route for blogpost
	  - header should have back button which only appears on a post ✔️
	  - Need to add loader to route in Main.js
	  - Need to add function for Navigate to ./post/:id in log for each postItem ✔️ 
	  - to send data using navigate.... ✔️

let toPost = () => {
	navigate('/post/:id', {state: {key: value, key: value}});
}

function Post ({}) {
	const location = useLocation();
	let thing = location.state.key;
}




@1050 made fix for seperated postContent. 
	  Will keep for now as I recreate the blogpost and createPost component

****To Do Next:
	- Create socialLog ✔️
	- css for log, differentiate social and user ✔️
	- import blogpost 
		then createPost

@0820 blogLog gets and displays post content as originally intended.
	  Due to change in postContent structure however, content from all prior posts
	  is split into an array...
	  ? can delete all prior posts, start from scratch??
	  ?! content pieces also do not refer to original post... which is slightly concerning?


### 09. 22. 2023
@1630 changeSection affect works as intended.
****To Do Next:
    - Add scale and fade animations to sections ✔️
    - begin importing over prior code for sections:✔️
    	- blogLog: make generic log component for userLog, socialLog ✔️
    	- blogPost: display blog content in external route / page
    	- manageConnections for socialLog
    - add ButtonBar and functionality for opening section's modals

make external, independant components for bloglog and blogpost


### 09. 21. 2023
@1450 test the changeSection affect . . .

@0110 Begun HTML skeleton and initial JS for sectionsWrapper and sections


### 09. 20. 2023
@1250 CarouselNav visual functionality completed . . .
	  Will leave spacing as is for now

****To Do Next:
	- move currentOpt stateVar to <home> so that mainSections can have access, for switching
	  sections


### 09. 19. 2023

@1850 IT WORKS !!!
	Now to implement solution for right side!
	Also need to work on better spacing...

@1510 Still need to figure out the buttons...

@1345 Begun working on CarouselNav. Need to figure out button placement and sizing, then
	  linking animations for scaling the font-size of the options to the buttons


### 09. 18. 2023

@1450 Header Skeleton and BaseCSS finished. 
	****To Do Next:
		- Build the <CarouselNav> and HomeSections . . .


@1400 Wrapper Element for both <carouselNav> and Main Section Panes. Whatever element
	  is nested within <Home> will have same height as that wrapper


@0750 Login and the auth context w/ router now works 

****To Do Next
	- Almost all routes will be nested through HOME component, which consists of: <header> <carouselNav> and <buttonBar>.  In between nav and bar is where the <outlet> will go, allowing other 'pages' to be viewed.
		- Within a Home route, create other routes for the elements


### 09. 17. 2023
@2025 the authentication context doesn't seem to be working as intended. 
	  Will have to find some other way to block protected routes . . .
	  Will try moving the router into an App.js file....


### 09. 16. 2023
@1030 Gonna start using this file for notes again, as keeping track of progress between FE & BE becomes tedious and difficult . . . 

Functions for API calls of basic routes needed for 1.0A all written

Overall goal, currently, is to reWrite all current components as necessary for routed 
conversion. 

****To Do Next . . .
   	- ReWriting UserEntry.js as entry.jsx

