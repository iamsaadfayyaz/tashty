var home = {};


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function LoginClient(email, pass, isGoogle, isFacebook, AppID, dashSeller, MealItemAddedInCart, DealItemAddedInCart) {

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

            sleep(500);
            ;
            var response = null;
            if (data) {
                if (data.obj.node) {
                    response = data.obj.node;
                    console.log(JSON.stringify(response));
                    ;
                    if (response != null) {
                        toastr.success("Logging In!");
                        // updateLoginButtonText("Login");
                        //Ladda.stop(document.getElementById('btnLogin'));
                        var profileID = response.profileID;
                        if (MealItemAddedInCart == true) {
                            AddMealtoCart(false, profileID);
                        }
                        else if (DealItemAddedInCart == true) {
                            AddDealtoCarts(false, profileID);
                        }
                        else {
                            if (response.isSeller == true && dashSeller == true) {

                                var url = '/Seller/Dashboard/' + profileID;
                                window.location = url;

                            }
                            else {
                                var url = '/Buyer/Dashboard/' + profileID;
                                window.location = url;
                            }
                        }
                    }
                    else {
                        toastr.error("email/password is not correct.");
                        $('#btnLogin').removeAttr('disabled');
                        $('#btnLogin').removeClass('active');
                    }
                }
                else {
                    toastr.error("email/password is not correct.");
                    $('#btnLogin').removeAttr('disabled');
                    $('#btnLogin').removeClass('active');
                }
            } else {
                toastr.error("email/password is not correct.");
                $('#btnLogin').removeAttr('disabled');
                $('#btnLogin').removeClass('active');
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Seller save account Information." + errorThrown + textStatus);
        }//end error
    });
    //return true;
}


function ForgotPassword(email) {

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

            sleep(500);
            ;
            var response = null;
            if (data) {
                toastr.success("Email has been sent successfully.");
                CloseModel("ForgotPassword");
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Seller save account Information." + errorThrown + textStatus);
        }//end error
    });
    //return true;
}


