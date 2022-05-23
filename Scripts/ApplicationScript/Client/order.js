var cord = {};
var addList = [];
var Dadd = {};
Dadd.addressTypeID = 0;
Dadd.profileID = 0;
Dadd.address = '';
Dadd.postalCode = '';
Dadd.cityID = 0;
Dadd.countryID = 0;
var orderIDList = [];
var orderobj = {};

cord.SetMealOrder = function (orderID,mID, title, qty, price, pID, optionList,sID,totalPrice,totalqty) {
    var obj = {};
    var items = {};
    var addOns = {};
        obj.orderID = orderID;
        obj.sellerProfileID = sID;
        obj.buyerProfileID = pID;
    obj.price = price;
    obj.quantity = 1;
        //if (qty > 0) {
        //    obj.quantity = qty;
        //}
        //else { obj.quantity = 1; }
        obj.Items = [];
            items.mealID = mID;
            items.orderID = orderID;
            items.title = title;
            items.quantity = qty;
            items.price = price;
    obj.Items.push(items);
    obj.addOns = [];

    if (optionList.length > 0)
    {
        for (var i = 0; i < optionList.length; i++)
        {
            addOns = {};
            addOns.OptionID = optionList[i];
            addOns.mealID = mID;
            obj.addOns.push(addOns);
        }
    }

    cord.AddMealtoCart(obj, totalqty);
}

cord.SetDealOrder = function (orderID, mID, title, qty, price, pID, sID, totalPrice, totalqty) {
    var obj = {};
    var items = {};
  
    obj.orderID = orderID;
    obj.sellerProfileID = sID;
    obj.buyerProfileID = pID;
    obj.price = price; 
    if (qty > 0) {
        obj.quantity = qty;
    }
    else { obj.quantity = 1; }
    obj.Items = [];
        items.dealID = mID;
        items.orderID = orderID;
        items.title = title;
        items.quantity = qty;
        items.price = price;
        obj.Items.push(items);

    cord.AddMealtoCart(obj, totalqty);
}

cord.AddMealtoCart = function (obj, totalqty) {

    var currDateTicks = convertToTicks(getCurrentDate());


    var parameters = { 'obj': obj, 'dateTimeTick': String(currDateTicks)};
        $.ajax({
            url: baseURL + 'home/AddMealtoCart',
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
               // alert(response + "===" + totalqty);
                $(".itemprice span[data-id=" + totalqty + "]").attr('data-id', response);
                $(".itemQuatity select[data-id=" + totalqty + "]").attr('data-id', response);
                if (response != null) {
                    if (response.length !== 0) {
                        
                    }
                    else { }
                }

            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                errorCLog("Add New Order :" + errorThrown + textStatus);
            }//end error
        });

}

