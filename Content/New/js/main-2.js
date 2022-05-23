

jQuery(document).ready(function ($) {
    $('.PhoneMask').mask("0000-0000000");
    //open (or close) submenu items in the lateral menu. Close all the other open submenu items.
    $('.item-has-children').children('a').on('click', function (event) {
        event.preventDefault();
        $(this).toggleClass('submenu-open').next('.sub-menu').slideToggle(200).end().parent('.item-has-children').siblings('.item-has-children').children('a').next('.sub-menu').slideUp(200);
    });
    $('.menu-mobile ul li a').on('click', function () {
        $('.btn-show-menu-mobile-admin').trigger("click");
        $('.btn-show-menu-mobile').trigger("click");
    })
    $('.menu-mobile ul li a').on('click', function () {
        $('.btn-show-menu-mobile').trigger("click");
    })

    $('.SearchQuery').on('keyup', function (e) {
        
        if (e.which === 13) {
            MainSearch();
        }
    });
});
$('#myDropdown').on('hide.bs.dropdown', function () {
    return false;
});

function _getCheckbox(elementID) {

    if (document.getElementById(elementID).checked) {
        return true;
    } else {
        return false;
    }
}

function _setCheckbox(elementID, value) {
    $("#" + elementID).prop("checked", value);
    if (value)
        $("#" + elementID).attr("checked", true);
    else $("#" + elementID).removeAttr("checked", value);
    //document.getElementById(elementID).checked = value;
}



var _defaultFont = "";
$.ajaxSetup({
    statusCode: {
        401: function () {
            $("#session-alert").modal('show');
        }
    }
});
function blockUI() {
    $(".overlay").show()
}
function unblockUI() {
    $(".overlay").hide();
}
function sessionExpired(ref) {
    window.location = "../Home/NewPark";

    $(ref).modal('hide');
}
function showUpdateMessage() {
    return $().toastmessage('showToast', {
        text: "Updated",
        sticky: false,
        position: 'bottom-right',
        type: 'warning'

    });
}
function underDevelopement() {
    return $().toastmessage('showToast', {
        text: "Under Development",
        sticky: false,
        position: 'bottom-right',
        type: 'warning'

    });
}
function successToast() {
    return $().toastmessage('showToast', {
        text: "Updated",
        sticky: false,
        position: 'bottom-right',
        type: 'success'

    });
}
function showErrorToast(text) {
    return $().toastmessage('showToast', {
        text: text,
        sticky: false,
        position: 'bottom-right',
        type: 'error'

    });
}
function showSuccessToast(text) {
    return $().toastmessage('showToast', {
        text: text,
        sticky: false,
        position: 'bottom-right',
        type: 'success'

    });
}
function showWarningToast(text) {
    return $().toastmessage('showToast', {
        text: text,
        sticky: false,
        position: 'bottom-right',
        type: 'warning'

    });
}
function errorToast() {
    return $().toastmessage('showToast', {
        text: "Failed",
        sticky: false,
        position: 'bottom-right',
        type: 'error'

    });
}



function handleErrors(status, response) {
    unblockUI();
    if (status === "401") {
        if (window.confirm("Yours session has been expired")) {
            window.location.href = "/Home/Index";
        }
    }
    else {
        unblockUI();
        toastr.error("failed.");
        console.error(response);
    }
}

function showSellerDashboard() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/Dashboard',
        async: true,
        success: function (data) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {

            handleErrors(textStatus, jqXHR.responseText);
        }
    });

}

function SellerMyOrder() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/MyOrder',
        async: true,
        success: function (data) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function SellerOrderReceived() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/OrderReceived',
        async: true,
        success: function (data, textStatus, xhr) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function SellerPackages() {
    $('.modal').modal('hide');
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/Packages',
        async: true,
        success: function (data, textStatus, xhr) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function AddEditWeeklyPackage(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/AddEditWeeklyPackage/?id=' + id,
        async: true,
        success: function (data, textStatus, xhr) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function AddEditMonthlyPackage(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/AddEditMonthlyPackage/?id=' + id,
        async: true,
        success: function (data, textStatus, xhr) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            
            handleErrors(textStatus);
        }
    });

}



