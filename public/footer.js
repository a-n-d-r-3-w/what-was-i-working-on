var linkToLocal = document.getElementById('link-to-local');
var linkToProduction = document.getElementById('link-to-production');
linkToLocal.href = 'http://localhost:5000' + window.location.pathname;
linkToProduction.href = 'http://whatwasiworkingon.com' + window.location.pathname;
