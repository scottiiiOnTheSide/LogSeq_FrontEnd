
export default function bodyParse(string) {
	let text = string;
	let markupSet = text.match(/\((.*?)\)/g);
	let splitText = text.replace(/\((.*?)\)/g, '_').split('_');

	let spanArray = [];
	let elementArray = [];
	let newset = markupSet.map((element, index) => {
	    if(element.includes('b') || element.includes('i')) {
	      // let thing = element.replace(/\((.*?)\)/g, (_, match) => `<${match}>`);
	      // return thing;
	      elementArray.push(element);
	      return 0;
	    }
	    else if (element.includes('nl')) {
	      let thing = element.replace(/\((.*?)\)/g, (_, match) => `<br>`);
	      return thing;
	    }
	    else if(element.includes('u')) {
	      spanArray.push(element);
	      return 1;
	    }
	    else if(element.includes('color')) {
	      spanArray.push(element)
	      return 1;
	    }
	});
	// console.log(newset)

	elementArray = elementArray.map((element, index) => {
		if(index % 2 == 0) {
			let thing = element.replace(/\((.*?)\)/g, (_, match) => `<${match}>`);
			return thing;
		} else {
			let thing = element.replace(/\((.*?)\)/g, (_, match) => `</${match}>`);
			return thing;
		}
	})
	// console.log(elementArray);

	spanArray = spanArray.map((element, index) => {
	  if(index % 2 == 0) {
	      let thing = element.replace(/\((.*?)\)/g, (_, match) => `<span data-code="${match}">`);
	      return thing;
	    } else {
	      let thing = element.replace(/\((.*?)\)/g, (_, match) => `</span>`);
	      return thing;
	    }
	});

	let iter = 0;
	let iterE = 0;
	let newsetTwo = newset.map((element, index) => {
	  if (element == 0){
		let i = iterE;
		iterE++;
		return elementArray[i];
	  } else if (element == 1){
	    let i = iter;
	    iter++;
	    return spanArray[i];
	  } else if(element !== 0 && element !== 1) {
	    return element;
	  }
	});
	// console.log(newsetTwo);

	let iter2 = 0;
	let setText = splitText.map((element, index) => {
	  if(index % 2 !== 0) {
	    let i = iter2;
	    ++iter2;
	    let newText = newsetTwo[i] + element + newsetTwo[iter2];
	    ++iter2;
	    
	    return newText;
	  }
	  else {
	    return element;
	  }
	});

	let replace = String(setText.pop()).replace(/undefined/g, '');
	setText.push(replace);
	let newText = setText.join('');
	return newText;
}