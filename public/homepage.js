function displayUser(){
	if(sessionStorage.getItem("type") == 'user'){
	  document.getElementById('usernamehere').innerHTML = sessionStorage.getItem('name');
	}
	else if(sessionStorage.getItem("type") == 'admin'){
	  document.getElementById('usernamehere').innerHTML = sessionStorage.getItem('name');
	}
	navbarmanager();
}

function navbarmanager(){
	if(sessionStorage.getItem("name") != null && sessionStorage.getItem("name") != 'null' ){
		document.getElementById('dashboardtag').style.display = 'inline';
		document.getElementById('usernamehere').style.display = 'inline';
		document.getElementById('logintag').style.display = 'none';
		document.getElementById('signuptag').style.display = 'none';
	}
	else{
		document.getElementById('logintag').style.display = 'inline';
		document.getElementById('signuptag').style.display = 'inline';
		document.getElementById('dashboardtag').style.display = 'none';
		document.getElementById('usernamehere').style.display = 'none';
	}
}