function RecoverPassword(UserID, Password) {

    var parameters = { 'UserID': UserID, 'Password': Password};
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



home.GetSellerDetail = function (ID) {
    $.blockUI({
        message: '<h1>Please wait...</h1> ',
        css: {
            border: 'none',
            'z-index': '99999',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    });

    var parameters = { 'id': String(ID) };
    $.ajax({
        url: baseURL + 'Home/GetSellerDetail',
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
                    home.SetSellerDetail(response);
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetSearchByCategory :" + errorThrown + textStatus);
        }//end error
    });
}

home.populateMenuCategories = function (objList) {
    //alert("IN");
    var resultHtml = '';
    if (objList.length > 0) {
        for (var i = 0; i < objList.length; i++) {
            resultHtml += '<li> <a  href="#" onclick="foundItem(this);" class="catmenu" data-id="' + objList[i].categoryID + '"  data-value="' + objList[i].name + '"  > ' + objList[i].name + ' </a> </li>';
        }
    }
    _setIn('catMenu', resultHtml);
    return;
}

home.SetSellerDetail = function (obj) {

    var rating = "";
    if (obj.avgRating) {
        if (obj.avgRating == 0)
            rating += '<span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>';
        else if (obj.avgRating == 1)
            rating += '<span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span>';
        else if (obj.avgRating == 2)
            rating += '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span>';
        else if (obj.avgRating == 3)
            rating += '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span>';
        else if (obj.avgRating == 4)
            rating += '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span> <span class="fa fa-star checked"></span> <span class="fa fa-star"></span>';
        else if (obj.avgRating == 5)
            rating += '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span> <span class="fa fa-star checked"></span> <span class="fa fa-star checked"></span>';
    } else { rating += '<span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>'; }
    _setIn('idRating', rating);
    if (obj.profilePhoto)
        $("#imgDisplay").attr("src", baseURL + '/Uploads/ProfilePictures/thumb-70/' + obj.profilePhoto);
    if (obj.bannarPhoto)
        $("#imgBanner").attr("src", baseURL + '/Uploads/Banners/' + obj.bannarPhoto);
    if (obj.displayTitle)
        _setIn('txtDisplayTitle', obj.displayTitle);
    if (obj.description)
        _setIn('txtDescription', obj.description);

    var mealHtml = '';
    var BevHtml = '';
    var DesHtml = '';
    var resultHtml = '';
    var mcount = 0;
    var bcount = 0;
    var dcount = 0;
    ;
    if (obj) {
        home.SetSellerDeals(obj.deals, obj.FolderID, obj.currency);
        if (obj.meals) {
            if (obj.meals.length > 0) {
                for (var i = 0; i < obj.meals.length; i++) {


                    var meal = obj.meals[i];
                    var mtype = "meal";
                    for (var j = 0; j < obj.mealItemType.length; j++) {

                        var type = obj.mealItemType[j];
                        if (meal.mealID == type.mealID) {
                            switch (type.typeID) {
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                case 8:
                                    mtype = "meal";
                                    break;
                                case 6:
                                    mtype = "beverage";
                                    break;
                                case 7:
                                    mtype = "dessert";
                                    break;
                            }
                        }
                        break;
                    }
                    resultHtml = '';
                    resultHtml += '<div class="col-lg-4 col-sm-6 col-xs-6">';
                    if (meal.photo) {
                        resultHtml += '<div class="entry-thumbnail-small"> <img style="width:219px;height:180px" src="' + baseURL + '/Uploads/Product/' + obj.FolderID + '/thumb-200/' + meal.photo + '" class="img-responsive"> </div>';
                    }
                    else resultHtml += '<div class="entry-thumbnail-small"> <img style="width:219px;height:180px" src="' + baseURL + '/Content/images/default/365x220-popularUser.jpg"  class="img-responsive"> </div>';
                    resultHtml += '<div class="p-sm box-description"><h4>' + meal.title + '</h4>';
                    resultHtml += '<p>' + meal.description.substring(0, 45) + '...</p>';
                    resultHtml += '<div class="row"> <div class="col-md-6 col-sm-6 col-xs-7 "><h5 class="text-success">' + obj.currency + meal.price + '</h5> </div>';
                    resultHtml += '<div class="col-md-6 col-sm-6   text-right col-xs-5">';
                    resultHtml += '<button type="button" onclick="home.GetMealDetail(' + meal.mealID + ')" class="btn btn-primary2 btn-sm ">Order Now</button></div>';
                    resultHtml += '</div></div></div>';
                    ;
                    if (mtype == 'meal') {
                        if (mcount == 0)
                            mealHtml += '<div class="row product-container">';
                        else if (mcount % 3 == 0) {
                            mealHtml += '</div>';
                            mealHtml += '<div class="row product-container">';
                        }
                        mealHtml += resultHtml;

                        mcount = mcount + 1;
                    }
                    if (mtype == 'beverage') {
                        if (bcount == 0)
                            BevHtml += '<div class="row product-container">';
                        else if (bcount % 3 == 0) {
                            BevHtml += '</div>';
                            BevHtml += '<div class="row product-container">';
                        }
                        BevHtml += resultHtml;
                        bcount++;
                    }
                    if (mtype == 'dessert') {
                        if (dcount == 0)
                            DesHtml += '<div class="row product-container">';
                        if (dcount % 3 == 0) {
                            DesHtml += '</div>';
                            DesHtml += '<div class="row product-container">';
                        }
                        DesHtml += resultHtml;
                        dcount = dcount + 1;
                    }
                    if (i == (obj.meals.length - 1)) {
                        if (mcount > 0)
                            mealHtml += '</div>';
                        if (bcount > 0)
                            BevHtml += '</div>';
                        if (dcount > 0)
                            DesHtml += '</div>';
                    }
                }

                if (mealHtml != '') {
                    _setIn('mealHtml', mealHtml);
                    $("#secMeal").css("display", "block");
                    $("#lnkMeal").css("display", "block");
                }
                else {
                    $("#secMeal").css("display", "none");
                    $("#lnkMeal").css("display", "none");
                }
                if (BevHtml != '') {
                    _setIn('BevHtml', BevHtml);
                    $("#secBeverage").css("display", "block");
                    $("#lnkBev").css("display", "block");
                }
                else {
                    $("#secBeverage").css("display", "none");
                    $("#lnkBev").css("display", "none");
                }
                if (DesHtml != '') {
                    _setIn('DessHtml', DesHtml);
                    $("#secDessert").css("display", "block");
                    $("#lnkDess").css("display", "block");
                }
                else {
                    $("#secDessert").css("display", "none");
                    $("#lnkDess").css("display", "none");
                }

                $.unblockUI();
            }
            else {
                $("#detailContainer").css("display", "none");
                resultHtml += '<div class="p - sm box - description"><h4>Delicious meals comming Soon !</h4></div>';
                _setIn('container-search-items', resultHtml);
                $.unblockUI();
            }
        }
        else {
            $("#detailContainer").css("display", "none");
            resultHtml += '<div class="p - sm box - description"><h4>Delicious meals comming Soon !</h4></div>';
            _setIn('container-search-items', resultHtml);
            $.unblockUI();
        }

    }
    return;
}

home.SetSellerDeals = function (obj, fold, curr) {
    if (obj) {
        var resultHtml = '';
        if (obj.length > 0) {
            for (var i = 0; i < obj.length; i++) {
                var deal = obj[i];
                if (i == 0)
                    resultHtml += '<div class="row product-container">';
                else if (i % 3 == 0) {
                    resultHtml += '</div>';
                    resultHtml += '<div class="row product-container">';
                }

                resultHtml += '<div class="col-lg-4 col-sm-6 col-xs-6">';
                if (deal.photo)
                    resultHtml += '<div class="entry-thumbnail-small"> <img style="width:219px;height:180px" src="' + baseURL + '/Uploads/Deal/' + fold + '/thumb-200/' + deal.photo + '" class="img-responsive"> </div>';
                else resultHtml += '<div class="entry-thumbnail-small"> <img style="width:219px;height:180px" src="' + baseURL + '/Content/images/default/365x220-popularUser.jpg" class="img-responsive"> </div>';
                resultHtml += '<div class="p-sm box-description"><h4>' + deal.title + '</h4>';
                resultHtml += '<p>' + deal.description.substring(0, 45) + '...</p>';
                resultHtml += '<div class="row"> <div class="col-md-6 col-sm-6 col-xs-7 "><h5 class="text-success">' + curr + deal.Price + '</h5> </div>';
                resultHtml += '<div class="col-md-6 col-sm-6   text-right col-xs-5">';
                resultHtml += '<button type="button" onclick="home.GetDealDetail(' + deal.dealID + ')" class="btn btn-primary2 btn-sm ">Order Now</button></div>';
                resultHtml += '</div></div></div>';

                if (i == obj.length - 1) {
                    resultHtml += '</div>';
                }
            }
            _setIn('dealHtml', resultHtml);
            $("#secDeal").css("display", "block");
            $("#lnkDeal").css("display", "block");
        }

    }
    return;
}

home.SetFeaturedSellers = function (objList, profileID) {
    var resultHtml = '';
    if (objList.length > 0) {
        $("#feat-seller-container").css("display", "block");
        var itemlen = objList.length;
        for (var i = 0; i < objList.length; i++) {
            //for (var t = 0; t < itemlen; t++) {
            resultHtml += '<div class="item">';
            resultHtml += '<div class="hpanel">';
            resultHtml += '<div class="panel-body">';
            resultHtml += '<div class="media"><div class="media-left">';
            if (objList[i].bannarPhoto)
                resultHtml += '<a href="#" onclick="home.ViewSellerDetial(' + objList[i].profileID + ')"><img alt="64x64" class="media-object" style="width: 95px;height: 75px;" src="' + baseURL + '/Uploads/Banners/' + objList[i].bannarPhoto + '" data-holder-rendered="true"> ';
            else resultHtml += '<a href="#" onclick="home.ViewSellerDetial(' + objList[i].profileID + ')"><img alt="64x64" class="media-object" style="width: 95px;height: 75px;" src="' + baseURL + '/Content/images/default/120x100-featuredUser.jpg" data-holder-rendered="true"> ';

            resultHtml += '</a></div><div class="media-body"><h4 class="media-heading">' + texTruncate(objList[i].displayTitle, 30, "...") + '</h4>';
            resultHtml += '<p>' + texTruncate(objList[i].description, 100, "...") + ' </p></div>';
            resultHtml += '</div></div><div class="panel-footer pull-left width100">';
            resultHtml += '<div class="col-sm-8"><i class="fa fa-map-marker" aria-hidden="true"></i> ' + texTruncate(objList[i].address, 50, "...") + '</div>';
            if (profileID > 0)
                resultHtml += '<div class="col-sm-2"><button name="btnAddFav" class="btn btn-success   btn-xs" data-value="' + objList[i].profileID + '" type="button" title="Add to favourites"><i class="fa fa-heart"></i> &nbsp; favourite</button></div><div class="col-sm-4">';
            else resultHtml += '<div class="col-sm-2"><button disabled class="btn btn-success   btn-xs" type="button" title="Logon to add to favourites"><i class="fa fa-heart"></i>&nbsp; Favourite</button></div><div class="col-sm-4">';
            if (objList[i].avgRating == 0)
                resultHtml += '<span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>';
            else if (objList[i].avgRating == 1)
                resultHtml += '<span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span>';
            else if (objList[i].avgRating == 2)
                resultHtml += '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span>';
            else if (objList[i].avgRating == 3)
                resultHtml += '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span> <span class="fa fa-star"></span> <span class="fa fa-star"></span>';
            else if (objList[i].avgRating == 4)
                resultHtml += '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span> <span class="fa fa-star checked"></span> <span class="fa fa-star"></span>';
            else if (objList[i].avgRating == 5)
                resultHtml += '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span> <span class="fa fa-star checked"></span> <span class="fa fa-star checked"></span>';

            resultHtml += '</div></div></div></div>';
            //}

        }
        _setIn('feat-seller-items', resultHtml);
        if (itemlen > 3) {
            ;
            $('.owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
                autoplay: true,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: true
                    },
                    600: {
                        items: 2,
                        nav: true
                    },
                    1000: {
                        items: 3,
                        nav: true,
                        loop: true,
                        margin: 20
                    }
                }
            });
        }
        else {
            $('.owl-carousel').owlCarousel({ margin: 10 });
            //    $('.owl-carousel').owlCarousel({
            //        loop: true,
            //        margin: 10,
            //        autoplay: false,
            //        responsiveClass: true,
            //        responsive: {
            //            0: {
            //                items: 1,
            //                nav: true
            //            },
            //            600: {
            //                items: 2,
            //                nav: true
            //            },
            //            1000: {
            //                items: 3,
            //                nav: true,
            //                loop: false,
            //                margin: 20
            //            }
            //        }
            //    });
        }

    }
    else {
        $("#feat-seller-container").css("display", "none");
    }

    return;
}

