var order = {};

order.SetFieldData = function (obj) {
	if (obj) {
		if (obj.categoryID)
			_setIn('hdnOrderID', obj.orderID);
		if (obj.seller)
			_setIn('txtSeller', obj.seller);
		if (obj.buyer)
			_setIn('txtBuyer', obj.buyer);
		if (obj.orderDateTicks)
			_setIn('txtOrderDate', transformDate(obj.orderDateTicks));
		//if (obj.deliveryDateTicks)
		//	_setIn('txtDeliveryDate', transformDate(obj.deliveryDateTicks));
		if (obj.orderDateTicks)
			_setIn('txtOrderTime', transformTime(obj.orderDateTicks));
		if (obj.deliveryDateTicks)
			_set('txtDeliveryTime', transformTime(obj.deliveryDateTicks));
		if (obj.phone)
			_setIn('txtPhone', obj.phone);
		if (obj.mobile)
			_setIn('txtMobile', obj.mobile);
		if (obj.comment)
			_setIn('txtComments', obj.comment);
		if (obj.ratingID) {
			var rate = -1;
			if (obj.ratingID == 1)
				rate = '<span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span>';
			else if (obj.ratingID == 2)
                rate = '<span class="fa fa-star checked"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span>';
			else if (obj.ratingID == 3)
                rate = '<span class="fa fa-star checked"></span> <span class="fa fa-star checked"></span> <span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>';
			else if (obj.ratingID == 4)
                rate = '<span class="fa fa-star checked"></span> <span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>';
			else if (obj.ratingID == 5)
                rate = '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span>';
			else if (obj.ratingID == 6)
                rate = '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span>';;
			_setIn('txtRating', rate);
		}
		if (obj.orderLastStatusID) {
			var status ='';
			if (obj.orderLastStatusID == 1)
				status = '<span class="label label-info p-xxs">' + obj.status +'</span>';
			else if (obj.orderLastStatusID == 2)
				status = '<span class="label label-success p-xxs">' + obj.status +'</span>';
			else if (obj.orderLastStatusID == 3)
				status = '<span class="label btn-primary p-xxs">' + obj.status +'</span>';
			else if (obj.orderLastStatusID == 4)
				status = '<span class="label btn-primary2 p-xxs">' + obj.status +'</span>';
			else if (obj.orderLastStatusID == 5)
				status = '<span class="label label-primary p-xxs">' + obj.status +'</span>';
			else if (obj.orderLastStatusID == 6)
				status = '<span class="label label-warning p-xxs">' + obj.status +'</span>';
			else if (obj.orderLastStatusID == 7)
				status = '<span class="label label-danger2 p-xxs">' + obj.status + '</span>';
			else if (obj.orderLastStatusID == 8)
                status = '<span class="label label-success p-xxs">' + obj.status + '</span>';
            else if (obj.orderLastStatusID == 9)
                status = '<span class="label label-danger2 p-xxs">' + obj.status + '</span>';
			_setIn('txtOrderStatus', status);
		}

		//if (obj.deliveryDateTicks)
		//	_setIn('txtDeliveryTime', transformTime(obj.deliveryDateTicks));
		order.CreateItemsTable(obj.Items);
		order.CreateStatusTable(obj.StatusHistory);
	}

}

order.CreateItemsTable = function (data) {
	resultHtml = "<tr><td colspan='4'> No record found </td></tr>";
	if (data != null) {
		var List = data;
		if (List.length > 0) {
			resultHtml = "";
			for (var i = 0; i < List.length; i++) {
				var isDeal = "";
				if (List[i].isDeal == true) {
					var isDeal = '<div class="checkbox checkbox-primary">' +
						'<input id="checkbox2" checked="" type="checkbox">' +
						'<label for="checkbox2"></label></div>';
				}
				else {
					var isDeal = '<div class="checkbox checkbox-primary">' +
						'<input id="checkbox2" type="checkbox">' +
						'<label for="checkbox2"></label></div>';
				}

				resultHtml += "<tr>"
				resultHtml += "<td>" + List[i].title + "</td>";
				resultHtml += "<td>" + isDeal + "</td>";
				resultHtml += "<td>" + List[i].quantity + "</td>";
				//resultHtml += "<td>" + List[i].comment + "</td>";
				resultHtml += "</tr>"
			}
		}
	}
	_("order_item_table").innerHTML = resultHtml;
}

order.CreateStatusTable = function (data) {
	resultHtml = "<tr><td colspan='4'> No record found </td></tr>";
	
	var List= []
	if (data != null) {
		List = data;
		if (List.length > 0) {
			resultHtml = "";

            for (var i = 0; i < List.length; i++) {

				var status = '';
				if (List[i].orderStatusTypeID == 1)
					status = '<span class="label label-info p-xxs">' + List[i].status + '</span>';
				else if (List[i].orderStatusTypeID == 2)
					status = '<span class="label label-success p-xxs">' + List[i].status + '</span>';
				else if (List[i].orderStatusTypeID == 3)
					status = '<span class="label btn-primary p-xxs">' + List[i].status + '</span>';
				else if (List[i].orderStatusTypeID == 4)
					status = '<span class="label btn-primary2 p-xxs">' + List[i].status + '</span>';
				else if (List[i].orderStatusTypeID == 5)
					status = '<span class="label label-primary p-xxs">' + List[i].status + '</span>';
				else if (List[i].orderStatusTypeID == 6)
					status = '<span class="label label-warning p-xxs">' + List[i].status + '</span>';
				else if (List[i].orderStatusTypeID == 7)
                    status = '<span class="label label-warning p-xxs">' + List[i].status + '</span>';
                else if (List[i].orderStatusTypeID == 8)
                    status = '<span class="label label-success p-xxs">' + List[i].status + '</span>';
				else if (List[i].orderStatusTypeID == 9)
                    status = '<span class="label label-warning p-xxs">' + List[i].status + '</span>';

				resultHtml += "<tr>"
				resultHtml += "<td>" + transformDate(List[i].dateCreatedTicks) + "</td>";
				resultHtml += "<td>" + transformTime(List[i].dateCreatedTicks) + "</td>";
				resultHtml += "<td>" + status + "</td>";
				resultHtml += "</tr>"
			}
		}
	}
	_("order_status_table").innerHTML = resultHtml;

}

order.GetOrderDetail = function (id) {
	if (id) {
		var parameters = { 'id': String(id) };
		$.ajax({
			url: baseURL + 'AdminOrder/GetOrderDetails',
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
						order.SetFieldData(response);
					}
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Order Items :" + errorThrown + textStatus);
			}//end error
		});
	}
}
