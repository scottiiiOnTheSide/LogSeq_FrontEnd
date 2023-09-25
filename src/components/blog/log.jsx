import * as React from 'react';

/**
 * 09. 24. 2023
 * Component with creates list of post items from whatever blog / feed
 * Goes within wrapper element, so that logs throughout the site can
 * be distinguished
 */

//checks whether any posts have been made today




export default function Log({userID, data}) {

	let dateObserved, monthObserved;

	function ifAnyPostsFromToday (posts) {
		let fromToday,
			today = new Date().getDate();

		for(let i = 0; i < posts.length; i++) {
			if(posts[i].postedOn_day == today) {
				fromToday = true;
				break;
			} else {
				fromToday = false;
			}
		}

		return fromToday;
	}

	function returnPostItem (post, userID) {

		let title = post.title,
			tags = post.tags.length,
			id = post._id,
			owner = post.owner,
			author = post.author,
			content = post.content[0],
			text = [];

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
		}

		dateObserved = post.postedOn_day;
		monthObserved = post.postedOn_month;

		return (
			<div className="entry" key={id} onClick={() => {console.log(post.content.length)}}>
									
				{(dateMatch == false) &&
					<span className="postDate">{month + 1} . {day} . {year}</span>
				}
				{(userID !== post.owner) &&  
					<span id="username">&#64;{post.author}</span>
				}
				
				<h2>{title}</h2>
				{/*<p dangerouslySetInnerHTML={{ __html: content }}></p> */}
				<p>{text}</p>

				<ul>
					<li>{tags} tags</li>
				</ul>
			</div>
		)
	}

	let log = data;
	let id = userID;

	return (
		<div className={"log"}>
			{(ifAnyPostsFromToday(data) !== true) &&
				<h2 className="noPostsToday">No Posts Today</h2>
			}
			{log.map(post => returnPostItem(post, id))}
		</div>
	)

}