home.SetLatestSellers = function (objList, profileID) {
    var resultHtml = '';
    if (objList.length > 0) {
        $("#new-seller-container").css("display", "block");

        for (var i = 0; i < objList.length; i++) {
            resultHtml += '<div class="col-lg-3 col-sm-6 col-xs-6">';
            if (objList[i].bannarPhoto) {
                resultHtml += '<div class="entry-thumbnail-small"><img src="' + baseURL + '/Uploads/Banners/' + objList[i].bannarPhoto + '" class="img-responsive"> </div>';
            }
            else { resultHtml += '<div class="entry-thumbnail-small"><img src="' + baseURL + '/Content/images/default/270x147-latestUser.jpg" class="img-responsive"> </div>'; }
            resultHtml += '<div class="p-sm box-description"><div class="media-body"><h3>' + texTruncate(objList[i].displayTitle, 30, "...") + '</h3>';
            resultHtml += ' <p>' + texTruncate(objList[i].description, 85, "...") + ' </p></div>';
            if (objList[i].offerDelivery == true)
                resultHtml += '<div class="btn btn-primary2 btn-xs">' + objList[i].deliveryRange + ' ' + objList[i].unit + '</div>';
            else resultHtml += '<div class="btn btn-primary2 btn-xs">no delivery</div>';
            resultHtml += '<div class="row" style="margin-top:10px;border-top: 1px solid #e4e5e7; padding-top:6px;">';

            if (profileID > 0)
                resultHtml += '<div class="col-sm-6"><button name="btnAddFav" class="btn btn-default btn-sm" data-value="' + objList[i].profileID + '" type="button" title="Add to favourites"><i class="fa fa-heart"></i> &nbsp; Favourite</button></div>';
            else resultHtml += '<div class="col-sm-6"><button disabled class="btn btn-default btn-sm" type="button" title="Logon to add to favourites"><i class="fa fa-heart"></i>&nbsp; favourite</button></div>';

            resultHtml += '<div class="col-md-6 col-sm-6   text-right col-xs-5">';
            resultHtml += '<button type="button" onclick="home.ViewSellerDetial(' + objList[i].profileID + ')" class="btn btn-success btn-sm ">Order Now</button>';
            resultHtml += '</div></div></div></div>';
        }
        _setIn('new-seller-items', resultHtml);
        $.unblockUI();
    }
    else {
        $("#new-seller-container").css("display", "none");
        $.unblockUI();
    }

    return;
}

