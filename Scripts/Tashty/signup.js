var countDiv = 3;
var right = false;
//$(document).ready(function () {
//    $('.email').on('focusout', function () {

//        var email = $(this).val();
//        if (email != "") {
//            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//            if (!re.test(email)) {
//                $(this).next(".errorSpan").show();
//                $(this).addClass("invalid");
//                $(this).next(".errorSpan").html("");
//                $(this).next(".errorSpan").html("Please enter a valid email address");
//                $(this).focus();
//                $(".btn").attr("disabled", "disabled");
//            }
//            else {
//                $(this).next(".errorSpan").hide();
//                $(this).removeClass("invalid");
//                $(".btn").attr("disabled", false);
//            }
//        }
//    });
//});

function displayPicName() {

    if ($("#fileInput").val() != "") {
        $("#file-name").html("");
        $("#file-name").html($("#fileInput").val());
        $("#file-container").show();

    }
    else {

        $("#file-container").hide();
    }

}
$(".pone-inputs").keyup(function () {
    $("#page1Error").hide();
});

function saveUser() {
    $("#page1Error").hide();
    var name = $("#fullName").val();
    var password = $("#password").val();
    var email = $("#email").val();
    var image = $("input[id='fileInput']").val();
    if (image == "") {

    }
    var pStrn = 0;

    pStrn += /[a-z]/.test(password) ? 1 : 0;
    pStrn += /[A-Z]/.test(password) ? 1 : 0;
    pStrn += /\d/.test(password) ? 1 : 0;
    pStrn += /[@]/.test(password) ? 1 : 0;


    if (name == "") {
        $("#page1Error").html("Please enter name");
        $("#page1Error").show();
        return false;
    }
    else if (password == "") {
        $("#page1Error").html("Please enter password");
        $("#page1Error").show();
        return false;
    }
    else if (password.length < 8) {
        $("#page1Error").html("Password must be atleast 8 characters long");
        $("#page1Error").show();
        return false;
    }
    else if (pStrn <= 2) {
        $("#page1Error").html("Password Must Have- at least 1 upper case alpha character - at least 1 lower case alpha character - at least 1 numeric character - at least 1 special character");
        $("#page1Error").show();
        return false;
    }
    else if (email == "") {
        $("#page1Error").html("Please enter email");
        $("#page1Error").show();
        return false;
    }

    $("#page3Error").hide();
    var telephoneNumber = $("input[id='telephoneNumber']").val();
    var companyName = $("input[id='companyName']").val();
    var gender = $("input[id='gender']").val();
    var mobileNumber = $("input[id='mobileNumber']").val();
    var companyDesignation = $("input[id='companyDesignation']").val();
    var city = $("input[id='city']").val();
    var country = $("input[id='country']").val();
    var businessGst = $("input[id='businessGst']").val();
    var bankAccount = $("input[id='bankAccount']").val();
    if (telephoneNumber == "") {

        $("#page3Error").html("");
        $("#page3Error").html("Please Enter Telephone Number");
        $("#page3Error").show();
        return false;
    }

    else if (companyName == "") {
        $("#page3Error").html("");
        $("#page3Error").html("Please Enter Company Name");
        $("#page3Error").show();
        return false;
    }
    else if (gender == "") {
        $("#page3Error").html("");
        $("#page3Error").html("Please Enter Gender");
        $("#page3Error").show();
        return false;
    }
    else if (mobileNumber == "") {
        $("#page3Error").html("");
        $("#page3Error").html("Please Enter Mobile Number");
        $("#page3Error").show();
        return false;
    }
    else if (companyDesignation == "") {
        $("#page3Error").html("");
        $("#page3Error").html("Please Enter Your Designation");
        $("#page3Error").show();
        return false;
    }
    else if (city == "") {
        $("#page3Error").html("");
        $("#page3Error").html("Please Enter City");
        $("#page3Error").show();
        return false;
    }
    else if (country == "") {
        $("#page3Error").html("");
        $("#page3Error").html("Please Enter Country");
        $("#page3Error").show();
        return false;
    }
    else if (businessGst == "") {
        $("#page3Error").html("");
        $("#page3Error").html("Please Enter Your GST");
        $("#page3Error").show();
        return false;
    }
    else if (bankAccount == "") {
        $("#page3Error").html("");
        $("#page3Error").html("Please Enter Your Bank Account");
        $("#page3Error").show();
        return false;
    }
    else {
        $("#SaveUser").hide();
        $("#SaveUser1").show();
        return true;
    }

}
function addMoreUser() {
    countDiv = parseInt(countDiv) + 1;

    var name = "Users[" + countDiv + "].Name";
    var email = "Users[" + countDiv + "].Email";
    var image = "Users[" + countDiv + "].Image";
    var div = '<div class="user">';
    div += '<div class="inner-col-left">';
    div += '<label for="fileInput' + (countDiv + 1) + '">';
    div += '<img src="/Content/Images/user_photo_button.png" />';
    div += '</label>';
    div += '<div class="file-container" style="display:none;"><span aria-hidden="true" class="glyphicon glyphicon-upload"></span><span class="file-name"></span></div>';
    div += '<input style="display:none" type="file" name="' + image + '" id="fileInput' + (countDiv + 1) + '" onchange="displayPicNameUser(this)" />';
    div += '</div>';
    div += '<div class="inner-col-right">';
    div += '<input name="' + name + '" type="text" class="form-control users-input name" placeholder="Full Name" />';
    div += '<input name="' + email + '" onblur="onEmailChange(this)" type="text" class="form-control users-input email" placeholder="Email Address" />';
    div += '<span class="errorSpan">?</span>';
    div += '</div>';
    div += '<div style="clear:both">';
    div += '</div>';
    div += '</div>';
    if (!right) {
        $("#main-users .col-left").append(div);
        right = true;
    }
    else {
        $("#main-users .col-right").append(div);
        right = false;
    }



    //var div = '<div class="user">';
    //div += '<div style="background-color: lightgray;float: left;height: 80px;margin-top: 5px;width: 150px;">';
    //div += '<label for="fileInput' + (countDiv + 1) + '">';
    //div += '<img src="/Content/Images/default-placeholder.png" />';
    //div += '</label>';
    //div += '<div class="file-container" style="display:none;"><span aria-hidden="true" class="glyphicon glyphicon-upload"></span><span class="file-name"></span></div>';
    //div += '<input style="display:none" type="file" name="' + image + '" id="fileInput' + (countDiv + 1) + '" onchange="displayPicNameUser(this)" />';
    //div += '</div>';
    //div += '<input type="text" name='+name+' class="form-control users-input name" placeholder="Full Name"/>';
    //div += '<input type="text" name=' + email + ' class="form-control users-input email" onblur="onEmailChange(this)" placeholder="Email Address"/><span class="errorSpan">?</span>';
    //div += '</div>';
    //$("#main-users").append(div);

}