function showPersonalnfo(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/EditProfile?id=' + id,
        async: true,
        success: function (data) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function CreateFoodItem(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/CreateFoodItem',
        async: true,
        success: function (data) {

            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function AddEditDeal(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/AddEditDeal',
        async: true,
        success: function (data) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {

            handleErrors(textStatus);
        }
    });

}

function SellerMenu(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/Menu/?id=0',
        async: true,
        success: function (data) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {

            handleErrors(textStatus);
        }
    });

}


function SellerDashboard(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/Dashboard',
        async: true,
        success: function (data) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}


function changePassword() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/ChangePassword',
        async: true,
        success: function (data) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

var reg = {};
reg.CheckEmail = function (email, hideModel, showModel, prov, username, isSeller, appID, isGoogle, isFacebook) {
    if (email) {
        var parameters = { 'email': String(email), isGoogle, isFacebook };
        $.ajax({
            url: '/Home/CheckEmail',
            type: 'POST',
            data: JSON.stringify(parameters),
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                if (data) {
                    if (data == "Exist") {
                        return toastr.error("Email already exist");
                        return false;
                    }
                    if (prov == true) {
                        reg.JoinTashty(email, username, '', $('#isSeller').val(), appID, isGoogle, isFacebook);
                    }
                    else {
                        $('#' + showModel).modal('show');
                    }
                }

                return true;
            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error(jqXHR.responseText);
            }//end error
        });
    }
    return true;
}

reg.JoinTashty = function (email, username, password, isSeller, appID, isGoogle, isFacebook) {

    if (email) {

        //JoinTashty(string email, string username, string password, bool isSeller, bool isFacebook, bool isGoogle, string AppID)
        var parameters = { 'email': String(email), 'username': String(username), 'password': String(password), 'isSeller': $('#isSeller').val(), 'isFacebook': isFacebook, 'isGoogle': isGoogle, 'AppID': String(appID) };
        $.ajax({
            url: '/Home/JoinTashty',
            type: 'POST',
            data: JSON.stringify(parameters),
            cache: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                if (data)
                    if (data != 0 && data != null && data != undefined) {
                        if (data == "Exist") {
                            toastr.error("Email already exist.");
                        }
                        var id = data.profileID;
                        profileID = id;
                        //alert("Joined successfully");
                        toastr.success("Joined successfully!");

                        var url = '/Seller/Registration/' + data;
                        window.location = url;
                    }
                    else {
                        toastr.error("failed");
                    }

            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                toastr.error("failed with error : " + jqXHR.responseText);
            }//end error
        });
    }
}
function OpenModel(id) {
    $('#' + id).modal('toggle');
}

function CloseModel(id) {
    $('#' + id).modal('toggle');
}
function LoginClient(email, pass, isGoogle, isFacebook, AppID) {
    var parameters = { 'email': email, 'password': pass, 'isFacebook': isFacebook, 'isGoogle': isGoogle, 'AppID': AppID };
    $.ajax({
        url: '/Home/ClientLogin',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data, textStatus, jqXHR) {
            var response = null;
            if (data) {
                toastr.success("Logging In!");
                // updateLoginButtonText("Login");
                //Ladda.stop(document.getElementById('btnLogin'));
                var url = '/Seller/registration/?id=' + data;
                window.location = url;
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
            toastr.error(jqXHR.responseText);
        }//end error
    })
    //return true;
}


function ForgotPassword(email) {
    if (email == '') {
        toastr.error("Please enter email address.");
        return false;
    }
    var parameters = { 'email': email };
    $.ajax({
        url: '/Home/ForgotPassword',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data, textStatus, jqXHR) {
            var response = null;
            if (data) {
                toastr.success("Email has been sent successfully.");
                CloseModel("ForgotPassword");
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error(jqXHR.responseText);
        }
    });
    //return true;
}