home.SetPopularSellers = function (objList, profileID) {
    var resultHtml = '';
    if (objList.length > 0) {
        $("#pop-seller-container").css("display", "block");

        for (var i = 0; i < objList.length; i++) {
            resultHtml += '<div class="col-lg-4 col-sm-6">';
            resultHtml += '<div class="hpanel">';
            resultHtml += '<div class="panel-body no-padding">';
            if (objList[i].bannarPhoto) {
                resultHtml += '<div class="entry-thumbnail"> <img style="height: 215px;" src="' + baseURL + '/Uploads/Banners/' + objList[i].bannarPhoto + '" class="img-responsive"> </div>';
            } else resultHtml += '<div class="entry-thumbnail"> <img style="height: 215px;" src="' + baseURL + '/Content/images/default/365x220-popularUser.jpg" class="img-responsive"> </div>';
            resultHtml += ' <div class="p-sm productdetail"> <h3>' + texTruncate(objList[i].displayTitle, 30, "...") + '</h3>';
            resultHtml += ' <p>' + texTruncate(objList[i].description, 100, "...") + ' </p>';
            resultHtml += '<p style="font-size:13px; padding:6px;" class="gray-bg p"><i class="pe-7s-map-marker"></i> ' + texTruncate(objList[i].address, 50, "...") + '</p>';
            if (objList[i].offerDelivery == true)
                resultHtml += '<div class="btn btn-primary2 btn-sm" style="margin-right:2px;">' + objList[i].deliveryRange + ' ' + objList[i].unit + '</div>';
            else resultHtml += '<div class="btn btn-primary2 btn-sm"  style="margin-right:2px;"> no delivery</div>';

            resultHtml += '<div class="btn btn-default btn-sm">' + objList[i].avgRating + '<i class="fa fa-star" aria-hidden="true"></i> (' + objList[i].ratedCount + ')</div>';
            resultHtml += '<button type="button" onclick="home.ViewSellerDetial(' + objList[i].profileID + ')" class="btn btn-success btn-sm pull-right"  style="margin-left:2px;">Order Now</button>';
            if (profileID > 0)
                resultHtml += '<button name="btnAddFav" class="btn btn-default btn-sm pull-right" data-value="' + objList[i].profileID + '" type="button" title="Add to favourites"><i class="fa fa-heart"></i></button>';
            else resultHtml += '<button disabled class="btn btn-default btn-sm pull-right" type="button" title="Logon to add to favourites"><i class="fa fa-heart"></i></button>';

            resultHtml += '</div></div></div></div>';
        }
        _setIn('pop-seller-items', resultHtml);
    }
    else {
        $("#pop-seller-container").css("display", "none");
    }

    return;
}

home.SetSearchByAddress = function (objList, profileID, address) {
    var resultHtml = '';
    if (objList) {
        if (objList.length > 0) {
            for (var i = 0; i < objList.length; i++) {
                if (i == 0) {
                    resultHtml += '<div class="row product-container">';
                }
                if (i % 3 == 0) {
                    resultHtml += '</div>'
                    resultHtml += '<div class="row product-container">';
                }

                resultHtml += '<div class="col-lg-4 col-sm-6"><div class="hpanel"> <div class="panel-body no-padding">';
                if (objList[i].bannarPhoto)
                    resultHtml += '<div class="entry-thumbnail"> <img style="height: 215px;" src="' + baseURL + '/Uploads/Banners/' + objList[i].bannarPhoto + '" class="img-responsive"> </div>';
                else resultHtml += '<div class="entry-thumbnail"> <img style="height: 215px;" src="' + baseURL + '/Content/images/default/365x220-popularUser.jpg" class="img-responsive"> </div>';
                resultHtml += '<div class="p-sm productdetail"><h3>' + texTruncate(objList[i].displayTitle, 30, "...") + '</h3>';
                resultHtml += '<p>' + texTruncate(objList[i].description, 100, "...") + '</p>';
                resultHtml += ' <h5 class="text-success"> ' + texTruncate(objList[i].address, 50, "...") + '</h5>';
                if (objList[i].offerDelivery == true)
                    resultHtml += '<div class="btn btn-primary2 btn-sm">' + objList[i].deliveryRange + ' ' + objList[i].unit + '</div>';
                else resultHtml += '<div class="btn btn-primary2 btn-sm"> no delivery</div>';
                resultHtml += '<div class="btn btn-default btn-sm">' + objList[i].avgRating + '<i class="fa fa-star" aria-hidden="true"></i> (' + objList[i].ratedCount + ')</div>';
                resultHtml += '<button type="button" onclick="home.ViewSellerDetial(' + objList[i].profileID + ')" class="btn btn-success btn-sm pull-right">Order Now</button>';
                resultHtml += '</div></div></div></div>';

                if (i == objList.length - 1) {
                    resultHtml += '</div>'
                }

            }
            _setIn('container-search-items', resultHtml);
            $.unblockUI();
        }
        else {
            resultHtml += ' <h3 class="text-success"> No service provider found in ' + address + '!</h3>';
            _setIn('container-search-items', resultHtml);
            $.unblockUI();
        }
    } else {
        resultHtml += '<h3 class="text-success"> No service provider found in ' + address + '!</h3>';
        _setIn('container-search-items', resultHtml);
        $.unblockUI();
    }

    return;
}

