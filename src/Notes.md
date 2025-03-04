
## S y n c S e q . x y z
#### Project Notes & Planning
-----------------------------------------------------------------------------------------

### 02. 27. 2025
@1600 <Map> currentCenter draws from lonLat info saved in sessionStorage.
			In future, will add location permissions check instead

****To Do Next:
	- style search bar in <Map> settings

****To Do After:
	- Location Name search option should also be added to 'Create Post'
	- Also add option screen to signUp process

****Last Touches...?
	- Design messaging in XD 

Who's Online & Tagged Posts sections on Social side
USER -> Home, Custom feeds
Color Scheme Customization
Video upload
deleting comments

@0910 Need to update signin process to save preferredLocation Data
	  it should be made available within <Map> if user's location permissions are off

### 02. 26. 2025
@1455 Multiple queries for the Autocomplete API have yet to show up on the billing chart,
	  (i believe it's around $2.83 per 1000 queries, or $0.0028 each)

****To Do Next:
	- upon selecting option, update user's doc ✅
		- rename preferredLocation to defaultLocation 
	- modify input so searches arent made on deletion of text ✅
	- style suggestion results
	- update <Map> and sign in process so that component utilizes user's default location
		if location permissions arent on ✅

Overall:
- Location Name search option should also be added to 'Create Post'
- Also add option screen to signUp process

@1320 Fixed the issue with the backend subroute for the Places Autocomplete API
	  Need to understand how the pricing works so I can properly restrict the searches

### 02. 20. 2025
@0110 need to restrict API keys in GCS to domain using HTTP Referrer

A L S O
updated Node.js to v18.20 from 16.14

### 02. 08. 2025
@0705 Added settings panel in <Map> and functionality for smooth opening & close

****Next
	- design settings panel in xd 

****to Fix:
	- <CreatePost> needs to time info upon opening...

Describing Process:
- frontEnd gets location name using GCS
	- may have to split the string
- update user doc on backend


### 02. 03. 2025
@2230 Added conditional for different connection types in <ManageConnections> listed 
	  connections.
	  Tested and working!

****To Do Next:
	- Add profile pictures to connected users
	- remove overlay of options for search results
		- selecting name goes straight to user's profile
	- comment removal
	- video support


### 02. 02. 2025
@0655 added subroute on backEnd for removing subscriber


### 02. 01. 2025
@1415 Added svgs for connections to <ManageConnections>

!!! For connections: can leave options as is
	For subscriptions & subscribers: 'remove' button needs to unsubscribe said user 

!!! list items also need to include user's profilePhoto

### 01. 30. 2025
@1500 allConnections on <UserProfile> now shows svg for different types

!!! add it for connections section

****To Do Next, OVERALL
	- adding subs to <Connections> list and <UserProfile>, 
	- add video support,
	- removal of comments

??? color should be different when they user and viewed user have a mutual connection

??? methodology for preventing multiple requests, and being able to send them again after
	certain time period(?)

@0900 postCount includes private posts. current query SHOULD be excluding them, but doesnt
	  seem to be working

changed 'getConnects' backEnd subroute to include all 3 types

!!! put all connections in same list, simply state what they are

### 01. 27. 2025
@0755 spent most of this time fixing some small issues

!!! connection requestion confirm for reciever is missing sender's name
??? subscription request reciever not getting popUP
	- websockets seemed to be acting up on backend, but it does work...
!!! automatic subscription missing reciever's name
!!! recieving a subscriber has wrong notification in notifList

admin has:
  - testerTwo as a connection
  - is subscribed to Sanbanbaka
  - has testerJoao as a subscriber

Should have some indication that user is looking at their own profile...

@0645 Single arrow pointing towards name indicates a subscriber (info going towards, one way)
	  Single arrow pointing *away* from name, is a subscription

### 01. 26. 2025
@1625 Everything is working well and as intended for subscriptions and connections, except
	  unsubscribing, but that seems to be a purely frontEnd thing
	  !!! ensure popUp when unsubscribing

****To Do Next, OVERALL
	- adding subs to <Connections> list and <UserProfile>, 
	- add video support,
	- removal of comments

??? methodology for preventing multiple requests, and being able to send them again after
	certain time period(?)

??? some small additions, but will make move towards uploading project

@1615 accepting subscription from both popUp and notifications works!

@1555 Removing subscription needs to have popUp for remover <UserProfile>


### 01. 23. 2025
@1440 Issue below fixed, now works in it's entirity

!! Now to test acceptance of subscription, auto and request...

@1400 Accepting connectionRequest from popUp works, original requester recieves confirmation
	  popUp as well - but, backend crashes, stating missing recipient in websocket message...


### 01. 21. 2025
@1545 ConnectionAcceptance works from notifs

!!!make sure it works from popUps also

then, reconfirm subscription works

??? there should be a way to resend connection requests after a certain period or so

@1445 

!!! ignore needs to mark connectionRequest as read ✅
but initial request works as intended: confirm popUp for sender, popUp for reciever. 
	correct messages also

@1000 Gotta reorganize notifications, specifically popUp notifs and messages, for both
	  subscriptions and connection requests.

Both of them can go through makeNotif_initialRequest function
the response if the request type has already been sent would be: 'you already sent this kind of 
request'

routing all through initialRequest SHOULD make this more simple....

sender's popUps say request, ...sent 
reciever's also say request, ...recieved
if auto subscribe, sender's popUp says confirmation
					reciever's also says confirmation recieved(?)
acceptance notifs says confirmationSent for accepter/initial reciever
				  says confirmationReceived for sender


### 01. 18. 2025
@1435 accepting subscription from popUp should close current, then launch another one
	  - it does indeed work however.

Confirm subscriptions, auto and request, are working all around

then, adding + differentiating subscribers in <ManageConnections> and <UserProfile>

!!! user's log shows up within viewed user's profile list. need to fix


### 01. 17. 2025
@1310
****To Do Next:
	- accepting subscription in notifs should reload notifs ✅
	- accepting subscription in popUp should first close popUp, then initiate (set it to
		close from within interact function) ✅
	- original requester's popUp confirming subscription acceptance is missing sender's username ✅
	- confirmation notification for requester's subReq is incorrect ✅
	- unsubscribing refreshes page ✅

***deep sighs***

??? Backend check to prevent multiple subscriptions to same person...

Reciever's popUp for automatic popUp includes subscribers name & notification popsUp as it should

??? Ignoring a subReq marks it read within notifs - but notif unread count doesn't update :/


### 01. 16. 2025
@2150 direct subscription has popUp for both Sender and Reciever
	  - sender's popUp still missing reciever's username
	  Would like 'subscribe' button in profile to switch to 'unsubscribe'
	  need to change data (from loaderData) to state var

Make sure that confirming subscription requests from popUp notifs works


### 01. 13. 2025
@0950 added to scripts concerning Sender recieving popUp notif on automatic subscription
	  Reciever gets popUp notif as well. 
	  --Need to test

After adding subs to <Connections> list and <UserProfile>, 
will add video support,
removal of comments
some small additions, but will make move towards uploading project

### 01. 08. 2025
@1445 Original requester recieves popUp and notif when subscription is confirmed
	  - missing sender's username still


### 12. 29. 2024
@1540 message now appears correctly for both sender and recipient
	  recipient username still missing in sender confirmation, but I'll take that L for now

I assume that after subscriptions is all set,
we'll work on adding differentiation for connections on <UserProfile> and in <ManageConnections>

****Next
- Need to make sure subscription acceptance works in popUp and Notification

****Issue
- user's own posts appear in other user's <UserProfile> link to all Posts

****After
	- add popUp for subscriptionRequest on reciever end (confirm this is all finished)
		create backend subroute for 'subscriptionAccepted' and 'subscribed'
		- confirmer SENDS a subscriptionAccepted popUp to REQUESTER when they accept via notifs ✅
		- requester SENDS a subscriptionAccepted popUP to reciever via notifs when subs without request ✅
	? remove subscription func in <UserProfile>
	? popup for reciever on acceptance
	- need to get subscriptions, subscribers in <ManageConnections> getConnections subroute
		- if user's privacy is Half or On, this list cannot be seen by others
	- need subscriptions posts in socialRoute for <SocialLog>
	- add svgs to users based on connection status
	- add 'isConnected', 'isSubscribed', 'isSubscriber' to getAllConnects subroute 


### 12. 21. 2024
@1350 sending a subscriptionRequest successfully initiates websocket popUp on reciever's end
	  however - shikashi - popUp message is missing in both sender's confirm popUp and 
	  reciever's popUp...
	  the type and the message is the same for both
	  there should be a type.confirm message.subReq for sender
	  and type.request for reciever

### 11. 22. 2024
@2330
popUps for subReq:
	- user's subReq (from <UserProfile>) sends socket to recip via <Instant>
	- backend subroute for socket discerning subReq
	- frontEnd discerns subReq socketMessage

### 11. 08. 2024
@0740 notification order corrected for subscriptions

****Working On
	- add popUp for subscriptionRequest on reciever end
		- add acceptance for subscriptions as option
			create backend subroute for 'subscriptionAccepted' and 'subscribed'
			- confirmer SENDS a subscriptionAccepted popUp to REQUESTER when they accept via notifs
			- requester SENDS a subscriptionAccepted popUP to reciever via notifs when subs without request
			create frontEnd subroute for them too
	- popup for reciever on acceptance
	- need to get subscriptions in <ManageConnections> getConnections subroute
	- need subscriptions posts in socialRoute for <SocialLog>
	- add svgs to users based on connection status
	- add 'isConnected', 'isSubscribed', 'isSubscriber' to getAllConnects subroute 

@1220 Subscriptions is still a mess. 
on requests: sender is sender, recievier is reciever
on acceptance: sender is new reciever, old reciever is new sender

this order gets mixed up in the notifs and is affecting the subscription notifs too
on acceptance: (old reciever, new sender) gets 'subAccepted'
				(old sender, new reciever) get 'subbed'

for now, update subscriptions to reflect proper order

****Working on:
	- removing subscription sent a request instead. please fix ✅
		- add popUp for subscriptionRequest on reciever end
		- add acceptance for subscriptions as option
	- popup for reciever on acceptance
	- need to get subscriptions in <ManageConnections> getConnections subroute
	- need subscriptions posts in socialRoute for <SocialLog>


??a subscriptionOwner can subscribe back to subscriber, or connect
  - connecting changes relation to connection on both ends,
  	but will add this update later

### 11. 07. 2024 
@1345 
****working on
route all 'request' notifs through makeNotif_initialRequest
will send user an equivalent popUp notif based on the response
- acceptance of subscription not working in Notif
- unsure if recipient recieved popUp


@1230 differentiated subscription requests notifs on backend (can update admins in DB if wish so)

****To Do Next:
	- add 'accept subscription' option to popUp notifs
		- makesure there is popUp notif for subscription requests
	- add 'isConnected' and 'isSubscribed' to getAllConnects subroute
	- navigate(0) to refresh page on subscription to update values
	- add svgs to users based on connection status 
	- update UIC to prepare for colorScheme addition

### 11. 05. 2024
@0745 search needs to be fixed in <manageConnections>
	exitButton needs a wrapper

@0655 disconnecting from user via <userProfile> seems to work correctly - but no notif popped up


### 11. 04. 2024
@1215 
****To Do Next:
	- need to make notif type in <NotifList> for 'subscriptionRequested' and 'subscriptionAccepted' ✅
	- add 'accept subscription' option to popUp notifs
		- makesure there is popUp notif for subscription requests
	- add 'isConnected' and 'isSubscribed' to getAllConnects subroute
	- navigate(0) to refresh page on subscription to update values
	- add svgs to users based on connection status 
	- update UIC to prepare for colorScheme addition

### 11. 03. 2024
@1200 navigate(0) to refresh page on subscription to update values

@2030 need to make notif type in <NotifList> for 'subscriptionRequested' and 'subscriptionAccepted'
	  need to make check whether observed user on userProfile is currently connected or not
	  add isConnected and isSubscribed? check to singleUser subroute
	  adjust padding for buttons in menus

@0720 working on add subscription functionality

uses same backend subroute as connections and macroRequests
if reciever is privacySetting half or on: 
- they recieve request notif, and they have to confirm
if not, sender automatically subscribes and recipient gets notif
have to discern on the initial send from frontEnd whether recipient is half or off
if off, button sends 'subscribed' notif
if half, button sends 'subscriptionRequest' notif

@0620 issue accessing user's profile page from log in <Social> ✅
		for some reason, clicking username activates buttonBar mainButton?
		not reading user info correctly...

### 11. 02. 2024
@2020 not sure if its these two photos in particular, but images are being rotated on upload
	  will test others...

Would need to add delay to all buttons in order to truly see effect....
but it looks good on the buttonBar mainButton

### 11. 01. 2024
@0750 connections now showing up properly
		ul#dataList is still showing up, it should only be ul#connections
	  buttons are also too long for stats

****To Do Next
	- work on styling for both AllPosts and AllConnections
	- connections should be links to other user's profiles
	- add subscription function ✅
	- differentiate subscriptions from connections in fullList
	- filter menu section for both sections
		- date vs activity
		- mutual, connections, subscription, subscribed ❌
	- add profile image to <ManageConnections>
	- add hoverState to all buttons. backgroundColor should be lighter version of
	  textColor ???1/2
	- better word for 'links' in <userProfile>

@0720 data is successfully retrieved from route, but not showing up within element.
		only one ul should be appearing within fullList, but two are?

@0630 modified user/userid route. if provided userid is different from current user's, info
	  returned is for userID

@1305 basic addition of list of posts on <UserProfile>
	- should I disable DragSlider for log here?
	- current styling is meh
	- need to introduce currentlog tracker so place in log is remembered when post selected

@1225 modified the log subroute so that the pullUserLog function can include a userID
		  if it's included, the posts recieved will NOT include {isPrivate: true} or drafts

### 10. 30. 2024
****To Do Next
	- <Macrospage> for collections needs to include username ✅
		- fix goToProfile function
	- Need thumbnail styling for <popUpPost> in <Map> ✅
	- list of posts <UserProfile> ✅
	- list of connections on <UserProfile> ✅
	- add hoverState to all buttons. backgroundColor should be lighter version of
	  textColor 
	- differentiate connection vs subscription with arrow icons in <userProfile>
	  and <ManageConnections>
		- can indicate mutual connections
		- should add profilePhoto for connections...

@1100 fixed issue with backend not sending posts for tags or topics in <Macrospage> 
		Should be working now, but will triple check

@0640 New issue : the back button in the header of <UserProfile> is either going to a post
	 with an id that doesnt link to a post, or the <Entry> page.... help pls fix ✅

### 10. 24. 2024
@1630 fixed order for lonLat on <CreatePost>. I was reading and typing it in wrong - plus,
	  google goes LatLon (y, x)
Reverted back to LonLat (x, y) :P
May need to find another UX / UI solution


### 10. 23. 2024
@1355
****To Do Next
	- Need thumbnail styling for <popUpPost> in <Map>
	- order is still incorrect for lonLat ... somewhere ✅
	- add 'enter' and 'leave' animation classes for <DragSlider> ✅
	- add it to 
		<Post>✅ 
		<Macrospage>✅ 
		<UserProfile>✅
	- add 'View Post' button ✅
	- pinLocation button needs more space underneath - could accidently select Draft button
	  instead ✅

****Then...
	- add hoverState to all buttons. backgroundColor should be lighter version of
	  textColor 
	- list of posts & connections on <UserProfile>
	- differentiate connection vs subscription with arrow icons in <userProfile>
	  and <ManageConnections>
		- can indicate mutual connections
		- should add profilePhoto for connections...

@1350 add postIDs to each image object in the <DragSlider> 
Add 'goToPost' button next to exit
can do navigate(post/${current.gallery.postID[currentIndex]}) for button function

!!! will need to differentiate between images and video in the future...

@0140 barebones implementation of the slider added :D !
need to clean it up and add it to <Post> <Macrospage> <UserProfile>
- may need to add 'go to post' button for <userprofile> version....
	- could be done later, or just have it by default

!!! ALSO - <userProfile> page takes a while to load???
	- going from home -> profile -> post -> back to profile -> back to home 
	  has an issue at last step


@0120 got bare minimum done with adding the touch-drag-slider into the project
		the image currently wont show up
		and need to prevent going to <Post> after closing the <DragSlider>

### 10. 22. 2024
@2030 About page should have it's own CSS


### 10. 21. 2024
@0620 pinLocation button needs more space underneath - could accidently select Draft button
	  instead

### 10. 19. 2024
@1140
****To Work on Next
	- add hoverState to all buttons. backgroundColor should be lighter version of
	  textColor 
	- fullScreen imageslider for a post's image (use @bushblade from gitHub)
		- clicking on image thumbnail triggers this
	- list of posts & connections on <UserProfile>
	- differentiate connection vs subscription with arrow icons in <userProfile>
	  and <ManageConnections>
		- can indicate mutual connections
		- should add profilePhoto for connections...

a process: when viewing a user or post from a userProfile fullList,
setting current.modal = on and current.currentLog to 'usersPosts'
should have the fullList open still once returning the user's profile +
should scroll down to the selected entry...

@0905 fixed issue with 'undefined' being in macros url

@0645 subdoc implementation for rePosts 'should' be working...
	  will develop that later tho

@0350 trying to implement repost functionality on backEnd...
	  using ChatGPT for ideas
	  might need to create and export seperate schema for reposts

intention is to have a repost be a subdoc within a user's own log of posts
ask 'how can i save one user's post as a subdoc with another user's post?'

### 10. 18. 2024
@0145 make fullpage style component for <SliderViewer> to go in <Home> <Post> <Macrospage>
	  and <UserProfile>

idea: locations have <Macrospage> just like tags. Header is 'public/location' then 
	  City, State as the header title

also, would like url for topics macrospage to end in 'topic' rather than 'undefined'

!!! <Macrospage> also needs filter button (date and activity)
!!! can also have <Calendar> and <Map> as well 
!!! making a post on <Macrospage> automatically adds it to the post
	- would need a new location field for city, state
??? if user makes post with coordinates on place, but listed city and or state is elsewhere,
	what should be done?
	!!! pinLocation function should automatically get both coordinates and nearest city / state
		- can remove either coordinates or city/state field
		- closing and reopening pinLocation should readd them


### 10. 17. 2024
@0840 fixed issue with being unable to go to user's own profile while on another's profile
	  may need the same fix on <Post>

### 10. 16. 2024
@2200
for <ManageConnections> and <UserProfile> fullList
connections are twoWay arrow
subscriptions have arrow indictating who's what 
	-inward means listed user is subscribed to

order list
	- mutuals (of any sort)
	- connections
	- subscriptions
	- subscribers

a filter button to switch what appears first, or alphabetical order

I need a 'check' to differentiate current or previously accessed logs...
for each page that has a log, 
log should only 'scrollTo' if it is current.currentLog

current.currentLog would be set anytime a post is viewed from a log...

explore chatGPT suggestions for fixing issue of going to another userProfile
while on userprofile ✅

add privacy check for 'on' and 'half'

filter for posts fuLLlist: date and activity


@1710 
****To Work on Next
	- add hoverState to all buttons. backgroundColor should be lighter version of
	  textColor 
	- fullScreen imageslider for a post's image (use @bushblade from gitHub)
		- clicking on image thumbnail triggers this
	- list of posts & connections on <UserProfile>
	- differentiate connection vs subscription with arrow icons in <userProfile>
	  and <ManageConnections>
		- can indicate mutual connections
		- should add profilePhoto for connections...

@1435 arrows now work. need to add counter in between
May leave lack of animation...

all links to <Post> may need to have an empty state object...

Would like cluster markers to be larger 

@0400 can now see post info in clusters. 
****To Do Next
		- reverse class for arrows and further styling
		- post cycling functionality

### 10. 15. 2024
@2010 singular post will show up with popUpPost in <Map>, but initial post in a cluster
	is not yet so

@1245 multiple posts per marker updated code more or less working. Need to implement the 
necessary working code into my own designs.

Plan is to have text within a wrapper,
it moves when clicking 'prev' and 'next' buttons
sequence
 - move wrapper left or right
 - update info
 - move wrapper back, starting from opposite direction

 quick and sharp movement
 text should be replaced during slight break between animations...

moveToRight {
	0% 
		right: 0
		opacity 1
	100%
		right 25
		opacity 0
} 

moveToLeft {
	0% 
		left: 0
		opacity: 1
	100%
		left: 25
		opacity: 0
}

moveFromLeft {
	0%
		left: -25%
		opacity: 0
	100%
		left: 0%
		opacity: 1
}

moveFromRight {
	0%
		right: -25%
		opacity: 0
	100%
		right: 0%
		opacity: 1
}

### 10. 13. 2024
@1645 currently implementing cluster markers for <Map> with aid of ChatGPT

@1530 round up to 10,000ths place (4th decimal) for similar locations
lat(y) lon(x)

@2130 have ChatGPT analyze <Map> code as basis to have it assist me in adding multiple posts
	per point

twoWay arrow icon for <ManageConnections> added to resources folder

@1340 search results for users needs to be much more precise...

@1300 exit button in <ManageConnections> needs to have a wrapping div

@0120 for group admin system, some bare basic
if a group has less than 5 admins - originalCreator (always admin0) - has sole authority
to remove and invite other admins. If a group has 5 or more, 5 votes are required for
removal.
- Admins can highlight posts, remove them, add and remove members, remove posts from group.
- Their posts and comments are highlighted within <Log> and in <Post>
- voting required to change groupName, bio, headerImage if over 5 admins

### 10. 12. 2024
@1305 
***To Do Next
		- original sender of connection request should recieve popUp notif ✅
		- multiple posts per point in <Map> ✅
		- overlay for comments (deleting, replying) 
			- does it need an indicator tho?
		- filter by tag for <Map>
		- list of posts & connections on <UserProfile>
			- fullList, it's own page
			- differentiate connection vs subscription with arrow icons
				- can indicate mutual connections
		- fullScreen imageslider for a post's image
			- clicking on image thumbnail triggers this
		- 'Start' page
				- header, notifs, list of home tabs, settings and profile
		- add subscriptions
		- differentiation connections and subscriptions in <ManageConnections> with oneWay and 
			twoWay arrows
		- editting posts
		- color theming
		- video upload & backend compression
		- rePost and quotes
***
ideas for Social section overhaul
- list of groups
- tagged posts
- connections

connectionsList is option within <ManageConnections> 
opening it closes manageConnections

for groups, 
would need to implement voting mechanics...?
for removing admins, i guess...
only 5 votes needed in total to remove an admin, regardless of amount

any admin can accept user
all admins get notif request

need new sub sub routes in user/notifications for group requests?
or modify check in accept route

Should probably clean up site ALOT before adding groups.



### 10. 09. 2024
@1100 
AS OF NOW ....
- need way of checking whether a user has topic saved. ✅
- adding another's post to collections adds point for adder, but not post author. working sometimes ✅
- original sender of connection request should recieve popUp notif
- accept connection route needs to check whether users are already connected ✅
- entire notification process for requesting access to a tag worked beautifully ✅
	I believe that the points increased adequatedly as well, but i'll check again
@0845 requestCheck now works for connectionRequests!
would like to change ignore path...

For now, ignoring a request simply marks it read. request check is really for sender not
to overflow reciever with requests if they've already been sent...



@0210 Request check for requests and access keeps returning a doc with a message value that
			doesnt match what im looking for ('sent' and 'accessRequested')

			the check is passing, but the rest of the code is also running as well

### 10. 07. 2024
@2315 adding a connection does increase the count for both users tho 
****To Be Fixed
 		- original sender doesnt get popUp notif on connection confirmation ✅
 		- original sender confirm notification is missing recipients name ✅
 		- accepting a connectionRequest via notification should mark the original one 
 		  as read ✅
 		- make check for previously sent request, send 'ignored' notif type to requester via
 			popUps stating theyve already sent a request ✅
 			- add this for collection requests as well
 		- connectionRequest notifs need link to requester's profile



@1435 need to be able to unselect option in <ManageConnections>, searching for new users

@0845 can now go to comment from <NotifsList>
issue when returning to Home from post, leaving from NotifsList

within <Post>, the post id is set to current.scrollTo

removed for now, 

Need to change so that scrollTo tracks where the postID came from...

### 10. 06. 2024
@1400 makesure all listed functions update users' interactionCount

### 10. 05. 2024
@1340 Add social buttons underneath name credit in <About>

****List of Subroute operations 
	  that need to increment interactionCount
	  - posting ✅✅
	  - commenting ✅✅
	  	- responding to a comment ✅✅
	  - adding connection (both users) ✅✅
	  - adding others to collection, tag (both users) ✅
	  - adding post to collections (both users) ✅✅
	  - tagging others in a post


@0415 Changelog styling complete!

### 10. 03. 2024
@1435 Need an MD file for releaseChangelog. How to convert it to HTML...
Maybe in the future I can create an algo to parse an MD file from the backend to
html elements....
changeLog will be hardcoded for now...

li
	span - version title
	h2 - title
	li - top level note
		li - details

@1145 Elements, styling and functionality done for first part of <About> page
****To Do Next
		- need to trim the text in <About> page
		- need to create <Changelog>
		- adding interaction incrementer to all applicable functions 

### 10. 02. 2024
@1425 All elements and styling done for <About> page
****To Do Next:
		- need to trim the text in <About> page
		- need to create <Changelog> ✅

@1035 close menu on comment submit...

### 10. 01. 2024
@2000 fixed the issue with the calendar! turns out the necessary code to remove that extra
			row with nothing but blanks was there, but had an error

@1635 recenter button added for <Map> and zoom buttons restyled

****To Do Next:
		- implement new algo for <Calendar> ✅
		- <About> page and <Changelog>

****After,
		- rundown of all functions
		- further codeclean up and organization
		- planning future additions

!!! Options for messages: Reply, Profile, Report
		for user's own messages: Reply, Edit?, Delete
User profiles should also have 'report' option, but further down the line perhaps...

@0720 rough implementation added of recentering button for <Map>
			will use chatGPT to replace zooms with buttons at bottom corners

Need to replace algorithm for <Calendar>
all request routes need checks for whether users already sent them
will return notifying message if recipient has ignored them

@0540 March and Jun 2025 render incorrectly in <Calendar> Will need to replace the algorithm

### 09. 30. 2024
@1600 march 2025 has 6 weeks slots D: The horror...
would like to make the months transition smoother
theres overlap when the selectedMonth switched positions to the center

@1520 had to change <calendar> back to using selectedDate for the setup. I believe it was changed
			due to the date sticking when I would change from map to calendar, but that doesn't seem to 
			be the case anymore...

using css, i've set the 6th row in the calendar to simply not appear should it load.
it should always be empty, thus will discern at some point whether this affects functionality

@0240
****To Do Next:
		- <Calendar>style update
			- adjust the animation in the changing of the months. 1/2
			- timing of when postCount gets updated ✅
			- an extra 6th row is being added to the calendar? gotta remove 
				- write script to remove row if all divs are empty
		- popUp in <Map> needs an update as well
		- <Map> also needs a recentering button... ✅
				- styling for zoom buttons changed as well
		- <About> page and changelog

****After,
		- rundown of all functions
		- further codeclean up and organization
		- planning future additions

I hope that the production version fixes the multiple calling of functions...


@0200 topicSelection addition to signup process successful!

### 09. 28. 2024
@2355 merging seems to have gone through well enough ...
			onto adding topics selection section for signup!

### 09. 28. 2024 - branch:BrowserRouterUpdate
@1310 createBrowserRouter update is complete. to be merged with main branch!

@0130 IT WORKS :D ! Fixed the issue with failure to go to <Post> page on first click - had
			to do with changing the 'current' state
			Moved that to the <post> page instead in the initialLoad useEffect

**** To Do Next
			- need to change all instances of navigate to updated version ✅
**** After
			- fix 'aboutProject' button option ✅
			- topicsSelector addition to signUp process ✅
			- calendar style update
			- popUp in <Map> needs an update as well
			- <Map> also needs a recentering button...

### 09. 27. 2024 - branch:BrowserRouterUpdate
@1650 for the most part, the update is successful. Have to change every navigate instance
		  to the updated version of the route
		  also need to change the component data to draw from the loader data
		  rather than the state data
right now tho, having issue loading <Post> page on first click. Every other page works
	first click

@0855 Seems like <RouterProvider router={routerObj} /> will replace the <Main> object
the <UiContextProvider> should then go around router provider
this is all exported as the main app

@0835 Working updating browserRouter to CreateBrowserRouter. 
Creating new branch...

### 09. 25. 2024
@2130 ****Moving Forward...
The next addition is to add the topics selector to the signUp process
The calendar still needs to be redesigned
And i need to overhaul React.router so that it works properly...

@2125 Granting access to collections now works: adding user, correct notifications and
	  and websockets to update the notifCount
	  Should add button to view the new collection

@1755 webSocket now successfully updating recieving user's notifs and popUp!

@1655 Working to send a webSocket message when user requests access. 
	  Should be a simple prompt which updates the recieving user's notification count
	  and prompts a popUpNotif


@0830 finished accessGranted interaction option in notifs.
		should send notif and run add user

@0810 issue fixed with the goToProfile functions :D
privateCollections now show alert if user doesnt have access

### 09. 24. 2024
@1850 for some reason, all goToProfile functions are going to the user's own profile, instead of the targets...

@1700 Due to my adding React.router improperly, links around the site that require more data
dont really work xD...
There currently isn't a way to view a user's collections either xD
For now, i'll add a section underneath pinnedPosts on UserProfiles

@1235 
****To Do Next:
	- gotta parse message.request type notifs in <NotifList>
	- interact function to approve invites
		- one sending the notif
		- another to add the user

@1145 Added bookmarks for sanbanbaka and fixed the adding issue...


### 09. 23. 2024
@1215 
****Next Steps
	- for request:
		Simple Process: 
		 - request access from <macrospage>
		 - owner confirms of ignores via notifsList
		Order:
		- requester sends request notif,
		- owner sends confirm notif
	- posts in private tags macrospage CANNOT be seen if user does not have access
	- create bookmarks for Sanbanbaka, ensure current issue alleviated ✅

@0950 it works now t-t switching the ARRD and the notifs 

@0145 try changing only arrd on confirmation...
	  might not be necessary to update the state, as it would do so when back in the section

@1210 scrollTo needs to be disabled when on Macrospage...?
need more robust solution...
Can possibly add a section field to current to discern the previous log

the rest of the confirming script for adding a tag -isnt working-
currently cant spot why
but the tag does get added

!!! trying to bookmark another accounts post resulted in a 'do not have access'
	- sanbanbaka is actually gettting admin's bookmarks and collections...
		why, how??
		doesnt have it's own, but still shouldnt be getting another's ?!

!!! trying to get tags for admin is now causing error on backend
	- fixed this: but now the tag orders are rearranged t- t

### 09. 22. 2024
@2340 Doesnt make sense to have topics be removal, 

@1420 Adding and removing topics from user settings works. 

As of rn - Macros section is 'RecentTags' instead of 'User Tags'
Should this section be all of a user's tags and topics?
...probably

move tags to topLevel
set and reader to be passed down to home and Macrospage

### 09. 20. 2024
@1210 
*** having trouble getting posts for topics while on a post ✅
*** fix 'About Project' button in <UserSettings>
*** need to test if adding and removing tags and public topics works ✅
*** rename macrosPage to macrosPage

add check in macrospage in ARRD setter for whether the topic name is included in user's settings ✅
! from macrosSection, simply marked topics as hasAccess, as it wouldnt be there if user didnt have access

in postupload route, check if used topics are in user's settings. 
if not, add


### 09. 19. 2024
@1535 need to modify addRequestRemoveDelete function in <Macrospage> to discern whether
	  its tag, topic or collection
	  +
	  add backend route for adding and removing topics from user's settings

### 09. 17. 2024
@0235 drafting posts functionality has been added. tests seems to be fine

Fixed an issue within the <NotifList> concerning postTitles...

- there's an issue with selecting a user within <ManageConnections> ✅
- enter Macros sections needs an animation ✅
- username in <Macros> needs to be link to user profile
- implementing saving topics
	- macros section shows user's saved topics + recently used tags
- add topic selection to signup process
- finish <About> page and changelog 
- <MonthChart> to <Calendar> and style update
	- adjust the animation in the changing of the months. 
	- timing of when postCount gets updated
	- an extra 6th row is being added to the calendar? gotta remove


- final clean up and all functionality testing
	- will probably have to list all of the current possible operations T- T

- A list of all things I'd like to add AFTER 1.0A, small and large


### 09. 16. 2024
@2330 rearranging the lon and lat in <Maps> has displaced old posts, so we'll make new ones
	  to ensure it is all good . . .

@2210 locationData issue fixed, but location still ending up in antartica ...

@2200 Gotta remove old notifs so that the change can be seen

@2145 current issue: location data not filled in when selecting draft
	  one state call after another doesnt seem to be working...

@2045 draft is deleted when utlitized as post 

@1955 issue with the tags and tagged users not showing up is fixed ✅


### 09. 15. 2024
@2145 Issues with:
		- tags and tagged users not showing up
			- very long list added for users?

had to add 'onChange' to textarea. Had switched to onBlur in order to deal with an issue
will test to see whether i can leave both, or only onChange if there's already a value

@1840 may have to save info for current section and place in log into sessionStorage,
as refreshing on a <Post> removes that info

@1350 working on functionality to populate createPost with selected option from fullList
	drafts

@1140 Would like to repurpose the api funcs to mirror the backend subroute layout.
so, e.i apiaccess.posts.getPost()

****To Fix:
	- one or another opening for <Macros> section settings 
	- have current.section and current.scrollTo be in sessionStorage
	- set chosen draft with a 'selected: true' field
		- upon submission, check for it and have it deleted

			- need api subroute for deleting drafts

### 09. 13. 2024
@1855 Next, 
- create backend subroute for getting drafts ✅
- add <fullList> to <CreatePost> ✅
	- make necessary changes to 'draft' option ✅
- repopulate function for <CreatePost> when draft selected

@0920 need to change 'Home.css' to 'Base.css'

### 09. 11. 2024
@2200 For Drafts: (drafting done 09.17.2024)
- draft button at bottom bar ✅
- drafts button at top w/ info button ✅
- adjust frontend and backend for drafts ✅ 
  - all getDocs funcs for posts to include filter for type: drafts ✅
  - subroute for user's drafts (next)
- draft list is <FullList> with extra rows for deets 
- selecting a draft should populate <CreatePost> accordingly
	- add postContent per each item
	- preselect users and tags
	- location data
	- private or not


### 09. 07. 2024
@1600 Removing post content should work now. Do a test to make sure

@1550 Working on making content within <CreatePost> removable. Necessary for when editting
	  drafts.
Currently having issue with adding images. 

@0835 Will add draft functionality as final addition for 1.0A
implement removing text boxes and images
should be able to remove any item without affecting entire order
- add 'remove' button to lower right corner

Clicking button in Macros section should trigger page leave animation
get from <Log>


@0810 Fixed some issues with <Macrospage>
Will forego adding topics selection to signup process for now...

@0745 in Macrospage,
user's username should be link to their page

for private tags and collections,
posts can be viewed ONLY by users with access.

private tags with same name can exist.

Simple Process: 
 - request access from <macrospage>
 - owner confirms of ignores via notifsList

Order:
- requester sends request notif,
- owner sends confirm notf


### 09. 02. 2024
@0735 add social links & picture to developers in About page
make list of all future planned additions

@0720 selecting topics in signup sequence & about / changelog SHOULD be last addition for 1.0A

@0700 Continue working on CSS refinement

For topics in macrospage, create backend subroute for adding topic strings to user's topics field in their settings

can also create a modal for adding topics within the signup sequence

!!! move all logs and macros data to <Main> for better loading

### 08. 31. 2024
@0900 To Do Next: Macros Page and Calendar styling

### 08. 30. 2024
@1700 Currently Working on CSS refinement

****Some of the Fixes
- adding additional text or image ✅
- x buttons need to be replaced with correct symbol ✅
	- post page ✅
	- notifList ✅
	- userProfile ✅
- text sizing overall 
- color scheme ubiquity
	- all buttons are black 
	- text a middle gray
	- titles are black
	- remove any visible lines
	- styling or details, use --elements 
- macros page to be updated ✅
- interactionsList to be renamed to notifsList, styles updated ✅
- monthChart to be renamed to calendar, styles updateds
- <Post>
	- move details into options ✅
	- ? include tagged members ontop with username? listed number instead ✅
	- if post has no media, hide 'Pin Media' option ✅
	- options in post can be more neat ✅
- <CreatePost>
	- list of tagable users needs to be scrollable like list of tags ✅

@1700 fixed spacing issue with Macros subsections

@1610 content pieces for post can be a mixed field...

@1515 list of tagable users needs to be scrollable like list of tags

### 08. 28. 2024
@0045
****To Do Next:
	- CSS Overhaul
	  - test on mobile
	  - implement contingency (modal which blocks site) if viewport larger than a phone's
	- test ALL site functionality (make list, check twice)
	- About page
		- where to put link on entry page? top right corner?

and then, UPLOAD !!!

### 08. 27. 2024
@2310 fixed some issues with <Calendar>...

@1400 As part of CSS update, will like to change <CreatePost> so that it only says
'add Image' or 'add Text' (done) ✅

Map should also triangulate on user's location, and adjust the default if there's no location
access

@1355 changed privacySetting functionality

### 08. 26. 2024
@1610
****Need To Do:
	- introductory post ideas
	- fix 'allTagsUsed' subroute so users most recently used topics show up too ✅

CSS UPDATE
****Some of the Fixes
- adding additional text or image ✅
- x buttons need to be replaced with correct symbol
	- post page ✅
- text sizing overall
- color scheme ubiquity
	- all buttons are black
	- text a middle gray
	- try to remove any visible lines
- macros page to be updated
- interactionsList to be renamed to notifsList, styles updated
- monthChart to be renamed to calendar, styles updateds
- <Post>
	- move details into options ✅
	- ? include tagged members ontop with username? 
	- if post has no media, hide 'Pin Media' option ✅
	- options in post can be more neat ✅

****Then
	- ALL FUNCTIONS CHECK

@1550 can now access macros page for topics from <Post> ✅
still need to fix 'getUserTags' subroute so users most recently used topics show up too

@1225 Make notifList a top level state so that it's open once closing <Settings>

@0150 run the signup process again once more for triple confirmation ✅

### 08. 25. 2024
@0925 all things correct, signup to login works as it should
****Need to do
	- signup button in login form now triggers refPanel instead ✅
	- username check when submiting form part of signup ✅
	- if still failure at end, change message to advice user to refresh the page and
		try again ✅
	- bookmarks didnt appear. fix pls ✅
	- updating a user's profilePhoto should update ALL of their posts. 
		verify this is working ✅
	- move state array for carousel navigation classes to <Main > so that it's maintained when
		leaving and returning to sections other than User ✅
	- add file compression to newuser route for profile pic ✅
	- post count in <MacrosPage> changes to 0 from correct count on pageload. plz fix ✅
	- ideas for introductory post

@0900 Will need to include a username check in the form submission (moving from form to 
privacy settings) include within the sequencer. make it a subroute of newuser

****would also like to add a previous button...

****need to add file compression to newuser route for profile pic

### 08. 24. 2024
@0410 creating a new user through the signup works :D ! ✅

****To Do Next
	- log user in after signup completion
	- signup button in Login form needs to toggle the referralModal instead

### 08. 23. 2024
@0345 Added form validation. results in a popup which notifies which field has an error

Just need to readd the form submission, backend additions, and add the automatic login 
process afterwards

### 08. 22. 2024
@1310 Added a profile image addition option to signup sequence. Im still having the issue
where adding images needs to be done twice...

****Necessary Additions:
	- need to add some form validation to Signup component, in order to set signUpReady
	  to true

### 08. 17. 2024
@0740 Would like to include email verification... But perhaps should leave that aside for now
****To Do Next
	- submit sign up info
		- adding bookmarks to their collections ✅
		- adding admin0 to their connections & their referer ✅
		- referral code creation and addition to their profile ✅
	- log user in after signup completion


### 08. 15. 2024
@0150 Have to move form submission function and sequence function for signup component
	  to the main entry component.✅


### 08. 14. 2024
@0440 
****Working On...
	- move 'handleSubmit' function in SignUp to Entry
		- create state array for form elements, make handleChange function for inputs
	- add privacy setting choice
	- successful signup should automatically log user in. Change function sequence for this

Signup button when Login is active needs to toggle referral modal
	- if login is active while 'continue' is selected in modal, first remove login

****Issues
	- Something wrong with monthChart again....
	- privacy settings not showing up
		- api request not working either

### 08. 13. 2024
@0220 
after selecting 'continue': ✅
  - both header and dualButton options to use recede animation,
  	replaced by singular button and logoHeader, with return animation by default
  - signup form should be in total center
  - seperate div for privacy options
  - singular button changes from 'continue' to 'signup', use fade for transition

change signup button to trigger referral modal ✅

@1230 Something wrong with monthChart again....

### 08. 12. 2024
@1640 
****To Do Next
	- backend functionality for referral ✅
		- returning some referee user info if referal code is real 
	- css for referralPanel divTwo ✅
	- add privacy setting choice to signUp panel
	- header changes to Logo & dualOptions switch to singular 'continue' ✅
	  when referal code is confirmed
	- correct sequence so:
		- signup triggers referralPanel ✅
		- confirming code closes referral panel, opens signup form, changes header and button ✅
		- after inputting details, signup form shows privacy options
		- selection of privacy choice, then signup.


@1420 Gonna start by adding the all the html / base components that I need for referral
	  sequence.

### 08. 11. 2024
@2315
- Implement referral codes + signing up with referral code
		- see sequence in XD file
	- Additions to signUp subroute
		- adding bookmarks to their collections
		- adding admin0 to their connections and their referer

CSS UPDATE
****Some of the Fixes
- x buttons need to be replaced with correct symbol
- options in post can be more neat
- text sizing overall
- color scheme ubiquity
	- all buttons are black
	- text a middle gray
	- try to remove any visible lines
- macros page to be updated
- interactionsList to be renamed to notifsList, styles updated
- monthChart to be renamed to calendar, styles updated
	
****About Project Page
	- Info / rhetoric on project inspiration, design aims, future goals
	- count for Users & Posts (eventually, interaction count, cities, groups)
	- link to changelog


@1530 algo for creating referral code (every 3 characters in user's ID)
add as first entry in user's referral array

function everyThirdChar(inputStr) {
    let result = '';
    // Loop through the string, incrementing by 3 each time
    for (let i = 2; i < inputStr.length; i += 3) {
        result += inputStr[i];
    }
    return result;
}

find function for MongoDB, finding user by their referral code
Users.find({
    "invites.0": xxxxxxx
});

@1325 
****To Do Next:
	- Implementing signUp with referral code
	- designing & building "About Project" page
	- Complete css overhaul

@0255 ✅ add response for when websockets disconnect
		  Begin implementing referral code


### 08. 10. 2024
@1805 Image reduction with sharp works, and loading on the site is sooooo much better :D !

@1700 16.14 was the version of Node that the backend was initially built with - updating it
	  in order to use the sharp module

****issues:
	- If post is uploaded with only photos, the link text is used in <Log>. Must add a 
	  check to keep that empty...
	✅ taggedUsers should be empty if there are none 

Need to add some affect in <CreatePost> when posts take a while to upload...


### 08. 09. 2024
@0145 Can now select any of the 3 nav options at anytime.

### 08. 07. 2024
@2000 Design combination of Social + Group sections into new Social Section
	  Style similarly to Macros section (which needs adjustment) Groups on top, then 
	  Connections(?) and Subscribed(?)
	  replace 'see all' with plus buttons

Also, why are there 2 'computer' topics in the 'recent tags' <Macros> section?

@1440 Working on changing <CarouselNav> so that any of the three options can be chosen
		in any state. Algo prepared.

@0150 Finishing up here . . .

****Remaining Most Vital Tasks
	✅ If post is uploaded with only photos, the link text is used in <Log>. Must add a 
	  check to keep that empty...
	✅ response for when sockets disconnect (need)
	✅ calendar or map is open, the other cannot be. Make check in <ButtonBar> 
	✅ For mainNav bar, can choose any option at a time. Not sequential 
	✅ reducing image uploads at backEnd, implement sharp module 
	✅ usernames are incorrectly switched in confirmation message for connectionRequest 
	   	  might still do so in regards to updating it with more posts, however
	✅ Add dimmed opacity effect to <CreatePost> while post is uploading  
		- if upload fails, cancel dimming and show popUp
		- if upload succeeds, continue with what already happens
	?! memoization: is it still needed?
	   ?! moving the log state array to the Main component may have removed the need for
	   	  implementing useMemo on it...

_somewhere inbetween: CSS UPDATE_

****After
	- Implement referral codes + signing up with referral code
		- see sequence in XD file
	- Additions to signUp subroute
		- adding bookmarks to their collections
		- adding admin0 to their connections and their referer

****About Project Page
	- Info / rhetoric on project inspiration, design aims, future goals
	- count for Users & Posts (eventually, interaction count, cities, groups)
	- link to changelog

### 08. 06. 2024
@1345 After ToDoAfters are complete, add new signUp sequence including referral codes
then CSS overhaul (again)

****Some of the Fixes
- x buttons need to be replaced with svg
- options in post can be more neat
- text sizing overall
- color scheme ubiquity
	- all buttons are black
	- text a middle gray
	- try to remove any visible lines
- macros page to be updated
- interactionsList to be renamed to notifsList, styles updated
- monthChart to be renamed to calendar, styles updated


### 08. 05. 2024
@1640 tag buttons in <Post> now goes to it's macros page

****Next....
	- post count in <Macros> page reverting to 0? pls fix ✅
	- 'theFirstCollection' is stating 'undefined' where user info should go
		and thirdCollection is saying public ✅

****To Do After:
	✅ issue fixed with getting topics and createdTags for <CreatePost> 
	✅ in <CreatePost> make sure info for current date is taken AT THE TIME the post is 
		not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays 
	✅ 'See Post' button in <interactionList> not working
	✅ when clicked, section menuButton should close <MonthChart> if it's open
		closing modal should also reset selectedDates to current day 
	- For mainNav bar, can choose any option at a time. Not sequential
	- reducing image uploads at backEnd
	- memoization
	   ?! moving the log state array to the Main component may have removed the need for
	   	  implementing useMemo on it...
	   	  might still do so in regards to updating it with more posts, however
	- response for when sockets disconnect
	- usernames are incorrectly switched in confirmation message for connectionRequest


@0340 Styling done for Tags in <Post>

In order to go to individual macros page, alot more info is needed than what's saved within
the post doc.
Will need to
	- create backEnd route to supply frontEnd with tag
	- then run getPosts for that tag (getPosts subroute filters the posts, which is why
		this operation is split)
	- copy goToMacrosPage function from macros.jsx

@0255 updated upload post subroute so that tags are saved with their respective ids,
	  topics are not

@0115 In order to view individual macros page for tags, it's id is necessary. Currently,
	  tags are only saved within post under it's name - just a string.

Im thinking that we still send the post request with tags as strings,
find the tags on the backEnd. if theyre tags, not topics - add ids to the
post tags object. if not, only save the names.


### 08. 04. 2024
@1155 more things popping up that I havent considered or need to be added / fixed.
	  I shall add tags to the <Post> page, finish the most vital additions,
	  add the referral code sequence to the entry page, and then we upload at 1.0A
	  CSS overhaul before upload

<Post> page needs redesign, centered around 'post details', tags and map inclusion

****Issue:
	- location permissions can only be requested once on a website, otherwise users
	  must set permissions manually.
	  Where can I leave a notice informing users how to set the locations permission?


### 08. 03. 2024
@0100 
****To Do Next:
	- Need to make date filter within map functional ✅
	- add list of tags + link to macros page within <Post> ✅

@1240 Tagging users currently doesnt work (T-T ). pls fix ✅

### 08. 01. 2024
@1530 <Map> now reads and creates markers from Log
Need to do....
	- add X button to top right corner + make functional ✅
	- clicking on text takes user to specified post ✅
	- add post details to text wrapper ✅

Need to think about what to do if there are many posts within a singular point ...


@1220 HTML, CSS and JS functionality all present for pinning location within a post

****To Do Next:
	- Update <Map> so that it takes data from the log state array for the markers and 
	  popUp panel ✅
	  	- popUp panel should have a close button ✅

****After, Most Vital
	- issue fixed with getting topics and createdTags for <CreatePost> ✅
	- in <CreatePost> make sure info for current date is taken AT THE TIME the post is 
		not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays
	- 'See Post' button in <interactionList> not working
	- when clicked, section menuButton should close <MonthChart> if it's open
		closing modal should also reset selectedDates to current day
	- For mainNav bar, can choose any option at a time. Not sequential
	- reducing image uploads at backEnd
	- memoization
****After, Least Vital
	- in <userProfile> clicking on connection count shows list of all user's connections
		should be same for posts and subscriptions
	- in concerns to date picker in <map>
		- just limit on input number based on days within month
		- save that number to a state, add var within notice text
		- R e s e t selectedDate whenever modal is closed (reset to current info)


### 07. 31. 2024
@0005 HTML + CSS done for pinLocation lon and lat inputs
	  need to add ternary to wrapper and p element,
	  - if pinLocation lon or lat IS NOT equal to locationData (which is user's current
	  location) class is inactive.

Proper functionality:
upon first pressing pinLocation button, navigation.geolocation prompt should appear
asking user for location permissions.
lon and lat data is then saved into locationData and pinLocation. they should be equal

changes to Post schema, locationData, mixed type: lon, lat, state, city.

### 07. 29. 2024
@1900 Need to add html + css for lon lat input
	  inputs inside div,
	  selecting input shoooould turn label and underline black, from grey...

@1840 Made a compass svg icon in Adobe XD, and replaced the <Map> button text with it.
	  Will keep the map functionality as simple as possible for now

### 07. 28. 2024
@2355 Need to come up with some new design for the map button . . . May also need to remove
	  emphasis on country / state names . . .
	  there currently doesnt seem to be any list of worldwide city names abbreviated with
	  3 letters.

@1540 Checked on tagging within posts - seems to be working fine. 
		upload, backEnd filtering, getting posts with said tag...

@1455 Added DatePicker to <Map>, however I need to add some checks for the date
****To Do:
	- just limit on input number based on days within month
	- save that number to a state, add var within notice text
	- R e s e t selectedDate whenever modal is closed (reset to current info)

### 07. 25. 2024
@1545 
fix current issue: 
	- animations for postBoard in <Map> isn't working. must try different
	  method. maybe direct class change using the ref. ✅

****To Do Next:
	- make filters functional + css ✅
		- add datePicker to <Map> 
			- selectedDate will need to be passed down to <Map> ✅
		- add placeholder for when MACROS selected ✅

After,
- add 'pin location' to <CreatePost> ✅
	- reveals inputs for lon and lat that can be editted
- add tags and topics to <Post>


All this added should denote completion for 1.0A

Additional Tasks:
	- issue fixed with getting topics and createdTags for <CreatePost> ✅
	- in <CreatePost> make sure info for current date is taken AT THE TIME the post is 
		not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays
	- when clicked, section menuButton should close <MonthChart> if it's open
	- For mainNav bar, can choose any option at a time. Not sequential
	- in <userProfile> clicking on connection count shows list of all user's connections
		should be same for posts and subscriptions
	- in concerns to date picker in <map>
		- just limit on input number based on days within month
		- save that number to a state, add var within notice text
		- R e s e t selectedDate whenever modal is closed (reset to current info)
	- reducing image uploads at backEnd
	- memoization



@1540 Due to an error in managing these notes, I've lost about this whole months worth of 
	  notes, without anyway to recover them.

I have to remember to copy the notes to the parent folder after a git pull. I didnt,
and ended up overwriting the new notes with much older ones.

I've copied what I could from the previous git push.


### 07. 16. 2024

@1425 attempt with <Map> shows that some elements are *still fuzzy*
	  reverting the changes and returning to original development plans

@1230 Ive decided to test and alternative method for opening the 'widgets'
	  by having them on their own seperate page

### 07. 14. 2024
@0920 Took a while to get it up and running, but blurry elements in <Map> and <Cal> 
		*do not* appear blurry on mobile. 

So for now, production continues as originally planned...


### 07. 13. 2024
@1615 added styles to the map.css for the controls. ChatGPT has provided a solution	
		for adding a custom button, and guessed correctly that I wished for it to recenter on the original coordinates.
Need to investigate how the elements appear blurry...
Find a fix
Things are even fuzzier within monthChart...

Will first view project on phone to discern whether this continues on mobile...


### 07. 12. 2024
@1600 Need to fix backend subroute for getSuggestions within groups... Suggestions
	  not loading within <CreatePost>

### 07. 11. 2024
@1525 Have header text change for map and calendar as well...

@1510 Implemented a quick solution for having external buttons center on spots
	  on the map.
	  Next additions:
	  	- button to return to user's original center / city location
	  	- would like to move the zoom buttons to the bottom corners and change
	  		their styling
	  	- change the colors of the paths on the map (like highways and roads)
Will need to figure out how to get location data from user when creating a post,
update Post model to include location data ( long, lat)
would also like it to include city and country name, but that could get confusing...
Current implementation of the <Map> will be simple: shows location data for posts
in regards to the currently active section (User, Social or Home)
for groups and macros, the specific macro pages will have a dedicated button outside
of the button bar...
Both Calendar and Map toggles should be invisible on the Macro and Group sections...
@1325 have implemented function for points on the map, clicking on them zooms closer
	  into their location.
	  Should be able to have a state object external of the useEffect for managing the 
	  points 
@0930 With the help of ChatGPT, I've been able to set the center of the map to NYC.
	  the state var housing the coordinates is outside of the useEffect there all the
	  map stuff is declared. Changing the state var causes the whole component to
	  refresh. Could ask ChatGPT, 
	  - need to be able to change the center / location of the map WITHOUT refreshing
	  	entire component
### 07. 10. 2024
@1820 Current focus is to discern how to implement these functions in the map:
	  - centering on user's city by default
	  - selecting a post from <Log> below the map zooms in on post's pin,
	  	selecting a pin scrolls the <Log> to the corressponding post
	  - recenter on user's location
### 07. 09. 2024
@2250 installed openLayers npm package for map functionality 
****To Do Next
	- discern list of functions I'd like to have with the map
	  - e.i zoom in / out, multiple pins present, centering on given location,
	  centering on user's location initially
	- design Elements within XD
	- find functions within ol API directory or list of functions
		- discern what location info and permissions I need to implement them
		(might not even need location permission if providing location details)
	- implementation 
@1535 added necessities for <Map> modal in <Home>. Empty div set up for adding the map
### 07. 07. 2024
@1520 Will be working on these few changes, then we embark on <Map> !!!
****To Do Next:
	- in <CreatePost> make sure info for current date is taken AT THE TIME the post is 
		not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays
	- when clicked, section menuButton should close <MonthChart> if it's open
	- For mainNav bar, can choose any option at a time. Not sequential
	- in <userProfile> clicking on connection count shows list of all user's connections
		should be same for posts and subscriptions
	- reducing image uploads at backEnd
	- memoization
@1515 dateSelection added for <MonthChart> 
	  - small issue, kinda: it shows current month and year rather than whats currently
	  	being viewed on the calendar...
### 07. 06. 2024
@1530 CSS pretty much complete for date selection within <MonthChart> 
	  Now to work on functionality for it...
	  selecting a month and a year should automatically update the calendar underneath


### 07. 04. 2024
@1330 Working on implementing dateSelection within <MonthChart>....which needs to be 
			renamed lol

### 07. 02. 2024
@1310 Still need to move some more CSS over for individiual sections, but will do so when
			completing style overhaul

Currently Working on...
- design for <MonthChart> date selection and 
- last side quests
- redesign how tags are added to post page..?
- figure out refferal code stuff
	- could store user's invite code as first object within invites array?

@1250 enter / exit animation update 
			- interactionsList ✅
			- createPost ✅
			- manageSocials ✅

@0835 working through the Side Quests now . . .

### 07. 01. 2024
@2200 Made <UserSettings> it's own page
			need to add logout modal ✅
			for profile options, only one open at once ✅

### 06. 30. 2024
@0915 Currently working on design addition for invitation sign ups...

General Level To Do, as of Now...

****Side Quests:
		- tags need to appear within <Post> and go to their macro page upon being clicked
		- UserSettings to be it's own page ✅
			- maybe make profile options their own modals later...
		- for sections (UserLog, SocialLog) will give each independant stylesheet... ✅
		- for topics, need to address issue preventing page from opening... ✅
		- Upon deleting a post, clear 'scrollToView' from access global state var ✅
		- replace full page components opening and closing animations ✅
		- in <CreatePost> make sure info for current date is taken AT THE TIME the post is made 
			not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays
		- when clicked, section menuButton should close <MonthChart> if it's open

****Needed Additions
		- Specific Month + Year Selection in <MonthChart>
		- For mainNav bar, can choose any option at a time. Not sequential
		- in <userProfile> clicking on connection count shows list of all user's connections
				should be same for posts and subscriptions

****To be implemented with Invite Update
		- provide choice of privacy setting during sign up
			- let user know option can be changed
		- add admin account to user connections list on initial create user & their inviter

Optimization and code clean up
- Memoization, code splitting(?), reducing image uploads at backEnd


### 06. 29. 2024
@0945 Will work on some side quest points, will then reAssess what else needs to be done
			Can also begin designing out + planning referral codes for sign up + new sign up
			process...

@0940 markingRead func for notifications working within <InteractionsList>
			- need to clean up the code and css for this...
			- button options should be removed from a notif once it's marked read...

@0920 Add confirmation for removing connections in <ManageConnections>...
			could be future addition

### 06. 28. 2024
@0045 need to add 'remove' & 'request' to buttons in <manageConnections>

@1635 connectionRequest from profile works as expected :D !
			- all notifications need a button for marking read ...
			- also, some confusion with the usernames on the backEnd:
				sender recieved connection alert with their username instead of new connection

@1210 Gotta face the connectionRequest system 😭

@1205 Pretty much finished with <ManageConnections> css for now
			ought to reVerify that requestionConnection and removeConnection funcs still work...

@1000 gotta add state var for search input so it can be cleared when pressing 
clear button ✅

### 06. 27. 2024
@2230 CSS more or less complete for connections. 
 - Need to add same styling and functionality to searchResults ✅
 - have 'Clear' button be black only once searchBar has value
 - add functions to buttons (profile, remove) ✅

@1130 copy code from <ManageMacros> for connections and search results within 
	<ManageConnections>

### 06. 26. 2024
@1945 for <ManageConnections>, have headerText and main list change upon searchBar being active. Also add 'clear' button within searchBar ✅

### 06. 25. 2024
@2030 fixed issue with getting user's connections within <ManageSocial>
Will start working on CSS for this section now.
can test whether request connect button works within <UserProfile> now too

@2015 for sections (UserLog, SocialLog) will give each independant stylesheet...

### 06. 23. 2024
@1815 Working on ...
- Change header for comments to say 'replying to' or something else ✅
- For some reason, the options menu doesnt close after a successfully submitted comment
		in <Post>
- Need to confirm sending requests via profilePages works ✅
- profile options in <UserSettings> to be seperate modals
- scrollTo for:
	- clicking on username within <Log>
	- clicking on username within <Comments>

Then . . .
!!! Manage connections CSS ✅

****Side Quests:
		- for sections (UserLog, SocialLog) will give each independant stylesheet...
		- for topics, need to address issue preventing page from opening... ✅
		- Upon deleting a post, clear 'scrollToView' from access global state var ✅
		- replace full page components opening and closing animations
				1.) full page components have 'enter' animation by default
				2.) use useReducer toggle to add 'exit' class, adding 'leave' animation
				3.) animation speed of 0.2s - close component with setTimeout after 300ms
				4.) this animation should be toggleable by buttons for leaving page
		- in <CreatePost> make sure info for current date is taken AT THE TIME the post is made - not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays
		- set user.isPrivate setting to 'off' on initial create user
		- add admin account to user connections list on initial create user
		- tags need to appear within <Post> and go to their macro page upon being clicked
		- when clicked, section menuButton should close <MonthChart> if it's open

