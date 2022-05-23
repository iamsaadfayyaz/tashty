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



function openDetailPopUp(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/NewPark/SharedClientDetail?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#details-client-modal .modal-body").html(data);
            $("#details-client-modal").modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
    $("#").modal("show");
}