cord.SetBuyerCartItems = function (objList, currency) {
    var resultHtml = '';
    var summaryHtml = '';
    var totalPrice = 0;
    var totalItems = 0;
     //orderIDList = [];
    ;
    summaryHtml += '<div class="m-t-xs row">';
    summaryHtml += '<div class="col-lg-6 h5" style="font-weight: 600;">Order No.</div>';
    summaryHtml += '<div class="col-lg-6 h5 text-right" style="font-weight: 600;">Price</div>';
    summaryHtml += '</div>';
    if (objList.length > 0) {
        
        for (var i = 0; i < objList.length; i++) {

            orderobj = {};
            orderobj.sellerID = objList[i].sellerProfileID;
            orderobj.title = objList[i].displayTitle;
            orderobj.orderID = objList[i].orderID;
            orderIDList.push(orderobj);

            totalPrice = +totalPrice + +objList[i].price;
            summaryHtml += '<div class="m-t-lg row">';
            summaryHtml += '<div class="col-lg-6 h5">'+ objList[i].recieptNumber + '</div>';
            summaryHtml += '<div class="col-lg-6 h5 text-right">' + currency + objList[i].price +'</div>';
            summaryHtml += '</div>';

            resultHtml += '<div class="hpanel"> <div class="panel-body float-e-margins"><div class="row">';
            resultHtml += '<div class="col-lg-11  text-left">';
            resultHtml += '<h4>Order No: ' + objList[i].recieptNumber + ' </h4>';
            resultHtml += '<h5>Seller: ' + objList[i].displayTitle + '</h5></div>';
            resultHtml += '<div class="col-lg-1"> <i style="cursor:pointer" class="pe-7s-trash font24 demo4" title="remove order! " onclick="cord.deleteOrderConfirmation(' + objList[i].orderID + ',' + objList[i].buyerProfileID +');" ></i> </div></div><hr/>';
            for (var j = 0; j < objList[i].Items.length > 0; j++)
            {
                totalItems = totalItems + 1;
            
                var item = objList[i].Items[j];
               // var ItemtotalPrice = item.quantity * item.price;
                resultHtml += '<div class="row">';
                if (item.isDeal) {
                    resultHtml += '<div class="col-lg-3 p-sm"> <img class="img-responsive" src="' + baseURL + '/Uploads/Deal/' + objList[i].folderID + '/thumb-60/' + item.photo + '"> </div>';
                }
                else {
                    resultHtml += '<div class="col-lg-3 p-sm"> <img class="img-responsive" src="' + baseURL + '/Uploads/Product/' + objList[i].folderID + '/thumb-60/' + item.photo + '"> </div>';
                }
                resultHtml += '<div class="col-lg-8  text-left p-sm"><p>' + item.title + '(' + item.quantity +')</p >';
                resultHtml += '<h4 class="text-success">' + currency + item.price + '</h4>';
                if (item.addOns) {
                    for (var k = 0; k < item.addOns.length > 0; k++) {
                        var aon = item.addOns[k];
                      
                        if (k == 0) {
                            resultHtml += '<div class="row"> <div class="col-md-12"><h5> Add ONs </h5></div>'
                            resultHtml += '';
                        }

                        resultHtml += '<div class="col-md-12">';
                        resultHtml += '<div class="col-md-6 border-right"> <div class="">' + aon.title + '</div></div>';
                        if (aon.price != 0)
                            resultHtml += '<div class="col-md-6" width="80%"> <div class=""><span class="text-success">' + currency + aon.price + '</span></div></div>';
                        else resultHtml += '<div class="col-md-6"  width="20%"> <div class=""><span class="text-success"> - </span></div></div>';
                        //resultHtml += '<div class="col-md-4 border-right"> <div class="contact-stat"><strong>' + aon.title;

                        //if (aon.price != 0)
                        //    resultHtml += ' </strong> <span>' + currency + aon.price + '</span></div> </div>';
                        //else resultHtml += ' </strong> <span></span></div> </div>';
                        resultHtml += '</div>'
                        resultHtml += '</p >';
                        if (k == item.addOns.length - 1) {
                            resultHtml += '</div>'
                        }
                    }
                }
                //for (var k = 0; k < item.addOns.length > 0; k++)
                //{
                //    var aon = item.addOns[k];
                //    resultHtml += '<p><strong>Add Ons:</strong> ' + aon.title ;
                //    if (aon.price != 0)
                //        resultHtml += '  ('+ currency + aon.price+')';
                //    resultHtml += '</p >';
                //}
                resultHtml += '</div><div class="col-lg-1 p-sm"> <i  style="cursor:pointer" class="pe-7s-trash font24 demo4" onclick="cord.deleteItemConfirmation(' + item.orderItemID + ',' + objList[i].buyerProfileID+');"></i> </div>';
                resultHtml += '</div>';
            }
           
            resultHtml += '</div>';
        }
        ;
        _setIn('container-order-summery', summaryHtml);
        _setIn('cart-order-container', resultHtml);
        _setIn('txtTotalCost', currency + totalPrice);
        _set('hdnItemCount', totalItems);
        _setIn('txtShopCount', totalItems);
        _setIn('spnItemCount', totalItems);
 
    }
    else {
        resultHtml = '<h4>Order Placed! </h4>';

        _setIn('container-order-summery', resultHtml);
        _setIn('cart-order-container', resultHtml);
    }

    return;
}

cord.GetBuyerCartItems = function (buyerID, currency) {
    $.blockUI({
        message: '<h1>Please wait...</h1> ',
        css: {
            border: 'none',
            'z-index': '99999',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: 1,
            color: '#fff'
        }
    });
    var currDateTicks = convertToTicks(getCurrentDate());

    var parameters = { 'buyerID': buyerID, 'dateTimeTick': String(currDateTicks) };
    $.ajax({
        url: baseURL + 'home/GetBuyerCheckOutOrders',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            var response = null;
            if (data)
                if (data.obj)
                    response = data.obj;
            if (response != null) {
                if (response.length > 0) {
                    cord.SetBuyerCartItems(response, currency);
                    $("#container-data").show();
                    $("#container-no-data").hide();
                    $.unblockUI();
                }
                else {
                    $("#container-no-data").show();
                    $("#container-data").hide();
                    $.unblockUI();
                }
            }

        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Get Cart Items :" + errorThrown + textStatus);
            $.unblockUI();
        }//end error
    });

}

