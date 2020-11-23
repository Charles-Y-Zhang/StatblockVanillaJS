// Given an id from a DOM node, get the Element ID of the associated element
// All relevant DOM node IDs follow the format eletype-eid-section
// Or sometimes simply eletype-eid when appropriate
function getEID(str)
{
	return str.match(/-.*-|-.*$/)[0].replace(/-/g, "");
} // getEID()

// Deletes the element associated with eid.
function deleteElement(eid)
{
	let element = document.querySelector("#element-" + eid);
	element.parentNode.removeChild(element);
} // deleteElement()

// Makes a page named title, copying the contents of the page named copyMe if copyMe is not the empty string
function makePage(title, copyMe)
{
	let pageName = pageId(title);

	if(document.querySelector("#" + pageName)) // page already exists
		return;

	let articles = document.querySelector("#articles");
	if(articles.innerHTML == "") // article list empty
		articles.innerHTML = titleCase(title);
	else // append instead
		insertArticle(titleCase(title));

	let content = document.querySelector("#content");
	content.insertAdjacentHTML("beforeend", `\n\n<div id="${pageName}" hidden>\n</div>\n`)
} // makePage()

// Switches the current page to the article named title
function switchPage(title)
{
	document.querySelector("title").innerHTML = titleCase(title);
	title = title.toLowerCase();
	let currPageTitle = document.querySelector("#currPage").innerHTML;
	let currPage = document.querySelector("#" + pageId(currPageTitle));
	let pageName = pageId(title);
	if(!document.querySelector("#" + pageName)) // If page does not exist
		makePage(title, "");
	let newPage = document.querySelector("#" + pageName);
	let recentlyVisited = document.querySelector("#recentlyVisited");
	if(currPage != pageName) // going to the same page means we should do nothing
	{
		if(document.querySelector("#rv-" + pageName)) // if the target page is already in the RV list
		{	// Simply move it to the beginning, don't need to re-assign any event listeners
			recentlyVisited.insertAdjacentElement("afterbegin", recentlyVisited.removeChild(document.querySelector("#rv-" + pageName)));
		}
		else // not on the RV list yet
		{
			if(recentlyVisited.getAttribute("data-count") > 14)
				recentlyVisited.removeChild(recentlyVisited.lastChild);
			recentlyVisited.insertAdjacentHTML("afterbegin", `<button id="rv-${pageName}" class="rvButton" title="${titleCase(title)}">${titleCase(title)}</button>`)
			document.querySelector("#rv-" + pageName).addEventListener("click", function(){switchPage(title)});
		}
		currPage.setAttribute("hidden", "");
		newPage.removeAttribute("hidden");
		document.querySelector("#currPage").innerHTML = title;
		updateTags();
	} // diff page check
} // switchPage()

// Returns the id of a page, given its title (invalid characters replaced by underscore)
function pageId(title)
{
	let val = title.replace(/[^a-zA-Z0-9_-]/gi, "_");
	val.toLowerCase();
	return val;
} // pageId()

// Sets element to be hidden if it is not hidden and vice versa.
function toggleHidden(element)
{
	if(element.hasAttribute("hidden"))
		element.removeAttribute("hidden");
	else
		element.setAttribute("hidden", "");
} // toggleHidden()

// Capitalizes the first letter of each word
function titleCase(title)
{
	return title.replace(/^[a-z]|[-_ ][a-z]/g, 
		function(x)
		{
			return x.toUpperCase();
		}
	); // return
} // titleCase()

// Truncates text after charCount of characters, finishing with ellipses
// so it turns out you can just do this with css oops
function ellipses(text, charCount)
{
	if(text.length > charCount)
		return text.substring(0, charCount) + "...";
	return text;
} // ellipses

// Escapes user inputed string s so that we can use it as part of a regex search without breaking
// everything horribly
function regExCape(s)
{
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}


// Loades a file specified by filePath
// Returns the contents of the file as plaintext
/* function loadFile(filePath) 
{
	let xhr = new XMLHttpRequest();
	xhr.overrideMimeType("text/plain");
	xhr.open("GET", filePath, false);
	xhr.send();
	return xhr.responseText;
} // loadFile() */