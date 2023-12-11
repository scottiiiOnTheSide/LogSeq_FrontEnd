import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import './blog.css';

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
			tags = 0,
			id = post._id,
			owner = post.owner,
			author = post.author,
			content = post.content[0].content,
			text = [],
			commentCount;

			if(post.tags) {
				tags = post.tags.length
			}

		let cmntcount = 0;
		let countComments = (comments) => {
			
			for(let cmnt of comments) {
				cmntcount++;
				countComments(cmnt.replies)
			}

			commentCount = cmntcount;
		}
		countComments(post.comments)

		let month, day, year, dateMatch;

		if(monthObserved != post.postedOn_month) {

			if(dateObserved != post.postedOn_day) {
				month = post.postedOn_month;
				day = post.postedOn_day;
				year = post.postedOn_year;
				dateMatch = false;
			}
		} 
		else if(monthObserved == post.postedOn_month && dateObserved != post.postedOn_day) {
			month = post.postedOn_month;
			day = post.postedOn_day;
			year = post.postedOn_year;
			dateMatch = false;
		}
		dateObserved = post.postedOn_day;
		monthObserved = post.postedOn_month;

		return (
			<>
				{dateMatch == false  &&
					<span className="postDate">{month + 1} . {day} . {year}</span>
				}
				<div className="entry" id={id} key={id} onClick={()=> {
					
					let thisEntry = document.getElementById(id);
					thisEntry.classList.add('shiftLeft');
					console.log(thisEntry);

					console.log(post)

					setCurrent({
						...current,
						scrollTo: index + 1
					})

					setTimeout(()=> {
						navigate(`/post/${post._id}`, {
							state: {post: post}
						});
					}, 600)
				}}>
					{(userID !== post.owner) &&  
						<span id="username">&#64;{post.author}</span>
					}	
					<h2>{title}</h2>
					<p>{content}</p>

					{post.content.some((data) => data.type == 'media') &&
						<ul id="thumbnailsWrapper">
							{post.content.filter(data => data.type == 'media').map(data => (
								<li>
									<img src={data.content} />
								</li>
							))

							}
						</ul>
					}
					

					<ul id="details">
						{tags > 0 &&
							<li>{tags} tags</li>
						}
						{commentCount > 0 &&
							<li>{commentCount} comments</li>
						}
					</ul>
				</div>
			</>
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