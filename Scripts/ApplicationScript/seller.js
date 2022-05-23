var AddressList = [];
var StatusValue = 0;
var objSellerAddress = {};
objSellerAddress.addressID = 0;
objSellerAddress.addressTypeID = 0;
objSellerAddress.profileID = 0;
objSellerAddress.countryID = 0;
objSellerAddress.cityID = 0;
objSellerAddress.postalCode = "";
objSellerAddress.country = "";
objSellerAddress.city = "";
objSellerAddress.addressType = "";
objSellerAddress.address = "";
objSellerAddress.dateCreated = "";
objSellerAddress.dateModified = "";
objSellerAddress.isActive = true;
objSellerAddress.isDeleted = false;

var selectedPID = 0;
var selectedSID = 0;
var selectedStatusID = 0;
var pathFolder = "";


var Seller = {};

Seller.GetSellerAddressHistory = function (ID) {

	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminSeller/GetSellerAddressHistory',
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
				Seller.CreateAddressTable(response);

				
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Seller Address History :" + errorThrown + textStatus);
			}//end error
		});
	}
}

Seller.CreateAddressTable = function (data) {
	resultHtml = "<tr><td colspan='4'> No record found </td></tr>";
	if (data != null) {
		AddressList = data; 
		if (AddressList.length > 0) {
			resultHtml = "";
			for (var i = 0; i < AddressList.length; i++) {

				resultHtml += "<tr>"
				resultHtml += "<td>" + AddressList[i].address + "</td>";
				resultHtml += "<td>" + transformDate(AddressList[i].dateCreatedTicks) + "</td>";
				resultHtml += "<td>" + AddressList[i].addressType + "</td>";
				resultHtml += "<td>" + AddressList[i].isActive + "</td>";
				resultHtml += "</tr>"
			}
		}
	}
	_("Seller_Add_hist_table").innerHTML = resultHtml;
	OpenModel("seller_add_hist_model");
}

Seller.GetSellerStatusHistory = function (pID, sID) {

	 selectedPID = pID;
	 selectedSID = sID;
	// selectedStatusID = statusID;
	 if (pID) {
		 var parameters = { 'id': String(selectedSID) };
		$.ajax({
			url: baseURL + 'AdminSeller/GetRegistrationStatusHistory',
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
				Seller.CreateStatusHistoryTable(response);

			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Seller Status History :" + errorThrown + textStatus);
			}//end error
		});
	}
}

Seller.CreateStatusHistoryTable = function (data) {
	resultHtml = "<tr><td colspan='4' align='center'> No record found </td></tr>";
	if (data != null) {
		StatusList = data;
		if (StatusList.length > 0) {
			resultHtml = "";
			for (var i = 0; i < StatusList.length; i++) {

				resultHtml += "<tr>"
				resultHtml += "<td>" + StatusList[i].registrationStatus + "</td>";
				resultHtml += "<td>" + transformDate(StatusList[i].statusDateTicks) + "</td>";
				resultHtml += "<td>" + StatusList[i].modifiedByName + "</td>";
				resultHtml += "</tr>"
			}
		}
	}
	_("Seller_change_status_table").innerHTML = resultHtml;
	OpenModel("seller_change_status_model");
}

Seller.SetRegistrationStatus = function (val) {
	selectedStatusID = val;
}

Seller.ChangeRegStatus = function () {
	//;
	//if (pID) {
	//alert(selectedSID);
	//alert(selectedPID);
	//alert(selectedStatusID);
	var parameters = { 'id': String(selectedSID), 'pID': String(selectedPID), 'statusID': String(selectedStatusID) };
		$.ajax({
			url: baseURL + 'AdminSeller/ChangeRegistrationStatus',
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
				//Seller.CreateAddressTable(response);
				CloseModel("seller_change_status_model");

			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Change seller registration history:" + errorThrown + textStatus);
			}//end error
		});
	//}
}

