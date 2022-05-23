var toggle = true;
function saveCheckList() {
    $(".input_error_msg").hide();
    var error = "Please select an exsisting category or add a new one";
    var error1 = "Please select an exsisting category or a new one, you can't select both";
    var error2 = "Please enter checklist name";
    var error3 = "Please enter some tasks";
    var error4 = "Category name should be less then 500 characters !";
    var error5 = "List name should be less then 500 characters !";
    var name = $("#check-list-name").val();

    var sCat = $("#select-category").val();
    var cat = $("#text-category").val();
    if (sCat == "" && cat == "") {
        $("#select-category").parent().parent().find(".input_error_msg").show();
        $("#select-category").parent().parent().find(".input_error_msg").html(error);
        return false;
    }
    if (sCat != "" && cat != "") {
        $("#select-category").parent().parent().find(".input_error_msg").show();
        $("#select-category").parent().parent().find(".input_error_msg").html(error1);
        return false;
    }
    if (cat.length > 500) {
        $("#select-category").parent().parent().find(".input_error_msg").show();
        $("#select-category").parent().parent().find(".input_error_msg").html(error4);
        return false;
    }
    if (name == "") {
        $("#check-list-name").next(".input_error_msg").show();
        $("#check-list-name").next(".input_error_msg").html(error2);
        return false;
    }
    if (name.length > 500) {
        $("#check-list-name").next(".input_error_msg").show();
        $("#check-list-name").next(".input_error_msg").html(error5);
        return false;
    }
    if ($(".sd-datarow").length == 0) {
        $("#check-list-name").next(".input_error_msg").show();
        $("#check-list-name").next(".input_error_msg").html(error3);
        return false;
    }
    var obj = new Object();
    obj.CategoryName = cat;
    obj.CategoryID = sCat;
    var check = new Object;
    check.Name = name;

    var tasks = [];
    $(".sd-datarow").each(function () {
        var task = new Object();
        task.Name = $(this).find(".new-task-title").val();
        task.Description = $(this).find(".new-task-description").val();
        tasks.push(task);
    });
    check.Tasks = tasks;
    obj.CheckList = check;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/AddCheckList',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            location.reload();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function addTaskRow() {
    $(".input_error_msg").hide();
    if ($("#task-title-new").val() == "") {
        $("#task-title-new").next(".input_error_msg").html("Please enter task title");
        $("#task-title-new").next(".input_error_msg").show();
        return false;
    }
    if ($("#task-title-new").length > 400) {
        $("#task-title-new").next(".input_error_msg").html("Title characters limit is 400 !");
        $("#task-title-new").next(".input_error_msg").show();
        return false;
    }
    if ($("#task-desc-new").length > 1000) {
        $("#task-desc-new").next(".input_error_msg").html("Desc characters limit is 1000 !");
        $("#task-desc-new").next(".input_error_msg").show();
        return false;
    }
    var title = $("#task-title-new").val();
    var desc = $("#task-desc-new").val();
    var count = $(".sd-datarow").length;
    count++;
    var html = "";
    if ($("#task-row-id").val() == "") {
        html += '<div class="sd-datarow" id="row-' + count + '">';
    }
    else {
        html += '<div class="sd-datarow" id="' + $("#task-row-id").val() + '">';
    }
    html += '<h5 class="blu-bullet">&nbsp;</h5>';
    html += '<h6 class="chkbx-txt">' + title + '</h6>';
    html += '<input type="hidden" value="' + title + '" class="new-task-title" />';
    html += '<input type="hidden" value="' + desc + '" class="new-task-description" />';
    html += '<div class="flt-icons">';
    html += '<a href="#" onclick="editTask(this)"><h6 class="edit-link" >Edit</h6></a> <span class="separator">|</span>';
    html += '<i onclick="deleteTaskRow(this)" class="flaticon-multiply"></i>';
    html += '</div>';
    html += '</div>';
    if ($("#task-row-id").val() == "") {
        $(".tasks-row").append(html);
    }
    else {
        var id = $("#task-row-id").val();
        $("#" + id).replaceWith(html);
    }

    $("#task-row-id").val("");
    $('#task-new-modal').modal('hide');
    $('body').removeClass('modal-open');
    
    $("#task-title-new").val("");
    $("#task-desc-new").val("");
}
function editTask(ref) {
    var title = $(ref).parent().parent().find(".new-task-title").val();
    var desc = $(ref).parent().parent().find(".new-task-description").val();
    var id = $(ref).parent().parent().attr("id");

    $("#task-title-new").val(title);
    $("#task-desc-new").val(desc);
    $("#task-row-id").val(id);
    $('#task-new-modal').modal('show');
}
function deleteTaskRow(ref) {
    $(ref).parent().parent().remove();
}