cord.SetBuyerAddress = function (objList) {
    var resultHtml = '';
    if (objList.length > 0) {
        for (var i = 0; i < objList.length; i++) {
            var add = objList[i];
            var deladd = add.address;
            deladd += ' ,' + add.postalCode;
            deladd += ' ,' + add.city;
            deladd += ' ,' + add.country;
            resultHtml += '<tr><td><div class="radio radio-success">';
            resultHtml += '<input name="grpAddress" class="bcheck"  data-id="' + add.addressID + '" data-value="' + deladd + '"  type="radio">';
            resultHtml += '<label></label></div>';
            resultHtml += '</td>';

            resultHtml += '<td>' + deladd + '</td>';
            resultHtml += '<td>' + add.addressType + '</td>';
            resultHtml += '</tr>';
        }
        _setIn('ListBuyAddress', resultHtml);

    }
    else {
        resultHtml = '<tr><td colspan="2">No Address Added! </td></tr>';
        _setIn('ListBuyAddress', resultHtml);
    }

    return;
}

cord.GetBuyerAddress = function (buyerID) {
    var currDateTicks = convertToTicks(getCurrentDate());
    var parameters = { 'buyerID': buyerID, 'dateTimeTick': currDateTicks};
    $.ajax({
        url: baseURL + 'home/GetBuyerAddress',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            var response = null;
            if (data)
                if (data.obj)
                    response = data.obj;
            if (response != null) {
                cord.SetBuyerAddress(response);
            }

        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Get Cart Items :" + errorThrown + textStatus);
        }//end error
    });

}

cord.GetAddressFieldData = function (id) {
    var add = {};
    add.addressTypeID = 3;
    add.profileID = id;
    add.address = _get("txtAddress");
    add.postalCode = _get("txtPostCode");
    add.cityID = _get("hdnCityID");
    add.countryID = _get("hdnCountryID");

    return add;
}

cord.AddNewAddress = function (id) {

    var obj = cord.GetAddressFieldData(id);
    //cord.SetNewAddress(obj);

    var parameters = { 'addrs': obj };
    $.ajax({
        url: baseURL + 'home/AddBuyerDeliveryAddress',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
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
                    cord.GetBuyerAddress(id);
                    toastr.success("You have added a new delivery address successfully.");
                }
                else { }
            }

        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Add New Order :" + errorThrown + textStatus);
        }//end error
    });

}

cord.AddOrderAddress = function (objList,address) {

    var parameters = { 'uadd': objList, 'price': '', 'comment': '','address': address};
    $.ajax({
        url: baseURL + 'home/AddOrderDeliveryAddress',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
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

                }
                else { }
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Add Order Address :" + errorThrown + textStatus);
        }//end error
    });

    return;
}

cord.ProceedToPayment = function (address,id,buyer) {
    var ords = [];
    ;
    console.log(JSON.stringify(orderIDList));
    if (orderIDList) {
        for (var i = 0; i < orderIDList.length; i++) {
            var obj = {}
            obj.orderID = orderIDList[i].orderID;
            obj.price = "";
            obj.comment = "";
            ords.push(obj);
            cord.ChangeOrderStatus(orderIDList[i].orderID, 1);

            note.AddOrderNotification(orderIDList[i].sellerID, id, "Your Order has been placed successfully.", orderIDList[i].title, false);
            note.AddOrderNotification(id, orderIDList[i].sellerID, "New Order has been placed.", buyer, true);
        }
    }
    cord.AddOrderAddress(ords,address);
}

cord.ChangeOrderStatus = function (orderID,statusID) {

    var currDateTicks = convertToTicks(getCurrentDate());
  //  var obj = cord.GetAddressFieldData(id);
    //cord.SetNewAddress(obj);

    var parameters = { 'orderID': orderID, 'statusID': statusID, 'dateTimeTick': currDateTicks };
    $.ajax({
        url: baseURL + 'home/UpdateOrderStatus',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
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

                }
                else { }
            }
            toastr.success("Order status has been changed successfully.");
            CloseModel("change-status-model");
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Change Order Status :" + errorThrown + textStatus);
        }//end error
    });

    return;
}