Seller.CreateSellerDocTable = function (data) {
	resultHtml = "<tr><td colspan='4' align='center'> No record found </td></tr>";
	
	if (data != null) {
		var DocList = data;
		if (DocList.length > 0) {
			pathFolder =  DocList[0].folder;
			resultHtml = "";
			for (var i = 0; i < DocList.length; i++) {
				var downloadLnk = DocList[i].folder + "//" + DocList[i].name + "." + DocList[i].ext;
				resultHtml += "<tr>"
				resultHtml += "<td>" + DocList[i].documentTitle + "</td>";
				resultHtml += "<td>" + transformDate(DocList[i].dateCreatedTicks) + "</td>";
				resultHtml += "<td><button type='button'  class='btn btn-primary btn-sm' onclick='setIT(\"" + downloadLnk +"\")'>Download</button></td>";
				resultHtml += "</tr>"

			}
		}
	}
	_("Seller_doc_table").innerHTML = resultHtml;
	OpenModel("seller_doc_model");
}

Seller.GetSellerDocuments = function (ID) {

	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminSeller/GetSellerDocuments',
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
				Seller.CreateSellerDocTable(response);


			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Seller Address History :" + errorThrown + textStatus);
			}//end error
		});
	}
}

function ValidateSellerFeilds(isEdit) {
	var isValid = true;
	var result = true;

	isValid = ValidateEmptyField("profile_firstName");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("profile_lastName");
	if (isValid == false)
		result = false;
	if (!isEdit) {
		isValid = ValidateEmptyField("profile_username");
		if (isValid == false)
			result = false;
		isValid = ValidateUsername("profile_username");
		if (isValid == true)
			result = false;
		isValid = ValidateEmptyField("profile_email");
		if (isValid == false)
			result = false;
		isValid = ValidateUserEmail("profile_email");
		if (isValid == true)
			result = false;

		isValid = validatePassword();
		if (isValid == false)
			result = false;
	}


	return result;
}

function OpenModel(id) {
    $('#' + id).modal('toggle');

}

function CloseModel(id) {

	$('#' + id).modal('toggle');
}

//function transformDate(dval) {
//	var d = ToDateTime(dval);
//	return moment(d).format('DD/MM/YYYY');
//}

//function ToDateTime(DateVal) {
//	var d = new Date((DateVal - 621355968000000000) / 10000);
//	return d;
//};

function setIT(txt) {
	//alert(txt);
	window.open(baseURL + "AdminSeller//DownloadSellerFile//?url=" + String(txt));

}

function downloadFiles() {

	window.open(baseURL + "AdminSeller//DownloadSellerAllFiles//?id=" + String(pathFolder));
}

Seller.Delete= function (ID) {
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminSeller/DeleteSeller',
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

			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Delete Seller :" + errorThrown + textStatus);
			}//end error
		});
	}
}

Seller.MarkActive = function (ID, isActive) {

	var parameters = { 'id': String(ID), 'isActive': isActive };
	$.ajax({
		url: baseURL + 'AdminSeller/MarkActiveSeller',
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

		},//end success
		error: function (jqXHR, textStatus, errorThrown) {
			errorCLog("Mark Seller Active :" + errorThrown + textStatus);
		}//end error
	});
}


Seller.SetDashboard = function (username, photo, displayTitle, desc,regID)
{

    if (displayTitle)
        _setIn('spnDisplayTitle', displayTitle);
    else
        _setIn('spnDisplayTitle', 'Please add your service title!');

    if (desc) 
        _setIn('spnDescription', desc);
    else _setIn('spnDescription', 'Edit profile to add your service description.');

    if (photo) {
        $('#logoProfilePic').attr('src', baseURL + '/Uploads/ProfilePictures/thumb-70/' + photo);
        $('#imgPhoto').attr('src', baseURL + '/Uploads/ProfilePictures/thumb-200/' + photo);
    }
    else {
        $('#logoProfilePic').attr('src', baseURL + '/Content/images/default/150x150-profilePic.jpg');
        $('#imgPhoto').attr('src', baseURL + '/Content/images/default/150x150-profilePic.jpg');
    }
  
}

Seller.SetHeader = function (photo, menuItem) {
    
    if (photo) {
        $('#logoProfilePic').attr('src', baseURL + '/Uploads/ProfilePictures/thumb-70/' + photo);
    }
}

