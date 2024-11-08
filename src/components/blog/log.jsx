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

export default function Log({data, section, noHeading, current, setCurrent, isUnified, updateLog}) {

	const navigate = useNavigate();
	const _id = sessionStorage.getItem('userID');

	let goToProfile = async(userID) => {
		console.log(userID)
		let data = await accessAPI.getSingleUser(userID);
		
		let delay = setTimeout(()=> {
			navigate(`/user/${data.user.username}/${userID}`)
		}, 150)
	}

	let dateObserved, monthObserved;
	function returnPostItem (post, index, userID) {

		let title = post.title,
			tags = 0,
			id = post._id,
			owner = post.owner,
			author = post.author,
			content,
			text = [],
			commentCount;

			if(post.tags) {
				tags = post.tags.length
			}

			if(post.content.find(piece => piece.type == 'text')) {
				content = post.content.find(piece => piece.type == 'text').content
				// content = content.content
			} 

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
				<div className={`entry ${rightAlign == true ? 'right' : ''}`} id={id} key={post._id}>
					{(userID != post.owner) &&  
						<button className={`toProfile`} onClick={()=> {
							let UID = post.owner._id;
							console.log(UID)
							goToProfile(UID)
						}}>
							<img src={post.profilePhoto}/>
							<span>&#64;{post.author}</span>
						</button>
					}	

					<div className="textWrapper" onClick={(e)=> {
						e.preventDefault();
						console.log(post)

						setTimeout(()=> {
							navigate(`/post/${post._id}`, {
								state: {post: post}
							});
						}, 600)
					}}>
						<h2>{title}</h2>
						{content &&
							<p>{content}</p>
						}
						
						{post.content.some((data) => data.type == 'media') &&
							<ul id="thumbnailsWrapper" onClick={(e)=> {
								e.stopPropagation();

								let gallery = post.content.filter(data => data.type === 'media')
  									.map(data => ({
    									...data,   // Spread existing properties
    									postID: post._id 
  									}));

								setCurrent({
									...current,
									gallery: gallery
								})
							}}>
								{post.content.filter(data => data.type == 'media').map(data => (
									<li key={data._id}>
										<img loading="lazy" src={data.content} />
									</li>
								))}
							</ul>
						}
						
						<ul id="details">
							{tags > 0 &&
								<li>{tags} tags</li>
							}
							{post.commentCount > 0 &&
								<li>{post.commentCount} comments</li>
							}
							{post.taggedUsers.length > 0 &&
								<li>{post.taggedUsers.length} users tagged</li>
							}
						</ul>
					</div>
					
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

		if(data.length && logRefC) {
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


	return (
		<div className={"log"} ref={logRef}>
			{(data && data.length > 0) &&
				data.map((post, index) => returnPostItem(post, index, _id))
			}
		</div>
	)

}