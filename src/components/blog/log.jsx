import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import APIaccess from '../../apiaccess';
import './blog.css';
const accessAPI = APIaccess(); 

/**
 * 09. 24. 2023
 * Component with creates list of post items from whatever blog / feed
 * Goes within wrapper element, so that logs throughout the site can
 * be distinguished
 */

export default function Log({section, noHeading, current, setCurrent, isUnified, updateLog, setUpdateLog}) {

	const navigate = useNavigate();
	const _id = sessionStorage.getItem('userID');
	const [data, setData] = React.useState([]);

	// function ifAnyPostsFromToday (posts) {
	// 	let fromToday,
	// 		today = new Date().getDate(),
	// 		month = new Date().getMonth();

	// 	for(let i = 0; i < posts.length; i++) {
	// 		if(posts[i].postedOn_day == today && posts[i].postedOn_month == month) {
	// 			fromToday = true;
	// 			break;
	// 		} else {
	// 			fromToday = false;
	// 		}
	// 	}

	// 	return fromToday;
	// }

	let getPosts = async() => {
		if(section == 'social') {

			let data = await accessAPI.pullSocialLog();
			setData(data);
		}
		else if(section == 'user') {

			let data = await accessAPI.pullUserLog();
			setData(data)
		}
	}



	let dateObserved, monthObserved;
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

		let rightAlign;
		if(isUnified == true && owner == _id) {
			rightAlign = true;
		}

		return (
			<>
				{dateMatch == false  &&
					<span className="postDate">{month + 1} . {day} . {year}</span>
				}
				<div className={`entry ${rightAlign == true ? 'right' : ''}`} id={id} key={post._id} onClick={()=> {
				
					console.log(post)

					setCurrent({
						...current,
						scrollTo: id
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
								<li key={data._id}>
									<img loading="lazy" src={data.content} />
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

		if(data.length) {
			console.log(data.length)
			if(current.scrollTo) {

				if(current.monthChart == true) {

					return;
				}
				else if(data.length < 3) {

					return;
				} 
				else {

					let post = Array.from(logRefC.children).filter(el => el.id == current.scrollTo);
					post = post.pop();
					post.scrollIntoView({behavior: "smooth"});
				}
			}			
		}
		// if(isMounted.current) {
		// if(logRefC) {
		// 	// let logRefC = logRef.current;
		// 	let post = Array.from(logRefC.children).filter(el => el.id == current.scrollTo);
		// 	post = post.pop()

		// 	if(current.scrollTo) {
		// 		console.log(post)

		// 		if(current.monthChart == true) {
		// 			return;
		// 		}
		// 		else {
		// 			// 
		// 			console.log(current.scrollTo)
		// 			let post = Array.from(logRefC.children).filter(el => el.id == current.scrollTo);
		// 			post = post.pop()
		// 			post.scrollIntoView({behavior: "smooth"});
		// 		// 	console.log(post[0]);
		// 		}
				// else if(post.length < 3) {
				// 	return;
				// } 
				// else if(post.length > 3){
				// 	// let post = Array.from(logRefC.children).filter(el => el.id == current.scrollTo);
				// 	post[0].scrollIntoView({behavior: "smooth"});
				// 	console.log(post[0]);
				// }
		// 	}	
		// } 

		// else {
		// 	if(data.length > 0) {
		// 		isMounted.current = true;
		// 		console.log(`isMounted now ${isMounted.current}`)
		// 	}
		// }
	}, [data])

	React.useEffect(()=> {
		getPosts();
	}, [])

	React.useEffect(()=> {
		getPosts();
	}, [updateLog])

	return (
		<div className={"log"} ref={logRef}>
			{/*{((ifAnyPostsFromToday(log) !== true) && noHeading == false) &&
				<h2 className="noPostsToday">No Posts Today</h2>
			}*/}
			{(data && data.length > 0) &&
				data.map((post, index) => returnPostItem(post, index, _id))
			}
		</div>
	)

}