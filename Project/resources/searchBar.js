let searchInput;

const searchBox = document.querySelector("#searchBox");
const searchResults = document.querySelector("#searchResults")

let searchLen = 0;

// Begin loading information for search bar
let articles;
initArticles();

// Add click in/click away functionality to the search bar
document.querySelector("#searchBarForm").addEventListener("click", function(){searchUpdate()});
document.querySelector("#content").addEventListener("click", function(){searchResults.setAttribute("hidden", ""); searchResults.innerHTML = "";});

// Initializes articles list, run again any time an article is added or tags are updated
function initArticles()
{
	articles = document.querySelector("#articles").innerHTML.split("^^");
	for(let i = 0; i < articles.length; i++)
		articles[i] = articles[i].split(", ");
} // initArticles()

let low, high, done, mid, numRes, searchHTML;
function searchUpdate()
{
	searchInput = searchBox.value;
	if(searchInput.length === 0)
	{
		searchResults.setAttribute("hidden", ""); // Hide the results
		searchResults.innerHTML = "";
	}
	else // We have a search term
	{ 	 // BinarySearch the first term which matches and display up to ten
		searchResults.removeAttribute("hidden");
		low = 0;
		high = articles.length - 1;
		done = false;
		//mid;
		while(high !== low)
		{
			mid = Math.floor((low + high)/2);
			if(articles[mid][0].toLowerCase().localeCompare(searchInput.toLowerCase()) >= 0)
				high = mid;
			else
				low = mid + 1;
		}
		if(!articles[low][0].toLowerCase().startsWith(searchInput.toLowerCase())) // No match found
		{
			searchResults.innerHTML = "<button class=\"searchRes\">No results found.</button>";
		}
		else // we have a match
		{
			//console.log("Match!")
			numRes = Math.min(10, articles.length-low);
			searchHTML = "";
			for(let i = low; i < low + numRes; i++)
			{
				if(articles[i][0].toLowerCase().startsWith(searchInput.toLowerCase()))
					searchHTML = `${searchHTML}\n<button class="searchRes" id="sr-${pageId(articles[i][0])}">${articles[i][0]}</button>`;
				else
					break;
			}
			searchResults.innerHTML = searchHTML;
			for(let i = low; i < low + numRes; i++)
			{
				if(articles[i][0].toLowerCase().startsWith(searchInput.toLowerCase()))
					document.querySelector(`#sr-${pageId(articles[i][0])}`).addEventListener("click", function(){switchPage(articles[i][0])});
				else
					break;
			}
					
		}
	}
} // searchUpdate()


// Inserts a new article into the article list named newArticle, updates the articles DS.
function insertArticle(newArticle)
{
	low = 0;
	high = articles.length - 1;
	done = false;
	while(high !== low)
	{
		mid = Math.floor((low + high)/2);
		if(articles[mid][0].toLowerCase().localeCompare(newArticle.toLowerCase()) >= 0)
			high = mid;
		else
			low = mid + 1;
	}
	let articleDOM = document.querySelector("#articles");
	articleDOM.innerHTML = articleDOM.innerHTML.replace(articles[low][0], newArticle + "^^" + articles[low][0]);

	// Update articles datastructure
	initArticles();
} // articlesUpdate()