cord.AddRating = function (orderID, bID, rate) {

    var parameters = { 'orderID': orderID, 'buyerID': bID, 'rating': rate, };
    $.ajax({
        url: baseURL + 'Buyer/AddOrderRating',
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
                   // console.log("country data set");
                    $('#order-table').DataTable().ajax.reload();
                }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("GetFeaturedSellers :" + errorThrown + textStatus);
        }//end error
    });

}

cord.AddFavourites = function (sellerID,buyerID) {


    var parameters = { 'sellerID': sellerID,'buyerID': buyerID };
    $.ajax({
        url: baseURL + 'Buyer/AddFavourites',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            var response = null;
            if (data)
                if (data.obj)
                    response = data.obj;
            if (response == 1) {
                toastr.success("Seller added to favourites.");
            }
            else if (response == 2) {
                toastr.info("You already have this seller in your favourites.");
            }

        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Add Favourites :" + errorThrown + textStatus);
        }//end error
    });

}

cord.SetDashboardFavourites = function (objList) {
    var resultHtml = '';
    if (objList.length > 0) {
        $("#container-buy-fav").css("display", "block");

        for (var i = 0; i < objList.length; i++) {
            resultHtml += '<div class="col-lg-5 col-sm-6">';
            resultHtml += '<div class="hpanel">';
            resultHtml += '<div class="panel-body no-padding poluritm">';
            resultHtml += '<div class="entry-thumbnail"> <img style="height: 215px;" src="' + baseURL + '/Uploads/Banners/' + objList[i].bannarPhoto + '" class="img-responsive"> </div>';
            resultHtml += ' <div class="p-sm productdetail"> <h3>' + texTruncate(objList[i].displayTitle, 30, "...") + '</h3>';
            resultHtml += ' <p>' + texTruncate(objList[i].description ,100, "...")+ ' </p>';
            resultHtml += '<h5 class="text-success">' + texTruncate(objList[i].lineAddress, 50, "...") + '</h5>';
            if (objList[i].offerDelivery == true)
                resultHtml += '<div class="btn btn-primary2 btn-sm">' + objList[i].deliveryRange + ' ' + objList[i].unit + '</div>';
            else resultHtml += '<div class="btn btn-primary2 btn-sm"> no delivery</div>';
            resultHtml += '<div class="btn btn-default btn-sm">' + objList[i].avgRating + '<i class="fa fa-star" aria-hidden="true"></i> (' + objList[i].ratedCount + ')</div>';
            resultHtml += '<button type="button" onclick="home.ViewSellerDetial(' + objList[i].profileID + ')" class="btn btn-success btn-sm pull-right">Order Now</button>';
            resultHtml += '</div></div></div></div>';
        }
        _setIn('container-buy-fav', resultHtml);
    }
    else {
        resultHtml += '<div class="col-lg-4 col-sm-6">';
        resultHtml += '<div class="hpanel">';
        resultHtml += '<div class="panel-body no-padding poluritm">';
        resultHtml += '<div class="entry-thumbnail"> <img style="height: 215px;"  src="' + baseURL + '/Content/images/default/365x220-popularUser.jpg" class="img-responsive"> </div>';
        resultHtml += ' <div class="p-sm productdetail"> <h3> Add Favourite Seller</h3>';
        resultHtml += ' <p> Your favourites seller will appear here ! </p>';
        resultHtml += '<h4 class="text-success"></h4>';
        resultHtml += '</div></div></div></div>';
        _setIn('container-buy-fav', resultHtml);
    }

    return;
}

cord.GetDashboardFavourites = function () {


   // var parameters = { 'buyerID': buyerID };
    $.ajax({
        url: baseURL + 'Buyer/GetBuyerFavourites',
        type: 'POST',
       // data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            var response = null;
            if (data)
                if (data.obj)
                    response = data.obj;
            if (response != null) {
                cord.SetDashboardFavourites(response);
            }

        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Add Favourites :" + errorThrown + textStatus);
        }//end error
    });

}

