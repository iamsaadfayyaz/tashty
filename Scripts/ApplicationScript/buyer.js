var FavouriteList = [];
var pathFolder = "";

var Buyer = {};

Buyer.profileID = 0;
Buyer.username = "";
Buyer.firstName = "";
Buyer.middleName = "";
Buyer.lastName = "";
Buyer.password = "";
Buyer.mobile = "";
Buyer.phoneNumber = "";
Buyer.titleID = 0;
Buyer.titleName = "";
Buyer.genderID = 0;
Buyer.gender = "";
Buyer.maritalStatusID = 0;
Buyer.maritalStatusName = "";
Buyer.email = "";
Buyer.roleID = 0;
Buyer.role = "";
Buyer.DOB = "";
Buyer.DOBTicks = 0;
Buyer.profilePhoto = "";
Buyer.isActive = true;
Buyer.isDeleted = false;
Buyer.dateCreated = "";
Buyer.dateModified = "";
Buyer.addressList = [];
Buyer.TotalRecords = 0;
Buyer.modifiedBy = 0;

var buyerAddressList = [];
UserAddress = {};
UserAddress.addressID = 0;
UserAddress.addressTypeID = 0;
UserAddress.profileID = 0;
UserAddress.countryID = 0;
UserAddress.country = "";
UserAddress.cityID = 0;
UserAddress.city = "";
UserAddress.postalCode = "";
UserAddress.addressType = "";
UserAddress.address = "";
UserAddress.modifiedByName = "";
UserAddress.modifiedBy = "";
UserAddress.isActive = "";
UserAddress.isDeleted = "";
UserAddress.dateCreated = "";
UserAddress.dateModified = "";

var bu = {};

bu.GetBuyerFavourites = function (ID) {

	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminBuyer/GetBuyerFavourites',
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
				bu.CreateFavouriteTable(response);

				
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Buyer Favourites :" + errorThrown + textStatus);
			}//end error
		});
	}
}

bu.CreateFavouriteTable = function (data) {
    resultHtml = "<tr><td colspan='4'> No record found </td></tr>";
    ;
	if (data != null) {
		FavouriteList = data; 
		if (FavouriteList.length > 0) {
			resultHtml = "";
			for (var i = 0; i < FavouriteList.length; i++) {

                resultHtml += "<tr>"
                if (FavouriteList[i].title )
                    resultHtml += "<td>" + FavouriteList[i].title + "</td>";
                else resultHtml += "<td>Anonymous</td>";
                if (FavouriteList[i].description)
                    resultHtml += "<td>" + texTruncate(FavouriteList[i].description,105,'...') + "</td>";
                else resultHtml += "<td>No detail given</td>";
				resultHtml += "<td><button type='button' class='btn btn- outline btn-success'  onclick='GetSellerProfile("+ FavouriteList[i].sellerProfileID +")'>View</button></td>";
				resultHtml += "</tr>"
			}
		}
	}
	_("buyer_favourite_table").innerHTML = resultHtml;
	OpenModel("buyer_favourite_model");
}

function ValidateBuyerFeilds(isEdit) {
	;
	var isValid = true;
	var result = true;

	isValid = ValidateEmptyField("txtFirstName");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("txtLastName");
	if (isValid == false)
		result = false;
	if (!isEdit) {
		isValid = ValidateEmptyField("txtUsername");
		if (isValid == false)
			result = false;
		else
			isValid = ValidateUsername("txtUsername");
		if (isValid == true)
			result = false;
		isValid = ValidateEmptyField("txtEmail");
		if (isValid == false)
			result = false;
		else
			isValid = ValidateUserEmail("txtEmail");
		if (isValid == true)
			result = false;

		isValid = validatePassword();
		if (isValid == false)
			result = false;
	}


	return result;
}

function ValidateBuyerAddressFeilds(isEdit) {
	var isValid = true;
	var result = true;

	isValid = ValidateEmptyField("ddlAddressType");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("txtPostCode");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("txtStreetAddress");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("address_country");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("address_city");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("txtLastName");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("txtLastName");
	if (isValid == false)
		result = false;

	return result;
}

bu.Delete= function (ID) {
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminBuyer/DeleteBuyer',
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
				errorCLog("Delete Buyer :" + errorThrown + textStatus);
			}//end error
		});
	}
}

bu.MarkActive = function (ID, isActive) {

	var parameters = { 'id': String(ID), 'isActive': isActive };
	$.ajax({
		url: baseURL + 'AdminBuyer/MarkActiveBuyer',
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
			errorCLog("Mark Buyer Active :" + errorThrown + textStatus);
		}//end error
	});
}

function GetSellerProfile(id)
{
	location.href = baseURL + "/AdminBuyer/SellerDetail/?id=" + id;
}

