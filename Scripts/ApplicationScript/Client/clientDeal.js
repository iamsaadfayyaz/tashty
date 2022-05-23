var sellerMealList = [];
var dealItemList = [];
var UpdateddealItemList = [];

var CDeal = {}
CDeal.dealID = 0;
CDeal.profileID = 0;
CDeal.title = "";
CDeal.description = "";
CDeal.photo = "";
CDeal.serving = 0;
CDeal.Price = "";
CDeal.isFeatured = false;
CDeal.dealItemList = [];
CDeal.dateCreated = "";
CDeal.dateModified = "";
CDeal.isActive = true;
CDeal.isDeleted = false;


var objSellerMeal = {};
objSellerMeal.mealID = 0;
objSellerMeal.categoryID = 0;
objSellerMeal.subCategoryID = 0;
objSellerMeal.name = "";
objSellerMeal.description = "";
objSellerMeal.dateCreated = "";
objSellerMeal.dateModified = "";
objSellerMeal.isActive = true;
objSellerMeal.isDeleted = false;


var objDealItem = {};
objDealItem.itemID = 0;
objDealItem.dealID = 0;
objDealItem.mealID = 0;
objDealItem.dateCreated = "";
objDealItem.dateModified = "";
objDealItem.isActive = true;
objDealItem.isDeleted = false;


CDeal.GetFieldData = function (isAdmin) {

    CDeal = {}
    CDeal.dealID = _get('hdnDealID');
    CDeal.profileID = _get('hdnProfileID');
    CDeal.title = _get('txtTitle');
    CDeal.description = _get('txtDescription');
    CDeal.photo = _get('txtPhoto');
    CDeal.serving = _get('txtServing');
    CDeal.Price = _get('txtPrice');
    if (isAdmin)
        CDeal.isFeatured = _getCheckbox('chkIsFeatured');
    CDeal.isActive = _getCheckbox('chkIsActive');
    ;
    CDeal.dealItemList = UpdateddealItemList;

    return CDeal;
}

CDeal.SetFieldData = function (obj) {
    ////;
    if (obj) {
        if (obj.dealID)
            _set('hdnDealID', obj.dealID);
        if (obj.profileID)
            _set('hdnProfileID', obj.profileID);
        if (obj.title)
            _set('txtTitle', obj.title);
        if (obj.description)
            _set('txtDescription', obj.description);
        if (obj.photo) {
            _set('txtPhoto', obj.photo);
            $("#imgPhoto").attr("src", baseURL + '/Uploads/Deal/' + obj.folderID + '/thumb-200/' + obj.photo);
        }
        if (obj.serving)
            _set('txtServing', obj.serving);
        if (obj.Price)
            _set('txtPrice', obj.Price);
        if (obj.isFeatured)
            _setCheckbox('chkIsFeatured', obj.isFeatured);
        if (obj.isActive)
            _setCheckbox('chkIsActive', obj.isActive);
        dealItemList = [];
        if (obj.dealItemList) { dealItemList = obj.dealItemList; CDeal.SetDealItem(obj.dealItemList); }

    }

}

CDeal.ClearFieldData = function () {
    //_set('categoryID', '');
    //_set('name', '');
    //_set('description', '');
    //_set('categoryID', '');
    //_set('name', '');
    //_set('description', '');
}

CDeal.DeleteDeal = function (ID) {
    if (ID) {
        var parameters = { 'id': String(ID) };
        $.ajax({
            url: baseURL + 'Seller/DeleteDeal',
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
                errorCLog("Delete Deal:" + errorThrown + textStatus);
            }//end error
        });
    }
}

CDeal.MarkActiveDeal = function (ID, isActive) {
    ;
    var parameters = { 'id': String(ID), 'isActive': isActive };
    $.ajax({
        url: baseURL + 'Seller/MarkActiveDeal',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        async: true,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
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
            errorCLog("Active Deal :" + errorThrown + textStatus);
        }//end error
    });
}

CDeal.SetDealItem = function (list) {
    ;
    if (list) {
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {

                if (typeof _("mItem" + list[i].mealID) != "undefined")
                    _setCheckbox("mItem" + list[i].mealID, true);

            }
        }
    }

}

CDeal.PopulateMealItems = function (data) {
    ;
    var resultHtml = "<tr><td colspan='4'> No record found </td></tr>";
    if (data) {
        if (data.length > 0) {
            resultHtml = "";
            for (var i = 0; i < data.length; i++) {
                resultHtml += "<tr>"
                //resultHtml += "<td><input data-id=" + data[i].mealID + " id='mItem" + data[i].mealID + "' type='checkbox' name='checkbox2' class='mealItems'/></td>";
                resultHtml += "<td><div class='checkbox checkbox-primary'><input data-id=" + data[i].mealID + " id='mItem" + data[i].mealID + "' type='checkbox' name='checkbox2' class='mealItems'/>  <label for='checkbox2' class=''></label></div></td>";
                resultHtml += "<td>" + data[i].title + "</td>";
                resultHtml += "<td>" + data[i].description + "</td>";
                resultHtml += "<td class='text-success'>" + data[i].price + "</td>";
                resultHtml += "</tr>"
            }
        }
    }

    _("seller_meal_table").innerHTML = resultHtml;
}