home.SetSearchByCategory = function (objList, profileID, cat) {
    var resultHtml = '';
    if (objList) {
        if (objList.length > 0) {
            for (var i = 0; i < objList.length; i++) {
                if (i == 0) {
                    resultHtml += '<div class="row product-container">';
                }
                if (i % 3 == 0) {
                    resultHtml += '</div>'
                    resultHtml += '<div class="row product-container">';
                }

                resultHtml += '<div class="col-lg-4 col-sm-6"><div class="hpanel"> <div class="panel-body no-padding">';
                if (objList[i].bannarPhoto)
                    resultHtml += '<div class="entry-thumbnail"> <img style="height: 215px;" src="' + baseURL + '/Uploads/Banners/' + objList[i].bannarPhoto + '" class="img-responsive"> </div>';
                else resultHtml += '<div class="entry-thumbnail"> <img style="height: 215px;" src="' + baseURL + '/Content/images/default/365x220-popularUser.jpg" class="img-responsive"> </div>';
                resultHtml += '<div class="p-sm productdetail"><h3>' + texTruncate(objList[i].displayTitle, 30, "...") + '</h3>';
                resultHtml += '<p>' + texTruncate(objList[i].description, 100, "...") + '</p>';
                resultHtml += ' <h5 class="text-success"> ' + texTruncate(objList[i].address, 50, "...") + '</h5>';
                if (objList[i].offerDelivery == true)
                    resultHtml += '<div class="btn btn-primary2 btn-sm">' + objList[i].deliveryRange + ' ' + objList[i].unit + '</div>';
                else resultHtml += '<div class="btn btn-primary2 btn-sm"> no delivery</div>';
                resultHtml += '<div class="btn btn-default btn-sm">' + objList[i].avgRating + '<i class="fa fa-star" aria-hidden="true"></i> (' + objList[i].ratedCount + ')</div>';
                resultHtml += '<button type="button" onclick="home.ViewSellerDetial(' + objList[i].profileID + ')" class="btn btn-success btn-sm pull-right">Order Now</button>';
                resultHtml += '</div></div></div></div>';

                if (i == objList.length - 1) {
                    resultHtml += '</div>'
                }

            }
            _setIn('container-search-items', resultHtml);
            $.unblockUI();
        }
        else {
            if (cat)
                resultHtml += ' <h3 class="text-success"> No service provider offering ' + cat + ' food !</h3>';
            else resultHtml += ' <h3 class="text-success"> No service provider found !</h3>';
            _setIn('container-search-items', resultHtml);
            $.unblockUI();
        }
    }
    else {
        if (cat)
            resultHtml += ' <h3 class="text-success"> No service provider offering ' + cat + ' food !</h3>';
        else resultHtml += ' <h3 class="text-success"> No service provider found !</h3>';
        _setIn('container-search-items', resultHtml);
        $.unblockUI();
    }

    return;
}

home.GetFeaturedSellers = function (profileID) {
    $.blockUI({
        message: '<h1>Please wait...</h1> ',
        css: {
            border: 'none',
            'z-index': '99999',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    });
    var currDateTicks = convertToTicks(getCurrentDate());
    var country = getCountry();

    var parameters = { 'dateTimeTick': String(currDateTicks), 'country': String(country) };
    $.ajax({
        url: baseURL + 'home/GetFeaturedSellers',
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
                    home.SetFeaturedSellers(response, profileID);

                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetFeaturedSellers :" + errorThrown + textStatus);
        }//end error
    });

}

home.GetLatestSellers = function (profileID) {
    var country = getCountry();

    var parameters = { 'country': String(country) };
    $.ajax({
        url: baseURL + 'home/GetLatestSellers',
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
                    home.SetLatestSellers(response, profileID);
                }

        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            $.unblockUI();
            errorCLog("GetLatestSellers :" + errorThrown + textStatus);
        }//end error
    });
}

home.GetPopularSellers = function (profileID) {
    var country = getCountry();
    // switchVisible();

    var parameters = { 'country': String(country) };
    $.ajax({
        url: baseURL + 'home/GetPopularSellers',
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
                    home.SetPopularSellers(response, profileID);
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetPopularSellers :" + errorThrown + textStatus);
        }//end error
    });
}

home.GetSearchByAddress = function (address, profileID) {
    //$.blockUI({
    //    message: '<h1>Please wait...</h1> ',
    //    css: {
    //        border: 'none',
    //        'z-index': '99999',
    //        padding: '15px',
    //        backgroundColor: '#000',
    //        '-webkit-border-radius': '10px',
    //        '-moz-border-radius': '10px',
    //        opacity: .5,
    //        color: '#fff'
    //    }
    //});
    //alert(address);
    //var add = removeSpecialCharacter(address);
    //alert(add);
    var parameters = { 'address': address };
    $.ajax({
        url: baseURL + 'home/PostSearchByAddress',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data, textStatus, jqXHR) {
            ;
            var response = null;
            if (data)
                if (data.obj) {
                    response = data.obj;
                    home.SetSearchByAddress(response, profileID, address);
                }
                else { home.SetSearchByAddress(null, profileID, address); }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetSearchByAddress :" + errorThrown + textStatus);
        }//end error
    });
}

home.GetSearchByCategory = function (catID, profileID, cat) {
    $.blockUI({
        message: '<h1>Please wait...</h1> ',
        css: {
            border: 'none',
            'z-index': '99999',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    });

    var parameters = { 'catergoryID': String(catID) };
    $.ajax({
        url: baseURL + 'home/SearchByCategory',
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
                    home.SetSearchByCategory(response, profileID, cat);
                }
                else { home.SetSearchByCategory(response, profileID, cat); }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetSearchByCategory :" + errorThrown + textStatus);
        }//end error
    });
}

home.GetMealDetail = function (ID) {
    //$.blockUI({
    //    message: '<h1>Please wait...</h1> ',
    //    css: {
    //        border: 'none',
    //        'z-index': '99999',
    //        padding: '15px',
    //        backgroundColor: '#000',
    //        '-webkit-border-radius': '10px',
    //        '-moz-border-radius': '10px',
    //        opacity: .5,
    //        color: '#fff'
    //    }
    //});

    var parameters = { 'id': String(ID) };
    $.ajax({
        url: baseURL + 'home/GetMealDetail',
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
                    home.SetMealDetail(response);
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetSearchByCategory :" + errorThrown + textStatus);
        }//end error
    });
}

home.GetDealDetail = function (ID) {
    var parameters = { 'id': String(ID) };
    $.ajax({
        url: baseURL + 'home/GetDealDetail',
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
                    home.SetDealDetail(response);
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("ViewDealDetial :" + errorThrown + textStatus);
        }//end error
    });
}