function onEmailChange(ref) {

    var email = $(ref).val();
    if (email == "") {
        $(ref).next(".errorSpan").css("display", "none");
        $(ref).removeClass("invalid");
        $(".btn-primary").attr("disabled", false);
        return false;
    }
    if (email != "") {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            $(ref).next(".errorSpan").css("display", "block");
            $(ref).addClass("invalid");
            $(ref).next(".errorSpan").html("");
            $(ref).next(".errorSpan").html("Please enter a valid email address.");

            $(".btn-primary").attr("disabled", "disabled");
            return false;
        }
        if (email.trim() == $("#Email").val()) {
            $(ref).next(".errorSpan").css("display", "block");
            $(ref).addClass("invalid");
            $(ref).next(".errorSpan").html("");
            $(ref).next(".errorSpan").html("This email you entered is your deafult admin email. In this screen please enter users other than admin");

            $(".btn-primary").attr("disabled", "disabled");
            return false;
        }
        var data = { Email: email };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Home/CheckEmailExsist',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).next(".errorSpan").css("display", "block");
                    $(ref).addClass("invalid");
                    $(ref).next(".errorSpan").html("");
                    $(ref).next(".errorSpan").html("This email already exists.");
                    //$(ref).focus();
                    $(".btn-primary").attr("disabled", "disabled");
                    return false;

                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                // handleErrors(textStatus);
            }
        });

        var $current = $(ref);
        var not = true;
        $('.email').each(function () {
            if ($(this).val() == $current.val() && $(this).attr('name') != $current.attr('name')) {
                $(ref).next(".errorSpan").css("display", "block");
                $(ref).addClass("invalid");
                $(ref).next(".errorSpan").html("");
                $(ref).next(".errorSpan").html("You have already entered this email.");

                $(".btn-primary").attr("disabled", "disabled");
                not = false;
                return false;
            }

        });
        if (not) {
            $(ref).next(".errorSpan").css("display", "none");
            $(ref).removeClass("invalid");
            $(".btn-primary").attr("disabled", false);
        }


    }
}

