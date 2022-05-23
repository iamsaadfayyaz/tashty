//registration.js
var sellerPI = {};
var user = {};
var profileID = 0;
var reg = {};
var buyerAddressList = [];
//(response.email, 'join-seller-model', '', 'txtSellerErrorMsg', true, response.name, isSeller, response.id,false,true);
reg.CheckEmail = function (email, hideModel, showModel, msgDiv, prov, username, isSeller, appID, isGoogle, isFacebook) {
    
	_setIn(msgDiv, ''); 
	if (email) {
		var parameters = { 'email': String(email) };
		$.ajax({
			url: '/Home/CheckEmail',
			type: 'POST',
			data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data, textStatus, jqXHR) {
				if (data)
					if (data.data == false) {
                        $('#' + hideModel).modal('hide');
                        if (prov == true) {
                            reg.JoinTashty(email, username, '', isSeller, appID, isGoogle, isFacebook);
                        }
                        else {
                            $('#' + showModel).modal('show');
                        }
                            
						}
                    else {
                        alert("email already exists.");
                        //_setIn(msgDiv, 'email already exists.');
                    }
				return true;
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Check if email already exists:" + errorThrown + textStatus);
			}//end error
		});
	}
	return true;
}

reg.JoinTashty = function (email, username, password, isSeller, appID, isGoogle, isFacebook) {
    
    if (email) {
      //JoinTashty(string email, string username, string password, bool isSeller, bool isFacebook, bool isGoogle, string AppID)
        var parameters = { 'email': String(email), 'username': String(username), 'password': String(password), 'isSeller': isSeller, 'isFacebook': isFacebook, 'isGoogle': isGoogle, 'AppID': String(appID)};
		$.ajax({
			url: '/Home/JoinTashty',
			type: 'POST',
			data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data, textStatus, jqXHR) {
				if (data)
					if (data.id != 0) {
						var id = data.id;
						profileID = id;
						//alert("Joined successfully");
						toastr.success("Joined successfully!");
						if (isSeller == true) {
                            var url = '/Seller/Registration/' + id;
							window.location = url;
						} else {
                            var url = '/Buyer/Registration/' + id;
							window.location = url;
						}
					}
					else { // _setIn(msgDiv, 'email already exists.'); 
					}

			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Join as seller:" + errorThrown + textStatus);
			}//end error
		});
	}
}

reg.GetSellerPersonlInfo = function (countryID) {
	sellerPI = {};
	var addressList = [];
	var objAddress = {};
	sellerPI.profileID = profileID;
	sellerPI.profile = {};
	sellerPI.profile.firstName = _get("txtFirstName");
	sellerPI.profile.lastName = _get("txtLastName");
	sellerPI.profile.titleID = _get("ddlTitle");
	sellerPI.profile.genderID = _getSelect("ddlGender");
	sellerPI.profile.maritalStatusID = _getSelect("ddlMaritalStatus");
	sellerPI.profile.mobile = _get("txtMobile");
	sellerPI.profile.phoneNumber = _get("txtPhone");
    sellerPI.description = _get("txtDescription");
    sellerPI.countryID = countryID;
	objAddress.countryID = _get("hdnCountryID");
	objAddress.cityID = _get("hdnCityID");
	sellerPI.profile.profilePhoto = _get("hdnPFFilename");
	objAddress.address = _get("txtAddress");
	objAddress.postalCode = _get("txtPostalCode");

	//addressList.push(objAddress);
	sellerPI.address = objAddress;

	return sellerPI;
}

reg.SetPersonalInfo = function (obj) {
   // console.log("set personal info:" + JSON.stringify(obj));
    if (obj.address) {
        if (obj.address.countryID) {
            populateCities(obj.address.countryID, ListCities, 'ddlCity');
            _setSelect('ddlCountry', obj.address.countryID);
            _set('hdnCountryID', obj.address.countryID);
        }
        _set('hdnCityID', obj.address.cityID);
        _setSelect('ddlCity', obj.address.cityID);
        _set('txtAddress', obj.address.address);
        _set('txtPostalCode', obj.address.postalCode);
    }
    _set('txtFirstName', obj.firstName);
    _set('txtLastName', obj.lastName);
    _setSelect('ddlTitle', obj.titleID);
    _setSelect('ddlGender', obj.genderID);
    _setSelect('ddlMaritalStatus', obj.maritalStatusID);
    _set('txtMobile', obj.mobile);
    _set('txtPhone', obj.phoneNumber);
    _set('txtDescription', obj.description);
 

    if (obj.profilePhoto) {
        _set('hdnPFFilename', obj.profilePhoto);
        $('.profile-photo').attr('src','/Uploads/ProfilePictures/' + obj.profilePhoto);
    }
    return;
}