home.SetDealDetail = function (obj) {
    selectedOptions = [];
    _setIn("txtName", obj.title);
    _setIn("txtCat", "Serving - " + obj.serving);
    _setIn("txtDes", obj.description);
    _set("hdnDealID", obj.dealID);
    _setIn("txtPrice", obj.currency + obj.Price);
    _set("hdnDealID", obj.dealID);
    _set("hdnDealTitle", obj.title);
    _set("hdnDealPrice", obj.Price);
    _set("hdnDealActualPrice", obj.Price);
    if (obj.photo)
        $("#imgDeal").attr("src", baseURL + '/Uploads/Deal/' + obj.folderID + '/' + obj.photo);
    else $("#imgDeal").attr("src", baseURL + '/Content/images/default/365x220-popularUser.jpg');

    if (obj.dealItemList) {

        var htmlIn = '';
        if (obj.dealItemList.length > 0) {
            var gal = obj.dealItemList;
            for (var i = 0; i < gal.length; i++) {

                htmlIn += ' <div class="checkbox-success"><span >' + gal[i].title + ' </span ></div>';
            }
            _setIn('listItems', htmlIn);
        }
    }
    OpenModel("modal-deal-detail");
    return;
}

home.SetMealDetail = function (obj) {

    $(".mealhiddenvalue").val("");
    selectedOptions = [];
    _setIn("txtmName", obj.title);
    _setIn("txtmCat", obj.category + " - " + obj.subCategory);
    _setIn("txtmDes", obj.description);
    _set("hdnMealID", obj.mealID);
    _set("hdnMealTitle", obj.title);
    _set("hdnMealPrice", obj.price);
    _set('hdnMealActualPrice', obj.price);


    _setIn("txtmPrice", obj.currency + obj.price);
    var htmlAddOn = '';
    if (obj.AddOnList) {
        var rdiohiden = 0;
        if (obj.AddOnList.length > 0) {
            var addOn = obj.AddOnList;
            var oldAddOnID = 0;
            for (var i = 0; i < addOn.length; i++) {
                var item = addOn[i];

                if (i == 0) {
                    htmlAddOn += '<div class="lsit ">';
                    htmlAddOn += '<div class="well well-sm"><h4 class="font-bold">' + item.title + '</h4></div>';
                    oldAddOnID = item.addOnID
                }
                if (item.addOnID != oldAddOnID) {
                    htmlAddOn += '</div>';
                    htmlAddOn += '<div class="lsit ">';
                    htmlAddOn += '<div class="well well-sm"><h4 class="font-bold">' + item.title + '</h4></div>';
                    oldAddOnID = item.addOnID
                }

                if (item.cntrl == 'radio') {
                    ;
                    if (rdiohiden != item.addOnID) {
                        htmlAddOn += '<input type="hidden" data-id="' + item.optionID + '" class="mealhiddenvalue" id="hdnrdo' + item.addOnID + '"/>';
                        rdiohiden = item.addOnID;
                    }
                    htmlAddOn += '<div class="radio radio-success">';
                    htmlAddOn += '<input type="radio" name="radio' + item.addOnID + '" id="' + item.addOnID + '"  value="' + item.optionID + '" data-id="' + item.optionID + '" data-value="' + item.price + '">';
                    htmlAddOn += '<label for="radio' + item.addOnID + '">' + item.optionTitle + '</label>';
                    htmlAddOn += '</div>';
                } else if (item.cntrl == 'check') {
                    htmlAddOn += '<div class="checkbox checkbox-success">';
                    htmlAddOn += '<input  id="check' + item.optionID + '" value="' + item.optionID + '" type="checkbox" data-id="' + item.optionID + '"  data-value="' + item.price + '">';
                    htmlAddOn += '<label> ' + item.optionTitle + '</label>';
                    //htmlAddOn += '<input  value="' + item.optionID + '" type="checkbox"  checked data-toggle="toggle" data-id="' + item.optionID + '"  data-value="' + item.price + '">';
                    //htmlAddOn += '<label> ' + item.optionTitle + '</label>';
                    //htmlAddOn += '<input  id="' + item.optionID + '" value="' + item.optionID + '" type="checkbox"  data-id="' + item.optionID + '"  data-value="' + item.price + '"">';
                    //htmlAddOn += '<label for="' + item.optionID + '"> ' + item.optionTitle + '</label>';
                    htmlAddOn += '</div>';
                }


                if (i == addOn.length - 1) {
                    htmlAddOn += '</div>';
                }
            }
        }
        _setIn('ListAddOns', htmlAddOn);
    }
    if (obj.galleryItemList) {
        var htmlIn = '';
        if (obj.galleryItemList.length > 0) {
            var gal = obj.galleryItemList;
            for (var i = 0; i < gal.length; i++) {
                var item = gal[i];
                htmlIn += '<li data-thumb="' + baseURL + '/Uploads/Product/' + obj.FolderID + '/thumb-60/' + item.filename + '">';
                htmlIn += '<img src="' + baseURL + '/Uploads/Product/' + obj.FolderID + '/thumb-200/' + item.filename + '" /> </li>';
            }
            _set("hdnCount", gal.length);


            _setIn('lightSlider', htmlIn);

            slider = $('#lightSlider').lightSlider({
                gallery: true,
                item: 1,
                thumbItem: gal.length,
                loop: true,
                slideMargin: 0,
            });
            slider.refresh();
            //slider.destroy();
        }

    }
    else {
        htmlIn += '<li data-thumb="' + baseURL + '/Content/images/default/365x220-popularUser.jpg';
        _setIn('lightSlider', htmlIn);
    }


    OpenModel("modal-meal-detail");
    return;

}

home.ViewSellerDetial = function (sellerID) {
    console.log("In View Seller Detail: " + sellerID);
    localStorage.setItem("SearchSelID", sellerID);
    var url = baseURL + 'Home/SellerProfile';
    window.location = url;
};

home.ViewAddressSearch = function (address) {

}