****Needed Additions
		- Specific Month + Year Selection in <MonthChart>
		- For mainNav bar, can choose any option at a time. Not sequential
		- in <userProfile> clicking on connection count shows list of all user's connections
				should be same for posts and subscriptions

Optimization and code clean up
- Memoization, code splitting(?), reducing image uploads at backEnd

Would like to update the section Navigation so that any options can be chosen at a time,
not just the next


### 06. 22. 2024
@1405 commentCount updating works acceptably now

@1340 Change header for comments to say 'replying to' or something else

@1315 have to update all post author fields upon username update as well... ✅

@0950 updates to a post's comment count are made everytime a comment is added. ✅
			Testing this now...

@0945 Upon deleting a post, clear 'scrollToView' from access global state var ✅
see 06. 07. 2024 for Side Quest tasks...

### 06. 21. 2024
@1230 Have to find different method for saving post comment amount
			all comments need to have joint indentifier, differentiate between a 
			top level comment and children

@0900 profile image within comments updates when user updates photo 

### 06. 20. 2024
@1535 Changed how comments are saved and sent on the backEnd

Things to Look into
	- For some reason, the options menu doesnt close after a successfully submitted comment
		in <Post> Will investigate that...
		A confirmation notif should pop up after as well
	- Need to confirm that changing profile pics spans across comments as well ✅
	- comment count is weird still...
	- need to work on commentCount route on backEnd...