cord.SetDashboardOrders = function (objList,currency) {
    var resultHtml = '';
    if (objList.length > 0) {
        for (var i = 0; i < objList.length; i++) {
            var item = objList[i];
            if (i % 2 == 0) { resultHtml += '<tr role="row" class="odd">'; }
            else { resultHtml += '<tr role="row" >';}

            resultHtml += '<td><img src="' + baseURL + '/Uploads/Banners/' + item.photo + '" class="img-circle m-b" alt="logo" width="80" height="80"></td>';
            resultHtml += '<td>' + item.displayTitle + ' </td>';
            resultHtml += '<td>' + transformDate(item.orderDateTicks) + '</td>';
            resultHtml += '<td>' + currency + item.price + '</td>';
            resultHtml += '<td>' + item.quantity + '</td>';
            resultHtml += '<td><span class="label label-success p-xxs">' + item.status + '</span></td>';
            resultHtml += '</tr>'
        }
        _setIn('table-order-hist', resultHtml);

    }
    else {
        resultHtml = '<tr><td colspan="6">No Order Placed! </td></tr>';
        _setIn('table-order-hist', resultHtml);
    }

    return;
}

cord.GetDashboardOrders = function (currency) {

    //var parameters = { 'buyerID': buyerID };
    $.ajax({
        url: baseURL + 'Buyer/GetBuyerDashboardOrders',
        type: 'POST',
       // data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            ;
            var response = null;
            if (data)
                if (data.obj)
                    response = data.obj;
            if (response != null) {
                cord.SetDashboardOrders(response, currency);
            }

        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Get Buyer Dashboard Orders :" + errorThrown + textStatus);
        }//end error
    });

}

cord.deleteOrderItem = function (orderID, pID) {

    var parameters = {'buyerID': pID,'orderItemID': orderID };
    $.ajax({
        url: baseURL + 'home/DeleteMealItem',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
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

                }
                else { }
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Change Order Status :" + errorThrown + textStatus);
        }//end error
    });

    return;
}

cord.deleteItemConfirmation = function (orderID, pID){
    //;
    event.preventDefault(); // prevent form submit
    swal({
        title: "Are you sure?",
        text: "You want to delete order item?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (isConfirm) {
            //;
            if (isConfirm) {
                cord.deleteOrderItem(orderID, pID);
                 var url = baseURL + 'home/CheckOut';
                window.location = url;
            }
        });
}

cord.deleteOrder = function (orderID, pID) {

    var parameters = { 'buyerID': pID, 'orderID': orderID };
    $.ajax({
        url: baseURL + 'home/DeleteMeal',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
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

                }
                else { }
            }
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("Change Order Status :" + errorThrown + textStatus);
        }//end error
    });

    return;
}

cord.deleteOrderConfirmation = function (orderID, pID) {
    //;
    event.preventDefault(); // prevent form submit
    swal({
        title: "Are you sure?",
        text: "You want to delete the whole order?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (isConfirm) {
            //;
            if (isConfirm) {
                cord.deleteOrder(orderID, pID);
                var url = baseURL + 'home/CheckOut';
                window.location = url;
            }
        });
}

cord.changeItemQuantity = function (id, quantity, price, total) {

    var parameters = { 'id': id, 'price': String(price), 'totalPrice': String(total), 'quantity': quantity };
    $.ajax({
        url: baseURL + 'home/ChangeItemQuantity',
        type: 'POST',
        data: JSON.stringify(parameters),
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            var response = null;
         //   toastr.success("item quantity changed!")
        },//end success
        error: function (jqXHR, textStatus, errorThrown) {
            errorCLog("change Item Quantity :" + errorThrown + textStatus);
        }//end error
    });

}

cord.GetOrderDetail = function (id) {
    if (id) {
        var parameters = { 'id': String(id) };
        $.ajax({
            url: baseURL + 'home/GetOrderDetails',
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
                        cord.SetFieldData(response);
                    }
            },//end success
            error: function (jqXHR, textStatus, errorThrown) {
                errorCLog("Home Get Order Items :" + errorThrown + textStatus);
            }//end error
        });
    }
}

cord.SetFieldData = function (obj) {
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
            var status = '';
            if (obj.orderLastStatusID == 1)
                status = '<span class="label label-info p-xxs">' + obj.status + '</span>';
            else if (obj.orderLastStatusID == 2)
                status = '<span class="label label-success p-xxs">' + obj.status + '</span>';
            else if (obj.orderLastStatusID == 3)
                status = '<span class="label btn-primary p-xxs">' + obj.status + '</span>';
            else if (obj.orderLastStatusID == 4)
                status = '<span class="label btn-primary2 p-xxs">' + obj.status + '</span>';
            else if (obj.orderLastStatusID == 5)
                status = '<span class="label label-primary p-xxs">' + obj.status + '</span>';
            else if (obj.orderLastStatusID == 6)
                status = '<span class="label label-warning p-xxs">' + obj.status + '</span>';
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