function showCategoryCheckLists(id, ref) {
    if ($(ref).parent().parent().find(".sub-category-div").is(":visible") == false) {
        blockUI();
        $.ajax(
        {
            type: "GET",
            contentType: "html",
            url: '/CMS/AllCheckLists?id=' + id,
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
function showListTasks(id, ref) {
    if ($(ref).parent().parent().find(".status-detail-box").is(":visible") == false) {
        blockUI();
        $.ajax(
        {
            type: "GET",
            contentType: "html",
            url: '/CMS/AllCheckListTasks?id=' + id,
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
function addConcernPersonCMS(ref) {

    if ($(ref).val() != "") {

        if (confirm("Are you sure you want to add this as concern person ?")) {
            var id = $(ref).val();
            var client = $(ref).parents(".inner-content-box").find(".hdn-client-id").val();
            blockUI();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/CMS/AddConcernPerson',
                data: JSON.stringify({ id: id, client: client }),
                async: true,
                success: function (data) {

                    unblockUI();
                    if (data == "AE") {
                        return $().toastmessage('showToast', {
                            text: 'Person already added !',
                            sticky: false,
                            position: 'bottom-right',
                            type: 'error'

                        });

                    }
                    if (data == false) {
                        return $().toastmessage('showToast', {
                            text: 'Failed !',
                            sticky: false,
                            position: 'bottom-right',
                            type: 'error'

                        });
                    }
                    var avatar = "";
                    if (data.ImageString == null || data.ImageString == "") {

                        avatar += '<li>';
                        avatar += '<img class="thumbnail-img" src="~/Content/Images/person.png" alt="User" />';
                        avatar += '<i class="del-folwr fa fa-times"></i>';
                        avatar += '<span><img src="/Content/Images/person.png" alt="User" /><br /><p class="img-title">' + data.FullName + '</p></span>';
                        avatar += '</li>';
                    }
                    else {
                        avatar += '<li>';
                        avatar += '<img class="thumbnail-img" src="data:image/png;base64, ' + data.ImageString + ' " alt="User" />';
                        avatar += '<i class="del-folwr fa fa-times"></i>';
                        avatar += '<span><img src="data:image/png;base64, ' + data.ImageString + ' " alt="User" /><br /><p class="img-title">' + data.FullName + '</p></span>';
                        avatar += '</li>';
                    }
                    $(ref).parent().parent().find(".user-avatar").append(avatar);
                    $(ref).parent().parent().parent().find(".user-dropdown").each(function () {
                        var li = "";
                        var image = "";
                        if (data.ImageString == null || data.ImageString == "") {
                            image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35' src='/Content/Images/person.png'  alt='User' /></div><p class='person-name'>" + data.FullName + " </p>";
                        }
                        else {
                            image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35' src='data:image/png;base64," + data.ImageString + "'   alt='User' /></div><p class='person-name'>" + data.FullName + " </p>";

                        }
                        li += "<li onclick='assignUserTaskCMS(" + data.UserID + ",this)'>" + image + "</li>";
                        $(this).append(li);
                        $(this).find(".zero-row").remove();
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    unblockUI();
                    handleErrors(textStatus);
                }
            });

        }

    }

}
function addConcernPersonCMSP(ref) {

    if ($(ref).val() != "") {

        if (confirm("Are you sure you want to add this as concern person ?")) {
            var id = $(ref).val();
            var client = $(ref).parents(".inner-content-box").find(".hdn-client-id").val();
            blockUI();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/CMS/AddConcernPersonP',
                data: JSON.stringify({ id: id, client: client }),
                async: true,
                success: function (data) {

                    unblockUI();
                    if (data == "AE") {
                        return $().toastmessage('showToast', {
                            text: 'Person already added !',
                            sticky: false,
                            position: 'bottom-right',
                            type: 'error'

                        });

                    }
                    if (data == false) {
                        return $().toastmessage('showToast', {
                            text: 'Failed !',
                            sticky: false,
                            position: 'bottom-right',
                            type: 'error'

                        });
                    }
                    var avatar = "";
                    if (data.ImageString == null || data.ImageString == "") {

                        avatar += '<li>';
                        avatar += '<img class="thumbnail-img" src="/Content/Images/person.png" alt="User" />';
                        avatar += '<i class="del-folwr fa fa-times"></i>';
                        avatar += '<span><img src="/Content/Images/person.png" alt="User" /><br /><p class="img-title">' + data.FullName + '</p></span>';
                        avatar += '</li>';
                    }
                    else {
                        avatar += '<li>';
                        avatar += '<img class="thumbnail-img" src="data:image/png;base64, ' + data.ImageString + ' " alt="User" />';
                        avatar += '<i class="del-folwr fa fa-times"></i>';
                        avatar += '<span><img src="data:image/png;base64, ' + data.ImageString + ' " alt="User" /><br /><p class="img-title">' + data.FullName + '</p></span>';
                        avatar += '</li>';
                    }
                    $(ref).parent().parent().find(".user-avatar").append(avatar);
                    $(ref).parent().parent().parent().find(".user-dropdown").each(function () {
                        var li = "";
                        var image = "";
                        if (data.ImageString == null || data.ImageString == "") {
                            image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35'  src='data:image/png;base64," + data.ImageString + "' alt='User' /></div><p class='person-name'>" + data.FullName + " </p>";
                        }
                        else {
                            image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35'  src='/Content/Images/person.png' alt='User' /></div><p class='person-name'>" + data.FullName + " </p>";

                        }
                        li += "<li onclick='assignUserTaskCMS(" + data.UserID + ",this)'>" + image + "</li>";
                        $(this).append(li);
                        $(this).find(".zero-row").remove();
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    unblockUI();
                    handleErrors(textStatus);
                }
            });

        }

    }

}

function assignUserTaskCMS(id, ref) {
    if (confirm("Are you sure you want to assign task to this user ?")) {
        var task = $(ref).parents(".sd-datarow").find(".task-id-cms").val();
        var tasks = [];
        var obj = new Object();
        obj.TaskID = task;
        obj.UserID = id;
        var name = $(ref).find(".person-name").html();
        tasks.push(obj);
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/AssignTask',
            async: false,
            data: JSON.stringify(tasks),
            success: function (data) {
                unblockUI();
                return $().toastmessage('showToast', {
                    text: 'Task Assigned to ' + name + ' !',
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

}
function assignUserTaskCMSAll(id, ref) {
    if (confirm("Are you sure you want to assign all tasks to this user ?")) {
        var tasks = [];
        $(ref).parents(".all-tasks").find(".sd-datarow").each(function () {
            var taskID = $(this).find(".task-id-cms").val();
            var obj = new Object();
            obj.TaskID = taskID;
            obj.UserID = id;
            tasks.push(obj);
        });
        var name = $(ref).find(".person-name").html();
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/AssignTask',
            async: false,
            data: JSON.stringify(tasks),
            success: function (data) {
                unblockUI();
                return $().toastmessage('showToast', {
                    text: 'Task Assigned to ' + name + ' !',
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

}

function resscheduleTaskCMS() {
    $("#task-date-error").hide();

    if ($("#task-date").val() == "") {
        $("#task-date-error").show();
        return false;
    }
    var obj = new Object();
    obj.TaskID = $("#hdn-task-id").val();
    obj.Date = $("#task-date").val();
    var resArr = [];
    resArr.push(obj);
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/RescheduleTask',
        data: JSON.stringify(resArr),
        async: true,
        success: function (data) {
            unblockUI();
            $('#re-cms-dialog').modal('hide');
            $('body').removeClass('modal-open');
            if (data == false) {
                return $().toastmessage('showToast', {
                    text: 'Something went wrong please try again',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function resscheduleTaskCMSAll() {
    $("#task-date-error-all").hide();

    if ($("#task-date-all").val() == "") {
        $("#task-date-error-all").show();
        return false;
    }
    var checklistid = $("#hdn-checklist-id").val();
    var resArr = [];
    $("#container-" + checklistid + " .sd-datarow").each(function () {
        var obj = new Object();
        obj.TaskID = $(this).find(".task-id-cms").val();
        obj.Date = $("#task-date-all").val()
        resArr.push(obj);
    })
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/RescheduleTask',
        data: JSON.stringify(resArr),
        async: true,
        success: function (data) {
            unblockUI();
            $('#re-cms-dialog-all').modal('hide');
            $('body').removeClass('modal-open');
            if (data == false) {
                return $().toastmessage('showToast', {
                    text: 'Something went wrong please try again',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function openResPopCMS(id) {
    $("#hdn-task-id").val(id);
    $('#task-date').attr('readonly', true);
    $("#task-date").datepicker({
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


    $('#re-cms-dialog').modal('show');
    $("#task-date").attr('readonly', true);

}
function openResPopCMSAll(id) {
    $("#hdn-checklist-id").val(id);
    $('#task-date-all').attr('readonly', true);
    $("#task-date-all").datepicker({
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
    $('#re-cms-dialog-all').modal('show');

}

function deleteTaskCMS(ref, task,type) {
    if (confirm("Are you sure you want to delete this ?")) {
        var tasks = [];
        tasks.push(task);
        var obj = new Object();
        obj.Tasks = tasks;
        obj.Type = type;
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/DeleteTask',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {

                unblockUI();
                if (data == false) {
                    showErrorToast("Failed !")
                }
                if (data) {
              
                    $('#progress-' + data.CheckListID + '').css('width', data.CheckListPercent.toFixed(2) + '%').attr('aria-valuenow', data.CheckListPercent.toFixed(2));
                    $('#progress-' + data.CheckListID + '').html(data.CheckListPercent.toFixed(2) + " %");
                    $('#chk-' + task).parents(".client-visa-list-item").find(".progress-bar-visa").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                    $('#chk-' + task).parents(".client-visa-list-item").find(".progress-bar-visa").html(data.VisaPercent.toFixed(2) + " %");
                    $('#chk-' + task).parents(".client-visa-detail").find(".checklist-main-bar").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                    $('#chk-' + task).parents(".client-visa-detail").find(".checklist-main-bar").html(data.VisaPercent.toFixed(2) + " %");
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
function hideActiveCase(ref, id) {
    if (confirm("Are you sure you want to remove this ?")) {
        var data = { id: id };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/HideCase',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().remove();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}
function hideProgramCMS(ref, id) {
    if (confirm("Are you sure you want to remove this ?")) {
        var data = { id: id };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/HideProgramCMS',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}

function hideVisaCMS(ref, id) {
    if (confirm("Are you sure you want to remove this ?")) {
        var data = { id: id };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/HideVisaCMS',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}

function hideVisaCMSP(ref, id) {
    if (confirm("Are you sure you want to remove this ?")) {
        var data = { id: id };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/HideVisaCMSP',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().parent().remove();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}
function hideActiveCaseP(ref, id) {
    if (confirm("Are you sure you want to remove this ?")) {
        var data = { id: id };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/HideCasePotential',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    $(ref).parent().remove();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}
function deleteTaskCMSAll(id,type) {
    if (confirm("Are you sure you want to delete all checklist tasks ?")) {
        var tasks = [];
      
        $("#container-" + id + " .sd-datarow").each(function () {
            tasks.push($(this).find(".task-id-cms").val());
        })
       
        var obj = new Object();
        obj.Tasks = tasks;
        obj.Type = type;
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/DeleteTask',
            data: JSON.stringify(obj),
            async: true,
            success: function (data) {
  
                unblockUI();
                if (data == false) {
                    showErrorToast("Failed !")
                }
                if (data) {

                    $('#progress-' + data.CheckListID + '').css('width', data.CheckListPercent.toFixed(2) + '%').attr('aria-valuenow', data.CheckListPercent.toFixed(2));
                    $('#progress-' + data.CheckListID + '').html(data.CheckListPercent.toFixed(2) + " %");                    
                    $("#container-" + id + " .sd-datarow").remove();
                    successToast();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });
    }

}
function getAddNewVisa(id, p) {
    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/GetNewVisa',
        aync: true,
        success: function (data) {
            unblockUI();
            $("#modal-star-visa .modal-body").html(data);
            $("#selected-client-id-cms").val(id);
            if (p == "P") {
                $("#is-potential").val(true);
            }
            else {
                $("#is-potential").val(false);
            }
            $("#modal-star-visa").modal("show");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })
}
function getVisaListForClient(id) {
    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/GetClientVisas?id=' + id,
        aync: true,
        success: function (data) {
            unblockUI();
            $("#client-visa-list").html(data)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })
}
function startApplicationCMS() {
    if ($("#visa-types").val() == "") {
        return $().toastmessage('showToast', {
            text: 'Please select a visa to apply',
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
    if ($("#visa-status").length > 0)
    {
        if ($("#visa-status").val() == "") {
            return $().toastmessage('showToast', {
                text: 'Please select a visa to apply',
                sticky: false,
                position: 'bottom-right',
                type: 'error'

            });

        }
    }
    
    if ($("#is-potential").val() == "true") {
        var data = { id: $("#selected-client-id-cms").val(), type: $("#visa-types").val(), start: $("#start-date").val(), email: false, status: $("#visa-status").val()};
        $(".btn").prop("disabled", true);
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/GetNewVisaP',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                $(".btn").prop("disabled", false);
                unblockUI();
                $("#modal-star-visa").modal("hide");
                $('body').removeClass('modal-open');
                $('body').removeClass('modal-open');
                showClientVisasAfterAddPotential($("#selected-client-id-cms").val());
                return $().toastmessage('showToast', {
                    text: 'New visa added !',
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
    else {
        if (confirm("Send Email Notification ?")) {
            var data = { id: $("#selected-client-id-cms").val(), type: $("#visa-types").val(), start: $("#start-date").val(), email: true, status: $("#visa-status").val() };
            $(".btn").prop("disabled", true);
            blockUI();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/CMS/GetNewVisa',
                data: JSON.stringify(data),
                async: true,
                success: function (data) {
                    $(".btn").prop("disabled", false);
                    unblockUI();
                    $("#modal-star-visa").modal("hide");
                    $('body').removeClass('modal-open');
                    $('body').removeClass('modal-open');
                    showClientVisasAfterAdd($("#selected-client-id-cms").val());
                    return $().toastmessage('showToast', {
                        text: 'New visa added !',
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
        else {
            var data = { id: $("#selected-client-id-cms").val(), type: $("#visa-types").val(), start: $("#start-date").val(), email: false, status: $("#visa-status").val() };
            $(".btn").prop("disabled", true);
            blockUI();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/CMS/GetNewVisa',
                data: JSON.stringify(data),
                async: true,
                success: function (data) {
                    $(".btn").prop("disabled", false);
                    unblockUI();
                    $("#modal-star-visa").modal("hide");
                    $('body').removeClass('modal-open');
                    $('body').removeClass('modal-open');
                    showClientVisasAfterAdd($("#selected-client-id-cms").val());
                    return $().toastmessage('showToast', {
                        text: 'New visa added !',
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


    }

}


function showClientVisasAfterAdd(id) {

    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/GetClientVisas?id=' + id,
        aync: true,
        success: function (data) {
            unblockUI();
            $("#client-main-" + id).find(".client-visa-list").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })

}

function showClientVisasAfterAddPotential(id) {

    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/GetClientVisasP?id=' + id,
        aync: true,
        success: function (data) {
            unblockUI();
            $("#client-main-" + id).find(".client-visa-list").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })

}
function completeTaskCMS(ref, task, type) {
    var data = { task: task, type: type };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/CompleteTask',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == false) {
                showErrorToast("Failed !")
            }
            if (data) {
                $(ref).parent().replaceWith('<h5 class="green-bullet"><span id="chk-' + task + '"></span></h5>');
                $('#progress-' + data.CheckListID + '').css('width', data.CheckListPercent.toFixed(2) + '%').attr('aria-valuenow', data.CheckListPercent.toFixed(2));
                $('#progress-' + data.CheckListID + '').html(data.CheckListPercent.toFixed(2) + " %");
                $('#chk-' + task).parents(".client-visa-list-item").find(".progress-bar-visa").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                $('#chk-' + task).parents(".client-visa-list-item").find(".progress-bar-visa").html(data.VisaPercent.toFixed(2) + " %");
                $('#chk-' + task).parents(".client-visa-detail").find(".checklist-main-bar").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                $('#chk-' + task).parents(".client-visa-detail").find(".checklist-main-bar").html(data.VisaPercent.toFixed(2) + " %");
                $('#chk-' + task).parents(".sd-datarow").find(".flt-icons").append(' <i onclick="undoCompleteTaskCMS(this,'+task+',\''+type+'\')" class="fa fa-undo undo-icon"></i>');
               
                showSuccessToast("Task Completed");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);

        }
    });

}
function undoCompleteTaskCMS(ref, task, type) {
    if (confirm("Are you sure you want reactivate this task ?"))
    {
        var data = { task: task, type: type };
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/UndoComplete',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == false) {
                    showErrorToast("Failed !")
                }
                if (data) {
                    var check = "";
                    check += ' <p class="sd-ckhbx">';
                    check += ' <input type="checkbox" id="chk-' + task + '" onchange="completeTaskCMS(this,' + task + ',"' + type + '")" />';
                    check += ' <label for="chk-' + task + '" class="chkbx_label">&nbsp;</label>';
                    check += ' </p>';
                    $(ref).parent().parent().find(".green-bullet").remove();
                    $(ref).parent().parent().prepend(check);
                    $(ref).remove();
                    $('#progress-' + data.CheckListID + '').css('width', data.CheckListPercent.toFixed(2) + '%').attr('aria-valuenow', data.CheckListPercent.toFixed(2));
                    $('#progress-' + data.CheckListID + '').html(data.CheckListPercent.toFixed(2) + " %");
                    $('#chk-' + task).parents(".client-visa-list-item").find(".progress-bar-visa").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                    $('#chk-' + task).parents(".client-visa-list-item").find(".progress-bar-visa").html(data.VisaPercent.toFixed(2) + " %");
                    $('#chk-' + task).parents(".client-visa-detail").find(".checklist-main-bar").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                    $('#chk-' + task).parents(".client-visa-detail").find(".checklist-main-bar").html(data.VisaPercent.toFixed(2) + " %");
                   
                    showSuccessToast("Updated !");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);

            }
        });

    }


}
function getAllActiveClients() {
    var obj = new Object();
    obj.Page = 1;
    obj.IsPotential = false;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/AllActiveClients',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            $(".btn").prop("disabled", false);
            unblockUI();
            $("#cms-main-content").html("");
            $("#cms-main-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function getAllPotentialClients() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CMS/PotentialClientsList',
        async: false,
        success: function (data) {
            $(".btn").prop("disabled", false);
            unblockUI();
            $("#cms-main-content").html("");
            $("#cms-main-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function getAllAgentClients() {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/CMS/AgentsSummary',
        async: false,
        success: function (data) {
            $(".btn").prop("disabled", false);
            unblockUI();
            $("#cms-main-content").html("");
            $("#cms-main-content").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function acceptClientFromAgentCMS(id, ref) {
    var data = { Id: id };
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Management/AcceptClient',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            if (data == true) {

                $().toastmessage('showToast', {
                    text: 'Client Accepted, now this client will be available in clients section',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                $(ref).parent().parent().remove();

            }
            else {
                return $().toastmessage('showToast', {
                    text: 'Something went wrong please try again',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function checkListApplied() {
    return $().toastmessage('showToast', {
        text: 'Checklist applied !',
        sticky: false,
        position: 'bottom-right',
        type: 'success'

    });
}
function getVisaCheckListDetailN(id, client, name, ref) {
    if ($(ref).parent().parent().find(".client-visa-detail").html().trim() == "") {
        blockUI();
        $.ajax(
        {
            type: "GET",
            contentType: "html",
            url: '/CMS/GetClientVisasDetail?id=' + id + '&client=' + client + '&name=' + name,
            aync: true,
            success: function (data) {
                unblockUI();
                $(ref).parent().next(".client-visa-detail").html(data);
                $(ref).find(".fa").addClass("fa-caret-down");
                $(ref).find(".fa").removeClass("fa-caret-up");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
    else {
        $(ref).parent().parent().find(".client-visa-detail").html("");
        $(ref).find(".fa").removeClass("fa-caret-down");
        $(ref).find(".fa").addClass("fa-caret-up");

    }

}

function getVisaCheckListDetailNA(id, client, name, ref) {
    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/GetClientVisasDetail?id=' + id + '&client=' + client + '&name=' + name,
        aync: true,
        success: function (data) {
            unblockUI();
            $(ref).parent().next(".client-visa-detail").html(data);
            $(ref).find(".fa").addClass("fa-caret-down");
            $(ref).find(".fa").removeClass("fa-caret-up");
            checkListApplied();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getVisaCheckListDetailNP(id, client, name, ref) {
    if ($(ref).parent().parent().find(".client-visa-detail").html().trim() == "") {
        blockUI();
        $.ajax(
        {
            type: "GET",
            contentType: "html",
            url: '/CMS/GetClientVisasDetailP?id=' + id + '&client=' + client + '&name=' + name,
            aync: true,
            success: function (data) {
                unblockUI();
                $(ref).parent().next(".client-visa-detail").html(data);
                $(ref).find(".fa").addClass("fa-caret-down");
                $(ref).find(".fa").removeClass("fa-caret-up");

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
    else {
        $(ref).parent().parent().find(".client-visa-detail").html("");
        $(ref).find(".fa").removeClass("fa-caret-down");
        $(ref).find(".fa").addClass("fa-caret-up");
    }

}
function getVisaCheckListDetailNPA(id, client, name, ref) {
    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/GetClientVisasDetailP?id=' + id + '&client=' + client + '&name=' + name,
        aync: true,
        success: function (data) {
            unblockUI();
            $(ref).parent().next(".client-visa-detail").html(data);
            $(ref).find(".fa").addClass("fa-caret-down");
            $(ref).find(".fa").removeClass("fa-caret-up");
            checkListApplied();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });
}
function getVisaCheckListDetailNPR(id, client, name, ref) {
    if ($(ref).parent().parent().find(".client-visa-detail").html().trim() == "") {
        blockUI();
        $.ajax(
        {
            type: "GET",
            contentType: "html",
            url: '/CMS/GetClientVisasDetailProgram?id=' + id + '&client=' + client + '&name=' + name,
            aync: true,
            success: function (data) {
                unblockUI();
                $(ref).parent().next(".client-visa-detail").html(data);
                $(ref).find(".fa").addClass("fa-caret-down");
                $(ref).find(".fa").removeClass("fa-caret-up");

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
    else {
        $(ref).parent().parent().find(".client-visa-detail").html("");
        $(ref).find(".fa").removeClass("fa-caret-down");
        $(ref).find(".fa").addClass("fa-caret-up");
    }

}
function getVisaCheckListDetailNPRA(id, client, name, ref) {
    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/GetClientVisasDetailProgram?id=' + id + '&client=' + client + '&name=' + name,
        aync: true,
        success: function (data) {
            unblockUI();
            $(ref).parent().next(".client-visa-detail").html(data);
            $(ref).find(".fa").addClass("fa-caret-down");
            $(ref).find(".fa").removeClass("fa-caret-up");
            checkListApplied();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function getAdvanceSearch() {
    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/AdvanceSearch',
        aync: true,
        success: function (data) {
            unblockUI();
            $("#cms-main-content").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })
}
function getCMSClientView(id) {
    var clients = [];
    clients.push(id);
    blockUI();
    $.ajax(
    {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/GetClient',
        data: JSON.stringify(clients),
        aync: true,
        success: function (data) {
            unblockUI();
            $("#cms-main-content").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })
}
function getSelectedClients() {
    var clients = [];
    if ($("#search-client-table .selected-client:checked").length == 0) {
        return $().toastmessage('showToast', {
            text: 'Please select a client to proceed',
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    else {
        var list = [];
        $("#search-client-table .selected-client:checked").each(function () {
            var id = $(this).attr("id");
            clients.push(id.split("-")[1]);
        });
    }
    if ($("#chkPotential").is(":checked")) {
        blockUI();
        $.ajax(
        {
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/GetClientP',
            data: JSON.stringify(clients),
            aync: true,
            success: function (data) {
                unblockUI();
                $("#cms-main-content").html(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        })
    }
    else {
        blockUI();
        $.ajax(
        {
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/GetClient',
            data: JSON.stringify(clients),
            aync: true,
            success: function (data) {
                unblockUI();
                $("#cms-main-content").html(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        })

    }

}

function getSelectedClientsAC() {
    var clients = [];
    if ($("#search-client-table .selected-client:checked").length == 0) {
        return $().toastmessage('showToast', {
            text: 'Please select a client to proceed',
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    else {
        var list = [];
        $("#search-client-table .selected-client:checked").each(function () {
            var id = $(this).attr("id");
            clients.push(id.split("-")[1]);
        });
    }
    blockUI();
    $.ajax(
    {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/GetClient',
        data: JSON.stringify(clients),
        aync: true,
        success: function (data) {
            unblockUI();
            $("#cms-main-content").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })

}
function getSelectedClientsA() {
    var clients = [];
    if ($("#search-client-table .selected-client:checked").length == 0) {
        return $().toastmessage('showToast', {
            text: 'Please select a client to proceed',
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    else {
        var list = [];
        $("#search-client-table .selected-client:checked").each(function () {
            var id = $(this).attr("id");
            clients.push(id.split("-")[1]);
        });
    }
    blockUI();
    $.ajax(
    {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/GetClient',
        data: JSON.stringify(clients),
        aync: true,
        success: function (data) {
            unblockUI();
            $("#cms-main-content").html(data);
            $(".client-lbl").removeClass(".active-lbl");
            $(".client-lbl").addClass(".agent-lbl");
            $(".client-lbl").html("agent client");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })

}
function getSelectedClientsP() {
    var clients = [];
    if ($("#search-client-table .selected-client:checked").length == 0) {
        return $().toastmessage('showToast', {
            text: 'Please select a client to proceed',
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    else {
        var list = [];
        $("#search-client-table .selected-client:checked").each(function () {
            var id = $(this).attr("id");
            clients.push(id.split("-")[1]);
        });
    }

    blockUI();
    $.ajax(
    {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/GetClientP',
        data: JSON.stringify(clients),
        aync: true,
        success: function (data) {
            unblockUI();
            $("#cms-main-content").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })
}
function showHideTasks(ref)
{
    if ($(ref).parent().next(".check-task-details").is(":visible")) {
        $(ref).parent().next(".check-task-details").hide();
        $(ref).removeClass("fa-caret-down");
        $(ref).addClass("fa-caret-up");
    }
    else {
        $(ref).parent().next(".check-task-details").show();
        $(ref).addClass("fa-caret-down");
        $(ref).removeClass("fa-caret-up");
        

    }
}
function hideCheckList(ref)
{
    if ($(ref).parent().next(".chklist-box").is(":visible")) {
        $(ref).parent().next(".chklist-box").hide();
        $(ref).removeClass("fa-caret-down");
        $(ref).addClass("fa-caret-up");
    }
    else
    {
        $(ref).parent().next(".chklist-box").show();
        $(ref).addClass("fa-caret-down");
        $(ref).removeClass("fa-caret-up");
    }
   
}
function removeChecklistFromClient(ref,id,type,visa)
{
    if (confirm("Are you sure you want to remove this checklist, all associated task will also be deleted ?")) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/DeleteChecklistFromClient',
            data: JSON.stringify({ id: id,type:type,visa:visa }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data) {
                    
                    $(ref).parent().parent().parent().parent().parent().find(".progress-bar-visa").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                    $(ref).parent().parent().parent().parent().parent().find(".progress-bar-visa").html(data.VisaPercent.toFixed(2) + " %");
                    $(ref).parent().parent().parent().parent().parent().find(".checklist-main-bar").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                    $(ref).parent().parent().parent().parent().parent().find(".checklist-main-bar").html(data.VisaPercent.toFixed(2) + " %");
                    $("#container-" + id).remove();
                    $(ref).parent().remove();
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
function applyCheckListP(ref) {
    $(".input_error_msg_v").css('visibility', 'hidden');
    var status = $(ref).parent().find(".apply-visa-status-id").val();
    var checklist = $(ref).parent().find(".apply-cehcklist-id").val();
    if (status == "" || status == null) {
        $(ref).parent().find(".apply-visa-status-id").next(".input_error_msg_v").css('visibility', 'visible');
        return false;
    }
    if (checklist == "" || checklist == null) {
        $(ref).parent().find(".apply-cehcklist-id").next(".input_error_msg_v").css('visibility', 'visible');
        return false;
    }
    var visa = $(ref).parent().find(".apply-visa-id").val();
    var client = $(ref).parent().find(".apply-client-id").val();


    var obj = new Object();
    obj.FKClientID = client;
    obj.FKVisaID = visa;
    obj.FKCheckListID = checklist;
    obj.VisaStatusName = status;

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/ApplyCheckListP',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data == false) {
                showErrorToast("Something went wrong please try again !");
            }
            else {
                $(ref).parents(".client-visa-list-item").find(".visa-detail-click").click();
                $(ref).parents(".client-visa-list-item").find(".progress-bar-visa").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                $(ref).parents(".client-visa-list-item").find(".progress-bar-visa").html(data.VisaPercent.toFixed(2) + " %");
                showSuccessToast("Checklist applied !");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function applyCheckList(ref) {
    $(".input_error_msg_v").css('visibility', 'hidden');
    var status = $(ref).parent().find(".apply-visa-status-id").val();
    var checklist = $(ref).parent().find(".apply-cehcklist-id").val();
    if (status == "" || status == null) {
        $(ref).parent().find(".apply-visa-status-id").next(".input_error_msg_v").css('visibility', 'visible');
        return false;
    }
    if (checklist == "" || checklist == null) {
        $(ref).parent().find(".apply-cehcklist-id").next(".input_error_msg_v").css('visibility', 'visible');
        return false;
    }
    var visa = $(ref).parent().find(".apply-visa-id").val();
    var client = $(ref).parent().find(".apply-client-id").val();

    var obj = new Object();
    obj.FKClientID = client;
    obj.FKVisaID = visa;
    obj.FKCheckListID = checklist;
    obj.VisaStatusName = status;

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/ApplyCheckList',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data == false) {
                showErrorToast("Something went wrong please try again !");
            }
            else {
                $(ref).parents(".client-visa-list-item").find(".visa-detail-click").click();
                $(ref).parents(".client-visa-list-item").find(".progress-bar-visa").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                $(ref).parents(".client-visa-list-item").find(".progress-bar-visa").html(data.VisaPercent.toFixed(2) + " %");
                showSuccessToast("Checklist applied !");
            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function applyCheckListProgram(ref) {
    $(".input_error_msg_v").css('visibility', 'hidden');
    var status = $(ref).parent().find(".apply-visa-status-id").val();
    var checklist = $(ref).parent().find(".apply-cehcklist-id").val();
    if (status == "" || status == null) {
        $(ref).parent().find(".apply-visa-status-id").next(".input_error_msg_v").css('visibility', 'visible');
        return false;
    }
    if (checklist == "" || checklist == null) {
        $(ref).parent().find(".apply-cehcklist-id").next(".input_error_msg_v").css('visibility', 'visible');
        return false;
    }
    var visa = $(ref).parent().find(".apply-visa-id").val();
    var client = $(ref).parent().find(".apply-client-id").val();


    var obj = new Object();
    obj.FKClientID = client;
    obj.FKVisaID = visa;
    obj.FKCheckListID = checklist;
    obj.VisaStatusName = status;

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/ApplyCheckListProgram',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data == false) {
                showErrorToast("Something went wrong please try again !");
            }
            else {
                $(ref).parents(".client-visa-list-item").find(".visa-detail-click").click();
                $(ref).parents(".client-visa-list-item").find(".progress-bar-visa").css('width', data.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.VisaPercent.toFixed(2));
                $(ref).parents(".client-visa-list-item").find(".progress-bar-visa").html(data.VisaPercent.toFixed(2) + " %");
                showSuccessToast("Checklist applied !");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function changeVisaStatusP(ref) {

    var obj = new Object();
    obj.visa = $(ref).parent().parent().find(".visa-id").val();
    obj.status = $.trim($(ref).find(".status-name").html());
    obj.client = $(ref).parent().parent().find(".client-p-id").val();
    if (obj.status == "Won") {
        if (confirm("Changing the status to 'Won' wil move this potential client to actual client. Do you want to proceed ?")) {
            blockUI();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/CMS/UpdateVisaP',
                async: false,
                data: JSON.stringify(obj),
                success: function (data) {
                    unblockUI();
                    getCMSClientView(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    unblockUI();
                    handleErrors(textStatus);
                }
            });
        }

    }
    else {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/UpdateVisaP',
            async: false,
            data: JSON.stringify(obj),
            success: function (data) {
                unblockUI();
                $(ref).parent().parent().find(".selected-visa-status").html(obj.status);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });

    }

}

function changeVisaStatus(ref) {
    var obj = new Object();
    obj.visa = $(ref).parent().parent().find(".visa-id").val();
    obj.status = $.trim($(ref).find(".status-name").html());
    obj.email = false;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/UpdateVisa',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $(ref).parent().parent().find(".selected-visa-status").html(obj.status);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function changeProgramStatus(ref) {
    var name = $.trim($(ref).find(".status-name").html());
    var obj = new Object();
    obj.ID = $(ref).parent().parent().find(".visa-id").val();
    obj.FKProgramStatus = $(ref).find(".hdn-prg-status").val();
    obj.Email = false;

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Addmission/UpdateProgramStatus',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $(ref).parent().parent().find(".selected-visa-status").html(name);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });



}


function changeStatusDropDownCMS(ref) {
    $("#modal-star-visa-update").modal('show');
    var visa = $(ref).parent().parent().find(".visa-id").val();
    var status = $.trim($(ref).find(".status-name").html());
    var client = $(ref).parent().parent().find(".client-id").val();
    var type = $(ref).parent().parent().find(".visa-type").val();
    $("#selected-client-id").val(client);
    $("#current-visa-id").val(visa);
    $("#selected-client-status").val(status);
    $("#selected-client-type").val(type);
    $(".app-date-row").hide();

    if (status == "Approved") {
        $("#date").show();
        $("#date-approve").show();
    }
    else if (status == "Lodged") {
        $("#date-app").show();
    }
    else if (status == "Immigration Matters") {
        $("#desc-mat").show();
    }
    else if (status == "Selected") {
        $("#eoi-selected").show();
    }

    else if (status == "Declined") {
        $("#declined").show();

    }

    else if (status == "Refused") {
        $("#refused").show();

    }
    else if (status == "Approve in principal") {
        $("#aip").show();
    }
    else {
        $("#date").hide();
        $("#generic").show();
    }
    $(".expiry-date").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-100:+10",
        dateFormat: 'dd/mm/yy'
    });
    $('.datepick').attr('readonly', true);
    $(".datepick").datepicker({
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

function updateVisaStatusCMSNew() {

    var obj = new Object();
    obj.client = $("#selected-client-id").val();
    obj.visa = $("#current-visa-id").val();
    obj.status = $("#selected-client-status").val();
    obj.expiry = $("#expiry-date").val();
    obj.approve = $("#approve-date").val();
    obj.name = $("#selected-client-type").val();
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
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/UpdateVisa',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $("#modal-star-visa-update input").val("");
            $("#modal-star-visa-update").modal('hide');
            $('body').removeClass('modal-open');

            $("#client-visa-list-" + obj.visa + " .selected-visa-status").html(obj.status);
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

function getInactiveAdmission(id) {
    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/GetAppliedProgramsH?id=' + id,
        aync: true,
        success: function (data) {
            unblockUI();
            $("#modal-inactive-prog .modal-body").html(data);
            $("#modal-inactive-prog").modal("show");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })
}
function getInactiveApplication(id) {
    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/GetClientVisasH?id=' + id,
        aync: true,
        success: function (data) {
            unblockUI();
            $("#modal-inactive-client .modal-body").html(data);
            $("#modal-inactive-client").modal("show");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })
}
function getInactiveApplicationP(id) {
    blockUI();
    $.ajax(
    {
        type: "GET",
        contentType: "html",
        url: '/CMS/GetClientVisasPH?id=' + id,
        aync: true,
        success: function (data) {
            unblockUI();
            $("#modal-inactive-client-p .modal-body").html(data);
            $("#modal-inactive-client-p").modal("show");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    })
}
function activeClientApplication() {
    var clients = [];
    if ($(".client-visa-check:checked").length == 0) {
        return $().toastmessage('showToast', {
            text: 'Please select an application to activate',
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    else {

        $(".client-visa-check:checked").each(function () {
            clients.push($(this).val());
        });
    }
    if (clients.length > 0) {

        blockUI();
        $.ajax(
        {
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/ActivateVisaClient',
            data: JSON.stringify(clients),
            aync: true,
            success: function (data) {
                unblockUI();
                $("#modal-inactive-client").modal("hide");

                $('body').removeClass('modal-open');
                return $().toastmessage('showToast', {
                    text: 'Please refresh the screen to see your changes',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'warning'

                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        })

    }
}
function activeClientApplicationP() {
    var clients = [];
    if ($(".client-visa-check-p:checked").length == 0) {
        return $().toastmessage('showToast', {
            text: 'Please select an application to activate',
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    else {

        $(".client-visa-check-p:checked").each(function () {
            clients.push($(this).val());
        });
    }
    if (clients.length > 0) {
        blockUI();
        $.ajax(
        {
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/ActivateVisaClientP',
            data: JSON.stringify(clients),
            aync: true,
            success: function (data) {
                unblockUI();
                $("#modal-inactive-client-p").modal("hide");
                $('body').removeClass('modal-open');
                return $().toastmessage('showToast', {
                    text: 'Please refresh the screen to see your changes',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'warning'

                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        })
    }
}
function activeClientPrograms() {
    var clients = [];
    if ($(".program-check:checked").length == 0) {
        return $().toastmessage('showToast', {
            text: 'Please select an application to activate',
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    else {

        $(".program-check:checked").each(function () {
            clients.push($(this).val());
        });
    }
    if (clients.length > 0) {
        blockUI();
        $.ajax(
        {
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/ActivateProgramClient',
            data: JSON.stringify(clients),
            aync: true,
            success: function (data) {
                unblockUI();
                $("#modal-inactive-prog").modal("hide");
                $('body').removeClass('modal-open');
                return $().toastmessage('showToast', {
                    text: 'Please refresh the screen to see your changes',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'warning'

                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        })
    }
}


function getAllConcernPersonDD(id, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/GetClientProcesingPersonJson',
        data: JSON.stringify({ id: id }),
        async: true,
        success: function (res) {

            unblockUI();
            var data = res.Persons;
            var htmlButton = "";
            var userID = 0;
            for (var i = 0; i < data.length; i++) {

                if (data[i].FKUserID != userID) {
                    var image = "";
                    if (data[i].Image != null) {
                        image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35'  src='data:image/png;base64," + data[i].ImageString + "' alt='User' /></div><p class='person-name'>" + data[i].UserName + " </p>";
                    }
                    else {
                        image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35'  src='/Content/Images/person.png' alt='User' /></div><p class='person-name'>" + data[i].UserName + " </p>";

                    }
                    //if (t.Count > 0)
                    //{
                    //    image += "<img src='/Content/CMS/images/right-tick.png' class='green-tick' alt='Arrow' />";
                    //}
                    htmlButton += "<li onclick='assignUserTaskCMSAll(" + data[i].FKUserID + ",this)'>" + image + "</li>";
                    userID = data[i].FKUserID;
                }
            }
            $(ref).next(".dropdown-menu").html(htmlButton);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getAllConcernPersonDDP(id, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/GetClientProcesingPersonPJson',
        data: JSON.stringify({ id: id }),
        async: true,
        success: function (res) {

            unblockUI();
            var data = res.Persons;
            var htmlButton = "";
            var userID = 0;
            for (var i = 0; i < data.length; i++) {

                if (data[i].FKUserID != userID) {
                    var image = "";
                    if (data[i].Image != null) {
                        image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35'  src='data:image/png;base64," + data[i].ImageString + "' alt='User' /></div><p class='person-name'>" + data[i].UserName + " </p>";
                    }
                    else {
                        image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35'  src='/Content/Images/person.png' alt='User' /></div><p class='person-name'>" + data[i].UserName + " </p>";

                    }
                    //if (t.Count > 0)
                    //{
                    //    image += "<img src='/Content/CMS/images/right-tick.png' class='green-tick' alt='Arrow' />";
                    //}
                    htmlButton += "<li onclick='assignUserTaskCMSAll(" + data[i].FKUserID + ",this)'>" + image + "</li>";
                    userID = data[i].FKUserID;
                }
            }
            $(ref).next(".dropdown-menu").html(htmlButton);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function getAllConcernPersonTaskDD(id, client, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/GetTaskProcesingPersonJson',
        data: JSON.stringify({ id: id, client: client }),
        async: true,
        success: function (res) {

            unblockUI();
            var data = res.Persons;
            var htmlButton = "";
            var userID = 0;
            for (var i = 0; i < data.length; i++) {

                if (data[i].FKUserID != userID) {
                    var image = "";
                    if (data[i].Image != null) {
                        image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35'  src='data:image/png;base64," + data[i].ImageString + "' alt='User' /></div><p class='person-name'>" + data[i].UserName + " </p>";
                    }
                    else {
                        image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35'  src='/Content/Images/person.png' alt='User' /></div><p class='person-name'>" + data[i].UserName + " </p>";

                    }
                    if (data[i].Count > 0) {
                        image += "<img src='/Content/CMS/images/right-tick.png' class='green-tick' alt='Arrow' />";
                    }
                    htmlButton += "<li onclick='assignUserTaskCMS(" + data[i].FKUserID + ",this)'>" + image + "</li>";
                    userID = data[i].FKUserID;
                }
            }
            $(ref).next(".dropdown-menu").html(htmlButton);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getAllConcernPersonTaskDDP(id, client, ref) {

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/GetTaskProcesingPersonJsonP',
        data: JSON.stringify({ id: id, client: client }),
        async: true,
        success: function (res) {

            unblockUI();
            var data = res.Persons;
            var htmlButton = "";
            var userID = 0;

            for (var i = 0; i < data.length; i++) {

                if (data[i].FKUserID != userID) {
                    var image = "";
                    if (data[i].Image != null) {
                        image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35'  src='data:image/png;base64," + data[i].ImageString + "' alt='User' /></div><p class='person-name'>" + data[i].UserName + " </p>";
                    }
                    else {
                        image = "<div class='user-pic-box'><img class='thumbnail-img'  width='35' height='35'  src='/Content/Images/person.png' alt='User' /></div><p class='person-name'>" + data[i].UserName + " </p>";

                    }
                    if (data[i].Count > 0) {
                        image += "<img src='/Content/CMS/images/right-tick.png' class='green-tick' alt='Arrow' />";
                    }
                    htmlButton += "<li onclick='assignUserTaskCMS(" + data[i].FKUserID + ",this)'>" + image + "</li>";
                    userID = data[i].FKUserID;
                }
            }

            $(ref).next(".dropdown-menu").html(htmlButton);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}

function showTaskDetailsCMS(ref, id) {
    if (toggle) {
        $(".chkbx-text").removeClass("bld-txt");
        $(ref).addClass("bld-txt");
        blockUI();
        $.ajax({
            type: "GET",
            contentType: "html",
            url: '/CMS/TasksViewDetails?id=' + id,
            async: true,
            success: function (data) {

                unblockUI();
                $(ref).parent().find(".todos_detail").html(data);
                $(ref).parent().find(".todos_detail").show();
                toggle = false;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
            }
        });

    }
    else {

        $(ref).parent().find(".todos_detail").hide();
        $(ref).removeClass("bld-txt");
        toggle = true;
    }

}

function unassignTaskCMS(id, task, ref) {

    if (confirm("Are you sure you want to remove this user from task ?")) {


        var obj = new Object();
        obj.TaskID = task;
        obj.UserID = id;
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Dashboard/RemoveTask',
            async: false,
            data: JSON.stringify(obj),
            success: function (data) {
                $(ref).parent().remove();
                unblockUI();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }
}


function updateDescriptionCMS(ref, task) {


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

function showTaskDetailsHideCMS(ref) {

    $(ref).parent().parent().parent().find(".todos_detail").hide();
    $(ref).parent().parent().parent().find(".new-messages").remove();
    toggle = true;
}
function updateCheckListClose() {
    $(".input_error_msg").hide();
    $("#list-edit-modal input").val('');
    $("#list-edit-modal").modal("hide");
    $('body').removeClass('modal-open');
}
function updateCheckListShow(id, ref) {
    $("#list-id").val(id);
    $("#check-list-name").val($.trim($(ref).parent().find(".checklist-name-h").html()));
    $("#list-edit-modal").modal("show");
}
function updateCheckList() {
    $(".input_error_msg").hide();
    if ($("#check-list-name").val() == "") {
        $("#check-list-name").next(".input_error_msg").html("Please enter a name !");
        $("#check-list-name").next(".input_error_msg").show();
        return false;
    }
    if ($("#check-list-name").length > 400) {
        $("#check-list-name").next(".input_error_msg").html("Name characters limit is 400 !");
        $("#check-list-name").next(".input_error_msg").show();
        return false;
    }



    var cat = new Object();
    cat.ID = $("#list-id").val();
    cat.Name = $("#check-list-name").val();

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/UpdateCheckList',
        async: false,
        data: JSON.stringify(cat),
        success: function (data) {
            unblockUI();
            if (data) {
                $("#check-" + cat.ID).find(".checklist-name-h").html(cat.Name);
                showSuccessToast("Name Updated !");
                $("#list-edit-modal").modal("hide");
                $('body').removeClass('modal-open');
            }
            else {
                return showErrorToast("Something went wrong please try again !");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}

function updateCategoryClose() {
    $(".input_error_msg").hide();
    $("#cat-edit-modal input").val('');
    $("#cat-edit-modal").modal("hide");
    $('body').removeClass('modal-open');
}
function updateCategoryShow(id, ref) {
    $("#category-id").val(id);
    $("#category-name").val($.trim($(ref).parent().find(".cat-name").html()));
    $("#cat-edit-modal").modal("show");
}
function updateCategory() {
    $(".input_error_msg").hide();
    if ($("#category-name").val() == "") {
        $("#category-name").next(".input_error_msg").html("Please enter a name !");
        $("#category-name").next(".input_error_msg").show();
        return false;
    }
    if ($("#category-name").length > 400) {
        $("#category-name").next(".input_error_msg").html("Name characters limit is 400 !");
        $("#category-name").next(".input_error_msg").show();
        return false;
    }



    var cat = new Object();
    cat.ID = $("#category-id").val();
    cat.Name = $("#category-name").val();

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/UpdateCategory',
        async: false,
        data: JSON.stringify(cat),
        success: function (data) {
            unblockUI();
            if (data) {
                $("#cat-" + cat.ID).find(".cat-name").html(cat.Name);
                showSuccessToast("Name Updated !");
                $("#cat-edit-modal").modal("hide");
                $('body').removeClass('modal-open');
            }
            else {
                return showErrorToast("Something went wrong please try again !");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}


function deleteChecklist(id, ref) {
    if (confirm("Are you sure you want to delete this ?")) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/DeleteCheckList',
            data: JSON.stringify({ id: id }),
            async: true,
            success: function (data) {
                unblockUI();
                if (data == false)
                {
                    return showErrorToast("Delete failed, make sure the checklist is not applied to any client !");
                }
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

function deleteChecklistCategory(id, ref) {
    if (confirm("Are you sure you want to delete this ?")) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/CMS/CheckListCount',
            data: JSON.stringify({ id: id }),
            async: false,
            success: function (data) {
                unblockUI();
                if (parseInt(data) > 0) {
                    showWarningToast("Please delete all checklists within this category to remove this.");
                }
                else {
                    $.ajax({
                        type: "POST",
                        contentType: "application/json; charset=utf-8",
                        url: '/CMS/DeleteCategory',
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

            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);

            }
        });


    }

}

function completeCMSStatus(ref, t) {

    if (t) {
        $(ref).parent().parent().find(".selected-visa-status").html("Completed");
        //$(ref).parent().parent().find(".selected-visa-status").parent().removeClass("active");
        //$(ref).parent().parent().find(".selected-visa-status").parent().addClass("inactive");
    }
    else {
        $(ref).parent().parent().find(".selected-visa-status").html("Active");
        //$(ref).parent().parent().find(".selected-visa-status").parent().removeClass("inactive");
        //$(ref).parent().parent().find(".selected-visa-status").parent().addClass("active");
    }

}
function addNewTaskForAppliedGet(id,client,type)
{
    $("#hdn-visa-check-id").val(id);
    $("#hdn-visa-client-id").val(client);
    $("#hdn-check-type").val(type);
    $("#add-cms-dialog-all").modal("show");
    $("#ap-date").datepicker({
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
function addNewTaskForApplied()
{
    $(".input_error_msg").hide();
    if ($("#ap-date").val() == "") {
        $("#ap-date").next(".input_error_msg").show();
        return false;
    }
    if ($("#ap-title").val() == "") {
        $("#ap-title").next(".input_error_msg").show();
        return false;
    }
    if ($("#ap-title").length > 400) {
        $("#ap-title").next(".input_error_msg").html("Title characters limit is 400 !");
        $("#ap-title").next(".input_error_msg").show();
        return false;
    }
    if ($("#ap-desc").length > 1000) {
        $("#ap-desc").next(".input_error_msg").html("Desc characters limit is 1000 !");
        $("#ap-desc").next(".input_error_msg").show();
        return false;
    }
    var type = $("#hdn-check-type").val();
    var client = $("#hdn-visa-client-id").val();
    var obj = new Object();
    obj.DueBy = $("#ap-date").val();
    obj.TaskShortDesc = $("#ap-title").val();
    obj.TaskDetails = $("#ap-desc").val();
    obj.FKCheckListVisaID = $("#hdn-visa-check-id").val();
    if (type == 'C' || type == 'R')
    {
        obj.FKClientID = client;
    }
    if (type == 'P')
    {
        
        obj.FKpClientID = client;
    }
    obj.Type = type;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/AddNewTaskForApplied',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data) {
                $("#add-cms-dialog-all").modal("hide");
                $('body').removeClass('modal-open');
                var html = "";
                html += '<div class="sd-datarow">';

                html += '<p class="sd-ckhbx">';
                html += '<input type="checkbox" id="chk-' + data.Task + '" onchange="completeTaskCMS(this,' + data.Task + ',\'' + $("#hdn-check-type").val() + '\')" />';
                html += '<label for="chk-' + data.Task + '" class="chkbx_label">&nbsp;</label>';
                html += '</p>';

                html += '<input type="hidden" class="task-id-cms" value="' + data.Task + '" />';
                html += '<h6 style="width:73%;" class="chkbx-txt" onclick="showTaskDetailsCMS(this,' + data.Task + ')">' + obj.TaskShortDesc + '</h6>';
                html += '<div class="flt-icons">';
                html += '<div class="dropdown icon-drpdwn html-button">';
                html += $("#userDropDown").val();
                html += '</div>';
                html += '<i class="flaticon-business" onclick="openResPopCMS(' + data.Task + ')"></i>';
                html += '<i class="flaticon-multiply" onclick="deleteTaskCMS(this,' + data.Task + ',\'' + $("#hdn-check-type").val() + '\')"></i>';
                html += '</div>';
                html += '<div class="main-tasks-details todos_detail">';

                html += '</div>';
                html += '</div>';
                $("#container-" + obj.FKCheckListVisaID + " .check-task-details").prepend(html);
                $("#add-cms-dialog-all").modal("hide");
                $('body').removeClass('modal-open');
                $('#progress-' + data.Stats.CheckListID + '').css('width', data.Stats.CheckListPercent.toFixed(2) + '%').attr('aria-valuenow', data.Stats.CheckListPercent.toFixed(2));
                $('#progress-' + data.Stats.CheckListID + '').html(data.Stats.CheckListPercent.toFixed(2) + " %");
                $('#chk-' + data.Task).parents(".client-visa-list-item").find(".progress-bar-visa").css('width', data.Stats.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.Stats.VisaPercent.toFixed(2));
                $('#chk-' + data.Task).parents(".client-visa-list-item").find(".progress-bar-visa").html(data.Stats.VisaPercent.toFixed(2) + " %");
                $('#chk-' + data.Task).parents(".client-visa-detail").find(".checklist-main-bar").css('width', data.Stats.VisaPercent.toFixed(2) + '%').attr('aria-valuenow', data.Stats.VisaPercent.toFixed(2));
                $('#chk-' + data.Task).parents(".client-visa-detail").find(".checklist-main-bar").html(data.Stats.VisaPercent.toFixed(2) + " %");
                return $().toastmessage('showToast', {
                    text: 'Task Added !',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
            }
            else
            {
                return $().toastmessage('showToast', {
                    text: 'Failed !',
                    sticky: false,
                    position: 'bottom-right',
                    type: 'error'

                });
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function openPopupMoveCategory(id,cat) {
    $("#hdn-list-id").val(id);
    $("#hdn-cat-id").val(id);
    $('#cat-move-modal').modal('show');
}
function moveCategory() {
    if ($("#select-category-move").val() == "") {
        return $().toastmessage('showToast', {
            text: 'Please select a category !',
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    if ($("#select-category-move").val() == $("#hdn-cat-id").val()) {
        return $().toastmessage('showToast', {
            text: 'List already in this category !',
            sticky: false,
            position: 'bottom-right',
            type: 'warning'

        });
    }
    var data = { category: $("#select-category-move").val(), list: $("#hdn-list-id").val() };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/CMS/MoveListToCategory',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            $("#select-category-move").val(""); 
            $('#cat-move-modal').modal("hide");
            $('body').removeClass('modal-open');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}