import * as React from 'react';
import APIaccess from '../../apiaccess';
import {useNavigate} from 'react-router-dom';

let accessAPI = APIaccess();


/*
	05. 15. 2024
	Displays entire list of data for viewing or editing

	modes:
		view,
		delete,
		pinMedia

	source: name of whatever data is from (a user's posts, a collection)
*/


export default function FullList({ data, mode, source, setSocketMessage }) {

	/* add 'selected' to data items, then add to dataList */
	const [dataList, setDataList] = React.useState([]);
	const [selection, setSelection] = React.useState([]);

	return (
		<div id="fullList">
			
			<h2>
				{mode == 'view' &&
					Viewing
				}
				{mode == 'delete' &&
					Deleting
				}
				{mode == 'pinMedia' &&
					Pinning From
				}
				<span>{source}</span>
			</h2>


			<ul id="dataList">
				{mode == 'pinMedia' || mode == 'delete' &&
					dataList.map((entry, index) => (
						<li>
							<button>
								<span className={`bullet ${entry.selected == true ? 'selected' : ''}`}>
								</span>

								{mode == 'pinMedia' &&
									<img src={entry.imageURL}/>
								}
								{mode == 'delete' &&
									<p>{entry.title}</p>
								}
							</button>	
						</li>
					))
				}
				{mode == 'view' &&
					dataList.map(entry => (
						<li>
							<h3>{entry.title}</h3>
							<p>{entry.excerpt}</p>

							{entry.images.length > 0 &&
								<ul className='images'>
									{entry.images.map(img => (
										<li>
											<img src={img}/>
										</li>
									))}
								</ul>
							}
						<li>
					))
				}
			</ul>


			{mode == 'view' &&
				<button>Exit</button>
			}

			{mode == 'delete' &&
				<ul class="optionsMenu" id="deleteMenu">
				
					<li>
						<button>Delete {selection.length}</button>
					</li>
					<li>
						<button>Delete All</button>
					</li>
					<li>
						<button>Exit</button>
					</li>
				</ul>
			}
			{mode == 'pinMedia' &&
				<ul class="optionsMenu" id="deleteMenu">
				
					<li>
						<button>Pinning {selection.length}</button>
					</li>
					<li>
						<button>Pin All</button>
					</li>
					<li>
						<button>Exit</button>
					</li>
				</ul>
			}
			

		</div>
	)
}