var admin = {};

admin.profileID = 0;
admin.username = "";
admin.firstName = "";

admin.lastName = "";
admin.password = "";
admin.mobile = "";

admin.email = "";
admin.roleID = 0;
admin.role = "";
admin.dateCreatedTicks = 0;
admin.profilePhoto = "";
admin.isActive = true;
admin.isDeleted = false;
admin.dateCreated = "";
admin.dateModified = "";

var adn = {};


adn.GetProfile = function (ID,isView) {
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminUser/GetAdmin',
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
						if (isView)
						{
                            adn.SetViewFieldData(response);

						}
						else
						{
                            adn.SetFieldData(response);
						}
					}
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Buyer Favourites :" + errorThrown + textStatus);
			}//end error
		});
	}
}

adn.GetAUProfile = function (ID, isView) {
    ;
    if (ID) {
        var parameters = { 'id': String(ID) };
        $.ajax({
            url: baseURL + 'AdminUser/GetAdmin',
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
                        if (isView) {
                            adn.SetViewFieldData(response);

                        }
                        else {
                            adn.SetAUFieldData(response);
                        }
                    }
            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                errorCLog("Get Buyer Favourites :" + errorThrown + textStatus);
            }//end error
        });
    }
}

adn.Create = function (isCurrentAdmin) {
    if (isCurrentAdmin)
        var user = adn.GetFieldData();
    else var user = adn.GetAUFieldData();

    var parameters = { 'obj': user, 'isCurrentUser': isCurrentAdmin };
    var urllnk = baseURL + 'AdminUser/Create';
    if (isCurrentAdmin)
        urllnk = baseURL + 'AdminUser/UpdateUserProfile';
	$.ajax({
        url: urllnk,
		type: 'POST',
		data: JSON.stringify(parameters),
		cache: false,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
	//	async: true,
		success: function (data, textStatus, jqXHR) {
			var response = null;
			if (data) {
				if (data.obj) {
                    response = data.obj;
                    //--@vInvalidity 4 Email Already Exists
                    //--@vInvalidity 5 Username Already Exists
                    //--@vInvalidity 6 Username  Email Already Exists
                    //--@vInvalidity 1  Success

                    if (response == 5) {
                        toastr.error("Username already exists!");
                    }
                        if (response == 4) {
                            toastr.error("Email already exists!");
                        }
                            if (response == 6) {
                                toastr.error("Username and email already exists!");
                            }
                                if (response == 1) {
                                    toastr.success("Your profile updated successfully!");
                                    if (isCurrentAdmin)
                                        CloseModel("add-edit-admin-profile");
                                    else CloseModel("add-edit-new-admin-profile");
					}
				}
			}
            if (isCurrentAdmin == false) {
                adn.ClearAUFieldData();
                //$("#dashPhoto").attr("src", baseURL + "/Uploads/ProfilePictures/thumb-70/" + user.profilePhoto);
               
            }

		},//end success
		error: function (jqXHR, textStatus, errorThrown) {
			CloseModel("add-edit-admin-profile");
			errorCLog("Insert new admin:" + errorThrown + textStatus);
		}//end error
	});
}

adn.CreateAdmin = function () {
  
    var user = adn.GetAUFieldData();
    var isAdd = 1;
    if (user.profileID)
         isAdd = 0;

    var parameters = { 'obj': user, 'isCurrentUser': 0 };
    var urllnk = baseURL + 'AdminUser/Create';

    $.ajax({
        url: urllnk,
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
      //  async: true,
        success: function (data, textStatus, jqXHR) {
            var response = null;
            if (data) {
                if (data.obj) {
                    response = data.obj;
                    //--@vInvalidity 4 Email Already Exists
                    //--@vInvalidity 5 Username Already Exists
                    //--@vInvalidity 6 Username  Email Already Exists
                    //--@vInvalidity 1  Success

                    if (response == 5) {
                        toastr.error("Username already exists!");
                    }
                    if (response == 4) {
                        toastr.error("Email already exists!");
                    }
                    if (response == 6) {
                        toastr.error("Username and email already exists!");
                    }
                    if (response == 1) {
                        $('#admin-user-table').DataTable().ajax.reload();
                        if (isAdd)
                            toastr.success("Admin profile created successfully!");
                        else toastr.success("Admin profile updated successfully!");
                        CloseModel("add-edit-new-admin-profile");
                    }
                }
               
            
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            CloseModel("add-edit-admin-profile");
            errorCLog("Insert new admin:" + errorThrown + textStatus);
        }//end error
    });
}

adn.Delete = function (ID) {
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminUser/DeleteAdmin',
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
				errorCLog("Delete Admin :" + errorThrown + textStatus);
			}//end error
		});
	}
}

adn.MarkActive = function (ID, isActive) {

	var parameters = { 'id': String(ID), 'isActive': isActive };
	$.ajax({
		url: baseURL + 'AdminUser/MarkActiveAdmin',
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
			errorCLog("Mark Admin Active :" + errorThrown + textStatus);
		}//end error
	});
}

