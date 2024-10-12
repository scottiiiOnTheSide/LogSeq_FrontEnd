/* V I T A L S */
import * as React from 'react';
import {useNavigate, useLoaderData} from 'react-router-dom';
import APIaccess from '../../apiaccess';
import './home.css';

let accessAPI = APIaccess();

function Changelog({changelog, setChangelog, about, setAbout}) {

	const [exit, setExit] = React.useReducer(state => !state, false);

	return (
		<section id="CHANGELOG" className={`${exit == true ? '_exit' : ''}`}>

			<header>
				<h1>
					SS.XYZ<span>/Changelog</span>
				</h1>
			</header>

			<ul id="changes">
				<li className="change">
					
					<h3>version <span>1.0A</span></h3>
					<h2>Release of SyncSeq1.0A !</h2>

					<ul className={`details`}>
						
						<li>
							Features an initial collection of the most basic and necessary features a social platform
							should offer. These include

							<ul>
								<li>
									<b>Make posts</b> for the current time and date, previous or future date. Can also <b>create
									drafts</b> of posts for later
								</li>
							</ul>
						</li>
					</ul>

				</li>
			</ul>

			<div id="menuBar">
				<button className={`buttonDefault`} onClick={(e)=> {
					e.preventDefault();
					setExit()
					let delay = setTimeout(()=> {
						setChangelog();
						setAbout();	
					}, 300)}
				}>return</button>
			</div>
			
		</section>
	)
}

export default function AboutPage({}) {

	const navigate = useNavigate();
	const data = useLoaderData();
	const [changelog, setChangelog] = React.useReducer(state => !state, false);
	const [exit, setExit] = React.useReducer(state => !state, false);
	const [switcher, setSwitcher] = React.useReducer(state => !state, true);

	const switchSection = () => {
		console.log('here');
		let text = document.getElementById('text');
		let textOffset = text.offsetTop - 120;
		let stats = document.getElementById('stats');
		let statsOffset = stats.offsetTop + 60;
							
		if(switcher) {
			text.scrollIntoView({ behavior: 'smooth', block: 'start'});
			// window.scrollTo({
		    //   top: textOffset,
		    //   behavior: 'smooth' // Smooth scrolling effect
		    // });
			setSwitcher();
		}
		else {
			stats.scrollIntoView({ behavior: 'smooth',  block: 'end'});
			// window.scrollTo({
		    //   top: statsOffset,
		    //   behavior: 'smooth' // Smooth scrolling effect
		    // });
			setSwitcher();
		}
	}

	return (
		<>
			<section id="ABOUT" className={`${exit == true ? '_exit' : ''}`}>

				<header>
					<h1>
						SS.XYZ<span>/About</span>
					</h1>
				</header>

				<div id="mainBody">
					<ul id="stats">
						<li>
							<p>{data.userCount} <span>users</span></p>
						</li>
						<li>
							<p>{data.postCount} <span>posts made</span></p>
						</li>
						<li>
							<p>0 <span>Total interactions</span></p>
						</li>
					</ul>

					<div id="rhetoric">
						<h2>
							This is Social Media in it's Simplicity.
						</h2>
						<h3>
							No data collection. No algorithmic suggestions. No incentives for doomscrolling. Just the people you know & the necessary functions + some cool, extra ones
						</h3>

						<div id="text">
							<p>
							Originally, this begun as portfolio project. I aimed for it to have 'depth' and be comprehensive  - to mimic the scale of products that I imagined professional engineers would build. I learn best via implementation, and this endeavour would help me to understand more advance web development technologies. The more time I put into it, the more ideas I would have, and the more the project required to become a 'minimum viable product'. As of writing this, it has yet to be fleshed out into what I believe would be it's 'final form'
							</p>

							<p>
							Regardless of all the ideas and notions that I've had, one ideal remained intact - that it should be <b>a departure from the standards of social media today</b>.
							</p>
							
							<p>
							What would modern social media look like without all it's prime facets? The algorithms, the influencers, the advertisements, the bots and random accounts? From a development standpoint - this may not be as perilous a task one may think. Any developer worth their salt could do it. I believe there was once some consensus opinion that there isn't much incentive to do so. But from an exploratory and educational perspective, I would beg to differ.
							</p>
							
							<p>
							I'm personally curious in the experiment that is the growth of this app. Both in concerns to it's development and the audience that it attracts. Who may take to the simplicity of a manually curated feed? Might there be a demand for the minimalistic design and reduction of attention grabbing? Will this project grow to sustain itself one day?
							</p>							
							
							<p>
							My vision is that Syncseq becomes a platform utilized to extend real life. To catalogue the activities, events, situations and thoughts which define our lives. To map it out digitally across time (utilizing retroactive and proactive posting) and space (with the inclusion of location data). To do more in the vein of connecting with others across the internet - not just tapping like and being a silent observer.
							</p>
							<p className={`credit`}>
								<br/>
								J.C.E<br/>
								Lead Developer and Designer
							</p>
						</div>
					</div>
				</div>
					
				<ul id="options">

					<div id="switch" onClick={switchSection}>
						<svg 	className={`${switcher == true ? '' : 'flipped'}`}
								xml version="1.0"
								viewBox="109.21 220.42 140.874 69.937" 
								xmlns="http://www.w3.org/2000/svg"
								id="return">
						  		<polyline 
						  			id="top"
						  			points="249.644 250.369 109.21 250.393 159.165 220.42" 
						  			transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 1.4210854715202004e-14)"/>
						  		<polyline 
						  			id="bottom"
						  			points="250.084 260.408 109.65 260.384 159.605 290.357" 
						  			transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 1.4210854715202004e-14)"/>
						</svg>
					</div>
					<li>
						<button className={`buttonDefault`} onClick={()=> {
							setExit();
							let delay = setTimeout(()=> {
								navigate(-1)	
							}, 300)}}>Return</button>
					</li>
					<li>						
						<button className={`buttonDefault`} onClick={(e)=> {
							e.preventDefault();
							setExit()
							let delay = setTimeout(()=> {
								setChangelog();	
							}, 300)}
							
						}>See Changelog</button>
					</li>
				</ul>		
			</section>

			{changelog &&
				<Changelog 
					changelog={changelog}
					setChangelog={setChangelog}
					about={exit}
					setAbout={setExit}/>
				}
		</>
	)
}