bu.GetBuyerProfile = function (ID) {
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminBuyer/GetBuyer', 
			type: 'POST',
			data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data, textStatus, jqXHR) {
				
				var response = null;
				if (data)
					if (data.obj) {
						response = data.obj;
						bu.SetFieldData(response);
					}
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Buyer Favourites :" + errorThrown + textStatus);
			}//end error
		});
	}
}

bu.CreateBuyer= function () {
    var buyer = bu.GetFieldData();

	var parameters = { 'obj': buyer };
		$.ajax({
			url: baseURL + 'AdminBuyer/Create',
			type: 'POST',
			data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			//async:true,
           // async: false,
			success: function (data, textStatus, jqXHR) {
				var response = null;
				if (data)
				{
					if (data.obj)
                    {

                        response = data.obj;
                        if (response == 4) {
                           toastr.error("Email already exists!");
                            return false;
                        }
                        if (response == 5) {
                            toastr.error("Username already exists!");
                            return false;
                        }
                        if (response == 1) {
                            if (buyer.profileID > 0)
                                toastr.success("Buyer profile updated successfully!");
                            else toastr.success("Buyer profile created successfully!");

                           sleep(1000);

                            url = baseURL + '/AdminBuyer/Index';
                            window.location = url;


                        }
                       
                    
					}
                }
          
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Buyer Favourites :" + errorThrown + textStatus);
			}//end error
    });
    return false;
	}

bu.SetFieldData= function(obj) {
	if (obj) {
		if (obj.profileID)
			_set('txtProfileID', obj.profileID);
		if (obj.username)
			_set('txtUsername', obj.username);
		if (obj.firstName)
			_set('txtFirstName', obj.firstName);
		if (obj.middleName)
			_set('txtMiddleName', obj.middleName);
		if (obj.lastName)
			_set('txtLastName', obj.lastName);
		if (obj.password)
			_set('txtPassword', obj.password);
		if (obj.phoneNumber)
			_set('txtPhoneNumber', obj.phoneNumber);
		if (obj.mobile)
			_set('txtMobile', obj.mobile);
		if (obj.titleID)
			_setSelect('ddlTitle', obj.titleID);
		if (obj.genderID)
			_setSelect('ddlGender', obj.genderID);
		if (obj.genderID)
			_setSelect('ddlMaritalStatus', obj.maritalStatusID);
		if (obj.email)
			_set('txtEmail', obj.email);
	
		if (obj.DOBTicks)
			_set('txtDOB', transformDate(obj.DOBTicks));
		if (obj.profilePhoto)
			$(".profile-pic").attr("src", baseURL + "/Uploads/ProfilePictures/" + obj.profilePhoto);
		if (obj.addressList) {
			buyerAddressList = obj.addressList;
			bu.CreateAddressTable(obj.addressList);
		}
	}
}

bu.ClearFieldData=function() {
	
	_set('txtProfileID', "");
	_set('txtUsername', "");
	_set('txtFirstName', "");
	_set('txtMiddleName', "");
	_set('txtLastName', "");
	_set('txtPassword', "");
	_set('txtConfirmPassword', "");
	_set('txtPhoneNumber', "");
	_set('txtMobile', "");
	_setSelect('ddlTitle', "0");
	_setSelect('ddlMaritalStatus', "0");
	_setSelect('ddlGender', "0");
	_set('txtEmail',"");
	_set('txtDOB', "");
	$(".profile-pic").attr("src", baseURL + "/Content/images/" + obj.profilePhoto);
}

bu.ClearAddressData=function() {
	_set('address_country', '');
	_set('address_city', '');
	_set('txtStreetAddress', '');
	_set('txtPostCode', '');
	_set('txtCountryID', '');
	_set('txtCityID', '');
	_setSelect('ddlAddressType', '0');
}

bu.GetFieldData=function() {
	Buyer = {};
	//;
	Buyer.profileID = _get('txtProfileID');
	Buyer.username = _get('txtUsername');
	Buyer.firstName = _get('txtFirstName');
	Buyer.middleName = _get('txtMiddleName');
	Buyer.lastName = _get('txtLastName');
	Buyer.Password = _get('txtPassword');
	Buyer.phoneNumber = _get('txtPhoneNumber');
	Buyer.mobile = _get('txtMobile');
	Buyer.titleID = _getSelect('ddlTitle');
	Buyer.genderID = _getSelect('ddlGender');
	Buyer.maritalStatusID = _getSelect('ddlMaritalStatus');
	Buyer.email = _get('txtEmail');
	Buyer.DOB = _get('txtDOB');
	Buyer.profilePhoto = _get('txtProfilePic');
	Buyer.addressList = buyerAddressList;

	return Buyer;
}

bu.GetAddressData = function () {

	UserAddress = {};
	UserAddress.addressType = _getSelectName('ddlAddressType');
	UserAddress.addressTypeID = _getSelect('ddlAddressType');
	UserAddress.postalCode = _get('txtPostCode');
	UserAddress.address = _get('txtStreetAddress');
	UserAddress.countryID = _get('txtCountryID');
	UserAddress.country = _get('address_country');
	UserAddress.cityID = _get('txtCityID');
	UserAddress.city = _get('address_city');

	return UserAddress;
}