!!! Still need to confirm sending requests via profilePages works and

!!! profile options in <UserSettings> to be seperate modals

### 06. 18. 2024
@1450 Working on getComments function...


### 06. 15. 2024
@1420 comment docs within posts not updating with profilePhoto change
			may have to change the way they're stored in there.

might have to cease saving them within posts,
			have frontEnd get comments upon loading
			will also have to create some way for nesting them properly on frontEnd...
			can make backEnd route for counting all comments with said post as parent

@1320 goToProfile button on <Log> also needs a place reminder 

!!! need to add css for seeing profilePhoto in a comment ✅
		- also needs place reminder

???Considering having posts within social log have a left aligned title

### 06. 12. 2024
@1735 Need to test 'connect' button on <UserProfile>

Next . . .
- For profilePictures on posts & comments - add profile pic to each doc / new field
		for userProfile pic. ✅
	???? when making post, how does post get user's profile picture added? ✅
	- store user profile pic within session storage :D

- userSettings to be it's own page
		- profile settings to be modal instead

Then . . .
!!! Manage connections CSS
		- apiaccess function for getting user connections not working. I'd made changes
			to the user subroutes.

Then, Side Quests.

Optimization and code clean up



@1245 instances of other user's username goes to their profile (in log)
			- also need to do <Post> as well
