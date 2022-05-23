var notice = {};

notice.notificationID = 0;
notice.senderID = 0;
notice.receiverID = 0;
notice.modifiedBy = 0;
notice.notificationTypeID = 0;
notice.groupID = 0;
notice.countryID = 0;
notice.cityID = 0;
notice.title = "";
notice.notice = "";
notice.notificationType = "";
notice.groupTitle = "";
notice.notificationType = "";
notice.groupTitle = "";
notice.country = "";
notice.city = "";
notice.noticeDate = "";
notice.isActive = true;
notice.isDeleted = false;
notice.isRead = false;
notice.isGroupNotice = true;


notice.GetFieldData = function ()
{

	objNote = {};
	objNote.notificationID = _get('hdnNotificationID');
	objNote.notificationTypeID = _getSelect('ddlType');
	objNote.groupID = _getSelect('ddlGroup');
	objNote.countryID = _getSelect('ddlCountry');
	objNote.cityID = _getSelect('ddlCity');
	objNote.title = _get('txtTitle');
	objNote.noticeDate = _get('txtNoticeDate');
	objNote.notice = _get('txtNotice');
//	objNote.isActive = _getCheckbox('chkIsActive');

	return objNote;
}

notice.SetFieldData = function (obj)
{
	if (obj) {
		if (obj.notificationID)
			_set('hdnNotificationID', obj.notificationID);
		if (obj.countryID)
			_setSelect('ddlCountry', obj.countryID);
		if (obj.notificationTypeID)
			_setSelect('ddlType', obj.notificationTypeID);
		if (obj.groupID)
			_setSelect('ddlGroup', obj.groupID);
		if (obj.cityID)
			_setSelect('ddlCity', obj.cityID);
		if (obj.title)
			_set('txtTitle', obj.title);
		if (obj.notice)
			_set('txtNotice', obj.notice);
		if (obj.noticeDateTicks) {
			//_set('txtNoticeDate', transformDate(obj.noticeDateTicks));
			_set('datepicker3', transformDate(obj.noticeDateTicks));
			//$('#datepicker3').datepicker("setDate", transformDate(obj.noticeDateTicks));
		}
		//if (obj.isActive)
		//	_setCheckbox('chkIsActive', obj.isActive);

	}

}

notice.SetViewData = function (obj) {
	if (obj) {
		if (obj.country)
			_setIn('lblCountry', obj.country);
		if (obj.notificationType)
			_setIn('lblType', obj.notificationType);
		if (obj.groupTitle)
			_setIn('lblGroup', obj.groupTitle);
		if (obj.city)
			_setIn('lblCity', obj.city);
		if (obj.title)
			_setIn('lblTitle', obj.title);
		if (obj.notice)
			_setIn('lblNotice', obj.notice);
		if (obj.noticeDateTicks)
			_setIn('lblNoticeDate', transformDate(obj.noticeDateTicks));
		if (obj.isActive)
			_setCheckbox('lblIsActive', obj.isActive);

	}

}

notice.ClearFieldData = function () {
    ;
    _set('hdnNotificationID', 0);

    $("#ddlCountry").val("");
    $("#ddlType").val("");
    $("#ddlGroup").val("");
    $("#ddlCity").val("");
   // $("#datepicker3", '');

    $("#datepicker3").datepicker('setDate', null);
			//_setSelect('ddlCountry', "");
			//_setSelect('ddlType',"");
			//_setSelect('ddlGroup',"");
			//_setSelect('ddlCity', "");
			_set('txtTitle', '');
			_set('txtNotice', '');
			_set('txtNoticeDate', '');
			//_setCheckbox('chkIsActive', false);

}

notice.ClearViewData = function () {

	_setIn('lblCountry', 0);
	_setIn('lblType', 0);
	_setIn('lblgroup', 0);
	_setIn('lblCity', 0);
	_setIn('lblTitle', '');
	_setIn('lblNotice', '');
	_setIn('lblNoticeDate', '');
	_setCheckbox('lblIsActive', false);

}

notice.ClearSearchData = function ()
{
	_setSelect('ddlSrchCountry', 0);
	_setSelect('ddlSrchType', 0);
	_setSelect('ddlSrchgroup', 0);
	_setSelect('ddlSrchCity', 0);
	_set('txtSrchDate','');

}

notice.GetByID = function (ID,isView) {
	if (!isView)
		notice.ClearFieldData();
	else
		notice.ClearViewData();
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminNotification/GetNoticeficationByID',
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
						if (!isView) {
							//sleep(5000);
							notice.SetFieldData(response);
							//OpenModel("add-edit-notice-model");
						}
						else {

							notice.SetViewData(response);
							OpenModel("view-notice-model");
						}
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

notice.GetCities = function (countryID,eleID) {
	$('#' + eleID).children('option:not(:first)').remove();
	if (countryID) {
		var parameters = { 'id': String(countryID) };
		$.ajax({
			url: baseURL + 'Common/GetCountryCities',
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
						notice.PopulteCities(response, eleID);
					}
					else { return; }
				}
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Cities By Country ID :" + errorThrown + textStatus);
			}//end error
		});

	}
}

notice.PopulteCities = function (obj, eleID) {
	//;
	if (obj) {
		for (i = 0; i < obj.length; i++)//, function (cityID, city) {
		{
			$('#' + eleID)
				.append($("<option></option>")
					.attr("value", obj[i].cityID)
					.text(obj[i].city));
		}
	}
}

notice.AddEdit = function ()
{
	var obj = notice.GetFieldData();
	var parameters = { 'obj': obj };
	$.ajax({
		url: baseURL + 'AdminNotification/AddNewNotice',
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
					
			//	}
			//	else { }
			//}
            toastr.success("Notification Saved Successfully!");
            CloseModel("add-edit-notice-model");
            $('#note-table').DataTable().ajax.reload();
			notice.ClearFieldData(); 
		},//end success
		error: function (jqXHR, textStatus, errorThrown) {

			errorCLog("add notice :" + errorThrown + textStatus);
		}//end error
	});



}

notice.MarkActive = function (ID, isActive)
{
	;
	var parameters = { 'id': String(ID), 'isActive': isActive };
	$.ajax({
		url: baseURL + 'AdminNotification/MarkActiveNotice',
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

			toastr.success("Notification Set Active!");
			//var url = baseURL + '/AdminNotification/Index';
			//location.reload(url);
		},//end success
		error: function (jqXHR, textStatus, errorThrown) {
			errorCLog("Mark Admin Notification Active :" + errorThrown + textStatus);
		}//end error
	});


}

notice.Delete = function (ID)
{
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminNotification/DeleteNotice',
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
						//TODO 
					}
					else { }
				}
				var url = baseURL + '/AdminNotification/Index';
				location.reload(url);
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Delete Notification :" + errorThrown + textStatus);
			}//end error
		});
	}

}