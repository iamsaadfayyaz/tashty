var clients = [];
var dontShowDocs = true;
var fromUpdateChild = false;
var fromUpdatePartner = false;
var taskDate = "";
var toggle = true;
var toggleEmp = true;
var removeElements = function (text, selector) {
    var wrapped = $("<div>" + text + "</div>");
    wrapped.find(selector).contents().unwrap();
    return wrapped.html();
}
$(document).ready(function () {
    bindHidePanel();

    if ($("#client-link")) {
        $("#client-link").autocomplete({
            source: function (request, response) {
                blockUI();
                $.ajax({
                    url: '/Client/getAllClientsForAuto', type: "GET",
                    dataType: "json",
                    data: { term: request.term },
                    position: { collision: "flip" },
                    success: function (data) {
                        unblockUI();
                        response($.map(data, function (item) {
                            return {
                                id: item.id,
                                value: item.value,
                                label: item.label,
                                passport: item.passport,
                                dob: item.dob,
                                modified: item.modified,
                                uploaded: item.uploaded,
                                image: item.image,
                                imageurl: item.imageurl,
                                email: item.email,
                                mobile: item.mobile,
                                clientno: item.clientno
                            };
                        }))
                    }
                })

            },
            minLength: 2,
            focus: function (event, ui) {
                $(this).val(ui.item.label);
                //$("#familLinkAuto").val(ui.item.label);
                return false;
            },
            select: function (event, ui) {
                $(this).val(ui.item.label);
                $("#client-link-name").val(ui.item.label);
                $("#client-link-id").val(ui.item.id);
                assignQuestionnaireToClient(ui.item.id);
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptPleaseSelectUser'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                return false;
            }
        }).data("ui-autocomplete")._renderItem = function (ul, item) {
            var image = "";
            if (item.image) {
                image = '<img width= "60" height="60" src="data:image/png;base64,' + item.image + '"/>';
            }
            else {
                image = '<img  width="60" height="60" src="/Content/Images/person-placeholder.png" />';
            }
            var html = "<div style='color: rgb(24, 91, 148);font-family: century gothic ! important;'>";
            html += '<div  style="font-size: 12px;float:right;width:120px;color:#d0d0d0 !important;">';
            html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148);'>" + item.label + "</a>";
            html += '<div>' + ScriptResourcesList['scriptClientNo'] + ' : ' + item.clientno + '</div>';
            html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
            html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
            html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
            html += '</div>';
            html += '<div style="height: 60px; background-color: black; float: left; width: 60px; margin: 5px;"> ' + image + '</div>';
            html += '<div style="clear:both;"></div></div>';
            var $li = $('<li>');
            $li.data('item.autocomplete', item)
            $li.append(html);
            //$li.append($("").text(item.label));
            return $li.appendTo(ul);
        };
    }

    $("#p-client-link").autocomplete({
        source: function (request, response) {
            blockUI();
            $.ajax({
                url: '/Client/getAllPClientsForAuto', type: "GET",
                dataType: "json",
                data: { term: request.term },
                position: { collision: "flip" },
                success: function (data) {
                    unblockUI();
                    response($.map(data, function (item) {
                        return {
                            id: item.id,
                            value: item.value,
                            label: item.label,
                            passport: item.passport,
                            dob: item.dob,
                            modified: item.modified,
                            uploaded: item.uploaded,
                            image: item.image,
                            imageurl: item.imageurl,
                            email: item.email,
                            mobile: item.mobile

                        };
                    }))
                }
            })

        },
        minLength: 2,
        focus: function (event, ui) {
            $(this).val(ui.item.label);
            //$("#familLinkAuto").val(ui.item.label);
            return false;
        },
        select: function (event, ui) {
            $(this).val(ui.item.label);
            $("#client-link-name").val(ui.item.label);
            $("#client-link-id").val(ui.item.id);
            assignQuestionnaireToClient(ui.item.id);
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptQuestionnaireAssigned'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            return false;
        }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var image = "";
        if (item.image) {
            image = '<img width= "60" height="60" src="data:image/png;base64,' + item.image + '"/>';
        }
        else {
            image = '<img  width="60" height="60" src="/Content/Images/person-placeholder.png" />';
        }
        var html = "<div style='color: rgb(24, 91, 148);font-family: century gothic ! important;'>";
        html += '<div  style="font-size: 12px;float:right;width:120px;color:#d0d0d0 !important;">';
        html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148);'>" + item.label + "</a>";
        html += '<div>' + ScriptResourcesList['scriptClientNo'] + ' : ' + item.id + '</div>';
        html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
        html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
        html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
        html += '</div>';
        html += '<div style="height: 60px; background-color: black; float: left; width: 60px; margin: 5px;"> ' + image + '</div>';
        html += '<div style="clear:both;"></div></div>';
        var $li = $('<li>');
        $li.data('item.autocomplete', item)
        $li.append(html);
        //$li.append($("").text(item.label));
        return $li.appendTo(ul);
    };

    $("#task-detail").keyup(function () {
        var charsLeft = $(this).attr("maxlength") - $(this).val().length;
        $("#charsLeft").text(charsLeft + " characters left");
        if (parseInt(charsLeft) == 0) {
            alert(ScriptResourcesList['scriptMaxCharacter']);
            return;
        }
    });


    $.validator.addMethod('date', function (value, element, params) {
        if (this.optional(element)) {
            return true;
        }

        var ok = true;
        try {
            $.datepicker.parseDate('dd/mm/yy', value);
        }
        catch (err) {
            ok = false;
        }
        return ok;
    });
});

$(function () {
    function split(val) {
        return val.split(/,\s*/);
    }
    function extractLast(term) {
        return split(term).pop();
    }
    if ($("#clientSearch").length > 0) {
        $("#clientSearch")
            // don't navigate away from the field on tab when selecting an item
            .on("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB &&
                    $(this).autocomplete("instance").menu.active) {
                    event.preventDefault();
                }
            })
            .autocomplete({

                source: function (request, response) {
                    blockUI();
                    $.ajax({
                        url: '/Client/getAllClientsForAuto', type: "GET",
                        dataType: "json",
                        data: { term: extractLast(request.term) },
                        position: { collision: "flip" },
                        multiple: true,
                        success: function (data) {
                            unblockUI();
                            response($.map(data, function (item) {
                                return {
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                    passport: item.passport,
                                    dob: item.dob,
                                    modified: item.modified,
                                    uploaded: item.uploaded,
                                    image: item.image,
                                    imageurl: item.imageurl,
                                    email: item.email,
                                    mobile: item.mobile,
                                    clientno: item.clientno,
                                    active: item.active,
                                    unique: item.unique

                                };
                            }))
                        }
                    })

                },
                search: function () {
                    // custom minLength
                    var term = extractLast(this.value);
                    if (term.length < 2) {
                        return false;
                    }
                },
                focus: function () {
                    // prevent value inserted on focus
                    return false;
                },
                select: function (event, ui) {
                    var terms = split(this.value);
                    // remove the current input
                    terms.pop();
                    // add the selected item
                    terms.push(ui.item.value);
                    // add placeholder to get the comma-and-space at the end
                    terms.push("");
                    this.value = terms.join(", ");
                    showClientDetailViews(ui.item.id);
                    return false;
                }
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                var image = "";
                if (item.image) {
                    image = '<img width= "60" height="60" src="data:image/png;base64,' + item.image + '"/>';
                }
                else {
                    image = '<img  width="60" height="60" src="/Content/Images/person-placeholder.png" />';
                }

                var html = "<div style='color: rgb(24, 91, 148);font-family: Lato-R ! important; padding-right: 10px;'>";
                html += '<div  style="font-size: 12px;float:right;width:65%;color:#d0d0d0 !important;">';


                html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148); outline: 0 none !important;'>" + item.label + "</a>";
                if (item.active == false) {
                    html += '<div><span class="label label-danger">' + ScriptResourcesList['scriptInActive'] + '</span></div>';
                }
                else {
                    html += '<div><span class="label label-success">' + ScriptResourcesList['scriptActive'] + '</span></div>';
                }
                if (item.type) {
                    html += '<div>' + ScriptResourcesList['scriptType'] + ': ' + item.type + '</div>';
                }
                html += '<div>EZM ID : ' + item.id + '</div>';
                html += '<div>INZ ID : ' + item.clientno + '</div>';
                html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
                html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
                html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
                html += '</div>';
                html += '<div style="height: 60px; background-color: black; float: left; width: 25%; margin: 5px;"> ' + image + '</div>';
                html += '<div style="clear:both;"></div></div>';
                var $li = $('<li>');
                $li.data('item.autocomplete', item)
                $li.append(html);
                //$li.append($("").text(item.label));
                return $li.appendTo(ul);
            };
    }

});
function hideUserList() {
    if ($("#collapse1").is(":visible")) {
        $("#caret-users").click();
        $("#empListForTasks a").removeClass("user-selected");
    }
    $("#caret-users").hide();
}
function showTasksDiv(t) {
    if (t) {
        $("#btn-task").addClass("btn-info");
        $("#btn-task").removeClass("btn-default");
        $("#btn-reminder").removeClass("btn-info");
        $("#btn-task").css("color", "white");
        $("#btn-reminder").css("color", "black");
        $("#div-tasks").show();
        $("#div-reminders").hide();
    }
    else {
        $("#btn-reminder").addClass("btn-info");
        $("#btn-reminder").removeClass("btn-default");
        $("#btn-task").removeClass("btn-info");
        $("#btn-task").css("color", "black");
        $("#btn-reminder").css("color", "white");
        $("#div-tasks").hide();
        $("#div-reminders").show();
    }
}
function getAssignedUserInfo(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/GetAssignedUsers?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $('#user-tasks-info .detail_body').html(data);
            $('#user-tasks-info').modal('show');
            $("#hdn-task-id").val(id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function openResPop(id) {
    $("#hdn-task-id").val(id);

    $("#task-date-re").datepicker({
        dateFormat: 'dd/mm/yy',
        showOn: "button",
        buttonImage: "/Content/Images/calendar.png",
        buttonImageOnly: true,
        defaultDate: new Date(),
        buttonText: "Select date",
        changeMonth: true,
        changeYear: true,
        yearRange: "-150:+10",
        dateFormat: 'dd/mm/yy'
    });


    $('#re-dialog').modal('show');
    $("#client-task-modal-body").css("z-index", 9999);
    $("#re-dialog").css("z-index", 10000);
    $("#task-date-re").attr('readonly', true);

}
function openTitleUpdate(ref, id) {
    $("#hdn-task-id-ut").val(id);
    $("#task-title-update").val($.trim($("#short-desc-" + id).html()));
    $('#title-dialog').modal('show');
    $("#client-task-modal-body").css("z-index", 9999);
    $("#title-dialog").css("z-index", 10000);

}
function updateTaskTitle() {
    blockUI();
    if ($("#task-title-update").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterTitle']);
    }

    var data = { TaskID: $("#hdn-task-id-ut").val(), Title: $("#task-title-update").val() };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/UpdateTaskTitle',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }
            $("#short-desc-" + $("#hdn-task-id-ut").val()).html($("#task-title-update").val());
            closeTitleDialog();
            $("#rightDivTop").css("position", "");
            $("#rightDivTop").css("z-index", 0);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function updateRescheduleDateInner() {

    var data = { TaskID: $("#hdn-task-id-f").val(), Date: $("#task-date-re-inner").val() };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/RescheduleTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            if (data == false) {
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }
            $("#task-date-re-inner").val("");
            getClientTask();
            $('body').removeClass('modal-open');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function updateRescheduleDateInnerP() {

    var data = { TaskID: $("#hdn-task-id-f").val(), Date: $("#task-date-re-inner").val() };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/RescheduleTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            if (data == false) {
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }
            $("#task-date-re-inner").val("");
            showPTasks($("#pClientID").val());
            $('body').removeClass('modal-open');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function resscheduleTask() {
    $("#task-date-error").hide();

    if ($("#task-date-re").val() == "") {
        $("#task-date-error").show();
        return false;
    }

    var data = { TaskID: $("#hdn-task-id").val(), Date: $("#task-date-re").val() };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/RescheduleTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            if (data == false) {
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }
            closeReschDialog();
            $("#task-date-re").val("");
            $("#rightDivTop").css("position", "");
            $("#rightDivTop").css("z-index", 0);
            showNewTask();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function openResPopMeeting(ref) {
    var meeting = $(ref).parents(".meeting-item").find(".meeting-id").val();
    $("#hdn-meeting-id").val(meeting);

    $("#meeting-date-re").datepicker({
        dateFormat: 'dd/mm/yy',
        showOn: "button",
        buttonImage: "/Content/Images/calendar.png",
        buttonImageOnly: true,
        defaultDate: new Date(),
        buttonText: "Select date",
        changeMonth: true,
        changeYear: true,
        yearRange: "-150:+10",
        dateFormat: 'dd/mm/yy'
    });

    $('#re-dialog-meeting').modal('show');
}
function resscheduleMeeting() {
    if ($("#meeting-date-re").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterDate']);
    }
    if ($("#select-meeting-time-hours-re").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    if ($("#select-meeting-time-min-re").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    if ($("#select-meeting-time-min-re-e").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterEndTime']);
    }
    if ($("#select-meeting-time-min-re-e").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    var stt = new Date("November 13, 2013 " + $("#select-meeting-time-hours-re").val() + ":" + $("#select-meeting-time-min-re").val() + " " + $("#select-meeting-time-AMPM-re").val());
    stt = stt.getTime();
    var endt = new Date("November 13, 2013 " + $("#select-meeting-time-hours-re-e").val() + ":" + $("#select-meeting-time-min-re-e").val() + " " + $("#select-meeting-time-AMPM-re-e").val());
    endt = endt.getTime();
    if (endt < stt) {
        return showWarningToast(ScriptResourcesList['scriptEndTimeShouldBeGreater']);
    }
    var startDateTime = $("#meeting-date-re").val() + " " + $("#select-meeting-time-hours-re").val() + ":" + $("#select-meeting-time-min-re").val() + " " + $("#select-meeting-time-AMPM-re").val();
    var endDateTime = $("#meeting-date-re").val() + " " + $("#select-meeting-time-hours-re-e").val() + ":" + $("#select-meeting-time-min-re-e").val() + " " + $("#select-meeting-time-AMPM-re-e").val();
    data = { ID: $("#hdn-meeting-id").val(), StartDateTime: startDateTime, EndDateTime: endDateTime };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/Reschedule',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            if (data == false) {
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }
            $('#re-dialog-meeting').modal('hide');
            $('body').removeClass('modal-open');
            $("#hdn-meeting-id").val("");
            $("#meeting-date-re").val("");
            $("#rightDivTop").css("position", "");
            $("#rightDivTop").css("z-index", 0);
            showMeetingTab();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function addNewReminder() {
    $("#reminder-subject-error").hide();
    $("#reminder-detail-error").hide();

    if ($("#reminder-subject").val() == "") {
        $("#reminder-subject-error").show();
        return false;
    }
    if ($("#reminder-detail").val() == "") {
        $("#reminder-detail-error").show();
        return false;
    }
    var data;
    if ($("#client-serch-task-id").val()) {
        data = { ReminderDescription: $("#reminder-subject").val(), ReminderDetail: $("#reminder-detail").val(), ReminderDate: $("#tr-date").val(), FKClientID: $("#client-serch-task-id").val(), ClientName: $("#client-serch-task-name").val(), potential: $("#client-serch-task-pot").val(), NotificationDate: $("#tr-date-not").val() };
    }
    else {
        data = { ReminderDescription: $("#reminder-subject").val(), ReminderDetail: $("#reminder-detail").val(), ReminderDate: $("#tr-date").val(), NotificationDate: $("#tr-date-not").val() };
    }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AddNewReminder',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }



            $("#reminder-Panel").html("");
            $("#reminder-Panel").html(data);

            closeAddTaskDialog();

            $("#rightDivTop").css("position", "");
            $("#rightDivTop").css("z-index", 0);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function addNewMeeting() {
    if ($("#select-meeting-time-hours").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    if ($("#select-meeting-time-min").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    if ($("#select-meeting-time-min-e").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterEndTime']);
    }
    if ($("#select-meeting-time-min-e").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }


    var stt = new Date("November 13, 2013 " + $("#select-meeting-time-hours").val() + ":" + $("#select-meeting-time-min").val() + " " + $("#select-meeting-time-AMPM").val());
    stt = stt.getTime();
    var endt = new Date("November 13, 2013 " + $("#select-meeting-time-hours-e").val() + ":" + $("#select-meeting-time-min-e").val() + " " + $("#select-meeting-time-AMPM-e").val());
    endt = endt.getTime();
    if (endt < stt) {
        return showWarningToast(ScriptResourcesList['scriptEndTimeShouldBeGreater']);
    }
    if ($("#meeting-title-e").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterTitle']);
    }
    if ($("#meeting-detail-e").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterDetail']);
    }
    var vali = true;
    if ($("#booked-meetings").val() != "") {
        var booked = $("#booked-meetings").val().split(",");
        for (var i = 0; i < booked.length; i++) {
            if (!vali) {
                return false;
            }
            var times = booked[i].split(":");
            var t1 = new Date("November 13, 2013 " + $("#select-meeting-time-hours").val() + ":" + times[0]);
            t1 = t1.getTime();
            var t2 = new Date("November 13, 2013 " + $("#select-meeting-time-hours-e").val() + ":" + times[1]);
            t2 = t2.getTime();
            if (stt >= t1 && stt <= t2) {
                if (!confirm(ScriptResourcesList['scriptConfirmMeetingOverlap'])) {
                    vali = false;
                    return false;
                }
            }
        }

    }
    if (vali) {
        var users = [];
        $("#new-meeting-followers .hdn-new-meeting-follower").each(function () {
            users.push($(this).val());
        });
        var startDateTime = $("#hdn-meeting-date").val() + " " + $("#select-meeting-time-hours").val() + ":" + $("#select-meeting-time-min").val() + " " + $("#select-meeting-time-AMPM").val();
        var endDateTime = $("#hdn-meeting-date").val() + " " + $("#select-meeting-time-hours-e").val() + ":" + $("#select-meeting-time-min-e").val() + " " + $("#select-meeting-time-AMPM-e").val();
        var data;
        if ($("#client-serch-task-id").val()) {
            data = { Title: $("#meeting-title-e").val(), Description: $("#meeting-detail-e").val(), StartDateTime: startDateTime, EndDateTime: endDateTime, Users: users, FKClientID: $("#client-serch-task-id").val(), ClientName: $("#client-serch-task-name").val(), IsPotentail: $("#client-serch-task-pot").val(), MeetingType: $("#select-new-meeting-type-e").val() };
        }
        else {
            data = { Title: $("#meeting-title-e").val(), Description: $("#meeting-detail-e").val(), StartDateTime: startDateTime, EndDateTime: endDateTime, Users: users, FKClientID: 0, IsPotentail: false, MeetingType: $("#select-new-meeting-type-e").val() };
        }

        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Meeting/AddNew',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                unblockUI();
                if (data == "No Token") {
                    closeMeetingDialog();
                    getMeetingsView();
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptNoToken'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'error'

                    });
                }
                else if (data == false) {
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'error'

                    });
                }
                closeMeetingDialog();
                showMeetingTab();

            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });

    }

}

function addNewReminderSummary() {
    $("#reminder-subject-error").hide();
    $("#reminder-detail-error").hide();
    $("#reminder-date-error-inner").hide();
    if ($("#rem-date-inner").val() == "") {
        $("#reminder-date-error-inner").show();
        return false;
    }
    if ($("#reminder-subject").val() == "") {
        $("#reminder-subject-error").show();
        return false;
    }
    if ($("#reminder-detail").val() == "") {
        $("#reminder-detail-error").show();
        return false;
    }
    var data;

    data = {
        ReminderDescription: $("#reminder-subject").val(), ReminderDetail: $("#reminder-detail").val(),
        ReminderDate: $("#rem-date-inner").val(), FKClientID: $("#rem-client-id-inner").val(),
        ClientName: $("#rem-client-name-inner").val(), potential: 0, NotificationDate: null
    };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AddNewReminder',
        data: JSON.stringify(data),
        async: false,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }

            successToast();
            blockUI();
            $.ajax({
                type: "GET",
                contentType: "html",
                url: '/Client/ClientReminderSummary?id=' + $("#rem-client-id-inner").val(),
                async: true,
                success: function (data) {
                    unblockUI();
                    $("#client-task-modal-body").html("");
                    $("#client-task-modal-body").html(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    unblockUI();
                    handleErrors(textStatus);
                }
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function addNewTask() {
    $("#task-detail-error").hide();
    $("#task-title-error").hide();

    if ($("#task-title").val() == "") {
        $("#task-title-error").show();
        return false;
    }
    if ($("#task-detail").val() == "") {
        $("#task-detail-error").show();
        return false;
    }
    var users = [];
    $("#new-task-followers .hdn-new-task-follower").each(function () {
        users.push($(this).val());
    });
    var data;
    if ($("#client-serch-task-id").val()) {
        data = { TaskShortDesc: $("#task-title").val(), TaskDetails: $("#task-detail").val(), TaskDue: $("#tr-date").val(), users: users, FKClientID: $("#client-serch-task-id").val(), ClientName: $("#client-serch-task-name").val(), potential: $("#client-serch-task-pot").val() };
    }
    else {
        data = { TaskShortDesc: $("#task-title").val(), TaskDetails: $("#task-detail").val(), TaskDue: $("#tr-date").val(), users: users };
    }

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AddNewTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {

            if (data == false) {
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }
            unblockUI();
            $("#task-container").html("");
            $("#task-container").html(data);
            closeAddTaskDialog();
            $("#rightDivTop").css("position", "");
            $("#rightDivTop").css("z-index", 0);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function closeTitleDialog() {
    $('#title-dialog').modal('hide');
    if ($("#client-task-modal-body").is(":hidden") === true) {
        $('body').removeClass('modal-open');
    }
    $("#hdn-task-id-ut").val("");
    unblockUI();
}
function closeReschDialog() {
    $('#re-dialog').modal('hide');
    $('body').removeClass('modal-open');
    $("#hdn-task-id").val("");
    unblockUI();
}
function closeMeetingDialog() {
    unblockUI();
    $("#meeting-add-modal").modal("hide");
    $('body').removeClass('modal-open');
    $("#reminder-subject").val("");
    $("#reminder-detail").val("");
    $("#client-serch-task-id").val("");
    $("#client-serch-task-name").val("");
    $("#client-serch-task-rem").val("");
    $("#client-serch-task-rem-p").val("");
    $("#client-serch-task-check").attr("checked", false);
    $("#client-serch-task-pot").val(false);

}
function closeAddTaskDialog() {
    unblockUI();
    $("#add-task").modal("hide");
    $('body').removeClass('modal-open');
    $("#task-title").val("");
    $("#task-detail").val("");
    $("#reminder-subject").val("");
    $("#reminder-detail").val("");
    $("#client-serch-task-id").val("");
    $("#client-serch-task-name").val("");
    $("#client-serch-task-rem").val("");
    $("#client-serch-task-rem-p").val("");
    $("#client-serch-task-check").attr("checked", false);
    $("#client-serch-task-pot").val(false);
    unblockUI();
}
function bindHidePanel() {
    $(".panel-hide").click(function () {

        if ($(this).parent().parent().next(".box_content").html() != null) {
            if ($(this).parent().parent().next(".box_content").is(":visible")) {
                $(this).parent().parent().next(".box_content").hide();
                $(this).html("");
                $(this).html(ScriptResourcesList['scriptShow']);
            }
            else {
                $(this).parent().parent().next(".box_content").show();
                $(this).html("");
                $(this).html(ScriptResourcesList['scriptHide']);
            }
        }
        else if ($(this).parent().parent().parent().next(".panel-body").html() != null) {
            if ($(this).parent().parent().parent().next(".panel-body").is(":visible")) {
                $(this).parent().parent().parent().next(".panel-body").hide();
                $(this).html("");
                $(this).html(ScriptResourcesList['scriptShow']);
            }
            else {
                $(this).parent().parent().parent().next(".panel-body").show();
                $(this).html("");
                $(this).html(ScriptResourcesList['scriptHide']);
            }
        }



    })

}

function showNewTask(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/TasksDetailViewPartial',
        async: true,
        success: function (data) {
            if ($("#collapse1").is(":visible")) {
                $("#caret-users").click();
                $("#empListForTasks a").removeClass("user-selected");
            }
            $("#task-container").html("");
            $("#task-container").html(data);
            $("#task-nav li").removeClass("active");
            $(ref).parent().addClass("active")
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getMeetingsView() {
    var obj = new Object();
    obj.ViewType = $("#selectViewType").val();
    obj.FilterDate = $("#date-meeting-filter").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        url: '/Meeting/MeetingsF',
        async: true,
        success: function (data) {
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showMeetingTab() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Meeting/Meetings',
        async: true,
        success: function (data) {
            unblockUI();
            clearSelectedClient();
            if ($("#collapse1").is(":visible")) {
                $("#caret-users").click();
                $("#empListForTasks a").removeClass("user-selected");
            }
            $("#content-area").html("");
            $("#content-area").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function getAccountsGraphDashboard() {
    var obj = new Object();
    obj.DateFrom = $("#StartDateAccounts").val();
    obj.DateTo = $("#EndDateAccounts").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AccountsGraph',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            $("#accountsDashboardGraph").html("");
            if (data != null) {
                Morris.Donut({
                    element: 'accountsDashboardGraph',
                    data: [
                        { label: ScriptResourcesList['scriptIncoming'], value: parseFloat(data.Incoming) },
                        { label: ScriptResourcesList['scriptOutgoing'], value: parseFloat(data.Outgoing) },
                    ],
                    colors: [
                        'green',
                        'maroon'
                    ]
                });
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });





}
function getVisaTypeGraph() {


    var obj = new Object();
    obj.DateFrom = $("#StartDateVisa").val();
    obj.DateTo = $("#EndDateVisa").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/VisaTypeGraph',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            $("#visaTypeGraph").html("");
            if (data != null) {
                if (data.length > 0) {
                    Morris.Bar({
                        element: 'visaTypeGraph',
                        data: data,
                        xkey: 'Name',
                        ykeys: ['Count'],
                        labels: [ScriptResourcesList['scriptCount']],
                        xLabelMargin: 0,
                        yLabelFormat: function (y) { return y != parseFloat(y) ? '' : y; },
                        barColors: function (row, series, type) {
                            if (type === 'bar') {
                                var red = Math.ceil(255 * row.y / this.ymax);
                                return getRandomColor();
                            }
                            else {
                                return '#000';
                            }
                        }
                    });
                    $("#visaTypeGraph svg rect, #visaTypeGraph .morris-hover").click(function () {

                        thisData = $("#visaTypeGraph .morris-hover-row-label").html();
                        getVisaTypeGraphDetail(thisData);
                    });
                }
                else {
                    var html = '<div class=" nav-tabs">';
                    html += ' <span class="reminder_heading">' + ScriptResourcesList['scriptNoRecordFound'] + '</span> </div>';
                    $("#visaTypeGraph").html(html);


                }

            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });

}
function getVisaTypeGraphDetail(name) {

    var obj = new Object();
    obj.DateFrom = $("#StartDateVisa").val();
    obj.DateTo = $("#EndDateVisa").val();
    obj.Name = name;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/VisaTypeGraphDetail',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#visaAnaReport").html(data);
            $("#visaDetailHeader").html(name);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });


}

function getBalanceVisaGraphN() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/VisaBalanceGraphView',
        async: true,
        success: function (data) {
            $("#bar-bal-visa").html("");
            if (data != null) {

                var result = [];

                var obj = new Object();
                obj.y = ScriptResourcesList['scriptTotal'];
                obj.a = data.Total;
                result.push(obj);

                var obj = new Object();
                obj.y = ScriptResourcesList['scriptProforma'];
                obj.a = data.Proforma;
                result.push(obj);

                var obj = new Object();
                obj.y = ScriptResourcesList['scriptReceived'];
                obj.a = data.Received;
                result.push(obj);
                var obj = new Object();
                obj.y = ScriptResourcesList['scriptDue'];
                obj.a = data.Due;
                result.push(obj);
                var obj = new Object();
                obj.y = ScriptResourcesList['scriptOverDue'];
                obj.a = data.OverDue;
                result.push(obj);
                Morris.Bar({
                    element: 'pClientSummaryGraph',
                    data: result,
                    xkey: 'y',
                    ykeys: ['a'],
                    labels: ['SUM'],
                    xLabelMargin: 0,
                    yLabelFormat: function (y) { return y != parseFloat(y) ? '' : y; },
                    barColors: function (row, series, type) {
                        if (type === 'bar') {
                            var red = Math.ceil(255 * row.y / this.ymax);
                            return getRandomColor();
                        }
                        else {
                            return '#000';
                        }
                    }
                });
            }
            else {
                var html = '<div class=" nav-tabs">';
                html += ' <span class="reminder_heading">' + ScriptResourcesList['scriptNoRecordFound'] + '</span> </div>';
                $("#bar-bal-visa").html(html);


            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });

}
function getBalanceVisaGraph() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/VisaBalanceGraphView',
        async: true,
        success: function (data) {
            $("#bar-bal-visa").html("");
            if (data != null) {

                var result = [];

                var obj = new Object();
                obj.y = ScriptResourcesList['scriptTotal'];
                obj.a = data.Total;
                result.push(obj);
                var obj = new Object();
                obj.y = ScriptResourcesList['scriptProforma'];
                obj.a = data.Proforma;
                result.push(obj);
                var obj = new Object();
                obj.y = ScriptResourcesList['scriptReceived'];
                obj.a = data.Received;
                result.push(obj);
                var obj = new Object();
                obj.y = ScriptResourcesList['scriptDue'];
                obj.a = data.Due;
                result.push(obj);
                var obj = new Object();
                obj.y = ScriptResourcesList['scriptOverDue'];
                obj.a = data.OverDue;
                result.push(obj);
                Morris.Bar({
                    element: 'bar-bal-visa',
                    data: result,
                    xkey: 'y',
                    ykeys: ['a'],
                    labels: [ScriptResourcesList['scriptSum']],
                    xLabelMargin: 0,
                    yLabelFormat: function (y) { return y != parseFloat(y) ? '' : y; },
                    barColors: function (row, series, type) {
                        if (type === 'bar') {
                            var red = Math.ceil(255 * row.y / this.ymax);
                            return getRandomColor();
                        }
                        else {
                            return '#000';
                        }
                    }
                });
            }
            else {
                var html = '<div class=" nav-tabs">';
                html += ' <span class="reminder_heading">' + ScriptResourcesList['scriptNoRecordFound'] + '</span> </div>';
                $("#bar-bal-visa").html(html);


            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });
}
function getVisaGraph(ref) {
    if (!ref) {
        ref = $("#firstVisaStatus").val();
    }

    var data = { type: ref };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/VisaGraphView',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {

            if (ref == "Immigration Matters") {
                ref = "Immigration Matters (PPI)";
            }
            $("#serTitle").html(ref);
            $("#bar-visa").html("");
            if (data.length > 0) {

                var result = [];
                for (var i = 0; i < data.length; i++) {
                    var obj = new Object();
                    obj.y = data[i].MonthName + " " + data[i].Year;
                    obj.a = data[i].Count;
                    result.push(obj);
                }

                Morris.Bar({
                    element: 'bar-visa',
                    data: result,
                    xkey: 'y',
                    ykeys: ['a'],
                    labels: ['Visas'],
                    yLabelFormat: function (y) { return y != Math.round(y) ? '' : y; }
                    ,
                    barColors: function (row, series, type) {
                        if (type === 'bar') {
                            var red = Math.ceil(255 * row.y / this.ymax);
                            return getRandomColor();
                        }
                        else {
                            return '#000';
                        }
                    }
                });
            }
            else {
                var html = '<div class=" nav-tabs">';
                html += ' <span class="reminder_heading">' + ScriptResourcesList['scriptNoRecordFound'] + '</span> </div>';
                $("#bar-visa").html(html);


            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });
}
function getDataClientSourcePotential() {

    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportClientSourceJsonP',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();

            $("#clientSourceGraph").html("");
            if (data.length > 0) {
                var html = "";
                var result = [];

                for (var i = 0; i < data.length; i++) {
                    var obj = new Object();
                    obj.y = data[i].Name;
                    obj.a = data[i].Count;
                    result.push(obj);
                    html += "<tr>";
                    html += "<td>" + data[i].Name + "</td>";
                    html += "<td>" + data[i].Count + "</td>";
                    html += "</tr>";
                }

                $("#tbl-client-source tbody").html(html);

                Morris.Bar({
                    element: 'clientSourceGraph',
                    data: result,
                    xkey: ['y'],
                    ykeys: ['a'],
                    labels: ['Sum'],
                    //Remove this xLabelAngle to go to previous state
                    xLabelAngle: 3,
                    yLabelFormat: function (y) { return y != Math.round(y) ? '' : y; }
                    ,
                    barColors: function (row, series, type) {
                        if (type === 'bar') {
                            var red = Math.ceil(255 * row.y / this.ymax);
                            return getRandomColor();
                        }
                        else {
                            return '#000';
                        }
                    }
                });
            }
            else {
                var html = '<div class="nav-tabs">';
                html += ' <span class="reminder_heading">' + ScriptResourcesList['scriptNoRecordFound'] + '</span> </div>';
                $("#clientSourceGraph").html(html);


            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function getDataClientSource() {

    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportClientSourceJson',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();

            $("#clientSourceGraph").html("");
            if (data.length > 0) {
                var html = "";
                var result = [];

                for (var i = 0; i < data.length; i++) {
                    var obj = new Object();
                    obj.y = data[i].Name;
                    obj.a = data[i].Count;
                    result.push(obj);
                    html += "<tr>";
                    html += "<td>" + data[i].Name + "</td>";
                    html += "<td>" + data[i].Count + "</td>";
                    html += "</tr>";
                }

                $("#tbl-client-source tbody").html(html);

                Morris.Bar({
                    element: 'clientSourceGraph',
                    data: result,
                    xkey: ['y'],
                    ykeys: ['a'],
                    labels: ['Sum'],
                    //Remove this xLabelAngle to go to previous state
                    xLabelAngle: 3,
                    yLabelFormat: function (y) { return y != Math.round(y) ? '' : y; }
                    ,
                    barColors: function (row, series, type) {
                        if (type === 'bar') {
                            var red = Math.ceil(255 * row.y / this.ymax);
                            return getRandomColor();
                        }
                        else {
                            return '#000';
                        }
                    }
                });
            }
            else {
                var html = '<div class="nav-tabs">';
                html += ' <span class="reminder_heading">' + ScriptResourcesList['scriptNoRecordFound'] + '</span> </div>';
                $("#clientSourceGraph").html(html);


            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function getReportDetail(report) {
    $("#genral-box").show();
    $("#client-source-box").html("");
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.ReportType = report;
    obj.VisaType = $("#visaType").val();
    obj.User = $("#userType").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportDetail',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            $("#report-detail").html(data);
            bindHidePanel();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });
}
function getTimeTrackingReportAll() {
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }

    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.VisaType = $("#visaType").val();
    obj.VisaStatus = $("#visaStatus").val();
    obj.User = $("#visaLIA").val();

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/TimeTracking/TimeTrackingReportResult',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-time-box").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function getCMSReportAll() {
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#caseType").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectCaseType'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.VisaType = $("#caseType").val();

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/CMSSearch',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-cms-box").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function getVisaReportAll() {
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.VisaType = $("#visaType").val();
    obj.VisaStatus = $("#visaStatus").val();
    obj.User = $("#visaLIA").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/VisasSearch',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-visa-box").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function getSalesReportSummary() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#userType").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectUser'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }

    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.User = $("#userType").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportSalesSummary',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            $("#no-of-visa").html(data.Count);
            $("#client-deatil-for").html(data.ReportName);
            var detail = '<a href="#" onclick="getSalesReport()">' + ScriptResourcesList['scriptDetail'] + '</a>';
            $("#action-link").html(detail);
            $("#time-period").html(data.Date);
            bindHidePanel();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });
}

function getProcessingPerson() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    if ($("#userType").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectUser'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.VisaType = $("#visaType").val();
    obj.User = $("#userType").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportProcessingPerson',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            $("#no-of-visa").html(data.Count);
            $("#client-deatil-for").html(data.ReportName);
            var detail = '<a href="#" onclick="getProcessingReport()">' + ScriptResourcesList['scriptDetail'] + '</a>';
            $("#action-link").html(detail);
            $("#time-period").html(data.Date);
            bindHidePanel();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });
}

function getClientSourcePotential() {
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/GetReportClientSourcePotential',
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getClientSource() {
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/GetReportClientSource',
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getExpiryVisa() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.VisaType = $("#visaType").val();
    obj.User = $("#userType").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportDetailExpiry',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            $("#report-detail").html(data);
            bindHidePanel();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });
}
function getSalesReportPotential() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#userType").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectUser'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.VisaType = $("#visaType").val();
    obj.User = $("#userType").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportDetailSalesPotential',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getClientEmployerReport() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }

    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportClientEmp',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getSalesReport() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#userType").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectUser'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.VisaType = $("#visaType").val();
    obj.User = $("#userType").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportDetailSales',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}

function getProcessingReport() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#userType").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectUser'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.User = $("#userType").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportProcessing',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);
            bindHidePanel();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}

function getProcessingReportPotential() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#userType").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectUser'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.User = $("#userType").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportProcessingPotential',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);
            bindHidePanel();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}

function getTaskPerformance() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/TaskPerformance',
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getDataTaskPerformance() {

    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.User = $("#userType").val();

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/TaskPerformance',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();

            $("#clientTaskPerformanceGraph").html("");
            if (data.length > 0) {
                var html = "";
                var result = [];

                for (var i = 0; i < data.length; i++) {
                    var obj = new Object();
                    obj.y = data[i].FirstName;
                    obj.a = data[i].CompletedTasks;
                    obj.b = data[i].PendingTasks;
                    result.push(obj);
                    html += "<tr>";
                    html += "<td>" + data[i].FirstName + "</td>";
                    html += "<td>" + data[i].TotalTasks + "</td>";
                    html += "<td>" + data[i].CompletedTasks + "</td>";
                    html += "<td>" + data[i].PendingTasks + "</td>";
                    html += "</tr>";
                }

                $("#tbl-task-performance tbody").html(html);

                Morris.Bar({
                    element: 'clientTaskPerformanceGraph',
                    data: result,
                    xkey: ['y'],
                    ykeys: ['a', 'b'],
                    labels: ['Completed', 'Pending']
                    //Remove this xLabelAngle to go to previous state
                    //xLabelAngle: 3,
                    //yLabelFormat: function (y) { return y != Math.round(y) ? '' : y; }
                    //,
                    //barColors: function (row, series, type) {
                    //    if (type === 'bar') {
                    //        var red = Math.ceil(255 * row.y / this.ymax);
                    //        return getRandomColor();
                    //    }
                    //    else {
                    //        return '#000';
                    //    }
                    //}
                });
            }
            else {
                var html = '<div class="nav-tabs">';
                html += ' <span class="reminder_heading">' + ScriptResourcesList['scriptNoRecordFound'] + '</span> </div>';
                $("#clientTaskPerformanceGraph").html(html);


            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function getReportSummary(report) {
    $("#genral-box").show();
    $("#client-source-box").html("");
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.ReportType = report;
    obj.VisaType = $("#visaType").val();
    obj.User = $("#userType").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportSummary',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            $("#no-of-visa").html(data.Count);
            $("#client-deatil-for").html(data.ReportName);
            var detail = '<a href="#" onclick="' + data.Detail + '">' + ScriptResourcesList['scriptDetail'] + '</a>';
            $("#action-link").html(detail);
            $("#time-period").html(data.Date);
            bindHidePanel();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });

}
function getExpiryVisaSummary() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.VisaType = $("#visaType").val();
    obj.User = $("#userType").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportExpirySummary',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            $("#no-of-visa").html(data.Count);
            $("#client-deatil-for").html(data.ReportName);
            var detail = '<a href="#" onclick="getExpiryVisa()">' + ScriptResourcesList['scriptDetail'] + '</a>';
            $("#action-link").html(detail);
            $("#time-period").html(data.Date);
            bindHidePanel();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });
}

function showSupplierPayments(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/SupplierPayments',
        async: true,
        success: function (data) {
            $("#task-container").html("");
            $("#task-container").html(data);
            $("#task-nav li").removeClass("active");
            $("#sup-pay-li").addClass("active")
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showCompleteTask(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/CompletedTask',
        async: true,
        success: function (data) {
            if ($("#collapse1").is(":visible")) {
                $("#caret-users").click();
                $("#empListForTasks a").removeClass("user-selected");
            }
            $("#task-container").html("");
            $("#task-container").html(data);
            $("#task-nav li").removeClass("active");
            $(ref).parent().addClass("active")
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function showPaymentRemindersNew(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/PaymentSchedulePartial',
        async: true,
        success: function (data) {

            unblockUI();
            $("#task-container").html("");
            if (data) {
                $("#task-container").html(data);
            }
            $("#task-nav li").removeClass("active");
            $(ref).parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function showSchoolRemindersInternal(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/SchoolPaymentSchedulePartial',
        async: true,
        success: function (data) {
            unblockUI();
            unblockUI();
            $("#management-content").html("");
            $("#management-content").html(data);
            $(".agent-main-nav li").removeClass("active");
            $("#agent-6").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showSchoolReminders(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/SchoolPaymentSchedulePartial',
        async: true,
        success: function (data) {
            unblockUI();
            $("#task-container").html("");
            if (data) {
                $("#task-container").html(data);
            }
            $("#task-nav li").removeClass("active");
            $(ref).parent().addClass("active")

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showStudentSummeryDashboard() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ShowStudentSummary',
        async: true,
        success: function (data) {
            unblockUI();
            $("#liAllClients").removeClass("active");
            $("#liClientSummary").removeClass("active");
            $("#liEmployer").removeClass("active");
            $("#liStudent").addClass("active");
            $("#tabClientSummary").html("");
            $("#tabClientSummary").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showEmployersSummeryDashboard() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/DashboardEmployer',
        async: true,
        success: function (data) {
            unblockUI();
            $("#liAllClients").removeClass("active");
            $("#liClientSummary").removeClass("active");
            $("#liStudent").removeClass("active");
            $("#liEmployer").addClass("active");
            
            $("#tabClientSummary").html("");
            $("#tabClientSummary").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showClientsSummeryDashboard() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/DashboardPP',
        async: true,
        success: function (data) {
            unblockUI();
            $("#liAllClients").removeClass("active");
            $("#liStudent").removeClass("active");
            $("#liEmployer").removeClass("active");
            $("#liClientSummary").addClass("active");
            $("#tabClientSummary").html("");
            $("#tabClientSummary").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showClientsSummeryDashboardB(ref) {
    if ($.trim($(ref).html()) == "HIDE") {
        $("#tabClientSummary").html("");
        $(ref).html("SHOW");
    }
    else {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/Dashboard/ShowSummaryBack',
            async: true,
            success: function (data) {
                unblockUI();
                $("#liAllClients").removeClass("active");
                $("#liStudent").removeClass("active");
                $("#liEmployer").removeClass("active");
                $("#liClientSummary").addClass("active");
                $("#tabClientSummary").html("");
                $("#tabClientSummary").html(data);
                $(ref).html("");
                $(ref).html("HIDE");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });

    }

}
function showAllClientsDashboard(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ClientDashboardSummery',
        async: true,
        success: function (data) {
            unblockUI();
            $("#liAllClients").addClass("active");
            $("#liClientSummary").removeClass("active");
            $("#liStudent").removeClass("active");
            $("#liEmployer").removeClass("active");
            $("#tabClientSummary").html("");
            $("#tabClientSummary").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showVisaP(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Activity/VisaDetails?id=' + id + '&client=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {

            $("#rightDivTop").html("");
            $("#rightDivTop").html(data);
            bindHidePanel();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function showActions() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/FileNotesAction?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {

            $("#rightDivTop").html("");
            $("#rightDivTop").html(data);
            bindHidePanel();

            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function showVisaA(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Activity/ActivitLog?id=' + id,
        async: true,
        success: function (data) {

            $("#rightDivCenter").html("");
            $("#rightDivCenter").html(data);
            bindHidePanel();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showClientVisaProgress(id) {
    $("#selected-visa-id").val(id);
    showVisaP(id);
    showVisaA(id);
}
function showClientDetailViewsFromSumary(id) {
    $("#client-summary-modal").modal("hide");
    $('body').removeClass('modal-open');
    showClientDetailViews(id)
}
function showClientDetailViewsDashboard(id) {
    if ($("#main-menu").is(":not(:visible)")) {
        $("#main-menu").fadeIn();
        $("#content-area").removeClass();
        $("#content-area").addClass("col-lg-9 col-md-9 col-sm-12 col-xs-12 double_col");
        $("#icon-expand").removeClass("fa-angle-double-right");
        $("#icon-expand").addClass("fa-angle-double-left");

    }
    showClientDetailViews(id)
}
function showClientDetailViews(id) {
    $("#selected-client").hide();
    $("#selected-client-id").val(id);
    $('.modal').modal('hide');
    $('body').removeClass('modal-open');
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/UpdateClient',
        async: false,
        success: function (data) {

            $("#content-area").html("");
            $("#content-area").html(data);
            $("#selected-client-name").html($("#hdn-auto-fullname").val());
            $("#selected-client-inz").html("INZ ID : " + $("#hdn-auto-clientnumber").val());
            $("#selected-client-ezm").html("EZM ID : " + $("#hdn-auto-ezm").val());
            $("#selected-client-type").html($("#hdn-auto-clienttype").val());
            $("#selected-client-passport").html($("#hdn-auto-clientnumber").val());

            if ($("#hdn-auto-dob").val() == '01/01/0001 00:00:00') {
                $("#selected-client-dob").html("");
            }
            else {
                $("#selected-client-dob").html($("#hdn-auto-dob").val());
            }

            $("#selected-client-uploaded").html(ScriptResourcesList['scriptUploadedOn'] + " : " + $("#hdn-auto-uploaded").val() + " <br>" + ScriptResourcesList['scriptModifiedOn'] + " : " + $("#hdn-auto-mod").val() + "");
            if ($("#hdn-auto-image").val()) {
                $('#selected-client-image').attr('src', "data:image/png;base64," + $("#hdn-auto-image").val());
            }
            else {
                $('#selected-client-image').attr('src', "/Content/Images/person-placeholder.png");
            }
            $("#selected-client").show();

            bindHidePanel();

            unblockUI();
            getUpdateStatus();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function setSelectedTab(a) {
    $(".action_btn").removeClass("active");
    if (a == "update") {
        $("#action-btn-us").addClass("active");
    }
    else if (a == "addmission") {

        $("#action-btn-usa").addClass("active");
    }
    else if (a == "sms") {
        $("#action-btn-ss").addClass("active");
    }
    else if (a == "task") {
        $("#action-btn-ts").addClass("active");
    }
    else if (a == "bal") {
        $("#action-btn-be").addClass("active");
    }
    else if (a == "rem") {
        $("#action-btn-rs").addClass("active");
    }
    else if (a == "ps") {
        $("#action-btn-ps").addClass("active");
    }
    else if (a == "tg") {
        $("#action-btn-tg").addClass("active");
    }
    else if (a == "tt") {
        $("#action-btn-tt").addClass("active");
    }
    else if (a == "meeting") {
        $("#action-btn-mt").addClass("active");
    }
    else if (a == "de") {
        $("#action-btn-de").addClass("active");
    }
    else if (a == "ds") {
        $("#action-btn-ds").addClass("active");
    }
}
function clearSelectedClient() {
    $("#clientSearch").val("");
    $("#selected-client-name").html("");
    $("#selected-client-passport").html("");
    $("#selected-client-dob").html("");
    $("#selected-client-uploaded").html("");
    // $('#selected-client-image').attr('src', "data:image/png;base64," + ui.item.image);
    $("#selected-client").hide();
    $("#selected-client-id").val("");
    $(".emp-list").css("background-color", "");

}
function showDashboard() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/DashboardPartial',
        async: true,
        success: function (data) {
            bindHidePanel();
            unblockUI();
            clearSelectedClient();
            if ($("#collapse1").is(":visible")) {
                $("#caret-users").click();
                $("#empListForTasks a").removeClass("user-selected");
            }
            $("#content-area").html("");
            $("#content-area").html(data);
            $("#taskDDL").show();
            if ($("#caret-users")) {
                $("#caret-users").show();
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showDashboardNew() {


    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/Dashboard',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showDashboardReal(id, show, ref) {


    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/MainP',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function completeTaskClientProfile(ref, task) {
    var data = { task: task };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/CompleteTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {

            if (data) {
                $(ref).parent().remove();
                $(ref).next(".task_lbl").prepend("<span class='green_box'></span>");
                showSuccessToast(ScriptResourcesList['scriptTaskCompleted']);

                //$(ref).removeClass("uncomplete");
                //$(ref).addClass("complete");
                //$(ref).html('<img style="float: left;margin-left: 2px;margin-top: 2px;" src="/Content/Images/tick.gif" />');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });

}
function showTimeTrackingPopupOnTaskCompletion(task, client) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/TimeTracking/TimeTrackingAddPopup?id=' + client,
        async: true,
        success: function (data) {
            unblockUI();
            $("#layout-time-track-modal").html("");
            $("#layout-time-track-modal").html(data);
            $("#layout-time-track-modal").modal("show");
            $("#layout-client-task").val(task);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function completeTaskInnerP(ref, task) {
    var data = { task: task };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/CompleteTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {

            if (data) {
                $(ref).parent().next(".task_lbl").prepend('<span class="green_box" style="width: 14px;height: 14px;border-radius: 2px;margin-right: 12px;"></span>');
                $(ref).parent().next(".task_lbl").removeClass("inl-blok");
                $(ref).parent().next(".task_lbl").addClass("comp");
                $(ref).parents(".inner-task-item").find(".fa-edit").replaceWith('<i onclick="undoCompleteTaskPotential(' + task + ')" class="fa fa-undo undo-icon" style="font-size: 12px;color: #0f82bd !important;margin-top: 0px;margin-bottom: 5px;"></i>');
                $(ref).parent().remove();
                var remCount = parseInt($.trim($("#tasks-count-client").html()));
                if (remCount > 0) {
                    remCount = remCount - 1;
                    $("#tasks-count-client").html(remCount);
                }
                showSuccessToast("Task Completed");
                if ($("#check-show-comp").is(':checked')) {
                    $("#main-client-tasks .comp").parent().show();
                }
                else {
                    $("#main-client-tasks .comp").parent().hide();
                }

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });

}
function completeTaskInner(ref, task, tt, ttp) {
    var data = { task: task };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/CompleteTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {

            if (data) {
                $(ref).parent().next(".task_lbl").prepend('<span class="green_box" style="width: 14px;height: 14px;border-radius: 2px;margin-right: 12px;"></span>');
                $(ref).parent().next(".task_lbl").removeClass("inl-blok");
                $(ref).parent().next(".task_lbl").addClass("comp");
                $(ref).parents(".inner-task-item").find(".fa-edit").replaceWith('<i onclick="undoCompleteTaskClient(' + task + ')" class="fa fa-undo undo-icon" style="font-size: 12px;color: #0f82bd !important;margin-top: 0px;margin-bottom: 5px;"></i>');
                $(ref).parent().remove();
                var remCount = parseInt($.trim($("#tasks-count-client").html()));
                if (remCount > 0) {
                    remCount = remCount - 1;
                    $("#tasks-count-client").html(remCount);
                }
                showSuccessToast("Task Completed");
                if ($("#check-show-comp").is(':checked')) {
                    $("#main-client-tasks .comp").parent().show();
                }
                else {
                    $("#main-client-tasks .comp").parent().hide();
                }
                if (tt == "True" && ttp == "True") {
                    return showTimeTrackingPopupOnTaskCompletion(task, $("#selected-client-id").val());
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });

}
function completeTaskUser(ref, task, tt, ttp, client) {
    var data = { task: task };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/CompleteTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            if (data) {
                $(ref).parent().parent().parent().remove();
                showSuccessToast(ScriptResourcesList['scriptTaskCompleted']);
                $("#empListForTasks .user-selected").click();                
                if (tt == "True" && ttp == "True" && client != "0") {
                    return showTimeTrackingPopupOnTaskCompletion(task, client);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function completeTask(ref, task, tt, ttp, client) {
    var data = { task: task };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/CompleteTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            if (data) {
                $(ref).parent().parent().parent().remove();
                showSuccessToast(ScriptResourcesList['scriptTaskCompleted']);
                if (tt == "True" && ttp == "True" && client != "0") {
                    return showTimeTrackingPopupOnTaskCompletion(task, client);
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function completeTaskOld(ref, task) {
    var data = { task: task };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/CompleteTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            if (data) {
                $(ref).parent().parent().remove();
                successToast();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function deleteDeal(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var data = { id: id };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Deals/DeleteDeal',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().remove();
                    successToast();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
}
function deleteTask(ref, task) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var data = { task: task };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/DeleteTask',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().parent().remove();
                    successToast();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
}
function undoReminderDashboard(reminder, client) {
    if (confirm(ScriptResourcesList['scriptUndoReminder'])) {
        var data = { reminder: reminder };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/UndoReminder',
            data: JSON.stringify(data),
            async: false,
            success: function (data) {
                if (data) {
                    successToast();
                    blockUI();
                    $.ajax({
                        type: "GET",
                        contentType: "html",
                        url: '/Client/ClientReminderSummary?id=' + client,
                        async: true,
                        success: function (data) {
                            unblockUI();
                            $("#client-task-modal-body").html("");
                            $("#client-task-modal-body").html(data);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            unblockUI();
                            handleErrors(textStatus);
                        }
                    });
                }
                else {
                    errorToast();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }
}
function undoReminder(ref, reminder) {
    if (confirm(ScriptResourcesList['scriptUndoReminder'])) {
        var data = { reminder: reminder };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/UndoReminder',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                if (data) {
                    $(ref).parent().parent().remove();
                    successToast();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }
}
function completeReminder(ref, reminder) {
    var data = { reminder: reminder };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/CompleteReminder',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {

            if (data) {
                $(ref).parent().parent().remove();
                successToast();
                //$(ref).removeClass("uncomplete");
                //$(ref).addClass("complete");
                //$(ref).html('<img style="float: left;margin-left: 2px;margin-top: 2px;" src="/Content/Images/tick.gif" />');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });
}
function showCompletedReminders() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ShowCompletedReminders',
        async: true,
        success: function (data) {

            unblockUI();
            $("#reminder-Panel").html("");
            $("#reminder-Panel").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {

            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function showAllReminders() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ShowAllReminders',
        async: true,
        success: function (data) {

            $("#reminder-Panel").html("");
            $("#reminder-Panel").html(data);

            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showVisaReminders() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ShowVisaReminders',
        async: true,
        success: function (data) {

            $("#reminder-Panel").html("");
            $("#reminder-Panel").html(data);

            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showPassportReminders() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ShowPassportReminders',
        async: true,
        success: function (data) {

            $("#reminder-Panel").html("");
            $("#reminder-Panel").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showCustomReminders() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ShowCustomReminders',
        async: true,
        success: function (data) {

            $("#reminder-Panel").html("");
            $("#reminder-Panel").html(data);

            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showArchivedReminders() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ShowArchivedReminders',
        async: true,
        success: function (data) {

            $("#reminder-Panel").html("");
            $("#reminder-Panel").html(data);

            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function showMeetingNotes(ref, id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Meeting/Detail?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#meeting-update-modal .modal-body").html(data);
            $("#meeting-update-modal").modal("show");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showTaskDetails(ref, id) {
    if ($.trim($(ref).parent().parent().parent().find(".todos_detail:visible").html()).length > 0) {
        $(ref).parent().parent().parent().find(".todos_detail").hide();
        $(ref).removeClass("bld-txt");
        toggle = true;
    }
    else {
        $(".chkbx-text").removeClass("bld-txt");
        $(ref).addClass("bld-txt");
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/Dashboard/TasksViewDetails?id=' + id,
            async: true,
            success: function (data) {

                unblockUI();
                $(ref).parent().parent().parent().find(".todos_detail").html(data);
                $(ref).parent().parent().parent().find(".todos_detail").show();
                toggle = false;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }


}
function showTaskDetailsHide(ref) {

    $(ref).parent().parent().parent().find(".todos_detail").hide();
    $(ref).parent().parent().parent().find(".new-messages").remove();


    toggle = true;
}

function hideEmployees(ref) {

    if (toggleEmp) {
        $(ref).css("background-image", "url('/Content/Images/arrow-down.png')");
        $("#employee-list").show();
        toggleEmp = false;
    }
    else {
        $(ref).css("background-image", "url('/Content/Images/arrow-up.png')");
        $("#employee-list").hide();
        toggleEmp = true;
    }

}
function updateDescription(ref, task) {


    $(".input_error_msg").hide();
    var desc = $(ref).parent().parent().find(".task-desc").first();
    if (desc.val() == "") {
        $(desc).next(".input_error_msg").show();
        return false;
    }
    blockUI();
    var data = { description: desc.val(), task: task };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/UpdateDescription',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {

            unblockUI();
            if (data) {

                var html = '<div class="user-cmnts">';
                if (data.ImageString) {
                    html += '<img alt="' + data.FullName + '" title="' + data.FullName + '" class="user-img" src="data:image/png;base64,' + data.ImageString + '" />';
                }
                else {
                    html += '<img src="/Content/Images/small-user.png" alt="' + data.FullName + '" title="' + data.FullName + '" class="user-img" />';
                }
                html += '<h2>' + data.FullName + '</h2>';
                html += '<p>' + data.Description + '</p>';
                html += ' <hr class="bottom-line" />';
                html += '</div>';

                $(ref).parent().parent().after(html);


                desc.val("");


            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function updateMeetingDescription() {
    var desc = $("#meeting-detail-desc");
    if ($("#detail-meeting-title").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterTitle']);
    }
    if (desc.val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterDetail']);
    }
    if (confirm(ScriptResourcesList['scriptConfirmUpdateMeeting'])) {
        blockUI();
        var data = { description: desc.val(), meetingID: $("#hdn-detail-meetingid").val(), MeetingType: $("#select-new-meeting-type-update").val(), Title: $("#detail-meeting-title").val() };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Meeting/UpdateDescription',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                unblockUI();
                showMeetingTab();
                return showSuccessToast(ScriptResourcesList['scriptUpdated']);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function addNotesToMeeting(ref, meeting) {

    var desc = $(ref).parent().parent().find(".meeting-notes").first();
    if (desc.val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterNotes']);
    }
    blockUI();
    var data = { description: desc.val(), meetingID: meeting };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/AddNote',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {

            unblockUI();
            if (data) {

                var html = '<div class="user-cmnts">';
                if (data.ImageString) {
                    html += '<img alt="' + data.FullName + '" title="' + data.FullName + '" class="user-img" src="data:image/png;base64,' + data.ImageString + '" />';
                }
                else {
                    html += '<img src="/Content/Images/small-user.png" alt="' + data.FullName + '" title="' + data.FullName + '" class="user-img" />';
                }
                html += '<h2>' + data.FullName + '</h2>';
                html += '<p>' + data.Description + '</p>';
                html += ' <hr class="bottom-line" />';
                html += '</div>';

                $(ref).parent().parent().after(html);


                desc.val("");


            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function changeNotificationStatus(ref) {
    if ($(ref).find(".agent-count").is(":visible")) {
        var cid = $(ref).find('.hdn-notification-commentid').val();
        var uid = $(ref).find('.hdn-notification-userid').val();
        //var tid = $(ref).child('.hdn-notification-taskid').val();




        var data = { ID: cid, FKUserID: uid };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/UpdateNotificationDetail',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {


                if (data) {

                    $(ref).find(".agent-count").hide('slow');
                    $(ref).parent().parent().find(".new-messages").remove();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }
}
function assignUserMeeting(id, ref) {
    blockUI();
    var meeting = $(ref).parents(".meeting-item").find(".meeting-id").val();
    var obj = new Object();
    obj.MeetingID = meeting;
    obj.UserID = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/Assign',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            return successToast();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function assignUserMeetingInner(id, ref, image) {
    blockUI();

    var obj = new Object();
    obj.MeetingID = $("#hdn-detail-meetingid").val();
    obj.UserID = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/Assign',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            var html = "";

            if (image) {
                var trial = $(ref).find(".client-image").first().attr('src');
                html += '<li>';
                html += '<img src="' + trial + '" alt="' + $(ref).find(".person-name").html() + '" title="' + $(ref).find(".person-name").html() + '" class="thumbnail-img" />';
                html += '<i class="del-folwr fa fa-times" onclick="unassignMeeting(' + id + ',' + $("#hdn-detail-meetingid").val() + ', this)"></i>';
                html += '<span><img src="' + trial + '" alt="User" /><br /><p class="img-title">' + $(ref).find(".person-name").html() + '</p></span>';
                html += '</li>';
            }
            else {
                html += '<li>';
                html += '<img src="/Content/Images/small-user.png" alt="' + $(ref).find(".person-name").html() + '" title="' + $(ref).find(".person-name").html() + '" class="thumbnail-img" />';
                html += '<i class="del-folwr fa fa-times" onclick="unassignMeeting(' + id + ',' + $("#hdn-detail-meetingid").val() + ', this)"></i>';
                html += '<span><img src="/Content/Images/small-user.png" alt="User" /><br /><p class="img-title">' + $(ref).find(".person-name").html() + '</p></span>';
                html += ' </li>';
            }

            $("#li-meeting-followers").append(html);
            return successToast();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function changeMeetingStatus(id, ref) {
    blockUI();
    var meeting = $(ref).parents(".meeting-item").find(".meeting-id").val();
    var obj = new Object();
    obj.MeetingID = meeting;
    obj.Status = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/ChangeStatus',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            var status = $(ref).parents(".main-meeting").find(".current-status-name");
            $(status).html($(ref).find(".name").html());
            return successToast();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function changeMeetingStatusInnerC(id, ref) {
    blockUI();
    var meeting = $(ref).parents(".meeting-main").find(".hdn-meeting-id").val();
    var statusname = $(ref).find(".name").html();
    var obj = new Object();
    obj.MeetingID = meeting;
    obj.Status = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/ChangeStatus',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            var status = $(ref).parents("..meeting-main").find(".current-status-name");
            $(status).html(statusname);
            $(status).removeClass();
            $(status).addClass("label");
            $(status).addClass("current-status-name");
            $(status).addClass(statusname + "-Status");

            return successToast();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function changeMeetingStatusInner(id, ref) {
    blockUI();
    var meeting = $(ref).parents(".main-meeting-p").find(".hdn-meeting-id").val();
    var statusname = $(ref).find(".name").html();
    var obj = new Object();
    obj.MeetingID = meeting;
    obj.Status = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/ChangeStatus',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            var status = $(ref).parents(".main-meeting-p").find(".current-status-name");
            $(status).html(statusname);
            $(status).removeClass();
            $(status).addClass("label");
            $(status).addClass("current-status-name");
            $(status).addClass(statusname + "-Status");

            return successToast();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function assignUserTaskSummary(id, ref) {
    var task = $(ref).parents(".task_lbl").find(".inner-task-summary-id").val();
    var obj = new Object();
    obj.TaskID = task;
    obj.UserID = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AssignTask',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptTaskAssigned'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function assignUserTask(id, ref) {
    blockUI();
    var task = $(ref).parents(".todos_tasks").find(".task-id").val();
    var obj = new Object();
    obj.TaskID = task;
    obj.UserID = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AssignTask',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptTaskAssigned'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function assignUserTaskIn(id) {
    blockUI();
    var task = $("#hdn-task-id-f").val();
    var obj = new Object();
    obj.TaskID = task;
    obj.UserID = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AssignTask',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {

            unblockUI();
            showTaskDetailsPopup(task);
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptTaskAssigned'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function unassignTask(id, task, ref) {

    if (confirm(ScriptResourcesList['scriptRemoveUserTask'])) {


        var obj = new Object();
        obj.TaskID = task;
        obj.UserID = id;
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/RemoveTask',
            async: false,
            data: JSON.stringify(obj),
            success: function (data) {
                $(ref).parent().remove();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }

}
function unassignMeeting(id, task, ref) {

    if (confirm(ScriptResourcesList['scriptRemoveUserMeeting'])) {


        var obj = new Object();
        obj.MeetingID = task;
        obj.UserID = id;
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Meeting/UnAssign',
            async: false,
            data: JSON.stringify(obj),
            success: function (data) {
                $(ref).parent().remove();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }

}
function getQuestionare() {

    blockUI();
    $.ajax(
        {
            type: "GET",
            contentType: "html",
            url: '/Questionare/getQuestionareView',
            aync: true,
            success: function (data) {
                $("#content-area").html("");
                $("#content-area").html(data);
                bindHidePanel();
                unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }


        })
}
function mergePQuestionniare(qid, pid, compid) {


    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionare/MergeQuestionnaireToPClient',
        data: JSON.stringify({ qid: qid, pid: pid }),
        async: true,
        success: function (data) {
            unblockUI();
            return successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function mergeQuestionnaire3Potential(qid, pid) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/mergeQuestionnaire3ToPotentialClient',
        data: JSON.stringify({ questionnaireid: qid, pclientid: pid }),
        async: true,
        success: function (data) {
            unblockUI();
            return successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getPotentialClient() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/PotentialClients',
        async: true,
        success: function (data) {
            clearSelectedClient();
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            $("#tabpClientL").addClass("tab-selected");
            $("#tabpClient").removeClass("tab-selected");
            hideUserList();
            bindHidePanel();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getAddPotential() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/AddPotentialClients',
        async: true,
        success: function (data) {
            clearSelectedClient();
            $("#tabpClientL").removeClass("tab-selected");
            $("#tabpClient").addClass("tab-selected");
            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            bindHidePanel();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getDataSharePaymentDetails() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/DataShare/SharedClientPayments',
        async: true,
        success: function (data) {
            unblockUI();
            $("#datashare-content").html("");
            $("#datashare-content").html(data);
            $(".dhare-main-nav li").removeClass("active");
            $("#d-two").addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getDataSharingPer() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/DataShare/SharedClientPer',
        async: true,
        success: function (data) {
            clearSelectedClient();
            $("#referealManagementModal").modal("hide");
            $('body').removeClass('modal-open');
            $("#refral-menu").html('<a href="#" onclick="getDataSharing()">Referral Management</a> <span class="label label-warning">NEW</span>');
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            bindHidePanel();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getDataSharing() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/DataShare/SharedClient',
        async: true,
        success: function (data) {
            clearSelectedClient();
            $('#referealManagementModal').modal('hide');
            $('body').removeClass('modal-open');
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            bindHidePanel();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getDataSharingInternal(p) {
    if (p == 1) {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/DataShare/SharedClientApp',
            async: true,
            success: function (data) {
                unblockUI();
                $("#datashare-content").html("");
                $("#datashare-content").html(data);

                $(".dhare-main-nav li").removeClass("active");
                $(".dhare-main-nav #d-one").addClass("active");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
    else if (p == 2) {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/DataShare/SharedClientExp',
            async: true,
            success: function (data) {
                unblockUI();
                $("#datashare-content").html("");
                $("#datashare-content").html(data);
                $(".dhare-main-nav li").removeClass("active");
                $(".dhare-main-nav #d-two").addClass("active");

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
    else if (p == 3) {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/DataShare/SharedClientPen',
            async: true,
            success: function (data) {
                unblockUI();
                $("#datashare-content").html("");
                $("#datashare-content").html(data);
                $(".dhare-main-nav li").removeClass("active");
                $(".dhare-main-nav #d-three").addClass("active");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
    else if (p == 4) {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/DataShare/SharedClientBulk',
            async: true,
            success: function (data) {
                unblockUI();
                if (data == "NOIMAP") {
                    return showWarningToast("This feature needs IMAP configurations, please configure your IMAP.");
                }
                $("#datashare-content").html("");
                $("#datashare-content").html(data);

                $(".dhare-main-nav li").removeClass("active");
                $(".dhare-main-nav #d-four").addClass("active");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }
    else if (p == 5) {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/DataShare/SharedClientHold',
            async: true,
            success: function (data) {
                unblockUI();
                $("#datashare-content").html("");
                $("#datashare-content").html(data);

                $(".dhare-main-nav li").removeClass("active");
                $(".dhare-main-nav #d-five").addClass("active");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }
    else if (p == 6) {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/DataShare/SharedClientPaid',
            async: true,
            success: function (data) {
                unblockUI();
                $("#datashare-content").html("");
                $("#datashare-content").html(data);

                $(".dhare-main-nav li").removeClass("active");
                $(".dhare-main-nav #d-six").addClass("active");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }
    else if (p == 7) {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/DataShare/SharedClientClaimed',
            async: true,
            success: function (data) {
                unblockUI();
                $("#datashare-content").html("");
                $("#datashare-content").html(data);

                $(".dhare-main-nav li").removeClass("active");
                $(".dhare-main-nav #d-seven").addClass("active");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }
    else if (p == 8) {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/DataShare/Videos',
            async: true,
            success: function (data) {
                unblockUI();
                $("#datashare-content").html("");
                $("#datashare-content").html(data);

                $(".dhare-main-nav li").removeClass("active");
                $(".dhare-main-nav #d-et").addClass("active");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }

}
function getBulkEmailToSendAgain() {
    if ($(".select-client-pen:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectAClient']);
    }
    else {
        blockUI();
        var list = [];
        $(".select-client-pen:checked").each(function () {
            list.push($(this).parent().find(".hdn-pen-client").val());
        });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Bulk/GetBulkEmailDataAgain',
            data: JSON.stringify({ clients: list }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == "NOIMAP") {
                    return showWarningToast("This feature needs IMAP configurations, please configure your IMAP.");
                }
                $("#datashare-content").html("");
                $("#datashare-content").html(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }

}
function getConfig() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Settings/Config',
        async: true,
        success: function (data) {
            clearSelectedClient();
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.com/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            bindHidePanel();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getProcessingPersonGroups() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Rand/ProcessingPersonGroups',
        async: true,
        success: function (data) {
            unblockUI();
            $("#pInfo").parent().removeClass("active");
            $("#bInfo").parent().addClass("active");
            $("#cInfo").parent().removeClass("active");
            $("#accSet").html("");
            $("#accSet").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getBirthdayTemplate() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Settings/Birthday',
        async: true,
        success: function (data) {
            unblockUI();
            $("#pInfo").parent().removeClass("active");
            $("#bInfo").parent().addClass("active");
            $("#cInfo").parent().removeClass("active");
            $("#accSet").html("");
            $("#accSet").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getDocumentSync(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/DocumentSync/Index',
        async: true,
        success: function (data) {
            unblockUI();
            $('#config-content').html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getCPD() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CPD/Index',
        async: true,
        success: function (data) {
            clearSelectedClient();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            bindHidePanel();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getSettings() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Settings/Main',
        async: true,
        success: function (data) {
            clearSelectedClient();
            hideUserList();
            $("#content-area").html("");
            $("#content-area").html(data);
            bindHidePanel();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getReportVisa(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/Visas',
        async: true,
        success: function (data) {
            unblockUI();
            $("#report-pane").html("");
            $("#report-pane").html(data);
            $("#reports-main-ul li").removeClass("active");
            $(ref).parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getReportCMS(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/CMS',
        async: true,
        success: function (data) {
            unblockUI();
            $("#report-pane").html("");
            $("#report-pane").html(data);
            $("#reports-main-ul li").removeClass("active");
            $(ref).parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getReportMain(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/Clients',
        async: true,
        success: function (data) {
            unblockUI();
            $("#report-pane").html("");
            $("#report-pane").html(data);
            $("#reports-main-ul li").removeClass("active");
            $(ref).parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getReportPotentialClient(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/PotentialClients',
        async: true,
        success: function (data) {
            unblockUI();
            $("#report-pane").html("");
            $("#report-pane").html(data);
            $("#reports-main-ul li").removeClass("active");
            $(ref).parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getReportTimeTracking(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/TimeTracking/TimeTrackingReport',
        async: true,
        success: function (data) {
            unblockUI();
            $("#report-pane").html("");
            $("#report-pane").html(data);
            $("#reports-main-ul li").removeClass("active");
            $(ref).parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getReportView() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/Main',
        async: true,
        success: function (data) {
            clearSelectedClient();
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            bindHidePanel();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getTechSupport() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Support/Index',
        async: true,
        success: function (data) {
            clearSelectedClient();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function getVideos() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Support/Videos',
        async: true,
        success: function (data) {
            clearSelectedClient();
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function getQuestionnaireClient() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionare/getQuestionnaireClientInformation',
        async: true,
        success: function (data) {
            clearSelectedClient();
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function assignQuestionnaire(id) {
    var qid = id;
    $('#assign-questionnaire-model').modal('show');
    $('#hdn-questionnaire-id').val(qid);
}

function assignQuestionnaireToClient(id) {
    var client_id = id;
    var questionnaire_id = $('#hdn-questionnaire-id').val();
    if ($("#test122").is(':checked')) {
        alert("Potential Client id is" + client_id + " and questionnaire id is" + questionnaire_id);
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Questionare/AssignQuestionnaireToPClient',
            data: JSON.stringify({ pid: client_id, qid: questionnaire_id }),
            async: true,
            success: function (data) {
                if (data) {
                    alert(ScriptResourcesList['scriptQuestionnaireAssigned']);
                }
                unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
    else {
        alert("Client id is" + client_id + " questionnaire id is" + questionnaire_id);
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Questionare/AssignQuestionnaireToClient',
            data: JSON.stringify({ cid: client_id, qid: questionnaire_id }),
            async: true,
            success: function (data) {
                if (data) {
                    alert(ScriptResourcesList['scriptQuestionnaireAssigned']);
                }
                unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }



}

function addNewQuestionnaireClient(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionare/InsertQuestionnaireClientInformation',
        async: true,
        success: function (data) {
            clearSelectedClient();
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            $(ref).prev().removeClass("active");
            $(ref).addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function updateQuestionnaireClientInformation(id) {
    var ID = id;
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/updateQuestionnaireClientInformation?ID=' + ID + ' ',
        async: true,
        success: function (data) {
            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function getQuestionnaire3View(id) {
    var ID = id;
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/getClientQuestionnaire3?id=' + ID + '&hideLink=true ',
        async: true,
        success: function (data) {
            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function addAsPotentialClient(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/ConvertQuestionnairetoPotentialClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {
            unblockUI();


            $(ref).parent().parent().hide();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            var count = parseInt($("#webassessment-count").html());
            if (count > 0) {
                var result = parseInt(count) - 1;
                $("#webassessment-count").html(result);

            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function addQuestionnaire3AsPotentialClient(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/ConvertQuestionnaire3toPotentialClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {
            unblockUI();
            $(ref).parent().parent().hide();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });



        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function mergePQuestionniare(qid, pid, compid) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/MergeQuestionnaireToPClient',
        data: JSON.stringify({ qid: qid, pid: pid }),
        async: true,
        success: function (data) {
            unblockUI();
            return successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function mergeCQuestionniare(qid, cid, compid) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/MergeQuestionniareToCClient',
        data: JSON.stringify({ qid: qid, cid: $("#selected-client-id").val() }),
        async: true,
        success: function (data) {
            unblockUI();
            return successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function mergeQuestionnaire2(qid, cid) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/MergeQuestionniare2',
        data: JSON.stringify({ qid: qid, cid: $("#selected-client-id").val() }),
        async: true,
        success: function (data) {
            unblockUI();
            return successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function mergeQuestionnaire3(qid, cid) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/MergeQuestionniare3',
        data: JSON.stringify({ qid: qid, cid: $("#selected-client-id").val() }),
        async: true,
        success: function (data) {
            unblockUI();
            return successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function masterQuestionnaire(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnare/Index',
        async: true,
        success: function (data) {

            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            $(ref).prev().removeClass("active");
            $(ref).addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function getEmailTemp() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Settings/Templates',
        async: true,
        success: function (data) {
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#config-content").html("");
            $("#config-content").html(data);
            $(".nav-email-temp li").removeClass("active");
            $("#li-email-temp").parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getDocumentTypes(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CInfo/GetDocumentTypes',
        async: true,
        success: function (data) {

            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }

            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getTimeZoneConfig(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Settings/TimeZone',
        async: true,
        success: function (data) {
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getMailChimpConfig(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/MC/Index',
        async: true,
        success: function (data) {
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function showCalendarConfig(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Meeting/CalendarSettings',
        async: true,
        success: function (data) {

            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getCalendarSettings(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Meeting/AddAccount',
        async: true,
        success: function (data) {

            $("#calendarContent").html("");
            $("#calendarContent").html(data);
            $("#nav-cal-def").removeClass("active");
            $("#nav-cal-acc").addClass("active");

            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function deleteMeeting(ref, id) {

    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Meeting/DeleteMeeting',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {

                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function removeGMailAccount(ref, id) {

    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Meeting/DeleteGMailAccount',
            data: JSON.stringify({ id: 0 }),
            async: true,
            success: function (data) {

                unblockUI();
                if (data) {
                    $(ref).parent().remove();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function removeOutlookAccount(ref, id) {

    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Meeting/DeleteOutlookAccount',
            data: JSON.stringify({ id: 0 }),
            async: true,
            success: function (data) {

                unblockUI();
                if (data) {
                    $(ref).parent().remove();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function getCalendarDefault(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Meeting/CalendarSettingsDefault',
        async: true,
        success: function (data) {

            unblockUI();
            if (data == "No Account") {
                return showWarningToast(ScriptResourcesList['scriptPleaseAddAnAcocuntFirst'])
            }
            $("#calendarContent").html("");
            $("#calendarContent").html(data);
            $("#nav-cal-acc").removeClass("active");
            $("#nav-cal-def").addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getClaendarForProvider() {
    $("#provider-calendar").remove();
    var id = $("#selectDefaultCalendarProvider").val();
    if (id == "") {
        return false;
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Meeting/GetCalendar?prov=' + id,
        success: function (data) {
            unblockUI();
            $("#selectDefaultCalendarProvider").parents(".bootstrap-select").next(".bootstrap-select").remove();
            $("#selectDefaultCalendarProvider").parents(".bootstrap-select").after(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {

            handleErrors(textStatus);
        }
    });
}
function updateDefaultCalendar() {
    if ($("#selectDefaultCalendarProvider").val().trim() == "") {
        unblockUI();
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectAProvider']);

    }
    if ($("#provider-calendar").val().trim() == "") {
        unblockUI();
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectACalendar']);

    }
    var obj = new Object();
    obj.Provider = $("#selectDefaultCalendarProvider").val();
    obj.Calendar = $("#provider-calendar").val();
    obj.Save = $("#check-save-email").is(":checked");
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/UpdateSettings',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data == true) {
                return showSuccessToast(ScriptResourcesList['scriptUpdated']);
            }
            else {
                return showSuccessToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function showIMAPConfig(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Email/IMAP',
        async: true,
        success: function (data) {

            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function goToSubs(id, name) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/MC/AddMembers?listID=' + id,
        async: true,
        success: function (data) {
            clearSelectedClient();
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#email-panel").html("");
            $("#email-panel").html(data);
            $("#listName").html(name);
            $("#listID").val(id);
            showSubscribers();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (textStatus == "401") {
                handleErrors(textStatus);
            }
            else {
                unblockUI();
                return $().toastmessage('showToast', {
                    text: "Please set your Mail Chimp settings in configurations to use this feature !",
                    sticky: false,
                    position: 'bottom-right',
                    type: 'warning'

                });
            }

        }
    });
}
function getBulkEmail(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Bulk/GetBulkEmail',
        async: true,
        success: function (data) {
            unblockUI();
            $("#email-panel").html("");
            $("#email-panel").html(data);
            $(".nav-email-int li").removeClass("active");
            $(ref).parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getMailChimp(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/MC/GetLists',
        async: true,
        success: function (data) {
            unblockUI();
            $("#email-panel").html("");
            $("#email-panel").html(data);
            $(".nav-email-int li").removeClass("active");
            $(ref).parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (textStatus == "401") {
                handleErrors(textStatus);
            }
            else {
                unblockUI();
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptPleaseSetYourMailChimp'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'warning'

                });
            }

        }
    });
}
function getMailChimpAdd() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/MC/AddList',
        async: true,
        success: function (data) {
            clearSelectedClient();
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#email-panel").html("");
            $("#email-panel").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (textStatus == "401") {
                handleErrors(textStatus);
            }
            else {
                unblockUI();
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptPleaseSetYourMailChimp'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'warning'

                });
            }

        }
    });
}
function getAgentDetails(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Management/AgentDetail?id=' + id,
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            var nextRow = $(ref).parent();
            var html = "";
            html += "<tr class='agetn-detail'><td id='row' colspan='8'>" + data + "</td> </tr>";
            if ($(nextRow).next().hasClass('agetn-detail')) {
                $(nextRow).next().replaceWith(html)
            }
            else {
                $(nextRow).after(html);
            }
            $("#hdn-agent-id").val(id);
        },
        error: function (jqXHR, textStatus, errorThrown) {

            handleErrors(textStatus);

        }
    });
}

function removeDetailAgent(ref) {
    $(ref).parent().parent().parent().remove();
}
function getAgents() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Management/Agents',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $(".agent-main-nav li").removeClass("active");
            $("#agent-1").parent().addClass("active");

            $("#management-content").html("");
            $("#management-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function getAgentsSummary() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Management/AgentsSummary',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $(".agent-main-nav li").removeClass("active");
            $("#agent-0").parent().addClass("active");
            $("#clientp-content").html("");
            $("#clientp-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function getSchools() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/Schools',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $("#management-content").html("");
            $("#management-content").html(data);
            $(".agent-main-nav li").removeClass("active");
            $("#agent-3").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getSuppliers() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/Index',
        async: true,
        success: function (data) {
            unblockUI();
            $(".agent-main-nav li").removeClass("active");
            $("#agent-2").parent().addClass("active");
            $("#management-content").html("");
            $("#management-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function getSupplierAccountsSummary() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/Invoices',
        async: true,
        success: function (data) {
            unblockUI();
            $("#management-content").html("");
            $("#management-content").html(data);
            $(".agent-main-nav li").removeClass("active");
            $("#agent-4").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getSupplierAccounts() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/AddInvoice',
        async: true,
        success: function (data) {
            unblockUI();
            $("#management-content").html("");
            $("#management-content").html(data);
            $(".agent-main-nav li").removeClass("active");
            $("#agent-3").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getSchoolAccountsSummary() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/School/Invoices',
        async: true,
        success: function (data) {
            unblockUI();
            $("#management-content").html("");
            $("#management-content").html(data);
            $(".agent-main-nav li").removeClass("active");
            $("#agent-4").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getSchoolAccounts() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/School/Index',
        async: true,
        success: function (data) {
            unblockUI();
            $("#management-content").html("");
            $("#management-content").html(data);
            $(".agent-main-nav li").removeClass("active");
            $("#agent-4").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getEmployerProfileExternal(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/EmployerManagement/EmployerProfileExternal?id='+id,
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function getSupplierManagement() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/Main',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function getSchoolStudents() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/SchoolStudents',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $("#management-content").html("");
            $("#management-content").html(data);
            $(".agent-main-nav li").removeClass('active');
            $("#agent-2").addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });

}
function getSchoolManagement() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/SchoolManagement',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function getAgentPortal() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Management/Agent',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function getEmailConfiguration() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Email/GetEmail',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            importLists = [];
            $("#content-area").html("");
            $("#content-area").html(data);
            $(".nav-email-int li").removeClass("active");
            $("#get-email-config").parent().addClass("active");
            hideUserList();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (textStatus == "401") {
                handleErrors(textStatus);
            }
            else {
                unblockUI();
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptPleaseSetYourIMAPSettings'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'warning'

                });
            }

        }
    });
}
function getEmailSettings() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Settings/EmailSettings',
        async: true,
        success: function (data) {
            unblockUI();
            $("#templateContent").html("");
            $("#templateContent").html(data);
            $(".acc-set-nav li").removeClass("active");
            $("#nav-email-content").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getLetterTemplates(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Settings/LetterTemplates',
        async: true,
        success: function (data) {
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#templateContent").html("");
            $("#templateContent").html(data);
            $(".acc-set-nav li").removeClass("active");
            $(ref).parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getContracts(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Settings/Contracts',
        async: true,
        success: function (data) {
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#templateContent").html("");
            $("#templateContent").html(data);
            $(".acc-set-nav li").removeClass("active");
            $(ref).parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getSignature(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Settings/Signature',
        async: true,
        success: function (data) {
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#templateContent").html("");
            $("#templateContent").html(data);
            $(".acc-set-nav li").removeClass("active");
            $(ref).parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getDefaultFont(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Settings/DefaultFont',
        async: true,
        success: function (data) {
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#templateContent").html("");
            $("#templateContent").html(data);
            $(".acc-set-nav li").removeClass("active");
            $(ref).parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getTimeTracking() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/TimeTracking/Index',
        async: true,
        success: function (data) {
            clearSelectedClient();
            hideUserList();
            $("#content-area").html("");
            $("#content-area").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getFormsView() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/VisaForms',
        async: true,
        success: function (data) {
            clearSelectedClient();
            hideUserList();
            $("#content-area").html("");
            $("#content-area").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}

function getUsefullLinks() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/UsefulLinks',
        async: true,
        success: function (data) {
            clearSelectedClient();
            hideUserList();
            $("#content-area").html("");
            $("#content-area").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getAccountView() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/Main',
        async: true,
        success: function (data) {
            clearSelectedClient();
            //window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            bindHidePanel();
            unblockUI();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function getAllClient() {


    dontShowDocs = true;
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/AllClients',
        async: true,
        success: function (data) {
            clearSelectedClient();
            //window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function addNewClient() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/AddNewClient',
        async: false,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function showPasswordRestMessage() {
    return $().toastmessage('showToast', {
        text: 'Please Update Your Password.',
        sticky: true,
        position: 'bottom-right',
        type: 'warning'

    });
}
function Popup(data, css) {

    var mywindow = window.open('', 'Print', 'height=400,width=600');
    mywindow.document.write('<html><head><title>Print</title>');
    /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
    if (css) {
        var stylesheet = '//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css';
        mywindow.document.write('<link rel="stylesheet" href="' + stylesheet + '">');
    }
    mywindow.document.write('</head><body >');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10

    mywindow.print();
    mywindow.close();

    return true;
}
function showUserTask(ref, id) {
    var userid = id;
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/UserTasks?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $('#task-nav li').removeClass('active');
            $('#task-nav li:first-child').addClass('active');
            $("#task-container").html("");
            $("#task-container").html(data);
            $("#empListForTasks a").removeClass("user-selected");
            $(ref).addClass("user-selected");
            $("#user-name").html($(ref).html());

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function showMoreReminders(ref, rem) {
    var skip = 0;
    var take = 10;
    if (rem == "ALL") {
        var skip = $("#all-reminders-main .reminder_box").length;
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "json",
            url: '/Dashboard/ShowAllRemindersJson?skip=' + skip + '&take=' + take,
            async: true,
            success: function (data) {

                if (data.length > 0) {

                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += '<div class="reminder_box">';
                        html += '<p>';
                        html += '<input type="checkbox" id="check-rem-' + data[i].ReminderID + '" onchange="completeReminder(this,' + data[i].ReminderID + ')" />';
                        html += '<label for="check-rem-' + data[i].ReminderID + '" class="chkbx_label inv_clr">' + data[i].ReminderDescription + '</label>';
                        html += '</p>';
                        html += '<h6>' + data[i].ReminderDetail + '</h6>';
                        html += '<h6>' + data[i].sDate + ' </h6>';
                        html += '</div>';
                    }
                    $("#all-reminders-main").append(html);
                    unblockUI();
                }
                else {
                    unblockUI();
                    $(ref).hide();
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptNoMoreReminders'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'warning'

                    });
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
    else if (rem == "CUS") {
        var skip = $("#custom-reminder-main .reminder_box").length;
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "json",
            url: '/Dashboard/ShowCustomRemindersJson?skip=' + skip + '&take=' + take,
            async: true,
            success: function (data) {
                if (data.length > 0) {
                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += '<div class="reminder_box">';
                        html += '<p>';
                        html += '<input type="checkbox" id="check-rem-' + data[i].ReminderID + '" onchange="completeReminder(this,' + data[i].ReminderID + ')" />';
                        html += '<label for="check-rem-' + data[i].ReminderID + '" class="chkbx_label inv_clr">' + data[i].ReminderDescription + '</label>';
                        html += '</p>';
                        html += '<h6>' + data[i].ReminderDetail + '</h6>';
                        html += '<h6>' + data[i].sDate + ' </h6>';
                        html += '</div>';

                    }
                    $("#custom-reminder-main").append(html);
                    unblockUI();
                }
                else {
                    unblockUI();
                    $(ref).hide();
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptNoMoreReminders'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'warning'

                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
    else if (rem == "ARC") {
        var skip = $("#archived-reminder-main .reminder_box").length;
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "json",
            url: '/Dashboard/ShowArchivedRemindersJson?skip=' + skip + '&take=' + take,
            async: true,
            success: function (data) {

                if (data.length > 0) {
                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += '<div class="reminder_box">';
                        html += '<p>';
                        html += '<input type="checkbox" id="check-rem-' + data[i].ReminderID + '" onchange="completeReminder(this,' + data[i].ReminderID + ')" />';
                        html += '<label for="check-rem-' + data[i].ReminderID + '" class="chkbx_label inv_clr">' + data[i].ReminderDescription + '</label>';
                        html += '</p>';
                        html += '<h6>' + data[i].ReminderDetail + '</h6>';
                        html += '<h6>' + data[i].sDate + ' </h6>';
                        html += '</div>';

                    }
                    $("#archived-reminder-main").append(html);
                    unblockUI();
                }
                else {
                    unblockUI();
                    $(ref).hide();
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptNoMoreReminders'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'warning'

                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
    else if (rem == "VIS") {
        var skip = $("#visa-reminder-main .reminder_box").length;
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "json",
            url: '/Dashboard/ShowVisaRemindersJson?skip=' + skip + '&take=' + take,
            async: true,
            success: function (data) {

                if (data.length > 0) {
                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += '<div class="reminder_box">';
                        html += '<p>';
                        html += '<input type="checkbox" id="check-rem-' + data[i].ReminderID + '" onchange="completeReminder(this,' + data[i].ReminderID + ')" />';
                        html += '<label for="check-rem-' + data[i].ReminderID + '" class="chkbx_label inv_clr">' + data[i].ReminderDescription + '</label>';
                        html += '</p>';
                        html += '<h6>' + data[i].ReminderDetail + '</h6>';
                        html += '<h6>' + data[i].sDate + ' </h6>';
                        html += '</div>';

                    }
                    $("#visa-reminder-main").append(html);
                    unblockUI();
                }
                else {
                    unblockUI();
                    $(ref).hide();
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptNoMoreReminders'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'warning'

                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
    else if (rem == "PAS") {
        var skip = $("#passport-reminder-main .reminder_box").length;
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "json",
            url: '/Dashboard/ShowPassportRemindersJson?skip=' + skip + '&take=' + take,
            async: true,
            success: function (data) {

                if (data.length > 0) {
                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += '<div class="reminder_box">';
                        html += '<p>';
                        html += '<input type="checkbox" id="check-rem-' + data[i].ReminderID + '" onchange="completeReminder(this,' + data[i].ReminderID + ')" />';
                        html += '<label for="check-rem-' + data[i].ReminderID + '" class="chkbx_label inv_clr">' + data[i].ReminderDescription + '</label>';
                        html += '</p>';
                        html += '<h6>' + data[i].ReminderDetail + '</h6>';
                        html += '<h6>' + data[i].sDate + ' </h6>';
                        html += '</div>';

                    }
                    $("#passport-reminder-main").append(html);
                    unblockUI();
                }
                else {
                    unblockUI();
                    $(ref).hide();
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptNoMoreReminders'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'warning'

                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
    else if (rem == "COM") {
        var skip = $("#completed-reminder-main .reminder_box").length;
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "json",
            url: '/Dashboard/ShowCompletedRemindersJson?skip=' + skip + '&take=' + take,
            async: true,
            success: function (data) {

                if (data.length > 0) {
                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        html += '<div class="reminder_box green">';
                        html += '<p>';
                        html += '<input type="checkbox" id="check-rem-' + data[i].ReminderID + '" onchange="undoReminder(this,' + data[i].ReminderID + ')" checked/>';
                        html += '<label for="check-rem-' + data[i].ReminderID + '" class="chkbx_label inv_clr">' + data[i].ReminderDescription + '</label>';
                        html += '</p>';
                        html += '<h6>' + data[i].ReminderDetail + '</h6>';
                        html += '<h6>' + data[i].sDate + ' </h6>';
                        html += '</div>';

                    }
                    $("#completed-reminder-main").append(html);
                    unblockUI();
                }
                else {
                    unblockUI();
                    $(ref).hide();
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptNoMoreReminders'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'warning'

                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
}
function deleteClientAgent(ref, id) {

    if (confirm(ScriptResourcesList['scriptDoyoureallywanttoremove'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Management/DeleteClientAgent',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().remove();
                }
                unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function deleteClient(ref, id) {

    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/DeleteClient',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().remove();
                }
                unblockUI();
                return showSuccessToast(ScriptResourcesList['scriptDeleted']);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function recoverClient(ref, id) {

    if (confirm(ScriptResourcesList['scriptRecoverConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/RecoverClient',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().html('<i class="fa fa-times-circle" aria-hidden="true" onclick="deleteClient(this,' + id + ')"></i>');
                }
                unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function deletePatner(id, child) {

    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/DeletePatner',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                unblockUI();
                if (child) {
                    getFamilyMembers()
                }
                else {
                    getPartnerDetail();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
}
function addPatnerToClient(id) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/AddPatnerToClient',
        data: JSON.stringify({ id: id }),
        async: true,
        success: function (data) {
            if (data) {
                $("#content-area").html("");
                $("#content-area").html(data);
                clearSelectedClient();
            }
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function addChildToClient(id) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/AddChildToClient',
        data: JSON.stringify({ id: id }),
        async: true,
        success: function (data) {
            if (data) {
                $("#content-area").html("");
                $("#content-area").html(data);
                clearSelectedClient();
            }
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function addOtherRelationToClient(id) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/AddOtherRelationToClient',
        data: JSON.stringify({ id: id }),
        async: true,
        success: function (data) {
            if (data) {
                $("#content-area").html("");
                $("#content-area").html(data);
                clearSelectedClient();
            }
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function viewDetailInvoice(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/UpdateInvoice?invoice=' + id,
        async: true,
        success: function (data) {

            $("#invoices-content").html("");
            $("#invoices-content").html(data);

            unblockUI();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function viewDetailInvoiceSchool(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/School/UpdateInvoice?invoice=' + id,
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
function viewDetailInvoiceSupplier(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Addmission/UpdateInvoice?invoice=' + id,
        async: true,
        success: function (data) {

            $("#tabSchools").html("");
            $("#tabSchools").html(data);

            unblockUI();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function goToInvoiceDetails(id) {
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/Main',
        async: false,
        success: function (data) {
            //window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            bindHidePanel();
            unblockUI();
            viewDetailInvoice(id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });


}
function goToClientSMS(id) {

    var dob = $("#log-" + id).find(".dob").first().html().trim();
    var name = $("#log-" + id).find(".name").first().html().trim();
    var pno = $("#log-" + id).find(".pno").first().html().trim();
    var cdate = $("#log-" + id).find(".cdate").first().html().trim();
    var mdate = $("#log-" + id).find(".mdate").first().html().trim();
    var image = $("#log-" + id).find(".image").first().html().trim();
    $("#clientSearch").val(name);
    $("#selected-client-name").html(name);
    $("#selected-client-passport").html(pno);
    if (dob == '01/01/0001 00:00:00') {
        $("#selected-client-dob").html("");
    }
    else {
        $("#selected-client-dob").html(dob);
    }

    $("#selected-client-uploaded").html("uploaded on : " + cdate + " <br> modified on : " + mdate + "");
    if (image) {
        $('#selected-client-image').attr('src', "data:image/png;base64," + image);
    }
    else {
        $('#selected-client-image').attr('src', "/Content/Images/person-placeholder.png");
    }
    $("#selected-client").show();
    $("#selected-client-id").val(id);

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/UpdateClient',
        async: false,
        success: function (data) {

            $("#content-area").html("");
            $("#content-area").html(data);
            bindHidePanel();

            unblockUI();

        },
        complete: function () {
            $("#send-sms-image").click();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function goToFileNotes(id) {
    var dob = $("#log-" + id).find(".dob").first().html().trim();
    var name = $("#log-" + id).find(".name").first().html().trim();
    var pno = $("#log-" + id).find(".pno").first().html().trim();
    var cdate = $("#log-" + id).find(".cdate").first().html().trim();
    var mdate = $("#log-" + id).find(".mdate").first().html().trim();
    var image = $("#log-" + id).find(".image").first().html().trim();
    $("#clientSearch").val(name);
    $("#selected-client-name").html(name);
    $("#selected-client-passport").html(pno);
    if (dob == '01/01/0001 00:00:00') {
        $("#selected-client-dob").html("");
    }
    else {
        $("#selected-client-dob").html(dob);
    }

    $("#selected-client-uploaded").html("uploaded on : " + cdate + " <br> modified on : " + mdate + "");
    if (image) {
        $('#selected-client-image').attr('src', "data:image/png;base64," + image);
    }
    else {
        $('#selected-client-image').attr('src', "/Content/Images/person-placeholder.png");
    }
    $("#selected-client").show();
    $("#selected-client-id").val(id);

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/UpdateClient',
        async: false,
        success: function (data) {

            $("#content-area").html("");
            $("#content-area").html(data);
            bindHidePanel();
            $("#show-file-image").click();
            unblockUI();

        },
        complete: function () {
            $("#show-file-image").click();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function goToDocuments(id) {
    var dob = $("#log-" + id).find(".dob").first().html().trim();
    var name = $("#log-" + id).find(".name").first().html().trim();
    var pno = $("#log-" + id).find(".pno").first().html().trim();
    var cdate = $("#log-" + id).find(".cdate").first().html().trim();
    var mdate = $("#log-" + id).find(".mdate").first().html().trim();
    var image = $("#log-" + id).find(".image").first().html().trim();
    $("#clientSearch").val(name);
    $("#selected-client-name").html(name);
    $("#selected-client-passport").html(pno);
    if (dob == '01/01/0001 00:00:00') {
        $("#selected-client-dob").html("");
    }
    else {
        $("#selected-client-dob").html(dob);
    }

    $("#selected-client-uploaded").html("uploaded on : " + cdate + " <br> modified on : " + mdate + "");
    if (image) {
        $('#selected-client-image').attr('src', "data:image/png;base64," + image);
    }
    else {
        $('#selected-client-image').attr('src', "/Content/Images/person-placeholder.png");
    }
    $("#selected-client").show();
    $("#selected-client-id").val(id);

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/UpdateClient',
        async: false,
        success: function (data) {

            $("#content-area").html("");
            $("#content-area").html(data);
            bindHidePanel();
            unblockUI();

        },
        complete: function () {
            $("#tabDocs").click();
        },

        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function goToEmail(id) {
    var dob = $("#log-" + id).find(".dob").first().html().trim();
    var name = $("#log-" + id).find(".name").first().html().trim();
    var pno = $("#log-" + id).find(".pno").first().html().trim();
    var cdate = $("#log-" + id).find(".cdate").first().html().trim();
    var mdate = $("#log-" + id).find(".mdate").first().html().trim();
    var image = $("#log-" + id).find(".image").first().html().trim();
    $("#clientSearch").val(name);
    $("#selected-client-name").html(name);
    $("#selected-client-passport").html(pno);
    if (dob == '01/01/0001 00:00:00') {
        $("#selected-client-dob").html("");
    }
    else {
        $("#selected-client-dob").html(dob);
    }

    $("#selected-client-uploaded").html("uploaded on : " + cdate + " <br> modified on : " + mdate + "");
    if (image) {
        $('#selected-client-image').attr('src', "data:image/png;base64," + image);
    }
    else {
        $('#selected-client-image').attr('src', "/Content/Images/person-placeholder.png");
    }
    $("#selected-client").show();
    $("#selected-client-id").val(id);

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/UpdateClient',
        async: false,
        success: function (data) {

            $("#content-area").html("");
            $("#content-area").html(data);
            bindHidePanel();
            unblockUI();

        },
        complete: function () {
            $("#tabEmail").click();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function goToVisa(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/UpdateClient',
        async: false,
        success: function (data) {
            unblockUI();

            $("#content-area").html("");
            $("#content-area").html(data);
            bindHidePanel();


        },
        complete: function () {
            $("#tabVisa").click();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function goToClient(id) {

    var dob = $("#log-" + id).find(".dob").first().html().trim();
    var name = $("#log-" + id).find(".name").first().html().trim();
    var pno = $("#log-" + id).find(".pno").first().html().trim();
    var cdate = $("#log-" + id).find(".cdate").first().html().trim();
    var mdate = $("#log-" + id).find(".mdate").first().html().trim();
    var image = $("#log-" + id).find(".image").first().html().trim();
    $("#clientSearch").val(name);
    $("#selected-client-name").html(name);
    $("#selected-client-passport").html(pno);
    if (dob == '01/01/0001 00:00:00') {
        $("#selected-client-dob").html("");
    }
    else {
        $("#selected-client-dob").html(dob);
    }

    $("#selected-client-uploaded").html(ScriptResourcesList['scriptUploadedOn'] + " : " + cdate + " <br> " + ScriptResourcesList['scriptModifiedOn'] + " : " + mdate + "");
    if (image) {
        $('#selected-client-image').attr('src', "data:image/png;base64," + image);
    }
    else {
        $('#selected-client-image').attr('src', "/Content/Images/person-placeholder.png");
    }
    $("#selected-client").show();
    $("#selected-client-id").val(id);
    showClientDetailViews(id);

}
function validateEmail(email) {

    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(email);
}
function removepClientLink(id) {

    var obj = new Object();
    obj.TaskID = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/pClientLinkRemove',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptUpdated'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            var html = '';
            html += '<p class="chkbox_p blue_chkbx">';
            html += '<input onchange="showPotentialLink(this)" id="check-pot-' + id + '" class="custom_chkbox" type="checkbox">';
            html += '<label for="check-pot-' + id + '" class="chkbx_label no_margin">' + ScriptResourcesList['scriptPotentialClient'] + '</label>';
            html += '</p>';
            html += '<div style="clear:both;"></div>';
            html += '<input type="hidden" class="hdntask" value="' + id + '" />';
            html += '<input type="text"  class="itask-input familLinkAuto" placeholder="' + ScriptResourcesList['scriptLinkClient'] + '" />';
            html += '<input style="display:none" type="text" class="itask-input familLinkAutop" placeholder="' + ScriptResourcesList['scriptPotentialClient'] + '" />';
            $("#client-link-" + id).html("");
            $("#client-link-" + id).html(html);
            $("#task-desc-" + id).next(".label-warning").remove();
            $("#client-link-" + id + " .familLinkAuto").autocomplete({
                source: function (request, response) {
                    blockUI();
                    $.ajax({
                        url: '/Client/getAllClientsForAuto',
                        type: "GET",
                        dataType: "json",
                        data: { term: request.term },
                        position: { collision: "flip" },
                        success: function (data) {
                            unblockUI();
                            response($.map(data, function (item) {
                                return {
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                    passport: item.passport,
                                    dob: item.dob,
                                    modified: item.modified,
                                    uploaded: item.uploaded,
                                    image: item.image,
                                    imageurl: item.imageurl,
                                    email: item.email,
                                    mobile: item.mobile

                                };
                            }))
                        }
                    })

                },
                minLength: 2,
                focus: function (event, ui) {
                    $(this).val(ui.item.label);
                    //$("#familLinkAuto").val(ui.item.label);
                    return false;
                },
                select: function (event, ui) {
                    var rfalse = false;

                    if (confirm(ScriptResourcesList['scriptConfirmationLink'])) {
                        var taskid = $(this).parent().find('.hdntask').val();
                        var obj = new Object();
                        obj.TaskID = taskid;
                        obj.ClientID = ui.item.id;
                        obj.ClientName = ui.item.label;
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: '/Dashboard/ClientLink',
                            async: false,
                            data: JSON.stringify(obj),
                            success: function (data) {
                                showSuccessToast(ScriptResourcesList['scriptUpdated'])

                                var html = '<div class="hide_btn">';
                                html += ' <i onclick="removeClientLink(' + taskid + ')" class="fa fa-times" aria-hidden="true"></i> <span onclick="showClientDetailViews(' + ui.item.id + ')">' + ScriptResourcesList['scriptClient'] + ' : ' + ui.item.label + '</span>';
                                html += '<i class="fa fa-plus-circle" title="' + ScriptResourcesList['scriptConvertToFileNote'] + '" onclick="converToFileNoteDashboard(' + taskid + ',' + ui.item.id + ')"></i>';
                                html += '</div>';
                                html += '<div style="clear: both;"></div>';
                                $("#client-link-" + taskid).html("");
                                $("#client-link-" + taskid).html(html);
                                var label = '<label class="label label-warning" style="cursor:pointer" onclick="showClientDetailViews(' + ui.item.id + ')">' + ui.item.label + '</label>';
                                $("#task-desc-" + taskid).after(label);
                                unblockUI();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                unblockUI();
                                handleErrors(textStatus);
                            }
                        });
                    }

                    return false;
                }
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                var image = "";
                if (item.image) {
                    image = '<img width= "60" height="60" src="data:image/png;base64,' + item.image + '"/>';
                }
                else {
                    image = '<img  width="60" height="60" src="/Content/Images/person-placeholder.png" />';
                }
                var html = "<div style='color: rgb(24, 91, 148);font-family: Lato-R ! important; padding-right: 10px;'>";
                html += '<div  style="font-size: 12px;float:right;width:65%;color:#d0d0d0 !important;">';
                html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148); outline: 0 none !important;'>" + item.label + "</a>";
                if (item.active == false) {
                    html += '<div><span class="label label-danger">' + ScriptResourcesList['scriptInActive'] + '</span></div>';
                }
                else {
                    html += '<div><span class="label label-success">' + ScriptResourcesList['scriptActive'] + '</span></div>';
                }
                if (item.type) {
                    html += '<div>' + ScriptResourcesList['scriptType'] + ': ' + item.type + '</div>';
                }
                html += '<div>EZM ID : ' + item.id + '</div>';
                html += '<div>' + ScriptResourcesList['scriptClientNo'] + ' : ' + item.clientno + '</div>';
                html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
                html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
                html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
                html += '</div>';
                html += '<div style="height: 60px; background-color: black; float: left; width: 25%; margin: 5px;"> ' + image + '</div>';
                html += '<div style="clear:both;"></div></div>';
                var $li = $('<li>');
                $li.data('item.autocomplete', item)
                $li.append(html);
                //$li.append($("").text(item.label));
                return $li.appendTo(ul);
            };
            $("#client-link-" + id + " .familLinkAutop").autocomplete({
                source: function (request, response) {
                    blockUI();
                    $.ajax({
                        url: '/Client/getAllPClientsForAuto',
                        type: "GET",
                        dataType: "json",
                        data: { term: request.term },
                        position: { collision: "flip" },
                        success: function (data) {
                            unblockUI();
                            response($.map(data, function (item) {
                                return {
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                    passport: item.passport,
                                    dob: item.dob,
                                    modified: item.modified,
                                    uploaded: item.uploaded,
                                    image: item.image,
                                    imageurl: item.imageurl,
                                    email: item.email,
                                    mobile: item.mobile
                                };
                            }))
                        }
                    })

                },
                minLength: 2,
                focus: function (event, ui) {
                    $(this).val(ui.item.label);
                    //$("#familLinkAuto").val(ui.item.label);
                    return false;
                },
                select: function (event, ui) {
                    var rfalse = false;

                    if (confirm(ScriptResourcesList['scriptConfirmationLink'])) {
                        var taskid = $(this).parent().find('.hdntask').val();
                        var obj = new Object();
                        obj.TaskID = taskid;
                        obj.ClientID = ui.item.id;
                        obj.ClientName = ui.item.label;
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: '/Dashboard/pClientLink',
                            async: false,
                            data: JSON.stringify(obj),
                            success: function (data) {
                                showSuccessToast(ScriptResourcesList['scriptUpdated'])
                                var html = "";
                                html += '<div class="hide_btn">';
                                html += '<i onclick="removepClientLink(' + taskid + ')" class="fa fa-times" aria-hidden="true"></i>';
                                html += '<span onclick="goToPotentialClient(' + ui.item.id + ')">' + ScriptResourcesList['scriptPotentialClient'] + ' :' + ui.item.label + '</span>';
                                html += '<i class="fa fa-plus-circle" title="' + ScriptResourcesList['scriptConvertToFileNote'] + '" onclick="converToFileNotePotentialDashboard(' + taskid + ',' + ui.item.id + ')"></i>';
                                html += '</div>';
                                html += '<div style="clear: both;"></div>';
                                $("#client-link-" + taskid).html("");
                                $("#client-link-" + taskid).html(html);
                                var label = '<label class="label label-warning" style="cursor:pointer" onclick="goToPotentialClient(' + ui.item.id + ')">' + ui.item.label + '</label>';
                                $("#task-desc-" + taskid).after(label);
                                unblockUI();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                unblockUI();
                                handleErrors(textStatus);
                            }
                        });
                    }

                    return false;
                }
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                var image = "";
                if (item.image) {
                    image = '<img width= "60" height="60" src="data:image/png;base64,' + item.image + '"/>';
                }
                else {
                    image = '<img  width="60" height="60" src="/Content/Images/person-placeholder.png" />';
                }
                var html = "<div style='color: rgb(24, 91, 148);font-family: Lato-R ! important; padding-right: 10px;'>";
                html += '<div  style="font-size: 12px;float:right;width:65%;color:#d0d0d0 !important;">';
                html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148); outline: 0 none !important;'>" + item.label + "</a>";
                if (item.active == false) {
                    html += '<div><span class="label label-danger">' + ScriptResourcesList['scriptInActive'] + '</span></div>';
                }
                else {
                    html += '<div><span class="label label-success">' + ScriptResourcesList['scriptActive'] + '</span></div>';
                }
                if (item.type) {
                    html += '<div>' + ScriptResourcesList['scriptType'] + ': ' + item.type + '</div>';
                }
                html += '<div>EZM ID : ' + item.id + '</div>';
                html += '<div>' + ScriptResourcesList['scriptClientNo'] + ' : ' + item.clientno + '</div>';
                html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
                html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
                html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
                html += '</div>';
                html += '<div style="height: 60px; background-color: black; float: left; width: 25%; margin: 5px;"> ' + image + '</div>';
                html += '<div style="clear:both;"></div></div>';
                var $li = $('<li>');
                $li.data('item.autocomplete', item)
                $li.append(html);
                //$li.append($("").text(item.label));
                return $li.appendTo(ul);
            };
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function removeClientLink(id) {

    var obj = new Object();
    obj.TaskID = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/ClientLinkRemove',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
            var html = '';
            html += '<p class="chkbox_p blue_chkbx">';
            html += '<input onchange="showPotentialLink(this)" id="check-pot-' + id + '" class="custom_chkbox" type="checkbox">';
            html += '<label for="check-pot-' + id + '" class="chkbx_label no_margin">' + ScriptResourcesList['scriptPotentialClient'] + '</label>';
            html += '</p>';
            html += '<div style="clear:both;"></div>';
            html += '<input type="hidden" class="hdntask" value="' + id + '" />';
            html += '<input type="text"  class="itask-input familLinkAuto" placeholder="' + ScriptResourcesList['scriptLinkClient'] + '" />';
            html += '<input style="display:none" type="text" class="itask-input familLinkAutop" placeholder="' + ScriptResourcesList['scriptLinkClient'] + '" />';
            $("#client-link-" + id).html("");
            $("#client-link-" + id).html(html);
            $("#task-desc-" + id).next(".label-warning").remove();
            $("#client-link-" + id + " .familLinkAuto").autocomplete({
                source: function (request, response) {
                    blockUI();
                    $.ajax({
                        url: '/Client/getAllClientsForAuto', type: "GET",
                        dataType: "json",
                        data: { term: request.term },
                        position: { collision: "flip" },
                        success: function (data) {
                            unblockUI();
                            response($.map(data, function (item) {
                                return {
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                    passport: item.passport,
                                    dob: item.dob,
                                    modified: item.modified,
                                    uploaded: item.uploaded,
                                    image: item.image,
                                    imageurl: item.imageurl,
                                    email: item.email,
                                    mobile: item.mobile
                                };
                            }))
                        }
                    })

                },
                minLength: 2,
                focus: function (event, ui) {
                    $(this).val(ui.item.label);
                    //$("#familLinkAuto").val(ui.item.label);
                    return false;
                },
                select: function (event, ui) {
                    var rfalse = false;

                    if (confirm(ScriptResourcesList['scriptConfirmationLink'])) {
                        var taskid = $(this).parent().find('.hdntask').val();
                        var obj = new Object();
                        obj.TaskID = taskid;
                        obj.ClientID = ui.item.id;
                        obj.ClientName = ui.item.label;
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: '/Dashboard/ClientLink',
                            async: false,
                            data: JSON.stringify(obj),
                            success: function (data) {
                                showSuccessToast(ScriptResourcesList['scriptUpdated']);

                                var html = '<div class="hide_btn">';
                                html += ' <i onclick="removeClientLink(' + taskid + ')" class="fa fa-times" aria-hidden="true"></i> <span onclick="showClientDetailViews(' + ui.item.id + ')">' + ScriptResourcesList['scriptClient'] + ' : ' + ui.item.label + '</span>';
                                html += '<i class="fa fa-plus-circle" title="' + ScriptResourcesList['scriptConvertToFileNote'] + '" onclick="converToFileNoteDashboard(' + taskid + ',' + ui.item.id + ')"></i>';
                                html += '</div>';
                                html += '<div style="clear: both;"></div>';
                                $("#client-link-" + taskid).html("");
                                $("#client-link-" + taskid).html(html);
                                var label = '<label class="label label-warning" style="cursor:pointer" onclick="showClientDetailViews(' + ui.item.id + ')">' + ui.item.label + '</label>';
                                $("#task-desc-" + taskid).after(label);
                                unblockUI();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                unblockUI();
                                handleErrors(textStatus);
                            }
                        });
                    }

                    return false;
                }
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                var image = "";
                if (item.image) {
                    image = '<img width="60" height="60"  src="data:image/png;base64,' + item.image + '"/>';
                }
                else {
                    image = '<img  width="60" height="60" src="/Content/Images/person-placeholder.png" />';
                }
                var html = "<div style='color: rgb(24, 91, 148);font-family: century gothic ! important;'>";
                html += '<div  style="font-size: 12px;float:right;width:120px;color:#d0d0d0 !important;">';
                html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148);'>" + item.label + "</a>";
                if (item.active == false) {
                    html += '<div><span class="label label-danger">' + ScriptResourcesList['scriptInActive'] + '</span></div>';
                }
                else {
                    html += '<div><span class="label label-success">' + ScriptResourcesList['scriptActive'] + '</span></div>';
                }
                if (item.type) {
                    html += '<div>' + ScriptResourcesList['scriptType'] + ': ' + item.type + '</div>';
                }
                html += '<div>EZM ID : ' + item.id + '</div>';
                html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
                html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
                html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
                html += '</div>';
                html += '<div style="height: 60px; background-color: black; float: left; width: 60px; margin: 5px;"> ' + image + '</div>';
                html += '<div style="clear:both;"></div></div>';
                var $li = $('<li>');
                $li.data('item.autocomplete', item)
                $li.append(html);
                //$li.append($("").text(item.label));
                return $li.appendTo(ul);
            };
            $("#client-link-" + id + " .familLinkAutop").autocomplete({
                source: function (request, response) {
                    blockUI();
                    $.ajax({
                        url: '/Client/getAllPClientsForAuto', type: "GET",
                        dataType: "json",
                        data: { term: request.term },
                        position: { collision: "flip" },
                        success: function (data) {
                            unblockUI();
                            response($.map(data, function (item) {
                                return {
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                    passport: item.passport,
                                    dob: item.dob,
                                    modified: item.modified,
                                    uploaded: item.uploaded,
                                    image: item.image,
                                    imageurl: item.imageurl,
                                    email: item.email,
                                    mobile: item.mobile
                                };
                            }))
                        }
                    })

                },
                minLength: 2,
                focus: function (event, ui) {
                    $(this).val(ui.item.label);
                    //$("#familLinkAuto").val(ui.item.label);
                    return false;
                },
                select: function (event, ui) {
                    var rfalse = false;

                    if (confirm(ScriptResourcesList['scriptConfirmationLink'])) {
                        var taskid = $(this).parent().find('.hdntask').val();
                        var obj = new Object();
                        obj.TaskID = taskid;
                        obj.ClientID = ui.item.id;
                        obj.ClientName = ui.item.label;
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: '/Dashboard/pClientLink',
                            async: false,
                            data: JSON.stringify(obj),
                            success: function (data) {
                                showSuccessToast(ScriptResourcesList['scriptUpdated']);

                                var html = "";
                                html += '<div class="hide_btn">';
                                html += '<i onclick="removepClientLink(' + taskid + ')" class="fa fa-times" aria-hidden="true"></i>';
                                html += '<span onclick="goToPotentialClient(' + ui.item.id + ')">' + ScriptResourcesList['scriptPotentialClient'] + ' :' + ui.item.label + '</span>';
                                html += '<i class="fa fa-plus-circle" title="' + ScriptResourcesList['scriptConvertToFileNote'] + '" onclick="converToFileNotePotentialDashboard(' + taskid + ',' + ui.item.id + ')"></i>';
                                html += '</div>';
                                html += '<div style="clear: both;"></div>';
                                $("#client-link-" + taskid).html("");
                                $("#client-link-" + taskid).html(html);
                                var label = '<label class="label label-warning" style="cursor:pointer" onclick="goToPotentialClient(' + ui.item.id + ')">' + ui.item.label + '</label>';
                                $("#task-desc-" + taskid).after(label);
                                unblockUI();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                unblockUI();
                                handleErrors(textStatus);
                            }
                        });
                    }

                    return false;
                }
            }).data("ui-autocomplete")._renderItem = function (ul, item) {

                var html = "<div style='color: rgb(24, 91, 148);font-family: century gothic ! important;'>";
                html += '<div  style="font-size: 12px;float:right;width:120px;color:#d0d0d0 !important;">';
                html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148);'>" + item.label + "</a>";
                html += '<div>EZM ID : ' + item.id + '</div>';
                html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
                html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
                html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
                html += '</div>';
                html += '<div style="height: 60px; background-color: black; float: left; width: 60px; margin: 5px;"> <img  width="60" height="60" src="/Content/Images/person-placeholder.png" /></div>';
                html += '<div style="clear:both;"></div></div>';
                var $li = $('<li>');
                $li.data('item.autocomplete', item)
                $li.append(html);
                //$li.append($("").text(item.label));
                return $li.appendTo(ul);
            };
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}

function removepClientLinkMeeting(id) {

    var obj = new Object();
    obj.MeetingID = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/RemoveClientLinkPotential',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptUpdated'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            var html = '';
            html += '<p class="chkbox_p blue_chkbx">';
            html += '<input style="margin-top: 10px;" onchange="showPotentialLink(this)" id="check-pot-' + id + '" class="custom_chkbox" type="checkbox">';
            html += '<label for="check-pot-' + id + '" class="chkbx_label no_margin">' + ScriptResourcesList['scriptPotentialClient'] + '</label>';
            html += '</p>';
            html += '<div style="clear:both;"></div>';
            html += '<input type="hidden" class="hdntask" value="' + id + '" />';
            html += '<input style="margin-top: 10px;" type="text"  class="itask-input familLinkAuto" placeholder="' + ScriptResourcesList['scriptLinkClient'] + '" />';
            html += '<input style="display:none" type="text" class="itask-input familLinkAutop" placeholder="' + ScriptResourcesList['scriptPotentialClient'] + '" />';
            $("#client-link-" + id).html("");
            $("#client-link-" + id).html(html);
            $("#meeting-title-" + id).next(".label-warning").remove();
            $("#client-link-" + id + " .familLinkAuto").autocomplete({
                source: function (request, response) {
                    blockUI();
                    $.ajax({
                        url: '/Client/getAllClientsForAuto',
                        type: "GET",
                        dataType: "json",
                        data: { term: request.term },
                        position: { collision: "flip" },
                        success: function (data) {
                            unblockUI();
                            response($.map(data, function (item) {
                                return {
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                    passport: item.passport,
                                    dob: item.dob,
                                    modified: item.modified,
                                    uploaded: item.uploaded,
                                    image: item.image,
                                    imageurl: item.imageurl,
                                    email: item.email,
                                    mobile: item.mobile

                                };
                            }))
                        }
                    })

                },
                minLength: 2,
                focus: function (event, ui) {
                    $(this).val(ui.item.label);
                    //$("#familLinkAuto").val(ui.item.label);
                    return false;
                },
                select: function (event, ui) {
                    var rfalse = false;

                    if (confirm(ScriptResourcesList['scriptConfirmationLink'])) {
                        var taskid = $(this).parent().find('.hdntask').val();
                        var obj = new Object();
                        obj.TaskID = taskid;
                        obj.ClientID = ui.item.id;
                        obj.ClientName = ui.item.label;
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: '/Dashboard/ClientLink',
                            async: false,
                            data: JSON.stringify(obj),
                            success: function (data) {
                                showSuccessToast(ScriptResourcesList['scriptUpdated'])

                                var html = '<div class="form-row" style="padding-right:5px;">';
                                html += '<span class="label label-warning" style="float:right;border-radius: 0;">' + ScriptResourcesList['scriptClient'] + ' : ' + ui.item.label + '</span>';
                                html += '<span class="label label-danger" style="float:right;border-radius: 0;cursor:pointer;" onclick="removeClientLink(' + taskid + ')" title="' + ScriptResourcesList['scriptRemove'] + '">x</span>';
                                html += '</div>';
                                $("#client-link-" + taskid).html("");
                                $("#client-link-" + taskid).html(html);
                                var label = '<label class="label label-warning" style="cursor:pointer" onclick="showClientDetailViews(' + taskid + ')">' + ui.item.label + '</label>';
                                $("#task-desc-" + taskid).after(label);
                                unblockUI();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                unblockUI();
                                handleErrors(textStatus);
                            }
                        });
                    }

                    return false;
                }
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                var image = "";
                if (item.image) {
                    image = '<img width= "60" height="60" src="data:image/png;base64,' + item.image + '"/>';
                }
                else {
                    image = '<img  width="60" height="60" src="/Content/Images/person-placeholder.png" />';
                }
                var html = "<div style='color: rgb(24, 91, 148);font-family: Lato-R ! important; padding-right: 10px;'>";
                html += '<div  style="font-size: 12px;float:right;width:65%;color:#d0d0d0 !important;">';
                html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148); outline: 0 none !important;'>" + item.label + "</a>";
                if (item.type) {
                    html += '<div>' + ScriptResourcesList['scriptType'] + ' : ' + item.type + '</div>';
                }
                html += '<div>EZM ID : ' + item.id + '</div>';
                html += '<div>' + ScriptResourcesList['scriptClientNo'] + ' : ' + item.clientno + '</div>';
                html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
                html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
                html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
                html += '</div>';
                html += '<div style="height: 60px; background-color: black; float: left; width: 25%; margin: 5px;"> ' + image + '</div>';
                html += '<div style="clear:both;"></div></div>';
                var $li = $('<li>');
                $li.data('item.autocomplete', item)
                $li.append(html);
                //$li.append($("").text(item.label));
                return $li.appendTo(ul);
            };
            $("#client-link-" + id + " .familLinkAutop").autocomplete({
                source: function (request, response) {
                    blockUI();
                    $.ajax({
                        url: '/Client/getAllPClientsForAuto',
                        type: "GET",
                        dataType: "json",
                        data: { term: request.term },
                        position: { collision: "flip" },
                        success: function (data) {
                            unblockUI();
                            response($.map(data, function (item) {
                                return {
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                    passport: item.passport,
                                    dob: item.dob,
                                    modified: item.modified,
                                    uploaded: item.uploaded,
                                    image: item.image,
                                    imageurl: item.imageurl,
                                    email: item.email,
                                    mobile: item.mobile
                                };
                            }))
                        }
                    })

                },
                minLength: 2,
                focus: function (event, ui) {
                    $(this).val(ui.item.label);
                    //$("#familLinkAuto").val(ui.item.label);
                    return false;
                },
                select: function (event, ui) {
                    var rfalse = false;

                    if (confirm(ScriptResourcesList['scriptConfirmationLink'])) {
                        var taskid = $(this).parent().find('.hdntask').val();
                        var obj = new Object();
                        obj.TaskID = taskid;
                        obj.ClientID = ui.item.id;
                        obj.ClientName = ui.item.label;
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: '/Meeting/ClientLink',
                            async: false,
                            data: JSON.stringify(obj),
                            success: function (data) {
                                showSuccessToast(ScriptResourcesList['scriptUpdated']);
                                var html = '<div class="form-row" style="padding-right:5px;">';
                                html += '<span class="label label-warning" style="float:right;border-radius: 0;">' + ScriptResourcesList['scriptClient'] + ' : ' + ui.item.label + '</span>';
                                html += '<span class="label label-danger" style="float:right;border-radius: 0;cursor:pointer;" onclick="removepClientLinkMeeting(' + meetingid + ')" title="' + ScriptResourcesList['scriptRemove'] + '">x</span>';
                                html += '</div>';
                                $("#client-link-" + meetingid).html("");
                                $("#client-link-" + meetingid).html(html);
                                var label = '<label class="label label-warning" style="cursor:pointer" onclick="goToPotentialClient(' + ui.item.id + ')">' + ui.item.label + '</label>';
                                $("#meeting-title-" + meetingid).after(label);
                                unblockUI();
                            },
                            async: false,
                            data: JSON.stringify(obj),
                            success: function (data) {
                                showSuccessToast(ScriptResourcesList['scriptUpdated'])
                                var html = '<div class="form-row" style="padding-right:5px;">';
                                html += '<span class="label label-warning" style="float:right;border-radius: 0;">' + ScriptResourcesList['scriptClient'] + ' : ' + ui.item.label + '</span>';
                                html += '<span class="label label-danger" style="float:right;border-radius: 0;cursor:pointer;" onclick="removepClientLink(' + taskid + ')" title="' + ScriptResourcesList['scriptRemove'] + '">x</span>';
                                html += '</div>';
                                $("#client-link-" + taskid).html("");
                                $("#client-link-" + taskid).html(html);
                                var label = '<label class="label label-warning" style="cursor:pointer" onclick="goToPotentialClient(' + taskid + ')">' + ui.item.label + '</label>';
                                $("#task-desc-" + taskid).after(label);
                                unblockUI();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                unblockUI();
                                handleErrors(textStatus);
                            }
                        });
                    }

                    return false;
                }
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                var image = "";
                if (item.image) {
                    image = '<img width= "60" height="60" src="data:image/png;base64,' + item.image + '"/>';
                }
                else {
                    image = '<img  width="60" height="60" src="/Content/Images/person-placeholder.png" />';
                }
                var html = "<div style='color: rgb(24, 91, 148);font-family: Lato-R ! important; padding-right: 10px;'>";
                html += '<div  style="font-size: 12px;float:right;width:65%;color:#d0d0d0 !important;">';
                html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148); outline: 0 none !important;'>" + item.label + "</a>";
                if (item.type) {
                    html += '<div>' + ScriptResourcesList['scriptType'] + ' : ' + item.type + '</div>';
                }
                html += '<div>EZM ID : ' + item.id + '</div>';
                html += '<div>' + ScriptResourcesList['scriptClientNo'] + ' : ' + item.clientno + '</div>';
                html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
                html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
                html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
                html += '</div>';
                html += '<div style="height: 60px; background-color: black; float: left; width: 25%; margin: 5px;"> ' + image + '</div>';
                html += '<div style="clear:both;"></div></div>';
                var $li = $('<li>');
                $li.data('item.autocomplete', item)
                $li.append(html);
                //$li.append($("").text(item.label));
                return $li.appendTo(ul);
            };
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function removeClientLinkMeeting(id) {

    var obj = new Object();
    obj.MeetingID = id;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/RemoveClientLink',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
            var html = '';
            html += '<p class="chkbox_p blue_chkbx">';
            html += '<input style="margin-top: 10px;"  onchange="showPotentialLink(this)" id="check-pot-' + id + '" class="custom_chkbox" type="checkbox">';
            html += '<label for="check-pot-' + id + '" class="chkbx_label no_margin">' + ScriptResourcesList['scriptPotentialClient'] + '</label>';
            html += '</p>';
            html += '<div style="clear:both;"></div>';
            html += '<input type="hidden" class="hdntask" value="' + id + '" />';
            html += '<input style="margin-top: 10px;" type="text"  class="itask-input familLinkAuto" placeholder="' + ScriptResourcesList['scriptLinkClient'] + '" />';
            html += '<input style="display:none;margin-top: 10px;" type="text" class="itask-input familLinkAutop" placeholder="' + ScriptResourcesList['scriptLinkClient'] + '" />';
            $("#client-link-" + id).html("");
            $("#client-link-" + id).html(html);
            $("#meeting-title-" + id).next(".label-warning").remove();
            $("#client-link-" + id + " .familLinkAuto").autocomplete({
                source: function (request, response) {
                    blockUI();
                    $.ajax({
                        url: '/Client/getAllClientsForAuto', type: "GET",
                        dataType: "json",
                        data: { term: request.term },
                        position: { collision: "flip" },
                        success: function (data) {
                            unblockUI();
                            response($.map(data, function (item) {
                                return {
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                    passport: item.passport,
                                    dob: item.dob,
                                    modified: item.modified,
                                    uploaded: item.uploaded,
                                    image: item.image,
                                    imageurl: item.imageurl,
                                    email: item.email,
                                    mobile: item.mobile
                                };
                            }))
                        }
                    })

                },
                minLength: 2,
                focus: function (event, ui) {
                    $(this).val(ui.item.label);
                    //$("#familLinkAuto").val(ui.item.label);
                    return false;
                },
                select: function (event, ui) {
                    var rfalse = false;

                    if (confirm(ScriptResourcesList['scriptConfirmationLink'])) {
                        var meetingid = $(this).parent().find('.hdnMeeting').val();
                        var obj = new Object();
                        obj.MeetingID = meetingid;
                        obj.ClientID = ui.item.id;
                        obj.ClientName = ui.item.label;
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: '/Meeting/ClientLink',
                            async: false,
                            data: JSON.stringify(obj),
                            success: function (data) {
                                showSuccessToast(ScriptResourcesList['scriptUpdated']);
                                var html = '<div class="form-row" style="padding-right:5px;">';
                                html += '<span class="label label-warning" style="float:right;border-radius: 0;">' + ScriptResourcesList['scriptClient'] + ' : ' + ui.item.label + '</span>';
                                html += '<span class="label label-danger" style="float:right;border-radius: 0;cursor:pointer;" onclick="removeClientLinkMeeting(' + meetingid + ')" title="' + ScriptResourcesList['scriptRemove'] + '">x</span>';
                                html += '</div>';
                                $("#client-link-" + meetingid).html("");
                                $("#client-link-" + meetingid).html(html);
                                var label = '<label class="label label-warning" style="cursor:pointer" onclick="showClientDetailViews(' + ui.item.id + ')">' + ui.item.label + '</label>';
                                $("#meeting-title-" + meetingid).after(label);
                                unblockUI();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                unblockUI();
                                handleErrors(textStatus);
                            }
                        });
                    }

                    return false;
                }
            }).data("ui-autocomplete")._renderItem = function (ul, item) {
                var image = "";
                if (item.image) {
                    image = '<img width="60" height="60"  src="data:image/png;base64,' + item.image + '"/>';
                }
                else {
                    image = '<img  width="60" height="60" src="/Content/Images/person-placeholder.png" />';
                }
                var html = "<div style='color: rgb(24, 91, 148);font-family: century gothic ! important;'>";
                html += '<div  style="font-size: 12px;float:right;width:120px;color:#d0d0d0 !important;">';
                html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148);'>" + item.label + "</a>";

                html += '<div>EZM ID : ' + item.id + '</div>';
                html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
                html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
                html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
                html += '</div>';
                html += '<div style="height: 60px; background-color: black; float: left; width: 60px; margin: 5px;"> ' + image + '</div>';
                html += '<div style="clear:both;"></div></div>';
                var $li = $('<li>');
                $li.data('item.autocomplete', item)
                $li.append(html);
                //$li.append($("").text(item.label));
                return $li.appendTo(ul);
            };
            $("#client-link-" + id + " .familLinkAutop").autocomplete({
                source: function (request, response) {
                    blockUI();
                    $.ajax({
                        url: '/Client/getAllPClientsForAuto', type: "GET",
                        dataType: "json",
                        data: { term: request.term },
                        position: { collision: "flip" },
                        success: function (data) {
                            unblockUI();
                            response($.map(data, function (item) {
                                return {
                                    id: item.id,
                                    value: item.value,
                                    label: item.label,
                                    passport: item.passport,
                                    dob: item.dob,
                                    modified: item.modified,
                                    uploaded: item.uploaded,
                                    image: item.image,
                                    imageurl: item.imageurl,
                                    email: item.email,
                                    mobile: item.mobile
                                };
                            }))
                        }
                    })

                },
                minLength: 2,
                focus: function (event, ui) {
                    $(this).val(ui.item.label);
                    //$("#familLinkAuto").val(ui.item.label);
                    return false;
                },
                select: function (event, ui) {
                    var rfalse = false;

                    if (confirm(ScriptResourcesList['scriptConfirmationLink'])) {
                        var meetingID = $(this).parent().find('.hdnMeeting').val();
                        var obj = new Object();
                        obj.MeetingID = meetingID;
                        obj.ClientID = ui.item.id;
                        obj.ClientName = ui.item.label;
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: '/Meeting/pClientLink',
                            async: false,
                            data: JSON.stringify(obj),
                            success: function (data) {
                                showSuccessToast(ScriptResourcesList['scriptUpdated']);
                                var html = '<div class="form-row" style="padding-right:5px;">';
                                html += '<span class="label label-warning" style="float:right;border-radius: 0;">' + ScriptResourcesList['scriptClient'] + ' : ' + ui.item.label + '</span>';
                                html += '<span class="label label-danger" style="float:right;border-radius: 0;cursor:pointer;" onclick="removepClientLink(' + meetingID + ')" title="' + ScriptResourcesList['scriptRemove'] + '">x</span>';
                                html += '</div>';
                                $("#client-link-" + meetingID).html("");
                                $("#client-link-" + meetingID).html(html);
                                var label = '<label class="label label-warning" style="cursor:pointer" onclick="goToPotentialClient(' + ui.item.id + ')">' + ui.item.label + '</label>';
                                $("#meeting-title-" + meetingID).after(label);
                                unblockUI();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                unblockUI();
                                handleErrors(textStatus);
                            }
                        });
                    }

                    return false;
                }
            }).data("ui-autocomplete")._renderItem = function (ul, item) {

                var html = "<div style='color: rgb(24, 91, 148);font-family: century gothic ! important;'>";
                html += '<div  style="font-size: 12px;float:right;width:120px;color:#d0d0d0 !important;">';
                html += "<a style='font-size: 16px;font-weight:bold;color: rgb(24, 91, 148);'>" + item.label + "</a>";
                if (item.active == false) {
                    html += '<div><span class="label label-danger">' + ScriptResourcesList['scriptInActive'] + '</span></div>';
                }
                else {
                    html += '<div><span class="label label-success">' + ScriptResourcesList['scriptActive'] + '</span></div>';
                }
                if (item.type) {
                    html += '<div>' + ScriptResourcesList['scriptType'] + ': ' + item.type + '</div>';
                }
                html += '<div>EZM ID : ' + item.id + '</div>';
                html += '<div>' + ScriptResourcesList['scriptDOB'] + ' : ' + item.dob + '</div>';
                html += '<div>' + ScriptResourcesList['scriptEmail'] + ' : ' + item.email + '</div>';
                html += '<div>' + ScriptResourcesList['scriptMobile'] + ' : ' + item.mobile + '</div>';
                html += '</div>';
                html += '<div style="height: 60px; background-color: black; float: left; width: 60px; margin: 5px;"> <img  width="60" height="60" src="/Content/Images/person-placeholder.png" /></div>';
                html += '<div style="clear:both;"></div></div>';
                var $li = $('<li>');
                $li.data('item.autocomplete', item)
                $li.append(html);
                //$li.append($("").text(item.label));
                return $li.appendTo(ul);
            };
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function showCustomQuestionnairePublic() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/Public',
        async: true,
        success: function (data) {
            clearSelectedClient();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function showWebList() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/WebAssessment',
        async: true,
        success: function (data) {
            clearSelectedClient();
            // window.history.replaceState('', 'EzyMigrate || Home', 'https://ezymigrate.co.nz/Dashboard#');
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function showMigrationInquiryLink(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/MigrationInquiryLink',
        async: true,
        success: function (data) {

            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            $(ref).parent().addClass("active");
            $("#webAssessmentUL li").removeClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function showInquiryLink(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/InquiryLink',
        async: true,
        success: function (data) {

            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            $(ref).parent().addClass("active");
            $("#webAssessmentUL li").removeClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function showQuestionnaireLink(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/WebLink',
        async: true,
        success: function (data) {

            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            $(ref).parent().addClass("active");
            $("#webAssessmentUL li").removeClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}

function showLinkQuestionnaire3(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/GetQuestionnaire3',
        async: true,
        success: function (data) {

            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            $(ref).parent().addClass("active");
            $("#webAssessmentUL li").removeClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}

function showPotentialList() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/PotentialClientsList',
        async: true,
        success: function (data) {
            clearSelectedClient();
            $("#content-area").html("");
            $("#content-area").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function showAgentList() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/AgentClients',
        async: true,
        success: function (data) {
            clearSelectedClient();
            $("#content-area").html("");
            $("#content-area").html(data);
            hideUserList();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function updateWorkTypePost() {
    var name = $("#work-name").val();

    if (name == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }
    var obj = new Object();
    obj.ID = $("#hdn-work-type-id").val();
    obj.Name = name;

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/TimeTracking/UpdateWorkType',
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
            $('#work-modal').modal('hide');
            $('body').removeClass('modal-open');
            getWorkType();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function deleteWorkType(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/TimeTracking/DeleteWorkType',
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
function updateWorkTypeGet(id, name) {
    $("#hdn-work-type-id").val(id);
    $("#work-name").val(name);
    $('#work-modal').modal('show');
}
function addWorkType() {
    var name = $("#work-name").val();

    if (name == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }
    if ($("#hdn-work-type-id").val() != "") {
        return updateWorkTypePost();
    }
    var obj = new Object();
    obj.Name = name;

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/TimeTracking/AddWorkType',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            $('#work-modal').modal('hide');
            $('body').removeClass('modal-open');
            getWorkType();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function addTax() {

    $("#tax-modal .errorSpanModal").html("");
    var name = $("#tax-name").val();
    var pname = $("#hdn-name-tax").val();
    var number = $("#tax-number").val();
    var percent = $("#tax-percent").val();
    if (name == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }
    else if (number == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterNumber']);
        return false;
    }
    else if (percent == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterPercentage']);
        return false;
    }
    else if (!($.isNumeric(percent))) {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterPercentageDigi']);
        return false;
    }
    else if (parseInt(percent) > 100) {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterPercentageLess']);
        return false;
    }
    if ($("#hdn-taxid").val() != "") {
        return updateTaxPost();
    }
    var obj = new Object();
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
                    url: '/CInfo/AddTax',
                    async: false,
                    data: JSON.stringify(obj),
                    success: function (data) {
                        unblockUI();
                        showSuccessToast(ScriptResourcesList['scriptAdded']);
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
function addAccount() {


    $("#acc-modal .errorSpanModal").html("");
    var name = $("#acc-name").val();
    var number = $("#acc-number").val();
    var title = $("#acc-title").val();
    var bank = $("#acc-bank-name").val();
    if (name == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }
    else if (bank == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterBankName']);
        return false;
    }
    else if (title == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterTitle']);
        return false;
    }
    else if (number == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterNumber']);
        return false;
    }
    if ($("#hdn-accid").val() != "") {
        return updateAccountPost();
    }
    var obj = new Object();
    obj.Name = name;
    obj.Number = number;
    obj.Title = title;
    obj.Bank = bank;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/AddAccount',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            $('#acc-modal').modal('hide');
            $('body').removeClass('modal-open');

            SwitchInvoiceView('5');
            $("#bank-well").focus();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addInvoiceNotes() {

    $("#notes-modal .errorSpanModal").html("");
    var name = $("#notes-name").val();
    var note = $("#notes-notes").val();

    if (name == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }
    else if (note == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterNotes']);
        return false;
    }
    if ($("#hdn-notesid").val() != "") {
        return updateNotesPost();
    }
    var obj = new Object();
    obj.Name = name;
    obj.Notes = note;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/AddNotes',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
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
function addOutgoingSources() {


    $("#ogs-modal .errorSpanModal").html("");
    var name = $("#ogs-name").val();


    if (name == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }
    if ($("#hdn-ogsid").val() != "") {
        return updateOutgoingSources();
    }

    var obj = new Object();
    obj.Name = name;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/AddOutgoingSource',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
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
function addDocType(internal) {
    if ($("#hdn-doc-type").val() != "") {
        return updateDocType();
    }

    $("#doc-type-modal .errorSpanModal").html("");
    var name = $("#doc-type-name").val();


    if (name == "") {
        $("#doc-type-name").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }


    var obj = new Object();
    obj.Name = name;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/InsertDocumentType',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            $('#doc-type-modal').modal('hide');
            $('body').removeClass('modal-open');
            if (internal) {
                getClientDocs();
            }
            else {
                getDocumentTypes();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function updateDocType() {

    if (confirm(ScriptResourcesList['scriptConfirmUpdateDocName'])) {
        $("#doc-type-modal .errorSpanModal").html("");
        var name = $("#doc-type-name").val();


        if (name == "") {
            $("#doc-type-name").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterName']);
            return false;
        }

        var obj = new Object();
        obj.ID = $("#hdn-doc-type").val();
        obj.Name = name;
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/UpdateDocumentType',
            async: false,
            data: JSON.stringify(obj),
            success: function (data) {
                unblockUI();
                showSuccessToast(ScriptResourcesList['scriptUpdated']);
                $("#doc-type-name").val("");
                $("#hdn-doc-type").val("");
                $('#doc-type-modal').modal('hide');
                $('body').removeClass('modal-open');
                getDocumentTypes();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }

}
function deleteDocType(id, ref) {
    if (confirm(ScriptResourcesList['scriptConfirmDeleteFolder'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/DeleteDocumentType',
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
function showPotentialLink(ref) {
    if ($(ref).is(':checked')) {
        $(ref).parent().parent().parent().find(".familLinkAutop").show();
        $(ref).parent().parent().parent().find(".familLinkAuto").hide();
    }
    else {
        $(ref).parent().parent().parent().find(".familLinkAutop").hide();
        $(ref).parent().parent().parent().find(".familLinkAuto").show();
    }
}
function showPotentialLinkPopup(ref) {
    if ($(ref).is(':checked')) {
        $("#client-serch-task-pot").val(true);
        $("#client-serch-task-rem-p").show();
        $("#client-serch-task-rem").hide();
        $("#client-serch-task-rem").val("");
    }
    else {
        $("#client-serch-task-pot").val(false);
        $("#client-serch-task-rem-p").hide();
        $("#client-serch-task-rem-p").val("");
        $("#client-serch-task-rem").show();
    }
}

function LinkPotentialClient(ref) {
    if ($(ref).is(':checked')) {
        $("#client-serch-task-potential").val(true);
        $("#p-client-link").show();
        $("#client-link").hide();
        $("#client-link").val("");
    }
    else {
        $("#client-serch-task-potential").val(false);
        $("#p-client-link").hide();
        $("#p-client-link").val("");
        $("#client-link").show();
    }
}
function deleteInvoiceNotes(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/DeleteNotes',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().remove();
                }
                unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
}
function addContractInEmailExternal() {

    var id = $("#email-add-contract").val();
    if (id == "Contracts") {
        return false;
    }
    var name = $("#email-add-contract :selected").text();
    blockUI();
    $.ajax({
        url: '/Settings/GetTemplateClient?id=' + id + '&client=' + $("#hdn-imap-client").val(),
        type: "GET",
        success: function (response) {
            unblockUI();
            var count = (parseInt($(".contract-item").length) + 1);
            var html = "";
            html += "<div class='contract-item'>"
            html += "<span class='file-name' style='display:none'>" + name + "</span>";
            html += ' <p class="chkbox_p blue_chkbx half_width"><input class="custom_chkbox disp_inl_bl marg_top send-attachment" id="conract-check-' + count + '" type="checkbox" checked/><label for="conract-check-' + count + '" class="chkbx_label">' + ScriptResourcesList['scriptSendAsAttachement'] + '</label></p>';
            html += '<i onclick="removeDivEmailContract(this)" class="fa fa-times-circle" aria-hidden="true"></i>';
            html += "<textarea rows='12' class='form-control' id='conract-item-" + count + "' ></textarea>";
            html += "</div>";
            $("#contractDiv").append(html);
            $("#conract-item-" + count).summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            var updatedTemp = removeElements(response.Content, "font");
            $("#conract-item-" + count).summernote('code', updatedTemp);
            if (_defaultFont != "") {
                $("#conract-item-" + count).summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important');
            }

        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function addContractInEmailBulk() {

    var id = $("#email-add-contract").val();
    if (id == "Contracts") {
        return false;
    }
    var name = $("#email-add-contract :selected").text();
    blockUI();
    $.ajax({
        url: '/Bulk/GetTemplateBulk?id=' + id,
        type: "GET",
        success: function (response) {
            unblockUI();
            var count = (parseInt($(".contract-item").length) + 1);
            var html = "";
            html += "<div class='contract-item'>"
            html += "<span class='file-name' style='display:none'>" + name + "</span>";
            html += ' <p class="chkbox_p blue_chkbx half_width"><input class="custom_chkbox disp_inl_bl marg_top send-attachment" id="conract-check-' + count + '" type="checkbox" /><label for="conract-check-' + count + '" class="chkbx_label">' + ScriptResourcesList['scriptSendAsAttachement'] + '</label></p>';
            html += '<i onclick="removeDivEmailContract(this)" class="fa fa-times-circle" aria-hidden="true"></i>';
            html += "<textarea rows='12' class='form-control' id='conract-item-" + count + "' ></textarea>";
            html += "</div>";
            $("#contractDiv").append(html);
            $("#conract-item-" + count).summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            var updatedTemp = removeElements(response.Content, "font");
            $("#conract-item-" + count).summernote('code', updatedTemp);
            if (_defaultFont != "") {
                $("#conract-item-" + count).summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important');
            }

        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function addLetterInEmailBulk() {
    var id = $("#email-add-letter").val();
    if (id == "Letters") {
        return false;
    }
    var name = $("#email-add-letter :selected").text();
    blockUI();
    $.ajax({
        url: '/Bulk/GetTemplateBulk?id=' + id,
        type: "GET",
        success: function (response) {
            unblockUI();
            var count = (parseInt($(".letter-item").length) + 1);
            var html = "";
            html += "<div class='letter-item'>"
            html += "<span class='file-name' style='display:none'>" + name + "</span>";
            html += ' <p class="chkbox_p blue_chkbx half_width"><input class="custom_chkbox disp_inl_bl marg_top send-attachment" id="letter-check-' + count + '" type="checkbox" /><label for="letter-check-' + count + '" class="chkbx_label">' + ScriptResourcesList['scriptSendAsAttachement'] + '</label></p>';
            html += '<i class="fa fa-times-circle" onclick="removeDivEmailLetter(this)" aria-hidden="true"></i>';
            html += "<textarea rows='12' class='form-control' id='letter-item-" + count + "' ></textarea>";
            html += "</div>";

            $("#letterDiv").append(html);
            $("#letter-item-" + count).summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            var updatedTemp = removeElements(response.Content, "font");
            $("#letter-item-" + count).summernote('code', updatedTemp);
            if (_defaultFont != "") {
                $("#letter-item-" + count).summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important');
            }
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);

        }

    });
}
function addLetterInEmailExternal() {
    var id = $("#email-add-letter").val();
    if (id == "Letters") {
        return false;
    }
    var name = $("#email-add-letter :selected").text();
    blockUI();
    $.ajax({
        url: '/Settings/GetTemplateClient?id=' + id + '&client=' + $("#hdn-imap-client").val(),
        type: "GET",
        success: function (response) {
            unblockUI();
            var count = (parseInt($(".letter-item").length) + 1);
            var html = "";
            html += "<div class='letter-item'>"
            html += "<span class='file-name' style='display:none'>" + name + "</span>";
            html += ' <p class="chkbox_p blue_chkbx half_width"><input class="custom_chkbox disp_inl_bl marg_top send-attachment" id="letter-check-' + count + '" type="checkbox" /><label for="letter-check-' + count + '" class="chkbx_label">' + ScriptResourcesList['scriptSendAsAttachement'] + '</label></p>';
            html += '<i class="fa fa-times-circle" onclick="removeDivEmailLetter(this)" aria-hidden="true"></i>';
            html += "<textarea rows='12' class='form-control' id='letter-item-" + count + "' ></textarea>";
            html += "</div>";

            $("#contractDiv").append(html);
            $("#letter-item-" + count).summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            var updatedTemp = removeElements(response.Content, "font");
            $("#letter-item-" + count).summernote('code', updatedTemp);
            if (_defaultFont != "") {
                $("#letter-item-" + count).summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important');
            }
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);

        }

    });
}
function addContractInEmailClient() {

    var id = $("#email-add-contract").val();
    if (id == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectAContract']);
    }
    var name = $("#email-add-contract :selected").text();
    blockUI();
    $.ajax({
        url: '/Settings/GetTemplateClient?id=' + id + '&client=' + $("#selected-client-id").val(),
        type: "GET",
        success: function (response) {
            unblockUI();
            if (response == "Binded") {
                return showWarningToast(ScriptResourcesList['scriptBindedAlert']);
            }
            var count = (parseInt($(".contract-item").length) + 1);
            var updatedTemp = removeElements(response.Content, "font");
            var html = "";
            html += "<div class='contract-item'>"
            html += "<span class='file-name' style='display:none'>" + name + "</span>";
            html += "<input type='hidden' class='contract-id' value='" + id + "' />";
            html += "<input type='hidden' class='contract-content' />";
            html += '<p class="chkbox_p blue_chkbx half_width" style="width:33% !important;"><input class="custom_chkbox disp_inl_bl marg_top send-attachment" id="conract-check-' + count + '" type="checkbox" checked/><label for="conract-check-' + count + '" class="chkbx_label">' + ScriptResourcesList['scriptSendAsAttachement'] + '</label></p>';
            html += "<button class='btn btn-xs btn-info undo-link hidden' onclick='undoContractLink(" + count + ",2," + id + ")'>" + ScriptResourcesList['scriptUndoContractLink'] + "</button>";
            if ($("#digital-signature-permission").val() == "True") {
                html += " <button class='btn btn-xs btn-info gen-link' onclick='generateContractLink(" + count + ",2," + id + ")'>" + ScriptResourcesList['scriptContractLink'] + "</button>";
            }
            html += " <button class='btn btn-xs btn-info' onclick='setTemplatePreview(" + count + ",2," + id + ")'>" + ScriptResourcesList['scriptPreviewAttachmentOnly'] + "</button>";
            html += '<a href="/Client/PreviewTemplate" id="contract-href-temp-' + count + '" target="_blank"></a>';
            html += '<i onclick="removeDivEmailContract(this)" class="fa fa-times-circle" aria-hidden="true"></i>';
            html += "<textarea rows='12' class='form-control' id='conract-item-" + count + "' ></textarea>";
            html += "</div>";
            $("#contractDiv").append(html);
            $("#conract-item-" + count).summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });

            $("#conract-item-" + count).summernote('code', updatedTemp);
            if (_defaultFont != "") {
                $("#conract-item-" + count).summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important');
            }
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function addLetterInEmailClientPDF() {

    var id = $("#email-add-letter-pdf").val();
    if (id == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectALetter']);
    }
    var name = $("#email-add-letter-pdf :selected").text();
    blockUI();
    $.ajax({
        url: '/Settings/GetTemplateClient?id=' + id + '&client=' + $("#selected-client-id").val(),
        type: "GET",
        success: function (response) {
            unblockUI();
            if (response == "Binded") {
                return showWarningToast(ScriptResourcesList['scriptBindedAlert']);
            }
            var count = (parseInt($(".contract-item").length) + 1);
            var updatedTemp = removeElements(response.Content, "font");
            var html = "";
            html += "<div class='contract-item'>"
            html += "<span class='file-name' style='display:none'>" + name + "</span>";
            html += "<input type='hidden' class='contract-id' value='" + id + "' />";
            html += "<input type='hidden' class='contract-content' />";
            html += '<p class="chkbox_p blue_chkbx half_width" style="width:33% !important;"><input class="custom_chkbox disp_inl_bl marg_top send-attachment" id="conract-check-' + count + '" type="checkbox" /><label for="conract-check-' + count + '" class="chkbx_label">' + ScriptResourcesList['scriptSendAsAttachement'] + '</label></p>';
            html += "<button class='btn btn-xs btn-info undo-link hidden' onclick='undoContractLink(" + count + ",2," + id + ")'>" + ScriptResourcesList['scriptUndoContractLink'] + "</button>";

            html += " <button class='btn btn-xs btn-info' onclick='setTemplatePreview(" + count + ",2," + id + ")'>" + ScriptResourcesList['scriptPreviewAttachmentOnly'] + "</button>";
            html += '<a href="/Client/PreviewTemplate" id="contract-href-temp-' + count + '" target="_blank"></a>';
            html += '<i onclick="removeDivEmailContractPDF(this)" class="fa fa-times-circle" aria-hidden="true"></i>';
            html += "<textarea rows='12' class='contract-item-pdf' id='conract-item-" + count + "' ></textarea>";
            html += "</div>";
            $("#contractDiv").append(html);
            $("#conract-item-" + count).summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });

            $("#conract-item-" + count).summernote('code', updatedTemp);
            if (_defaultFont != "") {
                $("#conract-item-" + count).summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important');
            }
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function addContractInEmailClientLink() {

    var id = $("#email-add-contract").val();
    if (id == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectAContract']);
    }
    var name = $("#email-add-contract :selected").text();
    var data = { id: $("#selected-client-id").val(), contract: id };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Settings/ContractLink',
        async: false,
        data: JSON.stringify(data),
        success: function (data) {
            unblockUI();
            $("#client-contract-modal .link").html(data);
            $("#client-contract-modal").modal("show");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addLetterInEmailClient() {
    var id = $("#email-add-letter").val();
    if (id == "Letters") {
        return false;
    }
    var name = $("#email-add-letter :selected").text();
    blockUI();
    $.ajax({
        url: '/Settings/GetTemplateClient?id=' + id + '&client=' + $("#selected-client-id").val(),
        type: "GET",
        success: function (response) {
            unblockUI();
            var count = (parseInt($(".letter-item").length) + 1);
            var updatedTemp = removeElements(response.Content, "font");
            var html = "";
            html += "<div class='letter-item'>"
            html += "<input type='hidden' class='contract-id' value='" + id + "' />";
            html += "<input type='hidden' class='contract-content' />";
            html += "<span class='file-name' style='display:none'>" + name + "</span>";
            html += ' <p class="chkbox_p blue_chkbx half_width" style="width:33% !important;"><input class="custom_chkbox disp_inl_bl marg_top send-attachment" id="letter-check-' + count + '" type="checkbox" /><label for="letter-check-' + count + '" class="chkbx_label">' + ScriptResourcesList['scriptSendAsAttachement'] + '</label></p>';


            html += " <button class='btn btn-xs btn-info' onclick='setTemplatePreview(" + count + ",1," + id + ")'>" + ScriptResourcesList['scriptPreviewAttachmentOnly'] + "</button>";
            html += '<a href="/Client/PreviewTemplate" id="letter-href-temp-' + count + '" target="_blank"></a>';
            html += '<i class="fa fa-times-circle" onclick="removeDivEmailLetter(this)" aria-hidden="true"></i>';
            html += "<textarea rows='12' class='form-control' id='letter-item-" + count + "' ></textarea>";
            html += "</div>";

            $("#contractDiv").append(html);
            $("#letter-item-" + count).summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });

            $("#letter-item-" + count).summernote('code', updatedTemp);
            if (_defaultFont != "") {
                $("#letter-item-" + count).summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important');
            }
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function addContractInEmail() {

    var id = $("#email-add-contract").val();
    if (id == "Contracts") {
        return false;
    }
    var name = $("#email-add-contract :selected").text();
    blockUI();
    $.ajax({
        url: '/Settings/GetTemplate?id=' + id,
        type: "GET",
        success: function (response) {
            unblockUI();
            var count = (parseInt($(".contract-item").length) + 1);
            var updatedTemp = removeElements(response.Content, "font");
            var html = "";
            html += "<div class='contract-item'>"
            html += "<input type='hidden' class='contract-id' value='" + id + "' />";
            html += "<input type='hidden' class='contract-content' />";
            html += "<span class='file-name' style='display:none'>" + name + "</span>";
            html += ' <p class="chkbox_p blue_chkbx half_width" style="width:33% !important;"><input class="custom_chkbox disp_inl_bl marg_top send-attachment" id="conract-check-' + count + '" type="checkbox" checked/><label for="conract-check-' + count + '" class="chkbx_label">' + ScriptResourcesList['scriptSendAsAttachement'] + '</label></p>';
            html += "<button class='btn btn-xs btn-info undo-link hidden' onclick='undoContractLink(" + count + ",2," + id + ")'>" + ScriptResourcesList['scriptUndoContractLink'] + "</button>";
            if ($("#digital-signature-permission").val() == "True") {
                html += " <button class='btn btn-xs btn-info' onclick='generateContractLink(" + count + ",2," + id + ")'>" + ScriptResourcesList['scriptContractLink'] + "</button>";
            }
            html += " <button class='btn btn-xs btn-info' onclick='setTemplatePreview(" + count + ",2," + id + ")'>" + ScriptResourcesList['scriptPreviewAttachmentOnly'] + "</button>";
            html += '<a href="/Client/PreviewTemplate" id="contract-href-temp-' + count + '" target="_blank"></a>';
            html += '<i onclick="removeDivEmailContract(this)" class="fa fa-times-circle" aria-hidden="true"></i>';
            html += "<textarea rows='12' class='form-control' id='conract-item-" + count + "' ></textarea>";
            html += "</div>";
            $("#contractDiv").append(html);
            $("#conract-item-" + count).summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            $("#conract-item-" + count).summernote('code', updatedTemp);
            if (_defaultFont != "") {
                $("#conract-item-" + count).summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important');
            }
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function addLetterInEmailP() {
    var id = $("#email-add-letter").val();
    if (id == "Letters") {
        return false;
    }
    var name = $("#email-add-letter :selected").text();
    blockUI();
    $.ajax({
        url: '/Settings/GetTemplate?id=' + id,
        type: "GET",
        success: function (response) {
            unblockUI();
            var count = (parseInt($(".letter-item").length) + 1);
            var updatedTemp = removeElements(response.Content, "font");
            var html = "";
            html += "<div class='letter-item'>"
            html += "<input type='hidden' class='contract-id' value='" + id + "' />";
            html += "<input type='hidden' class='contract-content' />";
            html += "<span class='file-name' style='display:none'>" + name + "</span>";
            html += ' <p class="chkbox_p blue_chkbx half_width" style="width:33% !important;"><input class="custom_chkbox disp_inl_bl marg_top send-attachment" id="letter-check-' + count + '" type="checkbox" /><label for="letter-check-' + count + '" class="chkbx_label">' + ScriptResourcesList['scriptSendAsAttachement'] + '</label></p>';

            html += " <button class='btn btn-xs btn-info' onclick='setTemplatePreview(" + count + ",1," + id + ")'>" + ScriptResourcesList['scriptPreviewAttachmentOnly'] + "</button>";
            html += '<a href="/Client/PreviewTemplate" id="letter-href-temp-' + count + '" target="_blank"></a>';
            html += '<i class="fa fa-times-circle" onclick="removeDivEmailLetterP(this)" aria-hidden="true"></i>';
            html += "<textarea rows='12' class='form-control' id='letter-item-" + count + "' ></textarea>";
            html += "</div>";

            $("#contractDiv").append(html);
            $("#letter-item-" + count).summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            $("#letter-item-" + count).summernote('code', updatedTemp);
            if (_defaultFont != "") {
                $("#letter-item-" + count).summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important');
            }
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function addLetterInEmail() {
    var id = $("#email-add-letter").val();
    if (id == "Letters") {
        return false;
    }
    var name = $("#email-add-letter :selected").text();
    blockUI();
    $.ajax({
        url: '/Settings/GetTemplate?id=' + id,
        type: "GET",
        success: function (response) {
            unblockUI();
            var count = (parseInt($(".letter-item").length) + 1);
            var updatedTemp = removeElements(response.Content, "font");
            var html = "";
            html += "<div class='letter-item'>"
            html += "<input type='hidden' class='contract-id' value='" + id + "' />";
            html += "<input type='hidden' class='contract-content' />";
            html += "<span class='file-name' style='display:none'>" + name + "</span>";
            html += ' <p class="chkbox_p blue_chkbx half_width" style="width:33% !important;"><input class="custom_chkbox disp_inl_bl marg_top send-attachment" id="letter-check-' + count + '" type="checkbox" /><label for="letter-check-' + count + '" class="chkbx_label">' + ScriptResourcesList['scriptSendAsAttachement'] + '</label></p>';

            html += " <button class='btn btn-xs btn-info' onclick='setTemplatePreview(" + count + ",1," + id + ")'>" + ScriptResourcesList['scriptPreviewAttachmentOnly'] + "</button>";
            html += '<a href="/Client/PreviewTemplate" id="letter-href-temp-' + count + '" target="_blank"></a>';
            html += '<i class="fa fa-times-circle" onclick="removeDivEmailLetter(this)" aria-hidden="true"></i>';
            html += "<textarea rows='12' class='form-control' id='letter-item-" + count + "' ></textarea>";
            html += "</div>";

            $("#contractDiv").append(html);
            $("#letter-item-" + count).summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            $("#letter-item-" + count).summernote('code', updatedTemp);
            if (_defaultFont != "") {
                $("#letter-item-" + count).summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important');
            }
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function emailWithoutImagePotentialEmail() {

    var formData = new FormData();
    formData.append("Comment", $("#email-comment").val());
    formData.append("Client", $("#hdn-imap-client").val());
    formData.append("Subject", $("#emailSubject").val());
    formData.append("CCT", $("#emailCCT").val());
    if ($("#emailCC").val() == null) {
        formData.append("CC", '');
    }
    else {
        formData.append("CC", $("#emailCC").val());
    }
    formData.append("TO", $("#emailTO").val());
    formData.append("BCC", $("#emailBCC").val());
    formData.append("bccMe", $("#bccMe").is(":checked"));
    var contCount = 0;
    formData.append("Contracts-Count", $(".contract-item").length);
    $(".contract-item").each(function () {
        formData.append("Contracts-ID-" + contCount, $(this).find(".contract-id").val());
        formData.append("Contracts-" + contCount, $(this).find("textarea").val());
        formData.append("Contracts-IsAttachment-" + contCount, $(this).find(".send-attachment").prop('checked'));
        formData.append("Contracts-Name-" + contCount, $(this).find(".file-name").html());
        contCount = contCount + 1;
    });

    var contLet = 0;
    formData.append("Letters-Count", $(".letter-item").length);
    $(".letter-item").each(function () {
        formData.append("Letters-ID-" + contLet, $(this).find(".contract-id").val());
        formData.append("Letters-" + contLet, $(this).find("textarea").val());
        formData.append("Letters-IsAttachment-" + contLet, $(this).find(".send-attachment").prop('checked'));
        formData.append("Letters-Name-" + contLet, $(this).find(".file-name").html());
        contLet = contLet + 1;
    });
    formData.append("Attachments-Count", $(".client-selected-doc").length);
    var attCount = 0;
    $(".client-selected-doc").each(function () {
        formData.append("Attachement-Name-" + attCount, $(this).find(".client-selected-doc-name").val());
        formData.append("Attachement-ID-" + attCount, $(this).find(".client-selected-doc-id").val());
        formData.append("Attachement-Url-" + attCount, $(this).find(".client-selected-doc-url").val());
        attCount = attCount + 1;
    });

    $.ajax({
        url: '/Email/SendEmailP',
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            unblockUI();
            if (response == "SE") {
                return showErrorToast(ScriptResourcesList['scriptStorageLimit']);
            }
            if (response == "NOEMAIL") {
                return showErrorToast(ScriptResourcesList['scriptNoClientEmail']);

            }
            getNewEmailIMAPMessageBoxP($("#hdn-imap-client").val());
            return showSuccessToast(ScriptResourcesList['scriptEmailedSuccessfully']);

        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function emailWithoutImageEmailBulk(ref) {
    var formData = new FormData();
    if ($("#email-comment").val()) {
        formData.append("Comment", $("#email-comment").val());
    }
    formData.append("IsRefral", ref);
    formData.append("Client", $("#hdn-imap-client").val());
    formData.append("Subject", $("#emailSubject").val());
    if ($("#emailCC").val() == null) {
        formData.append("CC", '');
    }
    else {
        formData.append("CC", $("#emailCC").val());
    }
    formData.append("CCT", $("#emailCCT").val());
    formData.append("BCC", $("#emailBCC").val());
    formData.append("TO", $("#emailTO").val());
    formData.append("bccMe", $("#bccMe").is(":checked"));

    formData.append("Email-Count", $(".client-selected-email-bulk").length);
    var emailCount = 0;
    $(".client-selected-email-bulk").each(function () {
        formData.append("Email-Name-" + emailCount, $(this).find(".client-selected-name").val());
        formData.append("Email-ID-" + emailCount, $(this).find(".client-selected-id").val());
        formData.append("Email-Email-" + emailCount, $(this).find(".client-selected-email").val());
        formData.append("Email-IsPotentail-" + emailCount, $(this).find(".client-ispotential").val());
        emailCount = emailCount + 1;
    });
    var contCount = 0;
    formData.append("Contracts-Count", $(".contract-item").length);
    $(".contract-item").each(function () {
        formData.append("Contracts-ID-" + contCount, $(this).find(".contract-id").val());
        formData.append("Contracts-" + contCount, $(this).find("textarea").val());
        formData.append("Contracts-IsAttachment-" + contCount, $(this).find(".send-attachment").prop('checked'));
        formData.append("Contracts-Name-" + contCount, $(this).find(".file-name").html());
        contCount = contCount + 1;
    });
    var contLet = 0;
    formData.append("Letters-Count", $(".letter-item").length);
    $(".letter-item").each(function () {
        formData.append("Letters-ID-" + contLet, $(this).find(".contract-id").val());
        formData.append("Letters-" + contLet, $(this).find("textarea").val());
        formData.append("Letters-IsAttachment-" + contLet, $(this).find(".send-attachment").prop('checked'));
        formData.append("Letters-Name-" + contLet, $(this).find(".file-name").html());
        contLet = contLet + 1;
    });
    formData.append("Attachments-Count", $(".client-selected-doc").length);
    var attCount = 0;
    $(".client-selected-doc").each(function () {
        formData.append("Attachement-Name-" + attCount, $(this).find(".client-selected-doc-name").val());
        formData.append("Attachement-ID-" + attCount, $(this).find(".client-selected-doc-id").val());
        formData.append("Attachement-Url-" + attCount, $(this).find(".client-selected-doc-url").val());
        attCount = attCount + 1;
    });
    $.ajax({
        url: '/Bulk/SendEmailBulk',
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            if (response == "NOIMAP") {
                return showWarningToast("No IMAP Configured");
            }
            return showSuccessToast(ScriptResourcesList['scriptEmailedSuccessfully']);
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function emailWithoutImageEmail() {
    var formData = new FormData();
    if ($("#email-comment").val()) {
        formData.append("Comment", $("#email-comment").val());
    }

    formData.append("Client", $("#hdn-imap-client").val());
    formData.append("Subject", $("#emailSubject").val());
    if ($("#emailCC").val() == null) {
        formData.append("CC", '');
    }
    else {
        formData.append("CC", $("#emailCC").val());
    }
    formData.append("CCT", $("#emailCCT").val());
    formData.append("BCC", $("#emailBCC").val());
    formData.append("TO", $("#emailTO").val());
    formData.append("bccMe", $("#bccMe").is(":checked"));
    var contCount = 0;
    formData.append("Contracts-Count", $(".contract-item").length);
    $(".contract-item").each(function () {
        formData.append("Contracts-ID-" + contCount, $(this).find(".contract-id").val());
        formData.append("Contracts-" + contCount, $(this).find("textarea").val());
        formData.append("Contracts-IsAttachment-" + contCount, $(this).find(".send-attachment").prop('checked'));
        formData.append("Contracts-Name-" + contCount, $(this).find(".file-name").html());
        contCount = contCount + 1;
    });

    var contLet = 0;
    formData.append("Letters-Count", $(".letter-item").length);
    $(".letter-item").each(function () {
        formData.append("Letters-ID-" + contLet, $(this).find(".contract-id").val());
        formData.append("Letters-" + contLet, $(this).find("textarea").val());
        formData.append("Letters-IsAttachment-" + contLet, $(this).find(".send-attachment").prop('checked'));
        formData.append("Letters-Name-" + contLet, $(this).find(".file-name").html());
        contLet = contLet + 1;
    });
    formData.append("Attachments-Count", $(".client-selected-doc").length);
    var attCount = 0;
    $(".client-selected-doc").each(function () {
        formData.append("Attachement-Name-" + attCount, $(this).find(".client-selected-doc-name").val());
        formData.append("Attachement-ID-" + attCount, $(this).find(".client-selected-doc-id").val());
        formData.append("Attachement-Url-" + attCount, $(this).find(".client-selected-doc-url").val());
        attCount = attCount + 1;
    });
    blockUI();
    $.ajax({
        url: '/Email/SendEmail',
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            unblockUI();
            if (response == "SE") {
                return showErrorToast(ScriptResourcesList['scriptStorageLimit']);
            }
            if (response == "NOEMAIL") {
                return showErrorToast(ScriptResourcesList['scriptNoClientEmail']);
            }
            if (response == "CCBCC") {
                return showErrorToast(ScriptResourcesList['scriptValidCCBCC']);

            }
            getNewEmailIMAPMessageBox($("#hdn-imap-client").val());
            return showSuccessToast(ScriptResourcesList['scriptEmailedSuccessfully']);
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function emailWithoutImage() {
    var formData = new FormData();
    if ($("#email-comment").val()) {
        formData.append("Comment", $("#email-comment").val());
    }
    formData.append("Draft", $("#hdnSaveDraft").val());
    formData.append("Client", $("#selected-client-id").val());
    formData.append("DraftSend", $("#hdnSaveDraftSend").val());
    formData.append("Subject", $("#emailSubject").val());
    formData.append("CCT", $("#emailCCT").val());
    if ($("#emailCC").val() == null) {
        formData.append("CC", '');
    }
    else {
        formData.append("CC", $("#emailCC").val());
    }
    formData.append("BCC", $("#emailBCC").val());
    formData.append("TO", $("#emailTO").val());
    formData.append("bccMe", $("#bccMe").is(":checked"));
    var contCount = 0;
    formData.append("Contracts-Count", $(".contract-item").length);
    $(".contract-item").each(function () {
        formData.append("Contracts-ID-" + contCount, $(this).find(".contract-id").val());
        formData.append("Contracts-" + contCount, $(this).find("textarea").val());
        formData.append("Contracts-IsAttachment-" + contCount, $(this).find(".send-attachment").prop('checked'));
        formData.append("Contracts-Name-" + contCount, $(this).find(".file-name").html());
        contCount = contCount + 1;
    });

    var contLet = 0;
    formData.append("Letters-Count", $(".letter-item").length);
    $(".letter-item").each(function () {
        formData.append("Letters-ID-" + contLet, $(this).find(".contract-id").val());
        formData.append("Letters-" + contLet, $(this).find("textarea").val());
        formData.append("Letters-IsAttachment-" + contLet, $(this).find(".send-attachment").prop('checked'));
        formData.append("Letters-Name-" + contLet, $(this).find(".file-name").html());
        contLet = contLet + 1;
    });
    formData.append("Attachments-Count", $(".client-selected-doc").length);
    var attCount = 0;
    $(".client-selected-doc").each(function () {
        formData.append("Attachement-Name-" + attCount, $(this).find(".client-selected-doc-name").val());
        formData.append("Attachement-ID-" + attCount, $(this).find(".client-selected-doc-id").val());
        formData.append("Attachement-Url-" + attCount, $(this).find(".client-selected-doc-url").val());
        attCount = attCount + 1;
    });

    blockUI();
    $.ajax({
        url: '/Client/ClientEmail',
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            unblockUI();
            if (response == "SE") {
                return showErrorToast(ScriptResourcesList['scriptStorageLimit']);
            }
            if (response == "NOEMAIL") {
                return showErrorToast(ScriptResourcesList['scriptNoClientEmail']);
            }
            if (response == "CCBCC") {
                return showErrorToast(ScriptResourcesList['scriptValidCCBCC']);
            }

            getSendEmail();
            $('body').removeClass('modal-open');
            if (response == "DRAFT") {
                return showSuccessToast(ScriptResourcesList['scriptMailSavedAsDraft']);
            }
            return showSuccessToast(ScriptResourcesList['scriptEmailedSuccessfully']);
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function emailWithoutImagePotential() {

    var formData = new FormData();
    formData.append("Comment", $("#email-comment").val());
    formData.append("Client", $("#hdn-p-client").val());
    formData.append("Subject", $("#emailSubject").val());
    formData.append("CCT", $("#emailCCT").val());
    if ($("#emailCC").val() == null) {
        formData.append("CC", '');
    }
    else {
        formData.append("CC", $("#emailCC").val());
    }
    formData.append("TO", $("#emailTO").val());
    formData.append("BCC", $("#emailBCC").val());
    formData.append("bccMe", $("#bccMe").is(":checked"));
    var contCount = 0;
    formData.append("Contracts-Count", $(".contract-item").length);
    $(".contract-item").each(function () {
        formData.append("Contracts-ID-" + contCount, $(this).find(".contract-id").val());
        formData.append("Contracts-" + contCount, $(this).find("textarea").val());
        formData.append("Contracts-IsAttachment-" + contCount, $(this).find(".send-attachment").prop('checked'));
        formData.append("Contracts-Name-" + contCount, $(this).find(".file-name").html());
        contCount = contCount + 1;
    });

    var contLet = 0;
    formData.append("Letters-Count", $(".letter-item").length);
    $(".letter-item").each(function () {
        formData.append("Letters-ID-" + contLet, $(this).find(".contract-id").val());
        formData.append("Letters-" + contLet, $(this).find("textarea").val());
        formData.append("Letters-IsAttachment-" + contLet, $(this).find(".send-attachment").prop('checked'));
        formData.append("Letters-Name-" + contLet, $(this).find(".file-name").html());
        contLet = contLet + 1;
    });
    formData.append("Attachments-Count", $(".client-selected-doc").length);
    var attCount = 0;
    $(".client-selected-doc").each(function () {
        formData.append("Attachement-Name-" + attCount, $(this).find(".client-selected-doc-name").val());
        formData.append("Attachement-ID-" + attCount, $(this).find(".client-selected-doc-id").val());
        formData.append("Attachement-Url-" + attCount, $(this).find(".client-selected-doc-url").val());
        attCount = attCount + 1;
    });
    blockUI();
    $.ajax({
        url: '/Client/PotentialClientEmail',
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            unblockUI();
            if (response == "SE") {
                return showErrorToast(ScriptResourcesList['scriptStorageLimit']);
            }
            if (response == "NOEMAIL") {
                return showErrorToast(ScriptResourcesList['scriptNoClientEmail']);
            }
            $('body').removeClass('modal-open');
            showCreateEmail($("#hdn-p-client").val());
            return showSuccessToast(ScriptResourcesList['scriptEmailedSuccessfully']);
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function printEmailOnceP(ref) {
    var div = $(ref).parent().parent().parent();
    var html = "<div style='width:100%;float:left;margin:5px;text-align:center'><h3>" + ScriptResourcesList['scriptEmailForClient'] + " " + $("#selected-client-name").html() + "</h3></div>";
    html += "<div>";
    html += "<div style='width:100%;float:left;margin:5px;text-align:center'>" + $(this).parent().parent().find(".mail_body").html() + "</div>";
    html += "<div style='width:100%;float:left;margin:2px;'>" + $(this).parent().parent().find(".content_divmail_foter").html() + "</div>";
    html += "</div>";
    Popup(html);
}
function exportClientSummary() {
    var user = 0;
    if ($("#ddl-user-cs").val()) {
        if ($("#ddl-user-cs").val() != "") {
            user = $("#ddl-user-cs").val();
        }
    }

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/DashboardCSV?us=' + user + '&cont=' + $("#ddl-country-cs").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#preview-href-summary")[0].click();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function printClientSummary() {

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/DashboardPrint',
        async: true,
        success: function (data) {
            var pageTitle = 'Client Summary',
                win = window.open('', 'Print', 'width=500,height=300');
            win.document.write('<html><head><title>Client Summary</title>' +
                '</head><body>' + data + '</body></html>');
            win.document.close();
            win.print();
            win.close();
            return false;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function printEmailAllP() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetEmailMessagesP?id=' + $("#hdn-p-client").val(),
        async: true,
        success: function (data) {
            unblockUI();
            var html = "<div style='width:100%;float:left;margin:5px;text-align:center'><h3>" + ScriptResourcesList['scriptEmailForClient'] + " " + $("#selected-client-name").html() + "</h3></div>";
            html += data;
            Popup(html);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function deletePEmail(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        $.ajax({
            url: '/Client/DeletePotentialEmail?id=' + id,
            type: "GET",
            success: function (response) {
                unblockUI();
                $(ref).parent().parent().remove();
                return showSuccessToast(ScriptResourcesList['scriptDeleted']);


            },
            error: function (er) {
                unblockUI();
                return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
            }

        });
    }
}
function removeDivEmailContractPDF(ref) {
    if ($(".contract-item-pdf").length == 1 && $("#pdf-email-message").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptSingleEditor']);
    }
    $(ref).parent().remove();
}
function removeDivEmailContract(ref) {
    if ($(".contract-item").length == 1 && $(".letter-item").length == 0 && $(".main-editor").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptSingleEditor']);

    }
    $(ref).parent().remove();
}
function removeDivEmailLetter(ref) {
    if ($(".contract-item").length == 0 && $(".letter-item").length == 1 && $(".main-editor").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptSingleEditor']);
    }
    $(ref).parent().remove();
}
function removeDivEmailLetterP(ref) {
    $(ref).parent().remove();
}
function removeDivEmailMain(ref) {
    if ($(".contract-item").length == 0 && $(".letter-item").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptSingleEditor']);
    }
    $(ref).parent().remove();
}
function removeDivEmailMainPDF(ref) {
    if ($(".contract-item-pdf").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptSingleEditor']);
    }
    $(ref).parent().remove();
}
function getSelectedDocsPDF(id, name) {
    var html = "";
    $("#getClientDocs .select-doc:checked").each(function () {
        var id = $(this).parent().find(".file-id").val();
        var name = $(this).parent().find(".file-name").val();
        var url = $(this).parent().find(".file-url").val();
        html += '<div class="hide_btn client-selected-doc"><input type="hidden" value="' + name + '" class="client-selected-doc-name" /><input type="hidden" value="' + url + '" class="client-selected-doc-url" /><input type="hidden" value="' + id + '" class="client-selected-doc-id" /><i onclick="removeDivEmailAtt(this)" class="fa fa-times" aria-hidden="true"></i>' + name + '</div>';
    });
    html += "<div style='clear:both;'></div>";
    $("#selectedClientDocs").append(html);
    $("#getClientDocs").html("");

}
function getSelectedDocs(id, name) {
    var html = "";
    $("#client-doc-modal .select-doc:checked").each(function () {
        var id = $(this).parent().find(".file-id").val();
        var name = $(this).parent().find(".file-name").val();
        var url = $(this).parent().find(".file-url").val();
        html += '<div class="hide_btn client-selected-doc"><input type="hidden" value="' + name + '" class="client-selected-doc-name" /><input type="hidden" value="' + url + '" class="client-selected-doc-url" /><input type="hidden" value="' + id + '" class="client-selected-doc-id" /><i onclick="removeDivEmailAtt(this)" class="fa fa-times" aria-hidden="true"></i>' + name + '</div>';
    });
    html += "<div style='clear:both;'></div>";
    $("#selectedClientDocs").append(html);
    $("#client-doc-modal").modal('hide');
    $('body').removeClass('modal-open');

}
function getSelectedClientBulkEmail() {

    var total = $("#visa-officer-modal .officer-email:checked").length;
    var i = 0;
    var html = "";
    $("#visa-officer-modal .client-email:checked").each(function () {
        var id = $(this).parent().parent().find(".hdn-client-id").val();
        var name = $(this).parent().parent().find(".hdn-client-name").val();
        var email = $(this).parent().parent().find(".hdn-client-email").val();
        html += '<div class="hide_btn client-selected-email-bulk" style="float:left;"><input type="hidden" value="' + email + '" class="client-selected-email" /><input type="hidden" value="' + name + '" class="client-selected-name" /><input type="hidden" value="' + id + '" class="client-selected-id" /><input type="hidden" value="false" class="client-ispotential" /><i onclick="removeDivEmailBulk(this)" class="fa fa-times" aria-hidden="true"></i>' + name + ' (' + email + ' ) </div>';
    });
    $("#visa-officer-modal .potential-email:checked").each(function () {
        var id = $(this).parent().parent().find(".hdn-client-id").val();
        var name = $(this).parent().parent().find(".hdn-client-name").val();
        var email = $(this).parent().parent().find(".hdn-client-email").val();
        html += '<div class="hide_btn client-selected-email-bulk" style="float:left;"><input type="hidden" value="' + email + '" class="client-selected-email" /><input type="hidden" value="' + name + '" class="client-selected-name" /><input type="hidden" value="' + id + '" class="client-selected-id" /><input type="hidden" value="true" class="client-ispotential" /><i onclick="removeDivEmailBulk(this)" class="fa fa-times" aria-hidden="true"></i>' + name + ' (' + email + ' ) </div>';
    });
    html += "<div style='clear:both;'></div>";
    $("#selectedClientEmail").html(html);
    $("#visa-officer-modal").modal('hide');
    $('body').removeClass('modal-open');

}
function getSelectedOfficerEmail() {

    var emails = "";
    var total = $("#visa-officer-modal .officer-email:checked").length;
    var i = 0;
    $("#visa-officer-modal .officer-email:checked").each(function () {
        i++;
        emails += $.trim($(this).parent().parent().parent().find(".officer-email-address").html());
        if (i != total && total != 1) {
            emails += ",";
        }
    });
    if (emails != "") {
        var prevEmail = $("#emailTO").val();
        if (prevEmail != "") {
            prevEmail += ",";
        }
        prevEmail += emails;
        $("#emailTO").val(prevEmail);
    }
    $("#visa-officer-modal").modal('hide');
    $('body').removeClass('modal-open');
}
function printEmailOnce(ref) {
    var div = $(ref).parent().parent().html();
    var html = "<div style='width:100%;float:left;margin:5px;text-align:center'><h3>" + ScriptResourcesList['scriptEmailForClient'] + " " + $("#selected-client-name").html() + "</h3></div>";
    html += "<div>";
    html += "<div style='width:100%;float:left;margin:5px'>" + div + "</div>";
    html += "</div>";
    Popup(html);
}
function printEmailAll() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetEmailMessages?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            unblockUI();
            var html = "<div style='width:100%;float:left;margin:5px;text-align:center'><h3>" + ScriptResourcesList['scriptEmailForClient'] + " " + $("#selected-client-name").html() + "</h3></div>";
            html += data;
            Popup(html);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function moveToDocs(name, url, id, size) {
    blockUI();
    var obj = new Object();
    obj.Client = id;
    obj.Name = name;
    obj.Url = url;
    obj.Size = size;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/MoveToDocs',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            return showWarningToast(ScriptResourcesList['scriptDocumentsMoved']);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function moveToDocsPotential(name, url, id, size) {
    blockUI();
    var obj = new Object();
    obj.Client = id;
    obj.Name = name;
    obj.Url = url;
    obj.Size = size;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/MoveToDocsPotential',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            return showSuccessToast(ScriptResourcesList['scriptDocumentsMoved']);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function deleteEmail(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        $.ajax({
            url: '/Client/DeleteEmail?id=' + id,
            type: "GET",
            success: function (response) {
                unblockUI();
                $(ref).parent().parent().remove();
                return showSuccessToast(ScriptResourcesList['scriptDeleted']);
            },
            error: function (er) {
                unblockUI();
                return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
            }

        });

    }
}
function getImportantEmails() {
    blockUI();

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetImportantEmails?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            unblockUI();

            $("#visa-officer-modal .modal-body").html("");
            $("#visa-officer-modal .modal-body").html(data);
            $('#visa-officer-modal').modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function getClientDocsForSlection() {
    blockUI();

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetClientDocsForSelection?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            unblockUI();

            $("#client-doc-modal .modal-body").html("");
            $("#client-doc-modal .modal-body").html(data);
            $('#client-doc-modal').modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function getClientDocsForSlectionPotential() {
    blockUI();

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetClientDocsForSelectionP?id=' + $("#hdn-p-client").val(),
        async: false,
        success: function (data) {
            unblockUI();

            $("#client-doc-modal .modal-body").html("");
            $("#client-doc-modal .modal-body").html(data);
            $('#client-doc-modal').modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function moveClientImageToDocs(id) {
    blockUI();

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/MoveImageToDocs',
        async: false,
        data: JSON.stringify({ id: id }),
        success: function (data) {
            unblockUI();
            if (data == true) {
                return showSuccessToast(ScriptResourcesList['scriptImageMovedToClient']);
            }
            else {
                return showErrorToast(ScriptResourcesList['scriptImageNotFound']);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function closeModalTaskDetail() {
    $('#client-task-modal').modal('hide');
    $('body').removeClass('modal-open');
}
function getClientFileNotesDashboardNew(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientFileNotesSummary?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-task-modal-body").html("");
            $("#client-task-modal-body").html(data);
            $('#client-task-modal').modal('show');
            $('#client-task-modal').css('z-index', 1100);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function getEmploeyrFileNotesDashboardNew(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/EmployerManagement/FileNotesSummary?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-task-modal-body").html("");
            $("#client-task-modal-body").html(data);
            $('#client-task-modal').modal('show');
            $('#client-task-modal').css('z-index', 1100);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function getClientRemindersDashboardNew(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientReminderSummary?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-task-modal-body").html("");
            $("#client-task-modal-body").html(data);
            $('#client-task-modal').modal('show');
            $('#client-task-modal').css('z-index', 1100);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getEmployerJobsDashboardNew(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/EmployerManagement/JobsSummary?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-task-modal-body").html("");
            $("#client-task-modal-body").html(data);
            $('#client-task-modal').modal('show');
            $('#client-task-modal').css('z-index', 1100);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function getClientTasksDashboardNew(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientTasksSummary?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-task-modal-body").html("");
            $("#client-task-modal-body").html(data);
            $('#client-task-modal').modal('show');
            $('#client-task-modal').css('z-index', 1100);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function getClientActivityDashboardNew(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Activity/ClientLog?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-task-modal-body").html("");
            $("#client-task-modal-body").html(data);
            $('#client-task-modal').modal('show');
            $('#client-task-modal').css('z-index', 1100);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function getClientTasksDashboard(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientTasksPartial?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-task-modal-body").html("");
            $("#client-task-modal-body").html(data);
            $('#client-task-modal').modal('show');
            $('#client-task-modal').css('z-index', 1100);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function getClientTasksDashboardPotential(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientTasksPartialP?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-task-modal-body").html("");
            $("#client-task-modal-body").html(data);
            $('#client-task-modal').modal('show');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function undoSelected(ref) {
    $(ref).prevAll("input").first().val("");
}


function deleteOutgoingPayment(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/DeleteOutgoingPayment',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().remove();
                    getOutgoingPayments($("#selected-client-id").val());
                }
                unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
}
function addOutgoingPayment() {
    if ($("#pay-d-ammt-out").val() != "") {
        return updateOutgoingPayment();
    }

    $("#add-outgoing-payment .errorSpanModal").html("");
    $("#errorSpanModalDate").html("");
    var amount = $("#paymentAmountOut").val();
    var date = $("#paymentDateOut").val();
    var desc = $("#paymentDescOut").val();


    if (amount == "") {
        $("#paymentAmountOut").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterAmount']);
        $("#paymentAmountOut").next(".errorSpanModal").show();
        return false;
    }
    if (date == "") {
        $("#errorSpanModalDate").html(ScriptResourcesList['scriptPleaseEnterDate']);
        $("#errorSpanModalDate").show();
        return false;
    }

    blockUI();
    var obj = new Object();
    obj.ID = $("#pay-d-ammt-out").val();
    obj.Name = name;
    obj.FKSourceID = $("#paymentSource").val();
    obj.Amount = amount;
    obj.Description = desc;
    obj.Date = date;
    obj.FKAgentID = $("#paymentAgent").val();
    obj.FKClientID = $("#FkClientIDS").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/AddOutgoingPayment',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            $('#add-outgoing-payment').modal('hide');
            $('body').removeClass('modal-open');
            $('#add-outgoing-payment input').val("");
            $('#add-outgoing-payment select').val("");
            //$(".modal-backdrop").hide();
            getOutgoingPayments($("#FkClientIDS").val());


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function updateOutgoingPaymentGet(id, date, source, amount, desc) {
    $("#add-outgoing-payment .errorSpanModal").html("");
    $("#pay-d-ammt-out").val(id);
    $("#paymentAmountOut").val(amount);
    $("#paymentDateOut").val(date);
    $("#paymentSource").val(source);
    $("#paymentDescOut").val(desc);
    $('#add-outgoing-payment').modal('show');
}
function updateOutgoingPayment() {
    $("#add-outgoing-payment .errorSpanModal").html("");
    var amount = $("#paymentAmountOut").val();
    var date = $("#paymentDateOut").val();
    var desc = $("#paymentDescOut").val();


    if (amount == "") {
        $("#paymentAmountOut").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterAmount']);
        return false;
    }
    if (date == "") {
        $("#paymentDateOut").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterDate']);
        return false;
    }


    var obj = new Object();
    obj.ID = $("#pay-d-ammt-out").val();
    obj.Name = name;
    obj.FKSourceID = $("#paymentSource").val();
    obj.Amount = amount;
    obj.Description = desc;
    obj.Date = date;
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/UpdateOutgoingPayment',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
            $('#add-outgoing-payment').modal('hide');
            $('body').removeClass('modal-open');
            getOutgoingPayments($("#FkClientIDS").val());
            //$(".modal-backdrop").hide();


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function updateComission(id, ref) {
    if ($(ref).parent().parent().find('.agent-comission').val() == "") {
        return showErrorToast(ScriptResourcesList['scriptPleaseEnterCommissionGreater']);
    }
    var obj = new Object();
    obj.FKAgentID = $("#hdn-agent-id").val();
    obj.FKClientID = id;
    obj.Commision = $(ref).parent().parent().find('.agent-comission').val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Management/AddAgentComission',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptUpdated']);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}


function getAgentClientDetails(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Management/AgentClient?id=' + id,
        async: false,
        success: function (data) {
            unblockUI();
            $("#clientp-content").html(data);
            $("#Notes").summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            if (_defaultFont != "") {
                $('#Notes').summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function acceptClientFromAgent(id) {
    var data = { Id: id };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Management/AcceptClient',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            if (data == true) {
                showSuccessToast(ScriptResourcesList['scriptClientAccepted']);
                getAgentsSummary();
            }
            else {

                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);

            }



        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function openAddAgentComission(id, client, agent, amount, date, page) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientOutgoingAdd?id=' + client,
        async: false,
        success: function (data) {
            unblockUI();
            $("#add-outgoing-payment-uni .modal-body").html(data);
            $("#paymentAmountOut-u").val(amount);
            $("#hdn-amount").val(amount);
            $("#paymentAgent-u").val(agent);
            $("#paymentAgent-u").prop("disabled", true);
            $("#paymentDateOut-u").val(date);
            $("#hdn-reminder-agent-u").val(id);
            $("#hdn-page-agent-u").val(page);
            $("#hdn-agent-FKClientID").val(client);
            $("#paymentDateOut-u").datepicker({
                dateFormat: 'dd/mm/yy',
                showOn: "button",
                buttonImage: "/Content/Images/calendar.png",
                buttonImageOnly: true,
                defaultDate: new Date(),
                buttonText: "Select date",
                changeMonth: true,
                changeYear: true,
                yearRange: "0:+10",
                dateFormat: 'dd/mm/yy'
            });
            $("#add-outgoing-payment-uni").modal("show");
            $("#add-outgoing-payment-uni").css("z-index", 10000);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addOutgoingPaymentUni(id) {
    $("#add-outgoing-payment-uni .errorSpanModal").html("");
    var amount = $("#paymentAmountOut-u").val();
    var date = $("#paymentDateOut-u").val();

    if (amount == "") {
        $("#paymentAmountOut-u").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterAmount']);
        $("#paymentAmountOut-u").next(".errorSpanModal").show();
        return false;
    }
    if (date == "") {
        $("#errorSpanModalDate-u").html("Please enter date");
        $("#errorSpanModalDate-u").show();
        return false;
    }
    if (parseFloat(amount) < 0) {
        $("#paymentAmountOut-u").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterAmountGreater']);
        $("#paymentAmountOut-u").next(".errorSpanModal").show();
        return false;
    }
    if (parseFloat(amount) > parseFloat($("#hdn-amount").val())) {
        $("#paymentAmountOut-u").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterAmountLess'] + " (" + $("#hdn-amount").val() + ")");
        $("#paymentAmountOut-u").next(".errorSpanModal").show();
        return false;
    }
    if (confirm(ScriptResourcesList['scriptConfirmationPayNow'])) {

        var model = new Object();
        model.Amount = $("#paymentAmountOut-u").val();
        model.FKSourceID = $("#paymentSource-u").val();
        model.FKAgentID = $("#paymentAgent-u").val();
        model.Description = $("#paymentDescOut-u").val();
        model.Date = $("#paymentDateOut-u").val();
        model.ReminderID = $("#hdn-reminder-agent-u").val();
        model.FromD = false;
        var page = $("#hdn-page-agent-u").val();
        if (page == "1") {
            model.FromD = true;
        }

        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/PayAgentNew',
            data: JSON.stringify(model),
            async: true,
            success: function (data) {
                unblockUI();

                if (data == false) {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }
                else {
                    $("#paymentAgent-u").prop("disabled", false);
                    $("#add-outgoing-payment-uni .info_input,.dropdwn").val("");
                    $("#add-outgoing-payment-uni .info-input").modal("hide");
                    $("#add-outgoing-payment-uni").modal("hide");
                    showSuccessToast(ScriptResourcesList['scriptPaid']);
                    if (page == "1") {
                        $("#reminder-Payment-Panel").html(data);
                    }
                    else if (page == "3") {
                        $("#com-" + $("#hdn-agent-FKClientID").val()).click();
                    }
                    else {
                        getpaymentPlan($("#hdn-agent-FKClientID").val());
                    }

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }

}
function payAgentDashboard(id) {
    var data = { Id: id };
    if (confirm(ScriptResourcesList['scriptConfirmationPayNow'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/PayAgent',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == false) {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }
                else {
                    $("#reminder-Payment-Panel").html(data);
                    return showSuccessToast(ScriptResourcesList['scriptPaid']);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }

}
function payAgent(id, ref) {
    var data = { Id: id };
    if (confirm(ScriptResourcesList['scriptConfirmationPayNow'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Management/PayAgent',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == true) {

                    showSuccessToast(ScriptResourcesList['scriptPaid']);
                    $(ref).parent().html('<label class="label label-success">' + ScriptResourcesList['scriptPaid'] + '</label>');
                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }

}
function editAgentGet(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Management/GetAgent?id=' + id,
        async: false,
        success: function (data) {
            unblockUI();
            $("#management-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function changeDocTypeBulk(p) {
    var docs = [];
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocument']);
    }
    $(".select-doc:checked").each(function () {
        docs.push($(this).parent().find(".doc-id").val());
    });
    var data = { ID: $("#file-folder-bulk").val(), DOC: docs, p: p };
    if (confirm(ScriptResourcesList['scriptConfirmChangeDoc'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/ChangeDocTypeMulti',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == true) {
                    showSuccessToast(ScriptResourcesList['scriptUpdated']);
                    $(".select-doc").prop("checked", false);
                    $("#selectAllCheck").prop("checked", false);
                    $('#bulk-type-modal').modal('hide');
                    $('body').removeClass('modal-open');
                    if (p) {
                        $("#pDocs").click();
                    }
                    else {
                        getClientDocs();
                    }


                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }

}
function changeDocType(ref, p) {
    var doc = $(ref).parent().parent().find(".doc-id").val();
    var data = { ID: $(ref).val(), DOC: doc, p: p };
    if (confirm(ScriptResourcesList['scriptConfirmChangeDoc'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/ChangeDocType',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == true) {
                    showSuccessToast(ScriptResourcesList['scriptUpdated']);
                    if (!p) {
                        getClientDocs();
                    }
                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }

}

function editPotentialClient(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/PotentialClientDetail?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            $("#Client_Notes").summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            if (_defaultFont != "") {
                $('#Client_Notes').summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
            }
            bindHidePanel();
            return window.scrollTo(0, 0);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}

function deletePotentialClient(ref, id) {
    if (confirm(ScriptResourcesList['scriptConfirmRemovePClient'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/DeletePotentialClient',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().remove();
                }
                var count = $("#walkin-count").html();
                var result = parseInt(count) - 1;
                $("#walkin-count").html(result);
                unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
}
function addToClient(id) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/AddPotentialClientToClient',
        data: JSON.stringify({ id: id }),

        async: true,
        success: function (data) {
            if (data) {
                $("#content-area").html("");

                $("#content-area").html(data);
            }
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}

function generateInvoiceModalSchool(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Addmission/AddInvoicePopup',
        async: true,
        success: function (data) {
            unblockUI();
            $("#invoice-new-modal-school .modal-body").html("");
            $("#invoice-new-modal-school .modal-body").html(data);
            $("#FkClientID-Sup").val($(ref).parent().find(".rem-client").val());
            $("#item_0__Description").val($(ref).parent().find(".rem-desc").val());
            $("#item_0__Amount").val($(ref).parent().find(".rem-amt").val());
            $("#invoice_FKSchoolID").val($(ref).parent().find(".rem-sch").val());
            $("#reminderId").val($(ref).parent().find(".rem-id").val());
            calculate();
            $("#invoice-new-modal-school").modal("show");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function generateInvoiceModalSchoolNew(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Addmission/AddInvoicePopupNew?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#invoice-new-modal-school .modal-body").html("");
            $("#invoice-new-modal-school .modal-body").html(data);

            $("#invoice-new-modal-school").modal("show");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showNextSplashImage(id) {
    if (id === 7) {
        return updateSplash();
    }
    else {
        $(".container-splash").hide();
        $("#image-" + id).show();
    }
}
function acceptAgreement() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Home/UpdateAgreement',
        async: true,
        success: function (data) {
            $('#agreement-modal').modal("hide");
            $('body').removeClass('modal-open');
            return true;

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function updateSplash() {

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Home/UpdateSplash',
        async: true,
        success: function (data) {
            if (data) {
                $('#splash-images').modal("hide");
                $('body').removeClass('modal-open');
                return true;
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function openTermsConditions() {
    $('#termsModal').modal('show');
}

function undoCompleteTaskClient(id) {
    if (confirm(ScriptResourcesList['scriptConfirmReactivateTask'])) {
        var data = { task: id };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/UndoComplete',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                var tasksss = parseInt($("#tasks-count-client").html());
                $("#tasks-count-client").html((tasksss + 1));
                getClientTask();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });

    }

}
function undoCompleteTaskPotential(id) {
    if (confirm(ScriptResourcesList['scriptConfirmReactivateTask'])) {
        var data = { task: id };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/UndoComplete',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                showPTasks($("#pClientID").val());
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });

    }

}
function completeTaskSummary(id, client) {
    var data = { task: id };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/CompleteTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast("Failed !")
            }
            showSuccessToast(ScriptResourcesList['scriptTaskCompleted']);
            blockUI();
            $.ajax({
                type: "GET",
                contentType: "html",
                url: '/Client/ClientTasksSummary?id=' + client,
                async: true,
                success: function (data) {
                    unblockUI();
                    $("#client-task-modal-body").html("");
                    $("#client-task-modal-body").html(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    unblockUI();
                    handleErrors(textStatus);
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });
}
function undoCompleteTaskSummary(id, client) {
    if (confirm(ScriptResourcesList['scriptConfirmReactivateTask'])) {
        var data = { task: id };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/UndoComplete',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == false) {
                    return showErrorToast("Failed !")
                }
                blockUI();
                $.ajax({
                    type: "GET",
                    contentType: "html",
                    url: '/Client/ClientTasksSummary?id=' + client,
                    async: true,
                    success: function (data) {
                        unblockUI();
                        $("#client-task-modal-body").html("");
                        $("#client-task-modal-body").html(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        unblockUI();
                        handleErrors(textStatus);
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });

    }
}
function undoCompleteTask(ref, task) {
    if (confirm(ScriptResourcesList['scriptConfirmReactivateTask'])) {
        var data = { task: task };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/UndoComplete',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == false) {
                    return showErrorToast("Failed !")
                }
                $(ref).parent().parent().parent().remove();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });

    }


}
function undoCompleteTaskUser(ref, task) {
    if (confirm(ScriptResourcesList['scriptConfirmReactivateTask'])) {
        var data = { task: task };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/UndoComplete',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == false) {
                    return showErrorToast("Failed !");
                }
                $("#empListForTasks .user-selected").click();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });

    }


}
function printClientActivity(id) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Activity/ClientLogJson',
        data: JSON.stringify({ id: id }),
        async: true,
        success: function (data) {
            unblockUI();
            var html = "";
            if (data.length > 0) {
                html += "<div style='width:100%;float:left;margin:5px;text-align:center'><h3>" + ScriptResourcesList['scriptClientActivityLog'] + "</h3></div>";
                html += "<div style='width:100%;float:left;margin:5px;text-align:center'>" + $("#selected-client-name").html() + "</div>";
                for (var i = 0; i < data.length; i++) {

                    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>" + ScriptResourcesList['scriptType'] + ":  " + data[i].LogType + " Date : " + data[i].CreatedDateStr + "</div>";
                    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>" + data[i].ClientLogNote + "</div>";
                    html += "<hr>";
                }
            }
            if (html != "") {
                Popup(html);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function showClientOutgoingReport() {
    if ($("#date-from-op").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateFrom']);
    }
    if ($("#date-to-op").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateTo']);

    }
    blockUI();
    var data = { id: $("#selected-client-id").val(), from: $("#date-from-op").val(), to: $("#date-to-op").val() };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/ClientOutgoing',
        data: JSON.stringify(data),
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
function showClientAccountFlowReport() {
    if ($("#date-from-af").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateFrom']);

    }
    if ($("#date-to-af").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateTo']);

    }
    blockUI();
    var data = { id: $("#selected-client-id").val(), from: $("#date-from-af").val(), to: $("#date-to-af").val() };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/ClientAccountsFlow',
        data: JSON.stringify(data),
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
function showClientInvoicesReport() {
    if ($("#date-from-af").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateFrom']);

    }
    if ($("#date-to-af").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateTo']);

    }
    blockUI();
    var data = { from: $("#date-from-af").val(), to: $("#date-to-af").val(), type: $("#ddl-client-type").val() };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/ClientInvoices',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $("#invoices-content").html("");
            $("#invoices-content").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function setInvoiceToonSupplierChange() {
    $("#invoiceTo").val($("#invoice_FKSupplierID option:selected").text());
}
function showClientInvoicesReportInternalSup() {
    if ($("#date-from-af").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateFrom']);

    }
    if ($("#date-to-af").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateTo']);

    }
    blockUI();
    var data = { id: $("#selected-client-id").val(), from: $("#date-from-af").val(), to: $("#date-to-af").val() };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/ClientInvoicesInternalSupplier',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function showClientInvoicesReportInternal() {
    if ($("#date-from-af").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateFrom']);

    }
    if ($("#date-to-af").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateTo']);

    }
    blockUI();
    var data = { id: $("#selected-client-id").val(), from: $("#date-from-af").val(), to: $("#date-to-af").val() };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/ClientInvoicesInternal',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabTemplate").html("");
            $("#tabTemplate").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function showClientInvoicesReportInternalP() {
    if ($("#date-from-af").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateFrom']);

    }
    if ($("#date-to-af").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDateTo']);

    }
    blockUI();
    var data = { id: $("#pClientID").val(), from: $("#date-from-af").val(), to: $("#date-to-af").val() };

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Accounts/ClientInvoicesInternalP',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}


function syncSelectAll() {
    if ($("#syncSelectAll").is(":checked")) {
        $(".select-sync").prop("checked", true);
    }
    else {
        $(".select-sync").prop("checked", false);
    }
}
function setselectAll() {
    if ($("#selectAllCheck").is(":checked")) {
        $(".select-doc").prop("checked", true);
    }
    else {
        $(".select-doc").prop("checked", false);
    }
}

function setselectAllDoc() {
    if ($("#selectAllCheck").is(":checked")) {
        var docType = $('.type-drop-s').val();
        if (docType != '') {
            $(".doc-type").each(function () {

                if ($(this).val() != docType) {
                    $(this).parent().find('.select-doc').prop("checked", false);
                }
                else {
                    $(this).parent().find('.select-doc').prop("checked", true);
                }
            })
        }
        else {
            $('.select-doc').prop("checked", true);
        }
    }
    else {
        $('.select-doc').prop("checked", false);
    }
  
}
function setselectAllPen() {
    if ($("#selectAllCheckPen").is(":checked")) {
        $(".select-client-pen").prop("checked", true);
    }
    else {
        $(".select-client-pen").prop("checked", false);
    }
}
function deleteSelectedDocuments() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocumentToDelete']);

    }
    else {
        var list = [];
        $(".select-doc:checked").each(function () {
            var obj = new Object();
            obj.ID = $(this).parent().find(".doc-id").val();
            obj.Name = $(this).parent().find(".file-name").val();
            list.push(obj);
        });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/DeleteMultipleDocument',
            data: JSON.stringify({ ids: list, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                $(".select-doc:checked").each(function () {
                    $(this).parent().parent().parent().remove();
                });
                setDocSN();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }

}
function deleteSelectedDocumentsP() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocumentToDelete']);

    }
    else {
        var list = [];
        $(".select-doc:checked").each(function () {
            var obj = new Object();
            obj.ID = $(this).parent().find(".doc-id").val();
            obj.Name = $(this).parent().find(".file-name").val();
            list.push(obj);
        });
        var data =
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/Client/DeleteMultipleDocumentP',
                data: JSON.stringify({ ids: list, client: $("#hdn-p-client-doc").val() }),
                async: true,
                success: function (data) {
                    $(".select-doc:checked").each(function () {
                        $(this).parent().parent().parent().remove();
                    });
                    setDocSN();

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleErrors(textStatus);
                    unblockUI();
                }
            });

    }

}
function downloadSelected() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocumentToDownload']);

    }
    else {
        var list = [];
        $(".select-doc:checked").each(function () {
            var obj = new Object();
            obj.url = $(this).parent().find(".blob-url").val();
            obj.name = $(this).parent().find(".file-name").val();
            list.push(obj);
        });
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/DownloadMultiple',
            data: JSON.stringify(list),
            async: true,
            success: function (data) {
                $("#download-href")[0].click();


            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }

}
function showFileNoteFamily(id) {
    var obj = new Object();
    obj.filenote = id;
    obj.client = $("#selected-client-id").val()
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/ShowFilNotesToFamily',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == "NF") {
                return showWarningToast(ScriptResourcesList['scriptNoFamilyForThisClient']);
            }
            return successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function hideFileNoteFamily(id) {
    var obj = new Object();
    obj.filenote = id;
    obj.client = $("#selected-client-id").val()
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/HideFilNotesFromFamily',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            getFileNotes();
            return successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function hideSelectedFamily() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocument']);
    }
    else {
        var list = [];
        $(".select-doc:checked").each(function () {
            list.push($(this).parent().find(".doc-id").val());
        });
        var obj = new Object();
        obj.docs = list;
        obj.client = $("#selected-client-id").val()
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/HideDocumentsFromFamily',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();
                if ($("#folder-name-open").length > 0) {
                    $("#folder-name-open").click();
                }
                else {
                    getClientDocs();
                }

                return successToast();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }

}
function showSelectedFamily() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocument']);
    }
    else {
        var list = [];
        $(".select-doc:checked").each(function () {
            list.push($(this).parent().find(".doc-id").val());
        });
        var obj = new Object();
        obj.docs = list;
        obj.client = $("#selected-client-id").val()
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/ShowDocumentsToFamily',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == "NF") {
                    return showWarningToast(ScriptResourcesList['scriptNoFamilyForThisClient']);
                }
                return successToast();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }

}
function showSelectedAgent() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocument']);
    }
    else {
        var list = [];
        $(".select-doc:checked").each(function () {
            list.push($(this).parent().find(".doc-id").val());
        });
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/ShowAgent',
            data: JSON.stringify(list),
            async: true,
            success: function (data) {
                unblockUI();
                return showSuccessToast(ScriptResourcesList['scriptPleaseSelectDocumentAgentAvail']);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }

}
function hideSelectedAgent() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocument']);
    }
    else {
        var list = [];
        $(".select-doc:checked").each(function () {
            list.push($(this).parent().find(".doc-id").val());
        });

        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/HideAgent',
            data: JSON.stringify(list),
            async: true,
            success: function (data) {
                unblockUI();
                return showSuccessToast(ScriptResourcesList['scriptPleaseSelectDocumentAgentHiden']);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }

}
function displayPicName() {

    if ($("#doc-input").val() != "") {
        $("#lbl-file-name").html("");
        $("#lbl-file-name").html($("#doc-input").val());


    }
    else {

        $("#lbl-file-name").html("");
    }

}
function addFile() {

    var data = new FormData();
    var files = $("#doc-input").get(0).files;
    if (files.length > 0) {
        data.append("File", files[0]);
    }
    else {
        return showSuccessToast(ScriptResourcesList['scriptPleaseSelectDocumentAgentHiden']);
    }
    data.append("Name", $("#file-name").val());
    data.append("Client", $("#selected-client-id").val());
    blockUI();
    $.ajax({
        url: '/Client/UploadFile',
        type: "POST",
        processData: false,
        contentType: false,
        data: data,
        success: function (response) {
            getClientDocs()
            unblockUI();
            if (msg == "SE") {
                return showErrorToast(ScriptResourcesList['scriptStorageLimit']);
            }
            return showSuccessToast(ScriptResourcesList['scriptDocumentUploadedSuccessfully']);
        },
        error: function (er) {
            alert(er);
        }

    });
}
function showAddDoc(ref) {

    if (ref) {
        $(".add-new-doc").show();
        $("#hide-new-doc").show();
        $("#show-new-doc").hide();
    }
    else {
        $(".add-new-doc").hide();
        $("#hide-new-doc").hide();
        $("#show-new-doc").show();
    }
}

function setDocSN() {
    var i = 1;
    $(".serial").each(function () {
        $(this).html(i);
        i++;
    });
}

function deleteFile(id, ref) {
    var title = $(ref).parent().parent().find(".doc-title").val();
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/DeleteFile',
            data: JSON.stringify({ docId: id, title: title, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {

                if (data) {
                    $(ref).parent().parent().parent().remove();
                    setDocSN();
                    return showSuccessToast(ScriptResourcesList['scriptDocumentDeleted']);
                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function editFileUg(id, ref, sn) {
    if (confirm(ScriptResourcesList['scriptConfirmationDocumentTitle'])) {
        var title = $(ref).parent().parent().parent().find(".doc-title").val();
        if (title == "") {
            return showWarningToast(ScriptResourcesList['scriptPleaseEnterDocumentTitle']);

        }
        var data = { docId: id, title: title, client: $("#selected-client-id").val(), sn: sn };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/UpdateFileUg',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                if (data == false) {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }
                else {
                    $('#client-doc-table')
                        .unbind('appendCache applyWidgetId applyWidgets sorton update updateCell')
                        .removeClass('tablesorter')
                        .find('thead th')
                        .unbind('click mousedown')
                        .removeClass('header headerSortDown headerSortUp');
                    $(ref).closest('tr').replaceWith(data);
                    $('.dropdowntype:empty').html($("#userDropDownType").val());
                    $("#client-doc-table tr").each(function () {
                        var id = $(this).find(".doc-type").val();
                        $(this).find(".type-drop").val(id);
                    });
                    $("#client-doc-table").addClass('tablesorter');
                    $("#client-doc-table").tablesorter({
                        dateFormat: "uk",
                        textExtraction: function (node) {
                            return $(node).find(".sotrer").text();
                        },
                        sortList: [[1, 0], [2, 0], [3, 0]],
                        headers: { 0: { sorter: false }, 4: { sorter: false }, 5: { sorter: false } }
                    });
                    return showSuccessToast(ScriptResourcesList['scriptDocumentTitleUpdated']);

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function editFile(id, ref, sn) {
    if (confirm(ScriptResourcesList['scriptConfirmationDocumentTitle'])) {
        var title = $(ref).parent().parent().parent().find(".doc-title").val();
        if (title == "") {
            return showWarningToast(ScriptResourcesList['scriptPleaseEnterDocumentTitle']);
        }
        var data = { docId: id, title: title, client: $("#selected-client-id").val(), sn: sn };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/UpdateFile',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                if (data == false) {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }
                else {
                    $('#client-doc-table')
                        .unbind('appendCache applyWidgetId applyWidgets sorton update updateCell')
                        .removeClass('tablesorter')
                        .find('thead th')
                        .unbind('click mousedown')
                        .removeClass('header headerSortDown headerSortUp');
                    $(ref).closest('tr').replaceWith(data);
                    $('.dropdowntype:empty').html($("#userDropDownType").val());
                    $("#client-doc-table").addClass('tablesorter');
                    $("#client-doc-table").tablesorter({
                        dateFormat: "uk",
                        textExtraction: function (node) {
                            return $(node).find(".sotrer").text();
                        },
                        sortList: [[1, 0], [2, 0], [3, 0]],
                        headers: { 0: { sorter: false }, 4: { sorter: false } }
                    });
                    return showSuccessToast(ScriptResourcesList['scriptDocumentTitleUpdated']);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function getSplitPopUP(blob, name) {
    $("#hdn-split-filename").val(name);
    $("#hdn-split-blob").val(blob);
    $("#modal-split-doc").modal("show");

}
function spliDocs() {
    var range = [];
    var validated = false;
    if ($("#main-range-div .range-inputs").length == 0) {
        if ($("#split-pages").val() == "") {
            return showWarningToast(ScriptResourcesList['scriptPleaseEnterPagesForSplit']);

        }
        if (parseInt($("#split-pages").val()) < 0) {
            return showWarningToast(ScriptResourcesList['scriptPleaseEnterAmountGreater']);
        }
        validated = true;
    }
    if ($("#main-range-div .range-inputs").length == 1) {
        if ($("#main-range-div .range-inputs").find(".split-from").val() == "" && $("#main-range-div .range-inputs").find(".split-to").val() == "") {
            if ($("#split-pages").val() == "") {
                return showWarningToast(ScriptResourcesList['scriptPleaseEnterPagesForSplit']);
            }

            if (parseInt($("#split-pages").val()) < 0) {
                return showWarningToast(ScriptResourcesList['scriptPleaseEnterAmountGreater']);
            }
            validated = true;
        }
        else {
            if ($("#split-pages").val() != "") {
                return showWarningToast(ScriptResourcesList['scriptPleaseUseRangeOrNumberOfPages']);

            }
            var rn = new Object();
            rn.From = $("#main-range-div .range-inputs").find(".split-from").val();
            rn.To = $("#main-range-div .range-inputs").find(".split-to").val();
            if (rn.From == "") {
                return showWarningToast(ScriptResourcesList['scriptPleaseEnterNumberFrom']);

            }
            if (rn.To == "") {
                return showWarningToast(ScriptResourcesList['scriptPleaseEnterNumberTo']);
            }
            if (parseInt(rn.From) < 0) {
                return showWarningToast(ScriptResourcesList['scriptPleaseEnterAmountGreater']);
            }
            if (parseInt(rn.To) < 0) {
                return showWarningToast(ScriptResourcesList['scriptPleaseEnterAmountGreater']);
            }

            if (parseInt(rn.From) > parseInt(rn.To)) {
                return showWarningToast(ScriptResourcesList['scriptPleaseEnterAmountFromTo']);

            }
            range.push(rn);
            validated = true;
        }

    }

    if ($("#main-range-div .range-inputs").length > 1) {
        $("#main-range-div .range-inputs").each(function () {
            var from = $(this).find(".split-from").val();
            var to = $(this).find(".split-to").val();
            if (from == "" && to == "") {
                validated = false;
                $(this).find(".split-from").focus();
                showWarningToast(ScriptResourcesList['scriptPleaseEnterRangeRow']);
                return false;
            }
            if ($("#split-pages").val() != "") {
                validated = false;
                showWarningToast(ScriptResourcesList['scriptPleaseUseRangeOrNumberOfPages']);

                return false;
            }
            if (from == "") {
                validated = false;
                showWarningToast(ScriptResourcesList['scriptPleaseEnterNumberFrom']);
                return false;
            }
            if (to == "") {
                validated = false;
                showWarningToast(ScriptResourcesList['scriptPleaseEnterNumberTo']);
                return false;
            }
            if (parseInt(from) < 0) {
                validated = false;
                showWarningToast(ScriptResourcesList['scriptPleaseEnterAmountGreater']);
                return false;
            }
            if (parseInt(to) < 0) {
                validated = false;
                showWarningToast(ScriptResourcesList['scriptPleaseEnterAmountGreater']);
                return false;
            }
            if (parseInt(from) > parseInt(to)) {
                validated = false;
                $(this).find(".split-from").focus();
                showWarningToast(ScriptResourcesList['scriptPleaseEnterAmountFromTo']);
                return false;
            }
            var rn = new Object();
            rn.From = from;
            rn.To = to;
            range.push(rn);
            validated = true;
        });

    }

    if (validated) {
        blockUI();
        var obj = new Object();
        obj.PagePerFile = $("#split-pages").val();
        obj.BlobID = $("#hdn-split-blob").val();
        obj.FileName = $("#hdn-split-filename").val();
        obj.ClientID = $("#selected-client-id").val();
        obj.Type = $("#file-type-open").val();
        obj.Range = range;
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/SplitDoc',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == "NA") {
                    return showErrorToast(ScriptResourcesList['scriptPageSizeLargerThanFileSize']);

                }
                if (data == true) {
                    $("#modal-split-doc").modal("hide");
                    $('body').removeClass('modal-open');
                    return showSuccessToast(ScriptResourcesList['scriptDocumentSplitPleaseRefresh']);

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
                return showErrorToast(ScriptResourcesList['scriptCheckPageSizeLargerThanFileSize']);

            }
        });

    }
}

function addNewRange() {
    var html = "";
    html += '<div class="range-inputs">';
    html += '<i class="fa fa-times fa-range" onclick="removeThis(this)"></i>';
    html += '<div style="clear:both;"></div>';
    html += '<h3 class="input_lbl split-lbl">' + ScriptResourcesList['scriptFrom'] + '</h3><input placeholder="' + ScriptResourcesList['scriptFrom'] + '" class="info_input split-from" type="number">';
    html += '<h3 class="input_lbl split-lbl-to">' + ScriptResourcesList['scriptTo'] + '</h3><input placeholder="' + ScriptResourcesList['scriptTo'] + '" class="info_input split-to" type="number">';
    html += '</div>';

    $("#main-range-div").append(html);
}
function removeThis(ref) {
    $(ref).parent().remove();
}
function compressPDF(blob, name) {
    if (confirm(ScriptResourcesList['scriptConfirmDocumentToPDF'])) {

        var obj = new Object();
        obj.BlobID = blob;
        obj.FileName = name;
        obj.ClientID = $("#selected-client-id").val();
        obj.Type = $("#file-type-open").val();
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/CompresPDF',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();

                if (data == true) {

                    return showSuccessToast(ScriptResourcesList['scriptRefreshAfterPDF']);
                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();

            }
        });
    }

}
function convertToPdf(blob, name) {
    if (confirm(ScriptResourcesList['scriptConfirmDocumentToPDF'])) {

        var obj = new Object();
        obj.BlobID = blob;
        obj.FileName = name;
        obj.ClientID = $("#selected-client-id").val();
        obj.Type = $("#file-type-open").val();
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/ConvertImage',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();

                if (data == true) {

                    return showSuccessToast(ScriptResourcesList['scriptRefreshAfterPDF']);
                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();

            }
        });
    }

}
function showMergeDoc() {
    $(".ispdf").each(function () {
        $(this).parent().parent().parent().remove();

    })
    var sn = 0;
    $("#client-doc-table tr:gt(1)").each(function () {

        $(this).find('td:eq(1)').html(parseInt(sn) + 1);
        sn++
    });
    $("#go-merge-doc").show();
}
function mergeToPdfPopup() {
    var isValidated = true;
    if ($(".select-doc:checked").length < 2) {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterAtleastTwoDoc']);
    }

    else {
        var list = "<div class='table-responsive'><table class='table table-hover table-striped'><thead><tr><th></th><th>" + ScriptResourcesList['scriptName'] + "</th><th>" + ScriptResourcesList['scriptAction'] + "</th></tr></thead>";
        list += "<tbody>";
        var sna = 0;
        $(".select-doc:checked").each(function () {
            if ($(this).parent().parent().parent().find(".ispdf").val() == "false") {
                isValidated = false;
                return false;
            }
            var id = sna++;
            list += "<tr>";
            list += '<td><p class="chkbox_p"><input id="check-pop-' + id + '" class="custom_chkbox select-doc-pop" type="checkbox" checked/>';
            list += '<label for="check-pop-' + id + '" class="chkbx_label"></label><input type="hidden" value="' + $(this).parent().find(".blob-url").val() + '" class="blob-url-pop" /></td>';
            list += "<td>" + $(this).parent().find(".file-name").val() + "</td>";
            list += '<td><i class="fa fa-arrow-up up" aria-hidden="true" ></i> <i class="fa fa-arrow-down down" aria-hidden="true" ></i> <i title="' + ScriptResourcesList['scriptRemove'] + '" class="fa fa-trash-o" aria-hidden="true" onclick="removePopupRow(this)"></i></td>';
            list += "</tr>";

        });
        list += "</tbody></table><div>";
        if (!isValidated) {
            return showWarningToast(ScriptResourcesList['scriptOnlyPDF']);

        }
        $("#modal-merge-doc .detail_section").html(list);
        $("#modal-merge-doc").modal("show");
        $(".up,.down").click(function () {
            var row = $(this).parents("tr:first");
            if ($(this).is(".up")) {
                row.insertBefore(row.prev());
            } else {
                row.insertAfter(row.next());
            }
        });
    }
}
function removePopupRow(ref) {
    $(ref).parent().parent().remove();
}
function moveRowUp(ref) {
    var row = $(this).parent().parent();
    if ($(this).is(".up")) {

        row.insertBefore(row.prev());
    } else {

        row.insertAfter(row.next());
    }

}
function mergeToPdf(blob, name) {
    if (confirm(ScriptResourcesList['scriptConfirmationMergeDocument'])) {
        var list = [];
        var obj = new Object();
        obj.client = $("#selected-client-id").val();
        if ($("#file-type-open").val()) {
            obj.type = $("#file-type-open").val();
        }
        else {
            obj.type = 0;
        }

        if ($(".select-doc-pop:checked").length < 2) {

            return showWarningToast(ScriptResourcesList['scriptPleaseEnterAtleastTwoDoc']);

        }
        else {
            var list = [];
            $(".select-doc-pop:checked").each(function () {
                list.push($(this).parent().find(".blob-url-pop").val());
            });
        }
        obj.model = list;
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/MergePDF',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();

                if (data == true) {
                    $("#modal-merge-doc").modal("hide");
                    return showSuccessToast(ScriptResourcesList['scriptRefreshAfterMerge']);

                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();

            }
        });
    }

}
function searchDocType(ref) {
    var serchid = $(ref).val();
    if (serchid == "") {
        $("#client-doc-table tr").show();
    }
    else {
        blockUI();
        $("#client-doc-table tr").show();
        $(".type-drop").each(function () {

            if ($(this).val() != serchid) {

                $(this).parent().parent().hide();
            }
        })
        unblockUI();

    }
}

function GetSelectedEmail(ref) {
    var serchid = $(ref).val();
    if (serchid == "All") {
        $("#EmailHistoryTable tr").show();
    }
    else {
        blockUI();
        $("#EmailHistoryTable tr").show();
        $(".email-drop").each(function () {
            
            if ($(this).html() != serchid) {
                $(this).parent().parent().hide();
            }
        })
        $(".email-drop-Import").each(function () {
            
            if (serchid == "IMPORTED") {
                $(".email-drop").parent().parent().hide();
                $(this).parent().show();
            } else {
                $(this).parent().parent().hide();
            }
        })
        unblockUI();

    }
}

function GetSelectedEmailP(ref) {
    var serchid = $(ref).val();
    if (serchid == "All") {
        $("#EmailHistoryTable tr").show();
    }
    else {
        blockUI();
        $("#EmailHistoryTable tr").show();
        $(".email-drop").each(function () {
            if ($(this).html() != serchid) {
                $(this).parent().parent().hide();
            }
        })
        $(".email-drop-Import").each(function () {
            if (serchid == "IMPORTED") {
                $(".email-drop").parent().parent().hide();
                $(this).parent().show();
            }
            else {
                $(this).parent().parent().hide();
            }
        })
        unblockUI();

    }
}

function updateVisaStatusDashboradNew() {
    var obj = new Object();
    obj.client = $("#vs-selected-client-id").val();
    obj.visa = $("#current-visa-id").val();
    obj.status = $("#vs-selected-client-status").val();
    obj.expiry = $("#expiry-date").val();
    obj.approve = $("#approve-date").val();
    obj.name = $("#vs-selected-client-type").val();
    obj.applied = $("#input-app").val();
    obj.description = $("#input-desc").val();
    obj.eoiselected = $("#input-eoi-sel").val();
    obj.eoiita = $("#input-eoi-ita").val();
    obj.ppireceived = $("#input-ppi-rec").val();
    obj.ppidue = $("#input-ppi-due").val();
    obj.ppiextend = $("#input-ppi-ext").val();
    obj.ppisubmit = $("#input-ppi-sub").val();
    obj.declinedate = $("#input-decline-date").val();
    obj.declinedescription = $("#input-decline-desc").val();
    obj.refuseddate = $("#input-refused-date").val();
    obj.refuseddescription = $("#input-refused-desc").val();
    obj.genericdate = $("#input-generic-date").val();
    obj.aipdate = $("#input-aip-date").val();
    obj.email = false;
    obj.IsEmployer = $("#vs-is-employer").val();
    var url = "/Dashboard/UpdateVisa";
    if (obj.IsEmployer == "1") {
        url = '/EmployerManagement/VisaForUpdate';
    }

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            var bg = $("#vs-selected-client-color").val();
            $("#modal-star-visa-update input").val("");
            $("#modal-star-visa-update").modal('hide');
            $('body').removeClass('modal-open');
            var prevstatus = $("#client-visa-list-" + obj.visa + " .selected-visa-status").html();
            $("#client-visa-list-" + obj.visa + " .selected-visa-status").html(obj.status);
            $("#client-visa-list-" + obj.visa + " .cstatus-btn").css("background-color", bg.replace(";", ""));
            $("#status-date-" + obj.visa).html(obj.genericdate);
            return $().toastmessage('showToast', {
                text: 'Status Updated !',
                sticky: false,
                position: 'bottom-right',
                type: 'success'
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function savePriority() {

    var obj = new Object();
    obj.ID = $("#priorityClientID").val();
    obj.Priority = $("#priorityValue").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/Priority',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();

            if (data == true) {
                var html1 = "";
                if (obj.Priority == "Low") {
                    html1 += '<td class="priority-' + obj.ID + '" style="color:#5cb85c;"><span style="color:transparent">01</span>' + obj.Priority + '<br> <i title="Set priority" class="fa fa-warning" onclick="setPriority(' + obj.ID + ')"></i></td>';
                }
                else if (obj.Priority == "High") {
                    html1 += '<td class="priority-' + obj.ID + '" style="color:#d9534f;"><span style="color:transparent">03</span>' + obj.Priority + '<br> <i title="Set priority" class="fa fa-warning" onclick="setPriority(' + obj.ID + ')"></i></td>';
                }
                else if (obj.Priority == "Medium") {
                    html1 += '<td class="priority-' + obj.ID + '" style="color:#f0ad4e;"><span style="color:transparent">02</span>' + obj.Priority + '<br> <i title="Set priority" class="fa fa-warning" onclick="setPriority(' + obj.ID + ')"></i></td>';
                }
                var html = "";
                if (obj.Priority == "Low") {
                    html += '<td class="priority-m-' + obj.ID + '" style="color:#5cb85c;"><span style="color:transparent">01</span>' + obj.Priority + '<br> <i title="Set priority" class="fa fa-warning" onclick="setPriority(' + obj.ID + ')"></i></td>';
                }
                else if (obj.Priority == "High") {
                    html += '<td class="priority-m-' + obj.ID + '" style="color:#d9534f;"><span style="color:transparent">03</span>' + obj.Priority + '<br> <i title="Set priority" class="fa fa-warning" onclick="setPriority(' + obj.ID + ')"></i></td>';
                }
                else if (obj.Priority == "Medium") {
                    html += '<td class="priority-m-' + obj.ID + '" style="color:#f0ad4e;"><span style="color:transparent">02</span>' + obj.Priority + '<br> <i title="Set priority" class="fa fa-warning" onclick="setPriority(' + obj.ID + ')"></i></td>';
                }
                $(".priority-m-" + obj.ID).replaceWith(html);
                $(".priority-" + obj.ID).replaceWith(html1);
                $("#priority-modal").modal("hide");
                $('body').removeClass('modal-open');
                return $().toastmessage('showToast', {
                    text: 'Priority updated !',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });

            }
            else {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();

        }
    });

}
function setPriority(id) {
    $("#priorityClientID").val(id);
    $("#priority-modal").modal("show");
    $("#priority-modal").css('z-index', 1100);
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function getUserSummary() {
    var id = $("#ddl-user-cs").val();
    if (id === "") {
        return showClientsSummeryDashboard();
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ShowSummaryBackUser?userid=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#liAllClients").removeClass("active");
            $("#liClientSummary").addClass("active");
            $("#tabClientSummary").html("");
            $("#tabClientSummary").html(data);
            $("#ddl-user-cs").val(id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getCountrySummaryDashboard() {
    var id = $("#ddl-country-cs").val();
    if (id === "All") {
        return showDashboardNew();
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/DashboardCountry?country=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#liAllClients").removeClass("active");
            $("#liClientSummary").addClass("active");
            $("#tabClientSummary").html("");
            $("#tabClientSummary").html(data);
            $("#ddl-country-cs").val(id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getUserSummaryDashboard() {
    var id = $("#ddl-user-cs").val();
    if (id === "") {
        return showDashboardNew();
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/DashboardUser?userid=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#liAllClients").removeClass("active");
            $("#liClientSummary").addClass("active");
            $("#tabClientSummary").html("");
            $("#tabClientSummary").html(data);
            $("#ddl-user-cs").val(id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function viewAllQuestionnaires(id, ref) {
    $("#tab11default").html("");
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/viewAllQuestionnaires?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tab11default").html("");
            $("#tab11default").html(data);
            if (ref) {
                $(".client-inner-ul li").removeClass("active");
                $(ref).parent().addClass("active");

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}



function enableBox(thisid) {
    if ($("#selectClientSource option:selected").text() == "Other" || $("#selectClientSource option:selected").text() == "Advertisement") {
        $("#sourceDescription").prop("disabled", false);
    }
    else {
        $("#sourceDescription").prop("disabled", true);
    }

}

function printClientProfile() {
    var fName, mName, lName, email, cEmail, dob, address, mPhone, lPhone, oci, ms, nodc, occupation, company, notes, pNumber, coi, pid, ped, spNumber, scoi, spid, sped, mid, xd, ved, vt, pcid, clientNo, username, password;
    if ($("#FirstName").val()) {
        fName = $("#FirstName").val();
    }
    else {
        fName = "";
    }
    if ($("#MiddleName").val()) {
        mName = $("#MiddleName").val();
    }
    else {
        mName = "";
    }
    if ($("#LastName").val()) {
        lName = $("#LastName").val();
    }
    else {
        lName = "";
    } if ($("#clientPrimaryEmail").val()) {
        email = $("#clientPrimaryEmail").val();
    }
    else {
        email = "";
    } if ($("#ContactEmail").val()) {
        cEmail = $("#ContactEmail").val();
    }
    else {
        cEmail = "";
    }
    if ($("#DOB").val()) {
        dob = $("#DOB").val();
    }
    else {
        dob = "";
    }
    if ($("#Address").val()) {
        address = $("#Address").val();
    }
    else {
        address = "";
    }
    if ($("#Mobile").val()) {

        mPhone = $("#country-code").val() + " " + $("#Mobile").val();
    }
    else {
        mPhone = "";
    } if ($("#Landline").val()) {
        lPhone = $("#Landline").val();
    }
    else {
        lPhone = "";
    } if ($("#OtherContactInfo").val()) {
        oci = $("#OtherContactInfo").val();
    }
    else {
        oci = "";
    }
    if ($("#martial-status").val()) {
        ms = $("#martial-status").val();
    }
    else {
        ms = "";
    }
    if ($("#DependentChildren").val()) {
        nodc = $("#DependentChildren").val();
    }
    else {
        nodc = "";
    }
    if ($("#Occupation").val()) {
        occupation = $("#Occupation").val();
    }
    else {
        occupation = "";
    } if ($("#OccupationOrganization").val()) {
        company = $("#OccupationOrganization").val();
    }
    else {
        company = "";
    } if ($("#Notes").val()) {
        notes = $("#Notes").val();
    }
    else {
        notes = "";
    }
    if ($("#PassportNo").val()) {
        pNumber = $("#PassportNo").val();
    }
    else {
        pNumber = "";
    }
    if ($("#passcon").val()) {
        coi = $("#passcon").val();
    }
    else {
        coi = "";
    }
    if ($("#PassportIssueDate").val()) {
        pid = $("#PassportIssueDate").val();
    }
    else {
        pid = "";
    } if ($("#PassportExpiryDate").val()) {
        ped = $("#PassportExpiryDate").val();
    }
    else {
        ped = "";
    } if ($("#SecPassportNo").val()) {
        spNumber = $("#SecPassportNo").val();
    }
    else {
        spNumber = "";
    } if ($("#secpasscon").val()) {
        scoi = $("#secpasscon").val();
    }
    else {
        scoi = "";
    }
    if ($("#SecPassportIssueDate").val()) {
        spid = $("#SecPassportIssueDate").val();
    }
    else {
        spid = "";
    }
    if ($("#SecPassportExpiryDate").val()) {
        sped = $("#SecPassportExpiryDate").val();
    }
    else {
        sped = "";
    } if ($("#Visa_MedicalIssueDate").val()) {
        mid = $("#Visa_MedicalIssueDate").val();
    }
    else {
        mid = "";
    } if ($("#Visa_XRayDate").val()) {
        xd = $("#Visa_XRayDate").val();
    }
    else {
        xd = "";
    }
    if ($("#Visa_ExpiryDate").val()) {
        ved = $("#Visa_ExpiryDate").val();
    }
    else {
        ved = "";
    }
    if ($("#visa-type").val()) {
        vt = $("#visa-type :selected").text();
    }
    else {
        vt = "";
    }
    if ($("#Visa_PoliceCertificateDate").val()) {
        pcid = $("#Visa_PoliceCertificateDate").val();
    }
    else {
        pcid = "";
    } if ($("#ClientNumber").val()) {
        clientNo = $("#ClientNumber").val();
    }
    else {
        clientNo = "";
    } if ($("#INZUserName").val()) {
        username = $("#INZUserName").val();
    }
    else {
        username = "";
    }
    if ($("#INZPassword").val()) {
        password = $("#INZPassword").val();
    }
    else {
        password = "";
    }

    var html = "<div style='width:100%;float:left;margin:5px;text-align:center'><h3>Client Profile</h3></div>";
    html += "<div style='width:100%;float:left;margin:5px;text-align:center'>" + fName + " " + mName + " " + lName + "</div>";
    if ($("#concernedPersons .client-pp").length > 0) {
        html += "<div style='width:100%;float:left;margin:5px;text-align:center'><h3>Processing Person(s) ";
        $("#concernedPersons .client-pp").each(function () {
            html += $.trim($(this).html()) + " ";
        });
        html += "</h3 ></div > ";
    }
    html += "<div style='width:100%;float:left;margin:5px;text-align:left;font-size:12px;'>PERSONAL INFORMATION</div>";
    html += "<div style='width:49%;float:left'>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Client's First Name :  " + fName + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Middle Name :  " + mName + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Last Name :  " + lName + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Email :  " + email + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Contact Email :  " + cEmail + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Date Of Birth :  " + dob + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Address :  " + address + "</div>";
    html += "</div>";
    html += "<div style='width:49%;float:left'>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Mobile Phone :  " + mPhone + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Land Line :  " + lPhone + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Other Contact Information :  " + oci + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Martial Status :  " + ms + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Number Of Dependant Children :  " + nodc + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Occupation :  " + occupation + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Company (Optional) :  " + company + "</div>";
    html += "</div>";

    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Notes :  " + notes + "</div>";
    html += "<div style='width:49%;float:left'>";
    html += "<div style='width:100%;float:left;margin:5px;text-align:left;font-size:12px;'>PASSPORT DETAIL</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Passport Number :  " + pNumber + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Country Of Issue :  " + coi + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Passport Issue Date :  " + pid + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Passport Expiry Date :  " + ped + "</div>";
    html += "</div>";
    html += "<div style='width:49%;float:left'>";
    html += "<div style='width:100%;float:left;margin:5px;text-align:left;font-size:12px;'>SECOND PASSPORT DETAILS (IF CLIENT IS DUAL NATIONAL)</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Second Passport Number :  " + spNumber + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Second Country Of Issue :  " + scoi + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Second Passport Issue Date :  " + spid + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Second Passport Expiry Date :  " + sped + " </div>";
    html += "</div>";
    html += "<div style='width:49%;float:left'>";
    html += "<div style='width:100%;float:left;margin:5px;text-align:left;font-size:12px;'>VISA DETAIL</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Medical Issue Date :  " + mid + " </div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>XRay Date :  " + xd + " </div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Current New Zeland Visa Expiry Date :  " + ved + " </div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Current Visa Type :  " + vt + " </div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Police Certificate Issue Date :  " + pcid + " </div>";
    html += "</div>";
    html += "<div style='width:49%;float:left'>";
    html += "<div style='width:100%;float:left;margin:5px;text-align:left;font-size:12px;'>INZ LOGIN DETAILS</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Client Number :  " + clientNo + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Username :  " + username + "</div>";
    html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>Password :  " + password + "</div>";
    html += "</div>";
    Popup(html);
}

function readURL1(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#profile-image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function sendCMVNotification(ref) {
    if (ref) {
        if ($("#cmv-notification-email").val() == "") {
            return showErrorToast(ScriptResourcesList['scriptPleaseEnterEmail']);

        }
        if ($("#cmv-notification-subject").val() == "") {
            return showErrorToast(ScriptResourcesList['scriptPleaseEnterSubject']);
        }
        if ($("#cmv-notification-comment").val() == "") {
            return showErrorToast(ScriptResourcesList['scriptPleaseEnterMessage']);
        }
        var obj = new Object();
        obj.ClientID = $("#selected-client-id").val();
        obj.To = $("#cmv-notification-email").val();
        obj.Subject = $("#cmv-notification-subject").val();
        obj.Message = $("#cmv-notification-comment").val();
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/SendVisaNotification',
            async: true,
            data: JSON.stringify(obj),
            success: function (data) {
                unblockUI();
                $('#modal-cmv-notifcation').modal('hide');
                $('body').removeClass('modal-open');
                successToast();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }
    else {
        $('#modal-cmv-notifcation').modal('hide');
        $('body').removeClass('modal-open');
    }
}
function changeClientAreaAccess(status, alt) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/AreaAccess',
        data: JSON.stringify({ status: status, ClientID: $("#selected-client-id").val(), alt: alt }),
        async: true,
        success: function (data) {
            unblockUI();
            $("#clientArea").val(status);
            if (data == true) {
                return successToast();
            }
            $("#cmv-notification-email").val(data.To);
            $("#cmv-notification-subject").val(data.Subject);
            $("#cmv-notification-comment").summernote({
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
            var updatedTemp = removeElements(data.Message, "font");
            $("#cmv-notification-comment").summernote('code', updatedTemp);

            if (_defaultFont != "") {
                $('#cmv-notification-comment').summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
            }
            $("#modal-cmv-notifcation").modal("show");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function changeClientAreaAccessUpdateP(status) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/AreaAccessUpdateP',
        data: JSON.stringify({ status: status, ClientID: $("#selected-client-id").val() }),
        async: true,
        success: function (data) {
            successToast();
            unblockUI();
            $("#clientStatusUpdateP").val(status);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function changeClientAreaAccessUpdate(status) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/AreaAccessUpdate',
        data: JSON.stringify({ status: status, ClientID: $("#selected-client-id").val() }),
        async: true,
        success: function (data) {
            successToast();
            unblockUI();
            $("#clientStatusUpdate").val(status);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function changeContractStatus(status) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ActiveInactiveContract',
        data: JSON.stringify({ status: status, ClientID: $("#selected-client-id").val() }),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == "Contract") {
                return showWarningToast(ScriptResourcesList['scriptApplyaContractFirst']);
            }
            $("#clientReadyContract").val(status);
            return successToast();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function changeClientStatus(status) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ActiveInactive',
        data: JSON.stringify({ status: status, ClientID: $("#selected-client-id").val() }),
        async: true,
        success: function (data) {
            $("#clientStatusMain").val(status);
            successToast();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function changeOnShoreStatus(status) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/OnShoreUpdate',
        data: JSON.stringify({ status: status, ClientID: $("#selected-client-id").val() }),
        async: true,
        success: function (data) {
            successToast();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function changeSignedStatusDate() {
    if ($("#agreement-signed-date").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterDate']);
    }
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/AgreementSigned',
        data: JSON.stringify({ status: true, ClientID: $("#selected-client-id").val(), date: $("#agreement-signed-date").val() }),
        async: true,
        success: function (data) {
            $("#modal-agreement-date").modal('hide');
            $('body').removeClass('modal-open');
            $("#agreement-signed-date").val("");
            $('#toggleSigned').parent('.toggle-btn').addClass('active');
            successToast();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function closeDataSharePopup() {
    $("#modal-datashare-advisor").modal('hide');
    $('body').removeClass('modal-open');
}
function changeSignedStatusDateClose() {
    $("#modal-agreement-date").modal('hide');
    $('body').removeClass('modal-open');
    $("#agreement-signed-date").val("");
    $('#toggleSigned').find('input.cb-value').prop('checked', false);
}
function changeSignedStatus(status) {
    if (status == true) {
        $("#modal-agreement-date").modal('show');
    }
    else {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/AgreementSigned',
            data: JSON.stringify({ status: status, ClientID: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                successToast();
                unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }


}
function changeStatusAusi(status) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ChangeAusi',
        data: JSON.stringify({ status: status, ClientID: $("#selected-client-id").val() }),
        async: true,
        success: function (data) {
            successToast();
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function getFileNotes() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/FileNotes?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            unblockUI();
            $("#client-content").html("");
            $("#client-content").html(data);
            $(".client-ul li").removeClass("active");
            $("#tabFileNote").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getRandPDF() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Rand/PDF?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-content").html("");
            $("#client-content").html(data);
            $(".client-ul li").removeClass("active");
            $("#tabRand").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getClientAccounts() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientTemplatesC?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            $("#client-content").html("");
            $("#client-content").html(data);
            var to = $.trim($("#selected-client-name").html()) + ":" + $.trim($("#selected-client-passport").html()) + ":" + $.trim($("#selected-client-dob").html());
            $("#invoiceSTo").val(to);
            $("#FkClientIDS").val($("#selected-client-id").val());
            $(".client-ul li").removeClass("active");
            $("#tabAccounts").parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getClientLog() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Activity/ClientLog?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            if ($("#activity-notes-p").html()) { showActions(); }
            $("#client-content").html("");
            $("#client-content").html(data);
            $(".client-ul li").removeClass("active");
            $("#tabLog").parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function showLogPage(ref, id) {
    var page = parseInt(ref);
    $("#page-number").val(page);
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Activity/ClientLog?id=' + id + '&page=' + page,
        async: true,
        success: function (data) {
            if ($("#client-task-modal-body").is(":visible")) {
                $("#client-task-modal-body").html(data);
            }
            else {
                $("#client-content").html(data);
            }


            $('#paginator').pagination('redraw');

            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function getFileActions() {

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/FileNotesAction?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            $("#rightDivTop").html("");
            $("#rightDivTop").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getClientDetail() {

    $("#menu1").html("Client Profile <span class='caret'></span>");
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/UpdateClientProfile?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            unblockUI();
            if ($("#activity-notes-p").html()) { showActions(); }
            $("#client-content").html("");
            $("#client-content").html(data);
            $("#clientID").val("");
            $("#clientID").val($("#selected-client-id").val());
            $(".client-ul li").removeClass("active");
            $(".client-li").addClass("active");
            $("#Notes").summernote({
                popover: {
                    image: [
                        ['custom', ['imageAttributes']],
                        ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                        ['float', ['floatLeft', 'floatRight', 'floatNone']],
                        ['remove', ['removeMedia']]
                    ],
                },
                focus: false
                ,
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
            if (_defaultFont != "") {
                $('#Notes').summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
            }
            return window.scrollTo(0, 0);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getPartnerDetail() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/UpdateClientPartner?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-content").html("");
            $("#client-content").html(data);
            $("#clientID").val("");
            $("#clientID").val($("#selected-client-id").val());
            $(".client-ul li").removeClass("active");
            $(".client-li").addClass("active");
            $("#inner-partner-detail").removeClass("btn-primary").addClass("btn-default");
            $("#inner-job-detail").removeClass("btn-default").addClass("btn-primary");
            $("#inner-education-detail").removeClass("btn-default").addClass("btn-primary");
            if ($("#activity-notes-p").html()) { showActions(); }

            $("#Notes").summernote({
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
            if (_defaultFont != "") {
                $('#Notes').summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getFamilyMembers() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/UpdateClientFamily?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-content").html("");
            $("#client-content").html(data);
            $("#clientID").val("");
            $("#clientID").val($("#selected-client-id").val());
            $(".client-ul li").removeClass("active");
            $(".client-li").addClass("active");
            if ($("#activity-notes-p").html()) { showActions(); }

            $("#Notes").summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            if (_defaultFont != "") {
                $('#Notes').summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getClientVisa() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientVisas?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {

            $("#client-content").html("");
            $("#client-content").html(data);
            $(".client-ul li").removeClass("active");
            $("#tabVisa").parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getClientAddmissions() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Addmission/GetAppliedPrograms?client=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            if ($("#VisaDescription").length > 0) {
                showActions();
            }

            $("#client-content").html("");
            $("#client-content").html(data);
            $(".client-ul li").removeClass("active");
            $("#tabAddmission").parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getClientDocsUnGrouped() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetClientDocsUngrouped?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            unblockUI();
            if ($("#activity-notes-p").html()) { showActions(); }
            $("#client-content").html("");
            $("#client-content").html(data);
            $(".client-ul li").removeClass("active");
            $("#tabDocs").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getClientDocs(Tab) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetClientDocuments?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            if ($("#activity-notes-p").html()) { showActions(); }
            $("#client-content").html("");
            $("#client-content").html(data);
            $(".client-ul li").removeClass("active");
            $("#tabDocs").parent().addClass("active");
            unblockUI();
            if (Tab != null && Tab != 'undefined') {
                $(".client-inner-ul li").removeClass("active");
            $('a[href="#' + Tab + '"]').parent().addClass("active");
            $("#DocTab").removeClass("active");
            $("#" + Tab).addClass("active").addClass('in');
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getSendEmail() {
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientEmail',
        async: true,
        success: function (data) {

            if ($("#activity-notes-p").html()) { showActions(); }
            $("#client-content").html("");
            $("#client-content").html(data);
            $(".client-ul li").removeClass("active");
            $("#tabEmail").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function addQuestionnaire3AsAClient(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/addQuestionnaire3AsAClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {

            var count = $("#webassessment-count").html();
            var result = parseInt(count) - 1;
            $("#webassessment-count").html(result);
            unblockUI();
            $(ref).parent().parent().hide();
            showSuccessToast(ScriptResourcesList['scriptAdded']);

            showClientDetailViews(data);


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function addQuestionnaire1AsAClient(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/addQuestionnaire1AsAClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {

            var count = $("#webassessment-count").html();
            var result = parseInt(count) - 1;
            $("#webassessment-count").html(result);
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            showClientDetailViews(data);


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function paymentPlanInternal(id) {
    if ($("#selected-client-agent-id").val() == "0") {
        return showWarningToast(showSuccessToast(ScriptResourcesList['scriptNotAgentClient']));

    }
    $("#plan-client").val(id);
    $("#plan-client-name").val($("#selected-client-name").html());
    $("#plan-date").datepicker({
        dateFormat: 'dd/mm/yy',
        showOn: "button",
        buttonImage: "/Content/Images/calendar.png",
        buttonImageOnly: true,
        defaultDate: new Date(),
        buttonText: "Select date",
        changeMonth: true,
        changeYear: true,
        yearRange: "0:+10",
        dateFormat: 'dd/mm/yy'
    });
    getpaymentPlanInternal(id);
    $("#agent-payment-modal").modal('show');
}
function paymentPlan(id, name) {
    $("#plan-client").val(id);
    $("#plan-client-name").val(name);
    $("#plan-date").datepicker({
        dateFormat: 'dd/mm/yy',
        showOn: "button",
        buttonImage: "/Content/Images/calendar.png",
        buttonImageOnly: true,
        defaultDate: new Date(),
        buttonText: "Select date",
        changeMonth: true,
        changeYear: true,
        yearRange: "0:+10",
        dateFormat: 'dd/mm/yy'
    });
    getpaymentPlan(id);
    $("#agent-payment-modal").modal('show');

}
function getpaymentPlanInternal(id) {
    var data = {
        FKClientID: id,
        Agent: $("#selected-client-agent-id").val()
    };

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Management/AgentClientPaymentPlan',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $("#payment-plan").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function getpaymentPlan(id) {
    if ($("#hdn-agent-id").val()) {
        agent = $("#hdn-agent-id").val();
    }
    else {
        agent = $("#selected-client-agent-id").val();
    }
    var data = {
        FKClientID: id,
        Agent: agent
    };

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Management/AgentClientPaymentPlan',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $("#payment-plan").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function addNewPaymentReminder() {
    $(".input_error_msg").hide();

    if ($("#plan-date-i").val() == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterDate']);
        return false;
    }
    if ($("#plan-amt").val() == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterAmount']);

        return false;
    }
    if (parseFloat($("#plan-amt").val()) < 0) {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterAmountGreater']);


        return false;
    }
    var agent = 0;
    if ($("#hdn-agent-id").val()) {
        agent = $("#hdn-agent-id").val();
    }
    else {
        agent = $("#selected-client-agent-id").val();
    }
    var data = {
        ReminderDescription: 'Payment Reminder',
        ReminderDetail: $("#plan-desc").val(),
        ReminderDate: $("#plan-date-i").val(),
        FKClientID: $("#plan-client").val(),
        ClientName: $("#plan-client-name").val(),
        Amount: $("#plan-amt").val(),
        Agent: agent
    };

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Management/AddNewReminder',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();

            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            $("#tabTemplate .info_input").val("");
            getpaymentPlan($("#plan-client").val());


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function sendQuestionnaireEmail(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/SendEmail?client=' + $("#selected-client-id").val() + '&ques=' + id + '&ln=' + $("#Lang:checked").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#send-email-questionnaire-modal .modal-body").html(data);
            $("#send-email-questionnaire-modal").modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function sendQuestionnaireEmailPotential(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/SendEmailP?client=' + $("#pClientID").val() + '&ques=' + id + '&ln=' + $("#Lang:checked").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#send-email-questionnaire-modal-p .modal-body").html(data);
            $("#send-email-questionnaire-modal-p").modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function sendDataShareEmailPOST() {
    if ($("#emailTO-ds").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterEmail']);
        return false;
    }
    if ($("#emailSubject-ds").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterSubject']);
        return false;
    }
    if ($("#emailCC-ds").val()) {
        var cc = $("#emailCC-ds").val();
        if (cc != null) {
            for (var i = 0; i < cc.length; i++) {

                if (!validateEmail(cc[i].trim())) {
                    return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
                }
            }
        }

    }
    if ($("#email-comment-ds").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterMessage']);
        return false;
    }
    var formData = new FormData();
    formData.append("Client", $("#hdn-ds-client").val());
    formData.append("Subject", $("#emailSubject-ds").val());
    formData.append("To", $("#emailTO-ds").val());
    formData.append("Comment", $("#email-comment-ds").val());
    formData.append("CC", $("#emailCC-ds").val());
    formData.append("bccMe", $("#bccMe-ds").is(":checked"));
    blockUI();
    $.ajax({
        url: '/DataShare/SendEmail',
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            unblockUI();
            $("#emailTO-ds").val("");
            $("#emailSubject-ds").val("");
            $("#email-comment-ds").val("");
            $("#hdn-ds-client").val("");
            $("#emailSubject-ds").val("");
            $("#send-email-share-data-modal").modal('hide');
            $('body').removeClass('modal-open');
            getClientDatashare();
            return showSuccessToast(ScriptResourcesList['scriptEmailedSuccessfully']);
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function sendQuestionnaireEmailPOST() {
    if ($("#emailTO-ques").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterEmail']);
        return false;
    }
    if ($("#emailSubject-ques").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterSubject']);
        return false;
    }
    if ($("#emailCC-ques").val()) {
        var cc = $("#emailCC-ques").val();
        if (cc != null) {
            for (var i = 0; i < cc.length; i++) {

                if (!validateEmail(cc[i].trim())) {
                    return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
                }
            }
        }

    }
    if ($("#email-comment-ques").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterMessage']);
        return false;
    }
    var formData = new FormData();
    formData.append("Client", $("#hdn-ques-client").val());
    formData.append("Ques", $("#hdn-ques").val());
    formData.append("Subject", $("#emailSubject-ques").val());
    formData.append("To", $("#emailTO-ques").val());
    formData.append("Comment", $("#email-comment-ques").val());
    formData.append("CC", $("#emailCC-ques").val());
    formData.append("bccMe", $("#bccMe-ques").is(":checked"));
    blockUI();
    $.ajax({
        url: '/Questionnaire/SendEmail',
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            unblockUI();
            $("#send-email-questionnaire-modal").modal('hide');
            $('body').removeClass('modal-open');
            $("#emailTO-ques").val("");
            $("#emailSubject-ques").val("");
            $("#email-comment-ques").val("");
            $("#hdn-ques-client").val("");
            $("#hdn-ques").val("");
            $("#emailSubject-ques").val("");

            return showSuccessToast(ScriptResourcesList['scriptEmailedSuccessfully']);
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function sendQuestionnaireEmailPOSTPotential() {
    if ($("#emailTO-ques-p").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterEmail']);
        return false;
    }
    if ($("#emailSubject-ques-p").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterSubject']);
        return false;
    }
    if ($("#emailCC-ques-p").val()) {
        var cc = $("#emailCC-ques-p").val();
        if (cc != null) {
            for (var i = 0; i < cc.length; i++) {

                if (!validateEmail(cc[i].trim())) {
                    return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
                }
            }
        }

    }
    if ($("#email-comment-ques-p").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterMessage']);
        return false;
    }

    var formData = new FormData();
    formData.append("Client", $("#hdn-ques-client-p").val());
    formData.append("Ques", $("#hdn-ques-p").val());
    formData.append("Subject", $("#emailSubject-ques-p").val());
    formData.append("To", $("#emailTO-ques-p").val());
    formData.append("Comment", $("#email-comment-ques-p").val());
    formData.append("CC", $("#emailCC-ques-p").val());
    formData.append("bccMe", $("#bccMe-ques-p").is(":checked"));
    blockUI();
    $.ajax({
        url: '/Questionnaire/SendEmailP',
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            unblockUI();
            $("#send-email-questionnaire-modal-p").modal('hide');
            $('body').removeClass('modal-open');
            $("#emailTO-ques-p").val("");
            $("#emailSubject-ques-p").val("");
            $("#email-comment-ques-p").val("");
            $("#hdn-ques-client-p").val("");
            $("#hdn-ques-p").val("");
            $("#emailSubject-ques-p").val("");

            return showSuccessToast(ScriptResourcesList['scriptEmailedSuccessfully']);
        },
        error: function (er) {
            unblockUI();
            return showErrorToast(ScriptResourcesList['scriptOperationFailed']);
        }

    });
}
function addNewMeetingInner() {
    if ($("#meeting-date-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterDate']);
    }
    if ($("#select-meeting-time-hours-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    if ($("#select-meeting-time-min-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    if ($("#select-meeting-time-min-e-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterEndTime']);
    }
    if ($("#select-meeting-time-min-e-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    var stt = new Date("November 13, 2013 " + $("#select-meeting-time-hours-inner").val() + ":" + $("#select-meeting-time-min-inner").val() + " " + $("#select-meeting-time-AMPM-inner").val());
    stt = stt.getTime();
    var endt = new Date("November 13, 2013 " + $("#select-meeting-time-hours-e-inner").val() + ":" + $("#select-meeting-time-min-e-inner").val() + " " + $("#select-meeting-time-AMPM-e-inner").val());
    endt = endt.getTime();
    if (endt < stt) {
        return showWarningToast(ScriptResourcesList['scriptEndTimeShouldBeGreater']);
    }
    if ($("#meeting-title-e-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterTitle']);
    }

    if ($("#meeting-detail-e-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterDetail']);
    }

    var users = [];
    $("#new-meeting-followers-in .hdn-new-meeting-follower").each(function () {
        users.push($(this).val());
    });
    var startDateTime = $("#meeting-date-inner").val() + " " + $("#select-meeting-time-hours-inner").val() + ":" + $("#select-meeting-time-min-inner").val() + " " + $("#select-meeting-time-AMPM-inner").val();
    var endDateTime = $("#meeting-date-inner").val() + " " + $("#select-meeting-time-hours-e-inner").val() + ":" + $("#select-meeting-time-min-e-inner").val() + " " + $("#select-meeting-time-AMPM-e-inner").val();
    var data = { Title: $("#meeting-title-e-inner").val(), Description: $("#meeting-detail-e-inner").val(), StartDateTime: startDateTime, EndDateTime: endDateTime, Users: users, FKClientID: $("#selected-client-id").val(), ClientName: $("#selected-client-name").html(), IsPotentail: false, MeetingType: $("#select-new-meeting-type-e-inner").val() };


    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/AddNew',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                $("#meeting-add-modal").modal('hide');
                $('body').removeClass('modal-open');
                getClientMeeting();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addNewMeetingInnerPotential() {
    if ($("#meeting-date-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterDate']);
    }
    if ($("#select-meeting-time-hours-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    if ($("#select-meeting-time-min-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    if ($("#select-meeting-time-min-e-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterEndTime']);
    }
    if ($("#select-meeting-time-min-e-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterStartTime']);
    }
    var stt = new Date("November 13, 2013 " + $("#select-meeting-time-hours-inner").val() + ":" + $("#select-meeting-time-min-inner").val() + " " + $("#select-meeting-time-AMPM-inner").val());
    stt = stt.getTime();
    var endt = new Date("November 13, 2013 " + $("#select-meeting-time-hours-e-inner").val() + ":" + $("#select-meeting-time-min-e-inner").val() + " " + $("#select-meeting-time-AMPM-e-inner").val());
    endt = endt.getTime();
    if (endt < stt) {
        return showWarningToast(ScriptResourcesList['scriptEndTimeShouldBeGreater']);
    }
    if ($("#meeting-title-e-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterTitle']);
    }

    if ($("#meeting-detail-e-inner").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterDetail']);
    }

    var users = [];
    $("#new-meeting-followers-in .hdn-new-meeting-follower").each(function () {
        users.push($(this).val());
    });
    var startDateTime = $("#meeting-date-inner").val() + " " + $("#select-meeting-time-hours-inner").val() + ":" + $("#select-meeting-time-min-inner").val() + " " + $("#select-meeting-time-AMPM-inner").val();
    var endDateTime = $("#meeting-date-inner").val() + " " + $("#select-meeting-time-hours-e-inner").val() + ":" + $("#select-meeting-time-min-e-inner").val() + " " + $("#select-meeting-time-AMPM-e-inner").val();
    var data = { Title: $("#meeting-title-e-inner").val(), Description: $("#meeting-detail-e-inner").val(), StartDateTime: startDateTime, EndDateTime: endDateTime, Users: users, FKClientID: $("#pClientID").val(), ClientName: $("#potential-client-name").html(), IsPotentail: true, MeetingType: $("#select-new-meeting-type-e-inner").val() };

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Meeting/AddNew',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                $("#meeting-add-modal").modal('hide');
                $('body').removeClass('modal-open');
                showPMeetings($("#pClientID").val(), $(".pclient-nav li.active"));
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addNewTaskInnerSummary(id) {
    $("#task-date-error-inner").hide();
    $("#task-detail-error-inner").hide();
    $("#task-title-error-inner").hide();
    if ($("#task-date-inner").val() == "") {
        $("#task-date-error-inner").show();
        return false;
    }
    if ($("#task-title-inner").val() == "") {
        $("#task-title-error-inner").show();
        return false;
    }
    if ($("#task-detail-inner").val() == "") {
        $("#task-detail-error-inner").show();
        return false;
    }
    var users = [];
    $("#new-task-followers-in .hdn-new-task-follower").each(function () {
        users.push($(this).val());
    });
    var data = { TaskShortDesc: $("#task-title-inner").val(), TaskDetails: $("#task-detail-inner").val(), TaskDue: $("#task-date-inner").val(), users: users, FKClientID: id, ClientName: $("#task-client-name-inner").html(), potential: false };


    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AddNewTask',
        data: JSON.stringify(data),
        async: false,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                blockUI();
                $.ajax({
                    type: "GET",
                    contentType: "html",
                    url: '/Client/ClientTasksSummary?id=' + id,
                    async: true,
                    success: function (data) {
                        unblockUI();
                        $("#client-task-modal-body").html("");
                        $("#client-task-modal-body").html(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        unblockUI();
                        handleErrors(textStatus);
                    }
                });
            }

        }
        , error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function addNewTaskInner() {
    $("#task-date-error-inner").hide();
    $("#task-detail-error-inner").hide();
    $("#task-title-error-inner").hide();
    if ($("#task-date-inner").val() == "") {
        $("#task-date-error-inner").show();
        return false;
    }
    if ($("#task-title-inner").val() == "") {
        $("#task-title-error-inner").show();
        return false;
    }
    if ($("#task-detail-inner").val() == "") {
        $("#task-detail-error-inner").show();
        return false;
    }
    var users = [];
    $("#new-task-followers-in .hdn-new-task-follower").each(function () {
        users.push($(this).val());
    });
    var data = { TaskShortDesc: $("#task-title-inner").val(), TaskDetails: $("#task-detail-inner").val(), TaskDue: $("#task-date-inner").val(), users: users, FKClientID: $("#selected-client-id").val(), ClientName: $("#selected-client-name").html(), potential: false };


    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AddNewTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                $("#task-add-modal").modal('hide');
                $('body').removeClass('modal-open');
                var tasksss = parseInt($("#tasks-count-client").html());
                $("#tasks-count-client").html((tasksss + 1));
                getClientTask();
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addNewTaskInnerPotentialSummary(id, client) {
    $("#task-date-error-inner").hide();
    $("#task-detail-error-inner").hide();
    $("#task-title-error-inner").hide();
    if ($("#task-date-inner").val() == "") {
        $("#task-date-error-inner").show();
        return false;
    }
    if ($("#task-title-inner").val() == "") {
        $("#task-title-error-inner").show();
        return false;
    }
    if ($("#task-detail-inner").val() == "") {
        $("#task-detail-error-inner").show();
        return false;
    }
    var users = [];
    $("#new-task-followers-in-p .hdn-new-task-follower").each(function () {
        users.push($(this).val());
    });
    if (client == 1) {
        var data = { TaskShortDesc: $("#task-title-inner").val(), TaskDetails: $("#task-detail-inner").val(), TaskDue: $("#task-date-inner").val(), users: users, FKClientID: id, ClientName: $("#client-name-potential-inner").val(), potential: false };
    }
    else {
        var data = { TaskShortDesc: $("#task-title-inner").val(), TaskDetails: $("#task-detail-inner").val(), TaskDue: $("#task-date-inner").val(), users: users, FKClientID: id, ClientName: $("#client-name-potential-inner").val(), potential: true };
    }



    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AddNewTaskPartial',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                var url = '/Client/ClientTasksPartialP?id=' + id;
                if (client == 1) {
                    var url = '/Client/ClientTasksPartial?id=' + id;
                }
                blockUI();
                $.ajax({
                    type: "GET",
                    contentType: "html",
                    url: url,
                    async: true,
                    success: function (data) {
                        unblockUI();
                        $("#client-task-modal-body").html("");
                        $("#client-task-modal-body").html(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        unblockUI();
                        handleErrors(textStatus);
                    }
                });
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addNewTaskInnerPotential() {
    $("#task-date-error-inner").hide();
    $("#task-detail-error-inner").hide();
    $("#task-title-error-inner").hide();
    if ($("#task-date-inner").val() == "") {
        $("#task-date-error-inner").show();
        return false;
    }
    if ($("#task-title-inner").val() == "") {
        $("#task-title-error-inner").show();
        return false;
    }
    if ($("#task-detail-inner").val() == "") {
        $("#task-detail-error-inner").show();
        return false;
    }
    var users = [];
    $("#new-task-followers-in-p .hdn-new-task-follower").each(function () {
        users.push($(this).val());
    });
    var data = { TaskShortDesc: $("#task-title-inner").val(), TaskDetails: $("#task-detail-inner").val(), TaskDue: $("#task-date-inner").val(), users: users, FKClientID: $("#pClientID").val(), ClientName: $("#potential-client-name").html(), potential: true };


    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AddNewTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                $("#task-add-modal").modal('hide');
                $('body').removeClass('modal-open');
                showPTasks($("#pClientID").val());
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function makeItInactive(ref, id) {

    if (confirm(ScriptResourcesList['scriptConfirmDeactivateClient'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/ActiveInactive',
            data: JSON.stringify({ status: false, ClientID: id }),
            async: true,
            success: function (data) {
                unblockUI();
                successToast();
                $(".trp-" + id).remove();
                $(".tr-" + id).remove();

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function showTaskDetailsPopupSummaryNew(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/TasksViewDetails?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $(ref).parent().next(".todos_detail").html(data);
            $(ref).parent().next(".todos_detail").show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function showTaskDetailsPopupSummary(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/TasksViewDetails?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $(ref).next(".todos_detail").html(data);
            $(ref).next(".todos_detail").show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function showTaskDetailsPopup(id, date) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/TasksViewDetails?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#inner-task-detail").html(data);
            $("#hdn-task-id-f").val(id);
            $("#task-date-re-inner").val(date);
            $("#task-detail-modal .main-tasks-details").show();
            $("#task-detail-modal .cross-btn").remove();
            $("#task-detail-modal #client-link-" + id).remove();
            $("#task-detail-modal").modal('show');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function showMeetingNotesPopup(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Meeting/Detail?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#inner-meeting-detail").html(data);
            $("#hdn-meeting-id-f").val(id);
            $("#meeting-detail-modal .main-tasks-details").show();
            $("#meeting-detail-modal .cross-btn").remove();
            $("#meeting-detail-modal #client-link-" + id).remove();
            $("#meeting-detail-modal").modal('show');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });


}
function saveNoteForTaskP() {

    $("#error-message").hide();
    if ($("#file-note-message-task").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterNotes']);
        return false;
    }
    var obj = new Object();
    obj.client = $("#task-to-file-client-p").val();
    obj.note = $("#file-note-message-task").val();
    obj.id = "";
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/FileNotesP',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $("#convert-file-modal-potential").modal('hide');
            $("#convert-file-modal-potential .detail_body").html("");
            $('body').removeClass('modal-open');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function saveNoteForTask() {

    $("#error-message").hide();
    if ($("#file-note-message-task").val() == "") {
        showErrorToast(ScriptResourcesList['scriptPleaseEnterNotes']);
        return false;
    }
    var obj = new Object();
    obj.client = $("#task-to-file-client").val();
    obj.note = $("#file-note-message-task").val();
    obj.id = "";
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/FileNotes',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $("#convert-file-modal").modal('hide');
            $("#convert-file-modal .detail_body").html("");
            $('body').removeClass('modal-open');
            if ($("#tabFileNote").parent().attr("class") === "active") {
                getFileNotes();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function converToFileNotePotential(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/TasksViewDetailsFileNote?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#convert-file-modal-potential .detail_body").html(data);
            $("#task-to-file-client-p").val($("#pClientID").val());
            $("#convert-file-modal-potential").modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function converToFileNotePotentialDashboard(id, client) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/TasksViewDetailsFileNote?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#convert-file-modal-potential .detail_body").html(data);
            $("#task-to-file-client-p").val(client);
            $("#convert-file-modal-potential").modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function converToFileNote(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/TasksViewDetailsFileNote?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#convert-file-modal .detail_body").html(data);
            $("#task-to-file-client").val($("#selected-client-id").val());
            $("#convert-file-modal").modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function converToFileNoteDashboard(id, client) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/TasksViewDetailsFileNote?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#convert-file-modal .detail_body").html(data);
            $("#task-to-file-client").val(client);
            $("#convert-file-modal").modal('show');
            $("#client-task-modal-body").css("z-index", 9999);
            $("#convert-file-modal").css("z-index", 10000);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function showSummaryForTasks(t) {
    if (t == "Pending Task") {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/Dashboard/PendingTasks',
            async: true,
            success: function (data) {
                unblockUI();
                $("#clientDailyReport").html("");
                $("#clientDailyReport").html(data);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
    else if (t == "Todays Task") {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/Dashboard/TodayTasks',
            async: true,
            success: function (data) {
                unblockUI();
                $("#clientDailyReport").html("");
                $("#clientDailyReport").html(data);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
    else if (t == "Reminders") {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/Dashboard/ShowCustomRemindersD',
            async: true,
            success: function (data) {
                unblockUI();
                $("#clientDailyReport").html("");
                $("#clientDailyReport").html(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
}
function showSummaryForCLient(l) {
    if (l == "Active Clients") {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/Dashboard/ShowSummaryBack',
            async: true,
            success: function (data) {
                unblockUI();
                $("#clientSummaryReport").html("");
                $("#clientSummaryReport").html(data);
                $("#clientSummaryReportH").html(l);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
    else if (l == "Potential Clients") {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/Dashboard/ClientDashboardSummery',
            async: true,
            success: function (data) {
                unblockUI();
                $("#clientSummaryReport").html("");
                $("#clientSummaryReport").html(data);
                $("#clientSummaryReportH").html(l);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
    else if (l == "Students") {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/Dashboard/ShowStudentSummary',
            async: true,
            success: function (data) {
                unblockUI();
                $("#clientSummaryReport").html("");
                $("#clientSummaryReport").html(data);
                $("#clientSummaryReportH").html(l);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }
}
function customRange(input) {

    if (input.id == 'EndDate') {
        var minDate = new Date($('#StartDate').val());
        var maxDate = new Date($('#StartDate').val());
        minDate.setDate(minDate.getDate() + 1);
        maxDate.setDate(maxDate.getDate() + 29);

        return {
            minDate: minDate,
            maxDate: maxDate
        };
    }

    return {}

}
function showSummaryForAccountsGraph(count, date) {
    var obj = new Object();
    obj.DateFrom = $("#StartDateAccounts").val();
    obj.DateTo = $("#EndDateAccounts").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AccountsDetail',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#accountGraphReport").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });


}
function getClientGraphDetail(count, date) {

    var obj = new Object();
    obj.DateFrom = date;
    obj.User = $("#clientUser").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/ClientDetail',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#clientDailyReport").html(data);
            var hm = "Client Added on  : " + date;
            $("#clientDetailHeader").html(hm);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });


}
function getClientGraph() {

    var sd = $("#StartDate").val();
    var ed = $("#EndDate").val();
    if (sd == "") {
        return showErrorToast(ScriptResourcesList['scriptPleaseSelectDateFrom']);
    }
    if (ed == "") {
        return showErrorToast(ScriptResourcesList['scriptPleaseSelectDateTo']);
    }


    blockUI();
    var obj = new Object();
    obj.DateFrom = sd;
    obj.DateTo = ed;
    obj.User = $("#clientUser").val();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/ClientDetailGraph',
        data: JSON.stringify(obj),
        async: false,
        success: function (data) {
            unblockUI();
            $("#clientDailyReport").html("");
            $("#clientBarGraph").html("");
            var total = 0;
            if (data.length > 0) {

                var result = [];
                for (var i = 0; i < data.length; i++) {
                    var obj = new Object();
                    obj.y = data[i].DateString;
                    obj.a = data[i].Count;
                    total = total + parseInt(data[i].Count);
                    result.push(obj);
                }
                Morris.Bar({
                    element: 'clientBarGraph',

                    data: result,
                    xkey: 'y',
                    ykeys: ['a'],
                    labels: [ScriptResourcesList['scriptClient'], ScriptResourcesList['scriptCount']],
                    xLabelAngle: 45,
                    resize: true,
                });

                $("#client-ana-total").html('<span class="label label-success">' + ScriptResourcesList['scriptTotal'] + ' : ' + total + ' </span>');
            }
            else {
                var html = '<div class=" nav-tabs">';
                html += ' <span class="reminder_heading">' + ScriptResourcesList['scriptNoRecordFound'] + '</span> </div>';
                $("#clientBarGraph").html(html);
                $("#client-ana-total").html('');
            }
            $("#clientBarGraph svg rect,#clientBarGraph .morris-hover").click(function () {
                // Find data and date in the actual morris diply below the graph.
                thisDate = $("#clientBarGraph .morris-hover-row-label").html();
                thisDataHtml = $("#clientBarGraph .morris-hover-point").html().split(":");
                thisData = thisDataHtml[1].trim();
                getClientGraphDetail(thisData, thisDate);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });


}

function getClientGraphActive() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ClientGraphActive',
        async: true,
        success: function (data) {
            unblockUI();
            $("#clientBarGraphActive").html("");
            if (data.length > 0) {

                var result = [];
                for (var i = 0; i < data.length; i++) {
                    var obj = new Object();
                    obj.y = data[i].Name;
                    obj.a = data[i].Count;
                    result.push(obj);
                }
                Morris.Bar({
                    element: 'clientBarGraphActive',
                    data: result,
                    xkey: 'y',
                    ykeys: ['a'],
                    labels: [ScriptResourcesList['scriptDays'], ScriptResourcesList['scriptDays']],
                    xLabelAngle: 45,
                    resize: true,
                    horizontal: true,
                    stacked: true,
                    barColors: ['#d9534f']
                });


            }
            else {
                var html = '<div class=" nav-tabs">';
                html += ' <span class="reminder_heading">' + ScriptResourcesList['scriptNoRecordFound'] + '</span> </div>';
                $("#clientBarGraphActive").html(html);


            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });



}
function getClientGraphIdel() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ClientGraphIdle',
        async: true,
        success: function (data) {
            unblockUI();
            $("#clientBarGraphIdel").html("");
            if (data.length > 0) {

                var result = [];
                for (var i = 0; i < data.length; i++) {
                    var obj = new Object();
                    obj.y = data[i].Name;
                    obj.a = data[i].Count;
                    result.push(obj);
                }
                Morris.Bar({
                    element: 'clientBarGraphIdel',
                    data: result,
                    xkey: 'y',
                    ykeys: ['a'],
                    labels: [ScriptResourcesList['scriptDays'], ScriptResourcesList['scriptDays']],
                    xLabelAngle: 45,
                    resize: true,
                    horizontal: true,
                    stacked: true,
                    barColors: ['#53b4ad']
                });


            }
            else {
                var html = '<div class=" nav-tabs">';
                html += ' <span class="reminder_heading">' + ScriptResourcesList['scriptNoRecordFound'] + '</span> </div>';
                $("#clientBarGraphIdel").html(html);


            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });



}
function getClientTags(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CInfo/GetClientTags',
        async: true,
        success: function (data) {
            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }

            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function addClientTag() {
    if ($("#hdn-client-tag").val() != "") {
        return updateClientTag();
    }

    $("#client-tag-modal .errorSpanModal").html("");
    var name = $("#client-tag-name").val();


    if (name == "") {
        $("#client-tag-name").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }


    var obj = new Object();
    obj.Name = name;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/InsertClientTag',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);

            $('#client-tag-modal').modal('hide');
            $('body').removeClass('modal-open');
            getClientTags();


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function updateClientTagGet(id, name) {
    $("#client-tag-modal .errorSpanModal").html("");
    $("#hdn-client-tag").val(id);
    $("#client-tag-name").val(name);
    $('#client-tag-modal').modal('show');
}
function updateClientTag() {
    $("#client-tag-modal .errorSpanModal").html("");
    var name = $("#client-tag-name").val();

    if (name == "") {
        $("#client-tag-name").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }

    var obj = new Object();
    obj.ID = $("#hdn-client-tag").val();
    obj.Name = name;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/UpdateClientTag',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
            $("#client-tag-name").val("");
            $("#hdn-client-tag").val("");
            $('#client-tag-modal').modal('hide');
            $('body').removeClass('modal-open');
            getClientTags();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function deleteClientTag(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/DeleteClientTag',
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
function changeClientTag(ref) {
    var id = $(ref).val();
    if (id == "0") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectTag']);

    }
    var data = { ID: id, CLIENT: $("#selected-client-id").val() };
    if (confirm("Are you sure you want to add client tag ?")) {
        var name = $('#selectFKClientTagID option:selected').text();
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/AssignClientTag',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                unblockUI();
                if (data == "AE") {
                    return showErrorToast(ScriptResourcesList['scriptTagAlreadyAdded']);

                }
                if (data == false) {
                    return errorToast();

                }
                successToast();
                var html = '<div class="hide_btn_cp"><i onclick="deleteAssignedTag(this,' + id + ')" class="fa fa-times" aria-hidden="true"></i>' + name + '</div>';

                $("#clientTags").append(html);
                $(ref).selectpicker('val', '');

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }


}
function deleteAssignedTag(ref, id) {

    var data = { ID: id, CLIENT: $("#selected-client-id").val() };
    if (confirm(ScriptResourcesList['scriptConfirmRemoveTag'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/UnAssignClientTag',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == true) {
                    $(ref).parent().remove();
                    showSuccessToast(ScriptResourcesList['scriptDeleted']);


                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }



            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }

}
function viewFilePrint(id, ref) {
    $("#tab11default").html("");
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/FilePrint?id=' + id,
        async: true,
        success: function (data) {
            $("#tab11default").html("");
            $("#tab11default").html(data);
            if (ref) {
                $(".client-inner-ul li").removeClass("active");
                $(ref).parent().addClass("active");

            }
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function filterRecordsForFilePrint() {

    var data = {
        id: $("#selected-client-id").val(), fileNotes: $("#filterRecords-1").is(":checked"),
        email: $("#filterRecords-2").is(":checked"), tasks: $("#filterRecords-3").is(":checked")
    };

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/FilePrintPartial',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $("#main-file-print").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function printClientFilePrint() {
    var html = "<div style='width:100%;float:left;margin:5px;'><h3>Client File</h3></div>";
    html += "<div style='width:100%;float:left;margin:5px;text-align:center'>" + $("#selected-client-name").html() + "</div>";

    $("#main-file-print .activity_box").each(function () {
        var date = $(this).find(".log-date").html();
        var note = $(this).find(".log-note").html();
        var type = $(this).find(".log-type").html();
        html += "<div style='width:100%;float:left;margin:5px;font-size:7px;'>Date :" + date + "  Type :" + type + "</div>";
        html += "<div style='width:100%;float:left;margin:5px;font-size:10px;'>" + note + "</div>";
    });
    Popup(html);
}

function removeFilePrint(ref) {
    $(ref).parent().remove();
}

function deleteFileCompany(id, ref) {


    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Document/DeleteFile',
            data: JSON.stringify({ docId: id }),
            async: true,
            success: function (data) {

                if (data) {
                    $(ref).parent().parent().parent().remove();
                    setDocSN();
                    return showSuccessToast(ScriptResourcesList['scriptDeleted']);
                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function showAddDocCompany(ref) {

    if (ref) {
        $(".add-new-doc").show();
        $("#hide-new-doc-comp").show();
        $("#show-new-doc-comp").hide();
    }
    else {
        $(".add-new-doc").hide();
        $("#hide-new-doc-comp").hide();
        $("#show-new-doc-comp").show();
    }
}

function getCompanyDocuments(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Document/GetDocuments',
        async: true,
        success: function (data) {

            unblockUI();
            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getCompanyDocumentsAgent(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Document/GetDocumentsAgent',
        async: true,
        success: function (data) {

            unblockUI();
            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getDailyEmailSettings(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CInfo/GetEmailSettings',
        async: true,
        success: function (data) {

            unblockUI();
            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getCompanyDocsForSlection() {
    blockUI();

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Document/GetDocsForSelection',
        async: false,
        success: function (data) {
            unblockUI();
            $("#client-doc-modal .modal-body").html("");
            $("#client-doc-modal .modal-body").html(data);
            $('#client-doc-modal').modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function getCompanyDocsForSlectionPDF() {
    blockUI();

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Document/GetDocsForSelectionPDF',
        async: false,
        success: function (data) {
            unblockUI();
            $("#getClientDocs").html("");
            $("#getClientDocs").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function removeDivEmailAtt(ref) {
    $(ref).parent().remove();
}
function removeDivEmailBulk(ref) {
    $(ref).parent().remove();
}
function getNewEmailIMAP(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Email/NEWEMail',
        async: true,
        success: function (data) {
            clearSelectedClient();
            unblockUI();
            $("#email-panel").html("");
            $("#email-panel").html(data);
            $(".nav-email-int li").removeClass("active");
            $(ref).parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (textStatus == "401") {
                handleErrors(textStatus);
            }
            else {
                unblockUI();
                return showWarningToast(ScriptResourcesList['scriptSetIMAPSettings']);

            }

        }
    });
}
function showPotentialClientForImapEmail(ref) {
    if ($(ref).is(':checked')) {
        $("#imapPClientSearch").show();
        $("#imapClientSearch").hide();
    }
    else {
        $("#imapClientSearch").show();
        $("#imapPClientSearch").hide();
    }
}
function getNewEmailIMAPMessageBox(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Email/SendEmail?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#imap-new-email").html("");
            $("#imap-new-email").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            if (textStatus == "401") {
                handleErrors(textStatus);
            }
            else {
                return showWarningToast(ScriptResourcesList['scriptSetIMAPSettings']);
            }

        }
    });
}
function getNewEmailIMAPMessageBoxP(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Email/SendEmailP?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#imap-new-email").html("");
            $("#imap-new-email").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            if (textStatus == "401") {
                handleErrors(textStatus);
            }
            else {
                return showWarningToast(ScriptResourcesList['scriptSetIMAPSettings']);
            }

        }
    });
}
function getClientDocsForSlectionIMAP(id) {
    blockUI();

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetClientDocsForSelection?id=' + id,
        async: false,
        success: function (data) {
            unblockUI();

            $("#client-doc-modal .modal-body").html("");
            $("#client-doc-modal .modal-body").html(data);
            $('#client-doc-modal').modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function getImportantEmailsIMAP(id) {
    blockUI();

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetImportantEmails?id=' + id,
        async: false,
        success: function (data) {
            unblockUI();

            $("#visa-officer-modal .modal-body").html("");
            $("#visa-officer-modal .modal-body").html(data);
            $('#visa-officer-modal').modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function getClientEmailsIMAPData() {
    if ($.trim($("#visa-officer-modal .modal-body").html()) != "") {
        $('#visa-officer-modal').modal('show');
    }
    else {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/Email/GetClientEmailsC',
            async: false,
            success: function (data) {
                unblockUI();
                $("#visa-officer-modal .modal-body").html("");
                $("#visa-officer-modal .modal-body").html(data);
                $('#visa-officer-modal').modal('show');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }
}
function getClientEmailsIMAP() {
    if ($.trim($("#visa-officer-modal .modal-body").html()) != "") {
        $('#visa-officer-modal').modal('show');
    }
    else {
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/Email/GetClientEmails',
            async: false,
            success: function (data) {
                unblockUI();
                $("#visa-officer-modal .modal-body").html("");
                $("#visa-officer-modal .modal-body").html(data);
                $('#visa-officer-modal').modal('show');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }
}
function getClientDocsForSlectionIMAPPotential(id) {
    blockUI();

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetClientDocsForSelectionP?id=' + id,
        async: false,
        success: function (data) {
            unblockUI();

            $("#client-doc-modal .modal-body").html("");
            $("#client-doc-modal .modal-body").html(data);
            $('#client-doc-modal').modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function getAgentDetailsClientPayment(id, client, ref) {
    var data = {
        FKClientID: client,
        Agent: id
    };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Management/AgentClientPaymentPlan',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            var html = "";
            html += "<tr><td id='row' colspan='6'>" + data + "</td> </tr>";
            $(ref).parent().parent().after(html);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getAgentDetailsClientPaymentPortal(id, client, ref) {
    var data = {
        FKClientID: client,
        Agent: id
    };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Management/AgentClientPaymentPlanPortal',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            var nextRow = $(ref).parent().parent();
            var html = "";
            html += "<tr class='plan-detail'><td id='row' colspan='7'>" + data + "</td> </tr>";
            if ($(nextRow).next().hasClass('plan-detail')) {
                $(nextRow).next().replaceWith(html)
            }
            else {
                $(nextRow).after(html);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function openAddAgentComissionPortal(id, client, agent, amount, date) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Accounts/ClientOutgoingAdd?id=' + client,
        async: false,
        success: function (data) {
            unblockUI();
            $("#add-outgoing-payment-uni .modal-body").html(data);
            $("#paymentAmountOut-u").val(amount);
            $("#hdn-amount").val(amount);
            $("#paymentAgent-u").val(agent);
            $("#paymentAgent-u").attr('readonly', true);
            $("#paymentDateOut-u").val(date);
            $("#hdn-reminder-agent-u").val(id);
            $("#hdn-page-agent-u").val(3);
            $("#hdn-agent-FKClientID").val(client);
            $("#paymentDateOut-u").datepicker({
                dateFormat: 'dd/mm/yy',
                showOn: "button",
                buttonImage: "/Content/Images/calendar.png",
                buttonImageOnly: true,
                defaultDate: new Date(),
                buttonText: "Select date",
                changeMonth: true,
                changeYear: true,
                yearRange: "0:+10",
                dateFormat: 'dd/mm/yy'
            });
            $("#add-outgoing-payment-uni").modal("show");
            $("#add-outgoing-payment-uni").css("z-index", 10000);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function deletePaymentPlan(id, ref) {

    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Management/DeletePaymentPlan',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {

                if (data) {
                    $(ref).parent().parent().remove();
                    return showSuccessToast(ScriptResourcesList['scriptDeleted']);

                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong'])

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function showCategoryCheckListsEmail(id, ref) {
    if ($(ref).parent().parent().find(".sub-category-div").is(":visible") == false) {
        blockUI();
        $.ajax(
            {
                type: "GET",
                contentType: "html",
                url: '/CMS/AllCheckListsEmail?id=' + id,
                aync: true,
                success: function (data) {
                    $(ref).addClass("fa-caret-down");
                    $(ref).removeClass("fa-caret-up");
                    $(ref).parent().parent().find(".sub-category-div").html(data);
                    $(ref).parent().parent().find(".sub-category-div").show("slow");
                    unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleErrors(textStatus);
                    unblockUI();
                }
            })
    }
    else {
        $(ref).parent().parent().find(".sub-category-div").hide("slow");
        $(ref).removeClass("fa-caret-down");
        $(ref).addClass("fa-caret-up");
    }
}

function showListTasksEmail(id, ref) {
    if ($(ref).parent().parent().find(".status-detail-box").is(":visible") == false) {
        blockUI();
        $.ajax(
            {
                type: "GET",
                contentType: "html",
                url: '/CMS/AllCheckListTasksEmail?id=' + id,
                aync: true,
                success: function (data) {
                    $(ref).addClass("fa-caret-down");
                    $(ref).removeClass("fa-caret-up");
                    $(ref).parent().parent().find(".status-detail-box").html(data);
                    $(ref).parent().parent().find(".status-detail-box").show("slow");
                    $(ref).parent().parent().find(".status-detail-box").find(".hdn-check-id").val(id);

                    unblockUI();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleErrors(textStatus);
                    unblockUI();
                }


            })

    }
    else {
        $(ref).parent().parent().find(".status-detail-box").hide("slow");
        $(ref).removeClass("fa-caret-down");
        $(ref).addClass("fa-caret-up");
    }

}

function getChecklistsForSlection() {
    blockUI();

    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CMS/AllCategoriesEmail',
        async: false,
        success: function (data) {
            unblockUI();
            $("#client-checklist-modal .modal-body").html("");
            $("#client-checklist-modal .modal-body").html(data);
            $('#client-checklist-modal').modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}

function getSelectedChecklistItem(id, name) {
    var html = "";

    var ids = [];
    $("#client-checklist-modal .check-email:checked").each(function () {
        var id = $(this).parent().find(".file-id").val();
        var name = $(this).parent().find(".file-name").val();
        var url = $(this).parent().find(".file-url").val();
        var obj = new Object();
        obj.ID = $(this).attr("value");
        obj.Name = $.trim($(this).parent().parent().find(".new-task-name").html());
        ids.push(obj);
    });
    if (ids.length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectItemChecklist']);
    }
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/GetCheckListPDF',
        data: JSON.stringify({ ids: ids }),
        async: true,
        success: function (data) {
            unblockUI();
            html += '<div class="hide_btn client-selected-doc"><input type="hidden" value="' + data.name + '" class="client-selected-doc-name" /><input type="hidden" value="' + data.url + '" class="client-selected-doc-url" /><i onclick="removeDivEmailAtt(this)" class="fa fa-times" aria-hidden="true"></i><a href="/Client/DownloadFileStream?blob=' + data.url + '&filename=' + data.name + '">' + data.name + '</a></div>';
            html += "<div style='clear:both;'></div>";
            $("#selectedClientDocs").append(html);
            $("#client-checklist-modal").modal('hide');
            $('body').removeClass('modal-open');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}

function updateInquiry(id) {
    var ID = id;
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/getInquiryForm?ID=' + ID + ' ',
        async: true,
        success: function (data) {
            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function addInquiryAsPotentialClient(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/ConvertInquiryPotentialClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {
            $(ref).parent().parent().hide();
            showSuccessToast(ScriptResourcesList['scriptAdded']);

            var count = $("#webassessment-count").html();
            var result = parseInt(count) - 1;
            $("#webassessment-count").html(result);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function addInquiryAsAClient(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/addInquiryAsAClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {

            var count = $("#webassessment-count").html();
            var result = parseInt(count) - 1;
            $("#webassessment-count").html(result);
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            showClientDetailViews(data);


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function updateMigrationInquiry(id) {
    var ID = id;
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/getMigrationInquiryForm?ID=' + ID + ' ',
        async: true,
        success: function (data) {
            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function addMigrationInquiryAsPotentialClient(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/ConvertMigrationInquiryPotentialClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {
            $(ref).parent().parent().hide();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            var count = $("#webassessment-count").html();
            var result = parseInt(count) - 1;
            $("#webassessment-count").html(result);
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function addMigrationInquiryAsAClient(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Questionnaire/addMigrationInquiryAsAClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {

            var count = $("#webassessment-count").html();
            var result = parseInt(count) - 1;
            $("#webassessment-count").html(result);
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            showClientDetailViews(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function showWebListMigrationNetwork(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Questionnaire/getQuestionnaireClientInformationMN',
        async: true,
        success: function (data) {

            $("#clientp-content").html("");
            $("#clientp-content").html(data);
            $(ref).parent().addClass("active");
            $("#webAssessmentUL li").removeClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function LightboxGroupLink(id) {
    var href = document.getElementById(id).getAttribute('href');
    html5Lightbox.showItem(href);
    $('#html5-watermark').hide();
}

function deleteMNQuestionnaire(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var data = { ID: id };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Questionnaire/DeleteMigrationInqury',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                if (data) {
                    $(ref).parent().parent().remove();
                    successToast();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}

function deleteInqury(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var data = { ID: id };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Questionnaire/DeleteInqury',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                if (data) {
                    $(ref).parent().parent().remove();
                    successToast();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}

function deleteQuestionnaire(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var data = { ID: id };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Questionnaire/DeleteQuestionnaire',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                if (data) {
                    $(ref).parent().parent().remove();
                    successToast();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}
function deleteQuestionnaire2(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var data = { ID: id };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Questionnaire/DeleteQuestionnaire2',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                if (data) {
                    $(ref).parent().parent().remove();
                    successToast();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}
function undoContractLink(count, type, id) {
    if (type == 1) {
        return false
    }
    var content = "";
    if (type == 2) {
        content = $("#conract-item-" + count).parent().find(".contract-content").val();
    }
    //$("#conract-item-" + count).summernote('code', content);
    $("#conract-item-" + count).parent().find(".btn-info").removeClass("hidden");
    $("#conract-item-" + count).parent().find(".undo-link").addClass("hidden");
    $("#conract-item-" + count).parent().prev(".link-info").remove();
    //$("#conract-item-" + count).parent().removeClass("contract-item-not");
    //$("#conract-item-" + count).parent().addClass("contract-item");
    $("#conract-check-" + count).attr("checked", true);
    $("#conract-check-" + count).attr("disabled", false);
}
function generateContractLink(count, type, id) {
    var content = "";
    if (type == 1) {
        return false;
    }
    if (type == 2) {
        content = $("#conract-item-" + count).val();
    }
    blockUI();
    $("#conract-item-" + count).parent().find(".contract-content").val(content);
    var data = { id: $("#selected-client-id").val(), content: content, type: type, template: id };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/GenerateContractLink',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == "NCK") {
                return showWarningToast(ScriptResourcesList['scriptNOSignatureKey']);
            }
            if (data == "BA") {
                return showWarningToast(ScriptResourcesList['scriptBindedAlert']);
            }
            $("#conract-item-" + count).parent().find(".gen-link").addClass("hidden");
            $("#conract-item-" + count).parent().find(".undo-link").removeClass("hidden");
            // $("#conract-item-" + count).parent().removeClass("contract-item");
            // $("#conract-item-" + count).parent().addClass("contract-item-not");
            $("#conract-check-" + count).attr("checked", true);
            $("#conract-check-" + count).attr("disabled", true);
            var html = "<div class='link-info'> <p>" + ScriptResourcesList['scriptCopythelinkintheemailtosendthiscontract1'] + "</p>";
            html += "<p id='conLink'>" + data + "</p>";
            html += "<button data-clipboard-action='copy' data-clipboard-target='#conLink' class='btn btn-default' id='conBtn'>" + ScriptResourcesList['scriptCopyLink'] + "</button>";
            html += " </div> ";
            // $("#conract-item-" + count).summernote('destroy');
            // $("#conract-item-" + count).hide();
            $("#conract-item-" + count).parent().before(html);
            var clipboard = new ClipboardJS('#conBtn');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });
}
function setTemplatePreview(count, type, id) {

    var content = "";
    if (type == 2) {
        content = $("#conract-item-" + count).val();
    }
    else if (type == 1) {
        content = $("#letter-item-" + count).val();
    }
    blockUI();
    var data = { content: content, type: type, template: id };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/PreviewTemplateSet',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (type == 2) {
                $("#contract-href-temp-" + count)[0].click();
            }
            else if (type == 1) {
                $("#letter-href-temp-" + count)[0].click();
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}

function printTasks() {
    var name = $.trim($(".welcome_lbl").html());
    name = name.replace("Hello", "");
    var html = "<div style='width:100%;float:left;margin:5px;'><h3>Tasks For " + name + "</h3></div>";
    var count = 1;
    html += "<div style='width:100%;float:left;margin:10px;'><h4>Today's Task(s)</h4></div>";
    $("#task-panel .today .chkbx-text").each(function () {
        html += "<div style='width:100%;float:left;margin:5px'><span>" + count++ + ". </span> " + $(this).html() + "</div>";
    });
    count = 1;
    html += "<div style='width:100%;float:left;margin:10px;'><h4>Pending Task(s)</h4></div>";
    $("#task-panel .pending .chkbx-text").each(function () {
        html += "<div style='width:100%;float:left;margin:5px'><span>" + count++ + ". </span> " + $(this).html() + "</div>";
    });
    count = 1;
    html += "<div style='width:100%;float:left;margin:10px;'><h4>Upcoming Task(s)</h4></div>";
    $("#task-panel .upcoming .chkbx-text").each(function () {
        html += "<div style='width:100%;float:left;margin:5px'><span>" + count++ + ". </span> " + $(this).html() + "</div>";
    });
    Popup(html);
}
function printTasksUser() {
    var name = $.trim($("#user-name").html());
    var html = "<div style='width:100%;float:left;margin:5px;'><h3>Tasks For " + name + "</h3></div>";
    var count = 1;
    $("#task-container .chkbx-text").each(function () {
        html += "<div style='width:100%;float:left;margin:5px'><span>" + count++ + ". </span> " + $(this).html() + "</div>";
    });
    Popup(html);
}
function showSelectedClient() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocument']);

    }
    else {
        var list = [];
        $(".select-doc:checked").each(function () {
            list.push($(this).parent().find(".doc-id").val());
        });
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/ShowClient',
            data: JSON.stringify(list),
            async: true,
            success: function (data) {
                unblockUI();
                return showSuccessToast(ScriptResourcesList['scriptDocumentsAvailableToClient']);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }

}
function hideSelectedClient() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocument']);
    }
    else {
        var list = [];
        $(".select-doc:checked").each(function () {
            list.push($(this).parent().find(".doc-id").val());
        });
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/HideClient',
            data: JSON.stringify(list),
            async: true,
            success: function (data) {
                unblockUI();
                return showSuccessToast(ScriptResourcesList['scriptDocumentsHiddenToClient']);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }

}
function closeModal(ref) {
    if (ref == "IE") {
        $("#visa-officer-modal").modal('hide');
        $('body').removeClass('modal-open');
    }
    else if (ref == "CD") {
        $("#client-doc-modal").modal('hide');
        $('body').removeClass('modal-open');
    }
    else if (ref == "CL") {
        $("#client-checklist-modal").modal('hide');
        $('body').removeClass('modal-open');
    }
    else if (ref == "CC") {
        $("#client-contract-modal").modal('hide');
        $('body').removeClass('modal-open');
    }

}
function goToPotentialClient(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/PotentialClientsN',
        async: false,
        success: function (data) {
            unblockUI();
            clearSelectedClient();
            bindHidePanel();

            $("#content-area").html("");
            $("#content-area").html(data);
            $("#tabpClientL").addClass("tab-selected");
            $("#tabpClient").removeClass("tab-selected");
            editPotentialClient(id)

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function getpClientDocsRefresh() {
    $("#pDocs").click();
}
function showDetail(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/EditPotentialClients?id=' + id,
        async: true,
        success: function (data) {

            unblockUI();
            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $(".pclient-nav li").removeClass("active");
            $("#pDetail").parent().addClass("active");
            $("#Client_Notes").summernote({
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
                height: 350,
                fontNames: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri'],
                fontNamesIgnoreCheck: ["Helvetica", "sans-serif", "Arial", "Arial Black", "Comic Sans MS", "Courier New", 'Impact', 'Lucida Grande',
                    'Tahoma', 'Times New Roman', 'Verdana', 'Microsoft YaHei', 'Calibri']

            });
            if (_defaultFont != "") {
                $('#Client_Notes').summernote('fontName', _defaultFont);
                $(".dropdown-fontname a").removeClass("checked");
                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                $(".note-current-fontname").html(_defaultFont);
                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function showPReminders(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/pClientReminders?id=' + id,
        async: true,
        success: function (data) {

            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $(".pclient-nav li").removeClass("active");
            $(ref).parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function showPMeetings(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Meeting/ClientMeetingPotential?client=' + id,
        async: true,
        success: function (data) {

            unblockUI();
            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $(".pclient-nav li").removeClass("active");
            $(ref).parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function showPTasks(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/PClientTasks?id=' + id,
        async: true,
        success: function (data) {

            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $(".pclient-nav li").removeClass("active");
            $(ref).parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function showCreateEmail(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/PotentialClientEmail?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $(".pclient-nav li").removeClass("active");
            $(ref).parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function showPotentialDOcs(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/PotentialClientDocs?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $(".client-ul li").removeClass("active");
            $("#DocTab").parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function viewAllQuestionnairesForPotential(id, ref) {
    blockUI();
    $.ajax(
        {
            type: "GET",
            contentType: "html",
            url: '/Questionnaire/viewAllQuestionnairesForPotential?pid=' + id,
            async: true,
            success: function (data) {
                unblockUI();
                $("#main-p-detail").html("");
                $("#main-p-detail").html(data);
                $(".pclient-nav li").removeClass("active");
                $(ref).parent().addClass("active");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
}
function showPActivity(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Activity/PotentialClientLog?id=' + id,
        async: true,
        success: function (data) {
            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $(".pclient-nav li").removeClass("active");
            $(ref).parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function showPFileNotes(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/FileNotesP?id=' + id,
        async: true,
        success: function (data) {
            $("#main-p-detail").html("");
            $("#main-p-detail").html(data);
            $(".pclient-nav li").removeClass("active");
            $(ref).parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addSuplierContact() {
    var html = '<div class="suppplier-contact detail_body">';
    html += ' <i class="fa fa-trash-o float_right" style="float:right;" aria-hidden="true" onclick="deleteNewProgram(this)"></i>';
    html += ' <div style="clear:both;"></div>';
    html += '<h3 class="input_lbl">' + ScriptResourcesList['scriptName'] + '</h3> <input  type="text" class="info_input contact-name" placeholder="' + ScriptResourcesList['scriptName'] + '" />';
    html += '<h3 class="input_lbl">' + ScriptResourcesList['scriptEmail'] + '</h3> <input  type="text" class="info_input contact-email" placeholder="' + ScriptResourcesList['scriptEmail'] + '" />';
    html += '<h3 class="input_lbl">' + ScriptResourcesList['scriptNumber'] + '</h3> <input type="text" class="info_input contact-number" placeholder="' + ScriptResourcesList['scriptNumber'] + '" />';
    html += '</div>';
    $("#supplier-contacts").append(html);
}
function addContact() {
    var html = '<div class="school-contact detail_body">';
    html += ' <i class="fa fa-trash-o float_right" aria-hidden="true" onclick="deleteNewProgram(this)"></i>';
    html += ' <div style="clear:both;"></div>';
    html += '<h3 class="input_lbl">' + ScriptResourcesList['scriptName'] + '</h3> <input  type="text" class="info_input contact-name" placeholder="' + ScriptResourcesList['scriptName'] + '" />';
    html += '<h3 class="input_lbl">' + ScriptResourcesList['scriptEmail'] + '</h3> <input  type="text" class="info_input contact-email" placeholder="' + ScriptResourcesList['scriptEmail'] + '" />';
    html += '<h3 class="input_lbl">' + ScriptResourcesList['scriptDescription'] + '</h3> <input type="text" class="info_input contact-desc" placeholder="' + ScriptResourcesList['scriptDescription'] + '" />';
    html += '</div>';
    $("#school-contacts").append(html);
}
function addProgram() {
    var html = '<div class="school-prog detail_body">';
    html += ' <i class="fa fa-trash-o float_right" aria-hidden="true" onclick="deleteNewProgram(this)"></i>';
    html += ' <div style="clear:both;"></div>';
    html += '<h3 class="input_lbl">' + ScriptResourcesList['scriptName'] + '</h3> <input  type="text" class="info_input program-name" placeholder="' + ScriptResourcesList['scriptName'] + '" />';
    html += '<h3 class="input_lbl">' + ScriptResourcesList['scriptDescription'] + '</h3> <input type="text" class="info_input program-desc" placeholder="' + ScriptResourcesList['scriptDescription'] + '" />';
    html += '<h3 class="input_lbl">' + ScriptResourcesList['scriptComission'] + ' %</h3> <input type="number" class="info_input program-com" placeholder="' + ScriptResourcesList['scriptComission'] + '" />';
    html += '</div>';
    $("#school-programs").append(html);
}
function deleteNewProgram(ref) {
    $(ref).parent().remove();
}
function editSchoolGet(id, ref) {

    var name, city, cp, cpd, email, address, url, website, comm, type, perm, notes;
    type = $(ref).parent().find(".school-type").val();
    name = $(ref).parent().find(".school-name").val();
    city = $(ref).parent().find(".school-city").val();
    email = $(ref).parent().find(".school-email").val();
    address = $(ref).parent().find(".school-address").val();
    url = $(ref).parent().find(".school-url").val();
    website = $(ref).parent().find(".school-website").val();
    notes = $(ref).parent().find(".school-notes").val();
    perm = $(ref).parent().find(".school-permission").val();

    $("#school-id").val(id);
    $("#school-url-hdn").val(url);
    $("#school-type").val(type);
    $("#school-name").val(name);
    $("#school-city").val(city);
    $("#school-address").val(address);
    $("#school-website").val(website);
    $("#school-email").val(email);
    $("#school-notes").val(notes);

    if (perm == "True") {
        if (url) {

            var urlA = url.split("|");
            var html = '';
            var html = '<a href="/Client/DownloadFileStream?blob=' + urlA[0] + '&filename=' + urlA[1] + '"><h3>' + urlA[1] + '  <i class="fa fa-download" aria-hidden="true"></i></h3></a>';
            $("#sch-agg").html(html);
        }
    }

    $('#school-new-modal').modal('show');
    $(".show-added").show();


}
function updateSchoolPost() {
    var data = new FormData();
    var agreement = $("#sch-agree-new").get(0).files;

    if (agreement.length > 0) {
        data.append("Agreement", agreement[0]);
    }

    data.append("ID", $("#school-id").val());
    data.append("SchoolType", $("#school-type").val());
    data.append("Name", $("#school-name").val());
    data.append("City", $("#school-city").val());
    data.append("Email", $("#school-email").val());
    data.append("Address", $("#school-address").val());
    data.append("Website", $("#school-website").val());
    data.append("Notes", $("#school-notes").val());
    data.append("AgreementUrl", $("#school-url-hdn").val());
    var counter = 0;
    $("#school-programs .school-prog").each(function () {
        var obj = new Object();
        obj.Name = $(this).find(".program-name").val();
        obj.Com = $(this).find(".program-com").val();
        if (obj.Name == "") {
            $(this).find(".program-name").focus();
            validated = false;
            return showWarningToast(ScriptResourcesList['scriptPleaseSelectLevel']);

        }
        //obj.DurationMonths = $(this).find(".program-dur").val();
        //obj.TotalFee = $(this).find(".program-fee").val();
        //obj.CommisionPercentage = $(this).find(".program-cp").val();
        obj.Description = $(this).find(".program-desc").val();
        // programs.push(obj);
        data.append("Programs[" + counter + "].Name", obj.Name);
        //data.append("Programs["+counter+"].DurationMonths", obj.DurationMonths);
        //data.append("Programs["+counter+"].TotalFee", obj.TotalFee);
        data.append("Programs[" + counter + "].CommisionPercentage", obj.Com);
        data.append("Programs[" + counter + "].Description", obj.Description);
        counter++;
    })
    counter = 0
    $("#school-contacts .school-contact").each(function () {
        var obj = new Object();
        obj.Name = $(this).find(".contact-name").val();

        if (obj.Name == "") {
            $(this).find(".contact-name").focus();
            validated = false;
            return showWarningToast(ScriptResourcesList['scriptPleaseEnterContactName']);
        }
        obj.Email = $(this).find(".contact-email").val();
        obj.Description = $(this).find(".contact-desc").val();
        data.append("Contacts[" + counter + "].Name", obj.Name);
        data.append("Contacts[" + counter + "].Email", obj.Email);
        data.append("Contacts[" + counter + "].Description", obj.Description);
        counter++;
    })
    blockUI();
    $.ajax({
        url: '/Supplier/UpdateSchool',
        type: "POST",
        processData: false,
        contentType: false,
        data: data,
        success: function (response) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptUpdated']);

            $(".added-contacts").hide();
            $(".added-programs").hide();
            $("#school-added-contacts").html("");
            $("#school-added-programs").html("");
            $("#school-contacts").html("");
            $("#school-programs").html("");
            var html = '<tr id="school-' + $("#school-id").val() + '">';
            html += '<td>' + $("#school-type").val() + '</td>';
            html += '<td>';
            html += $("#school-name").val();
            html += '</td>';
            html += '<td>' + $("#school-city").val() + '</td>';
            html += '<td>' + $("#school-website").val() + '</td>';
            html += '<td>' + $("#school-email").val() + '</td>';
            html += '<td>';
            html += '<input type="hidden" value="' + $("#school-type").val() + '" class="school-type" />';
            html += '<input type="hidden" value="' + $("#school-name").val() + '" class="school-name" />';
            html += '<input type="hidden" value="' + $("#school-city").val() + '" class="school-city" />';
            html += '<input type="hidden" value="' + $("#school-email").val() + '" class="school-email" />';
            html += '<input type="hidden" value="' + $("#school-address").val() + '" class="school-address" />';
            html += '<input type="hidden" value="' + $("#school-url-hdn").val() + '" class="school-url" />';
            html += '<input type="hidden" value="' + $("#school-website").val() + '" class="school-website" />';
            html += '<input type="hidden" value="' + $("#school-notes").val() + '" class="school-notes" />';
            html += '<i class="fa fa-times-circle" aria-hidden="true" onclick="deleteSchool(this,' + $("#school-id").val() + ')"></i>';
            html += '<i class="fa fa-clipboard" aria-hidden="true" onclick="editSchoolGet(' + $("#school-id").val() + ',this)"></i>';
            html += '</td>';
            html += '</tr>';
            $("#school-" + $("#school-id").val()).replaceWith(html);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });

}
function addNewSchool() {
    if ($("#school-type").val() == "") {

        return showErrorToast(ScriptResourcesList['scriptPleaseSelectType']);
    }
    if ($("#school-name").val() == "") {
        return showErrorToast(ScriptResourcesList['scriptPleaseEnterName']);
    }
    if ($("#school-email").val() != "") {
        if (!validateEmail($("#school-email").val())) {
            $("#school-email").focus();
            return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
        }

    }

    if ($("#school-id").val() != "") {
        return updateSchoolPost();
    }

    var data = new FormData();
    var agreement = $("#sch-agree-new").get(0).files;

    if (agreement.length > 0) {
        data.append("Agreement", agreement[0]);
    }
    data.append("SchoolType", $("#school-type").val());
    data.append("Name", $("#school-name").val());
    data.append("City", $("#school-city").val());
    data.append("Email", $("#school-email").val());
    data.append("Address", $("#school-address").val());
    data.append("Website", $("#school-website").val());
    data.append("Notes", $("#school-notes").val());
    var programs = [];
    var validated = true;
    var counter = 0;
    $("#school-programs .school-prog").each(function () {
        var obj = new Object();
        obj.Name = $(this).find(".program-name").val();
        obj.Com = $(this).find(".program-com").val();
        if (obj.Name == "") {
            $(this).find(".program-name").focus();
            validated = false;
            return showWarningToast(ScriptResourcesList['scriptPleaseEnterLevelName']);
        }
        if ($(this).find(".program-com").val() != "") {
            var comi = parseInt($("#school-commission").val());
            if (comi <= 0 && comi >= 100) {
                $(this).find(".program-com").focus();
                validated = false;
                return showWarningToast(ScriptResourcesList['scriptPleaseEnterPercentageZero']);

            }

        }
        obj.Description = $(this).find(".program-desc").val();
        data.append("Programs[" + counter + "].Name", obj.Name);
        data.append("Programs[" + counter + "].Description", obj.Description);
        data.append("Programs[" + counter + "].CommisionPercentage", obj.Com);

        counter++;
    })
    counter = 0;
    $("#school-contacts .school-contact").each(function () {
        var obj = new Object();
        obj.Name = $(this).find(".contact-name").val();

        if (obj.Name == "") {
            $(this).find(".contact-name").focus();
            validated = false;
            return showWarningToast(ScriptResourcesList['scriptPleaseEnterContactName']);

        }
        obj.Email = $(this).find(".contact-email").val();
        obj.Description = $(this).find(".contact-desc").val();
        data.append("Contacts[" + counter + "].Name", obj.Name);
        data.append("Contacts[" + counter + "].Email", obj.Email);
        data.append("Contacts[" + counter + "].Description", obj.Description);
        counter++;
    })

    if (validated) {

        blockUI();
        $.ajax({
            url: '/Supplier/AddSchool',
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function (response) {
                unblockUI();
                showSuccessToast(ScriptResourcesList['scriptAdded']);
                $('#school-new-modal').modal('hide');
                $('body').removeClass('modal-open');
                getSchools();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }


}
function showPendingInvoices() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/SupplierPendingInvoices?supplier=' + $("#supplier-id").val(),
        async: true,
        success: function (data) {

            unblockUI();
            $("#pending-invoices").html("");
            $("#pending-invoices").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function deleteSchool(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Supplier/DeleteSchool',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
}

function getAllPrograms() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/GetSchoolPrograms?school=' + $("#school-id").val(),
        async: true,
        success: function (data) {

            unblockUI();
            $("#school-added-programs").html("");
            $("#school-added-programs").html(data);
            $(".added-programs").show();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getAllContacts() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/GetSchoolContacts?school=' + $("#school-id").val(),
        async: true,
        success: function (data) {

            unblockUI();
            $("#school-added-contacts").html("");
            $("#school-added-contacts").html(data);
            $(".added-contacts").show();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getAllSupplierContacts() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/GetSupplierContacts?supplier=' + $("#supplier-id").val(),
        async: true,
        success: function (data) {

            unblockUI();
            $("#suppler-added-contacts").html("");
            $("#suppler-added-contacts").html(data);
            $(".added-contacts").show();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function editSupplierGet(id, ref) {
    var name, business, email, contactno, address, url, type;
    name = $(ref).parent().find(".supplier-name").val();
    business = $(ref).parent().find(".supplier-business").val();
    email = $(ref).parent().find(".supplier-email").val();
    contactno = $(ref).parent().find(".supplier-contactno").val();
    address = $(ref).parent().find(".supplier-address").val();
    url = $(ref).parent().find(".supplier-url").val();
    type = $(ref).parent().find(".supplier-type").val();
    $("#supplier-id").val(id);
    $("#supplier-type").val(type);
    $("#supplier-name").val(name);
    $("#supplier-business").val(business);
    $("#supplier-email").val(email);
    $("#supplier-contactno").val(contactno);
    $("#supplier-address").val(address);
    $("#supplier-url-hdn").val(url);
    if (url) {
        var urlA = url.split("|");
        var html = '<a href="/Client/DownloadFileStream?blob=' + urlA[0] + '&filename=' + urlA[1] + '"><span>' + urlA[1] + '  <i class="fa fa-download" aria-hidden="true"></i></span></a>';
        $("#sup-inv").html(html);
    }
    $(".show-added").show();
    $('#supplier-new-modal').modal('show');
}
function updateSupplierPost() {
    var validated = true;
    var obj = new Object();
    obj.ID = $("#supplier-id").val();
    obj.Type = $("#supplier-type").val();
    obj.Name = $("#supplier-name").val();
    obj.Business = $("#supplier-business").val();
    obj.Email = $("#supplier-email").val();
    obj.ContactNo = $("#supplier-contactno").val();
    obj.Address = $("#supplier-address").val();
    obj.AgreementUrl = $("#supplier-url-hdn").val();
    var data = new FormData();
    var agreement = $("#sup-agree-new").get(0).files;

    if (agreement.length > 0) {
        data.append("Agreement", agreement[0]);
    }
    data.append("ID", obj.ID);
    data.append("Name", obj.Name);
    data.append("Business", obj.Business);
    data.append("Email", obj.Email);
    data.append("ContactNo", obj.ContactNo);
    data.append("Address", obj.Address);
    data.append("AgreementUrl", obj.AgreementUrl);
    data.append("Type", obj.Type);
    var counter = 0;
    $("#supplier-contacts .suppplier-contact").each(function () {
        if (!validated) {
            return false;
        }
        var obj = new Object();
        obj.Name = $(this).find(".contact-name").val();

        if (obj.Name == "") {
            $(this).find(".contact-name").focus();
            validated = false;
            return showWarningToast(ScriptResourcesList['scriptPleaseEnterContactName']);
        }
        obj.Email = $(this).find(".contact-email").val();
        if (obj.Email != "") {
            if (!validateEmail(obj.Email)) {
                $(this).find(".contact-email").focus();
                validated = false;
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
        obj.Number = $(this).find(".contact-number").val();
        data.append("Contacts[" + counter + "].Name", obj.Name);
        data.append("Contacts[" + counter + "].Email", obj.Email);
        data.append("Contacts[" + counter + "].Number", obj.Number);
        counter++;
    });
    if (validated) {
        blockUI();
        $.ajax({
            url: '/Supplier/UpdateSupplier',
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function (response) {
                unblockUI();
                showSuccessToast(ScriptResourcesList['scriptUpdated'])

                $('#supplier-new-modal').modal('hide');
                getSuppliers();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }
}
function addNewSupplier() {
    var validated = true;
    if ($("#supplier-name").val() == "") {
        return showErrorToast(ScriptResourcesList['scriptPleaseEnterName']);

    }
    if ($("#supplier-email").val() != "") {
        if (!validateEmail($("#supplier-email").val())) {
            $("#supplier-email").focus();
            return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
        }

    }

    if ($("#supplier-id").val() != "") {
        return updateSupplierPost();
    }


    var obj = new Object();
    obj.ID = $("#supplier-id").val();
    obj.Type = $("#supplier-type").val();
    obj.Name = $("#supplier-name").val();
    obj.Business = $("#supplier-business").val();
    obj.Email = $("#supplier-email").val();
    obj.ContactNo = $("#supplier-contactno").val();
    obj.Address = $("#supplier-address").val();

    var data = new FormData();
    var agreement = $("#sup-agree-new").get(0).files;

    if (agreement.length > 0) {
        data.append("Agreement", agreement[0]);
    }
    var counter = 0;
    $("#supplier-contacts .suppplier-contact").each(function () {
        if (!validated) {
            return false;
        }
        var obj = new Object();
        obj.Name = $(this).find(".contact-name").val();

        if (obj.Name == "") {
            $(this).find(".contact-name").focus();
            validated = false;
            return showWarningToast(ScriptResourcesList['scriptPleaseEnterContactName']);

        }
        obj.Email = $(this).find(".contact-email").val();
        if (obj.Email != "") {
            if (!validateEmail(obj.Email)) {
                $(this).find(".contact-email").focus();
                validated = false;
                return showErrorToast(ScriptResourcesList['scriptPleaseEnterValidEmail']);
            }
        }
        obj.Number = $(this).find(".contact-number").val();
        data.append("Contacts[" + counter + "].Name", obj.Name);
        data.append("Contacts[" + counter + "].Email", obj.Email);
        data.append("Contacts[" + counter + "].Number", obj.Number);
        counter++;
    });
    data.append("ID", obj.ID);
    data.append("Name", obj.Name);
    data.append("Business", obj.Business);
    data.append("Email", obj.Email);
    data.append("ContactNo", obj.ContactNo);
    data.append("Address", obj.Address);
    data.append("Type", obj.Type);
    if (validated) {
        blockUI();
        $.ajax({
            url: '/Supplier/AddSupplier',
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function (response) {
                unblockUI();
                showSuccessToast(ScriptResourcesList['scriptAdded']);

                $('#supplier-new-modal').modal('hide');
                getSuppliers();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }


}
function deleteSupplier(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Supplier/DeleteSupplier',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                    $(ref).parent().parent().next(".row-supplier-notes").remove();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
}
function deleteFilePotential(id, ref) {

    var title = $(ref).parent().parent().find(".doc-title").val();
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/DeleteFileP',
            data: JSON.stringify({ docId: id, title: title, client: $("#hdn-p-client-doc").val() }),
            async: true,
            success: function (data) {

                if (data) {
                    $(ref).parent().parent().parent().remove();
                    setDocSN();
                    return showSuccessToast(ScriptResourcesList['scriptDeleted'])
                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function editFilePotential(id, ref) {
    if (confirm(ScriptResourcesList['scriptConfirmDocumentTitle'])) {
        var title = $(ref).parent().parent().parent().find(".doc-title").val();
        if (title == "") {
            return showWarningToast(scriptPleaseEnterDocumentTitle);
        }
        var data = { docId: id, title: title, client: $("#hdn-p-client-doc").val() };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/UpdateFileP',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {

                if (data) {

                    return showSuccessToast(ScriptResourcesList['scriptUpdated']);
                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
}
function addDocTypePotential() {

    $("#doc-type-modal .errorSpanModal").html("");
    var name = $("#doc-type-name").val();


    if (name == "") {
        $("#doc-type-name").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }


    var obj = new Object();
    obj.Name = name;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/InsertDocumentType',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);

            $('#doc-type-modal').modal('hide');
            $('body').removeClass('modal-open');
            showPotentialDOcs($("#hdn-p-client-doc").val());
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function getSupplierFileNotes(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/SupplierFileNotes?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            var html = "<tr class='row-supplier-notes'>";
            html += "<td colspan='5'>";
            html += data;
            html += "</td>";
            html += "</tr>";
            $(".row-supplier-notes").remove();
            $(ref).parent().parent().after(html);
            $("#hdn-supplier-name").val($(ref).parent().find(".supplier-name").val());
            $("#hdn-supplier-id").val(id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function getSupplierClients(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Supplier/GetSupplierClients?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            var html = "<tr class='row-supplier-notes'>";
            html += "<td colspan='5'>";
            html += data;
            html += "</td>";
            html += "</tr>";
            $(".row-supplier-notes").remove();
            $(ref).parent().parent().after(html);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function changeDocumentTypePopup() {

    if ($(".select-doc:checked").length < 1) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocumentToMove']);

    }
    else {

        $('#doc-type-modal').modal('show');
    }
}
function changeDocumentTypeModalGrouped() {
    if ($("#select-doc-type-change").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectType']);

    }
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseDocumentFirst']);

    }
    var list = [];
    $(".select-doc:checked").each(function () {
        list.push($(this).parent().find(".doc-id").val());
    });
    var obj = new Object();
    obj.Folder = $("#select-doc-type-change").val();
    obj.DOC = list;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/ChangeDocFolder',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();

            $('#doc-type-modal').modal('hide');
            $('body').removeClass('modal-open');
            showSuccessToast(ScriptResourcesList['scriptUpdated']);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function changeDocumentTypeModal() {
    if ($("#select-doc-type-change").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectType']);
    }
    if ($("#file-type-open").val() == $("#select-doc-type-change").val()) {
        return showWarningToast(ScriptResourcesList['scriptDocAlreadyInFolder']);

    }
    var list = [];
    $(".select-doc:checked").each(function () {
        list.push($(this).parent().find(".doc-id").val());
    });
    var obj = new Object();
    obj.Folder = $("#select-doc-type-change").val();
    obj.DOC = list;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/ChangeDocFolder',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $(".select-doc:checked").each(function () {
                $(this).parent().parent().parent().remove();
            });
            $('#doc-type-modal').modal('hide');
            $('body').removeClass('modal-open');
            setDocSN();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function openSupplierPopup(ref) {
    $("#supplier-new-modal").modal("show");
    $("#supplier-type").val(ref);
}
function removeClientImage() {
    $("#fileInput").val("");
    $("#hdnImageString").val("");
    $(".dummy_img_lbl").html('<img class="dummy_img" src="/Content/Images/dummy-image.png" alt="dummy image" />');
    $(".dp-actions").hide();
}
function groupDocumentsByType(ref) {
    var val = false;
    if ($(ref).is(':checked')) {
        val = true;
    }
    var obj = new Object();
    obj.group = val;
    if (confirm(ScriptResourcesList['scriptConfirmUpdate'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/GroupDocs',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();
                successToast();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function emailImportNotification(ref) {
    var val = false;
    if ($(ref).is(':checked')) {
        val = true;
    }
    var obj = new Object();
    obj.group = val;
    if (confirm("Are you sure you want to update ?")) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/EmailImportNotification',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();
                successToast();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function dailyBirthdayEmail(ref) {
    var val = false;
    if ($(ref).is(':checked')) {
        val = true;
    }
    var obj = new Object();
    obj.group = val;
    if (confirm(ScriptResourcesList['scriptConfirmUpdate'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Settings/DailyBirthdayEmail',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();
                successToast();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function dailyTaskEmail(ref) {
    var val = false;
    if ($(ref).is(':checked')) {
        val = true;
    }
    var obj = new Object();
    obj.group = val;
    if (confirm(ScriptResourcesList['scriptConfirmUpdate'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/DailyTaskEmail',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();
                successToast();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function dailyMeetingEmail(ref) {
    var val = false;
    if ($(ref).is(':checked')) {
        val = true;
    }
    var obj = new Object();
    obj.group = val;
    if (confirm(ScriptResourcesList['scriptConfirmUpdate'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/DailyMeetingEmail',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
                unblockUI();
                successToast();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function getClientCommonDocuments(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Document/GetClientCommonDocuments',
        async: true,
        success: function (data) {

            unblockUI();
            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getVisaTypePrice() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/TimeTracking/VisaTypePrice',
        async: true,
        success: function (data) {

            unblockUI();
            $("#time-content").html("");
            $("#time-content").html(data);
            $("#ul-tt li").removeClass("active");
            $("#vtp-li").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getWorkType() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/TimeTracking/WorkType',
        async: true,
        success: function (data) {

            unblockUI();
            $("#time-content").html("");
            $("#time-content").html(data);
            $("#ul-tt").removeClass("active");
            $("#vwt-li").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function changeDocTypeClient(ref) {
    var doc = $(ref).parent().parent().find(".doc-id").val();
    var data = { ID: $(ref).val(), DOC: doc };
    if (confirm(ScriptResourcesList['scriptConfirmChangeDoc'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Document/ChangeDocType',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == true) {
                    showSuccessToast(ScriptResourcesList['scriptUpdated'])

                }
                else {
                    return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                }



            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });
    }

}

function removeNewTaskFollowers(ref) {
    $(ref).parent().remove();
}
function removeNewMeetingFollowers(ref) {
    $(ref).parent().remove();
}
function addNewTaskFollower() {
    var html = "";
    html += '<div class="hide_btn_cp"><i onclick="removeNewTaskFollowers(this)" class="fa fa-times" aria-hidden="true"></i>';
    html += '<input type="hidden" class="hdn-new-task-follower" value="' + $("#select-new-task-users").val() + '" />';
    html += $("#select-new-task-users option:selected").text();
    html += '</div>';
    $("#new-task-followers").append(html);
    $("#select-new-task-users").val("");
}
function addNewMeetingFollowers() {
    var html = "";
    html += '<div class="hide_btn_cp"><i onclick="removeNewMeetingFollowers(this)" class="fa fa-times" aria-hidden="true"></i>';
    html += '<input type="hidden" class="hdn-new-meeting-follower" value="' + $("#select-new-meeting-users-e").val() + '" />';
    html += $("#select-new-meeting-users-e option:selected").text();
    html += '</div>';
    $("#new-meeting-followers").append(html);
    $("#select-new-meeting-users-e").val("");
}
function addNewMeetingFollowersInner(id, ref, image) {
    var html = "";
    if (image) {
        var trial = $(ref).find(".client-image").first().attr('src');
        html += '<li>';
        html += '<img src="' + trial + '" alt="' + $(ref).find(".person-name").html() + '" title="' + $(ref).find(".person-name").html() + '" class="thumbnail-img" />';
        html += '<i class="del-folwr fa fa-times" onclick="unassignMeeting(' + id + ',' + $("#hdn-detail-meetingid").val() + ', this)"></i>';
        html += '<span><img src="' + trial + '" alt="User" /><br /><p class="img-title">' + $(ref).find(".person-name").html() + '</p></span>';
        html += '</li>';
    }
    else {
        html += '<li>';
        html += '<img src="~/Content/Images/small-user.png" alt="' + $(ref).find(".person-name").html() + '" title="' + $(ref).find(".person-name").html() + '" class="thumbnail-img" />';
        html += '<i class="del-folwr fa fa-times" onclick="unassignMeeting(' + id + ',' + $("#hdn-detail-meetingid").val() + ', this)"></i>';
        html += '<span><img src="~/Content/Images/small-user.png" alt="User" /><br /><p class="img-title">' + $(ref).find(".person-name").html() + '</p></span>';
        html += ' </li>';
    }

    $("#new-meeting-followers-in").append(html);
}
function addNewTaskFollowerSummary() {
    var html = "";
    html += '<div class="hide_btn_cp"><i onclick="removeNewTaskFollowers(this)" class="fa fa-times" aria-hidden="true"></i>';
    html += '<input type="hidden" class="hdn-new-task-follower" value="' + $("#select-new-task-users-in").val() + '" />';
    html += $("#select-new-task-users-in option:selected").text();
    html += '</div>';
    $("#new-task-followers-sum").append(html);
    $("#select-new-task-users-in").val("");
}
function addNewTaskFollowerInner() {
    var html = "";
    html += '<div class="hide_btn_cp"><i onclick="removeNewTaskFollowers(this)" class="fa fa-times" aria-hidden="true"></i>';
    html += '<input type="hidden" class="hdn-new-task-follower" value="' + $("#select-new-task-users-in").val() + '" />';
    html += $("#select-new-task-users-in option:selected").text();
    html += '</div>';
    $("#task-add-modal #new-task-followers-in").append(html);
    $("#select-new-task-users-in").val("");
}
function addNewTaskFollowerInnerFile() {
    var html = "";
    html += '<div class="hide_btn_cp"><i onclick="removeNewTaskFollowers(this)" class="fa fa-times" aria-hidden="true"></i>';
    html += '<input type="hidden" class="hdn-new-task-follower" value="' + $("#select-new-task-users-in-file").val() + '" />';
    html += $("#select-new-task-users-in-file option:selected").text();
    html += '</div>';
    $("#task-convert-modal #new-task-followers-in").append(html);
    $("#select-new-task-users-in-file").val("");
}
function addNewTaskFollowerInnerP() {
    var html = "";
    html += '<div class="hide_btn_cp"><i onclick="removeNewTaskFollowers(this)" class="fa fa-times" aria-hidden="true"></i>';
    html += '<input type="hidden" class="hdn-new-task-follower" value="' + $("#select-new-task-users-in-p").val() + '" />';
    html += $("#select-new-task-users-in-p option:selected").text();
    html += '</div>';
    $("#task-add-modal #new-task-followers-in-p").append(html);
    $("#task-add-modal #select-new-task-users-in-p").val("");
}
function addNewTaskFollowerInnerPSummary() {
    var html = "";
    html += '<div class="hide_btn_cp"><i onclick="removeNewTaskFollowers(this)" class="fa fa-times" aria-hidden="true"></i>';
    html += '<input type="hidden" class="hdn-new-task-follower" value="' + $("#select-new-task-users-in-p").val() + '" />';
    html += $("#select-new-task-users-in-p option:selected").text();
    html += '</div>';
    $("#task-add-modal-summary-p #new-task-followers-in-p").append(html);
    $("#task-add-modal-summary-p #select-new-task-users-in-p").val("");
}
function addNewTaskFollowerInnerFileP() {
    var html = "";
    html += '<div class="hide_btn_cp"><i onclick="removeNewTaskFollowers(this)" class="fa fa-times" aria-hidden="true"></i>';
    html += '<input type="hidden" class="hdn-new-task-follower" value="' + $("#select-new-task-users-in-file").val() + '" />';
    html += $("#select-new-task-users-in-file option:selected").text();
    html += '</div>';
    $("#task-convert-modal #new-task-followers-in").append(html);
    $("#task-convert-modal #select-new-task-users-in-file").val("");
}
function getReportPotentialStatus() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/PotentialStatus',
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getReportFileNotesPotential() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/ClientFileNotesPotential',
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getReportFileNotes() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/ClientFileNotes',
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getBirthdayReport() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }

    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportClientBirthday',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getExpiringVisas() {
    $("#genral-box").show();
    $("#client-source-box").html("");
    if ($("#date-from").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateFrom'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#date-to").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDateTo'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }

    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/GetReportExpiringVisa',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getReportCurrentStatus() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/ClientCurrentStatus',
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getReportActiveCases() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Report/ClientActiveCases',
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-source-box").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function getDataReportActiveCases() {

    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.User = $("#userType").val();

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/ClientActiveCases',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();

            if (data.length > 0) {
                var html = "";

                for (var i = 0; i < data.length; i++) {
                    html += "<tr>";
                    html += "<td>" + data[i].ClientID + "</td>";
                    html += "<td> <a href='#' onclick='showClientDetailViews(" + data[i].ClientID + ")'>" + data[i].FirstName + " " + data[i].LastName + "</a></td>";
                    html += "<td>" + data[i].Email + "</td>";
                    if (data[i].VisaTypeName != null) {
                        html += "<td>" + data[i].VisaTypeName + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].Status != null) {
                        html += "<td>" + data[i].Status + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].VisaStatusDateStr != null) {
                        html += "<td>" + data[i].VisaStatusDateStr + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].ProcesingPersons != null) {
                        html += "<td>" + $.trim(data[i].ProcesingPersons).substring(0, data[i].ProcesingPersons.length - 1); + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].InternalID != null) {
                        html += "<td>" + data[i].InternalID + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }

                    html += "</tr>";
                }

                $("#tbl-client-active-cases tbody").html(html);

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function getDataReportClientStatus() {

    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/ClientCurrentStatus',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            if (data.length > 0) {
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    html += "<tr>";
                    html += "<td>" + data[i].ClientID + "</td>";
                    html += "<td> <a href='#' onclick='showClientDetailViews(" + data[i].ClientID + ")'>" + data[i].Name + "</a></td>";
                    if (data[i].Email != null) {
                        html += "<td>" + data[i].Email + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].ClientSource != null) {
                        html += "<td>" + data[i].ClientSource + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].IntrestedVisa != null) {
                        html += "<td>" + data[i].IntrestedVisa + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].Mobile != null) {
                        html += "<td>" + data[i].Mobile + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].ClientVisa != null) {
                        html += "<td>" + data[i].ClientVisa + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].Status != null) {
                        html += "<td>" + data[i].Status + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].Program != null) {
                        html += "<td>" + data[i].Program + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].ProgramStatus != null) {
                        html += "<td>" + data[i].ProgramStatus + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }
                    if (data[i].School != null) {
                        html += "<td>" + data[i].School + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }

                    html += "</tr>";
                }

                $("#tbl-client-active-cases tbody").html(html);

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function getDataReportPotentialStatus() {
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/PotentialStatus',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();

            if (data.length > 0) {
                var html = "";

                for (var i = 0; i < data.length; i++) {
                    html += "<tr>";

                    html += "<td>" + data[i].ClientName + "</td>";
                    html += "<td>" + data[i].Email + "</td>";
                    html += "<td>" + data[i].Mobile + "</td>";
                    html += "<td>" + data[i].ContactDateStr + "</td>";
                    html += "<td>" + data[i].Status + "</td>";
                    html += "<td>" + data[i].Source + "</td>";
                    html += "<td>" + data[i].IntrestedVisaType + "</td>";
                    html += "<td>" + data[i].LastActivityDateStr + "</td>";
                    if (data[i].ProcessingPerson != null) {
                        html += "<td>" + data[i].ProcessingPerson + "</td>";
                    }
                    else {
                        html += "<td></td>";
                    }

                    html += "</tr>";
                }

                $("#tbl-client-status tbody").html(html);

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function getDataReportFileNotesPotential() {
    if ($("#userType").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectUser'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.User = $("#userType").val();

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/ClientFileNotesPotential',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();

            if (data.length > 0) {
                var html = "";

                for (var i = 0; i < data.length; i++) {
                    html += "<tr>";
                    html += "<td>" + data[i].EZMID + "</td>";
                    html += "<td>" + data[i].ClientName + "</td>";
                    html += "<td>" + data[i].UserName + "</td>";
                    html += "<td>" + data[i].FileNote + "</td>";
                    html += "<td>" + data[i].FileNoteDateStr + "</td>";
                    html += "</tr>";
                }

                $("#tbl-client-notes tbody").html(html);

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function getDataReportFileNotes() {
    if ($("#userType").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectUser'],
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    var obj = new Object();
    obj.DateFrom = $("#date-from").val();
    obj.DateTo = $("#date-to").val();
    obj.User = $("#userType").val();

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Report/ClientFileNotes',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();

            if (data.length > 0) {
                var html = "";

                for (var i = 0; i < data.length; i++) {
                    html += "<tr>";
                    html += "<td>" + data[i].EZMID + "</td>";
                    html += "<td>" + data[i].ClientName + "</td>";
                    html += "<td>" + data[i].Email + "</td>";
                    html += "<td>" + data[i].FileNote + "</td>";
                    html += "<td>" + data[i].UserName + "</td>";
                    html += "<td>" + data[i].FileNoteDateStr + "</td>";
                    html += "</tr>";
                }

                $("#tbl-client-notes tbody").html(html);

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });

}
function showDetailTimeTracking() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/TimeTracking/TimeTrackingPartial?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            $("#main-time-track").html("");
            $("#main-time-track").html(data);
            $(".summary-btn").addClass("btn-default");
            $(".summary-btn").removeClass("btn-primary");

            $(".detail-btn").removeClass("btn-default");
            $(".detail-btn").addClass("btn-primary");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function showSummaryTimeTracking() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/TimeTracking/TimeTrackingSummary?id=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            $("#main-time-track").html("");
            $("#main-time-track").html(data);
            $(".detail-btn").addClass("btn-default");
            $(".detail-btn").removeClass("btn-primary");

            $(".summary-btn").removeClass("btn-default");
            $(".summary-btn").addClass("btn-primary");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addTimeTracking() {
    if ($("#select-visa-type").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectVisaType']);
    }
    //if ($("#select-work-type").val() == "") {
    //    return showWarningToast(ScriptResourcesList['scriptPleaseSelectWorkType']);
    //}
    if ($("#task-time-spent").val() == "") {

        return showWarningToast(ScriptResourcesList['scriptPleaseEnterTimeSpent']);
    }
    try {
        var num = parseFloat($("#task-time-spent").val());
        if (num < 1) {
            return showWarningToast(ScriptResourcesList['scriptPleaseNumberGreaterThanZero']);
        }
    }
    catch (e) {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterNumber']);
    }
    var data = { FKVisaID: $("#select-visa-type").val(), FKWorkTypeID: $("#select-work-type").val(), TimeSpent: $("#task-time-spent").val(), Description: $("#task-time-desc").val(), FKTaskID: $("#select-client-task").val() };


    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/TimeTracking/AddTimeTracking',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                $("#time-track-modal").modal('hide');
                $('body').removeClass('modal-open');
                getClientTimeTracking();
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addTimeTrackingLayout() {
    if ($("#layout-select-visa-type").val() == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectVisaType']);
    }

    if ($("#task-time-spent").val() == "") {

        return showWarningToast(ScriptResourcesList['scriptPleaseEnterTimeSpent']);
    }
    try {
        var num = parseFloat($("#task-time-spent").val());
        if (num < 1) {
            return showWarningToast(ScriptResourcesList['scriptPleaseNumberGreaterThanZero']);
        }
    }
    catch (e) {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterNumber']);
    }
    var data = { FKVisaID: $("#layout-select-visa-type").val(), FKWorkTypeID: $("#layout-select-work-type").val(), TimeSpent: $("#layout-task-time-spent").val(), Description: $("#layout-task-time-desc").val(), FKTaskID: $("#layout-client-task").val() };


    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/TimeTracking/AddTimeTracking',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                $("#layout-time-track-modal").modal('hide');
                $('body').removeClass('modal-open');
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function deleteTimeTracking(id, ref) {
    var data = { id: id };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/TimeTracking/DeleteTimeTracking',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                showSuccessToast(ScriptResourcesList['scriptDeleted']);
                $(ref).parent().parent().parent().remove();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function convertTaskInner() {
    $("#task-convert-modal #task-date-error-inner-file").hide();
    $("#task-convert-modal #task-detail-error-inner-file").hide();
    $("#task-convert-modal #task-title-error-inner-file").hide();
    if ($("#task-convert-modal #task-date-inner-file").val() == "") {
        $("#task-convert-modal #task-date-error-inner").show();
        return false;
    }
    if ($("#task-convert-modal #task-title-inner-file").val() == "") {
        $("#task-convert-modal #task-title-error-inner").show();
        return false;
    }
    if ($("#task-convert-modal #task-detail-inner-file").val() == "") {
        $("#task-convert-modal #task-detail-error-inner").show();
        return false;
    }
    var users = [];
    $("#task-convert-modal #new-task-followers-in .hdn-new-task-follower").each(function () {
        users.push($(this).val());
    });
    var data = { TaskShortDesc: $("#task-convert-modal #task-title-inner-file").val(), TaskDetails: $("#task-convert-modal #task-detail-inner-file").val(), TaskDue: $("#task-convert-modal #task-date-inner-file").val(), users: users, FKClientID: $("#selected-client-id").val(), ClientName: $("#selected-client-name").html(), potential: false };


    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AddNewTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                $("#task-convert-modal").modal('hide');
                $('body').removeClass('modal-open');
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function convertTaskInnerP() {
    $("#task-convert-modal #task-date-error-inner").hide();
    $("#task-convert-modal #task-detail-error-inner").hide();
    $("#task-convert-modal #task-title-error-inner").hide();
    if ($("#task-convert-modal #task-date-inner").val() == "") {
        $("#task-convert-modal #task-date-error-inner").show();
        return false;
    }
    if ($("#task-convert-modal #task-title-inner").val() == "") {
        $("#task-convert-modal #task-title-error-inner").show();
        return false;
    }
    if ($("#task-convert-modal #task-detail-inner").val() == "") {
        $("#task-convert-modal #task-detail-error-inner").show();
        return false;
    }
    var users = [];
    $("#task-convert-modal #new-task-followers-in .hdn-new-task-follower").each(function () {
        users.push($(this).val());
    });
    var data = { TaskShortDesc: $("#task-convert-modal #task-title-inner").val(), TaskDetails: $("#task-convert-modal #task-detail-inner").val(), TaskDue: $("#task-convert-modal #task-date-inner").val(), users: users, FKClientID: $("#pClientID").val(), ClientName: $("#selected-client-name").html(), potential: true };


    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Dashboard/AddNewTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
            }
            else {
                $("#task-convert-modal").modal('hide');
                $('body').removeClass('modal-open');
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function addCustomQuestionnaire() {

    var name = $("#ques-name").val();

    if (name == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }

    if ($("#hdn-quesid").val() != "") {
        return updateCustomQuestionnairePost();
    }
    var obj = new Object();
    obj.Name = name;

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/AddQuestionnaire',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            $('#ques-add-modal').modal('hide');
            $('body').removeClass('modal-open');
            getCustomQuestionnaire();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function updateQuestionnaireGet(id, name) {
    $("#hdn-quesid").val(id);
    $("#ques-name").val(name);
    $('#ques-add-modal').modal('show');
}
function deleteCustomQuestionnaireQuestion(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        var data = { ID: id };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Survey/DeleteQuestionnaireQuestion',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().remove();
                    successToast();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}
function deleteCustomQuestionnaireNew(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CustomQuestionnaire/DeleteQuestionnaire',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                    successToast();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);

            }
        });
    }
}
function deleteCustomQuestionnaire(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Survey/DeleteQuestionnaire',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                    successToast();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);

            }
        });
    }
}
function updateCustomQuestionnairePost() {
    var name = $("#ques-name").val();
    var obj = new Object();
    obj.ID = $("#hdn-quesid").val();
    obj.Name = name;

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/UpdateQuestionnaire',
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
            $('#ques-add-modal').modal('hide');
            $('body').removeClass('modal-open');
            getCustomQuestionnaire();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getDealsForPipline() {
    if ($("#deal-piplines").val() == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseSelectAPipeline']);
        $(".deal-search").hide();
        $(".create-deal").hide();

        $("#deals-content-detail").html("");
        return false;
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Deals/Deals?id=' + $("#deal-piplines").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#deals-content-detail").html("");
            $("#deals-content-detail").html(data);
            $(".deal-search").show();
            $(".create-deal").show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);


        }
    });
}
function getDeals() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Deals/Index',
        async: true,
        success: function (data) {

            clearSelectedClient();
            hideUserList();
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);
            $(".deal-main-nav li").removeClass("active");
            $("#deal-1").parent().addClass("active");
            if (!$("#main-menu").is(":visible")) {

                $("#dashboardCentral").removeClass();
                $("#dashboardCentral").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 double_col");

            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);


        }
    });
}
function getDealPipeline() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Deals/Pipeline',
        async: true,
        success: function (data) {

            clearSelectedClient();
            hideUserList();
            unblockUI();
            $("#deals-content").html("");
            $("#deals-content").html(data);
            $(".deal-main-nav li").removeClass("active");
            $("#deal-2").parent().addClass("active");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);


        }
    });
}
function getDealStages() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Deals/Stages',
        async: true,
        success: function (data) {

            clearSelectedClient();
            hideUserList();
            unblockUI();
            $("#deals-content").html("");
            $("#deals-content").html(data);
            $(".deal-main-nav li").removeClass("active");
            $("#deal-3").parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);


        }
    });
}
function getCustomQuestionnaire(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/Index',
        async: true,
        success: function (data) {

            clearSelectedClient();
            hideUserList();
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);
            if (ref) {
                $(".cq-main-nav li").removeClass("active");
                $(ref).parent().addClass("active");
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);


        }
    });
}
function getCustomQuestionnaireNew() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CustomQuestionnaire/Index',
        async: true,
        success: function (data) {

            clearSelectedClient();
            hideUserList();
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);


        }
    });
}
function getCustomQuestionnairePool(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/Pool',
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-questionnaire-content").html("");
            $("#custom-questionnaire-content").html(data);
            $(".cq-main-nav li").removeClass("active");
            $(ref).parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function getCustomQuestionnairePoolAus(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/PoolAus',
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-questionnaire-content").html("");
            $("#custom-questionnaire-content").html(data);
            $(".cq-main-nav li").removeClass("active");
            $(ref).parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}

function getCustomQuestionnaireRequest(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/QuestionRequest',
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-questionnaire-content").html("");
            $("#custom-questionnaire-content").html(data);
            $(".cq-main-nav li").removeClass("active");
            $(ref).parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function moveQuestionsUp(ref) {
    var e = $(ref).parent().parent();
    // move up:
    e.prev().insertAfter(e);
}
function moveQuestionsDown(ref) {
    var e = $(ref).parent().parent();

    // move down:
    e.next().insertBefore(e);
}
function moveGroupUp(ref) {
    var e = $(ref).parent().parent();
    // move up:
    e.prev().not('.header').insertAfter(e);

}
function moveGroupDown(ref) {
    var e = $(ref).parent().parent();

    // move down:
    e.next().insertBefore(e);
}
function addDeceleration() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/GetDeceleration',
        async: true,
        success: function (data) {
            unblockUI();
            if ($.trim(data) != "") {
                var html = '<div class="question"><div class="declaration-message">' + data + '</div></div>';
                if ($("#custom-questionnaire-content").find(".declaration-message").length > 0) {
                    return false;
                }
                $("#questionnaire-main-body").before(html);
            }
            else {
                var html = '<div class="question"><div class="declaration-message">' + ScriptResourcesList['scriptAddDecelaration'] + '</div></div>';
                if ($("#custom-questionnaire-content").find(".declaration-message").length > 0) {
                    return false;
                }
                $("#questionnaire-main-body").before(html);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });

}
function addAttachments() {
    var html = '<div class="question"> <div id= "dropzonePreview" class="dropzone dropzone-previews" >' + ScriptResourcesList['scriptAddAttachments'] + '</div > <!--this is were the previews should be shown. --></div >';
    if ($("#custom-questionnaire-content").find("#dropzonePreview").length > 0) {
        return false;
    }
    $("#questionnaire-main-body").before(html);
}
function getFamilyCustomDetail(id, p) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/ClientRelation/ClientFamilyQuestionnaireMerged?id=' + id + '&p=' + p,
        async: false,
        success: function (data) {
            unblockUI();
            $("#client-details").html("");
            $("#client-details").html(data);


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function saveQuestionnaire() {
    var id = $("#questionnaireID").val();
    var list = [];
    var removed = [];
    var maped = [];
    var validated = true;
    //$(".hdn-ques-maped").each(function () {

    //    if (maped.indexOf($(this).val()) == -1) {
    //        maped.push($(this).val());
    //    }
    //    else
    //    {
    //        var question = $(this).parent().next("h3").html();
    //        validated = false;
    //        showWarningToast(question + ". " + ScriptResourcesList['scriptQuestionDuplicate']);
    //        return false;
    //    }
    //});
    //if (!validate)
    //{
    //    return false;
    //}
    var att = false;
    var dec = false;
    var pos = 0;
    if ($("#custom-questionnaire-content").find("#dropzonePreview").length > 0) {
        att = true;
    }
    if ($("#custom-questionnaire-content").find(".declaration-message").length > 0) {
        dec = true;
    }
    $(".question").each(function () {
        //if ($(this).is(":hidden")) {
        //    removed.push($(this).find(".hdn-ques-id").val())
        //}
        //else
        //{


        //}
        var obj = new Object();
        obj.FKQuestionID = $(this).find(".hdn-ques-id").val();
        obj.IsRequired = $(this).find(".required-question").is(':checked');
        obj.Position = pos;
        list.push(obj);
        pos = pos + 1;
    });
    blockUI();
    var data = { list: list, id: id, att: att, dec: dec, removed: removed };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/SaveQuestionnaire',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            getCustomQuestionnaire();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function saveQuestionnaireDetail() {
    var id = $("#questionnaireID").val();
    var list = [];
    var att = false;
    var dec = false;
    var pos = 0;
    if ($("#custom-questionnaire-content").find("#dropzonePreview").length > 0) {
        att = true;
    }
    if ($("#custom-questionnaire-content").find(".declaration-message").length > 0) {
        dec = true;
    }

    blockUI();
    var data = { list: list, id: id, att: att, dec: dec };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/SaveQuestionnaireDetail',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            getCustomQuestionnaire();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function filterQuestionType() {
    blockUI();
    var type = $("#question-type").val();
    if (type == "") {
        $("#tbl-ques-pool tr").show();
    }
    else {
        $("#tbl-ques-pool tr").hide();
        $("#tbl-ques-pool .class-" + type).show();
        $("#tbl-ques-pool .always-visible").show();
    }
    unblockUI();
}
function addQuestions(id, ref) {
    var name = $(ref).parent().find(".q-name").val();
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/AddQuestions',
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-questionnaire-content").html("");
            $("#custom-questionnaire-content").html(data);
            $("#lbl-name-ques").val(name);
            $("#hdn-questionnaireid").val(id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function addQuestionsExsisting(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/AddQuestionsExsisting?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            var id = $("#questionnaireID").val();
            var name = $("#questionnaireName").html();
            $("#custom-questionnaire-content").html("");
            $("#custom-questionnaire-content").html(data);
            $("#lbl-name-ques").val(name);
            $("#hdn-questionnaireid").val(id);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function getQuestionnaireDetail(id) {

    var data = { id: id };
    blockUI();

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/QuestionnaireDetail',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-questionnaire-content").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });


}
function addQuestionToQuestionnaire(id) {
    $("#hdn-question-assign-id").val(id);
    $("#question-modal").modal("show");
}
function addQuestionToQuestionnaireModalClose() {
    $("#question-modal").modal("hide");
    $('body').removeClass('modal-open');
    $("#question-modal .questionnaire").prop('checked', false);
}
function addQuestionToSelected() {
    var id = $("#hdn-question-assign-id").val();
    var list = [];
    var names = [];
    if ($(".questionnaire:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectAtleastOneQuestion']);
    }
    $(".questionnaire:checked").each(function () {
        list.push($(this).attr("id").split('-')[1]);
        names.push($(this).next(".chkbx_label").html());
    });
    blockUI();
    var data = { list: list, id: id };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/AddQuestion',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            var eHtml = $.trim($("#tr-" + id + " .already-in-questionnaire").html());
            var final = [];
            if (eHtml !== null) {
                if (eHtml.indexOf(",") !== -1) {
                    var array1 = eHtml.split(",");
                    array1 = $.map(array1, $.trim);
                    // Merges both arrays and gets unique items
                    final = array1.concat(names);

                }
                else {
                    var array1 = [];
                    array1.push(eHtml);
                    // Merges both arrays and gets unique items
                    final = array1.concat(names);

                }

            }
            else {
                final = names;
            }
            var html = "";
            final = $.unique(final);
            for (var i = 0; i < final.length; i++) {
                if (final[i] != "") {
                    if (i != 0) {
                        html += ", ";
                    }
                    html += final[i];

                }
            }
            $("#tr-" + id + " .already-in-questionnaire").html(html);
            unblockUI();
            successToast();
            $("#question-modal").modal("hide");
            $("#question-modal .questionnaire").prop('checked', false);
            $('body').removeClass('modal-open');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function goBackToAddQuestion() {
    var name = $("#questionnaireName").html();
    var id = $("#questionnaireID").val();
    var list = [];
    $(".hdn-ques-id").each(function () {
        list.push($(this).val());
    });
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/AddQuestions',
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-questionnaire-content").html("");
            $("#custom-questionnaire-content").html(data);
            $("#lbl-name-ques").val(name);
            $("#hdn-questionnaireid").val(id);
            $(".select-question").each(function () {
                var idd = $(this).attr("id").split("-")[2];
                if ($.inArray(idd, list) != -1) {
                    $(this).prop('checked', true);
                }

            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);


        }
    });
}
function previewQuestionnaire(f) {
    var id = $("#hdn-questionnaireid").val();
    if ($(".select-question:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectAtleastOneQuestionnaireToPreview']);

    }
    else {
        blockUI();
        var list = [];
        $(".select-question:checked").each(function () {
            list.push($(this).parent().find(".hdn-q-id").val());
        });
        if (!f) {
            id = 0;
        }

        var data = { list: list, id: id };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Survey/PreviewQuestionnaire',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                var name = $("#lbl-name-ques").val();
                var id = $("#hdn-questionnaireid").val();
                $("#custom-questionnaire-content").html(data);
                $("#questionnaireName").html(name);
                $("#questionnaireID").val(id);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });

    }
}
function openAdvisorDataShare(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/DataShare/Advisor?client=' + $("#selected-client-id").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#modal-datashare-advisor .modal-body").html(data);
            $("#modal-datashare-advisor").modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function sendDataShareEmail(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/DataShare/SendEmail?clientid=' + $("#selected-client-uid").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#send-email-share-data-modal .modal-body").html(data);
            $("#send-email-share-data-modal").modal('show');


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function sendCustomQuestionnaireEmail(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/SendEmail?client=' + $("#selected-client-id").val() + '&ques=' + id + '&ln=' + $("#Lang:checked").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#send-email-questionnaire-modal .modal-body").html(data);
            $("#send-email-questionnaire-modal").modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function sendCustomQuestionnaireEmailNew(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CustomQuestionnaire/SendEmail?client=' + $("#selected-client-id").val() + '&ques=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#send-email-questionnaire-modal .modal-body").html(data);
            $("#send-email-questionnaire-modal").modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function sendCustomQuestionnaireEmailPotentialNew(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CustomQuestionnaire/SendEmailP?client=' + $("#hdnQpopupClientiD").val() + '&ques=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#send-email-questionnaire-modal-p .modal-body").html(data);
            $("#send-email-questionnaire-modal-p").modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function sendCustomQuestionnaireEmailPotential(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/SendEmailP?client=' + $("#pClientID").val() + '&ques=' + id + '&ln=' + $("#Lang:checked").val(),
        async: true,
        success: function (data) {
            unblockUI();
            $("#send-email-questionnaire-modal-p .modal-body").html(data);
            $("#send-email-questionnaire-modal-p").modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function setMultipleAttribute(id, ques, ref) {

    var data = { id: id, ques: ques, chk: $(ref).is(":checked") };
    blockUI();

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/AllowMultiple',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });


}
function setRequredArtibute(id, ques, ref) {

    var data = { id: id, ques: ques, chk: $(ref).is(":checked") };
    blockUI();

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/RequiredArtibute',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            successToast();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });


}
function changeNameOfQuestionnaireNew(ref, id) {
    if ($(ref).val() == "") {
        $(ref).focus();
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
    }
    if (confirm(ScriptResourcesList['scriptConfirmChangeName'])) {
        var data = { id: id, name: $(ref).val() };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CustomQuestionnaire/ChangeName',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                $(ref).parent().parent().find(".q-name").val($(ref).val());
                unblockUI();
                showSuccessToast(ScriptResourcesList['scriptUpdated']);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);

            }
        });
    }
}
function changeNameOfQuestionnaire(ref, id) {
    if ($(ref).val() == "") {
        $(ref).focus();
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
    }
    if (confirm(ScriptResourcesList['scriptConfirmChangeName'])) {
        var data = { id: id, name: $(ref).val() };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Survey/ChangeName',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                $(ref).parent().parent().find(".q-name").val($(ref).val());
                unblockUI();
                showSuccessToast(ScriptResourcesList['scriptUpdated']);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);

            }
        });
    }
}
function updateShowInClientContract(ref, id) {
    var data = { id: id, val: $(ref).is(':checked') };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/ShowInClientContract',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function updateShowInContract(ref, id) {
    var data = { id: id, val: $(ref).is(':checked') };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/ShowInContract',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function updateShowInPublic(ref, id) {
    var data = { id: id, val: $(ref).is(':checked') };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/ShowInPublic',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function updateShowInPClient(ref, id) {
    var data = { id: id, val: $(ref).is(':checked') };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/ShowInPClient',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function updateShowInClient(ref, id) {
    var data = { id: id, val: $(ref).is(':checked') };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/ShowInClient',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);

        }
    });
}
function validationOfQuestionnaire() {
    var validated = true;
    $(".main_body .question").each(function () {
        var required = $(this).find(".hdn-ques-req").val();
        var value = $(this).find(".info_input").val();
        if (required == "True") {
            if (value == "") {
                var ques = $.trim($(this).find(".input_lbl").html());
                var str = "";
                str += "Please answer the following : ";
                str += ques;
                showWarningToast(str);
                validated = false;
                return false;
            }
        }
    });


    return validated;
}
function getNewQuesDetail(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CustomQuestionnaire/GetFilledDetail?id=' + id + '&IsPotentail=0&IsPuplic=1&client=0',
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-ques-content").html("");
            $("#custom-ques-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getCQDetail(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/GetFilledDetail?id=' + id + '&IsPotentail=0&IsPuplic=1&client=0',
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-ques-content").html("");
            $("#custom-ques-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function saveQuestion() {
    var obj = new Object();
    obj.FKQuestionnaireType = $("#question-type").val();
    obj.FKAnswerType = $("#answer-type").val();
    obj.Question = $("#lbl-name-ques").val();
    obj.Options = $("#lbl-option-ques").val();
    if (obj.Question == "") {
        return showWarningToast(ScriptResourcesList['scriptPleaseEnterQuestion']);
    }

    blockUI();

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/QuestionRequest',
        data: JSON.stringify(obj),
        async: true,
        success: function (data) {
            unblockUI();
            $(".cq-main-nav .active").find("a").click();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getFilledQuestionnairePublicNew(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CustomQuestionnaire/GetFilledPublic?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-ques-content").html("");
            $("#custom-ques-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getFilledQuestionnairePublic(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/GetFilledPublic?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-ques-content").html("");
            $("#custom-ques-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getLinkQuestionnairePublicNew(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CustomQuestionnaire/GetLinkPublic?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-ques-content").html("");
            $("#custom-ques-content").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getLinkQuestionnairePublic(id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Survey/GetLinkPublic?id=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#custom-ques-content").html("");
            $("#custom-ques-content").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getitFilledFromClient(qid) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/CreateQuestionnaireFromClient',
        data: JSON.stringify({ ques: qid, client: $("#selected-client-id").val() }),
        async: true,
        success: function (data) {
            unblockUI();
            getFilledQuestionnaireClient(qid);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}

function addAsClientCustomQuestionnaireNewP(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CustomQuestionnaire/AddAsPotentialClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptMoveQuestionnaireFailedMessage']);
            }
            $(ref).parent().parent().hide();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            var count = parseInt($("#cust-ques-count").html());
            if (count > 0) {
                var result = parseInt(count) - 1;
                $("#cust-ques-count").html(result);

            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function addAsPotentialClientCustomQuestionnaire(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/AddAsPotentialClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptMoveQuestionnaireFailedMessage']);
            }
            $(ref).parent().parent().hide();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            var count = parseInt($("#cust-ques-count").html());
            if (count > 0) {
                var result = parseInt(count) - 1;
                $("#cust-ques-count").html(result);

            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function addAsClientCustomQuestionnaireNew(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CustomQuestionnaire/AddAsClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptMoveQuestionnaireFailedMessage']);
            }
            $(ref).parent().parent().hide();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            var count = parseInt($("#cust-ques-count").html());
            if (count > 0) {
                var result = parseInt(count) - 1;
                $("#cust-ques-count").html(result);

            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function addAsClientCustomQuestionnaire(qid, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Survey/AddAsClient',
        data: JSON.stringify({ ID: qid }),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                return showErrorToast(ScriptResourcesList['scriptMoveQuestionnaireFailedMessage']);
            }
            $(ref).parent().parent().hide();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            var count = parseInt($("#cust-ques-count").html());
            if (count > 0) {
                var result = parseInt(count) - 1;
                $("#cust-ques-count").html(result);

            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function updateDealPost() {
    var obj = new Object();
    obj.ID = $("#hdn-deal-id").val();
    obj.Name = $("#deal-name").val();
    obj.FKPipelineID = $("#deal-piplines").val();
    obj.FKStageID = $("#stage-id").val();
    obj.FKOwnerID = $("#owner-id").val();
    obj.FKClientID = $("#deal-client-id").val();
    obj.FKPClientID = $("#deal-client-id").val();
    obj.Amount = $("#deal-amount").val();
    obj.ExpectedCloseDate = $("#deal-close-date").val();
    obj.IsClient = true;
    if ($("#dealPotentialClient").is(':checked')) {
        obj.IsClient = false;
    }
    obj.Priority = $("#deal-priority").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Deals/UpdateDeal',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
            $('#add-deal-modal').modal('hide');
            $('body').removeClass('modal-open');
            getDealsForPipline();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function updateDealPostInternal() {
    var obj = new Object();
    obj.ID = $("#hdn-deal-id").val();
    obj.Name = $("#deal-name").val();
    obj.FKPipelineID = $("#deal-pipelines").val();
    obj.FKStageID = $("#stage-id").val();
    obj.FKOwnerID = $("#owner-id").val();
    obj.FKClientID = $("#selected-client-id").val();
    obj.Amount = $("#deal-amount").val();
    obj.ExpectedCloseDate = $("#deal-close-date").val();
    obj.IsClient = true;
    obj.Priority = $("#deal-priority").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Deals/UpdateDeal',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptUpdated']);
            $('#add-deal-modal-in').modal('hide');
            $('body').removeClass('modal-open');
            getClientProfileDeals();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addDeal() {
    var name = $("#deal-name").val();
    var pipeline = $("#deal-piplines").val();
    var stage = $("#stage-id").val();
    var deal = $("#hdn-deal-id").val();

    if (name == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }
    if (stage == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterStage']);
        return false;
    }
    if (deal != "0") {
        return updateDealPost();
    }
    var obj = new Object();
    obj.Name = name;
    obj.FKPipelineID = pipeline;
    obj.FKStageID = stage;
    obj.FKOwnerID = $("#owner-id").val();
    obj.FKClientID = $("#deal-client-id").val();
    obj.FKPClientID = $("#deal-client-id").val();
    obj.Amount = $("#deal-amount").val();
    obj.ExpectedCloseDate = $("#deal-close-date").val();
    obj.IsClient = true;
    if ($("#dealPotentialClient").is(':checked')) {
        obj.IsClient = false;
    }
    obj.Priority = $("#deal-priority").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Deals/AddDeal',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data == "AE") {
                return showWarningToast(ScriptResourcesList['scriptAlreadyExsistInPipeline']);
            }
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            $('#add-deal-modal').modal('hide');
            $('body').removeClass('modal-open');
            getDealsForPipline();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addDealInternal() {
    var name = $("#deal-name").val();
    var pipeline = $("#deal-pipelines").val();
    var stage = $("#stage-id").val();
    var deal = $("#hdn-deal-id").val();

    if (name == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }
    if (pipeline == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterPipeline']);
        return false;
    }
    if (stage == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseEnterStage']);
        return false;
    }
    if (deal != "0") {
        return updateDealPostInternal();
    }
    var obj = new Object();
    obj.Name = name;
    obj.FKPipelineID = pipeline;
    obj.FKStageID = stage;
    obj.FKOwnerID = $("#owner-id").val();
    obj.FKClientID = $("#selected-client-id").val();
    obj.Amount = $("#deal-amount").val();
    obj.ExpectedCloseDate = $("#deal-close-date").val();
    obj.IsClient = true;
    obj.Priority = $("#deal-priority").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Deals/AddDeal',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data == "AE") {
                return showWarningToast(ScriptResourcesList['scriptAlreadyExsistInPipeline']);
            }
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            $('#add-deal-modal-in').modal('hide');
            $('body').removeClass('modal-open');
            getClientProfileDeals();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function closeDealModal() {
    $("#stage-pipeline").val("");
    $('#add-deal-modal').modal('hide');
    $("#add-deal-modal input").val("");
    $("#deal-priority").val("");
    $("#stage-id").val("");
    $('body').removeClass('modal-open');
}
function closeDealModalIn() {
    $("#stage-pipeline").val("");
    $('#add-deal-modal-in').modal('hide');
    $("#add-deal-modal-in input").val("");
    $("#deal-priority").val("");
    $("#stage-id").val("");
    $('body').removeClass('modal-open');
}
function showDealAddPopup() {
    if ($("#deal-piplines").val() == "") {
        showWarningToast(ScriptResourcesList['scriptPleaseSelectAPipeline']);
        return false;
    }
    $("#stage-pipeline").val($("#deal-piplines").val());
    $('#add-deal-modal').modal('show');
}
function showDealAddPopupInternal() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Deals/ClientDealsAdd',
        async: true,
        success: function (data) {
            unblockUI();
            $("#add-deal-modal-in .modal-body").html("");
            $("#add-deal-modal-in .modal-body").html(data);
            $('#add-deal-modal-in').modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function openModalDealUpdateInternal(id, ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Deals/ClientDealsAdd',
        async: true,
        success: function (data) {
            unblockUI();
            $("#add-deal-modal-in .modal-body").html("");
            $("#add-deal-modal-in .modal-body").html(data);
            $("#hdn-deal-id").val(id);
            $("#deal-pipelines").val($(ref).parent().find(".hdn-pipe-line").val());
            getPipelineStages();
            $("#deal-name").val($(ref).parent().find(".hdn-deal-name").val());
            $("#owner-id").val($(ref).parent().find(".hdn-deal-owner").val());
            $("#deal-amount").val($(ref).parent().find(".hdn-deal-amount").val());
            $("#deal-close-date").val($(ref).parent().find(".hdn-deal-close-date").val());
            $("#deal-priority").val($(ref).parent().find(".hdn-deal-priority").val());
            $('#add-deal-modal-in').modal('show');
            $("#stage-id").val($(ref).parent().find(".hdn-deal-stage").val());
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function openModalDealUpdate(id, ref) {
    $("#hdn-deal-id").val(id);
    $("#deal-name").val($(ref).parent().find(".hdn-deal-name").val());
    $("#stage-id").val($(ref).parent().find(".hdn-deal-stage").val());
    $("#owner-id").val($(ref).parent().find(".hdn-deal-owner").val());
    if ($(ref).parent().find(".hdn-deal-isclient").val() == "True") {
        $("#deal-client-id").val($(ref).parent().find(".hdn-deal-client").val());
        $("#dealPotentialClient").prop('checked', false);
        $("#deal-client").show();
        $("#deal-client-p").hide();
        $("#deal-client").val($(ref).parent().find(".hdn-deal-client-name").val());

    }
    else {
        $("#deal-client-id").val($(ref).parent().find(".hdn-deal-pclient").val());
        $("#dealPotentialClient").prop('checked', true);
        $("#deal-client").hide();
        $("#deal-client-p").show();
        $("#deal-client-p").val($(ref).parent().find(".hdn-deal-client-name-p").val());
    }
    $("#deal-amount").val($(ref).parent().find(".hdn-deal-amount").val());
    $("#deal-close-date").val($(ref).parent().find(".hdn-deal-close-date").val());

    $("#deal-priority").val($(ref).parent().find(".hdn-deal-priority").val());
    $('#add-deal-modal').modal('show');
}
function expandThisDeals() {
    if ($("#main-menu").is(":visible")) {

        $("#main-menu").fadeOut();
        $("#content-area").removeClass();
        $("#content-area").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 double_col");
        $("#icon-expand").removeClass("fa-angle-double-left");
        $("#icon-expand").addClass("fa-angle-double-right");

    }
    else {
        $("#main-menu").fadeIn();
        $("#content-area").removeClass();
        $("#content-area").addClass("col-lg-9 col-md-9 col-sm-12 col-xs-12 double_col");
        $("#icon-expand").removeClass("fa-angle-double-right");
        $("#icon-expand").addClass("fa-angle-double-left");

    }
}
function expandThisDashboard() {
    if ($("#main-menu").is(":visible")) {

        $("#main-menu").fadeOut();
        $("#content-area").removeClass();
        $("#content-area").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 double_col");
        $("#icon-expand").removeClass("fa-angle-double-left");
        $("#icon-expand").addClass("fa-angle-double-right");

    }
    else {
        $("#main-menu").fadeIn();
        $("#content-area").removeClass();
        $("#content-area").addClass("col-lg-9 col-md-9 col-sm-12 col-xs-12 double_col");
        $("#icon-expand").removeClass("fa-angle-double-right");
        $("#icon-expand").addClass("fa-angle-double-left");

    }
}
function expandThis() {
    if ($("#rightDiv").is(":visible")) {

        $("#rightDiv").fadeOut();
        $("#centralDiv").removeClass();
        $("#centralDiv").addClass("col-lg-12 col-md-12 col-sm-12 col-xs-12 double_col");
        $("#icon-expand").removeClass("fa-angle-double-right");
        $("#icon-expand").addClass("fa-angle-double-left");
        if ($("#client-doc-table")) {
            $("#client-doc-table .doc-title").each(function () {
                var title = $(this).attr("title");
                $(this).val(title.substring(0, 45));
            });
        }
    }
    else {
        $("#rightDiv").fadeIn();
        $("#centralDiv").removeClass();
        $("#centralDiv").addClass("col-lg-8 col-md-8 col-sm-12 col-xs-12 double_col");
        $("#icon-expand").removeClass("fa-angle-double-left");
        $("#icon-expand").addClass("fa-angle-double-right");
        if ($("#client-doc-table")) {
            $("#client-doc-table .doc-title").each(function () {
                var title = $(this).attr("title");
                $(this).val(title.substring(0, 30));
            });
        }
    }
}
function liSorterAsc(a, b) {

    return Date.parseExact($(a).find(".hdn-task-due-date").val(), "d/M/yyyy") - Date.parseExact($(b).find(".hdn-task-due-date").val(), "d/M/yyyy");
}
function liSorterDsc(a, b) {

    return Date.parseExact($(b).find(".hdn-task-due-date").val(), "d/M/yyyy") - Date.parseExact($(a).find(".hdn-task-due-date").val(), "d/M/yyyy");
}
var mainAscending = true;
function sortTasks(type, ref) {
    blockUI();
    var liContents = [];
    $("." + type + " .main-tasks").each(function () {
        liContents.push($(this).html());
    });
    if (mainAscending) {

        liContents.sort(liSorterAsc);
        mainAscending = false;
    }
    else {

        liContents.sort(liSorterDsc);
        mainAscending = true;
    }
    $("." + type + " .main-tasks").each(function () {
        $(this).html(liContents.pop());
    });
    unblockUI();
}
function liSorterAscClient(a, b) {
    return Date.parseExact($(a).find(".hdn-due-by").val(), "d/M/yyyy") - Date.parseExact($(b).find(".hdn-due-by").val(), "d/M/yyyy");
}
function liSorterDescClient(a, b) {
    return Date.parseExact($(b).find(".hdn-due-by").val(), "d/M/yyyy") - Date.parseExact($(a).find(".hdn-due-by").val(), "d/M/yyyy");
}
var acending = true;
function sortTasksClient() {
    blockUI();
    var liContents = [];
    $("#main-client-tasks .inner-task-item:not(:hidden)").each(function () {
        liContents.push($(this).html());
    });
    if (acending) {
        acending = false;
        liContents.sort(liSorterAscClient);
    }
    else {
        acending = true;
        liContents.sort(liSorterDescClient);
    }


    $("#main-client-tasks .inner-task-item:not(:hidden)").each(function () {
        $(this).html(liContents.pop());
    });
    unblockUI();
}
function sortTasksClientSummary() {
    blockUI();
    var liContents = [];
    $("#main-client-tasks-sum .inner-task-item:not(:hidden)").each(function () {
        liContents.push($(this).html());
    });
    if (acending) {
        acending = false;
        liContents.sort(liSorterAscClient);
    }
    else {
        acending = true;
        liContents.sort(liSorterDescClient);
    }


    $("#main-client-tasks-sum .inner-task-item:not(:hidden)").each(function () {
        $(this).html(liContents.pop());
    });
    unblockUI();
}
function copyToClipboard(id) {
    new ClipboardJS($("#" + id).html());
}
function setDealsCounter() {
    $("#deals-content-detail .stage-col").each(function () {
        $(this).find(".total-deal-count").html($(this).find(".stage-deal").length);
    });
}
function filterDeals(ref) {
    var filterstring = $(ref).val();
    if (filterstring != "" && filterstring.length > 2) {
        $("#deals-content-detail .stage-deal").hide();
        $("#deals-content-detail .stage-col").each(function () {
            $(this).find(".stage-deal").each(function () {
                var dealname = $(this).find(".deal-name").html().toUpperCase();
                var clientname = $(this).find(".deal-client").html().toUpperCase();
                var dealowner = $(this).find(".deal-owner").html().toUpperCase();
                if (dealname.indexOf(filterstring.toUpperCase()) > -1) {
                    $(this).show();
                }
                else if (clientname.indexOf(filterstring.toUpperCase()) > -1) {
                    $(this).show();
                }
                else if (dealowner.indexOf(filterstring.toUpperCase()) > -1) {
                    $(this).show();
                }

            });
        });
    }
    else {

        $("#deals-content-detail .stage-deal").show();
    }

}

function undoMeetingFilter() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Meeting/Meetings',
        async: false,
        success: function (data) {
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getNewModal(ref) {
    var date = $(ref).parents(".date-box").find(".hdnMainDate").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ Date: date }),
        url: '/Meeting/AddNewPopup',
        async: false,
        success: function (data) {
            unblockUI();
            $('#meeting-add-modal .modal-body').html(data);
            $('#meeting-add-modal').modal('show');

            $("#tr-date-not").datepicker({
                dateFormat: 'dd/mm/yy',
                showOn: "button",
                buttonImage: "/Content/Images/calendar.png",
                buttonImageOnly: true,
                buttonText: "Select date",
                changeMonth: true,
                changeYear: true,
                yearRange: "0:+10",
                dateFormat: 'dd/mm/yy'
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getFilterMeetings(date) {
    var date = date.split('/');
    var newDate = date[1] + "/" + date[0] + "/" + date[2];
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Meeting/Meetings?d=' + new Date(newDate).toISOString(),
        async: false,
        success: function (data) {
            unblockUI();
            $("#content-area").html("");
            $("#content-area").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function printMeetings() {
    var name = $.trim($(".welcome_lbl").html());
    name = name.replace("Hello", "");
    var html = "<div style='width:100%;float:left;margin:5px;'><h3>Meetings For " + name + "</h3></div>";
    var count = 1;
    var first = true;
    $(".date-box").each(function () {
        html += "<div style='width:100%;float:left;margin:10px;'><h4>" + $(this).find('.detail_heading').html() + "</h4></div>";
        $(this).find(".meeting-item:not(.empty-meeting)").each(function () {
            html += "<div style='width:100%;float:left;margin:5px'><span>" + count++ + ". </span> " + $(this).find(".selected-visa-status").html() + "  " + $(this).find(".start").html() + " to " + $(this).find(".end").html() + "</div>";
            html += "<div style='width:100%;float:left;margin:5px'><span>" + $(this).find(".meeting-title").html() + "</div>";
        });
    })


    Popup(html);
}
function getUserSummaryDashboardPotential() {
    var id = $("#ddl-user-cs").val();
    if (id === "") {
        return showAllClientsDashboard();
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Dashboard/ClientDashboardSummeryUser?userid=' + id,
        async: true,
        success: function (data) {
            unblockUI();
            $("#tabClientSummary").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function closePopup(ref) {
    $(ref).parents(".modal").modal('hide');
    $('body').removeClass('modal-open');
    $("#client-custom-questionnaire-modal-p .modal-body").html("");
    $("#client-custom-questionnaire-modal .modal-body").html("");
}
function updateProgramStatusDate(id, date) {
    var obj = new Object();
    obj.ID = id;
    obj.Date = date;
    obj.FKClientID = $("#selected-client-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Addmission/ClientStatusDateUpdate',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptUpdated'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function updateVisaStatusDate(id, date) {
    var obj = new Object();
    obj.ID = id;
    obj.Date = date;
    obj.FKClientID = $("#selected-client-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ClientVisaStatusDateUpdate',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptUpdated'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function removeDateOld(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/DeleteVisaStatusDate',
            async: false,
            data: JSON.stringify({ 'id': id, 'client': $("#selected-client-id").val() }),
            success: function (data) {
                unblockUI();
                $(ref).parent().remove();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }
}
function removeDateOldProgram(id, ref) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Addmission/DeleteStatusDate',
            async: false,
            data: JSON.stringify({ 'id': id }),
            success: function (data) {
                unblockUI();
                $(ref).parent().remove();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }
}
function removeDate(ref) {
    $(ref).parent().remove();
}
function addNewDate(ref) {
    var count = parseInt($(ref).parent().find(".other-date").length) + 1;
    var html = "";
    html += '<div class="other-date">';
    html += '<i class="fa fa-times-circle-o" onclick="removeDate(this)"></i>';
    html += '<p class="chkbox_p blue_chkbx">';
    html += '<input id="check-add-rem-' + count + '" class="custom_chkbox check-add-reminder" type="checkbox" checked>';
    html += '<label class="chkbx_label less_padding" for="check-add-rem-' + count + '">Add Reminder</label>';
    html += ' </p>';
    html += '<h4>Reminder Days :</h4>';
    html += '<input class="reminderdays info_input" type="number" />';
    html += '<h4>Name :</h4>';
    html += '<input class="datename info_input" type="text" />   <input class="dateid" type="hidden" value="0" />';
    html += '<h4>Date :</h4>';
    html += '<input class="datedate info_input" type="text" />';
    html += '<hr>';
    html += '</div>';

    $(ref).parent().append(html);
    $(".datedate").datepicker({
        dateFormat: 'dd/mm/yy',
        showOn: "button",
        buttonImage: "/Content/Images/calendar.png",
        buttonImageOnly: true,
        defaultDate: new Date(),
        buttonText: "Select date",
        changeMonth: true,
        changeYear: true,
        yearRange: "-150:+10",
        dateFormat: 'dd/mm/yy'
    });
}
function addNewDateProgram(ref) {
    var count = parseInt($(ref).parent().find(".other-date").length) + 1;
    var html = "";
    html += '<div class="other-date">';
    html += '<i class="fa fa-times-circle-o" onclick="removeDate(this)"></i>';
    html += '<h4>Name :</h4>';
    html += '<input class="datename info_input" type="text" />   <input class="dateid" type="hidden" value="0" />';
    html += '<h4>Date :</h4>';
    html += '<input class="datedate info_input" type="text" />';
    html += '<hr>';
    html += '</div>';

    $(ref).parent().parent().append(html);
    $(".datedate").datepicker({
        dateFormat: 'dd/mm/yy',
        showOn: "button",
        buttonImage: "/Content/Images/calendar.png",
        buttonImageOnly: true,
        defaultDate: new Date(),
        buttonText: "Select date",
        changeMonth: true,
        changeYear: true,
        yearRange: "-150:+10",
        dateFormat: 'dd/mm/yy'
    });
}
function openReferalConditions() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Home/ReferalContract',
        async: true,
        success: function (data) {
            unblockUI();
            $('#referealManagementModal .modal-body').html(data);
            $('#referealManagementModal').modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });

}
function getClientDocumentTypeMulti() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocument']);
    }
    $('#bulk-type-modal').modal('show');
}
function getClientDocumentVisaMulti() {
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocument']);
    }
    $('#doc-add-visa-multi').modal('show');
}
function getClientDocumentVisa(id) {
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/GetDocumentVisas',
        async: false,
        data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
        success: function (data) {
            unblockUI();
            $('#doc-add-visa').modal('show');
            $("#hdn-visa-doc-id").val(id);
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $("#visa-doc-" + data[i]).prop("checked", true);
                    $("#visa-doc-" + data[i]).addClass("already");
                }
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function saveVisaDocuments() {

    var lista = [];
    var listb = [];

    $("#client-doc-visa .select-visa-doc:checked").each(function () {
        lista.push($(this).parent().find(".visa-id").val());
    });
    $("#client-doc-visa .already:not(:checked)").each(function () {
        listb.push($(this).parent().find(".visa-id").val());
    });
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/AddDocumentVisas',
        async: false,
        data: JSON.stringify({ id: $("#hdn-visa-doc-id").val(), client: $("#selected-client-id").val(), visas: lista, del: listb }),
        success: function (data) {
            unblockUI();
            $("#client-doc-visa .select-visa-doc").prop("checked", false);
            $("#selectAllCheckVisaDoc").prop("checked", false);
            $("#hdn-visa-doc-id").val("");
            $("#client-doc-visa .select-visa-doc").removeClass("already");
            $('#doc-add-visa').modal('hide');
            $('body').removeClass('modal-open');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function saveVisaDocumentsMulti() {

    var docs = [];
    var visas = []
    if ($(".select-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectDocument']);
    }
    if ($("#client-doc-visa-multi .select-visa-doc:checked").length == 0) {
        return showWarningToast(ScriptResourcesList['scriptPleaseSelectVisaType']);
    }
    $("#client-doc-visa-multi .select-visa-doc:checked").each(function () {
        visas.push($(this).parent().find(".visa-id").val());
    });
    $(".select-doc:checked").each(function () {
        docs.push($(this).parent().find(".doc-id").val());
    });
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/AddDocumentVisasMulti',
        async: false,
        data: JSON.stringify({ ids: docs, client: $("#selected-client-id").val(), visas: visas }),
        success: function (data) {
            unblockUI();
            $("#client-doc-visa-multi .select-visa-doc").prop("checked", false);
            $("#selectAllCheckVisaDocMulti").prop("checked", false);
            $(".select-doc").prop("checked", false);
            $("#selectAllCheck").prop("checked", false);
            $('#doc-add-visa-multi').modal('hide');
            $('body').removeClass('modal-open');

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function searchDocTypeVisa(ref) {
    var visa = $(ref).val();
    if (visa == "") {
        return getClientDocs();
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetClientDocuments?id=' + $("#selected-client-id").val() + '&visa=' + visa,
        async: true,
        success: function (data) {
            if ($("#activity-notes-p").html()) { showActions(); }
            $("#client-content").html("");
            $("#client-content").html(data);
            $(".client-ul li").removeClass("active");
            $("#tabDocs").parent().addClass("active");
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

var _defaultFont = "";
$.ajaxSetup({
    statusCode: {
        401: function () {
            $("#session-alert").modal('show');
        }
    }
});

function deleteContactSupplier(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Supplier/DeleteSupplierContact',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
}
function openPreviewAndEditPopup(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CustomQuestionnaire/Update?id=' + id + '&fromClient=true',
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-custom-questionnaire-modal .modal-body").html(data);
            $("#client-custom-questionnaire-modal").modal('show');
            $(".mapped-answer").each(function () {

                var mm = $(this).val().split('~');
                var mapped = mm[0];
                var mappedproperty = mm[1];
                var type = mm[2];
                var ref = $(this).parent();
                var select = '<select class="search-select property-select"><option value="">Please select</option>';
                select += $("#hdn-child-values-" + mapped).val();
                select += '</select>';
                $(ref).next(".mapped-prop").html(select);
                $(ref).next(".mapped-prop").find('select').val(mappedproperty);
                $(ref).next(".mapped-prop").find('select').selectize({
                    persist: false,
                    createOnBlur: false,
                    create: true
                });

            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function openPreviewAndEditPopupPotential(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CustomQuestionnaire/Update?id=' + id + '&fromClient=true',
        async: true,
        success: function (data) {
            unblockUI();
            $("#client-custom-questionnaire-modal-p .modal-body").html(data);
            $("#client-custom-questionnaire-modal-p").modal('show');
            $(".mapped-answer").each(function () {

                var mm = $(this).val().split('~');
                var mapped = mm[0];
                var mappedproperty = mm[1];
                var type = mm[2];
                var ref = $(this).parent();
                var select = '<select class="search-select property-select"><option value="">Please select</option>';
                select += $("#hdn-child-values-" + mapped).val();
                select += '</select>';
                $(ref).next(".mapped-prop").html(select);
                $(ref).next(".mapped-prop").find('select').val(mappedproperty);
                $(ref).next(".mapped-prop").find('select').selectize({
                    persist: false,
                    createOnBlur: false,
                    create: true
                });

            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function addClientType(internal) {
    if ($("#hdn-client-type").val() != "") {
        return updateClientType();
    }

    $("#client-type-modal .errorSpanModal").html("");
    var name = $("#client-type-name").val();


    if (name === "") {
        $("#client-type-name").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterName']);
        return false;
    }


    var obj = new Object();
    obj.Name = name;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CInfo/InsertClientType',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            showSuccessToast(ScriptResourcesList['scriptAdded']);
            $('#client-type-modal').modal('hide');
            $('body').removeClass('modal-open');
            getClientTypes();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function updateClientTypeGet(id, name) {
    $("#client-type-modal .errorSpanModal").html("");
    $("#hdn-client-type").val(id);
    $("#client-type-name").val(name);

    $('#client-type-modal').modal('show');
}
function updateClientType() {

    if (confirm(ScriptResourcesList['scriptConfirmUpdateClientType'])) {
        $("#client-type-modal .errorSpanModal").html("");
        var name = $("#client-type-name").val();


        if (name === "") {
            $("#client-type-name").next(".errorSpanModal").html(ScriptResourcesList['scriptPleaseEnterName']);
            return false;
        }

        var obj = new Object();
        obj.ID = $("#hdn-client-type").val();
        obj.Name = name;
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/UpdateClientType',
            async: false,
            data: JSON.stringify(obj),
            success: function (data) {
                unblockUI();
                showSuccessToast(ScriptResourcesList['scriptUpdated']);
                $("#client-type-name").val("");
                $("#hdn-client-type").val("");
                $('#client-type-modal').modal('hide');
                $('body').removeClass('modal-open');
                getClientTypes();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }

}
function deleteClientType(id, ref) {
    if (confirm(ScriptResourcesList['scriptConfirmDeleteClientType'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CInfo/DeleteClientType',
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
function getClientTypes(ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CInfo/GetClientTypes',
        async: true,
        success: function (data) {

            $("#config-content").html("");
            $("#config-content").html(data);
            if (ref) {
                $(".nav-email-temp li").removeClass("active");
                $(ref).parent().addClass("active");
            }

            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}