???? when making post, how does post get user's profile picture added?

### 06. 10. 2024
@2335 Last nights entry was actually around 10pm, not 11...
			removeAll now works for both pinnedMedia and pinnedPosts

Next...
- all instances of another user's username being link to their profile ✅
- add menu close button to user's view of another's profile ✅
- request connection button functionality ✅

!!! For profilePictures on posts & comments - add profile pic to each doc / new field
		for userProfile pic. 


### 06. 09. 2024
@2350 removing from user's pinned (both) now works!
			need to verify removeAll works for both posts and media

### 06. 07. 2024
@1205 user's pinnedMedia and pinnedPosts can now be seen / selected within <FullList>

TBD...
	- functions for removing entries from user's pinned ✅

After...
	- having 'connect' option work when viewing another person's profile ✅
	- all instances of another user's username being link to their profile ✅
	- attaching user's profilePhoto to post doc on backEnd ✅
	- userSettings to be it's own page
		- profile settings to be modal instead
	- log currently not working in bookmarks. Need to revert back to parent component
		feeding log data ✅
	!!! Manage connections CSS
		- apiaccess function for getting user connections not working. I'd made changes
			to the user subroutes.

****Side Quests:
		- for sections (UserLog, SocialLog) will give each independant stylesheet...
		- for topics, need to address issue preventing page from opening... ✅
		- Upon deleting a post, clear 'scrollToView' from access global state var ✅
		- replace full page components opening and closing animations
				1.) full page components have 'enter' animation by default
				2.) use useReducer toggle to add 'exit' class, adding 'leave' animation
				3.) animation speed of 0.2s - close component with setTimeout after 300ms
				4.) this animation should be toggleable by buttons for leaving page
		- in <CreatePost> make sure info for current date is taken AT THE TIME the post is made - not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays
		- set user.isPrivate setting to 'off' on initial create user
		- add admin account to user connections list on initial create user
		- tags need to appear within <Post> and go to their macro page upon being clicked


