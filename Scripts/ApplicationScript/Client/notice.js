var note = {};

note.SetOrderNotice = function (sender, receiver, note, name, isSeller)
{
    var obj = {};
    var currDateTicks = convertToTicks(getCurrentDate());
    obj.senderID = sender;
    obj.receiverID = receiver;
    obj.noticeDateTicks = currDateTicks;
    obj.noticeDateTicks = currDateTicks;
    obj.notice = note;
    obj.isSeller = isSeller;
    obj.title = name;

    return obj;
}

note.AddOrderNotification = function (sender, receiver, notes, name, isSeller) {

    var obj = note.SetOrderNotice(sender, receiver, notes ,name, isSeller);

    var parameters = { 'note': obj };
    $.ajax({
        url: baseURL + 'Home/AddOrderNotice',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            var response = null;
            if (data)
                if (data.obj) {
                    response = data.obj;
                   
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("ViewDealDetial :" + errorThrown + textStatus);
        }//end error
    });
}

note.SetSellerDashboardNotice = function (obj) {
    resultHtml = "";
    if (obj) {
    if (obj.length > 0) {
        _setIn("lnkCountNotice", obj[0].readCount);
        for (var i = 0; i < obj.length; i++) {
            var item = obj[i];
            resultHtml += '<li> <a><div class="social-talk">';
            resultHtml += '<div class="social-profile clearfix"><div class="pull-left p-r"><img  height="32px" width="32px" src="' + baseURL + 'Uploads/ProfilePictures/' + item.logo + '" alt="profile-picture"></div>';
            resultHtml += '<div> <span class="font-bold">' + item.title + '</span> <small class="text-muted">' + transformDate(item.noticeDateTicks) + '</small>';
            resultHtml += '<div class="social-content" style="padding: 0 15px;">' + item.notice + '</div >';
            resultHtml += '</div></div></div> </a> </li>';
        }
        resultHtml += '<li class="summary"><a href="' + baseURL + '/Seller/Notification" class="text-info"> See all notifications </a></li>';
        } else {

        resultHtml += '<li> <a><div class="social-talk">';
        resultHtml += '<div class="social-profile clearfix"><div class="pull-left p-r"><img src="' + baseURL + '/Content/images/Logo-small.png" alt="profile-picture"></div>';
        resultHtml += '<div> <span class="font-bold">Tashty</span> <small class="text-muted"></small>';
        resultHtml += '<div class="social-content" style="padding: 0 15px;"> No Notice Found !</div >';
        resultHtml += '</div></div></div> </a> </li>';
        resultHtml += '<li class="summary"><a href="#" class="text-info">No notifications found </a></li>';
        }
    }
    else {
        _setIn("lnkCountNotice", 0);
        resultHtml += '<li> <a><div class="social-talk">';
        resultHtml += '<div class="social-profile clearfix"><div class="pull-left p-r"><img src="' + baseURL + '/Content/images/Logo-small.png" alt="profile-picture"></div>';
        resultHtml += '<div> <span class="font-bold">Tashty</span> <small class="text-muted"></small>';
        resultHtml += '<div class="social-content" style="padding: 0 15px;"> No Notice Found !</div >';
        resultHtml += '</div></div></div> </a> </li>';
        resultHtml += '<li class="summary"><a href="#" class="text-info">No notifications found </a></li>';
    }
    _setIn('lnkNotice', resultHtml);
}

note.GetSellerDashboardNotice = function () {

    $.ajax({
        url: baseURL + 'Seller/GetSellerDashboardNotice',
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
                    note.SetSellerDashboardNotice(response);
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Get Seller Dashboard Notice :" + errorThrown + textStatus);
        }//end error
    });
}


note.SetBuyerDashboardNotice = function (obj) {
    resultHtml = "";
   
    if (obj) {
        if (obj.length > 0) {
            _setIn("lnkCountNotice", obj[0].readCount);
            for (var i = 0; i < obj.length; i++) {
                var item = obj[i];
                resultHtml += '<li> <a><div class="social-talk">';
                resultHtml += '<div class="social-profile clearfix"><div class="pull-left p-r"><img  height="32px" width="32px" src="' + baseURL + '/Uploads/Banners/' + item.logo + '" alt="profile-picture"></div>';
                resultHtml += '<div> <span class="font-bold">' + item.title + '</span> <small class="text-muted">' + transformDate(item.noticeDateTicks) + '</small>';
                resultHtml += '<div class="social-content" style="padding: 0 15px;">' + item.notice + '</div >';
                resultHtml += '</div></div></div> </a> </li>';
            }
            resultHtml += '<li class="summary"><a href="' + baseURL + '/Buyer/Notification" class="text-info"> See all notifications </a></li>';
        }
        else {

            resultHtml += '<li> <a><div class="social-talk">';
            resultHtml += '<div class="social-profile clearfix"><div class="pull-left p-r"><img src="' + baseURL + '/Content/images/Logo-small.png" alt="profile-picture"></div>';
            resultHtml += '<div> <span class="font-bold">Tashty</span> <small class="text-muted"></small>';
            resultHtml += '<div class="social-content" style="padding: 0 15px;"> No Notice Found !</div >';
            resultHtml += '</div></div></div> </a> </li>';
            resultHtml += '<li class="summary"><a href="#" class="text-info">No notifications found </a></li>';
        }
    }
    else {

        resultHtml += '<li> <a><div class="social-talk">';
        resultHtml += '<div class="social-profile clearfix"><div class="pull-left p-r"><img src="' + baseURL + '/Content/images/Logo-small.png" alt="profile-picture"></div>';
        resultHtml += '<div> <span class="font-bold">Tashty</span> <small class="text-muted"></small>';
        resultHtml += '<div class="social-content" style="padding: 0 15px;"> No Notice Found !</div >';
        resultHtml += '</div></div></div> </a> </li>';
        resultHtml += '<li class="summary"><a href="#" class="text-info">No notifications found </a></li>';
    }

    _setIn('lnkNotice', resultHtml);
}


note.GetBuyerDashboardNotice = function () {

    $.ajax({
        url: baseURL + 'Buyer/GetBuyerDashboardNotice',
        type: 'POST',
      //  data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            var response = null;
            if (data)
                if (data.obj) {
                    response = data.obj;
                    note.SetBuyerDashboardNotice(response);
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetBuyerDashboard Notice :" + errorThrown + textStatus);
        }//end error
    });
}

note.MarkNoticeRead = function (receiverID,isSeller) {
    ;
    var parameters = { 'id': receiverID, 'isSeller': isSeller};
    $.ajax({
        url: baseURL + 'Home/MarkNoitceRead',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
           // var response = null;
            if (data) {
                note.setHeaderCount(isSeller);
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("ViewDealDetial :" + errorThrown + textStatus);
        }//end error
    });
}


note.setHeaderCount = function (isSeller) {
    ;
    if (isSeller) {
        _setIn("lnkCountNotice", 0);
    } else {
        _setIn("lnkCountNotice", 0);
    }
}
