function enableChild() {
    $(".child").show();
    $(".child input").prop("disbaled", false);

}

function disableChild() {
    $(".child").hide();
    $(".child input").prop("disbaled", true);
}

function enablePartner() {
    $(".patner").show();
    $(".patner input").prop("disbaled", false);

}

function disablePartner() {
    $(".patner").hide();
    $(".patner input").prop("disbaled", true);
}

function showQualification() {
    $(".qualification").show();
    $(".qualification input").prop("disbaled", false);

}

function hideQualification() {
    $(".qualification").hide();
    $(".qualification input").prop("disbaled", true);
}

function showJob()
{
    $(".job-history").show();
    $(".job-history input").prop("disbaled", false);
}
    
function hideJob()
{
    $(".job-history").hide();
    $(".job-history input").prop("disbaled", true);
}
function showEmployer()
{
    $(".employer-history").show();
    $(".employer-history input").prop("disbaled", false);
}
function hideEmployer() {
    $(".employer-history").hide();
    $(".employer-history input").prop("disbaled", true);
}

function showQualificationPartner() {
    $(".qualification-partner").show();
    $(".qualification-partner input").prop("disbaled", false);

}

function hideQualificationPartner() {
    $(".qualification-partner").hide();
    $(".qualification-partner input").prop("disbaled", true);
}

function showJobPartner() {
    $(".job-history-partner").show();
    $(".job-history-partner input").prop("disbaled", false);
}

function hideJobPartner() {
    $(".job-history-partner").hide();
    $(".job-history-partner input").prop("disbaled", true);
}
function showEmployerPartner() {
    $(".employer-history-partner").show();
    $(".employer-history-partner input").prop("disbaled", false);
}
function hideEmployerPartner() {
    $(".employer-history-partner").hide();
    $(".employer-history-partner input").prop("disbaled", true);
}

function undoSelected(ref) {
    $(ref).prevAll("input").first().val("");
}