***!!!***
Begin reading up on memoization...
Code splitting ?

### 06. 06. 2024
@1445 added functionality for options / settings in <UserProfile>

TBD...
	- have <fullList> functional for removing posts and media from user's pins
		- include functions specifically for removing from user's own pinnedMedia
		  and pinnedPosts
		- make sure data sent to <fullList> is compatiable ✅
		- source can be 'user's username pinned .. whatever' ✅

@1345 
!!! Every instance of a username needs to be link to said user's profile
		- backEnd api should remove some of the unncessary fields when sending the user's data


### 06. 05. 2024
@2355 
TBD...
	- style pinnedPosts, add goToPost functionality within element ✅
	- plan rest of additions:
		- <fullList> for removing pinnedMedia, pinnedPosts and see all posts
		- options for account owner 
				- remove from pinnedMedia
				- remove from pinnedPosts
				- user settings
		- options for other users
			- connect 

!!! ought to plan functionality for blocking users...

@2240 Clicking on photo in pinnedMedia goes to <Post> 

!!! <InteractionsList> and <UserProfile> need fadeOut toggles for when leaving
		Im sure there are more...

@1150 pinnedMedia CSS done

TBD...
	- function to get post data, then navigate() to post ✅
	- get postData for pinned posts (could add postData to userData on backEnd. navigate func
		could be written inline, use postData within mapped element) ✅


