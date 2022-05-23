feat = {}

function CalculateAmount (startDate, endDate,rate,currency) {
    const date1 = new Date(startDate);
    const date2 = new Date(endDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log("DateDiff =>" + diffDays);
    var amount = +diffDays * +rate;

    _set("txtAmount", currency + amount);
    return amount;
}

feat.GetRequest = function (rate, currency) {
    ;
    var obj = {};
    const date1 = new Date(_get("txtStartDate"));
    const date2 = new Date(_get("txtEndDate"));
    obj.startDate = convertNewDateToTicks(date1);
    obj.endDate = convertNewDateToTicks(date2);
    obj.amount = CalculateAmount(_get("txtStartDate"), _get("txtEndDate"), rate, currency);
    obj.note = "";
    return obj;
}

feat.AddRequest = function (profileID, ratePerDay, currency) {

    var obj = feat.GetRequest(ratePerDay, currency);

    ;
    var parameters = { 'profileID': profileID, 'startDate': obj.startDate, 'endDate': obj.endDate, 'note': obj.note,'amount': obj.amount};
    $.ajax({
        url: baseURL + 'Seller/AddFeatureRequest',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            $('#order-table').DataTable().ajax.reload();
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

feat.ChangeRequestStatus = function (requestID, statusID ,payed) {

    ;
    var parameters = { 'statusID': statusID, 'requestID': requestID, 'payed': payed };
    $.ajax({
        url: baseURL + 'Seller/ChangeFeatureReqStatus',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            $('#order-table').DataTable().ajax.reload();
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

feat.GetNewPassword = function (profileID) {
    var obj = {};
    obj.ProfileID = profileID;
    obj.OldPassword = _get("txtOldPassword");
    obj.Password = _get("txtPassword");
    obj.ConfirmPassword = _get("txtConfirmPassword");
    return obj;
}

feat.ChangePassword = function (profileID) {

    var obj = feat.GetNewPassword(profileID);
    var parameters = { 'changePasswordModel': obj };
    $.ajax({
        url: '/Seller/ChangePassword',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            //var response = null;
            if (data) {
                var rep = JSON.parse(data)
                if (rep.type) {
                    //response = rep.type;
                    if (rep.type == "SUCCESS")
                        toastr.success("Password changed successfully.");
                    else if (rep.type == "SameOldPassword")
                        toastr.error("Same as old. Please enter different password.");
                    else if (rep.type == "WrongOldPassword")
                        toastr.success("Please enter correct old password.");
                }
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("ViewDealDetial :" + errorThrown + textStatus);
        }//end error
    });
}