adn.SetFieldData = function (obj) {
	if (obj) {
		if (obj.profileID)
			_set('txtAdminProfileID', obj.profileID);
		if (obj.username)
			_set('txtAdminUsername', obj.username);
		if (obj.firstName)
			_set('txtAdminFirstName', obj.firstName);
		if (obj.lastName)
			_set('txtAdminLastName', obj.lastName);
		//if (obj.password)
		//	_set('txtAdminPassword', obj.password);
		if (obj.mobile)
			_set('txtAdminMobile', obj.mobile);
		if (obj.email)
			_set('txtAdminEmail', obj.email);
		//if (obj.dateCreatedTicks)
		//	_set('txtAdminDate', transformDate(obj.dateCreatedTicks));
		if (obj.profilePhoto)
            $(".profile-photo").attr("src", baseURL + "/Uploads/ProfilePictures/thumb-200/" + obj.profilePhoto);
		//if (obj.profileID !=0) {
		//	if (obj.profilePhoto)
		//		if (typeof _get(".profile-admin-pic-70") != 'undefined')
		//			$(".profile-admin-pic-70").attr("src", baseURL + "/Uploads/ProfilePictures/thumb-70/" + obj.profilePhoto);
		//}
		
	}
}

adn.SetAUFieldData = function (obj) {
    if (obj) {
        if (obj.profileID)
            _set('txtAUProfileID', obj.profileID);
        if (obj.username)
            _set('txtAUUsername', obj.username);
        if (obj.firstName)
            _set('txtAUFirstName', obj.firstName);
        if (obj.lastName)
            _set('txtAULastName', obj.lastName);
        if (obj.password) {
            _set('txtAUPassword', obj.password);
            _set('txtAUConfirmPassword', obj.password);
        }
        if (obj.mobile)
            _set('txtAUMobile', obj.mobile);
        if (obj.email)
            _set('txtAUEmail', obj.email);
        //if (obj.dateCreatedTicks)
        //    _set('txtAdminDate', transformDate(obj.dateCreatedTicks));
        if (obj.profilePhoto)
            $(".profile-AU-photo").attr("src", baseURL + "/Uploads/ProfilePictures/thumb-200/" + obj.profilePhoto);
      

    }
}

adn.ClearAUFieldData = function () {

    _set('txtAUProfileID', "");
    _set('txtAUUsername', "");
    _set('txtAUFirstName', "");
    _set('txtAULastName', "");
    _set('txtAUPassword', "");
    _set('txtAUConfirmPassword', "");
    _set('txtAUMobile', "");
    _set('txtAUEmail', "");
    //  _set('txtAUDate', "");
    $(".profile-AU-photo").attr("src", baseURL + "/Content/images/profile-default.jpg");
    //$(".profile-admin-pic-70").attr("src", baseURL + "/Content/images/profile-default.jpg");
}

adn.SetViewFieldData = function (obj) {

	if (obj) {

		if (obj.username)
			_setIn('lblAdminUsername', obj.username);
		if (obj.firstName)
			_setIn('lblAdminFirstName', obj.firstName);
		if (obj.lastName)
			_setIn('lblAdminLastName', obj.lastName);
		//if (obj.password)
		//	_setIn('lblAdminPassword', obj.password);
		if (obj.mobile)
			_setIn('lblAdminMobile', obj.mobile);
		if (obj.email)
			_setIn('lblAdminEmail', obj.email);
		if (obj.dateCreatedTicks)
			_setIn('lblAdminDate', transformDate(obj.dateCreatedTicks));
		//if (obj.profilePhoto)
		//	$(".profile-admin-pic-200").attr("src", baseURL + "/Uploads/ProfilePictures/thumb-200/" + obj.profilePhoto);
		if (obj.profilePhoto)
            $(".profile-admin-view-pic-70").attr("src", baseURL + "/Uploads/ProfilePictures/thumb-70/" + obj.profilePhoto);
	}
}

adn.ClearFieldData = function () {

	_set('txtAdminProfileID', "");
	_set('txtAdminUsername', "");
	_set('txtAdminFirstName', "");
	_set('txtAdminLastName', "");
	_set('txtAdminMobile', "");
	_set('txtAdminEmail', "");
	_set('txtAdminDate', "");
	//$(".profile-admin-pic-200").attr("src", baseURL + "/Content/images/profile-default.jpg");
	//$(".profile-admin-pic-70").attr("src", baseURL + "/Content/images/profile-default.jpg");
}

adn.GetFieldData = function () {
	admin = {};

	admin.profileID = _get('txtAdminProfileID');
	admin.username = _get('txtAdminUsername');
	admin.firstName = _get('txtAdminFirstName');
	admin.lastName = _get('txtAdminLastName');
	admin.Password = _get('txtAdminPassword');
    admin.mobile = _get('txtAdminMobile');

	admin.email = _get('txtAdminEmail');
	admin.dateCreated = _get('txtAdminDate');
	admin.profilePhoto = _get('txtAdminProfilePic');

	return admin;
}

adn.GetAUFieldData = function () {
    admin = {};

    admin.profileID = _get('txtAUProfileID');
    admin.username = _get('txtAUUsername');
    admin.firstName = _get('txtAUFirstName');
    admin.lastName = _get('txtAULastName');
    admin.Password = _get('txtAUPassword');
    admin.mobile = _get('txtAUMobile');

    admin.email = _get('txtAUEmail');
    //admin.dateCreated = _get('txtAUDate');
    admin.profilePhoto = _get('txtAUProfilePic');

    return admin;
}

//function _setIn(elementID, value) {
//	if (typeof value != "undefined") {
//		if (value != null) {
//			if (typeof document.getElementById(elementID) != "undefined" && document.getElementById(elementID) != null)
//				document.getElementById(elementID).innerHTML = value;
//		}
//	}
//}