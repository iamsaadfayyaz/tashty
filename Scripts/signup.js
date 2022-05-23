
$(document).ready(function () {
    $('.email').on('focusout', function () {

        var email = $(this).val();
        if (email != "") {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(email)) {
                $(this).next(".errorSpan").show();
                $(this).addClass("invalid");
                $(this).next(".errorSpan").html("");
                $(this).next(".errorSpan").html("Please enter a valid email address");
                $(this).focus();
                $(".btn").attr("disabled", "disabled");
            }
            else {
                $(this).next(".errorSpan").hide();
                $(this).removeClass("invalid");
                $(".btn").attr("disabled", false);
            }
        }
    });
});

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
function page1Click() {
    $("#page1Error").hide();
    var name = $("#fullName").val();
    var password = $("#password").val();
    var email = $("#email").val();
    var image = $("input[id='fileInput']").val();
    if (image == "") {

    }
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
    else if (email == "") {
        $("#page1Error").html("Please enter email");
        $("#page1Error").show();
        return false;
    }

    $("#page2").show();
    $("#page1").hide();
    $("#page3").hide();
}
function page2Click() {
    $("#page2Error").hide();
    var result = true;
    var array = [];
    $(".user").each(function () {
        var name = $(this).find(".name").val();
        var email = $(this).find(".email").val();
        if (name != "" && email == "") {
            $("#page2Error").html("");
            $("#page2Error").html("Please enter email address of user " + name);
            $("#page2Error").show();
            $(this).find(".email").focus();
            result = false;
            return false;
        }
        else if (email != "" && name == "") {
            $("#page2Error").html("");
            $("#page2Error").html("Please enter name of user whose email is " + email);
            $("#page2Error").show();
            $(this).find(".name").focus();
            result = false;
            return false;
        }
        else if (email != "" && name != "") {
            var obj = new Object();
            obj.Name = name;
            obj.Email = email;
            array.push(obj);
            result = true;


        }
    });
    if (result) {
        $("input[id='usersDiv']").val(JSON.stringify(array));
        $("#page2").hide();
        $("#page1").hide();
        $("#page3").show();
    }

}
function saveUser() {
    $("#page3Error").hide();
    var telephoneNumber = $("input[id='telephoneNumber']").val();
    var companyName = $("input[id='companyName']").val();
    var gender = $("#gender").val();
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
        return true;
    }

}
function addMoreUser() {

    var div = '<div class="user">';
    div += '<div style="background-color: lightgray;float: left;height: 80px;margin-top: 5px;width: 150px;">';
    div += '</div>';
    div += '<input type="text"  class="form-control users-input name" placeholder="Full Name"/>';
    div += '<input type="text"    class="form-control users-input email" placeholder="Email Address"/><span class="errorSpan">?</span>';
    div += '</div>';
    $("#main-users").append(div);

}

function onEmailChange(ref) {
    var email = $(ref).val();
    if (email != "") {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            $(ref).closest(".errorSpan").show();
            $(ref).addClass("invalid");
            $(ref).closest(".errorSpan").tooltip().html("Please enter a valid email address");
            $(ref).focus();
        }
        else {
            $(ref).closest(".errorSpan").hide();
            $(ref).removeClass("invalid");
        }
    }
}