### 05. 29. 2024
@1525 CSS and HTML more or less set up for <UserProfile>

****To Do Next:
		- add to pinnedMedia and pinnedPosts, add function to <UserProfile> page for getting
			postInfo for pinnedPosts, add elements and style
		- add large quotation marks to bio using before:: and after:: ✅

@1440 <UserSettings> should be it's own page...
			Forms for the profile functions should have their own modals

!!! websocket randomly disconnecting...


### 05. 27. 2024
@1645 Have to add userProfile data to location.state when going to <UserProfile>
			or find other way to have data loaded before render method

@1025 Need to fix issuw with <Log> data hydration. It's utilized in many places and it's probably
			best if it's parent component feeds it the logData

### 05. 25. 2024
@1230 
Concerning Getting User Profile Images per Post:
*Cons*:
	- an operation where the userProfle photo is updated for all of a user's posts could potentially
		have a high cost (a user with 1000 posts + many of these operations occuring at once)
*Pros*
	- where as a coOperation to get and add a profilePhoto for each post would have a limit: 32 posts
		per log operation ...

### 05. 24. 2024
@1355 Should modify the pinnedMedia content check to add the unique items and exclude duplicates.
			As of now, it simply discerns duplicates then fails the operation xD

****TO DO NEXT

<UserProfile>
	- can make a new page for a user's full log of posts utilizing <FullList> or similar design
		rectifies issue of user going to post from said list, but losing scroll position upon returning
		from post... a ui inconsistency
	- either add user.profilePhotos to each post,
		or get profilePhoto for each post during log creation on backend...