function RecoverPassword(UserID, Password) {

    var parameters = { 'UserID': UserID, 'Password': Password };
    $.ajax({
        url: '/Home/RecoverPassword',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data, textStatus, jqXHR) {
            var response = null;
            if (data) {
                toastr.success("Password has been set successfully.");
                window.location.href = "/Home/Index";
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Recover Password." + errorThrown + textStatus);
        }//end error
    });
    //return true;
}



function removeClientImage() {
    $("#fileInput").val("");
    $("#hdnImageString").val("");
    $(".dummy_img_lbl").html('<img class="dummy_img" src="/Content/Images/dummy-image.png" alt="dummy image" />');
    $(".dp-actions").hide();
}


function DiscoverChefsResults(Page, CategoryID) {

    if (CategoryID != null && CategoryID != undefined) {
        $('#CategoryFilter').val(CategoryID);
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/DiscoverChefsResults',
        async: true,
        data: { term: $('#SearchSeller').val(), PageIndex: Page, DeliveryTime: $('#DeliveryTime').val(), CategoryID: $('#CategoryFilter').val() },
        success: function (data) {
            $("#FilteredResult").html("");
            $("#FilteredResult").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });

}

function ChefDetail(SellerID) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/ChefDetail',
        async: true,
        data: { id: SellerID },
        success: function (data) {
            $("#LayoutMain").html("");
            $("#LayoutMain").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });

}


function AddToCartPage(isSeller) {
    var AddTocart = $('#cartItems').val();
    var dealIDs = $('#cartItemsDeal').val();
    var PackageIDs = $('#cartItemsPackage').val();
    if (AddTocart == "" && dealIDs == "" && PackageIDs == "") {
        toastr.error("Please add item into cart first");
        return false;
    }
    if (isSeller) {
        window.location.href = "/Home/Index/?page=AddtoCart";
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/AddToCart',
        async: true,
        data: { mealIDs: AddTocart, dealIDs: dealIDs, PackageIDs, OrderID: $('#OrderID').val() },
        success: function (data) {

            $("#LayoutMain").html("");
            $("#LayoutMain").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });

}

function DiscoveredChef() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/DiscoverChefs',
        async: true,
        data: { /*term: $('#SearchSeller').val(), PageIndex: Page, DeliveryTime: $('#DeliveryTime').val()*/ },
        success: function (data) {
            $("#LayoutMain").html("");
            $("#LayoutMain").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });

}

function DiscoverFoods(term) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/DiscoverFoods',
        async: true,
        data: { term: term },
        success: function (data) {
            $("#LayoutMain").html("");
            $("#LayoutMain").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });

}

function Packages(PackageType) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/Packages',
        async: true,
        data: { PackageType: PackageType },
        success: function (data) {
            $("#LayoutMain").html("");
            $("#LayoutMain").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });

}


function Index() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/Index',
        async: true,
        data: { /*term: $('#SearchSeller').val(), PageIndex: Page, DeliveryTime: $('#DeliveryTime').val()*/ },
        success: function (data) {
            $("#LayoutMain").html("");
            $("#LayoutMain").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });

}

function BecomeASeller() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/BecomeASeller',
        async: true,
        data: { /*term: $('#SearchSeller').val(), PageIndex: Page, DeliveryTime: $('#DeliveryTime').val()*/ },
        success: function (data) {
            $("#LayoutMain").html("");
            $("#LayoutMain").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });

}


function ContactUs() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/ContactUs',
        async: true,
        data: { /*term: $('#SearchSeller').val(), PageIndex: Page, DeliveryTime: $('#DeliveryTime').val()*/ },
        success: function (data) {
            $("#LayoutMain").html("");
            $("#LayoutMain").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });

}

