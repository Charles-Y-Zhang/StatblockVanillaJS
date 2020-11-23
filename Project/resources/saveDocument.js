document.addEventListener("keydown", 
	function(e)
	{
		if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))
		{
		    e.preventDefault();
		    saveDoc()
		}
	}, false); // check for ctrl s

// Overrides the standard ctrl s behavior to do what we want instead
function saveDoc()
{
	const fileName = document.querySelector("#fileName").innerHTML;
	//const content = document.querySelector("#content").innerHTML;
	// let fullHTML = loadFile(title + ".html");
	let fullHTML = "<!DOCTYPE html>\n<html>\n\n" + document.querySelector("html").innerHTML + "\n\n</html>";
	//const contentRegex = /STARTCONTENT[\s\S]*ENDCONTENT/;
	//const newText = "STARTCONTENT -->\n\t<div id=\"content\">" + content + "\n\t</div>\n\t<!-- ENDCONTENT";
	//fullHTML = fullHTML.replace(contentRegex, newText);
	var blobHTML = new Blob([fullHTML], {type: "text/plain;charset=utf-8"});
    saveAs(blobHTML, fileName + ".html");
} // saveDoc()