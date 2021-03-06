function getHTTPRequestObject() 
{
  return new XMLHttpRequest();
}
var couldProcess = false;
var httpRequester = getHTTPRequestObject();
var texttimer=-1;
var global_vars={
current_cp:"UTF-8",
ed_simple:0,
synt_hl:"plain",
hashtext:""
}
function getGlobVarsToURL()
{
	var rez="";
	for (var obj in global_vars) if (obj!="hashtext") rez+="&"+obj+"="+global_vars[obj];
	return rez;
}
function justResponse() 
{
  if ( httpRequester.readyState == 4 ) 
  { 
	 var value = httpRequester.responseText; 
	 couldProcess = false;
	 if (httpRequester.status != 200) alert("Failed! Err text: "+value);
  }  
}
function reloadLocation()
{
	var lst=document.URL.split('&');
	location.href=lst[0]+getGlobVarsToURL();
}
function startTextTimer()
{
	var targs=getCookie("ref_text_timer");
	if (targs==null) targs=30;
	texttimer=setInterval(isChangedContent,targs*1000);
}
function txtVerControl()
{
	if ( httpRequester.readyState == 4 ) 
	{ 
		var value = httpRequester.responseText; 
		couldProcess = false;
		if (httpRequester.status != 200) alert("Failed! Err text: "+value);
		if (getGlobVar('hashtext')!=value)		
		{
			clearInterval(texttimer);
			if (confirm ("File has been modified by another user. Do you want relod it?")) 
			{
				location.reload();
				startTextTimer();
			}
		}		
	}  
}
function getHashAnswer()
{
	if ( httpRequester.readyState == 4 ) 
	{ 
		var value = httpRequester.responseText; 
		couldProcess = false;
		if (httpRequester.status != 200) alert("Failed! Err text: "+value);
		setGlobVar('hashtext',value);
	}
}
function onChangeTimer()
{
	clearInterval(texttimer);
	var val=document.getElementsByName('seltime')[0];
	if (val!=null)
	{
		var ncp=val.options[val.selectedIndex].value;
		setCookie("ref_text_timer",ncp);	
		location.reload(true);	
	}
	startTextTimer();
}
function reloadResponse() 
{
  if ( httpRequester.readyState == 4 ) 
  { 
	 var value = httpRequester.responseText; 
	 couldProcess = false;
	 if (httpRequester.status == 200)	 
	 {
		 var checks=document.getElementsByName('chbt');
		 location.reload();
	 }
	 else alert("Failed! Err text: "+value);
  }  
}
function saveFile(o) 
{
    o && o.removeAttribute("changes");
	if (!couldProcess && httpRequester)
	{
		var data="dir="+encodeURIComponent(document.URL)+"&edtext=";
		if (document.getElementById("teditor")==null) data+=encodeURIComponent(editor.getValue());
		else data+=encodeURIComponent(document.getElementById("teditor").value);		
		sendPOST(data,"gethashanswer");
	}	
}
function getChList()
{
	var checks=document.getElementsByName('chbt');
	var dellist=new Array();
	for (var i=0;i<checks.length;i++)
	{
		var elt=checks[i];
		if (elt.checked==true) dellist[dellist.length]=elt.getAttribute("data-url");
	}
	return dellist;
}
function deleteFile()
{
	var dellist=getChList();
	if (!couldProcess && httpRequester&&dellist.length>0 
        && confirm(dellist.length+" file(s) will be deleted. Are you sure?"))
	{
		var data="dir="+encodeURIComponent(document.URL)+"&delfls="+encodeURIComponent(dellist.join("*"));
		sendPOST(data,"reload");	
		var checks=document.getElementsByName('chbt');
		for (var i=0;i<checks.length;i++) checks[i].checked=false;					
	}	
}
function sendPOST(data,type)
{
	httpRequester.open("POST", "dir.php",true);
	httpRequester.onreadystatechange = justResponse;
	if (type=="reload") httpRequester.onreadystatechange = reloadResponse;
	if (type=="checktext") httpRequester.onreadystatechange = txtVerControl;
	if (type=="gethashanswer") httpRequester.onreadystatechange=getHashAnswer;
	httpRequester.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	couldProcess = true;
	//data+=encodeURIComponent(getGlobVarsToURL());
	httpRequester.send(data);
}