reg.SaveSellerPersonalInfo = function (isProfile, countryID) {
    
    var seller = reg.GetSellerPersonlInfo(countryID);
    var parameters = { 'objSeller': seller, 'isEditProfile': isProfile};
	$.ajax({
		url:  '/Seller/SaveSellerPersonalInfo',
		type: 'POST',
		data: JSON.stringify(parameters),
		cache: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: true,
		success: function (data, textStatus, jqXHR) {
			var response = null;
			if (data) {
				if (data.obj) {
					response = data.obj;
					if (response == 1) {
						toastr.success("Your personal information saved successfully.");
                        var url = '/Seller/Dashboard/' + profileID;
                        window.location = url;
					}
				}
			}
		},//end success
		error: function (jqXHR, textStatus, errorThrown) {
			errorCLog("Seller save personal Information." + errorThrown + textStatus);
		}//end error
	});
	return true;
}

reg.setProfileID = function (id) { profileID = id; }

reg.GetSellerWorkInfo = function () {

	sellerPI = {};
	sellerPI.profileID = profileID;
	sellerPI.displayTitle = _get("txtDisplayTitle");
	sellerPI.bannarPhoto = _get("hdnBannerFilename");
	sellerPI.NICNumber = _get("txtCNIC");
	sellerPI.nationality = _get("txtNationality");
	sellerPI.offerDelivery = $("input[name='rdOfferDelivery']:checked").val();
	sellerPI.deliveryRange = _get("txtDeliveryRange");

	return sellerPI;
}

reg.GetSellerInfo = function () {

    sellerPI = {};
    sellerPI.profileID = profileID;
    sellerPI.pickupAddress = _get("pickupAddress");
    sellerPI.txtAccountTitle = _get("txtAccountTitle");
    sellerPI.txtBankName = _get("txtBankName");
    sellerPI.txtAccountNumber = _get("txtAccountNumber");
    sellerPI.txtNationality = _get("txtNationality");
    sellerPI.txtCNIC = _get("txtCNIC");
    sellerPI.txtNTN = _get("txtNTN");
    sellerPI.txtDisplayTitle = _get("txtDisplayTitle");
    sellerPI.txtDescription = _get("txtDescription");
    return sellerPI;
}


reg.SetWorkInfo = function (obj) {
   // console.log("set work info:" + JSON.stringify(obj));
    _set('txtDisplayTitle', obj.displayTitle);
    _set('hdnBannerFilename', obj.bannarPhoto);
    _set('txtCNIC', obj.NICNumber);
    _set('txtNationality', obj.nationality);
    _set('txtDeliveryRange', obj.deliveryRange);

    if (obj.offerDelivery == true) {
        $("#lblOfferYes").addClass("active");
        $("#lblOfferNo").removeClass("active");
        $("input[name=rdOfferDelivery][value='true']").attr('checked', 'checked');
    }
    else {
        $("#lblOfferNo").addClass("active");
        $("#lblOfferYes").removeClass("active");
        $("input[name=rdOfferDelivery][value='false']").attr('checked', 'checked');
    }
    var url2 = '/Uploads/Banners/' + obj.bannarPhoto;
    _("image-preview").style.backgroundImage = "url(" + url2 + ")";
    _("image-preview").style.backgroundRepeat = "no-repeat";
    _("image-preview").style.backgroundSize = "100%";

    return;
}

