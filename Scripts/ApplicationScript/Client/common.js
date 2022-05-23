var baseURL = '/';

function setBaseURL(prtcl) {
    //alert(prtcl);
    //if (prtcl == "http:") {
    //    baseURL = "https:" + window.location.href.substring(window.location.protocol.length);
    //    location.href = baseURL;
    //}

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
	if (value)
		$("#" + elementID).attr("checked", true);
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

function _setIn(elementID, value) {
	if (typeof value != "undefined") {
		if (value != null) {
			if (typeof document.getElementById(elementID) != "undefined" && document.getElementById(elementID) != null)
				document.getElementById(elementID).innerHTML = value;
		}
	}
}

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

function populateSubCategory(value, ListSubCat ,eleSubCatID) {
	if (ListSubCat) {
		$('#' + eleSubCatID).html('');
		$('#' + eleSubCatID)
			.append($("<option></option>")
				.attr("value", 0)
				.text('select sub category'));

		for (var i = 0; i < ListSubCat.length; i++) {
			var val = ListSubCat[i].subCategoryID;
			var id = ListSubCat[i].categoryID;
			var name = ListSubCat[i].name;
			if (id == value) {
				$('#' + eleSubCatID)
					.append($("<option></option>")
						.attr("value", val)
						.text(name));
			}
		}
	}
	return;
}

function populateCities(value, ListCity, eleCityID) {

	if (ListCity) {
		$('#' + eleCityID).html('');
		$('#' + eleCityID)
			.append($("<option></option>")
				.attr("value", "")
				.text('select city'));

		for (var i = 0; i < ListCity.length; i++) {
			var val = ListCity[i].cityID;
			var id = ListCity[i].countryID;
			var name = ListCity[i].city;
			if (id == value) {
				$('#' + eleCityID)
					.append($("<option></option>")
						.attr("value", val)
						.text(name));
			}
		}
	}
	return;
}

function convertToTicks(currDate)
{
   // var ticks = ((currDate * 10000) + 621355968000000000);
    //var ticks = moment.fn.toTicks;
    var m = new Date();;
    var ticks = (m.getTime() * 10000) + 621355968000000000;
    console.log(ticks);
    return ticks;
}

function convertNewDateToTicks(currDate) {
    // var ticks = ((currDate * 10000) + 621355968000000000);
    //var ticks = moment.fn.toTicks;
   // var m = new Date();;
    var ticks = (currDate.getTime() * 10000) + 621355968000000000;
    console.log(ticks);
    return ticks;
}

function dateTimetoTicks(date) {
    return (date.getTime() * 10000) + 621355968000000000
}

function getCurrentDate()
{
    //var today = new Date();
    //var dd = String(today.getDate()).padStart(2, '0');
    //var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //var yyyy = today.getFullYear();

    //today = mm + '/' + dd + '/' + yyyy;
    var today = moment();
    console.log(today);

    return today;
}

function getCountry()
{

    return 'pakistan';
}

function _blockUI(msg, div) {

    var id = '.landing-page';
    if (div!='')
         id = '#' + div + ''

    $("body").block({
        message: msg,
        centerX: true,
        centerY: true,
        css: {
            border: 'none',
            'z-index': '999999',
            //padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff',
        }
    });

}

function removeSpecialCharacter(str)
{
    //var str = "abc's test#s";
    str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '_');
    console.log(str);
    return str;
}

function OpenModel(id) {
    $('#' + id).modal({
        show: 'true'
    });

}

function CloseModel(id) {

    $('#' + id).modal({
        show: 'false'
    });
}

function transformDate(dval) {
    var d = ToDateTime(dval);
    m = moment(d);
    return m.format('DD/MM/YYYY'); // moment(d).format('DD MM, YYYY');
}

function ToDateTime(DateVal) {
    var d = new Date((DateVal - 621355968000000000) / 10000);
    return d;
}

function transformTime(dval) {
    var d = ToDateTime(dval);
    return moment(d).format('HH:mm');
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

