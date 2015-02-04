/*
 * TAO REQUEST LAY DU LIEU RSS TU VNEXPRESS VE DE HIEN THI VAO LISTVIEW 
 */
var url = "http://vnexpress.net/rss/tin-moi-nhat.rss";
var method = "GET";
var timeout = 10000;


//create request
var xhr = Ti.Network.createHTTPClient();

//set time out
xhr.timeout = timeout;

//set action on load success
xhr.onload = function(){
	//console.log("Response text: " + this.responseText);
	var xml = this.responseXML.documentElement;
	console.log("XML parsed");
	addXmlItemToListView(xml);
	
};

//set action on load error
xhr.error = function(){
	alert("Lỗi: Không load được data");
	console.log("status: " + this.status);
	console.log("Status text: " + this.statusText);
	console.log("Response text: " + this.responseText);
};




function addXmlItemToListView(xmlObject){
	var xml = xmlObject;
	var items = xml.getElementsByTagName("item");
	var listData = [];
	
	$.listViewTinTuc.sections[0].setItems(listData);
	console.log("item count: " + items.length);
	
	for (var i=0; i < items.length; i++) {
	
		var tintuc = [];
	
		
		tintuc["title"] = items.item(i).getElementsByTagName("title").item(0).getTextContent();
		tintuc["description"] = items.item(i).getElementsByTagName("description").item(0).getTextContent();
		
		//get image
		var data = tintuc["description"].match(/src="([^\"]*)"/gim);
		tintuc["image"] = data[0].replace(/src=|"/gim, "");
		
		//remove html tag in content
		tintuc["description"] = tintuc["description"].replace(/(<([^>]+)>)/ig,"");
		
		tintuc["time"] = items.item(i).getElementsByTagName("pubDate").item(0).getTextContent();
		tintuc["link"] = items.item(i).getElementsByTagName("link").item(0).getTextContent();
		
		
		
		
		listData.push({
			template: "requiredTemplate",
			imageTintuc:{
				image: tintuc["image"]
			},
			titleTintuc:{
				text: tintuc["title"]
			},
			descriptionTintuc: {
				text: tintuc["description"]
			},
			timeTintuc:{
				text: tintuc["time"]
			},
			properties:{
				height:Ti.UI.SIZE,
			},
			linkTinTuc : tintuc["link"]
		});
		
	};
	$.listViewTinTuc.sections[0].setItems(listData);
	
}



var style;
if (Ti.Platform.name === 'iPhone OS'){
  style = Titanium.UI.iPhone.ActivityIndicatorStyle.DARK;
}
else {
  style = Ti.UI.ActivityIndicatorStyle.DARK;
}
var activityIndicator = Ti.UI.createActivityIndicator({
  color: 'black',
  //font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
  message: 'Loading...',
  style:style,
  height:80,
  width:150,
  backgroundColor:"#999",
  opacity:0.7,
  borderRadius:3
});


$.win.add(activityIndicator);
$.win.addEventListener('open', function(){
	activityIndicator.show();
	  // do some work that takes 6 seconds
	  xhr.open("GET", url);
	  xhr.send();
	  // ie. replace the following setTimeout block with your code
	  activityIndicator.hide();
});


function onItemClick(e){
	//get section
	var section = $.listViewTinTuc.sections[e.sectionIndex];
	
	//get item
	var item = section.getItemAt(e.itemIndex);
	
	//open webview
	var webview = Alloy.createController("webview", {urlWeb: item.linkTinTuc}).getView();
	$.nav.openWindow(webview);
}

function dorefresh(){
	$.win.fireEvent("open");
}


$.nav.open();