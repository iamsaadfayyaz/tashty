function updateInvoiceNotes() {
    var id = $("#notes-ddl").val();
    if (id == "") {
        $("#invoice-notes-ta").val("");
        return false;
    }
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/GetNotes',
        async: false,
        data: JSON.stringify({ id: id }),
        success: function (data) {
            unblockUI();
            $("#invoice-notes-ta").val(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode != 46 && (charCode < 48 || charCode > 57)))
        return false;
    return true;
}
function calculate(ref) {
    var ret = false;
    var itemTotal = 0;
    var id = "";
    if (ref) {
        id = $(ref).attr("id");
    }

    $(".item-amount").each(function () {
        var val = this.value;
        if (parseFloat(val) < 0) {
            $(this).css("border-color", "red");
            ret = true
            return false;
        }
        if (val) {
            itemTotal = itemTotal + parseFloat(val);
        }
    });
    if (ret) {
        return false;
    }
    $("#sub-total").val(itemTotal.toFixed(2));
    var total = itemTotal;
    if (total == 0) {
        $("#discount-total").val(total.toFixed(2));
        $("#discAmount").val(total.toFixed(2));
        $("#amount-total").val(total.toFixed(2));
        return false;
    }
    var gstP = $("#gst-total").val();
    if (gstP) {
        gstp = parseFloat(gstP) / 100 * itemTotal;
        gstp = Math.round(gstp * 100) / 100
        total = parseFloat(itemTotal) + parseFloat(gstp);
    }
    $("#amount-total").val((Math.round(total * 100) / 100).toFixed(2));
    var dis = $("#discount-total").val();
    if (dis == "") {
        $("#discount-total").val(0);
        dis = parseFloat(0);
    }
    var dis_amt = $("#discAmount").val();
    if (dis_amt == "") {
        $("#discAmount").val(0);
        dis_amt = parseFloat(0);
    }
    if (id == "discount-total") {
        if (dis) {
            dis = parseFloat(dis) / 100 * itemTotal;
            dis = Math.round(dis * 100) / 100
            $("#discAmount").val(0);
            total = parseFloat(total) - parseFloat(dis);
        }
        else {
            $("#discount-total").val(0);
            $("#discAmount").val(0);
        }
    }
    else if (id == "discAmount") {
        if (dis_amt) {
            $("#discount-total").val(0);
            total = parseFloat(total) - parseFloat(dis_amt);
        }
        else {
            $("#discount-total").val(0);
            $("#discAmount").val(0);
        }
    }
    else {
        if (dis > 0) {
            dis = parseFloat(dis) / 100 * itemTotal;
            dis = Math.round(dis * 100) / 100
            $("#discAmount").val(0);
            total = parseFloat(total) - parseFloat(dis);
        }
        else if (dis_amt > 0) {
            $("#discount-total").val(0);
            total = parseFloat(total) - parseFloat(dis_amt);
        }
        else {
            $("#discount-total").val(0);
            $("#discAmount").val(0);
        }
    }

    $("#amount-total").val((Math.round(total * 100) / 100).toFixed(2));
    $("#d-ammt").val(((Math.round(total * 100) / 100) - parseFloat($("#invoice_PaidAmount").val())).toFixed(2));
    $("#lbl-d-amt").val($("#d-ammt").val());

}

function setSn() {
    var sn = 0;
    $("#items-table tr:gt(0)").each(function () {

        $(this).find('td:eq(0)').html(parseInt(sn) + 1);
        $(this).find('td:eq(1) input').attr('name', 'item[' + sn + '].Description');
        $(this).find('td:eq(2) input').attr('name', 'item[' + sn + '].Amount');
        sn++
    });
}
function removeRow(ref) {
    $(ref).parent().parent().remove();
    calculate();
    setSn();
}

function addNewLine() {
    var count = parseInt($("#items-table tr").length) - 1;
    $("#items-table").append("<tr><td><input type='hidden' name='item[" + count + "].SNO' value='" + (count + 1) + "'/>" + (count + 1) + "</td><td><textarea class='info_input' style='resize: vertical;'  name='item[" + count + "].Description' required></textarea></td><td><input type='text' class='item-amount info_input'  onchange = 'calculate()' onkeypress = 'return isNumberKey(event)' name='item[" + count + "].Amount' required/></td> <td><a href='#' onclick='removeRow(this)'><i class='flaticon-interface'></i></a></td></tr>");
}
function setTaxPercent() {
    var percent = $("#inv-tax-ddl option:selected").text().split('-')[1];
    if ($("#inv-tax-Inclusive").is(":checked")) {
        $("#gst-total").val(0);
    }
    else {
        $("#gst-total").val(percent);
    }
    calculate();
}
function updateTaxInformation() {
    if ($("#inv-tax-Inclusive").is(":checked")) {
        //$("#inv-tax-ddl").prop('disabled', 'disabled');
        //$("#inv-tax-ddl").val("");
        $("#gst-total").prop('disabled', 'disabled');
        $("#gst-total").val(0);
        $("#gst-total").prop('required', false);
        $("#inv-tax-ddl").prop('required', false);
        calculate();

    }
    else {
        $("#inv-tax-ddl").prop('disabled', false);
        $("#gst-total").prop('disabled', false);
        $("#gst-total").prop('required', true);
        $("#inv-tax-ddl").prop('required', true);
        calculate();

    }
    setTaxPercent();
}

