var subCategoryList = [];

var objSubCategory = {};
objSubCategory.subCategoryID = 0;
objSubCategory.categoryID = 0;
objSubCategory.name = "";
objSubCategory.description = "";
objSubCategory.dateCreated = "";
objSubCategory.dateModified = "";
objSubCategory.isActive = true;
objSubCategory.isDeleted = false;

var SubCat = {};
var ListCategories = [];
SubCat.GetFieldData = function ()
{
	objSubCategory = {};
	objSubCategory.subCategoryID = _get('txtSubCategoryID');
    objSubCategory.categoryID = _get('txtCategoryID');
    objSubCategory.name = _get('txtSubCategory');
	objSubCategory.description = _get('txtDescription');

	return objSubCategory;
}

SubCat.SetFieldData=function (obj) {
	////;
	if (obj)
	{
		if (obj.categoryID) {
            _set('txtCategoryID', obj.categoryID);
            _setSelect('ddlCategory', obj.categoryID);
			//setAutocompletCurrentValue('txtCategory', obj.categoryID);
		}
		if (obj.subCategoryID)
			_set('txtSubCategoryID', obj.subCategoryID);
		if (obj.categoryName)
			_set('txtCategory', obj.categoryName);
		if (obj.name)
			_set('txtSubCategory', obj.name);
		if (obj.description)
			_set('txtDescription', obj.description);
	}

}

function setAutocompletCurrentValue(id, value) {
	$(id).val(value);
	var textToShow = $(id).find(":selected").text();
	$(id).parent().find("span").find("input").val(textToShow);
}

SubCat.ClearFieldData = function () {
    ;

	        _set('txtSubCategoryID', '');
            _set('txtCategoryID', '');
           //  _setSelect('ddlCategory', '');

   // $("#ddlCategory option[value='']").attr('selected', 'true');
    $("#ddlCategory").val("");
            _set('txtSubCategory', '');
            _set('txtDescription', '');
	}



SubCat.GetSubCategory = function (ID) {
 
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminSubCategory/GetSubCategory',
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
						SubCat.SetFieldData(response);
					}
					else { }
				}
				},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Sub Category By ID :" + errorThrown + textStatus);
			}//end error
		});
	}
}


SubCat.AddNewSubCategory = function () {
    ;
	var objSubCategory = SubCat.GetFieldData();
	var IsValid = ValidateEmptyField("txtSubCategory");
    var IsValid = ValidateEmptyField("txtCategoryID");
	if (IsValid) {
		var parameters = { 'obj': objSubCategory };
		$.ajax({
			url: baseURL + 'AdminSubCategory/AddNewSubCategory',
			type: 'POST',
			data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
            success: function (data, textStatus, jqXHR) {
                SubCat.ClearFieldData();
				var response = null;
				;
				if (data)
					if (data.obj)
						response = data.obj;
				if (response != null) {
					if (response.length !== 0) {
						if (response == 5) {
							toastr.error("Sub Category Name already exists!");
						}
						else {
							CloseModel("AddEditSubCategoryModel");
							$('#sub-category-table').DataTable().ajax.reload();

						}
					}
					else { }
				}

			},//end success
            error: function (jqXHR, textStatus, errorThrown) {
                SubCat.ClearFieldData();
				CloseModel("AddEditSubCategoryModel");
				errorCLog("Add New Sub Category :" + errorThrown + textStatus);
			}//end error
		});
	}
}


SubCat.DeleteSubCategory = function (ID) {
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminSubCategory/DeleteSubCategory',
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
					if (response.length !==0) {
						//TODO 
					}
					else { }
				}

			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Delete Sub Category :" + errorThrown + textStatus);
			}//end error
		});
	}
}


SubCat.MarkActiveSubCategory = function (ID,isActive) {

		var parameters = { 'id':String(ID),'isActive': isActive };
		$.ajax({
			url: baseURL + 'AdminSubCategory/MarkActiveSubCategory',
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
				errorCLog("Mark Active sub Category :" + errorThrown + textStatus);
			}//end error
		});
}