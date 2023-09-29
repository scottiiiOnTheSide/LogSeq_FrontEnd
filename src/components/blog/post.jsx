/* * * V I T A L S * * */
import * as React from 'react';
import {useParams, useLocation} from 'react-router-dom';
import Calendar from '../calendar'
import APIaccess from '../../apiaccess';
import bodyParse from '../bodyParse';
import './blog.css';


/* * * C O M P O N E N T S * * */
import Header from '../../components/home/header';

const accessAPI = APIaccess(); 

// export async function loader({params}) {
// 	let post = await accessAPI.getBlogPost(params.postID);
// 	return {post};
// }


export default function Post({}) {

	/**
	 * Discerns source of blog post data and uses it
	 */

	let cal = Calendar();
	let { postID } = useParams();
	let	location = useLocation();
	let post;
	let getPost = async() => {
			post = await accessAPI.getBlogPost(postID);
		}
	let statePost = location.state.post;

	if(!statePost) {

		getPost();

	} else {

		post = statePost;
	}

	let dateInfo = new Date(post.createdAt.slice(0, -1));
	let date = dateInfo.toString().slice(4, 15);
	let hour = dateInfo.toString().slice(16, 18);
	let minute = dateInfo.toString().slice(19, 21);
	let AoP;
	if(hour > 12) {
		AoP = 'pm';
		hour = hour - 12;
	} else {
		AoP = 'am';
	}
	let timeStamp = hour+ ":" +minute+ " " +AoP;

	let user = sessionStorage.getItem('userID');
	let isOwner = post.owner == user ? true : false;

	/**
	 * postTitle
	 * post.tags.map((tag) => <li key={tag}>{tag}</li>)
	 * post._id
	 * post.owner
	 * post.content.map
	 */

	//to be removed once old posts gone
	let content, split;
	let text = [];
	if( Object.keys(post.content[0]).length > 10 ) {

		for (let char in post.content[0]) {
			text.push(post.content[0][char]);
		}
		text = text.join("");
		split = true;
		// console.log(text)
	} else if ( Object.keys(post.content[0].length < 10)) {
		content = post.content;
		split = false;
	}

	let [toggleDetails, openDetails] = React.useReducer(state => !state, false)

	return (
		<section id="POST">
			<Header cal={cal} isPost={true} />

			<article>

				<button id="open" onClick={openDetails}>Post Details</button>
				<div id="details" className={toggleDetails ? "open" : ""}>

					<h4>Entry Posted On</h4>
					<p>{date} @ {timeStamp} UTC</p>

					<ul id="options">
						{isOwner &&
							<li>
								<button>EDIT</button>
							</li>
						}
						{isOwner &&
							<li>
								<button>DELETE</button>
							</li>
						}
						{!isOwner &&
							<li>
								<button>REPORT</button>
							</li>
						}

					</ul>
				</div>

				<div id="mainContent">

					{!isOwner &&
						<h4>{post.author}</h4>
					}	
					<h2>{post.title}</h2>

					{/*Would have ul with map of tagged users*/}

					{split &&
						<p>{text}</p>
					}
					{!split &&
						content.map((data) => {
								if(data.type == 'text') {
									if(data.content.match(/\((.*?)\)/g)) {
										return (<p dangerouslySetInnerHTML={{ __html: bodyParse(data.content)}} key={data.place}></p>)
									} else {
										return (<p dangerouslySetInnerHTML={{ __html: data.content}} key={data.place}></p>)
									}
								} else if(data.type == 'media') {
									return <img src={data.content}/>
								}
							}
						)
					}

					{/*Here would be a div wrapper for the tags*/}

					{/*Comment box*/}

				</div>
				<div id="commentsWrapper"></div>
				
			</article>
			
		</section>
	)

}