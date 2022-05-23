var baseURL = '/';

var filterInfo = [];

function clog(txt) {
	console.log(txt);
}

function errorCLog(txt) { console.log(txt); }

function _(elementID) {
	return document.getElementById(elementID);
}

function _set(elementID, value) {
	if (typeof value != "undefined") {
		if (value != null) {
			if (typeof document.getElementById(elementID) != "undefined" && document.getElementById(elementID) != null)
				document.getElementById(elementID).value = value;
		}
	}
}

function _setRadio(elementID, value) {
	if (typeof value != "undefined") {
		if (value != null && value != "") {
			var obj = document.getElementsByName(elementID);
			if (!obj)
				return;
			var objLen = obj.length;
			if (objLen == undefined) {
				obj.checked = (obj.value == value.toString());
				return;
			}
			for (var i = 0; i < objLen; i++) {
				obj[i].checked = false;
				if (obj[i].value == value.toString()) {
					obj[i].checked = true;
				}
			}

		}
	}
}

function _getRadio(elementName) {
	var radios = document.getElementsByName(elementName);
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			return radios[i].value;
		}
	}

}

function _setCheckbox(elementID, value) {
	$("#" + elementID).prop("checked", value);
	if(value)
		$("#" + elementID).attr("checked",true);
	else $("#" + elementID).removeAttr("checked", value);
	//document.getElementById(elementID).checked = value;
}

function _getCheckbox(elementID) {

	if (document.getElementById(elementID).checked) {
		return true;
	} else {
		return false;
	}
}

function _setSelect(elementID, value) {
	if (typeof value != "undefined") {
		if (value != null && value != "") {
			var ele = document.getElementById(elementID);
			for (var i = 0; i < ele.options.length; i++) {
				if (ele.options[i].value == value)
					ele.selectedIndex = i;
			}
		}
	}
}

function _getSelect(elementID) {
	var ele = document.getElementById(elementID);
	var value = ele.options[ele.selectedIndex].value;
	return value;
}

function _getSelectName(elementID) {
	var ele = document.getElementById(elementID);
	var value = ele.options[ele.selectedIndex].text;
	return value;
}

function _get(elementID) {
	if (typeof document.getElementById(elementID) != "undefined" && document.getElementById(elementID) != null)
		return document.getElementById(elementID).value;
}

function setHeading(txt,id) {
	$("#"+ id).text(txt);

}

//function OpenModel(id) {
//	$('#'+id).modal({
//		show: 'true'
//	});

//}

//function CloseModel(id) {
//	//$('#'+id).modal({
//	//	show: 'false'
//	//});

//	$('#'+id).modal('toggle');
//}

function ValidateEmptyField(ctlID) {
	ctlID = _(ctlID);
	ctlID.className = ctlID.className.replace(" input-validation-error", "");
	if (ctlID.tagName.toLowerCase() == "input") {
		if (ctlID.type.toLowerCase() == "text" || ctlID.type.toLowerCase() == "file" || ctlID.type.toLowerCase() == "hidden") {
			if (ctlID.value.replace(/ /g, '') == "") {
				ctlID.className += " input-validation-error";
				return ctlID.value.replace(/ /g, '') != "";
			}
		}
	}
	if (ctlID.tagName.toLowerCase() == "textarea") {
		if (ctlID.value.replace(/ /g, '') == "") {
			ctlID.className += " input-validation-error";
			return ctlID.value.replace(/ /g, '') != "";
		}
	}
	return true;
}

function GetAllFilterInfo()
{
	$.ajax({
		url: baseURL + 'Common/GetUserFilter',
		type: 'POST',
		cache: false,
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		success: function (data, textStatus, jqXHR) {
			var response = null;
			if (data)
				if (data.obj)
					response = data.obj;
			if (response != null) {
				if (response.length !== 0) {

					filterInfo=response;
				}
			}
		},//end success
		error: function (jqXHR, textStatus, errorThrown) {
			errorCLog("GetUserFilter :" + errorThrown + textStatus);
		}//end error
	});

}

function ValidateUsername(IctlID)
{
	var ctlID = _(IctlID);
	ctlID.className = ctlID.className.replace(" input-validation-error", "");
	//$("#" + IctlID).attr("title", "");
	var txt = ctlID.value;
	var found = false;
	for (var i = 0; i < filterInfo.length; i++) {
		if (filterInfo[i].username == txt) {
			found = true;
			ctlID.className += " input-validation-error";
			toastr.warning('Username already exists', 'Please choose an other.', { timeOut: 5000 })
		//	$("#" + IctlID).attr("title", "Username already exists");
			//ctlID.title = "Username already exists";
			break;
		}
	}
	return found;
}

function ValidateUserEmail(ctlID)
{
	ctlID = _(ctlID);
	ctlID.className = ctlID.className.replace(" input-validation-error", "");
	//ctlID.title = "";
	var txt = ctlID.value;
	var found = false;
	for (var i = 0; i < filterInfo.length; i++) {
		if (filterInfo[i].email == txt) {
			found = true;
			ctlID.className += " input-validation-error";
			toastr.warning('Email address already exists', 'Please choose an other.', { timeOut: 5000 })
		//	ctlID.title  = "Email address already exists";
			$("#" + ctlID).focus();
			break;
		}
	}
	return found;
}


function OpenModel(id) {
	$('#' + id).modal({
		show: 'true'
	});

}

function CloseModel(id) {

	$('#' + id).modal('toggle');
}

function transformDate(dval) {
	var d = ToDateTime(dval);
	m = moment(d);
	return m.format('DD/MM/YYYY') ; // moment(d).format('DD MM, YYYY');
}

function transformTime(dval) {
	var d = ToDateTime(dval);
	return moment(d).format('HH:mm');
}

function ToDateTime(DateVal) {
	var d = new Date((DateVal - 621355968000000000) / 10000);
	return d;
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
}

texTruncate = function (str, length, ending) {
    if (str) {
        if (length == null) {
            length = 200;
        }
        if (ending == null) {
            ending = '...';
        }
        if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
        } else {
            return str;
        }
    }
    return;
};
