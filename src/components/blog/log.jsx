import * as React from 'react';
import {useNavigate} from 'react-router-dom';

/**
 * 09. 24. 2023
 * Component with creates list of post items from whatever blog / feed
 * Goes within wrapper element, so that logs throughout the site can
 * be distinguished
 */

export default function Log({userID, data, noHeading, current, setCurrent}) {

	let dateObserved, monthObserved;
	const navigate = useNavigate();
	let log = data;
	let id = sessionStorage.getItem('userID')

	function ifAnyPostsFromToday (posts) {
		let fromToday,
			today = new Date().getDate(),
			month = new Date().getMonth();

		for(let i = 0; i < posts.length; i++) {
			if(posts[i].postedOn_day == today && posts[i].postedOn_month == month) {
				fromToday = true;
				break;
			} else {
				fromToday = false;
			}
		}

		return fromToday;
	}

	function returnPostItem (post, index, userID) {

		let title = post.title,
			tags,
			id = post._id,
			owner = post.owner,
			author = post.author,
			content = post.content[0],
			text = [];

			if(post.tags) {
				tags = post.tags.length
			}

		/**
		 * post content is currently array, housing objects: only object
		 * being the text split into an object by letter :/
		 */
		for (let char in content) {
			text.push(content[char]);
		}
		text = text.join("");


		// } else {
		// 	for(let i = 0; i < post.content.length; i++) {
		// 		if(post.content[i].place == '0' || post.content[i].place % 1 == 0) {
		// 			content = post.content[i].content
		// 			// content = content.substring(0, 100) + '. . .';
		// 		}
		// 		break;
		// 	}
		// }

		let month, day, year, dateMatch;

		if(monthObserved != post.postedOn_month) {

			if(dateObserved != post.postedOn_day) {
				month = post.postedOn_month;
				day = post.postedOn_day;
				year = post.postedOn_year;
				dateMatch = false;
			}
		} else if(monthObserved == post.postedOn_month && dateObserved != post.postedOn_day) {
			month = post.postedOn_month;
			day = post.postedOn_day;
			year = post.postedOn_year;
			dateMatch = false;
		}

		dateObserved = post.postedOn_day;
		monthObserved = post.postedOn_month;
		// console.log(post.title+ " "+ month + "." + day + "." +year+ "---" +monthObserved+ "." +dateObserved);

		return (
			<div className="entry" key={id} onClick={()=> {
				
				setCurrent({
					...current,
					scrollTo: index + 1
				})

				setTimeout(()=> {
					navigate(`/post/${post._id}`, {
						state: {post: post}
					});
				}, 575)
			}}>
									
				{dateMatch == false  &&
					<span className="postDate">{month + 1} . {day} . {year}</span>
				}
				{(userID !== post.owner) &&  
					<span id="username">&#64;{post.author}</span>
				}
				
				<h2>{title}</h2>
				<p>{text}</p>

				<ul>
					<li>{tags} tags</li>
				</ul>
			</div>
		)
	}

	let logRef = React.useRef();
	let logRefC = logRef.current;
	let isMounted = React.useRef(false);

	/* 
		Tracks position of selected post to return to 
	    after viewing it in <Post>
	*/
	React.useEffect(()=> {
		if(isMounted.current) {
			let logRefC = logRef.current;

			if(current.scrollTo) {
				if(current.monthChart == true) {
					return;
				} else {
					let selected = logRefC.children[current.scrollTo];
					selected.scrollIntoView({behavior: "smooth"});
				}
			}	
		} else {
			if(log.length > 0) {
				isMounted.current = true
			}
		}
	}, [log])

	return (
		<div className={"log"} ref={logRef}>
			{((ifAnyPostsFromToday(log) !== true) && noHeading == false) &&
				<h2 className="noPostsToday">No Posts Today</h2>
			}
			{log.map((post, index) => returnPostItem(post, index, id))}
		</div>
	)

}