reg.SaveSellerWorkInfo = function (isProfile) {

	var seller = reg.GetSellerWorkInfo();
    var parameters = { 'objSeller': seller, 'isEditProfile': isProfile };
	$.ajax({
		url: '/Seller/SaveSellerWorkInfo',
		type: 'POST',
		data: JSON.stringify(parameters),
		cache: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: true,
		success: function (data, textStatus, jqXHR) {
			var response = null;
			if (data) {
				if (data.obj) {
					response = data.obj;
					if (response == 1) {
						toastr.success("Your work information saved successfully.");

					}
				}
			}
		},//end success
		error: function (jqXHR, textStatus, errorThrown) {
			errorCLog("Seller save work Information." + errorThrown + textStatus);
		}//end error
	});
	return true;
}

reg.SaveSellerInfo = function (isProfile) {

    var seller = reg.GetSellerInfo();
    var parameters = { 'objSeller': seller, 'isEditProfile': isProfile };
    $.ajax({
        url: '/Seller/SaveSellerInfo',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data, textStatus, jqXHR) {
            var response = null;
            if (data) {
                if (data.obj) {
                    response = data.obj;
                    if (response == 1) {
                        toastr.success("Your information saved successfully.");
                    }
                }
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Seller save work Information." + errorThrown + textStatus);
        }//end error
    });
    return true;
}


reg.GetSellerAccountInfo = function () {

	sellerPI = {};
	sellerPI.profileID = profileID;
	sellerPI.accountTitle = _get("txtAccountTitle");
	sellerPI.accountNumber = _get("txtAccountNumber");
	sellerPI.bankName = _get("txtBankName");

	return sellerPI;
}

reg.SetAccInfo = function (obj) {
   // alert("set account info:" + JSON.stringify(obj));
    _set('txtAccountTitle', obj.accountTitle);
    _set('txtAccountNumber', obj.accountNumber);
    _set('txtBankName', obj.bankName);
    return;
}

reg.SaveSellerAccountInfo = function (IsReg) {

	var seller = reg.GetSellerAccountInfo();
    var parameters = { 'objSeller': seller, 'isReg': IsReg};
	$.ajax({
		url: '/Seller/SaveSellerAccInfo',
		type: 'POST',
		data: JSON.stringify(parameters),
		cache: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: true,
		success: function (data, textStatus, jqXHR) {
			var response = null;
			if (data) {
				if (data.obj) {
					response = data.obj;
					if (response == 1) {
                        toastr.success("Your account information saved successfully.");
                        if (IsReg == 'true'){
                            var url = baseURL + 'Seller/Dashboard/' + profileID;
                            window.location = url;
                        }
					}
				}
			}
		},//end success
		error: function (jqXHR, textStatus, errorThrown) {
			errorCLog("Seller save account Information." + errorThrown + textStatus);
		}//end error
	});
	return true;
}

function ValidateBuyerAddressFeilds(isEdit) {
	var isValid = true;
	var result = true;

	isValid = ValidateEmptyField("ddlAddressType");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("txtPostalCode");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("txtAddress");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("ddlCountry");
	if (isValid == false)
		result = false;
	isValid = ValidateEmptyField("ddlCity");
	if (isValid == false)
		result = false;

	return result;
}

reg.AddAddressToList = function () {
	var address = {};
	address = reg.GetAddressData();
	buyerAddressList.push(address);
	reg.CreateAddressTable(buyerAddressList);
}

reg.GetAddressData = function () {

	UserAddress = {};
	UserAddress.addressType = _getSelectName('ddlAddressType');
	UserAddress.addressTypeID = _getSelect('ddlAddressType');
	UserAddress.postalCode = _get('txtPostalCode');
	UserAddress.address = _get('txtAddress');
	UserAddress.countryID = _getSelect('ddlCountry');
	UserAddress.country = _getSelectName('ddlCountry');
	UserAddress.cityID = _getSelect('ddlCity');
	UserAddress.city = _getSelectName('ddlCity');

	return UserAddress;
}