Seller.SetDashboardDeals = function (objList) {
    var resultHtml = '';
    if (objList.length > 0) {

        for (var i = 0; i < objList.length; i++) {
            resultHtml += '<div class="col-lg-4 col-sm-6">';
            resultHtml += '<div class="hpanel">';
            resultHtml += '<div class="panel-body no-padding poluritm">';
            if (objList[i].photo)
                resultHtml += '<div class="entry-thumbnailsmall"> <img src="' + baseURL + '/Uploads/Deal/' + objList[i].folderID + '/thumb-200/' + objList[i].photo + '" class="img-responsive"> </div>';
            else resultHtml += '<div class="entry-thumbnailsmall"> <img src="' + baseURL + '/Content/images/default/365x220-popularUser.jpg" class="img-responsive"> </div>';
            if (objList[i].title)
                resultHtml += '<div class="p-sm productdetail"><h4>' + objList[i].title + '</h4>';
            else resultHtml += '<div class="p-sm productdetail"><h4> Edit meal to add title!</h4>';
            if (objList[i].title)
                resultHtml += '<p>' + objList[i].description + '</p>';
            else resultHtml += '<p>Edit meal to add description.</p>';
            if (objList[i].Price != 0 && objList[i].Price!=null)
                resultHtml += '<h4 class="text-success">' + objList[i].currency + objList[i].Price + '</h4>';
            else resultHtml += '<h4 class="text-success">Edit meal to add price!</h4>';
            resultHtml += '</div></div></div></div>';
        }
        _setIn('deal-items', resultHtml);
    }
    else {
        resultHtml += '<div class="col-lg-4 col-sm-6">';
        resultHtml += '<div class="hpanel">';
        resultHtml += '<div class="panel-body no-padding poluritm">';
        resultHtml += '<div class=""> <img src="' + baseURL + '/Content/images/default/365x220-popularUser.jpg" class="img-responsive"> </div>';
        resultHtml += '<div class="p-sm productdetail"><h4> Add Deal Item</h4>';
        resultHtml += '<p> Click on add deal button, In order to add a deal.</p>';
        resultHtml += '<h4 class="text-success"></h4>';
        resultHtml += '</div></div></div></div>';
        _setIn('deal-items', resultHtml);
    }
    return;
}

Seller.SetDashboardMeals = function (objList) {
    var resultHtml = '';
    if (objList.length > 0) {

        for (var i = 0; i < objList.length; i++) {
            resultHtml += '<div class="col-lg-4 col-sm-6">';
            resultHtml += '<div class="hpanel">';
            resultHtml += '<div class="panel-body no-padding poluritm">';
            resultHtml += '<div class="entry-thumbnailsmall"> <img src="' + baseURL + '/Uploads/Product/' + objList[i].FolderID + '/thumb-200/' + objList[i].photo + '" class="img-responsive"> </div>';
            resultHtml += '<div class="p-sm productdetail"><h4>' + objList[i].title + '</h4>';
            resultHtml += '<p>' + objList[i].description + '</p>';
            resultHtml += '<h4 class="text-success">' + objList[i].currency + objList[i].price + '</h4>';
            resultHtml += '</div></div></div></div>';
        }
        _setIn('meal-items', resultHtml);
    }
    else {
            resultHtml += '<div class="col-lg-4 col-sm-6">';
            resultHtml += '<div class="hpanel">';
            resultHtml += '<div class="panel-body no-padding poluritm">';
            resultHtml += '<div class=""> <img src="' + baseURL + '/Content/images/default/365x220-popularUser.jpg" class="img-responsive"> </div>';
            resultHtml += '<div class="p-sm productdetail"><h4>Add Meal Item</h4>';
            resultHtml += '<p> Click on add deal button, In order to add a meal.</p>';
            resultHtml += '<h4 class="text-success"></h4>';
            resultHtml += '</div></div></div></div>';

        _setIn('meal-items', resultHtml);
    }
    return;
}

Seller.GetDashboardMeals = function () {
    $.ajax({
        url: '/Seller/GetDashboardMeals',
        type: 'POST',
       // data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            var response = null;
            if (data)
                if (data.obj) {
                    response = data.obj;
                    Seller.SetDashboardMeals(response);
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetDashboardMeals :" + errorThrown + textStatus);
        }//end error
    });
}

Seller.GetDashboardDeals = function () {
    $.ajax({
        url: '/Seller/GetDashboardDeals',
        type: 'POST',
        // data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            var response = null;
            if (data)
                if (data.obj) {
                    response = data.obj;
                    Seller.SetDashboardDeals(response);
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetDashboardMeals :" + errorThrown + textStatus);
        }//end error
    });
}