function addPayment(id) {
    var am = $("#paymentAmountInvoice").val();
    var dt = $("#paymentDateInvoice").val();
    var damtt = $("#d-ammt").val();
    var desc = $("#paymentDescInvoice").val();
    if (am == "") {
        return $().toastmessage('showToast', {
            text:  ScriptResourcesList['scriptPleaseEnterAmount'] ,
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    if (parseFloat(am) < 0) {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptNegativeAmountNotAllowed'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    //if (parseFloat(am) > parseFloat(damtt)) {
    //    return $().toastmessage('showToast', {
    //        text: ScriptResourcesList['scriptAmountCanNotGreaterDueAmount'],
    //        sticky: false,
    //        position: 'bottom-right',
    //        type: 'error'

    //    });
    //}
    if (dt == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseInsertDate'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.FKInvoiceID = id;
    obj.Ammount = am;
    obj.ReceivedDate = dt;
    obj.IsEmail = false;
    obj.FKBankAccountID = $("#paymentAccountInvoice").val();
    obj.Description = desc;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/AddPayment',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {

            unblockUI();
            successToast();
            if ($("#selected-client-id").val().length > 0) {
                viewDetailInvoiceClient(id);
            }
            else {
                viewDetailInvoice(id);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function addPaymentP(id) {
    var am = $("#paymentAmountInvoice").val();
    var dt = $("#paymentDateInvoice").val();
    var damtt = $("#d-ammt").val();
    var desc = $("#paymentDescInvoice").val();
    if (am == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterAmount'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    if (parseFloat(am) < 0) {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptNegativeAmountNotAllowed'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    //if (parseFloat(am) > parseFloat(damtt)) {
    //    return $().toastmessage('showToast', {
    //        text: ScriptResourcesList['scriptAmountCanNotGreaterDueAmount'],
    //        sticky: false,
    //        position: 'bottom-right',
    //        type: 'error'

    //    });
    //}
    if (dt == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseInsertDate'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.FKInvoiceID = id;
    obj.Ammount = am;
    obj.ReceivedDate = dt;
    obj.IsEmail = false;
    obj.FKBankAccountID = $("#paymentAccountInvoice").val();
    obj.Description = desc;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/AddPaymentP',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            successToast();
            if ($("#pClientID").val().length > 0) {
                viewDetailInvoiceClientP(id);
            }
            else {
                viewDetailInvoice(id);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function sendRecipt(id, ammt, rec,page) {
    var obj = new Object();
    obj.FKInvoiceID = id;
    obj.Ammount = ammt;
    obj.PaymentID = rec;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/SendRecipt',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (!page) {
                page = 'SendRecipt';
            }
            openInvoiceNotificationPopup(data, page, "Receipt sent to client by  : ");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function sendReciptP(id, ammt, rec, page) {
    
    clearInvoiceNotificationFormP();
    var obj = new Object();
    obj.FKInvoiceID = id;
    obj.Ammount = ammt;
    obj.PaymentID = rec;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/SendReciptP',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (!page) {
                page = 'SendRecipt';
            }
            openInvoiceNotificationPopupP(data, page, "Receipt sent to client by  : ");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}


function deletePayment(id, am, inv, ref, inner) {
    
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var obj = new Object();
        obj.PaymentID = id;
        obj.Ammount = am;
        obj.FKInvoiceID = inv;
        var data = { model: obj };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Accounts/DeleteRecipt',
            async: true,
            data: JSON.stringify(obj),
            success: function (data) {
                unblockUI();
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptPaymentDeleted'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                if ($("#FromClient"))
                {
                    if ($("#FromClient").val() == 1)
                    {
                        viewDetailInvoiceClient($("#invoice_InvoiceID").val());
                    }
                }
                if (inner == 1) {
                    getAddViewStagesRefresh();
                }
                else if (inner == 2) {
                    viewDetailInvoice(inv);
                }
                else if (inner = 3) {
                    getClientAccounts();
                }
                

            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }
}

function deletePaymentP(id, am, inv, ref, inner) {

    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var obj = new Object();
        obj.PaymentID = id;
        obj.Ammount = am;
        obj.FKInvoiceID = inv;
        var data = { model: obj };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Accounts/DeleteRecipt',
            async: true,
            data: JSON.stringify(obj),
            success: function (data) {
                unblockUI();
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptPaymentDeleted'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                if ($("#FromClient")) {
                    if ($("#FromClient").val() == 1) {
                        viewDetailInvoiceClientP($("#invoice_InvoiceID").val());
                    }
                }
                if (inner == 1) {
                    getAddViewStagesRefresh();
                }
                else if (inner == 2) {
                    viewDetailInvoice(inv);
                }
                else if (inner = 3) {
                    getClientAccounts();
                }


            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }
}

function addPaymentEmail(id,page) {
    var am = $("#paymentAmountInvoice").val();
    var dt = $("#paymentDateInvoice").val();
    var damtt = $("#d-ammt").val();
    var desc = $("#paymentDescInvoice").val();
    if (am == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterAmount'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    if (parseFloat(am) < 0) {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptNegativeAmountNotAllowed'] ,
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    //if (parseFloat(am) > parseFloat(damtt)) {
    //    return $().toastmessage('showToast', {
    //        text: ScriptResourcesList['scriptAmountCanNotGreaterDueAmount'],
    //        sticky: false,
    //        position: 'bottom-right',
    //        type: 'error'

    //    });
    //}
    if (dt == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseInsertDate'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.FKInvoiceID = id;
    obj.Ammount = am;
    obj.ReceivedDate = dt;
    obj.IsEmail = true;
    obj.FKBankAccountID = $("#paymentAccountInvoice").val();
    obj.Description = desc;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/AddPayment',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data == "Saved") {
                successToast();
                viewDetailInvoice(id);
            }
            else if (data) {
                if (!page)
                {
                    page = 'AddPayment';
                }
                openInvoiceNotificationPopup(data, page, "Payment added and receipt sent to client by  : ");

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function addPaymentEmailP(id, page) {
    var am = $("#paymentAmountInvoice").val();
    var dt = $("#paymentDateInvoice").val();
    var damtt = $("#d-ammt").val();
    var desc = $("#paymentDescInvoice").val();
    if (am == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterAmount'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    if (parseFloat(am) < 0) {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptNegativeAmountNotAllowed'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    //if (parseFloat(am) > parseFloat(damtt)) {
    //    return $().toastmessage('showToast', {
    //        text: ScriptResourcesList['scriptAmountCanNotGreaterDueAmount'],
    //        sticky: false,
    //        position: 'bottom-right',
    //        type: 'error'

    //    });
    //}
    if (dt == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseInsertDate'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.FKInvoiceID = id;
    obj.Ammount = am;
    obj.ReceivedDate = dt;
    obj.IsEmail = true;
    obj.FKBankAccountID = $("#paymentAccountInvoice").val();
    obj.Description = desc;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/AddPaymentP',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data == "Saved") {
                successToast();
                viewDetailInvoiceClientP(id);
            }
            else if (data) {
                if (!page) {
                    page = 'AddPaymentP';
                }
                openInvoiceNotificationPopupP(data, page, "Payment added and receipt sent to client by  : ");
                viewDetailInvoiceClientP(id);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}


function deleteInvoice(id, payments, inner) {
    if (payments > 0) {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseFirstDeletePaymentsInvoice'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    else if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var data = { model: id };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Accounts/DeleteInvoice',
            async: true,
            data: JSON.stringify(data),
            success: function (data) {
                unblockUI();
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptInvoiceDeleted'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                if (inner == 1) {
                    getAddViewStagesRefresh();
                }
                else if (inner == 2) {
                    getClientAccounts();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }

}

function openAddPayment(id, due) {
    $("#FKInvoiceID").val(id);
    $("#pay-d-ammt").val(due);
    $('#invoice-payment-modal').modal('show');
    $('#paymentDate').datepicker({
        dateFormat: 'dd/mm/yy',
        showOn: "button",
        buttonImage: "/Content/Images/calendar.png",
        buttonImageOnly: true,
        buttonText: ScriptResourcesList['scriptSelectDate']
    });

}
function addPaymentModal(inner) {
    var id = $("#FKInvoiceID").val();
    var am = $("#paymentAmount").val();
    var dt = $("#paymentDate").val();
    var damtt = $("#pay-d-ammt").val();
    var desc = $("#paymentDesc").val();
    if (am == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterAmount']);     
        return false;
    }
    else if (parseFloat(am) <= 0) {
        showErrorToast(ScriptResourcesList['scriptAmountCanNotGreaterZeroAmount']);   
        return false;
    }
    //else if (parseFloat(am) > parseFloat(damtt)) {
    //    showErrorToast(ScriptResourcesList['scriptAmountCanNotGreaterDueAmount']);        
    //    return false;
    //}
    else if (dt == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseInsertDate']);   
        return false;
    }
    var obj = new Object();
    obj.FKInvoiceID = id;
    obj.Ammount = am;
    obj.ReceivedDate = dt;
    obj.IsEmail = false;
    obj.FKBankAccountID = $("#paymentAccount").val();
    obj.Description = desc;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/AddPayment',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {

            unblockUI();
            successToast();
            $('#invoice-payment-modal').modal('hide');
            $('body').removeClass('modal-open');
            if (inner) {
                getAddViewStagesRefresh();
            }
            else {
                getClientAccounts();
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addPaymentEmailModal() {

    var id = $("#FKInvoiceID").val();
    var am = $("#paymentAmount").val();
    var dt = $("#paymentDate").val();
    var damtt = $("#pay-d-ammt").val();
    var desc = $("#paymentDesc").val();
    if (am == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterAmount'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    if (parseFloat(am) < 0) {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptNegativeAmountNotAllowed'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    //if (parseFloat(am) > parseFloat(damtt)) {
    //    return $().toastmessage('showToast', {
    //        text: ScriptResourcesList['scriptAmountCanNotGreaterDueAmount'],
    //        sticky: false,
    //        position: 'bottom-right',
    //        type: 'error'

    //    });
    //}
    if (dt == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseInsertDate'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.FKInvoiceID = id;
    obj.Ammount = am;
    obj.ReceivedDate = dt;
    obj.IsEmail = true;
    obj.FKBankAccountID = $("#paymentAccount").val();
    obj.Description = desc;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/AddPayment',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            successToast();
            $('#invoice-payment-modal').modal('hide');
            $('body').removeClass('modal-open');
            getAddViewStagesRefresh();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function generateDepositInvoice(total, plan) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/AddInvoiceGetN?client=' + $("#FkClientIDS").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#invoice-content-start").html("");
            $("#invoice-content-start").html(data);
            $("#invoiceTo").val($("#invoiceSTo").val());
            $("#FkClientID").val($("#FkClientIDS").val());
            $("#stageTotal").val(total);
            $("#depositInvoice").val(true);
            $("#FKPlanID").val(plan);
            $("#fkStageID").val("");
            $("#item_0__Description").val("Deposit Invoice");
            $("#item_0__Amount").val(parseFloat(total));
            calculate();
            $('#inv-tax-Inclusive').prop('checked', true);
            updateTaxInformation();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function depositInvoiceReceipt(id, plan, invoice, inner) {

    var data = { amount: id, plan: plan, invoice: invoice };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/AddDepositReceipt',
        async: true,
        data: JSON.stringify(data),
        success: function (data) {
            unblockUI();
            if (inner == 1) {
                openInvoiceNotificationPopup(data, 'AddDepositReceipt1', "Deposit Receipt sent to client by  : ");
               
            }
            else if (inner == 2) {
                openInvoiceNotificationPopup(data, 'AddDepositReceipt2', "Deposit Receipt sent to client by  : ");
                
            }
           
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function depositInvoice(id, plan, inv, inner) {

    var data = { amount: id, plan: plan, invoice: inv };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/AddDeposit',
        async: true,
        data: JSON.stringify(data),
        success: function (data) {
            unblockUI();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptDepositAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'
            });
            if (inner == 1) {
                getAddViewStagesRefresh();
            }
            else if (inner == 2) {
                getClientAccounts();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function deleteDepositInvoice(id, plan, inner) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var data = { model: id, plan: plan };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Accounts/DeleteDepositInvoice',
            async: true,
            data: JSON.stringify(data),
            success: function (data) {
                unblockUI();
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptInvoiceDeleted'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                if (inner == 1) {
                    getAddViewStagesRefresh();
                }
                else if (inner == 2) {
                    getClientAccounts();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }

}
function addnewInvoiceClient(sup) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/AddInvoiceGet?client=' + $("#selected-client-id").val()+'&supplier=' + sup,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $("#invoiceTo").val($("#selected-client-name").html());
            $("#FkClientID").val($("#selected-client-id").val());
            if (sup)
            {
                $("#FromClient").val(2);
            }
            else {
                $("#FromClient").val(1);
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
   
}

function addnewInvoiceClientP() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/AddInvoiceGetPotential?client=' + $("#pClientID").val(),
        async: true,
        success: function (data) {
            
            unblockUI();
            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $("#invoiceTo").val($("#potential-client-name").html());
            $("#FkPotentialClientID").val($("#pClientID").val());

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}


function getClientInternalSupplierInvoices(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientInvoicesInternalSupplier?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $(".accountsc li").removeClass("active");
            $("#li-inv-sup").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getClientInternalInvoices(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientInvoicesInternal?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $(".accountsc li").removeClass("active");
            $("#li-inv").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function getClientInternalInvoicesP(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientInvoicesInternalP?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $(".pclient-nav li").removeClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getTemplatesApplied(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientTemplatesCPartial?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $(".accountsc li").removeClass("active");
            $("#li-temp").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getOutgoingPayments(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientOutgoing?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $(".accountsc li").removeClass("active");
            $("#li-pay").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function viewDetailInvoiceSupplierN(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/UpdateInvoice?invoice=' + id,
        async: true,
        success: function (data) {

            $("#management-content").html("");
            $("#management-content").html(data);

            unblockUI();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function getSuppliersInfo(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/SupplierInvoices?client=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $(".accountsc li").removeClass("active");
            $("#li-sup").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function addAgentToClient()
{
    var client = $("#FKClientIDAgent").val();
    var agent = $("#paymentAgent").val();
    if (agent == "")
    {
        return showErrorToast(ScriptResourcesList['scriptSelectAgent']);
    }
    var data = {
        client: client,
        agent: agent
    };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/AssignAgent',
        data: JSON.stringify(data),
        async: false,
        success: function (data) {
            unblockUI();
            $("#add-agent").modal("hide");
            $('body').removeClass('modal-open');
            $("#selected-client-agent-id").val(agent);
            return getAgentComission(client); 
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getAgentComission(id) {
    if ($("#selected-client-agent-id").val() == "0") {
        $("#FKClientIDAgent").val(id);
        $("#add-agent").modal("show");
        return false;
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/AgentComission?client=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $(".accountsc li").removeClass("active");
            $("#li-agent").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getSchoolInfo(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Addmission/SchoolInvoices?client=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $(".accountsc li").removeClass("active");
            $("#li-sch").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getClientInvoices(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientInvoices?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $(".accountsc li").removeClass("active");
            $("#li-inv").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getAccountsFlow(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientAccountsFlow?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $(".accountsc li").removeClass("active");
            $("#li-flow").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function generateDepositInvoiceClient(total, plan) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/AddInvoiceGetNC?client=' + $("#FkClientIDS").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-content").html("");
            $("#client-content").html(data);

            $("#invoiceTo").val($("#invoiceSTo").val());
            $("#FkClientID").val($("#FkClientIDS").val());
            $("#stageTotal").val(total);
            $("#depositInvoice").val(true);
            $("#FKPlanID").val(plan);
            $("#fkStageID").val("");
            $("#item_0__Description").val("Deposit Invoice");
            $("#item_0__Amount").val(parseFloat(total));
            calculate();
            $('#inv-tax-Inclusive').prop('checked', true);
            updateTaxInformation();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getAddViewStageClient(stage, total, description, amount, taxinc, taxname, limit) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/AddInvoiceGetNC?client=' + $("#FkClientIDS").val(),
        async: true,
        success: function (data) {
            $("#client-content").html("");
            $("#client-content").html(data);

            $("#invoiceTo").val($("#invoiceSTo").val());
            $("#FkClientID").val($("#FkClientIDS").val());
            $("#fkStageID").val(stage);
            $("#stageTotal").val(limit);
            $("#item_0__Description").val(description);
            $("#item_0__Amount").val(parseFloat(amount) - parseFloat(total));
            calculate();
            if (taxinc == "True") {
                $('#inv-tax-Inclusive').prop('checked', true);
                updateTaxInformation();
            }
            else {
                $("#inv-tax-ddl").val(taxname);
                setTaxPercent();
            }
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function updateNewInvoiceClient(id,dp) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/UpdateInvoiceNC?invoice=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-content").html("");
            $("#client-content").html(data);
            $("#depositInvoice").val(dp);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function sendFollowUpEmailSchool(id) {
    if (confirm(ScriptResourcesList['scriptConfirmationInvoiceEmailAgain'])) {
        var data = {
            id: id
        };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/School/FollowUpEmail',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    openInvoiceNotificationPopup(data, 'FollowUpSchool', '');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }

}
function sendFollowUpEmail(id, page) {
    if (confirm(ScriptResourcesList['scriptConfirmationInvoiceEmailAgain'])) {
        var data = {
            id: id
        };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Accounts/FollowUpEmail',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    var pagen = 'FollowUp';
                    if (page == 'N') {
                        pagen = 'FollowUpN';
                    }
                    else if (page == 'NC') {
                        pagen = 'FollowUpNC';
                    }
                    openInvoiceNotificationPopup(data, pagen, 'Invoice resent via email to client  : ');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }

}

function sendFollowUpEmailP(id, page) {
    if (confirm(ScriptResourcesList['scriptConfirmationInvoiceEmailAgain'])) {
        var data = {
            id: id
        };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Accounts/FollowUpEmailP',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    var pagen = 'FollowUp';
                    if (page == 'N') {
                        pagen = 'FollowUpN';
                    }
                    else if (page == 'NC') {
                        pagen = 'FollowUpNC';
                    }
                    openInvoiceNotificationPopupP(data, pagen, 'Invoice resent via email to client  : ');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }

}

function sendEmailNotificationInvoice(send) {
    var page = $('#invoice-notification-page').val();
    var invoiceId = $('#invoice-notification-invoiceId').val();
    if (!send) {
        clearInvoiceNotificationForm();
        return doNextStepAfterEmail(page, invoiceId,false);
    }
    if ($("#invoice-notification-To").val() == '') {
        return showErrorToast(ScriptResourcesList['scriptPleaseEnterEmail']);

    }
    if ($("#invoice-notification-To").val() != '') {
        var cc = $("#invoice-notification-To").val().split(',');
        if (cc.length == 0) {
            if (!validateEmail($("#invoice-notification-To").val().trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
        for (var i = 0; i < cc.length; i++) {

            if (!validateEmail(cc[i].trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
    }
    if ($("#invoice-notification-cc").val() != '') {
        var cc = $("#invoice-notification-cc").val().split(',');
        if (cc.length == 0) {
            if (!validateEmail($("#invoice-notification-cc").val().trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
        for (var i = 0; i < cc.length; i++) {

            if (!validateEmail(cc[i].trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
    }
    if ($("#invoice-notification-bcc").val() != '') {
        var bcc = $("#invoice-notification-bcc").val().split(',');
        if (bcc.length == 0) {
            if (!validateEmail($("#invoice-notification-bcc").val().trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
        for (var i = 0; i < bcc.length; i++) {

            if (!validateEmail(bcc[i].trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
    }
    if ($("#invoice-notification-Subject").val() == "") {
        $("#invoice-notification-Subject").focus();
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterSubject'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'
        });
    }
    if ($("#invoice-notification-message").val() == "") {
        $("#invoice-notification-message").focus();
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterMessage'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'
        });
    }
    var msg = new Object();
    msg.ClientID = $('#invoice-notification-client').val();
    msg.InvoiceId = invoiceId;
    msg.To = $('#invoice-notification-To').val();
    msg.CC = $('#invoice-notification-cc').val();
    msg.BCC = $('#invoice-notification-bcc').val();
    msg.FileName = $('#invoice-notification-file').val();
    msg.Url = $('#invoice-notification-url').val();
    msg.Subject = $('#invoice-notification-Subject').val();
    msg.Message = $('#invoice-notification-message').val();
    msg.LogPrefix = $('#invoice-notification-log').val();
    msg.Type = $('#invoice-notification-type').val();
    msg.Page = page;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/SendEmailNotification',
        async: true,
        data: JSON.stringify(msg),
        success: function (data) {
            unblockUI();
            clearInvoiceNotificationForm();
            doNextStepAfterEmail(page, invoiceId, true)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}

function sendEmailNotificationInvoiceP(send) {
    var page = $('#invoice-notification-pageP').val();
    var invoiceId = $('#invoice-notification-invoiceIdP').val();
    if (!send) {
        clearInvoiceNotificationFormP();
        return doNextStepAfterEmail(page, invoiceId, false);
    }
    if ($("#invoice-notification-ToP").val() == '') {
        return showErrorToast(ScriptResourcesList['scriptPleaseEnterEmail']);

    }
    if ($("#invoice-notification-ToP").val() != '') {
        var cc = $("#invoice-notification-ToP").val().split(',');
        if (cc.length == 0) {
            if (!validateEmail($("#invoice-notification-ToP").val().trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
        for (var i = 0; i < cc.length; i++) {

            if (!validateEmail(cc[i].trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
    }
    if ($("#invoice-notification-ccP").val() != '') {
        var cc = $("#invoice-notification-ccP").val().split(',');
        if (cc.length == 0) {
            if (!validateEmail($("#invoice-notification-ccP").val().trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
        for (var i = 0; i < cc.length; i++) {

            if (!validateEmail(cc[i].trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
    }
    if ($("#invoice-notification-bccP").val() != '') {
        var bcc = $("#invoice-notification-bccP").val().split(',');
        if (bcc.length == 0) {
            if (!validateEmail($("#invoice-notification-bccP").val().trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
        for (var i = 0; i < bcc.length; i++) {

            if (!validateEmail(bcc[i].trim())) {
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
    }
    if ($("#invoice-notification-SubjectP").val() == "") {
        $("#invoice-notification-SubjectP").focus();
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterSubject'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'
        });
    }
    if ($("#invoice-notification-messageP").val() == "") {
        $("#invoice-notification-messageP").focus();
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterMessage'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'
        });
    }
    var msg = new Object();
    msg.ClientID = $('#invoice-notification-clientP').val();
    msg.InvoiceId = invoiceId;
    msg.To = $('#invoice-notification-ToP').val();
    msg.CC = $('#invoice-notification-ccP').val();
    msg.BCC = $('#invoice-notification-bccP').val();
    msg.FileName = $('#invoice-notification-fileP').val();
    msg.Url = $('#invoice-notification-urlP').val();
    msg.Subject = $('#invoice-notification-SubjectP').val();
    msg.Message = $('#invoice-notification-messageP').val();
    msg.LogPrefix = $('#invoice-notification-logP').val();
    msg.Type = $('#invoice-notification-typeP').val();
    msg.Page = page;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/SendEmailNotificationP',
        async: true,
        data: JSON.stringify(msg),
        success: function (data) {
            unblockUI();
            clearInvoiceNotificationFormP();
            doNextStepAfterEmail(page, invoiceId, true)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}

function viewDetailInvoiceClientSupplier(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/UpdateInvoice?invoice=' + id + '&supplier=true',
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $("#FromClient").val(2);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function viewDetailInvoiceClient(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/UpdateInvoice?invoice=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
            $("#FromClient").val(1);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function viewDetailInvoiceClientP(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/UpdateInvoicePotential?invoice=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $("#FromClient").val(1);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function doNextStepAfterEmail(page, id,sent) {
    if (page == "AddInvoiceGet") {
        if (sent == true)
        {
            successToast();
        }
        
        getAddViewDefault();
        return true;
    }
    else if (page == "AddInvoiceGetClient") {
        if (sent == true) {
            successToast();
        }
        addnewInvoiceClient(false);
        return true;
    }
    else if (page == "UpdateInvoiceClient") {
        if (sent == true) {
            successToast();
        }
        viewDetailInvoiceClient($("#invoice_InvoiceID").val());
        return true;
    }
    else if (page == "UpdateInvoice") {
        if (sent == true) {
            successToast();
        }
        viewDetailInvoice($("#invoice_InvoiceID").val());
        return true;
    }
    else if (page == "UpdateInvoiceN") {
        if (sent == true) {
            successToast();

        }
        updateNewInvoice($("#invoice_InvoiceID").val());
        return true;
    }
    else if (page == "UpdateInvoiceNC") {
        if (sent == true) {
            successToast();
        }
        updateNewInvoiceClient($("#invoice_InvoiceID").val());
        return true;
    }
    else if (page == "AddInvoiceGetN") {
        if (sent == true) {
            successToast();
        }
      
        getAddViewStagesRefresh();
        return true;
    }
    else if (page == "AddInvoiceGetNC") {
        if (sent == true) {
            successToast();
        }
       
        getClientAccounts();
        return true;
    }
    else if (page == "FollowUp") {
        if (sent == true) {
            showSuccessToast(ScriptResourcesList['scriptEmailSentToClient']);
        }
       
        viewDetailInvoice(id);
        return true;
    }
    else if (page == "FollowUpN") {
        if (sent == true) {
            return showSuccessToast(ScriptResourcesList['scriptEmailSentToClient']);
        }
        
    }
    else if (page == "FollowUpNC") {
        if (sent == true) {
            return showSuccessToast(ScriptResourcesList['scriptEmailSentToClient']);
        }
       
    }
    else if (page == "AddPayment") {
        if (sent == true) {
            successToast();
        }
        if ($("#selected-client-id").val().length > 0)
        {
            viewDetailInvoiceClient(id);
        }
        else
        {
            viewDetailInvoice(id);
        }
        
        return true;
    }
   else  if (page == "SendRecipt") {
        if (sent == true) {
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptPaymentReceiptSent'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
        }

     
    }
    else if (page == "AddDepositReceipt1") {
        if (sent == true) {
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptReceiptSent'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
        }      
        getAddViewStagesRefresh();
        return true;
    }
    else if (page == "AddDepositReceipt2") {
        if (sent == true) {
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptReceiptSent'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
        }
        getClientAccounts();
        return true;
    }
    else if (page == "SchoolAddInvoice") {
        if (sent == true) {
            successToast();
        }
      
        getSchoolAccounts();
        return true;
    }
    else if (page == "SchoolUpdateInvoice") {
        if (sent == true) {
            successToast();
        }
       
        viewDetailInvoiceSchool(id);
        return true;
    }
    else if (page == "FollowUpSchool") {
        if (sent == true) {
            successToast();
        }
        
        viewDetailInvoiceSchool(id);
        return true;
    }
    else if (page == "SendReciptSchool") {
        if (sent == true) {
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptPaymentReceiptSent'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
        }
       
        return true;
    }
    else if (page == "UpdateInvoiceGetClientSupplier") {
        if (sent == true) {
            successToast();
        }
        viewDetailInvoiceClientSupplier($("#invoice_InvoiceID").val());
        return true;
    }
    else if (page == "AddInvoiceGetClientSupplier") {
        if (sent == true) {
            successToast();
        }
        addnewInvoiceClient(true);
        return true;
    }
    else if (page == "SendReciptSupplier") {
        if (sent == true) {
            successToast();
        }
        viewDetailInvoiceClientSupplier($("#invoice_InvoiceID").val());
        return true;
    }
}
function openInvoiceNotificationPopup(msg, page, log) {
    $('#invoice-notification-page').val(page);
    $('#invoice-notification-client').val(msg.ClientID);
    $('#invoice-notification-invoiceId').val(msg.InvoiceId);
    $('#invoice-notification-attachment').html('<a href="/Client/DownloadFileStream?blob=' + msg.Url + '&filename=' + msg.FileName + '">' + msg.FileName + '</a>');
    $('#invoice-notification-To').val(msg.To);
    $('#invoice-notification-type').val(msg.Type);
    $('#invoice-notification-file').val(msg.FileName);
    $('#invoice-notification-url').val(msg.Url);
    $('#invoice-notification-log').val(log);
    $('#invoice-notification-Subject').val(msg.Subject);
    $("#invoice-notification-message").summernote({
        popover: {
            image: [
                ['custom', ['imageAttributes']],
                ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                ['float', ['floatLeft', 'floatRight', 'floatNone']],
                ['remove', ['removeMedia']]
            ],
        },
        imageAttributes: {
            icon: '<i class="note-icon-pencil"/>',
            removeEmpty: false, // true = remove attributes | false = leave empty if present
            disableUpload: false // true = don't display Upload Options | Display Upload Options
        }, 
        callbacks: {
            onPaste: function (e) {
                var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');

                e.preventDefault();

                // Firefox fix
                setTimeout(function () {
                    document.execCommand('insertText', false, bufferText);
                }, 10);
            },
             onInit: function () {
                 var updatedTemp = removeElements(msg.Message, "font");
                 $("#invoice-notification-message").summernote('code', updatedTemp);
                 if (_defaultFont != "") {
                     $('#invoice-notification-message').summernote('fontName', _defaultFont);
                     $(".dropdown-fontname a").removeClass("checked");
                     $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                     $(".note-current-fontname").html(_defaultFont);
                     $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
                 }
            }
        },
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['picture', ['picture', 'link']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['fontname', ['fontname']],
            ['height', ['height']],
            ['link', ['linkDialogShow', 'unlink']],
            ['table', ['table']],
            ['codeview', ['codeview']],
            ['undo', ['undo']],
            ['redo', ['redo']]
        ],
        height: 250,
        fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
            'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
        fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
            'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']
    });
  
        $("#modal-email-invoice-notifcation").modal("show");
   
}

function openInvoiceNotificationPopupP(msg, page, log) {
    clearInvoiceNotificationFormP();
    $('#invoice-notification-pageP').val(page);
    $('#invoice-notification-clientP').val(msg.ClientID);
    $('#invoice-notification-invoiceIdP').val(msg.InvoiceId);
    $('#invoice-notification-attachmentP').html('<a href="/Client/DownloadFileStream?blob=' + msg.Url + '&filename=' + msg.FileName + '">' + msg.FileName + '</a>');
    $('#invoice-notification-ToP').val(msg.To);
    $('#invoice-notification-typeP').val(msg.Type);
    $('#invoice-notification-fileP').val(msg.FileName);
    $('#invoice-notification-urlP').val(msg.Url);
    $('#invoice-notification-logP').val(log);
    $('#invoice-notification-SubjectP').val(msg.Subject);
    $("#invoice-notification-messageP").summernote({
        popover: {
            image: [
                ['custom', ['imageAttributes']],
                ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                ['float', ['floatLeft', 'floatRight', 'floatNone']],
                ['remove', ['removeMedia']]
            ],
        },
        imageAttributes: {
            icon: '<i class="note-icon-pencil"/>',
            removeEmpty: false, // true = remove attributes | false = leave empty if present
            disableUpload: false // true = don't display Upload Options | Display Upload Options
        },
        callbacks: {
            onPaste: function (e) {
                var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');

                e.preventDefault();

                // Firefox fix
                setTimeout(function () {
                    document.execCommand('insertText', false, bufferText);
                }, 10);
            },
            onInit: function () {
                var updatedTemp = removeElements(msg.Message, "font");
                $("#invoice-notification-messageP").summernote('code', updatedTemp);
                if (_defaultFont != "") {
                    $('#invoice-notification-messageP').summernote('fontName', _defaultFont);
                    $(".dropdown-fontname a").removeClass("checked");
                    $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                    $(".note-current-fontname").html(_defaultFont);
                    $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
                }
            }
        },
        toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['picture', ['picture', 'link']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['fontname', ['fontname']],
            ['height', ['height']],
            ['link', ['linkDialogShow', 'unlink']],
            ['table', ['table']],
            ['codeview', ['codeview']],
            ['undo', ['undo']],
            ['redo', ['redo']]
        ],
        height: 250,
        fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
            'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
        fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
            'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']
    });
        $("#modal-email-invoice-notifcationP").modal("show");
}

function clearInvoiceNotificationForm() {
    $('#invoice-notification-type').val('');
    $('#invoice-notification-page').val('');
    $('#invoice-notification-client').val('');
    $('#invoice-notification-invoiceId').val('');
    $('#invoice-notification-attachment').html('');
    $('#invoice-notification-To').val('');
    $('#invoice-notification-cc').val('');
    $('#invoice-notification-bcc').val('');
    $('#invoice-notification-file').val('');
    $('#invoice-notification-url').val('');
    $('#invoice-notification-Subject').val('');
    $("#invoice-notification-message").summernote('destroy');
    $('#modal-email-invoice-notifcation').modal('hide');
    $('body').removeClass('modal-open');
}

function clearInvoiceNotificationFormP() {
    $('#invoice-notification-typeP').val('');
    $('#invoice-notification-pageP').val('');
    $('#invoice-notification-clientP').val('');
    $('#invoice-notification-invoiceIdP').val('');
    $('#invoice-notification-attachmentP').html('');
    $('#invoice-notification-ToP').val('');
    $('#invoice-notification-ccP').val('');
    $('#invoice-notification-bccP').val('');
    $('#invoice-notification-fileP').val('');
    $('#invoice-notification-urlP').val('');
    $('#invoice-notification-SubjectP').val('');
    $("#invoice-notification-messageP").summernote('destroy');
    $('#modal-email-invoice-notifcationP').modal('hide');
    $('body').removeClass('modal-open');
}


function updateTaxGet(id, name, number, percent) {
    $("#tax-modal .errorSpanModal").html("");
    $("#tax-name").val(name);
    $("#hdn-name-tax").val(name);
    $("#tax-number").val(number);
    $("#tax-percent").val(percent);
    $("#hdn-taxid").val(id);
    $('#tax-modal').modal('show');
}
function updateAccountGet(id, name, number, title, bank) {
    $("#acc-modal .errorSpanModal").html("");
    $("#hdn-accid").val(id);
    $("#acc-name").val(name);
    $("#acc-number").val(number);
    $("#acc-title").val(title);
    $("#acc-bank-name").val(bank);
    $('#acc-modal').modal('show');
}
function updateDocTypeGet(id, name) {
    $("#doc-type-modal .errorSpanModal").html("");
    $("#hdn-doc-type").val(id);
    $("#doc-type-name").val(name);

    $('#doc-type-modal').modal('show');
}
function updateNotesGet(id) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/GetNote',
        data: JSON.stringify({ id: id }),
        async: true,
        success: function (data) {
            unblockUI();
            $("#notes-modal .errorSpanModal").html("");
            $("#hdn-notesid").val(id);
            $("#notes-name").val(data.Name);
            $("#notes-notes").val(data.Notes);
            $('#notes-modal').modal('show');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function updateOutgoingSourcesGet(id, name) {
    $("#ogs-modal .errorSpanModal").html("");
    $("#hdn-ogsid").val(id);
    $("#ogs-name").val(name);
    $('#ogs-modal').modal('show');
}
function updateNotesPost() {
    $("#notes-modal .errorSpanModal").html("");
    var name = $("#notes-name").val();
    var note = $("#notes-notes").val();

    var obj = new Object();
    obj.ID = $("#hdn-notesid").val();
    obj.Name = name;
    obj.Notes = note;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/UpdateNotes',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptNotesUpdated'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            $('#notes-modal').modal('hide');
            $('body').removeClass('modal-open');

            SwitchInvoiceView('5');
            $("#notes-well").focus();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function updateOutgoingSources() {
    $("#ogs-modal .errorSpanModal").html("");
    var name = $("#ogs-name").val();

    var obj = new Object();
    obj.ID = $("#hdn-ogsid").val();
    obj.Name = name;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/UpdateOutgoingSource',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptUpdated'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            $('#ogs-modal').modal('hide');
            $('body').removeClass('modal-open');

            SwitchInvoiceView('5');
            $("#ogs-well").focus();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function updateTaxPost() {
    $("#tax-modal .errorSpanModal").html("");
    var name = $("#tax-name").val();
    var number = $("#tax-number").val();
    var percent = $("#tax-percent").val();
    var pname = $("#hdn-name-tax").val();
    var obj = new Object();
    obj.TaxID = $("#hdn-taxid").val();
    obj.Name = name;
    obj.Number = number;
    obj.Percent = percent;
    blockUI();
   
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/CheckTaxName',
        async: false,
        data: JSON.stringify({ name: name }),
        success: function (data) {
            if (data == true || pname == name) {
                $.ajax({
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    url: '/CInfo/UpdateTax',
                    async: false,
                    data: JSON.stringify(obj),
                    success: function (data) {
                        unblockUI();
                        $().toastmessage('showToast', {
                            text: ScriptResourcesList['scriptTaxInfoUpdated'],
                            sticky: false,
                            position: 'bottom-right',
                            type: 'success'

                        });
                        $('#tax-modal').modal('hide');
                        $('body').removeClass('modal-open');

                        SwitchInvoiceView('5');
                        $("#tax-well").focus();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        unblockUI();
                        handleErrors(textStatus);
                    }
                });
            }
            else {
                unblockUI();
                $("#tax-name").next(".errorSpanModal").html(ScriptResourcesList['scriptTaxWithTheSameNameExists']);
                $("#tax-name").next(".errorSpanModal").show();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function updateAccountPost() {
    $("#acc-modal .errorSpanModal").html("");
    var name = $("#acc-name").val();
    var number = $("#acc-number").val();
    var title = $("#acc-title").val();
    var bank = $("#acc-bank-name").val();

    var obj = new Object();
    obj.ID = $("#hdn-accid").val();
    obj.Name = name;
    obj.Number = number;
    obj.Title = title;
    obj.Bank = bank;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/UpdateAccount',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptAccountInfoUpdated'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            $('#acc-modal').modal('hide');
            $('body').removeClass('modal-open');

            SwitchInvoiceView('5');
            $("#acc-well").focus();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function deleteTax(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/DeleteTax',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);

            }
        });
    }
}
function deleteOutgoingSources(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/DeleteOutgoingSources',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);

            }
        });
    }
}
function deleteAccount(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/DeleteAccount',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);

            }
        });
    }
}
function addPaymentSchool(id) {
    var am = $("#paymentAmount").val();
    var dt = $("#paymentDate").val();
    var damtt = $("#d-ammt").val();
    var desc = $("#paymentDesc").val();
    if (am == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterAmount'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    if (parseFloat(am) < 0) {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptNegativeAmountNotAllowed'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    //if (parseFloat(am) > parseFloat(damtt)) {
    //    return $().toastmessage('showToast', {
    //        text: ScriptResourcesList['scriptAmountCanNotGreaterDueAmount'],
    //        sticky: false,
    //        position: 'bottom-right',
    //        type: 'error'

    //    });
    //}
    if (dt == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseInsertDate'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.FKInvoiceID = id;
    obj.Ammount = am;
    obj.ReceivedDate = dt;
    obj.IsEmail = false;
    obj.FKBankAccountID = $("#paymentAccount").val();
    obj.Description = desc;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/School/AddPayment',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {

            unblockUI();
            successToast();
            viewDetailInvoiceSchool(id);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function sendReciptSchool(id, ammt, rec) {
    var obj = new Object();
    obj.FKInvoiceID = id;
    obj.Ammount = ammt;
    obj.PaymentID = rec;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/School/SendRecipt',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            openInvoiceNotificationPopup(data, 'SendReciptSchool', "");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function deletePaymentSchool(id, am, inv, ref) {
    var obj = new Object();
    obj.PaymentID = id;
    obj.Ammount = am;
    obj.FKInvoiceID = inv;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/School/DeleteRecipt',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptPaymentDeleted'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            $(ref).parent().parent().remove();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addStudentsToItems() {
    var dataList = [];
    $('.selected-student:checked').each(function () {
        dataList.push($(this).val())
    });

    if (dataList.length == 0) {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectStudent'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    blockUI();
    $(".save_btn").attr("disabled", true);
    var data = { data: dataList, id: $("#FKSchoolID").val(), from: $("#date-from-student").val(), to: $("#date-to-student").val() }
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/School/StudentItem',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $(".save_btn").attr("disabled", false);
            if (data.length == 0) {
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptNoAdmissionFoundTimeFrame'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }
            if (data.length > 0) {
                var count = parseInt($("#items-table tr").length) - 1;
                for (var i = 0; i < data.length; i++) {

                    var row = "<tr>";
                    row += "<td><input type='hidden' class='hdn-prg' name='itemSchool[" + count + "].FKProgramID' value='" + data[i].FKProgramID + "'/><input type='hidden' class='hdn-clt' name='itemSchool[" + count + "].FKClientID' value='" + data[i].FKClientID + "'/><input type='hidden' class='hdn-sno' name='itemSchool[" + count + "].SNO' value='" + (count + 1) + "'/><span class='sn-no'>" + (count + 1) + "</span></td>";
                    row += "<td><input type='text' class = 'info_input'  name='itemSchool[" + count + "].StudentNumber' value='" + data[i].StudentNumber + "'/></td>";
                    row += "<td><input type='text' class = 'info_input'  name='itemSchool[" + count + "].StudentName' value='" + data[i].StudentName + "'/></td>";
                    row += "<td><input type='text' class = 'info_input'  name='itemSchool[" + count + "].ProgrammeName' value='" + data[i].ProgrammeName + "'/></td>";
                    row += "<td><input type='text' class = 'info_input'  name='itemSchool[" + count + "].StartDate' value='" + data[i].StartDateStr + "'/></td>";
                    row += "<td><input type='text' class = 'info_input prg-fee'  name='itemSchool[" + count + "].ProgrammeFee' value='" + data[i].ProgrammeFee + "' onchange='calculateItemSchool(this)'/></td>";
                    row += "<td><input type='text' class = 'info_input rate-com'  name='itemSchool[" + count + "].CommissionRate' value='" + data[i].CommissionRate + "'  onchange='calculateItemSchool(this)'/></td>";
                    row += "<td><input type='text' class = 'info_input item-amount'  name='itemSchool[" + count + "].CommissionAmount' value='" + data[i].CommissionAmount.toFixed(2) + "' readonly /></td>";
                    row += "<td style='cursor:pointer;' onclick='removeRowSchool(this)'>" + ScriptResourcesList['scriptRemove']+"</td>";
                    row += "</tr>";
                    $("#items-table").append(row);
                    count++;
                }
                calculateSchool();

            }

            $("#inv-stu-ddl").multiselect('refresh');
            $("#school-new-modal").modal('hide');
            $('body').removeClass('modal-open');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function removeRowSchool(ref) {
    $(ref).parent().remove();
    calculateSchool();
    setSnSchool();
}
function setSnSchool() {
    var sn = 0;
    $("#items-table tr:gt(0)").each(function () {

        $(this).find('td:eq(0) .sn-no').html(parseInt(sn) + 1);
        $(this).find('td:eq(0) .hdn-id').attr('name', 'itemSchool[' + sn + '].ID');
        $(this).find('td:eq(0) .hdn-prg').attr('name', 'itemSchool[' + sn + '].FKProgramID');
        $(this).find('td:eq(0) .hdn-clt').attr('name', 'itemSchool[' + sn + '].FKClientID');
        $(this).find('td:eq(0) .hdn-sno').attr('name', 'itemSchool[' + sn + '].SNO');
        $(this).find('td:eq(1) input').attr('name', 'itemSchool[' + sn + '].StudentNumber');
        $(this).find('td:eq(2) input').attr('name', 'itemSchool[' + sn + '].StudentName');
        $(this).find('td:eq(3) input').attr('name', 'itemSchool[' + sn + '].ProgrammeName');
        $(this).find('td:eq(4) input').attr('name', 'itemSchool[' + sn + '].StartDate');
        $(this).find('td:eq(5) input').attr('name', 'itemSchool[' + sn + '].ProgrammeFee');
        $(this).find('td:eq(6) input').attr('name', 'itemSchool[' + sn + '].CommissionRate');
        $(this).find('td:eq(7) input').attr('name', 'itemSchool[' + sn + '].CommissionAmount');
        sn++
    });
}
function showStudentsFilterd() {
    var data = { id: $("#FKSchoolID").val(), from: $("#date-from-student").val(), to: $("#date-to-student").val() }
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/School/StudentItemView',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $("#studentDetailBody").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });


}
function addNewLineSchool() {
    var data = { id: $("#FKSchoolID").val() }
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/School/StudentItemView',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $("#studentDetailBody").html(data);
            $("#school-new-modal").modal('show');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });


}
function calculateItemSchool(ref) {
    var tr = $(ref).parent().parent();
    var fee = $(tr).find(".prg-fee").val();
    var rate = $(tr).find(".rate-com").val();
    if (parseInt(fee) <= 0) {
        $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterFeeGreater'],
            sticky: true,
            position: 'bottom-right',
            type: 'warning'
        });
        return false;
    }
    if (parseInt(fee) <= 0) {
        $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterCommissionGreater'],
            sticky: true,
            position: 'bottom-right',
            type: 'warning'
        });
        return false;
    }
    var com = (parseFloat(fee) / parseFloat(100)) * parseFloat(rate);
    $(tr).find(".item-amount").val(com.toFixed(2));
    calculateSchool();
}
function calculateSchool(ref) {
    var ret = false;
    var itemTotal = 0;
    var id = "";
    if (ref) {
        id = $(ref).attr("id");
    }

    $(".item-amount").each(function () {

        var val = this.value;
        if (parseFloat(val) < 0) {
            $(this).css("border-color", "red");
            ret = true
            return false;
        }
        if (val) {
            itemTotal = itemTotal + parseFloat(val);
        }


    });


    if (ret) {
        return false;
    }
    $("#sub-total").val(itemTotal.toFixed(2));
    var total = itemTotal;

    var gstP = $("#gst-total").val();
    if (gstP) {
        gstp = parseFloat(gstP) / 100 * itemTotal;
        total = parseFloat(itemTotal) + parseFloat(gstp);
    }
    $("#amount-total").val(total.toFixed(2));
    var dis = $("#discount-total").val();
    var dis_amt = $("#discAmount").val();
    if (id == "discount-total") {
        if (dis) {
            dis = parseFloat(dis) / 100 * itemTotal;
            $("#discAmount").val(dis.toFixed(2));
            total = parseFloat(total) - parseFloat(dis);
        }

    }
    else {

        if (dis_amt) {
            disamt = parseFloat(dis_amt) / itemTotal * 100;
            $("#discount-total").val(disamt.toFixed(2));
            total = parseFloat(total) - parseFloat(dis_amt);
        }

    }

    $("#amount-total").val(total.toFixed(2));

}
function getAddViewStage(stage, total, description, amount, taxinc, taxname, limit) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/AddInvoiceGetN?client=' + $("#FkClientIDS").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#invoice-content-start").html("");
            $("#invoice-content-start").html(data);

            $("#invoiceTo").val($("#invoiceSTo").val());
            $("#FkClientID").val($("#FkClientIDS").val());
            $("#fkStageID").val(stage);
            $("#stageTotal").val(limit);
            $("#item_0__Description").val(description);
            $("#item_0__Amount").val(parseFloat(amount) - parseFloat(total));
            calculate();
            if (taxinc == "True") {
                $('#inv-tax-Inclusive').prop('checked', true);
                updateTaxInformation();
            }
            else {
                $("#inv-tax-ddl").val(taxname);
                setTaxPercent();
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function updateNewInvoice(id,dp) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/UpdateInvoiceN?invoice=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#invoice-content-start").html("");
            $("#invoice-content-start").html(data);
            $("#depositInvoice").val(dp);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getAddViewDefault() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/AddInvoiceGet?client=' + $("#FkClientIDS").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#invoice-content-start").html("");
            $("#invoice-content-start").html(data);
            $("#invoiceTo").val($("#invoiceSTo").val());
            $("#FkClientID").val($("#FkClientIDS").val());
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getAddViewStages(id, to, client) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientTemplates?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#invoice-content-start").html("");
            $("#invoice-content-start").html(data);
            $("#invoiceSTo").val(to);
            $("#FkClientIDS").val(client);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getAddViewStagesRefresh() {
    blockUI();
    var id = $("#FkClientIDS").val();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientTemplates?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#invoice-content-start").html("");
            $("#invoice-content-start").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function checkForNoTax() {
    if ($("#invoice_FKInvoiceType").val() == "13") {
        $("#tax-info").hide();
        $("#gst-total").val(0);
        calculate($("#gst-total"));
    }
    else {
        if ($("#inv-tax-ddl").length > 0)
        {
            $("#tax-info").show();
            setTaxPercent();
        }
        else {
            $("#tax-info").show();
            $("#gst-total").val($("#hdnGST").val());
            calculate($("#gst-total"));
        }
        
    }
}
function updatePaymentPlan(id,t) {
  
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/UpdatePaymentPlan',
        async: false,
        data: JSON.stringify({ id: id, t: t }),
        success: function (data) {
            unblockUI();
            getClientAccounts();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function AddPayPalSetting() {
    var ClientID = $("#ClientID").val();
    var ClientSecret = $("#ClientSecret").val();
    var FKCompanyID = $("#CompanyID").val();
    var ID = $('#PayPalIntegrationID').val();
    if (ClientID == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterClientID'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    if (ClientSecret == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterClientID'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.ID = ID;
    obj.ClientID = ClientID;
    obj.ClientSecret = ClientSecret;
    obj.FKCompanyID = FKCompanyID;
    var data = { model: obj };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/Paypal',
        async: true,
        data: JSON.stringify(obj),
        success: function (id) {
            unblockUI();
            $('#PayPalIntegrationID').val(id);
            successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptIMAPConnectionError'],
                sticky: false,
                position: 'bottom-right',
                type: 'error'

            });
        }
    });
}
