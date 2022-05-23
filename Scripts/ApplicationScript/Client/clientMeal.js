var mealList = [];

var MealID = 0;
var FolderID = 0;
var pID = 0;

var objClientMeal = {};
objClientMeal.categoryID = 0;
objClientMeal.subCategoryID = 0;
objClientMeal.name = "";
objClientMeal.description = "";
objClientMeal.dateCreated = "";
objClientMeal.dateModified = "";
objClientMeal.isActive = true;
objClientMeal.isDeleted = false;
objClientMeal.MealTypesList = [];
objClientMeal.galleryItemList = [];

var ListMealSeller = [];
var ListCategory = [];
var CMeal = {};
var SelectedFolderID = 0;
var SelectedProfileID = 0;
var SelectedFullName = "";
var SelectedDisplayTitle = "";
var OldListGallery = [];
var NewListGallery = [];
var OldListTypes = [];
var NewListTypes = [];

CMeal.GetFieldData = function (isAdmin) {
    var objClientMeal = {};
    //;
    objClientMeal.mealID = _get('txtMealID');
    objClientMeal.profileID = _get('txtProfileID');
    objClientMeal.categoryID = _get('txtCategoryID');
    objClientMeal.subCategoryID = _get('txtSubCategoryID');
    objClientMeal.description = _get('txtDescription');
    objClientMeal.mealTypeID = String(getMealTypeList());
    objClientMeal.title = _get('txtTitle');
    objClientMeal.serving = _get('txtServing');
    objClientMeal.price = _get('txtPrice');
    objClientMeal.monday = _getCheckbox('chkMonday');
    objClientMeal.tuesday = _getCheckbox('chkTuesday');
    objClientMeal.wednesday = _getCheckbox('chkWednesday');
    objClientMeal.thursday = _getCheckbox('chkThursday');
    objClientMeal.friday = _getCheckbox('chkFriday');
    objClientMeal.saturday = _getCheckbox('chkSaturday');
    objClientMeal.sunday = _getCheckbox('chkSunday');
    objClientMeal.isActive = _getCheckbox('chkIsActive');
    objClientMeal.isSpeciality = _getCheckbox('chkIsSpeciality');
    if (isAdmin)
        objClientMeal.isFeature = _getCheckbox('chkIsFeature');
    objClientMeal.galleryItemList = OldListGallery;
    objClientMeal.MealTypesList = OldListTypes;
    return objClientMeal;
}

function getMealTypeList() {

    var items = "";
    if ($("#ddlMealType").val())
        items = $("#ddlMealType").val();
    return items;
}


CMeal.SetFieldData = function (obj, folderID) {

    if (obj) {
        if (obj.mealID) {
            _set('txtMealID', obj.mealID);
            MealID = obj.mealID
        }

        if (obj.displayTitle) {
            _set('displayTitle', obj.displayTitle);
        }
        if (obj.profileID) {
            _set('txtProfileID', obj.profileID);
            pID = obj.profileID;
        }

        if (obj.FolderID) {
            _set('txtFolderID', obj.FolderID);
            FolderID = obj.FolderID;
        }

        if (obj.categoryID) {
            populateSubCategory(obj.categoryID);
            _set('txtCategoryID', obj.categoryID);
            _setSelect('ddlMealCategory', obj.categoryID);
        }

        if (obj.subCategoryID) {
            _set('txtSubCategoryID', obj.subCategoryID);
            _setSelect('ddlMealSubCategory', obj.subCategoryID);
        }

        if (obj.MealTypesList) {

            setMealTypes(obj.MealTypesList);
            OldListTypes = obj.MealTypesList;

        }

        if (obj.galleryItemList) {

            CMeal.CreateGalleryTable(obj.galleryItemList, FolderID);
            OldListGallery = $.extend(true, [], obj.galleryItemList);
            NewListGallery = $.extend(true, [], obj.galleryItemList);;
        }

        if (obj.description)
            _set('txtDescription', obj.description);

        if (obj.mealID)
            _set('txtMealID', obj.mealID);

        if (obj.title)
            _set('txtTitle', obj.title);


        if (obj.serving)
            _set('txtServing', obj.serving);

        if (obj.price)
            _set('txtPrice', obj.price);

        if (obj.monday)
            _setCheckbox('chkMonday', obj.monday);
        if (obj.tuesday)
            _setCheckbox('chkTuesday', obj.tuesday);
        if (obj.wednesday)
            _setCheckbox('chkWednesday', obj.wednesday);
        if (obj.thursday)
            _setCheckbox('chkThursday', obj.thursday);
        if (obj.friday)
            _setCheckbox('chkFriday', obj.friday);
        if (obj.saturday)
            _setCheckbox('chkSaturday', obj.saturday);
        if (obj.sunday)
            _setCheckbox('chkSunday', obj.sunday);

        if (obj.isActive)
            _setCheckbox('chkIsActive', obj.isActive);

        if (obj.isSpeciality)
            _setCheckbox('chkIsSpeciality', obj.isSpeciality);

        if (obj.isFeature)
            _setCheckbox('chkIsFeature', obj.isFeature);

    }
}

function setMealTypes(list) {
    if (list.length > 0) {
        var item = [];
        for (var i = 0; i < list.length; i++) {
            item.push(list[i].typeID);

        }


        $(".js-source-states-2").select2('val', item);
    }
}