function create(isfile)
{	
	var hnt="DIR";
	if (isfile) hnt="FILE";
	var fname=window.prompt("Input "+hnt+" name","");
	if (fname!=null&&!couldProcess && httpRequester)
	{		
		var data="dir="+encodeURIComponent(document.URL);
		if (isfile) data+="&create_fl="+encodeURIComponent(fname);
		else data+="&create_dr="+encodeURIComponent(fname);
		sendPOST(data,"reload");
	}
}

function copyFiles()
{
	var cplist=getChList();	
	setCookie("fl_count",cplist.length);
	setCookie("fl_targets",cplist.join("*"));	
}
function pasteFiles()
{
	var targs=getCookie("fl_targets");
	var count=getCookie("fl_count");
	var data="dir="+encodeURIComponent(document.URL);
	if (count>0&&targs!=null)
	{
		if (count==1)
		{
			var fname=window.prompt("File copy, input name",targs.substring(targs.lastIndexOf("/")+1));
			if (fname==null||fname=="") return;
			data+="&flpaste="+encodeURIComponent(targs)+"&nname="+encodeURIComponent(fname);
		}
		else
		{
			var fname=window.prompt("Multiple file copy, input: regex/string");
			if (fname==null) return;
			data+="&flpaste="+encodeURIComponent(targs)+"&rgxname="+encodeURIComponent(fname);
		}
		sendPOST(data,"reload");
	}	
}
function getCookie(name) 
{
	var matches = document.cookie.match(new RegExp(
	    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : null;
}
function getGlobVar(name)
{
		return global_vars[name];
}

function setCookie(name, value, options) 
{
	options = options || {};	
	value = encodeURIComponent(value);
	var updatedCookie = name + "=" + value;
	for(var propName in options) 
	{
		updatedCookie += "; " + propName;
		var propValue = options[propName];   
		if (propValue !== true) updatedCookie += "=" + propValue;
	} 
	document.cookie = updatedCookie;
}
function setGlobVar(name, value, options) 
{
	global_vars[name]=value;
}
function filterContent()
{
	var ntext=new RegExp(document.getElementsByName('fltxt')[0].value,"i");
	var checks=document.getElementsByName('chbt');
	for (var i=0;i<checks.length;i++)
	{	
		var elt=checks[i].nextSibling.text;
		if (elt==undefined) elt=checks[i].nextSibling.innerText;
		if (ntext.test(elt)==false) checks[i].parentElement.style.display="none";
		else checks[i].parentElement.style.display="";
	}
	document.getElementsByName('fltxt')[0].focus();
}
function changeEdit()
{
	var checks=document.getElementsByName('simple_ed')[0];
	if (checks.checked) setGlobVar("ed_simple",0);
	else setGlobVar("ed_simple",1);	
	//location.reload(true);
	//window.location.href=zzz;
	reloadLocation();
}
function changeLang()
{
	var val=document.getElementsByName('lang')[0];
	if (val!=null)
	{
		setGlobVar("synt_hl",val.options[val.selectedIndex].value);
		//location.reload(true);		
		reloadLocation();
	}
}
function changeCP()
{
	var val=document.getElementsByName('codepg')[0];
	if (val!=null)
	{
		var ncp=val.options[val.selectedIndex].value;
		setGlobVar("current_cp",ncp);	
		//location.reload(true);	
		reloadLocation();
	}
}
function isChangedContent()
{
	var data="dir="+encodeURIComponent(document.URL)+"&get_hash=1";
	sendPOST(data,"checktext");	
}
