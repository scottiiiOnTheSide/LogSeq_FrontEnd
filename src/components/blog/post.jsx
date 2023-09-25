
import * as React from 'react';
import {useLoaderData, useLocation} from 'react-router-dom';
import APIaccess from '../../apiaccess';

import Header from '../../components/home/header';

const accessAPI = APIaccess(); 

export async function loader({params}) {

	let post = await accessAPI.getBlogPost(params.postID);
	return {post};
}


export default function Post({}) {

	let location = useLocation(),
		{aPost} = useLoaderData(),
		post;

	if(location.state.post) {
		post = location.state.post;
	} else {
		post = aPost;
	}


	return (
		<div>
			
		</div>
	)

}