****Side Quests:
		- for topics, need to address issue preventing page from opening... ✅
		- Upon deleting a post, clear 'scrollToView' from access global state var
		- replace full page components opening and closing animations
				1.) full page components have 'enter' animation by default
				2.) use useReducer toggle to add 'exit' class, adding 'leave' animation
				3.) animation speed of 0.2s - close component with setTimeout after 300ms
		- in <CreatePost> make sure info for current date is taken AT THE TIME the post is made - not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays
		- set user.isPrivate setting to 'off' on initial create user
		- add admin account to user connections list on initial create user
		- tags need to appear within <Post> and go to their macro page upon being clicked



### 05. 23. 2024
@0305 Got the images to appear for pinnedMedia (:D )b
			- need to style them properly (add ternary class to span so that button is at top of image)✅
			- selecting one image currently selects all. Need to fix this also (fixed)✅
			- add functionality to buttons ✅

@0245 begun adding pinnedMedia to <Post>. ul isnt populating with images, however.
			need to adjust <log> to recieve data externally again (T-T )
			bookmarks not showing up (probably issues in other areas too)


### 05. 22. 2024
@0345 The issue with scrollTo not working on social section had to do with the <SectionsWrapper>
			defaulting to the userSection, and then changing.
			fix includes:
			- having current.section null by default, then setting it to 1 for user section on initialLogin
			- active state var in <SectionsWrapper> is also set to current.section by default

