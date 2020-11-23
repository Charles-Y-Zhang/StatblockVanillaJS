let initialRVs = document.querySelectorAll(".rvButton");
for(let i = 0; i < initialRVs.length; i++)
{
	initialRVs[i].addEventListener("click", function(){switchPage(initialRVs[i].id.substring(3))});
}

let nbdd = document.querySelector("#nbDropdownMenu");
document.querySelector("#nbDropdownBtn").addEventListener("click", function(){toggleHidden(nbdd)});

let tagsMenu = document.querySelector("#tagsMenu");
document.querySelector("#ddMenuTags").addEventListener("click", function(){toggleHidden(tagsMenu); toggleHidden(nbdd);});
document.querySelector("#tagsMenuX").addEventListener("click", function(){toggleHidden(tagsMenu);});

let advancedSearchMenu = document.querySelector("#advancedSearchMenu");
document.querySelector("#ddMenuAdvancedSearch").addEventListener("click", function(){toggleHidden(advancedSearchMenu); toggleHidden(nbdd);});
document.querySelector("#advancedSearchMenuX").addEventListener("click", function(){toggleHidden(advancedSearchMenu);});

document.query

let articlesDOM = document.querySelector("#articles");
let tmText = document.querySelector("#tagsMenuText");

document.querySelector("#tagsMenuSave").addEventListener("click", function(){saveTags()});

let newTitle = document.URL.replace(RegExp(".*/"), "").replace(".html", "");
document.querySelector("#fileName").innerHTML = newTitle;

// Updates the tags list whenever the page is switched
function updateTags()
{
	// first binary search
	let searchInput = document.querySelector("#currPage").innerHTML;
	let low = 0;
	let	high = articles.length - 1;
	let	done = false;
	let mid;
	while(high !== low)
	{
		mid = Math.floor((low + high)/2);
		if(articles[mid][0].toLowerCase().localeCompare(searchInput.toLowerCase()) >= 0)
			high = mid;
		else
			low = mid + 1;
	} // at the end of this loop, low should be the index of our page on the articles list
	if(articles[low].length == 1)
	{
		tmText.innerHTML = "";
		return;
	}
	let res = articles[low][1];
	for(let i = 2; i < articles[low].length; i++)
	{
		res = res + ", " + articles[low][i];
	}
	tmText.innerHTML = res;
} // updateTags()

// Saves the current contents of the tagsMenu into the DOM and updates the articles datastructure
function saveTags()
{
	let cp = document.querySelector("#currPage").innerHTML;
	let rcp = regExCape(cp); // Escape the current page name so we can search for it as a regex
	// (\\^\\^|^) ensures cp is the page title and not being used as a tag
	// [^\\^](?!\\^\\^) is any non ^ character which is also not followed by ^^ delimiter
	// \\^(?!\\^) is ^, followed by another ^ (this matters so the regex will work on pages with no tags)
	// .? is there to fill in the last character before ^^ delimiter, since the previous part intentionally avoids it
	// .*$ only happens if the previous part found no matches, which should only occur if cp is the last page in our list
	let reg = RegExp("(\\^\\^|^)" + rcp + "(([^\\^](?!\\^\\^)|\\^(?!\\^))*.?\\^\\^|.*$)", "i");
	articlesDOM.innerHTML = articlesDOM.innerHTML.replace(reg, function(x)
		{
			let cp = document.querySelector("#currPage").innerHTML;
			if(noTags(tmText.innerHTML))
			{
				if(x.substring(x.length - 2, x.length) == "^^")
					return x.replace(RegExp(rcp + ".*", "i"), titleCase(cp) + "^^");
				return x.replace(RegExp(rcp + ".*", "i"), titleCase(cp));
			} // tag removal
			else // we got tags!
			{
				if(x.substring(x.length - 2, x.length) == "^^")
					return x.replace(RegExp(rcp + ".*", "i"), titleCase(cp) + ", " + sanitizeTags(tmText.innerHTML) + "^^");
				return x.replace(RegExp(rcp + ".*", "i"), titleCase(cp) + ", " + sanitizeTags(tmText.innerHTML));
			}
		} // nested function
	); // HTML reassignment
	initArticles();
} // saveTags()

// Sanitizing the contents of arg so nothing will break horribly
function sanitizeTags(arg)
{
	let res = arg.replace(/\^\^+/g, ""); // remove accidental delimiters first
	res = res.replace(/\s/g, " "); // turn all whitespace into spaces
	res = res.replace(/(,\s*)+/g, ", "); // replace groups of commas with only whitespace in between them into single commas
	res = res.replace(/\s*,\s*/g, ", "); // replaces commas and surrounding whitespace with the correct pre-established delimiter
	return trimTags(res.trim());
} // sanitizeTags()

// Checks if arg has any valid tags or if it is empty
function noTags(arg)
{
	let sanitized = sanitizeTags(arg);
	if(trimTags(sanitized.replace(/,|\^\^|<br>/g, "").trim()) == "")
		return true;
	return false;
} // noTags

let delPageDOM = document.querySelector("#deleteThisPage");
document.querySelector("#ddMenuDelPage").addEventListener("click", function(){toggleHidden(delPageDOM); toggleHidden(nbdd);});
document.querySelector("#delPageCancel").addEventListener("click", function(){toggleHidden(delPageDOM)});
document.querySelector("#delPageConfirm").addEventListener("click", function(){deletePage(document.querySelector("#currPage").innerHTML)});

// Deletes the page with title "title" permanently
function deletePage(title)
{
	toggleHidden(delPageDOM);
	if(document.querySelector("#recentlyVisited").getAttribute("data-count") == "1") // if this is the only page
		return; // Do nothing

	// Remove entry from articlelist
	let rcp = regExCape(title); // Escape the current page name so we can search for it as a regex
	// (\\^\\^|^) ensures cp is the page title and not being used as a tag
	// [^\\^](?!\\^\\^) is any non ^ character which is also not followed by ^^ delimiter
	// \\^(?!\\^) is ^, followed by another ^ (this matters so the regex will work on pages with no tags)
	// .? is there to fill in the last character before ^^ delimiter, since the previous part intentionally avoids it
	// .*$ only happens if the previous part found no matches, which should only occur if cp is the last page in our list
	let reg = RegExp("(\\^\\^|^)" + rcp + "(([^\\^](?!\\^\\^)|\\^(?!\\^))*.?\\^\\^|.*$)", "i");
	articlesDOM.innerHTML = articlesDOM.innerHTML.replace(reg, function(x)
		{
			if(x.substring(x.length - 2, x.length) == "^^")
				return x.replace(RegExp(rcp + ".*", "i"), ""); // leave only the starting ^^ if there exists one
			return ""; // This is the last entry, delete the leading ^^
		} // nested function
	); // HTML reassignment
	initArticles();

	switchPage(document.querySelector("#recentlyVisited").children[1].innerHTML);
	let pageDOM = document.querySelector("#" + pageId(title));
	pageDOM.parentNode.removeChild(pageDOM); // delete the actual page element
	let delRV = document.querySelector("#rv-" + pageId(title));
	delRV.parentNode.removeChild(delRV); // delete the recently visited entry
} // deletePage()