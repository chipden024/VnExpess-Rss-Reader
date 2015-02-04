var args = arguments[0] || {};

var urlWeb = args.urlWeb || "http://vnexpress.net";

$.webview.url = urlWeb;
console.log("Linkweb: " + urlWeb);
