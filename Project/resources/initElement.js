// Given the string eleType specifying the type of the element to initialize and the new element's eid, 
// performs the required initializations. For custom element types which require initialization steps
// such as event listeners, it is recommended to add those here under a new switch block.
function initElement(eleType, eid)
{
	switch(eleType)
	{
		case "textArea":
			document.querySelector("#tae-" + eid).addEventListener("click", function(){editTA(eid)});
			document.querySelector("#tas-" + eid).addEventListener("click", function(){saveTA(eid)});
			document.querySelector("#tad-" + eid + "-0").addEventListener("click", function(){deleteElement(eid)});
			document.querySelector("#tad-" + eid + "-1").addEventListener("click", function(){deleteElement(eid)});
		default:
			// do nothing
	}
}