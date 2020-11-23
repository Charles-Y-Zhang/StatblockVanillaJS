let acb = document.querySelector("#acb");
let acbWrapper = document.querySelector("#acbw")
let acMenu = document.querySelector("#acMenu");
let acSelect = document.querySelector("#acSelect");

acb.addEventListener("click", function(){addClementBegin()});

let acCancel = document.querySelector("#acCancel");
acCancel.addEventListener("click", function(){cancelAC()});

let acAccept = document.querySelector("#acAccept");
acAccept.addEventListener("click", function(){acceptAC()});

// Displays the choose element menu, hides the add content button
function addClementBegin()
{
	acbw.setAttribute("hidden", "");
	acMenu.removeAttribute("hidden");
}

// Hides the choose element menu, reveals add content button.
function cancelAC()
{
	acMenu.setAttribute("hidden", "");
	acbw.removeAttribute("hidden");
}

// Creates the selected element and returns the element adder to its original state.
function acceptAC()
{
	let eleText = document.querySelector("#" + acSelect.value + "Template").innerHTML;
	let eleCount = document.querySelector("#elementCount");
	eleText = eleText.replace(/{eid}/g, eleCount.innerHTML);
	//eleText = eleText + "\n <!-- ContentPH -->";
	let content = document.querySelector("#" + pageId(document.querySelector("#currPage").innerHTML));
	// content.innerHTML = content.innerHTML.replace("<!-- ContentPH -->", eleText); // breaks event listeners
	content.insertAdjacentHTML("beforeend", eleText);
	initElement(acSelect.value, eleCount.innerHTML);
	acMenu.setAttribute("hidden", "");
	acbw.removeAttribute("hidden");
	eleCount.innerHTML = parseInt(eleCount.innerHTML, 10) + 1;
}