function AddCartItems(mealID, isDeal, isPackage) {
    
    var items = $('#cartItems').val();
    var DealItems = $('#cartItemsDeal').val();
    var PackageItems = $('#cartItemsPackage').val();
    items = items.split(",");
    if (isDeal == undefined || isDeal == null) {
        isDeal = false;
    }
    if (isPackage == undefined || isPackage == null) {
        isPackage = false;
    }
    DealItems = DealItems.split(",");
    for (var i = 0; i < items.length; i++) {
        if (items[i] == mealID) {
            toastr.error("Item already added in cart");
            return false;
        }
    }
    if (isDeal) {
        for (var i = 0; i < DealItems.length; i++) {
            if (DealItems[i] == mealID) {
                toastr.error("Item already added in cart");
                return false;
            }
        }
    }
    PackageItems = PackageItems.split(",");
    if (isPackage) {
        for (var i = 0; i < PackageItems.length; i++) {
            if (PackageItems[i] == mealID) {
                toastr.error("Item already added in cart");
                return false;
            }
        }
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/AddCartItems',
        async: true,
        data: { mealID, isDeal, isPackage, PackageStartDate :$('#PackageStartDate').val() },
        success: function (data) {
            unblockUI();
            toastr.success("Added to cart successfully.");
            if (isPackage) {
                if ($('#cartItemsPackage').val() != "") $('#cartItemsPackage').val($('#cartItemsPackage').val() + "," + mealID);
                else $('#cartItemsPackage').val(mealID);
            }
            else if (isDeal) {
                if ($('#cartItemsDeal').val() != "") $('#cartItemsDeal').val($('#cartItemsDeal').val() + "," + mealID);
                else $('#cartItemsDeal').val(mealID);
            }
            else {
                if ($('#cartItems').val() != "") $('#cartItems').val($('#cartItems').val() + "," + mealID);
                else $('#cartItems').val(mealID);
            }

            var tt = document.getElementById("CartItemsCount");
            var count = $('#CartItemsCount').attr('data-notify');
            count = eval(parseInt(count) + 1);
            $('#CartItemsCount').attr('data-notify', count);
            tt.setAttribute("data-notify", count);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });
}

function OrderReceivedResults(Page) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/OrderReceivedResults',
        async: true,
        data: { CountryID: $('#CountryID').val(), PageIndex: Page, DateFilter: $('#DateFilter').val() },
        success: function (data) {
            $("#ReceivedResult").html("");
            $("#ReceivedResult").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus, jqXHR.responseText);
        }
    });
}

function MainSearch() {

    if ($('.SearchQuery').val() == '') {
        toastr.error("Please enter search query first");
        return false;
    }
    DiscoverFoods($('.SearchQuery').val());
    blockUI();

}

function MainSearchMobile() {

    if ($('.SearchQueryMobile').val() == '') {
        toastr.error("Please enter search query first");
        return false;
    }
    DiscoverFoods($('.SearchQueryMobile').val());
    blockUI();

}

function Notifications(Page) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/Notifications',
        async: true,
        data: { PageIndex: Page },
        success: function (data, textStatus, xhr) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

$(document).ready(function () {
    UpdateNotifications();
    setInterval(function () {
        UpdateNotifications();
    }, 50000);
});

