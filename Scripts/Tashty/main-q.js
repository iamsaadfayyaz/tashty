//admin = [];

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
function sessionExpired(ref)
{
    window.location = "../Home";

    $(ref).modal('hide');
}
function showComingSoon() {
    return $().toastmessage('showToast', {
        text: 'Coming Soon !',
        sticky: false,
        position: 'bottom-right',
        type: 'warning'

    });
}
function showUpdateMessage() {
    return $().toastmessage('showToast', {
        text: 'We are updating forms, sorry for the inconvenience',
        sticky: false,
        position: 'bottom-right',
        type: 'warning'

    });
}
function underDevelopement()
{
    return $().toastmessage('showToast', {
        text: 'Under Maintenance',
        sticky: false,
        position: 'bottom-right',
        type: 'warning'

    });
}
function successToast()
{
    return $().toastmessage('showToast', {
        text: 'Updated',
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
        text: 'Failed',
        sticky: false,
        position: 'bottom-right',
        type: 'error'

    });
}



