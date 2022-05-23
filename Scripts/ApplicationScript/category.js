var categoryList = [];

var objCategory = {};
objCategory.categoryID = 0;
objCategory.name = "";
objCategory.description = "";
objCategory.dateCreated = "";
objCategory.dateModified = "";
objCategory.isActive = true;
objCategory.isDeleted = false;

var Cat = {};

function GetFieldData()
{
	objCategory = {};
	objCategory.categoryID = _get('categoryID');
	objCategory.name = _get('name');
	objCategory.description = _get('description');

	return objCategory;
}

function SetFieldData(obj) {
	////;
	if (obj)
	{
		if (obj.categoryID)
			_set('categoryID', obj.categoryID);
		if (obj.name)
			_set('name', obj.name);
		if (obj.description)
			_set('description', obj.description);
	}

}

function ClearFieldData() {
			_set('categoryID', '');
			_set('name', '');
			_set('description', '');
	}



Cat.GetCategory = function (ID) {
	ClearFieldData();
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminCategory/GetCategory',
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
			
						SetFieldData(response);
					}
					else { }
				}
				},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Category By ID :" + errorThrown + textStatus);
			}//end error
		});
	}
}


Cat.AddNewCategory = function () {

	var objCategory = GetFieldData();
	var IsValid = ValidateEmptyField("name");
	if (IsValid) {
		var parameters = { 'obj': objCategory };
		$.ajax({
			url: baseURL + 'AdminCategory/AddNewCategory',
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
							swal("Category Name already exists!");
						}
						else {
							CloseModel("AddEditCategoryModel");
							$('#category-table').DataTable().ajax.reload();

						}
					}
					else { }
				}

			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				CloseModel("AddEditCategoryModel");
				errorCLog("Add New Category :" + errorThrown + textStatus);
			}//end error
		});
	}
}


Cat.DeleteCategory = function (ID) {
	if (ID) {
		var parameters = { 'id': String(ID) };
		$.ajax({
			url: baseURL + 'AdminCategory/DeleteCategory',
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
				errorCLog("Add New Category :" + errorThrown + textStatus);
			}//end error
		});
	}
}


Cat.MarkActiveCategory = function (ID,isActive) {

		var parameters = { 'id':String(ID),'isActive': isActive };
		$.ajax({
			url: baseURL + 'AdminCategory/MarkActiveCategory',
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