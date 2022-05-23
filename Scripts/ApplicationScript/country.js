var country = {};

country.countryID = 0;
country.country = "";
country.currency = "";
country.VAT = "";
country.commisionValue = "";
country.distanceUnitID = 0;
country.dateActivated = "";
country.dateCreated = "";
country.dateModified = "";
country.isActive = true;
country.isDeleted = false;
country.isHalal = false;


country.GetFieldData = function () {

	objCountry = {};
	objCountry.countryID = _get('hdnCountryID');
	objCountry.country = _get('txtCountry');
	objCountry.currency = _getSelect('ddlCurrency');
	objCountry.VAT = _get('txtVAT');
	objCountry.commisionValue = _get('txtCommisionValue');
	objCountry.distanceUnitID = _getSelect('ddlDistanceUnit');
	objCountry.isHalal = _getCheckbox('chkIsHalal');
	//objCountry.isActive = _getCheckbox('chkIsActive');

	return objCountry;

}

country.SetFieldData = function (obj) {

	if (obj) {
		if (obj.countryID)
			_set('hdnCountryID', obj.countryID);
		if (obj.country)
			_setIn('txtCountry', obj.country);
		if (obj.currency)
			_setSelect('ddlCurrency', obj.currency);
		if (obj.distanceUnitID)
			_setSelect('ddlDistanceUnit', obj.distanceUnitID);
		if (obj.commisionValue)
			_set('txtCommisionValue', obj.commisionValue);
		if (obj.VAT)
			_set('txtVAT', obj.VAT);
		if (obj.isHalal)
			_setCheckbox('chkIsHalal', obj.isHalal);
		//if (obj.isActive)
		//	_setSelect('chkIsActive', obj.isActive);
	}

}

country.ClearFieldData = function () {

		_set('hdnCountryID', 0);
		_setIn('txtCountry', '');
		_setSelect('ddlCurrency', 0);
		_setSelect('ddlDistanceUnit', 0);
		_set('txtCommisionValue', '');
		_set('txtVAT', '');
		_setCheckbox('chkIsHalal',false);
		//_setSelect('chkIsActive', false);

}

country.GetConfiguration = function (ID)
{
	country.ClearFieldData();
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminCountry/GetCountry',
			type: 'POST',
			data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data, textStatus, jqXHR) {
				
				var response = null;
				if (data)
					if (data.obj)
						response = data.obj;
				if (response != null) {
					if (response.length !== 0) {
						country.SetFieldData(response);
					}
					else { return; }

				}
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Country By ID :" + errorThrown + textStatus);
			}//end error
		});
	}


}

country.SaveConfiguration = function () {

	var obj = country.GetFieldData();

	var parameters = { 'obj': obj };
		$.ajax({
			url: baseURL + 'AdminCountry/EditCountryConfiguration',
			type: 'POST',
			data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data, textStatus, jqXHR) {

				var response = null;
				if (data)
					if (data.obj)
						response = data.obj;
				if (response != null) {
					if (response.length !== 0) {
						country.ClearFieldData();
						$("input[type=submit]").attr("disabled", "disabled");
					}
					else { }
				}
				toastr.success("Configurations Saved Successfully!");
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				
				errorCLog("edit configurations :" + errorThrown + textStatus);
			}//end error
		});

}

country.MarkActive = function (ID, isActive)
{
	var parameters = { 'id': String(ID), 'isActive': isActive };
	$.ajax({
		url: baseURL + 'AdminCountry/MarkActiveCountry',
		type: 'POST',
		data: JSON.stringify(parameters),
		cache: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (data, textStatus, jqXHR) {
			var response = null;
			if (data)
				if (data.obj)
					response = data.obj;
			//if (response != null) {
			//	if (response.length !== 0) {
			//		//TODO 
			//	}
			//	else { }
			//}
			if (isActive)
				toastr.success("Country Set Active!");
			else toastr.success("Country Set InActive!");
		},//end success
		error: function (jqXHR, textStatus, errorThrown) {
			errorCLog("Mark Country Active :" + errorThrown + textStatus);
		}//end error
	});


}

country.GetCountries = function () {
	;
		$.ajax({
			url: baseURL + 'AdminCountry/GetCountries',
			type: 'POST',
			//data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data, textStatus, jqXHR) {
				var response = null;
				if (data)
					if (data.obj)
						response = data.obj;
				if (response != null) {
					if (response.length !== 0) {
						country.SetTable(response);
					}
					else { return; }
				}
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get All Countries ID :" + errorThrown + textStatus);
			}//end error
		});

}

country.SetTable= function (data)
{

	resultHtml = "<tr><td colspan='2' align='center'> No record found </td></tr>";

	if (data != null) {
		var objList = data;
		if (objList.length > 0) {
			resultHtml = "";
			for (var i = 0; i < objList.length; i++) {
				resultHtml += "<tr>"
				if (objList[i].isActive)
					resultHtml += "<td><input class='actCheckbox' onchange='onChangeCheckbox(this);' checked type='checkbox' name='actCountry' data-id='" + objList[i].countryID + "'/></td>";
				else resultHtml += "<td><input class='actCheckbox'  onchange='onChangeCheckbox(this);' type='checkbox' data-id='" + objList[i].countryID + "' /></td>";

				resultHtml += "<td><span style='cursor:pointer' onclick='openConfigurations(" + objList[i].countryID+")'>" + objList[i].country +"</span></td>";
				resultHtml += "</tr>"

			}
		}
	}
	_("country-configuration-table").innerHTML = resultHtml;

}

function openConfigurations(id)
{
	$("#btnSubmit").removeAttr("disabled");
	country.GetConfiguration(id);
}

function onChangeCheckbox(elem) {
	//;
	if (elem.checked) {
		var ele = $(elem).attr("data-id");
		country.MarkActive(ele, true);
	}
	else {
		var ele = $(elem).attr("data-id");
		country.MarkActive(ele, false);
	}

}