### 05. 21. 2024
@1645 the fix allows the app to load back into <Home>, but scrollTo isnt running

@1630 had an issue with the scrollTo function within <SocialLog>. Added fix where it wont
			run if Log has under 3 posts, but need to test to determine whether it fixes the issue.


### 05. 20. 2024
@1615 Next up, pinnedPosts and PinnedMedia...

@1500 Would be nice to have a confirmation option for <Instants>
			perhaps a base function which provides the confirmation prompt,
			then runs the intended function as a callback


### 05. 18. 2024
@1440 
To Do Next...
	- functionality for removeAll ✅
	- implement <Log> if mode is 'view'
	- fix issue with getting posts for tags ✅
	-	add exitButton for tags <Macros> page, make functional ✅
	- adding posts to user's pinnedPosts ✅
	- pinMedia option for <FullList> / pinMedia button in <Post> ✅
			- pinnedMedia to include link to corresponding post (url and post id) ✅
 
THEN...
<UserProfile>
...I may just have user's full log unravel within the <UserProfile> page...

****Side Quests:
		- for topics, need to address issue preventing page from opening...
			- issue with length variable
		- Upon deleting a post, clear 'scrollToView' from access global state var
		- replace full page components opening and closing animations
				1.) full page components have 'enter' animation by default
				2.) use useReducer toggle to add 'exit' class, adding 'leave' animation
				3.) animation speed of 0.2s - close component with setTimeout after 300ms
		- in <CreatePost> make sure info for current date is taken AT THE TIME the post is made - not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays
		- set user.isPrivate setting to 'off' on initial create user
		- add admin account to user connections list on initial create user



### 05. 17. 2024
@0130 
	- after removal in <FullList> remove selected items from dataList, empty out selected ✅
	- after closing <FullList>, update <Macros> page with new group.posts 
		use groupPosts api function to update posts, also update post amount ✅
	- remove 'users engaged' for bookmarks ✅
	- functionality for removeAll 
	- implement <Log> if mode is 'view'
 
@1235 need to adjust groups route for posts/removePost to accomdate multiple ids ✅


### 05. 16. 2024
@1555 
Might have to come up with new way of seeing user's entire log on their page,
as using <FullList> would require it still being up after user makes a post 
selection, which it wouldnt be.


### 05. 15. 2024
@2250 Menu added for <Macros>

@2225 Fixed an issue in <Macros>, where returning after viewing a post messes up page layout

??? is there a way to have page load at scrollTo, rather than scrolling to it?

@1515 skeleton created for <FullList>

****Next Tasks
		- have 'Remove Items' toggle opening of <FullList> ✅
		- css for <FullList> ✅
		- add menuBar & menu <Macros> page for collections ✅
		-	add exitButton for tags <Macros> page, make functional 
		- fix issue with getting posts for tags,
			issue at /backEnd/routes/groups.js:177
		- plan backend api functions for FullList, in <Instants>
			- removing items from collections ✅
			- adding posts to user's pinnedPosts
			- adding media to user's pinnedMedia
				- pinnedMedia to include link to corresponding post (url and post id)


### 05. 14. 2024
@2245 Need to test privacy concerning posts with privacyToggleable On and Half in <Macros>
			tags page

### 05. 13. 2024
@1625 I made a mistake saving this Notes file, as a few days worth of notes was missing 
			after a push. Fortunately, I was able to view an older version of it on the github
			website and restore some....


****To Do Next:
		- change option opening method so only one is open at a time ✅
		- subroute for getting userSetting details ✅
		- have Social option for Log route filter out isPrivate:true posts ✅
		- for now, have subroute option for tags filter out posts with privacyToggleable: On ✅

****Side Quests:
		- for topics, need to address issue preventing page from opening...
			- issue with length variable
		- Upon deleting a post, clear 'scrollToView' from access global state var
		- replace full page components opening and closing animations
				1.) full page components have 'enter' animation by default
				2.) use useReducer toggle to add 'exit' class, adding 'leave' animation
				3.) animation speed of 0.2s - close component with setTimeout after 300ms
		- in <CreatePost> make sure info for current date is taken AT THE TIME the post is made - not the date in the header. date info remains stagnant if page left up unrefreshed, thus yesterday's date is showing up rather than todays
		- set user.isPrivate setting to 'off' on initial create user
		- add admin account to user connections list on initial create user

Will need memoization for homepage...at some point

****Additions until 1.0A...
		- ManageConnections CSS 
		- User Profile
			- fullList
				- pinning posts and media
				- deleting posts from collections
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
		- No posts are public

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

