let editBtns = document.querySelectorAll(".textAreaEdit");
let saveBtns = document.querySelectorAll(".textAreaSave");
let eDelBtns = document.querySelectorAll(".textAreaEDelete");
let tDelBtns = document.querySelectorAll(".textAreaTDelete");

let tatts = document.querySelectorAll(".textAreaTT");
let tahtmls = document.querySelectorAll(".textAreaHTML");

let sblinks = document.querySelectorAll(".sblink");
for(let i = 0; i < sblinks.length; i++)
	sblinks[i].addEventListener("click", function(){switchPage(sblinks[i].getAttribute("data-bref"))});

let hlinks = document.querySelectorAll(".hlink");
for(let i = 0; i < hlinks.length; i++)
	hlinks[i].addEventListener("click", function(){switchPage(hlinks[i].getAttribute("data-href"))});

for(let i = 0; i < editBtns.length; i++)
{
	editBtns[i].addEventListener("click", function(){editTA(getEID(editBtns[i].id))});
	saveBtns[i].addEventListener("click", function(){saveTA(getEID(saveBtns[i].id))});
	eDelBtns[i].addEventListener("click", function(){deleteElement(getEID(eDelBtns[i].id))});
	tDelBtns[i].addEventListener("click", function(){deleteElement(getEID(tDelBtns[i].id))});
}

// Switches the text area numbered ix to edit mode, hiding the plaintext and revealing the associated textile.
function editTA(ix)
{
	document.querySelector(`#tahtml-${ix}-0`).setAttribute("hidden", "");
	document.querySelector(`#tatt-${ix}-0`).removeAttribute("hidden");
}

// Saves the contents of the text area, updating the title and text areas from the HTML by running the user's input
// through textile and [[Square Bracket]] parsing.
function saveTA(ix)
{	
	document.querySelector(`#tatt-${ix}-0`).setAttribute("hidden", "");
	let tatt = document.querySelector(`#tatt-${ix}-1`);
	tatt.innerHTML = trimTags(tatt.innerHTML).replace(/^\s+|\s+$/g, ""); // trim whitespace too
	if(tatt.innerHTML === "")
		tatt.innerHTML = "This is a text area."; // Ensure text area not accidentally deleted.

	// Parse user inputted text through textile and [[Brackets]]
	let currHtml = document.querySelector(`#tahtml-${ix}-1`);
	currHtml.innerHTML = textilePlusSB(tatt.innerHTML);

	// Remove extraneous <br> tags from title.
	let title1 = document.querySelector(`#tahtml-${ix}-2`);
	let title2 = document.querySelector(`#tatt-${ix}-2`);
	title1.innerHTML = trimTags(title2.innerHTML);
	if(title1.innerHTML === "")
		title1.innerHTML = "Title";
	title2.innerHTML = title1.innerHTML;

	// Because we've re-assigned the value of the html field, we need to re-do our "hyperlink" buttons
	let hlinks = currHtml.querySelectorAll(".hlink");
	for(let i = 0; i < hlinks.length; i++)
		hlinks[i].addEventListener("click", function(){switchPage(hlinks[i].getAttribute("data-href"))});

	document.querySelector(`#tahtml-${ix}-0`).removeAttribute("hidden");
}

// Provides HTML from user edited text using textile, with additional [[Square-Bracket]] functionality
function textilePlusSB(str)
{
	return textile(str).replace(/\[\[[^\]]+\]\]/g, 
		function(x)
		{
			let ctx = cleanTags(x);
			let val = ctx.substring(2, ctx.length - 2);
			// return `<a href="${trimPunc(val)}.html" class="sblink">${val}</a>`;
			return `<a data-href="${trimPunc(val)}" class="hlink">${val}</a>`;
		}
	);
} // textilePlusSB()

// Trims all leading and trailing non-alphanumeric characters.
function trimPunc(str)
{
	return str.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/gm, "");
} // trimPunc()

// Delete all leading and trailing <br> and <div> tags.
function trimTags(str)
{
	return str.replace(/^(<br>|<\/br>|<div>|<\/div>|\s)+|(<br>|<\/br>|<div>|<\/div>|\s)+$/g, "");
} // trimTags()

// Delete everything in str which is contained within <angle brackets>
function cleanTags(str)
{
	return str.replace(/<[^>]*>/g, "");
} // cleanTags()