home.GetBuyerSearch = function (obj, profileID) {

    $.blockUI({
        message: '<h1>Please wait...</h1> ',
        css: {
            border: 'none',
            'z-index': '99999',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        }
    });
    var country = getCountry();
    //(string seller, string catergoryID,string address,string meal, string country)
    var parameters = { 'seller': String(obj.seller), 'catergoryID': String(obj.category), 'address': String(obj.address), 'meal': String(obj.meal), 'country': String(country) };
    $.ajax({
        url: baseURL + 'home/SearchByBuyer',
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

                    if (obj.category != '0')
                        home.SetSearchByCategory(response, profileID, obj.cat);
                    else home.SetSearchByCategory(response, profileID, '');
                }
                else {
                    if (obj.category != '0')
                        home.SetSearchByCategory(response, profileID, obj.cat);
                    else home.SetSearchByCategory(response, profileID, '');
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetSearchByCategory :" + errorThrown + textStatus);
        }//end error
    });
}

home.addMealToCart = function (mID, title, qty, price, pID, optionList, currency, loggedIn) {

    $("#container-checkout").hide();
    $("#container-login-checkout").show();

    console.log('mealID=>' + mID + ', title=>' + title + ', qty=>' + qty + ', price=>' + price + ', buyerID=>' + pID);
    var LastOrderCost = _get("LastOrderPrice");
    var LastOrderID = _get("LastOrderID");

    var LastItemCount = _get("LastItemCount");
    var sID = _get("hdnSellerID");
    LastItemCount = +LastItemCount + +1;
    var ttlPrice = +price * +qty;
    var resultHtml = '';
    var totalPrice = +LastOrderCost + +ttlPrice;

    resultHtml += '<div class="row"><div class="col-lg-3 p-sm itemQuatity">';
    resultHtml += '<select  class="form-control m-b" name="quantity"  data-value="' + price + '" data-id="' + LastItemCount + '">';
    for (var q = 1; q < 51; q++) {
        if (q == qty)
            resultHtml += '<option selected value="' + q + '">' + q + '</option>';
        else resultHtml += '<option value="' + q + '">' + q + '</option>';
    }
    resultHtml += '</select></div><div class="col-lg-6 border-right border-left text-left p-sm">';
    resultHtml += '<p>' + title + ' </p></div>';
    resultHtml += '<div class="col-lg-3 p-sm itemprice"><h5 class="font-bold">' + currency + '<span data-value="' + ttlPrice + '" data-id="' + LastItemCount + '">' + ttlPrice + '</span></h5></div>';
    resultHtml += '</div>';

    $("#tblOrderList").append(resultHtml);
    // _setIn('tblOrderList', resultHtml);
    _setIn('itemCount', LastItemCount);

    _setIn('totalPrice', currency + totalPrice);
    _set('LastOrderPrice', totalPrice);
    _set('LastItemCount', LastItemCount);
    _setIn('txtShopCount', LastItemCount);
    _set('hdnItemCount', LastItemCount);

    if (LastOrderID)
        cord.SetMealOrder(LastOrderID, mID, title, qty, price, pID, optionList, sID, totalPrice, LastItemCount);
    else cord.SetMealOrder(0, mID, title, qty, price, pID, optionList, sID, totalPrice, LastItemCount);
    if (loggedIn)
        CloseModel('modal-meal-detail');
    else window.location.reload();

}

home.addDealToCart = function (mID, title, qty, price, pID, currency, loggedIn) {
    $("#container-checkout").hide();
    $("#container-login-checkout").show();

    console.log('mealID=>' + mID + ', title=>' + title + ', qty=>' + qty + ', price=>' + price + ', buyerID=>' + pID);
    var LastOrderCost = _get("LastOrderPrice");
    var LastOrderID = _get("LastOrderID");
    var LastItemCount = _get("LastItemCount");
    LastItemCount = +LastItemCount + +1;
    var sID = _get("hdnSellerID");

    var ttlPrice = +price * +qty;
    var resultHtml = '';
    var totalPrice = +LastOrderCost + +ttlPrice;

    resultHtml += '<div class="row"><div class="col-lg-3 p-sm itemQuatity" >';
    resultHtml += '<select  class="form-control m-b"  data-value="' + price + '" name="quantity" data-id="' + LastItemCount + '">';
    for (var q = 1; q < 51; q++) {
        if (q == qty)
            resultHtml += '<option selected value="' + q + '">' + q + '</option>';
        else resultHtml += '<option>' + q + '</option>';
    }
    resultHtml += '</select></div><div class="col-lg-6 border-right border-left text-left p-sm">';
    resultHtml += '<p>' + title + ' </p></div>';
    resultHtml += '<div class="col-lg-3 p-sm itemprice"><h5 class="font-bold" >' + currency + '<span data-value="' + ttlPrice + '" data-id="' + LastItemCount + '">' + ttlPrice + '</span></h5></div>';
    resultHtml += '</div>';

    $("#tblOrderList").append(resultHtml);
    // _setIn('tblOrderList', resultHtml);
    _setIn('itemCount', LastItemCount);
    _setIn('totalPrice', currency + totalPrice);
    _set('LastOrderPrice', totalPrice);
    _set('LastItemCount', LastItemCount);
    _set('hdnItemCount', LastItemCount);
    _setIn('txtShopCount', LastItemCount)

    if (LastOrderID)
        cord.SetDealOrder(LastOrderID, mID, title, qty, price, pID, sID, totalPrice, LastItemCount);
    else cord.SetDealOrder(0, mID, title, qty, price, pID, sID, totalPrice, LastItemCount);
    if (loggedIn)
        CloseModel('modal-deal-detail');
    else window.location.reload();
}

home.GetBuyerOrderBySeller = function (sellerID, buyerID, currency) {
    var currDateTicks = convertToTicks(getCurrentDate());

    var parameters = { 'sellerID': String(sellerID), 'buyerID': String(buyerID), 'dateTimeTick': String(currDateTicks) };
    $.ajax({
        url: baseURL + 'home/GetBuyerOrderBySeller',
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
                    home.SetCartItems(response, currency);
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("ViewDealDetial :" + errorThrown + textStatus);
        }//end error
    });
}

