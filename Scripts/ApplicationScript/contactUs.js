var cus = {}

cus.statusID = 0;
cus.id = 0;
cus.reply = "";
cus.profileID = 0;
cus.email = "";


var ListProfileID = [];
var ListContactUsID = [];
var ListEmail = [];

cus.GetFeildData = function () {

	cus = {};
	cus.statusID = _get('ddlStatus');
	cus.reply = _get('txtReply');
	cus.profileID = ListProfileID;
	cus.id = ListContactUsID;
	cus.email = ListEmail;
	return cus;
}

cus.ClearFeildData = function () {
	  cus = {};
	 _set('ddlStatus',0);
	 _set('txtReply','');
	 _set('hdnProfileID',0);
	 _set('hdnEmail', '');
	 _set('hdnContactUsID', 0);
	 _setIn('txtQuery', '');

	  ListProfileID = [];
      ListContactUsID = [];
	  ListEmail = [];
	return true;
}

cus.UpdateStatus = function () {

	var obj = cus.GetFeildData();
	if (obj.id) {
		var parameters = { 'id': String(obj.id), 'statusID': String(obj.statusID), 'email': String(obj.email), 'profileID': String(obj.profileID) };
		$.ajax({
			url: baseURL + 'AdminContactUs/ChangeQueryStatus',
			type: 'POST',
			data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data, textStatus, jqXHR) {
				var response = null;
				CloseModel("contact-us-model");
				//$('#cus-table').DataTable().ajax.reload();
				var url = baseURL + '/AdminContactUs/Index';
				location.reload(url);
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				CloseModel("contact-us-model");
				cus.ClearFeildData();
				errorCLog("Set Contact Us  Status :" + errorThrown + textStatus);
			}//end error
		});
	}
}

cus.SaveReply = function () {

	var obj = cus.GetFeildData();
	if (obj.id) {
		var parameters = { 'id': String(obj.id), 'statusID': String(obj.statusID), 'email': String(obj.email), 'reply': String(obj.reply), 'profileID': String(obj.profileID) };
		$.ajax({
			url: baseURL + 'AdminContactUs/SaveReply',
			type: 'POST',
			data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data, textStatus, jqXHR) {
				;
				var response = null;
				CloseModel("contact-us-model");
				//$('#cus-table').DataTable().ajax.reload();
				//cus.ClearFeildData();
				var url = baseURL + '/AdminContactUs/Index';
				location.reload(url);

			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				//cus.ClearFeildData();
				CloseModel("contact-us-model");
				errorCLog("Save Contact Us  Reply :" + errorThrown + textStatus);
			}//end error
		});
	}
}

cus.SetData = function (info) {
	ListContactUsID = [];
	ListProfileID = [];
	ListEmail = [];
	if (info.id) { ListContactUsID.push(info.id); }
	if (info.profileID) { ListProfileID.push(info.profileID); }
	if (info.email) { ListEmail.push(info.email); }
	_setIn('txtQuery', info.query);
	OpenModel('contact-us-model');
}

cus.SetMultipleData = function (List) {
	ListContactUsID = [];
	ListProfileID = [];
	ListEmail = [];
	var emails = "";

	for (var i = 0; i < List.length; i++) {

		if (List[i].id) {

			ListContactUsID.push(List[i].id);
		}
		if (List[i].profileID) {
			if ($.inArray(List[i].profileID, ListProfileID) == -1)
				ListProfileID.push(List[i].profileID);
		}
		if (List[i].email) {

			if (ListEmail.length > 0) {
				if (ListEmail.indexOf(List[i].email) == -1) {
					ListEmail.push(List[i].email);

						emails = emails + " ," + List[i].email;
				}
			}
			else {
				ListEmail.push(List[i].email);
				emails = List[i].email;
			}
		}
	}

	_setIn('txtQuery', emails);
	OpenModel('contact-us-model');
}