CDeal.GetDealSelectedItem = function (id) {

    var objDealItem = {};
    objDealItem.itemID = 0;
    if (dealItemList.length > 0) {
        for (var i = 0; i < dealItemList.length; i++) {
            if (dealItemList[i].mealID == id) {
                objDealItem.itemID = dealItemList[i].itemID;
            }
        }
    }

    objDealItem.dealID = _get("hdnDealId");
    objDealItem.mealID = id;
    objDealItem.isDeleted = false;
    objDealItem.isActive = true;

    return objDealItem;

}

CDeal.AddDealItemList = function (mealId) {
    ;
    var objDealItem = {};
    objDealItem = CDeal.GetDealSelectedItem(mealId);
    if (objDealItem.itemID == 0) {
        UpdateddealItemList.push(objDealItem);

    }
    else { CDeal.RemoveDealItem(mealId); }
}

CDeal.RemoveDealItem = function (mealId) {

    var newList = [];
    for (var i = 0; i < UpdateddealItemList.length; i++) {

        if (UpdateddealItemList[i].mealID == mealId) {

            if (UpdateddealItemList[i].isDeleted == 1) {
                continue;
            }

        }
        else { newList.push(UpdateddealItemList[i]); }
    }
    UpdateddealItemList = newList;
}
CDeal.RemoveDealItemList = function (mealId) {

    var newList = [];
    var found = false;
    for (var i = 0; i < UpdateddealItemList.length; i++) {

        if (UpdateddealItemList[i].mealID == mealId) {
            found = true;
            if (UpdateddealItemList[i].itemID) {
                if (UpdateddealItemList[i].isDeleted == 1) {
                    UpdateddealItemList[i].isDeleted = 1;
                    newList.push(UpdateddealItemList[i]);
                }
            }
        }
        else { newList.push(UpdateddealItemList[i]); }

    }
    if (found == false) {
        for (var i = 0; i < dealItemList.length; i++) {

            if (dealItemList[i].mealID == mealId) {
                if (dealItemList[i].itemID) {
                    if (dealItemList[i].isDeleted == 0) {
                        dealItemList[i].isDeleted = 1;
                        newList.push(dealItemList[i]);
                    }
                }
            }
        }
    }
    UpdateddealItemList = newList;
}

CDeal.GetDeal = function (ID) {
    ;
    if (ID) {
        var parameters = { 'id': String(ID) };
        $.ajax({
            url: baseURL + 'Seller/GetDeal',
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
                        CDeal.SetFieldData(response);
                    }
            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                errorCLog("Get Deal Items :" + errorThrown + textStatus);
            }//end error
        });
    }
}

CDeal.PopulateDealItems = function (data) {
    resultHtml = "<tr><td colspan='4'> No record found </td></tr>";
    if (data) {
        if (data.length > 0) {
            resultHtml = "";
            for (var i = 0; i < data.length; i++) {
                resultHtml += "<tr>"
                resultHtml += "<td>" + data[i].title + "</td>";
                resultHtml += "<td>" + data[i].description + "</td>";
                resultHtml += "<td>" + data[i].serving + "</td>";
                resultHtml += "<td class='text-success'>" + data[i].price + "</td>";
                resultHtml += "</tr>";
            }
        }
    }
    _("deal_item_table").innerHTML = resultHtml;
    OpenModel("view-deal-items");
}

CDeal.GetDealItem = function (ID) {
    if (ID) {
        var parameters = { 'id': String(ID) };
        $.ajax({
            url: baseURL + 'Seller/GetDealItemByID',
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
                        CDeal.PopulateDealItems(response);
                    }
            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                errorCLog("Get Deal Items :" + errorThrown + textStatus);
            }//end error
        });
    }
}

CDeal.CreateDeal = function (isAdmin) {
    var deal = CDeal.GetFieldData(isAdmin);
    var parameters = { 'obj': deal };
    $.ajax({
        url: baseURL + 'Seller/Create',
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
                }
            }
            if (isAdmin)
                var url = baseURL + '/AdminDeal/Index';
            else var url = baseURL + '/Seller/DealItems';

            window.location = url;
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Get Buyer Favourites :" + errorThrown + textStatus);
        }//end error
    });
}

CDeal.SearchMealItem = function () {
    var txt = _get("txtMealItemSearch").toUpperCase();
    var newlist = [];
    if (txt != "") {
        for (var i = 0; i < sellerMealList.length; i++) {
            if (sellerMealList[i].title.toUpperCase().indexOf(txt) > -1) {
                newlist.push(sellerMealList[i]);
            }
        }
        CDeal.PopulateMealItems(newlist);
        CDeal.SetDealItem(dealItemList);

    }
    else {
        CDeal.PopulateMealItems(sellerMealList);
        CDeal.SetDealItem(dealItemList);
    }

}

