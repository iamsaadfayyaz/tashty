var adminDashboard = {};

var oldIncome = '';
var newIncome = '';
var totalIncome = '';
var lastWeekIncome = '';
var todayIncome = '';
var NLSeller = 0;
var PKSeller = 0;
var NLBuyer = 0;
var PKBuyer = 0;
var oldFactDate = '';
var newFactDate = '';
var totalNotice = "";
var totalSeller = "";

var notificationList = [];
var contactUsList = [];
var categoryList = [];
var timelineList = [];


adminDashboard.SetFieldData = function (obj) {

	if (obj)
	{
		if (obj.notificationList) { adminDashboard.CreateNotificationTable(obj.notificationList); }
		if (obj.contactUsList) { adminDashboard.CreateContactUsTable(obj.contactUsList);}
		if (obj.categoryList) { adminDashboard.CreateCategoryTable(obj.categoryList); }
		if (obj.timelineList) { adminDashboard.CreateTimelineTable(obj.timelineList);}
		if (obj.todayIncome) { _setIn('dashTodayIncome', obj.todayIncome); }
		if (obj.totalIncome) { _setIn('dashTotalIncome', obj.totalIncome); }
		if (obj.lastWeekIncome) { _setIn('dashLWIncome', obj.lastWeekIncome); }
	
	 { _setIn('dashNLSeller', obj.NLSeller);}
		 { _setIn('dashPKSeller', obj.PKSeller); }
		{ _setIn('dashNLBuyers', obj.NLBuyer ); }
		{ _setIn('dashPKBuyers', obj.PKBuyer); }
		 { _setIn('dashTotalSeller', obj.totalSeller); }
	}
}

adminDashboard.CreateNotificationTable = function (data) {

	var resultHtml = '<li> <a> No Noctice Send. </a> </li>';
	if (data) {
		if (data.length > 0) {
			resultHtml = "";
			for (var i = 0; i < data.length; i++) {
				if (data[i].isRead) {
					resultHtml += '<li> <a> <span class="label label-danger">NEW</span>' + data[i].title.substring(0, 30) + '...'+' </a> </li>';
				}
				else {
					resultHtml += '<li> <a> <span class="label label-success">SEEN</span>' + data[i].title.substring(0, 30) + '...' + ' </a> </li>';
				}
			}
			
		}
	}
	resultHtml += '<li class="summary"><a href="' + baseURL + '/AdminNotification/Index">See all notifications</a></li >';
	_("notice_item_table").innerHTML = resultHtml;

}

adminDashboard.CreateContactUsTable = function (data) {

	var resultHtml = "<tr><td colspan='4'> No record found </td></tr>";
	if (data) {
		if (data.length > 0) {
			resultHtml = "";
			for (var i = 0; i < data.length; i++) {
				resultHtml += '<div class="panel panel-default"><div class="panel-heading" role="tab" id="headingTwo"><h4 class="panel-title">';
				resultHtml += '<a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i +'"  aria-expanded="false" aria-controls="collapse'+ i +'">';
				resultHtml += data[i].queryType + "</a></h4></div>";
				resultHtml += '<div id="collapse' + i +'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo" aria-expanded="false"><div class="panel-body">';
				resultHtml +=  data[i].query + '</div></div></div>';
			}
		}
	}
	_("accordion").innerHTML = resultHtml;
}

adminDashboard.CreateTimelineTable = function (data) {

	var resultHtml = "<tr><td colspan='4'> No record found </td></tr>";
	if (data) {
		if (data.length > 0) {
			resultHtml = "";
			for (var i = 0; i < data.length; i++) {
				resultHtml += "<tr>"
				resultHtml += "<td>" + data[i].description + "</td>";
				resultHtml += "<td><small><i class='fa fa-calendar'></i>" + transformDate(data[i].dateCreatedTicks)  + "</small></td>";
				resultHtml += "<td><small class='no-padding'><i class='fa fa-clock-o'></i>" + transformTime(data[i].dateCreatedTicks) + "</small></td>";
				resultHtml += "</tr>";
			}
		}
	}
	_("timeline_item_table").innerHTML = resultHtml;

}

adminDashboard.CreateCategoryTable = function (data) {

	var resultHtml = '<div class="list-item"> No record found <div>';
	if (data) {
		if (data.length > 0) {
			resultHtml = "";
			for (var i = 0; i < data.length; i++) {
				resultHtml += '<div class="list-item">';
				
				if (data[i].clevel=='H')
					resultHtml += '<h3 class="no-margins font-extra-bold text-success">' + data[i].totalCount + '</h3>';
				else
					resultHtml += '<h3 class="no-margins font-extra-bold">' + data[i].totalCount + '</h3>';

				resultHtml += '<small>' + data[i].name + '</small></div>';

				if (data[i].clevel == 'H')
					resultHtml += '<div class="pull-right font-bold">' + data[i].percentage+'%<i class="fa fa-level-up text-success"></i></div>';
				else if (data[i].clevel == 'M')
					resultHtml += '<div class="pull-right font-bold">' + data[i].percentage+'%<i class="fa fa-bolt text-color3"></i></div>';
				else
					resultHtml += '<div class="pull-right font-bold">' + data[i].percentage+'% <i class="fa fa-level-down text-color3"></i></div>';
			}
		}
	}
	_("category_item_table").innerHTML = resultHtml;

}


adminDashboard.GetData = function () {

		$.ajax({
			url: baseURL + 'AdminHome/GetAdminDashboardData',
			type: 'POST',
			//data: JSON.stringify(parameters),
			cache: false,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (data, textStatus, jqXHR) {

				var response = null;
				if (data)
					if (data.obj) {
						response = data.obj;
						adminDashboard.SetFieldData(response);
					}
			},//end success
			error: function (jqXHR, textStatus, errorThrown) {
				errorCLog("Get Deal Items :" + errorThrown + textStatus);
			}//end error
		});
	
}