function UpdateNotifications() {
    $('#NotificationsIDs').val('');
    $.ajax({
        type: "GET",
        url: "/Seller/GetTopNotifications",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $('.NotificationsList').html('');
            var readCount = 0;
            var html = "";
            html += "<li class='head text-light bg-dark'>";
            html += "<div class='row'>";
            html += "<div class='col-lg-12 col-sm-12 col-12'>";
            html += "<span>Notifications <span class='notify-round'>" + response.Notifications.length + "</span></span>";
            html += "<a href='#' class='float-right text-light dot'></a>";
            html += " </div></li>";
            if (response != null) {
                var count = 0;
                for (var i = 0; i < response.Notifications.length; i++) {
                    if (response.Notifications[i].isRead == false) {
                        html += "  <li class='notification-box bg-gray'>";
                        count = eval(parseInt(count) + 1);
                        $('#NotificationsIDs').val($('#NotificationsIDs').val() + "," + response.Notifications[i].notificationID);
                    }
                    else {
                        html += "  <li class='notification-box'>";
                    }
                    var tt = document.getElementById("NotificationItemsCount");
                    $('.NotificationItemsCount').attr('data-notify', count);
                    html += " <div class='row'>";
                    html += " <div class='col-lg-3 col-sm-3 col-3 text-center'>";
                    html += " <img src=/uploads/ProfilePictures/" + response.Notifications[i].ProfilePhoto + " class='w-50 rounded-circle'>";
                    html += " </div>";
                    html += " <div class='col-lg-8 col-sm-8 col-8 mrgn-l'>";
                    html += " <div>";
                    html += " <p class='cstm-fnt'>" + response.Notifications[i].notice + " by <strong>" + response.Notifications[i].Sender + "</strong></p></div>";
                    html += "</div></div></li>";
                }
            }
            html += "  <li class='notification-box'>";
            html += "  <a href='/Seller/Index/?Page=Notifications'>See All</a></li>";
            $('#NotificationsList').html(html);

        },
        error: function (jqXHR, textStatus, errorThrown) {

            //handleErrors(textStatus);
        }
    });
}

function EditFoodItem(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/EditFoodItem',
        async: true,
        data: { id: id },
        success: function (data, textStatus, xhr) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function EditDeal(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/AddEditDeal',
        async: true,
        data: { id: id },
        success: function (data, textStatus, xhr) {
            $("#Pr-settings").html("");
            $("#Pr-settings").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function RemoveMealFileFromServer(id) {
    blockUI();
    $.ajax({
        type: "POST",
        url: '/Seller/RemoveMealFileFromServer',
        async: true,
        data: { id: id },
        success: function (data, textStatus, xhr) {
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function RemoveDealFileFromServer(id) {
    blockUI();
    $.ajax({
        type: "POST",
        url: '/Seller/RemoveDealFileFromServer',
        async: true,
        data: { id: id },
        success: function (data, textStatus, xhr) {
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function DeleteMeal(id) {
    if (confirm("Are you sure you want to delete this?")) {
        blockUI();
        $.ajax({
            type: "POST",
            url: '/Seller/DeleteMeal',
            async: true,
            data: { id: id },
            success: function (data, textStatus, xhr) {
                unblockUI();
                if (data) {
                    toastr.success("Dish Deleted Successfully.");
                    SelerMenu();
                }
                else {
                    toastr.error("Something wrong.");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
}
function DeleteDeal(id) {
    if (confirm("Are you sure you want to delete this?")) {
        blockUI();
        $.ajax({
            type: "POST",
            url: '/Seller/DeleteDeal',
            async: true,
            data: { id: id },
            success: function (data, textStatus, xhr) {
                unblockUI();
                if (data) {
                    toastr.success("Deal Deleted Successfully.");
                    SellerMenu();
                }
                else {
                    toastr.error("Something wrong.");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
}

function SubscribeEmail() {
    if ($('#SubscribeEmail').val() == '') {
        toastr.error("Please Enter email");
        return false;
    }
    //var pattern = /^\b[A-Z0-9._%-]+@@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i

    //if (!pattern.test($('#SubscribeEmail').val())) {
    //    toastr.error('this is not valid email'); return false;
    //}

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/Subscribe',
        async: true,
        data: { Email: $('#SubscribeEmail').val() },
        success: function (data) {
            toastr.success("Email added successfully.");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            toastr.error("Email already subscribed.");
        }//end error
    });

}

function UpdateNotificationsStatus() {
    $('.NotificationItemsCount').attr('data-notify', 0);
    if ($('#NotificationsIDs').val() == '') {
        return false;
    }
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Seller/UpdateNotificationsStatus',
        async: true,
        data: { NotificationsIDs: $('#NotificationsIDs').val() },
        success: function (data) {

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });

}