reg.CreateAddressTable = function (list) {
	resultHtml = "<tr><td colspan='5'><center> No record found </center> </td></tr>";
	if (list != null) {
		if (list.length > 0) {
			resultHtml = "";
			for (var i = list.length - 1; i >= 0; i--) {

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

reg.GetBuyerInfo = function (cID) {
	user = {};
	var addressList = [];
	var objAddress = {};
	user.profileID = profileID;
	user.firstName = _get("txtFirstName");
	user.LastName = _get("txtLastName");
	user.titleID = _get("ddlTitle");
	user.genderID = _getSelect("ddlGender");
	//user.maritalStatusID = _getSelect("ddlMaritalStatus");
	user.mobile = _get("txtMobile");
	user.phoneNumber = _get("txtPhone");
	//user.description = _get("txtDescription");
    user.profilePhoto = _get("hdnPFFilename");
    user.countryID = cID;
	user.addressList = buyerAddressList;

	return user;
}

reg.SaveBuyerInfo = function (isReg, countryID) {
    ;
    var user = reg.GetBuyerInfo(countryID);
	var parameters = { 'objUser': user };
	$.ajax({
		url: baseURL + 'Buyer/SaveBuyerProfile',
		type: 'POST',
		data: JSON.stringify(parameters),
		cache: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		async: true,
        success: function (data, textStatus, jqXHR) {
            ;
			var response = null;
			if (data) {
				if (data.obj) {
					response = data.obj;
					if (response == 1) {
                       
                        if (isReg) {
                            toastr.success("Your profile information saved successfully.");
                            var url = baseURL + 'Buyer/Dashboard/' + profileID;
                            window.location = url;
                        }
                        else toastr.success("Your profile information saved successfully.");
					}
				}
			}
		},//end success
		error: function (jqXHR, textStatus, errorThrown) {
			errorCLog("Buyer save personal Information." + errorThrown + textStatus);
		}//end error
	});
	return true;
}

reg.GetSellerPersonalData = function (ID) {
    
    if (ID) {
        var parameters = { 'id': String(ID) };
        $.ajax({
            url: '/Seller/GetSellerPersonalInfo',
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
                        reg.SetPersonalInfo(response);
                    }
            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                errorCLog("Get Seller Personal Info :" + errorThrown + textStatus);
            }//end error
        });
    }

}

reg.GetSellerWorkData = function (ID) {

    if (ID) {
        var parameters = { 'id': String(ID) };
        $.ajax({
            url: baseURL + 'Seller/GetSellerWorkInfo',
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
                        reg.SetWorkInfo(response);
                    }
            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                errorCLog("Get Seller Work Info :" + errorThrown + textStatus);
            }//end error
        });
    }

}

reg.GetSellerAccData = function (ID) {

    if (ID) {
        var parameters = { 'id': String(ID) };
        $.ajax({
            url: baseURL + 'Seller/GetSellerAccInfo',
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
                        reg.SetAccInfo(response);
                    }
            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                errorCLog("Get Seller Account Info :" + errorThrown + textStatus);
            }//end error
        });
    }

}

reg.SetBuyerInformation = function (obj) {
    if (obj) {
        if (obj.profileID)
            _set('txtProfileID', obj.profileID);
        if (obj.username)
            _set('txtUsername', obj.username);
        if (obj.firstName)
            _set('txtFirstName', obj.firstName);
        if (obj.lastName)
            _set('txtLastName', obj.lastName);
        if (obj.password)
            _set('txtPassword', obj.password);
        if (obj.phoneNumber)
            _set('txtPhone', obj.phoneNumber);
        if (obj.mobile)
            _set('txtMobile', obj.mobile);
        if (obj.titleID)
            _setSelect('ddlTitle', obj.titleID);
        if (obj.genderID)
            _setSelect('ddlGender', obj.genderID);
        //if (obj.genderID)
        //    _setSelect('ddlMaritalStatus', obj.maritalStatusID);
        //if (obj.email)
        //    _set('txtEmail', obj.email);

        //if (obj.DOBTicks)
        //    _set('txtDOB', transformDate(obj.DOBTicks));
        if (obj.profilePhoto)
            $(".profile-photo").attr("src", baseURL + "/Uploads/ProfilePictures/thumb-200/" + obj.profilePhoto);
        if (obj.addressList) {
            buyerAddressList = obj.addressList;
            reg.CreateAddressTable(obj.addressList);
        }
    }
}

reg.GetBuyerInformation = function (ID) {
   
    if (ID) {
        var parameters = { 'id': String(ID) };
        $.ajax({
            url: baseURL + 'Buyer/GetProfileInformation',
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
                        reg.SetBuyerInformation(response);
                    }
            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                errorCLog("Get Buyer Personal Info :" + errorThrown + textStatus);
            }//end error
        });
    }

}