bu.CreateAddressTable = function (list) {
	resultHtml = "<tr><td colspan='5'> No record found </td></tr>";
	if (list != null) {
		if (list.length > 0) {
			resultHtml = "";
			for (var i =list.length-1; i >=0 ; i--) {

				resultHtml += "<tr>"
				resultHtml += "<td>" + list[i].addressType + "</td>";
				resultHtml += "<td>" + list[i].address + "</td>";
				resultHtml += "<td>" + list[i].city + "</td>";
				resultHtml += "<td>" + list[i].country + "</td>";
				resultHtml += "<td>" + list[i].postalCode + "</td>";
				resultHtml += "</tr>"
			}
		}
	}
	_("tblBuyerAddress").innerHTML = resultHtml;

}

bu.AddAddressToList = function ()
{
	var address = {};
	address = bu.GetAddressData();
	buyerAddressList.push(address);
	bu.CreateAddressTable(buyerAddressList);
}

bu.GetSellerProfile = function (ID) {
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminSeller/GetSeller',
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
				bu.SetSellerFields(response);


			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Set Seller Details :" + errorThrown + textStatus);
			}//end error
		});
	}

}

bu.SetSellerFields = function (obj)
{
	//;
	if (obj) {
		if (obj.profile.profileID)
			//_setIn('txtProfileID', obj.profile.profileID);
		if (obj.profile.username) {
			_setIn('txtUsername', obj.profile.username);
			_setIn('lblUsername', obj.profile.username);
		}
		if (obj.profile.firstName)
			_setIn('txtFirstName', obj.profile.firstName);
		if (obj.profile.middleName)
			_setIn('txtMiddleName', obj.profile.middleName);
		if (obj.profile.lastName)
			_setIn('txtLastName', obj.profile.lastName);
		if (obj.profile.titleName)
			_setIn('txtTitleName', obj.profile.titleName);
		if (obj.profile.phoneNumber)
			_setIn('txtPhoneNumber', obj.profile.phoneNumber);
		if (obj.profile.mobile)
			_setIn('txtMobile', obj.profile.mobile);
		if (obj.profile.email)
			_setIn('txtEmail', obj.profile.email);
		if (obj.profile.maritalStatusName)
			_setIn('txtMSName', obj.profile.maritalStatusName);
		if (obj.NICNumber)
			_setIn('txtNIC', obj.NICNumber);
		if (obj.profile.gender)
			_setIn('txtGender', obj.profile.gender);
		if (obj.nationality)
			_setIn('txtNationality', obj.nationality);
		if (obj.religion)
			_setIn('txtReligion', obj.religion);
		if (obj.displayTitle)
			_setIn('txtDisplayTitle', obj.displayTitle);
		if (obj.deliveryRange)
			_setIn('txtDRange', obj.deliveryRange);
		if (obj.description)
			_setIn('txtDescription', obj.description);
		if (obj.registrationStatus)
			_setIn('txtRegStatus', obj.registrationStatus);
	
		if (obj.profile.DOBTicks)
			_setIn('txtDOB', transformDate(obj.profile.DOBTicks));

		if (obj.profile.profilePhoto)
			$("#profilePhoto").attr("src", baseURL + "/Uploads/ProfilePictures/" + obj.profile.profilePhoto);

		if (obj.bannarPhoto)
			$("#bannarPhoto").attr("src", baseURL + "/Uploads/Banners/" + obj.bannarPhoto);

		if (obj.address) {
			if (obj.address.address)
				_setIn('txtAddress', obj.address.address);
			if (obj.address.city)
				_setIn('txtCity', obj.address.city);
			if (obj.address.country)
				_setIn('txtCountry', obj.address.country);
			if (obj.address.postalCode)
				_setIn('txtPostalCode', obj.address.postalCode);

		}
	}

}

function _setIn(elementID, value) {
	if (typeof value != "undefined") {
		if (value != null) {
			if (typeof document.getElementById(elementID) != "undefined" && document.getElementById(elementID) != null)
				document.getElementById(elementID).innerHTML = value;
		}
	}
}

bu.SetDashboard = function (username, photo, desc) {
    if (username)
        _setIn('spnUsername', username);
    if (desc)
        _setIn('spnDescription', desc);

    if (photo) {
        $('#logoProfilePic').attr('src', baseURL + '/Uploads/ProfilePictures/thumb-70/' + photo);
        $('#imgPhoto').attr('src', baseURL + '/Uploads/ProfilePictures/thumb-200/' + photo);
    }
    else {
        $('#logoProfilePic').attr('src', baseURL + '/Content/images/default/150x150-profilePic.jpg');
        $('#imgPhoto').attr('src', baseURL + '/Content/images/default/150x150-profilePic.jpg');
    }
}