CMeal.CreateGalleryTable = function (data, FolderID) {
    resultHtml = "<tr class='even'><td colspan='4'> No record found </td></tr>";
    if (data != null) {
        List = data;
        if (List.length > 0) {
            resultHtml = "";
            for (var i = 0; i < List.length; i++) {

                if (i % 2) {
                    resultHtml += "<tr class='odd'>";
                }
                else { resultHtml += "<tr class='even'>"; }

                resultHtml += "<td><img src='" + baseURL + "/Uploads/Product/" + FolderID + "/thumb-60/" + List[i].filename + "'   class='img-circle m-b' alt='logo' width='80' height='80'></td>";
                resultHtml += "<td>" + List[i].filename + "</td>";
                resultHtml += "<td><i class='fa fa-trash-o demo4' style='cursor:pointer;' aria-hidden='true' onclick='DeleteGalleryItem(" + List[i].galleryID + ",this);'\></td>";
                resultHtml += "</tr>"
            }
        }
    }
    _("tblMealGallery").innerHTML = resultHtml;
}

function DeleteGalleryItem(id, ele) {
    $(ele).closest('tr').remove();
    //;
    if (NewListGallery) {
        for (var i = 0; i < NewListGallery.length; i++) {
            if (NewListGallery[i].galleryID == id) {
                NewListGallery[i].isDeleted = 1;
                break;
            }
        }
    }
}

CMeal.AddUpdateMeal = function (isAdmin) {

    ;
    var objClientMeal = CMeal.GetFieldData(isAdmin);
    //var IsValid = ValidateEmptyField("name");
    //if (IsValid) {
    var parameters = { 'obj': objClientMeal, 'gallery': NewListGallery };
    $.ajax({
        url: baseURL + 'Seller/AddNewMeal',
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
                    if (response == 5) {
                        swal("Meal Item already exists!");
                    }
                    else {
                        if (isAdmin)
                            location.href = baseURL + "/AdminMeal/Index";
                        else location.href = baseURL + "/Seller/MealItems";
                    }
                }
                else { }
            }

        },//end success
        error: function (jqXHR, textStatus, errorThrown) {

            errorCLog("Add New Meal Item :" + errorThrown + textStatus);
        }//end error
    });
    //}
}

CMeal.ClearFieldData = function () {
    //_set('txtCategoryID', '');
    //_set('txtDescription', '');
}

CMeal.GetMeal = function (ID, folderID) {
    //ClearFieldData();
    //;
    if (ID) {
        var parameters = { 'id': String(ID) };
        $.ajax({
            url: baseURL + 'Seller/GetMeal',
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

                        CMeal.SetFieldData(response, folderID);
                    }
                    else { }
                }
            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                errorCLog("Get Meal By ID :" + errorThrown + textStatus);
            }//end error
        });
    }
}

CMeal.DeleteMeal = function (ID) {
    if (ID) {
        var parameters = { 'id': String(ID) };
        $.ajax({
            url: baseURL + 'Seller/DeleteMeal',
            type: 'POST',
            data: JSON.stringify(parameters),
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                toastr.success("Meal Item deleted successfully!");
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
                errorCLog("Delete Meal:" + errorThrown + textStatus);
            }//end error
        });
    }
}

CMeal.MarkActiveMeal = function (ID, isActive) {

    var parameters = { 'id': String(ID), 'isActive': isActive };
    $.ajax({
        url: baseURL + 'Seller/MarkActiveMeal',
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
            errorCLog("Add New Category :" + errorThrown + textStatus);
        }//end error
    });
}

CMeal.MarkFeaturedMeal = function (ID, isActive) {

    var parameters = { 'id': String(ID), 'isActive': isActive };
    $.ajax({
        url: baseURL + 'Seller/MarkFeatureMeal',
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
            errorCLog("Mark Featured Meal:" + errorThrown + textStatus);
        }//end error
    });
}

CMeal.MarkSpecialityMeal = function (ID, isActive) {

    var parameters = { 'id': String(ID), 'isActive': isActive };
    $.ajax({
        url: baseURL + 'AdminMeal/MarkSpecialityMeal',
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
            errorCLog("Mark Speciality Category :" + errorThrown + textStatus);
        }//end error
    });
}

function AddItemInTable(filename, folder, MealID, SellerID) {

    var newItem = { galleryID: 0, galleryTypeID: 1, sellerID: SellerID, mealID: MealID, title: '', filename: String(filename), isActive: 1, isDeleted: 0, dateCreated: '', dateModified: '' };
    //;
    NewListGallery.push(newItem);

    var resultHtml = "";
    resultHtml = "<tr class='even'><td colspan='4'> No record found </td></tr>";
    if (NewListGallery != null) {
        var List = NewListGallery;
        if (List.length > 0) {
            resultHtml = "";
            for (var i = 0; i < List.length; i++) {
                //;
                if (List[i].isDeleted == 0) {
                    //if (i % 2) {
                    //	resultHtml += "<tr class='odd'>";
                    //}
                    //else { resultHtml += "<tr class='even'>"; }
                    resultHtml += "<tr class='odd'>";
                    resultHtml += "<td><img src='" + baseURL + "/Uploads/Product/" + folder + "/thumb-60/" + List[i].filename + "' class='img-circle m-b' alt='logo' width='80' height='80'></td>";
                    resultHtml += "<td>" + filename + "</td>";
                    resultHtml += "<td><i class='fa fa-trash-o demo4' style='cursor:pointer;' aria-hidden='true' onclick='DeleteGalleryItem(" + List[i].galleryID + ",this);'\></td>";
                    resultHtml += "</tr>"
                }
            }
        }
    }

    _("tblMealGallery").innerHTML = resultHtml;

}