home.SetCartItems = function (obj, currency) {
    if (obj) {

        if (obj.length > 0) {
            $("#container-checkout").hide();
            $("#container-login-checkout").show();
            _set("LastOrderID", obj[0].orderID);
            var resultHtml = '';
            var totalPrice = obj[0].totalPrice;
            var totalQty = obj[0].totalQuantity;
            for (var i = 0; i < obj.length; i++) {
                var countI = i + 1;
                ;
                var item = obj[i];
                var itemPrice = +item.price * +item.quantity
                resultHtml += '<div class="row"><div class="col-lg-3 p-sm itemQuatity">';
                resultHtml += '<select  class="form-control m-b" name="quantity"  data-value="' + item.price + '" data-id="' + item.orderItemID + '">';
                for (var q = 1; q < 51; q++) {
                    if (q == item.quantity)
                        resultHtml += '<option selected value="' + q + '">' + q + '</option>';
                    else resultHtml += '<option value="' + q + '" >' + q + '</option>';
                }
                resultHtml += '</select></div><div class="col-lg-6 border-right border-left text-left p-sm">';
                resultHtml += '<p>' + item.title + ' </p></div>';
                resultHtml += '<div class="col-lg-3 p-sm itemprice"><h5 class="font-bold">' + currency + '<span data-value="' + itemPrice + '" data-id="' + item.orderItemID + '">' + itemPrice + ' </span></h5 ></div > ';
                resultHtml += '</div>';
            }

            _setIn('tblOrderList', resultHtml);
            _setIn('itemCount', obj.length);
            _setIn('totalPrice', currency + totalPrice);
            _set("LastOrderPrice", totalPrice);
            _set('LastItemCount', totalQty);
            _set('hdnItemCount', totalQty);
            _setIn('txtShopCount', totalQty);
        }
    }
    return;
}

home.ChangeCartItems = function (obj, currency) {
    if (obj) {
        if (obj.length > 0) {
            $("#container-checkout").hide();
            $("#container-login-checkout").show();

            var resultHtml = '';
            var totalPrice = 0;
            for (var i = 0; i < obj.length; i++) {
                var item = obj[i];
                totalPrice += item.price;
                resultHtml += '<div class="row"><div class="col-lg-3 p-sm">';
                resultHtml += '<select class="form-control m-b" name="quantity">';
                for (var q = 1; q < 51; q++) {
                    if (q == item.quantity)
                        resultHtml += '<option selected>' + i + '</option>';
                    else resultHtml += '<option>' + i + '</option>';
                }
                resultHtml += '</select></div><div class="col-lg-6 border-right border-left text-left p-sm">';
                resultHtml += '<p>' + item.title + ' </p></div>';
                resultHtml += '<div class="col-lg-3 p-sm"><h5 class="font-bold">' + currency + item.price + '</h5></div>';
                resultHtml += '</div>';
            }
            _setIn('tblOrderList', resultHtml);
            _setIn('itemCount', obj.length);
            _setIn('totalPrice', currency + totalPrice);
        }
    }
    return;
}

home.SetCountryData = function () {

    var currDateTicks = convertToTicks(getCurrentDate());
    var country = getCountry();

    var parameters = { 'id': String('2') };
    $.ajax({
        url: baseURL + 'home/SetCountryData',
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
                    console.log("country data set");
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetFeaturedSellers :" + errorThrown + textStatus);
        }//end error
    });

}

function updateLoginButtonText(updateText) {

    if (updateText !== 'Login') {
        $('#btnLogin').attr('disabled', 'disabled');
        $('#btnLogin').addClass('active');
        //glyphicon glyphicon-refresh spinning
    }
    else {
        $('#btnLogin').removeAttr('disabled');
        $('#btnLogin').removeClass('active');
    }
}

function updateSubmitButtonText(updateText, button, vtext) {

    if (updateText !== vtext) {
        $('#' + button).attr('disabled', 'disabled');
        $('#' + button).addClass('active');
        //glyphicon glyphicon-refresh spinning
    }
    else {
        $('#' + button).removeAttr('disabled');
        $('#' + button).removeClass('active');
    }
}


function switchVisible() {
    if (document.getElementById('Overlay-container')) {

        //if (document.getElementById('Overlay-container').style.display == 'none') {
        //    document.getElementById('Overlay-container').style.display = 'block';
        //    // document.getElementById('content-container').style.display = 'none';

        //}
        //else {
        document.getElementById('Overlay-container').style.display = 'none';
        // document.getElementById('content-container').style.display = 'block';

        // }
    }
}

function ValidateRegPersonalInfo() {
    
    var IsValid = true;


    IsValid = $('#ddlTitle')[0].checkValidity();
    ;
    if (IsValid)
        IsValid = $('#txtFirstName')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtLastName')[0].checkValidity();
    if (IsValid)
        IsValid = $('#ddlMaritalStatus')[0].checkValidity();
    if (IsValid)
        IsValid = $('#ddlGender')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtMobile')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtPhone')[0].checkValidity();
    if (IsValid)
        ////IsValid = $('#txtDescription')[0].checkValidity();
    if (IsValid)
        IsValid = $('#ddlCountry')[0].checkValidity();
    if (IsValid)
        IsValid = $('#ddlCity')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtPostalCode')[0].checkValidity();

    return IsValid;

}

function ValidateSellerForm() {
    
    var IsValid = true;


    IsValid = $('#pickupAddress')[0].checkValidity();
    ;
    if (IsValid)
        IsValid = $('#txtAccountTitle')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtBankName')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtAccountNumber')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtNationality')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtCNIC')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtDisplayTitle')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtDescription')[0].checkValidity();
    return IsValid;

}



function ValidateRegWorkInfo() {
    var IsValid = true;


    IsValid = $('#txtDisplayTitle')[0].checkValidity();

    if (IsValid)
        IsValid = $('#txtCNIC')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtNationality')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtDeliveryRange')[0].checkValidity();



    return IsValid;

}

function ValidateAccountInfo() {
    var IsValid = true;


    IsValid = $('#txtAccountTitle')[0].checkValidity();

    if (IsValid)
        IsValid = $('#txtBankName')[0].checkValidity();
    if (IsValid)
        IsValid = $('#txtAccountNumber')[0].checkValidity();

    return IsValid;

}








