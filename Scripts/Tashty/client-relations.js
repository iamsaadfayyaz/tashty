var importLists = [];
function addPoliceDatePartner(id) {
    if ($("#policeDate").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDate'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }

    var obj = new Object();
    obj.Date = $("#policeDate").val();
    obj.Country = $("#policeCountry").val();
    obj.FKClientID = id;
    obj.IsPartner = true;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/AddPoliceCertificate',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data) {
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptAdded'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                var count = $("#police-date-table tbody tr").length;
                count = parseInt(count) + 1;
                var html = '<tr><td>' + count + '</td><td>' + obj.Date + ' </td><td><span>' + obj.Country + '</span></td><td><input type="button" value="' + ScriptResourcesList['scriptRemove']+'" class="remove_btn" onclick="deletePoliceDate(this,' + data + ')" /></td></tr>';
                $("#police-date-table tbody").append(html);
                $("#policeDate").val("");
                $("#policeCountry").selectpicker('val', '');

            }
            else {
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
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
function addPoliceDate() {
    if ($("#policeDate").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectDate'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }

    var obj = new Object();
    obj.Date = $("#policeDate").val();
    obj.CertificateExpiryDate = $("#policeDateExpiry").val();
    obj.Country = $("#policeCountry").val();
    obj.FKClientID = $("#selected-client-id").val();
    obj.IsPartner = false;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/AddPoliceCertificate',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data) {
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptAdded'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                var count = $("#police-date-table tbody tr").length;
                count = parseInt(count) + 1;
                var html = '<tr><td>' + count + '</td><td>' + obj.Date + ' </td><td>' + obj.CertificateExpiryDate + ' </td><td><span>' + obj.Country + '</span></td><td><input type="button" value="' + ScriptResourcesList['scriptRemove']+'" class="remove_btn" onclick="deletePoliceDate(this,' + data + ')" /></td></tr>';
                $("#police-date-table tbody").append(html);
                $("#policeDate").val("");               
                $("#policeCountry").selectpicker('val', '');
            }
            else
            {
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
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
function addClientApplicant() {
    if ($("#applicantName").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterName'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.Name = $("#applicantName").val();
    obj.IntrestedVisa = $("#applicantIntrestedVisa :selected").text();
    obj.FKVisaID = $("#applicantIntrestedVisa").val();
    obj.FKClientID = $("#selected-client-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/AddClientApplicant',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data) {
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptAdded'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                var count = $("#client-applicant-table tbody tr").length;
                count = parseInt(count) + 1;
                var html = '<tr><td>' + count + '</td><td>' + obj.Name + ' </td><td><span>' + obj.IntrestedVisa + '</span></td><td><input type="button" value="' + ScriptResourcesList['scriptRemove'] + '" class="remove_btn" onclick="deleteClientApplicant(this,' + data + ')" /></td></tr>';
                $("#client-applicant-table tbody").append(html);
                $("#applicantName").val("");
                $("#applicantIntrestedVisa").selectpicker('val', '');

            }
            else {
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
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
function addEmployer() {
    if ($("#emp-name").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterName'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.Name = $("#emp-name").val();
    obj.Address = $("#emp-address").val();
    obj.WebSite = $("#emp-website").val();
    obj.Email = $("#emp-email").val();
    obj.ContactPerson = $("#emp-contact").val();
    obj.Phone = $("#emp-phone").val();
    obj.NZBN = $("#emp-nzbn").val();
    obj.LegalName = $("#emp-legal-name").val();
    obj.Mobile = $("#emp-mobile").val();
    obj.FKClientID = $("#selected-client-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/AddEmployer',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptEmployerAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            getClientDetail();
            $("#ei-tab").click();
            
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function addJobFamily() {
    if ($("#job-title").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterJobTitle'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }



    var obj = new Object();
    obj.JobTitle = $("#job-title").val();
    obj.StartDate = $("#job-start").val();
    obj.EndDate = $("#job-end").val();
    obj.EmployerName = $("#job-emp-name").val();
    obj.EmployerAddress = $("#job-emp-address").val();
    obj.FKClientID = $("#hdn-family-member-id").val();
    obj.PayDetails = $("#job-pay-details").val();
    obj.Phone = $("#job-phone").val();
    obj.ManagerName = $("#job-manager-name").val();
    obj.ManagerEmail = $("#job-manager-email").val();
    obj.ManagerMobile = $("#job-manager-mobile").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/AddFamilyJob',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {           
            unblockUI();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptJobAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            $("#inner-job-detail").click();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function addJob() {
    if ($("#job-title").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterJobTitle'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    


    var obj = new Object();
    obj.JobTitle = $("#job-title").val();
    obj.StartDate = $("#job-start").val();
    obj.EndDate = $("#job-end").val();
    obj.EmployerName = $("#job-emp-name").val();
    obj.EmployerAddress = $("#job-emp-address").val();
    obj.FKClientID = $("#selected-client-id").val();
    obj.PayDetails = $("#job-pay-details").val();
    obj.Phone = $("#job-phone").val();
    obj.ManagerName = $("#job-manager-name").val();
    obj.ManagerEmail = $("#job-manager-email").val();
    obj.ManagerMobile = $("#job-manager-mobile").val();
    obj.PositionOfferd = $("#job-position-offered").val();
    obj.JobOffer = $("#job-job-offer").val();
    obj.CompanyRole = $("#job-company-role").val();
    obj.MentionHoursInWeek = $("#job-work-hours").val();
    obj.ANZSCOCode = $("#job-ANZ-code").val();
    obj.SkillLevel = $("#job-skill-level").val();
    obj.BusinessNumber = $("#job-bus-num").val();
    obj.WorkStay = $("#job-work-stay").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/AddJob',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptJobAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            getClientDetail();
            $("#jh-tab").click();
            
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function addInstituteFamily() {
    if ($("#edu-title").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterTitle'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }

    var obj = new Object();
    obj.Title = $("#edu-title").val();
    obj.StartDate = $("#edu-start").val();
    obj.EndDate = $("#edu-end").val();
    obj.UniversityName = $("#edu-uni-name").val();
    obj.UniversityAddress = $("#edu-uni-address").val();
    obj.Level = $("#edu-level").val();
    obj.FKClientID = $("#hdn-family-member-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/AddFamilyEducation',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptQualificationAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });           
           
            $("#inner-education-detail").click();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function addInstitute() {
    if ($("#edu-title").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterTitle'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }

    var obj = new Object();
    obj.Title = $("#edu-title").val();
    obj.StartDate = $("#edu-start").val();
    obj.EndDate = $("#edu-end").val();
    obj.UniversityName = $("#edu-uni-name").val();
    obj.UniversityAddress = $("#edu-uni-address").val();
    obj.Level = $("#edu-level").val();
    obj.FKClientID = $("#selected-client-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/AddEducation',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptQualificationAdded'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            getClientDetail();
            $("#qa-tab").click();
            
            unblockUI();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function updateEmployer(index, id) {

    if ($("input[name='Employers[" + index + "].Name']").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterName'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.ID = id;
    obj.Name = $("input[name='Employers[" + index + "].Name']").val();
    obj.Address = $("input[name='Employers[" + index + "].Address']").val();
    obj.WebSite = $("input[name='Employers[" + index + "].WebSite']").val();
    obj.Email = $("input[name='Employers[" + index + "].Email']").val();
    obj.ContactPerson = $("input[name='Employers[" + index + "].ContactPerson']").val();
    obj.Phone = $("input[name='Employers[" + index + "].Phone']").val();
    obj.NZBN = $("input[name='Employers[" + index + "].NZBN']").val();
    obj.LegalName = $("input[name='Employers[" + index + "].LegalName']").val();
    obj.Mobile = $("input[name='Employers[" + index + "].Mobile']").val();
    obj.FKClientID = $("#selected-client-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/UpdateEmployer',
        async: false,
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
function updateJob(index, id) {
    if ($("input[name='[" + index + "].JobTitle']").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterJobTitle'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
   

    var obj = new Object();
    obj.ID = id;
    obj.JobTitle = $("input[name='[" + index + "].JobTitle']").val();
    obj.StartDate = $("input[name='[" + index + "].StartDate']").val();
    obj.EndDate = $("input[name='[" + index + "].EndDate']").val();
    obj.EmployerName = $("input[name='[" + index + "].EmployerName']").val();
    obj.EmployerAddress = $("input[name='[" + index + "].EmployerAddress']").val();
    obj.FKClientID = $("#selected-client-id").val();
    obj.PayDetails = $("input[name='[" + index + "].PayDetails']").val();
    obj.Phone = $("input[name='[" + index + "].Phone']").val();
    obj.ManagerName = $("input[name='[" + index + "].ManagerName']").val();
    obj.ManagerEmail = $("input[name='[" + index + "].ManagerEmail']").val();
    obj.ManagerMobile = $("input[name='[" + index + "].ManagerMobile']").val();
    obj.PositionOfferd = $("input[name='[" + index + "].PositionOfferd']").val();
    obj.JobOffer = $("input[name='[" + index + "].JobOffer']").val();
    obj.CompanyRole = $("input[name='[" + index + "].CompanyRole']").val();
    obj.MentionHoursInWeek = $("input[name='[" + index + "].MentionHoursInWeek']").val();
    obj.ANZSCOCode = $("input[name='[" + index + "].ANZSCOCode']").val();
    obj.SkillLevel = $("input[name='[" + index + "].SkillLevel']").val();
    obj.BusinessNumber = $("input[name='[" + index + "].BusinessNumber']").val();
    obj.WorkStay = $("input[name='[" + index + "].WorkStay']").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/UpdateJob',
        async: false,
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
function updateJobFamily(index, id) {
    if ($("input[name='[" + index + "].JobTitle']").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterJobTitle'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }


    var obj = new Object();
    obj.ID = id;
    obj.JobTitle = $("input[name='[" + index + "].JobTitle']").val();
    obj.StartDate = $("input[name='[" + index + "].StartDate']").val();
    obj.EndDate = $("input[name='[" + index + "].EndDate']").val();
    obj.EmployerName = $("input[name='[" + index + "].EmployerName']").val();
    obj.EmployerAddress = $("input[name='[" + index + "].EmployerAddress']").val();
    obj.FKClientID = $("#hdn-family-member-id").val();
    obj.PayDetails = $("input[name='[" + index + "].PayDetails']").val();
    obj.Phone = $("input[name='[" + index + "].Phone']").val();
    obj.ManagerName = $("input[name='[" + index + "].ManagerName']").val();
    obj.ManagerEmail = $("input[name='[" + index + "].ManagerEmail']").val();
    obj.ManagerMobile = $("input[name='[" + index + "].ManagerMobile']").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/UpdateFamilyJob',
        async: false,
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
function updateInstituteFamily(index, id) {
    if ($("input[name='[" + index + "].Title']").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterTitle'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }


    var obj = new Object();
    obj.ID = id;
    obj.Title = $("input[name='[" + index + "].Title']").val();
    obj.StartDate = $("input[name='[" + index + "].StartDate']").val();
    obj.EndDate = $("input[name='[" + index + "].EndDate']").val();
    obj.UniversityName = $("input[name='[" + index + "].UniversityName']").val();
    obj.UniversityAddress = $("input[name='[" + index + "].UniversityAddress']").val();
    obj.Level = $("input[name='[" + index + "].Level']").val();
    obj.FKClientID = $("#hdn-family-member-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/UpdateFamilyEducation',
        async: false,
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
function updateInstitute(index, id) {
    if ($("input[name='[" + index + "].Title']").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterTitle'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    

    var obj = new Object();
    obj.ID = id;
    obj.Title = $("input[name='[" + index + "].Title']").val();
    obj.StartDate = $("input[name='[" + index + "].StartDate']").val();
    obj.EndDate = $("input[name='[" + index + "].EndDate']").val();
    obj.UniversityName = $("input[name='[" + index + "].UniversityName']").val();
    obj.UniversityAddress = $("input[name='[" + index + "].UniversityAddress']").val();
    obj.Level = $("input[name='[" + index + "].Level']").val();
    obj.FKClientID = $("#selected-client-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/UpdateEducation',
        async: false,
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
function deleteJobFamily(ref, id) {

    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteFamilyJob',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().remove();
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
function deleteEducationFamily(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteFamilyEducation',
            data: JSON.stringify({ id: id}),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().remove();
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
function deleteJob(ref, id) {
    
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteJob',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().remove();
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
function deleteEducation(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteEducation',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().remove();
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
function deletePoliceDate(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeletePoliceCertifcate',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().remove();
                    var int = 0;
                    $("#police-date-table tr").each(function () {
                        $(this).find("td:first").html(int);
                        int++;
                    });
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
function deleteClientApplicant(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteClientApplicant',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().remove();
                    var int = 0;
                    $("#client-applicant-table tr").each(function () {
                        $(this).find("td:first").html(int);
                        int++;
                    });
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
function deleteEmployer(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteEmployer',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().remove();
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
function insertFamilyDesc(ref, id) {

    var desc = $(ref).parent().find(".fm-desc").val();
    if (desc == "") {
        return showErrorToast(ScriptResourcesList['scriptPleaseEnterDescription']);
    }
    var model = new Object();
    model.ClientID = $("#selected-client-id").val();
    model.MemberID = id;
    model.Description = desc;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/InsertFamilyDescription',
        data: JSON.stringify(model),
        async: true,
        success: function (data) {
            successToast();
            unblockUI();
            $("#modal-fam-detail").modal("hide");
            $('body').removeClass('modal-open');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function updateFamilyDesc(ref, id) {

    var desc = $(ref).parent().find(".fm-desc").val();
    if (desc == "") {
        return showErrorToast(ScriptResourcesList['scriptPleaseEnterDescription']);
    }
    var model = new Object();
    model.ClientID = $("#selected-client-id").val();
    model.ID = id;
    model.Description = desc;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/UpdateFamilyDescription',
        data: JSON.stringify(model),
        async: true,
        success: function (data) {
            successToast();
            unblockUI();
            $("#modal-fam-detail").modal("hide");
            $('body').removeClass('modal-open');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function getFamilyDesc(ref, id) {

    var model = new Object();
    model.ClientID = $("#selected-client-id").val();
    model.MemberID = id;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/GetFamilyDescription',
        data: JSON.stringify(model),
        async: true,
        success: function (data) {
            unblockUI();
            var html = "";
            if (data.length > 0) {
                html += '<h3 class="input_lbl">';
                html += ScriptResourcesList['scriptDescription'];
                html += '</h3>';
                if (data[0].Description) {
                    html += '<input type="text" class="fm-desc info_input" value="' + data[0].Description + '" />';
                }
                else
                {
                    html += '<input type="text" class="fm-desc info_input" />';
                }
                
                html += '<input type="button" value="' + ScriptResourcesList['scriptUpdate']+'" class="btn btn-default save_btn" onclick="updateFamilyDesc(this,' + data[0].ID + ')" />';
                html += '<button type="button" class="btn btn-default save_btn" data-dismiss="modal">'+ ScriptResourcesList['scriptClose']+'</button>';
            }
            else
            {
                html += '<h3 class="input_lbl">';
                html += ScriptResourcesList['scriptDescription'];
                html += '</h3>';
                html += '<input type="text" class="fm-desc info_input"  />';
                html += '<input type="button" value="' + ScriptResourcesList['scriptUpdate'] +'" class="btn btn-default save_btn" onclick="insertFamilyDesc(this,' + id + ')" /> ';
                html += '<button type="button" class="btn btn-default save_btn" data-dismiss="modal">' + ScriptResourcesList['scriptClose'] +'</button>';
            }
            $("#modal-fam-detail .detail_body").html(html);
            $("#modal-fam-detail").modal("show");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function getFamilyConnectionsSuccess(id) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/FamilyConnections?id='+id+'&client='+$("#selected-client-id").val(),       
        async: true,
        success: function (data) {
            unblockUI();
            $("#family-con").html(data);
            $("#familLinkAuto").val('');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
            unblockUI();
        }
    });

}
function deleteClientConcernPersonGroup(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteConcernPersonGroup',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                unblockUI();
                successToast();
                getClientDetail();
                editFeilds = new Array();
                $("#selected-client-name").text($("#hdn-auto-fullname").val());
                $("#selected-client-type").text($("#hdn-auto-clienttype").val());
                $("#selected-client-passport").text($("#hdn-auto-clientnumber").val());
                $("#selected-client-dob").text($("#hdn-auto-dob").val());
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
}
function deleteClientConcernPerson(ref, id)
{
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteConcernPerson',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().remove();
                }
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
function deleteAgentFromClient(ref, id,agent) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteClientAgent',
            data: JSON.stringify({ client: id, agent: agent, sales: $("#selectSalePerson").val()}),
            async: true,
            success: function (data) {

                if (data) {
                    var sl = $("#selectSalePerson").val();
                    if (sl != "")
                    {
                        if (parseInt(sl) == agent)
                        {
                            $("#selectSalePerson").selectpicker('val', "");
                        }
                    }
                    $("#selected-client-agent-id").val("0");
                    $(ref).parent().remove();
                }
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
function deletePClientConcernPersonUpdated(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeletePConcernPerson',
            data: JSON.stringify({ id:id , client: $("#pclientid").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().remove();
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

function addAllPP() {

 

    if (confirm(ScriptResourcesList['scriptAllProcessingPerson'])) {
            var id = $('#selectResponsible option:selected').val();
            var name = $('#selectResponsible option:selected').text();
            blockUI();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/ClientRelation/AddALLCP',
                data: JSON.stringify({model: $("#selected-client-id").val() }),
                async: true,
                success: function (data) {

                    unblockUI();
                    successToast();
                    getClientDetail();

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleErrors(textStatus);
                    unblockUI();
                }
            });
        }

    

}
function addConcernPersonGroup() {

    if ($('#selectResponsibleGroup option:selected').val() != "") {
       
        if (confirm(ScriptResourcesList['scriptProcessingPerson'])) {
            var id = $('#selectResponsibleGroup option:selected').val();
            var name = $('#selectResponsibleGroup option:selected').text();
            blockUI();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/ClientRelation/AddConcernPersonGroup',
                data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
                async: true,
                success: function (data) {

                    unblockUI();
                    if (data == "AE") {
                        return $().toastmessage('showToast', {
                            text: ScriptResourcesList['scriptPersonAlreadyAdded'],
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
                    successToast();
                    getClientDetail();
                    editFeilds = new Array();
                    $("#selected-client-name").text($("#hdn-auto-fullname").val());
                    $("#selected-client-type").text($("#hdn-auto-clienttype").val());
                    $("#selected-client-passport").text($("#hdn-auto-clientnumber").val());
                    $("#selected-client-dob").text($("#hdn-auto-dob").val());

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleErrors(textStatus);
                    unblockUI();
                }
            });
        }

    }

}
function addConcernPerson() {
    
    if ($('#selectResponsible option:selected').val() != "")
    {
        if ($('#selectResponsible option:selected').val() == "A")
        {
            return addAllPP();
        }
        if (confirm(ScriptResourcesList['scriptProcessingPerson'])) {
            var id = $('#selectResponsible option:selected').val();
            var name = $('#selectResponsible option:selected').text();
            blockUI();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/ClientRelation/AddConcernPerson',
                data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
                async: true,
                success: function (data) {
                    
                    unblockUI();
                    if (data == "AE") {
                        return $().toastmessage('showToast', {
                            text: ScriptResourcesList['scriptPersonAlreadyAdded'],
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
                    successToast();
                    var html = '<div class="hide_btn_cp"><i onclick="deleteClientConcernPerson(this,' + id + ')" class="fa fa-times" aria-hidden="true"></i>' + name + '</div>';
                  
                    $("#concernedPersons").append(html);
                    $("#selectResponsible").selectpicker('val', '');

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleErrors(textStatus);
                    unblockUI();
                }
            });
        }

    }
    
}

function addPConcernPerson() {
    

    if ($('#selectResponsible option:selected').val() != "") {

        if (confirm(ScriptResourcesList['scriptProcessingPerson'])) {
            var id = $('#selectResponsible option:selected').val();
            var name = $('#selectResponsible option:selected').text();
            blockUI();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/ClientRelation/AddPConcernPerson',
                data: JSON.stringify({ id: id, pclientid: $("#pclientid").val() }),
                async: true,
                success: function (data) {
                    unblockUI();
                    if (data == "AE") {
                        return $().toastmessage('showToast', {
                            text: ScriptResourcesList['scriptPersonAlreadyAdded'],
                            sticky: false,
                            position: 'bottom-right',
                            type: 'error'

                        });

                    }
                    if (data == false) {
                        return $().toastmessage('showToast', {
                            text: ScriptResourcesList['scriptFailed'],
                            sticky: false,
                            position: 'bottom-right',
                            type: 'error'

                        });
                    }

                    successToast();
                    var html = '<div><h3 class="input_lbl">' + name + '</h3><i class="fa fa-times-circle" aria-hidden="true" onclick="deletePClientConcernPersonUpdated(this,' + id + ')"></i></div>';
                    $("#concernedPersons").append(html);

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleErrors(textStatus);
                    unblockUI();
                }
            });
        }

    }

}
function deleteFamilyLink(ref, id,refe) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteFamilyLink',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val(),clientL:refe }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().remove();
                }
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

function addVisaHistory() {
    if ($("#newVHType").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectVisaType'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }
    var obj = new Object();
    obj.Type = $("#newVHType").val();
    obj.DateFrom = $("#newVHDateFrom").val();
    obj.DateTo = $("#newVHDateTo").val();
    obj.FKClientID = $("#selected-client-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/AddVisaHistory',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data) {
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptAdded'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                var count = $("#vh-date-table tbody tr").length;
                count = parseInt(count) + 1;
                var html = '<tr><td>' + count + '</td><td>' + $('#newVHType option:selected').text() + ' </td><td>' + $("#newVHDateFrom").val() + '</td><td>' + $("#newVHDateTo").val() + '</td><td><input type="button" value="'+ScriptResourcesList["scriptRemove"]+'" class="remove_btn" onclick="deleteVisaHistory(this,' + data + ')" /></td></tr>';
                $("#vh-date-table tbody").append(html);

                $("#newVHDateFrom").val("");
                $("#newVHDateTo").val("");
                $("#newVHType").selectpicker('val', '');

            }
            else {
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
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

function deleteVisaHistory(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteVisaHistory',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().remove();
                    var int = 0;
                    $("#vh-date-table tr").each(function () {
                        $(this).find("td:first").html(int);
                        int++;
                    });
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
function updateApproveDate(nDate, visaid) {
    var obj = new Object();
    obj.client = $("#selected-client-id").val();
    obj.visa = visaid;
    obj.approve = nDate;

    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ClientVisaUpdateApprove',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $("#date-" + visaid).hide();
            getClientVisa();
            getUpdateStatus();
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
function updateExpiry(nDate, pDate, visaid) {
    var obj = new Object();
    obj.client = $("#selected-client-id").val();
    obj.visa = visaid;
    obj.expiry = nDate;
    obj.pexpiry = pDate;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ClientVisaUpdateExpiry',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $("#date-" + visaid).hide();
            getClientVisa();
            getUpdateStatus();
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
function updateITADate(nDate, visaid) {
    var obj = new Object();
    obj.client = $("#selected-client-id").val();
    obj.visa = visaid;
    obj.expiry = nDate;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ClientVisaUpdateITA',
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
function updateEOISelected(nDate, visaid) {
    var obj = new Object();
    obj.client = $("#selected-client-id").val();
    obj.visa = visaid;
    obj.expiry = nDate;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ClientVisaUpdateSelected',
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
function deleteVisa(id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/DeleteVisa',
            async: false,
            data: JSON.stringify({ 'visa': id, 'client': $("#selected-client-id").val() }),
            success: function (data) {

                unblockUI();
                getClientVisa();
                getUpdateStatus();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }

}
function deleteVisaSup(id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/EmployerManagement/DeleteVisa',
            async: false,
            data: JSON.stringify({ 'visa': id }),
            success: function (data) {

                unblockUI();
                $("#tabCases").click();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }

}
function visaPPIDetails(id, ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/VisaPPIDetails?id=' + id,
        async: false,
        success: function (data) {
            $(ref).parent().next(".ppi-det-row").html(data);
            unblockUI();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function visaFlow(id, ref) {

    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/VisaFlow?id=' + id,
        async: false,
        success: function (data) {
            
            $(ref).parents(".status_box").next(".ppi-det-row").html(data);
            unblockUI();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });


}
function showApplyVisa() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/InsertClientVisas',
        async: true,
        success: function (data) {
            unblockUI();
            if (!$("#rightDiv").is(":visible")) {
                $("#rightDiv").fadeIn();
                $("#centralDiv").removeClass();
                $("#centralDiv").addClass("col-lg-6 col-md-6 col-sm-12 col-xs-12 double_col");
                $("#icon-expand").removeClass("fa-angle-double-left");
                $("#icon-expand").addClass("fa-angle-double-right");
            }
            setSelectedTab('all');
            $("#rightDivCenter").html("");
            $("#rightDivCenter").html(data);
           

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function showFinancialEmigration() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/FinancialEmigration',
        async: true,
        success: function (data) {
            unblockUI();
            if (!$("#rightDiv").is(":visible")) {
                $("#rightDiv").fadeIn();
                $("#centralDiv").removeClass();
                $("#centralDiv").addClass("col-lg-6 col-md-6 col-sm-12 col-xs-12 double_col");
                $("#icon-expand").removeClass("fa-angle-double-left");
                $("#icon-expand").addClass("fa-angle-double-right");
            }
            setSelectedTab('all');
            $("#rightDivCenter").html("");
            $("#rightDivCenter").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function showCashTransaction() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/CashTransaction',
        async: true,
        success: function (data) {
            unblockUI();
            if (!$("#rightDiv").is(":visible")) {
                $("#rightDiv").fadeIn();
                $("#centralDiv").removeClass();
                $("#centralDiv").addClass("col-lg-6 col-md-6 col-sm-12 col-xs-12 double_col");
                $("#icon-expand").removeClass("fa-angle-double-left");
                $("#icon-expand").addClass("fa-angle-double-right");
            }
            setSelectedTab('all');
            $("#rightDivCenter").html("");
            $("#rightDivCenter").html(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function showStartNew() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/StartNewApplication',
        async: true,
        success: function (data) {
            unblockUI();
            if (!$("#rightDiv").is(":visible"))
            {
                $("#rightDiv").fadeIn();
                $("#centralDiv").removeClass();
                $("#centralDiv").addClass("col-lg-6 col-md-6 col-sm-12 col-xs-12 double_col");
                $("#icon-expand").removeClass("fa-angle-double-left");
                $("#icon-expand").addClass("fa-angle-double-right");
            }
            setSelectedTab('all');
            $("#rightDivCenter").html("");
            $("#rightDivCenter").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function showStartNewAus() {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/StartNewApplicationAus',
        async: true,
        success: function (data) {
            unblockUI();
            if (!$("#rightDiv").is(":visible")) {
                $("#rightDiv").fadeIn();
                $("#centralDiv").removeClass();
                $("#centralDiv").addClass("col-lg-6 col-md-6 col-sm-12 col-xs-12 double_col");
                $("#icon-expand").removeClass("fa-angle-double-left");
                $("#icon-expand").addClass("fa-angle-double-right");
            }
            setSelectedTab('all');
            $("#rightDivCenter").html("");
            $("#rightDivCenter").html(data);           

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}

function getSchoolsbyType() {
    $("#school-types").remove();
    $("#program-types").remove();
    var id = $("#select-school-types").val();
    if (id == "") {
        return false;
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Addmission/GetSchools?type=' + id,
        success: function (data) {
            unblockUI();
            $("#select-school-types").after(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function getSchoolPrograms() {
    $("#program-types").remove();
    var id = $("#school-types").val();
    if (id == "") {
        return false;
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Addmission/GetPrograms?school=' + id,
        success: function (data) {
            unblockUI();
            $("#school-types").after(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}
function startNewApplicationSchool() {
    if ($("#select-school-types").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectType'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
    if ($("#school-types").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectSchool'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
    if ($("#program-types").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectLevel'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
    if ($("#select-program-status"))
    {
        if ($("#select-program-status").val() == "") {
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptPleaseSelectProgramStatus'],
                sticky: false,
                position: 'bottom-right',
                type: 'error'

            });

        }
    }
    if ($("#add-prog").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterProgram'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
   
    var data = { FKClientID: $("#selected-client-id").val(), FKSchoolID: $("#school-types").val(), AppliedDate: $("#start-date").val(), FKProgramID: $("#program-types").val(), Description: $("#add-desc").val(), EnrolledProgram: $("#add-prog").val(), StudentNo: $("#add-studentNo").val(), Fee: $("#add-studentFee").val(), Email: true, FKProgramStatus : $("#select-program-status").val() };
    $(".btn").prop("disabled", true);
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Addmission/ApplyNewProgram',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            unblockUI();
            $(".btn").prop("disabled", false);
            $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptUpdated'],
                sticky: false,
                position: 'bottom-right',
                type: 'success'

            });
            $("#selected-client-type").html("Student");
            getClientAddmissions();
            showStartNewApplication();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });


}
function StartNewApplicationAus() {
    if ($("#select-visa-types").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectVisaType'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
    if ($("#sub-types").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectVisaType'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
    if ($("#select-visa-status"))
    {
        if ($("#select-visa-status").val() == "") {
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptPleaseSelectVisaStatus'],
                sticky: false,
                position: 'bottom-right',
                type: 'error'

            });

        }
    }
    var data = { id: $("#selected-client-id").val(), type: $("#select-visa-types").val(), subtype: $("#sub-types").val(), status: $("#select-visa-status").val(),start: $("#start-date").val(), destination: $("#select-visa-destination").val(), email: true };
    $(".btn").prop("disabled", true);
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/StartNewApplicationAus',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            $(".btn").prop("disabled", false);
            unblockUI();
            if (data == "Notification Sent" || data == "Notification Not Sent") {

                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptUpdated'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
            }
            if (data) {
               
                $("#visa-notification-email").val(data.To);
                $("#visa-notification-subject").val(data.Subject);
                $("#visa-notification-comment").summernote({
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
                            var updatedTemp = removeElements(data.Message, "font");
                            $("#visa-notification-comment").summernote('code', updatedTemp);
                            if (_defaultFont != "") {
                                $('#visa-notification-comment').summernote('fontName', _defaultFont);
                                $(".dropdown-fontname a").removeClass("checked");
                                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                                $(".note-current-fontname").html(_defaultFont);
                                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
                            }
                            $(".note-editable a").mouseout(function () {
                                $(".note-link-popover").hide();
                            })
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
                Dropzone.autoDiscover = false;
                var myDropzone = new Dropzone("#upload-email-notification", {
                    url: "/Client/SendVisaNotification", addRemoveLinks: true,
                    thumbnailWidth: "80",
                    thumbnailHeight: "80",
                    dictCancelUpload: "Cancel",
                    autoProcessQueue: false,
                    uploadMultiple: true,
                    parallelUploads: 30,
                    init: function () {
                        var myDropzone = this;

                        // First change the button to actually tell Dropzone to process the queue.
                        $("#btn-send-visa-notification").on("click", function (e) {

                            // Make sure that the form isn't actually being sent.

                            if (myDropzone.getQueuedFiles().length === 0) {
                                return sendEmailNotification(true);
                            }
                            if ($("#visa-notification-email").val() == "") {
                                return $().toastmessage('showToast', {
                                    text: ScriptResourcesList['scriptPleaseEnterEmail'],
                                    sticky: false,
                                    position: 'bottom-right',
                                    type: 'error'
                                });
                            }
                            if ($("#visa-notification-subject").val() == "") {
                                return $().toastmessage('showToast', {
                                    text: ScriptResourcesList['scriptPleaseEnterSubject'],
                                    sticky: false,
                                    position: 'bottom-right',
                                    type: 'error'
                                });
                            }
                            if ($("#visa-notification-comment").val() == "") {
                                return $().toastmessage('showToast', {
                                    text: ScriptResourcesList['scriptPleaseEnterMessage'],
                                    sticky: false,
                                    position: 'bottom-right',
                                    type: 'error'
                                });
                            }
                            blockUI();
                            e.preventDefault();
                            e.stopPropagation();
                            myDropzone.processQueue();
                        });
                        this.on("maxfilesexceeded", function (file) {
                            return showErrorToast(ScriptResourcesList['scriptNoMoreFiles']);

                        });

                        this.on("sendingmultiple", function (file, xhr, formData) {
                            formData.append("ClientID", $("#selected-client-id").val());
                            formData.append("To", $("#visa-notification-email").val());
                            formData.append("Subject", $("#visa-notification-subject").val());
                            formData.append("Message", $("#visa-notification-comment").val());

                        });
                        this.on("successmultiple", function (files, response) {

                            unblockUI();
                            if (response == "SE") {
                                return showErrorToast(ScriptResourcesList['scriptStorageLimit']);
                            }
                            if (response == "MAXSIZE") {
                                return showErrorToast(ScriptResourcesList['scriptMaxTenMB']);
                            }


                            successToast();
                            myDropzone.removeAllFiles();
                            $('#modal-email-visa-notifcation').modal('hide');
                            $('body').removeClass('modal-open');
                            $("#date-" + $("#visa-notification-visa").val()).hide();
                            getClientVisa();
                            getUpdateStatus();

                        });
                        this.on("errormultiple", function (files, response) {
                            unblockUI();
                            return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                        });


                    }
                })
                $("#modal-email-visa-notifcation").modal("show");
            }

            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptUpdated'],
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
function saveVisa() {
    if ($("#visa-types").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseVisaApply'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
    if (confirm(ScriptResourcesList['scriptSendEmailNotification'])) {
        var data = { id: $("#selected-client-id").val(), type: $("#visa-types").val(), start: $("#applied-date").val(), email: true };
        $(".btn").prop("disabled", true);
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/InsertClientVisas',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                $(".btn").prop("disabled", false);
                unblockUI();
                getClientVisa();
                if (data == "NoEmail") {
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptVisaInsertedNoEmail'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'warning'
                    });
                }
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptUpdated'],
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

        var data = { id: $("#selected-client-id").val(), type: $("#visa-types").val(), start: $("#applied-date").val(), email: false };
        $(".btn").prop("disabled", true);
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/InsertClientVisas',
            data: JSON.stringify(data),
            async: true,
            success: function (data) {
                $(".btn").prop("disabled", false);
                unblockUI();
                getClientVisa();

                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptUpdated'],
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
function sendCheckListEmailP() {

    if ($("#check-notification-email").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterEmail'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'
        });
    }
    if ($("#check-notification-subject").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterSubject'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'
        });
    }
    if ($("#check-notification-comment").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseEnterMessage'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'
        });
    }
    var obj = new Object();
    obj.ClientID = $("#pClientID").val();
    obj.To = $("#check-notification-email").val();
    obj.Subject = $("#check-notification-subject").val();
    obj.CC = $("#check-notification-cc").val();
    obj.Message = $("#check-notification-comment").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/DocumentCheckList/SendEmailP',
        async: true,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            $('#doc-check-modal').modal('hide');
            $("#check-notification-email").val("");
            $("#check-notification-subject").val("");
            $("#check-notification-comment").val("");
            $('body').removeClass('modal-open');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });

}
function sendCheckListEmail() {

        if ($("#check-notification-email").val() == "") {
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptPleaseEnterEmail'],
                sticky: false,
                position: 'bottom-right',
                type: 'error'
            });
        }
        if ($("#check-notification-subject").val() == "") {
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptPleaseEnterSubject'],
                sticky: false,
                position: 'bottom-right',
                type: 'error'
            });
        }
        if ($("#check-notification-comment").val() == "") {
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptPleaseEnterMessage'],
                sticky: false,
                position: 'bottom-right',
                type: 'error'
            });
        }
        var obj = new Object();
        obj.ClientID = $("#selected-client-id").val();
        obj.To = $("#check-notification-email").val();
        obj.CC = $("#check-notification-cc").val();
        obj.Subject = $("#check-notification-subject").val();
        obj.Message = $("#check-notification-comment").val();
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/DocumentCheckList/SendEmail',
            async: true,
            data: JSON.stringify(obj),
            success: function (data) {
                unblockUI();
                $('#doc-check-modal').modal('hide');
                $("#check-notification-email").val("");
                $("#check-notification-cc").val("");
                $("#check-notification-subject").val("");
                $("#check-notification-comment").val("");
                $('body').removeClass('modal-open');
                getClientDocs("CheckListtab");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    
}
function sendEmailNotification(ref) {
    if (ref) {
       
        var obj = new Object();
        obj.ClientID = $("#selected-client-id").val();
        obj.To = $("#visa-notification-email").val();
        obj.Subject = $("#visa-notification-subject").val();
        obj.Message = $("#visa-notification-comment").val();
        obj.CC = $("#visa-notification-email-cc").val();
        obj.BCC = $("#visa-notification-email-bcc").val();
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/SendVisaNotification',
            async: true,
            data: JSON.stringify(obj),
            success: function (data) {
                unblockUI();
                $('#modal-email-visa-notifcation').modal('hide');
                $('body').removeClass('modal-open');
                $("#date-" + $("#visa-notification-visa").val()).hide();
                getClientVisa();
                getUpdateStatus();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                unblockUI();
                handleErrors(textStatus);
            }
        });
    }
    else {
        $('#modal-email-visa-notifcation').modal('hide');
        $('body').removeClass('modal-open');
        $("#date-" + $("#visa-notification-visa").val()).hide();
        getClientVisa();
        getUpdateStatus();
    }
}
function startApplicationCustom() {
    if ($("#visa-types").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseVisaApply'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
    if ($("#visa-status").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectVisaStatus'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
    var data = { id: $("#selected-client-id").val(), type: $("#visa-types").val(), status: $("#visa-status").val(), email: true, start: $("#start-date").val() };
    $(".btn").prop("disabled", true);
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/StartNewApplication',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            $(".btn").prop("disabled", false);
            unblockUI();
            if (data == "Notification Sent" || data == "Notification Not Sent") {

                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptUpdated'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
            }
            if (data) {

                $("#visa-notification-email").val(data.To);
                $("#visa-notification-subject").val(data.Subject);
                $("#visa-notification-comment").summernote({
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
                            var updatedTemp = removeElements(data.Message, "font");
                            $("#visa-notification-comment").summernote('code', updatedTemp);
                            if (_defaultFont != "") {
                                $('#visa-notification-comment').summernote('fontName', _defaultFont);
                                $(".dropdown-fontname a").removeClass("checked");
                                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                                $(".note-current-fontname").html(_defaultFont);
                                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
                            }
                            $(".note-editable a").mouseout(function () {
                                $(".note-link-popover").hide();
                            })
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
                Dropzone.autoDiscover = false;
                var myDropzone = new Dropzone("#upload-email-notification", {
                    url: "/Client/SendVisaNotification", addRemoveLinks: true,
                    thumbnailWidth: "80",
                    thumbnailHeight: "80",
                    dictCancelUpload: "Cancel",
                    autoProcessQueue: false,
                    uploadMultiple: true,
                    parallelUploads: 30,
                    init: function () {
                        var myDropzone = this;

                        // First change the button to actually tell Dropzone to process the queue.
                        $("#btn-send-visa-notification").on("click", function (e) {

                            // Make sure that the form isn't actually being sent.

                            if (myDropzone.getQueuedFiles().length === 0) {
                                return sendEmailNotification(true);
                            }
                            if ($("#visa-notification-email").val() == "") {
                                return $().toastmessage('showToast', {
                                    text: ScriptResourcesList['scriptPleaseEnterEmail'],
                                    sticky: false,
                                    position: 'bottom-right',
                                    type: 'error'
                                });
                            }
                            if ($("#visa-notification-subject").val() == "") {
                                return $().toastmessage('showToast', {
                                    text: ScriptResourcesList['scriptPleaseEnterSubject'],
                                    sticky: false,
                                    position: 'bottom-right',
                                    type: 'error'
                                });
                            }
                            if ($("#visa-notification-comment").val() == "") {
                                return $().toastmessage('showToast', {
                                    text: ScriptResourcesList['scriptPleaseEnterMessage'],
                                    sticky: false,
                                    position: 'bottom-right',
                                    type: 'error'
                                });
                            }
                            blockUI();
                            e.preventDefault();
                            e.stopPropagation();
                            myDropzone.processQueue();
                        });
                        this.on("maxfilesexceeded", function (file) {
                            return showErrorToast(ScriptResourcesList['scriptNoMoreFiles']);

                        });

                        this.on("sendingmultiple", function (file, xhr, formData) {
                            formData.append("ClientID", $("#selected-client-id").val());
                            formData.append("To", $("#visa-notification-email").val());
                            formData.append("Subject", $("#visa-notification-subject").val());
                            formData.append("Message", $("#visa-notification-comment").val());

                        });
                        this.on("successmultiple", function (files, response) {

                            unblockUI();
                            if (response == "SE") {
                                return showErrorToast(ScriptResourcesList['scriptStorageLimit']);
                            }
                            if (response == "MAXSIZE") {
                                return showErrorToast(ScriptResourcesList['scriptMaxTenMB']);
                            }


                            successToast();
                            myDropzone.removeAllFiles();
                            $('#modal-email-visa-notifcation').modal('hide');
                            $('body').removeClass('modal-open');
                            $("#date-" + $("#visa-notification-visa").val()).hide();
                            getClientVisa();
                            getUpdateStatus();

                        });
                        this.on("errormultiple", function (files, response) {
                            unblockUI();
                            return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                        });


                    }
                })
                $("#modal-email-visa-notifcation").modal("show");
            }

            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptUpdated'],
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
function startApplication() {
    if ($("#visa-types").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseVisaApply'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });

    }
    var data = { id: $("#selected-client-id").val(), type: $("#visa-types").val(), email: true, start: $("#start-date").val() };
    $(".btn").prop("disabled", true);
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/StartNewApplication',
        data: JSON.stringify(data),
        async: true,
        success: function (data) {
            $(".btn").prop("disabled", false);
            unblockUI();
            if (data == "Notification Sent" || data == "Notification Not Sent") {
                getClientVisa();
                getUpdateStatus();
                return $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptUpdated'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
            }
            if (data) {
           
                $("#visa-notification-email").val(data.To);
                $("#visa-notification-subject").val(data.Subject);
                $("#visa-notification-comment").summernote({
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
                            var updatedTemp = removeElements(data.Message, "font");
                            $("#visa-notification-comment").summernote('code', updatedTemp);
                            if (_defaultFont != "") {
                                $('#visa-notification-comment').summernote('fontName', _defaultFont);
                                $(".dropdown-fontname a").removeClass("checked");
                                $(".dropdown-fontname li").find("[data-value='" + _defaultFont + "']").addClass("checked");
                                $(".note-current-fontname").html(_defaultFont);
                                $(".note-editable").attr('style', 'font-family:' + _defaultFont + ' !important;');
                            }
                            $(".note-editable a").mouseout(function () {
                                $(".note-link-popover").hide();
                            })
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
                Dropzone.autoDiscover = false;
                var myDropzone = new Dropzone("#upload-email-notification", {
                    url: "/Client/SendVisaNotification", addRemoveLinks: true,
                    thumbnailWidth: "80",
                    thumbnailHeight: "80",
                    dictCancelUpload: "Cancel",
                    autoProcessQueue: false,
                    uploadMultiple: true,
                    parallelUploads: 30,
                    init: function () {
                        var myDropzone = this;

                        // First change the button to actually tell Dropzone to process the queue.
                        $("#btn-send-visa-notification").on("click", function (e) {

                            // Make sure that the form isn't actually being sent.

                            if (myDropzone.getQueuedFiles().length === 0) {
                                return sendEmailNotification(true);
                            }
                            if ($("#visa-notification-email").val() == "") {
                                return $().toastmessage('showToast', {
                                    text: ScriptResourcesList['scriptPleaseEnterEmail'],
                                    sticky: false,
                                    position: 'bottom-right',
                                    type: 'error'
                                });
                            }
                            if ($("#visa-notification-subject").val() == "") {
                                return $().toastmessage('showToast', {
                                    text: ScriptResourcesList['scriptPleaseEnterSubject'],
                                    sticky: false,
                                    position: 'bottom-right',
                                    type: 'error'
                                });
                            }
                            if ($("#visa-notification-comment").val() == "") {
                                return $().toastmessage('showToast', {
                                    text: ScriptResourcesList['scriptPleaseEnterMessage'],
                                    sticky: false,
                                    position: 'bottom-right',
                                    type: 'error'
                                });
                            }
                            blockUI();
                            e.preventDefault();
                            e.stopPropagation();
                            myDropzone.processQueue();
                        });
                        this.on("maxfilesexceeded", function (file) {
                            return showErrorToast(ScriptResourcesList['scriptNoMoreFiles']);

                        });

                        this.on("sendingmultiple", function (file, xhr, formData) {
                            formData.append("ClientID", $("#selected-client-id").val());
                            formData.append("To", $("#visa-notification-email").val());
                            formData.append("Subject", $("#visa-notification-subject").val());
                            formData.append("Message", $("#visa-notification-comment").val());

                        });
                        this.on("successmultiple", function (files, response) {

                            unblockUI();
                            if (response == "SE") {
                                return showErrorToast(ScriptResourcesList['scriptStorageLimit']);
                            }
                            if (response == "MAXSIZE") {
                                return showErrorToast(ScriptResourcesList['scriptMaxTenMB']);
                            }


                            successToast();
                            myDropzone.removeAllFiles();
                            $('#modal-email-visa-notifcation').modal('hide');
                            $('body').removeClass('modal-open');
                            $("#date-" + $("#visa-notification-visa").val()).hide();
                            getClientVisa();
                            getUpdateStatus();

                        });
                        this.on("errormultiple", function (files, response) {
                            unblockUI();
                            return showErrorToast(ScriptResourcesList['scriptSorrySomethingWentWrong']);
                        });


                    }
                })
                $("#modal-email-visa-notifcation").modal("show");
            }
                 
            return $().toastmessage('showToast', {
                text: ScriptResourcesList['scriptUpdated'],
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
function getVisaSubType() {
    $("#sub-types").remove();  
    var id = $("#select-visa-types").val();
    if (id == "") {
        return false;
    }
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/GetVisaSubType?type=' + id,
        success: function (data) {
            unblockUI();
            $("#select-visa-types").after(data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            handleErrors(textStatus);
        }
    });
}

function addAssessingAuth() {
    if ($("#assessingAuth").val() == "") {
        return $().toastmessage('showToast', {
            text: ScriptResourcesList['scriptPleaseSelectAuthority'],
            sticky: false,
            position: 'bottom-right',
            type: 'error'

        });
    }

    var obj = new Object();
    obj.AuthName = $('#assessingAuth option:selected').text();
    obj.FKAssessingAuth = $("#assessingAuth").val();
    obj.SubmittedDate = $("#auth-sub-date").val();
    obj.ReturnedDate = $("#auth-ret-date").val();
    obj.ReferenceNumber = $("#auth-ref-no").val();
    obj.FKClientID = $("#selected-client-id").val();
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/ClientRelation/AddAssessingAuth',
        async: false,
        data: JSON.stringify(obj),
        success: function (data) {
            unblockUI();
            if (data) {
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptAdded'],
                    sticky: false,
                    position: 'bottom-right',
                    type: 'success'

                });
                var count = $("#assessing-auth-table tbody tr").length;
                count = parseInt(count) + 1;
                var html = '<tr><td>' + count + '</td><td>' + obj.AuthName + ' </td><td>' + obj.SubmittedDate + ' </td><td>' + obj.ReturnedDate + '</td><td>' + obj.ReferenceNumber + '</td><td><input type="button" value="' + ScriptResourcesList['scriptRemove']+'" class="remove_btn" onclick="deleteAssessingAuth(this,' + data + ')" /></td></tr>';
                $("#assessing-auth-table tbody").append(html);
                
                $("#auth-sub-date").val('');              
                $("#auth-ref-no").val('');
                $("#auth-ret-date").val("");
                $("#assessingAuth").selectpicker('val', '');

            }
            else {
                $().toastmessage('showToast', {
                    text: ScriptResourcesList['scriptSorrySomethingWentWrong'],
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
function deleteAssessingAuth(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteAssessingAuth',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().remove();
                    var int = 0;
                    $("#assessing-auth-table tr").each(function () {
                        $(this).find("td:first").html(int);
                        int++;
                    });
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
function updateAIPDate(nDate, visaid) {
    var obj = new Object();
    obj.client = $("#selected-client-id").val();
    obj.visa = visaid;
    obj.aipdate = nDate;   
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ClientVisaUpdateAIP',
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
function updateRefusedDate(nDate, visaid) {
    var obj = new Object();
    obj.client = $("#selected-client-id").val();
    obj.visa = visaid;
    obj.refuseddate = nDate;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ClientVisaUpdateRefused',
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
function updateAssessmentDate(nDate, visaid) {
    var obj = new Object();
    obj.client = $("#selected-client-id").val();
    obj.visa = visaid;
    obj.refuseddate = nDate;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ClientVisaUpdateAssessment',
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
function updateContractDate(nDate, visaid) {
    var obj = new Object();
    obj.client = $("#selected-client-id").val();
    obj.visa = visaid;
    obj.refuseddate = nDate;
    blockUI();
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: '/Client/ClientVisaUpdateContract',
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
function undoVisaDateSelected(type, visaid,ref)
{
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/Client/DeleteVisaDate',
            data: JSON.stringify({ type: type, visaid: visaid }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().find(".datepickervisa").val("");
                   
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
function addClientSupplier(ref) {

    if (confirm(ScriptResourcesList['scriptSupplierAddConfirmation'])) {
        var id = $('#selectClientSupplier option:selected').val();
        var name = $('#selectClientSupplier option:selected').text();
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/AddSupplier',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {

                unblockUI();
                if (data == "AE") {
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptSupplierAdded'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'error'

                    });

                }
                if (data == false) {
                    return $().toastmessage('showToast', {
                        text: ScriptResourcesList['scriptFailed'],
                        sticky: false,
                        position: 'bottom-right',
                        type: 'error'

                    });
                }
                successToast();
                if (ref)
                {
                    return $("#ei-tab").click();
                }
                viewClientSuppliers();

            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }

}
function addClientSupplierJob(ref) {
    if ($(ref).val() != "")
    {
        if (confirm(ScriptResourcesList['scriptJobAddConfirmation'])) {
            var tid = $(ref).attr("id");
            var id = $('#' + tid + ' option:selected').val();
            var name = $('#' + tid + ' option:selected').text();
            blockUI();
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: '/ClientRelation/AddSupplierJob',
                data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
                async: true,
                success: function (data) {

                    unblockUI();
                    if (data == "AE") {
                        return $().toastmessage('showToast', {
                            text: ScriptResourcesList['scriptJobAlreadyAdded'],
                            sticky: false,
                            position: 'bottom-right',
                            type: 'error'

                        });

                    }
                    if (data == false) {
                        return $().toastmessage('showToast', {
                            text: ScriptResourcesList['scriptFailed'],
                            sticky: false,
                            position: 'bottom-right',
                            type: 'error'

                        });
                    }
                    showSuccessToast("Job add in client job history!");

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    handleErrors(textStatus);
                    unblockUI();
                }
            });
        }

    }
    
}
function deleteClientSupplier(ref, id) {
    if (confirm(ScriptResourcesList['scriptDeleteConfirmation'])) {
        blockUI();
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: '/ClientRelation/DeleteSupplier',
            data: JSON.stringify({ id: id, client: $("#selected-client-id").val() }),
            async: true,
            success: function (data) {
                if (data) {
                    $(ref).parent().parent().remove();
                    $(".row-supplier-notes").remove();
                }
                unblockUI();
                showSuccessToast(ScriptResourcesList['scriptDeleted'])
            },
            error: function (jqXHR, textStatus, errorThrown) {
                handleErrors(textStatus);
                unblockUI();
            }
        });
    }
}
function getClientEmployers(ref)
{
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientEmployers?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            unblockUI();          
            $("#tab11default").html("");
            $("#tab11default").html(data);
            $(".client-inner-ul li").removeClass("active");
            $(ref).parent().addClass("active");
      
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function viewClientMergeQuestionnaire(ref)
{
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/ClientRelation/ClientQuestionnaireMerged?id=' + $("#selected-client-id").val(),
        async: false,
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
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function viewClientSuppliers(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientSuppliers?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            unblockUI();
            $("#tab11default").html("");
            $("#tab11default").html(data);
            if (ref)
            {
                $(".client-inner-ul li").removeClass("active");
                $(ref).parent().addClass("active");

            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getFamilyJobHistory(ref,id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/FamilyJobHistory?id=' + id,
        async: false,
        success: function (data) {
            unblockUI();
            $("#client-details").html("");
            $("#client-details").html(data);
            $("#inner-partner-detail").removeClass("btn-default").addClass("btn-primary");
            $("#inner-job-detail").removeClass("btn-primary").addClass("btn-default");
            $("#inner-education-detail").removeClass("btn-default").addClass("btn-primary");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getFamilyQualification(ref,id) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/FamilyQualification?id=' + id,
        async: false,
        success: function (data) {
            unblockUI();
            $("#client-details").html("");
            $("#client-details").html(data);
            $("#inner-partner-detail").removeClass("btn-default").addClass("btn-primary");
            $("#inner-job-detail").removeClass("btn-default").addClass("btn-primary");
            $("#inner-education-detail").removeClass("btn-primary").addClass("btn-default");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getClientContactsInNZ(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/ClientRelation/ClientContacts?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            unblockUI();
            $("#tab11default").html("");
            $("#tab11default").html(data);
            $(".client-inner-ul li").removeClass("active");
            $(ref).parent().addClass("active");



        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getClientJobHistory(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientJobHistory?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            unblockUI();
            $("#tab11default").html("");
            $("#tab11default").html(data);
            $(".client-inner-ul li").removeClass("active");
            $(ref).parent().addClass("active");
          


        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getClientQualification(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/Client/ClientQualification?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            unblockUI();
            $("#tab11default").html("");
            $("#tab11default").html(data);
            $(".client-inner-ul li").removeClass("active");
            $(ref).parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}
function getClientQuestionnaireMerge(ref) {
    blockUI();
    $.ajax({
        type: "GET",
        contentType: "html",
        url: '/ClientRelation/ClientQuestionnaireMerged?id=' + $("#selected-client-id").val(),
        async: false,
        success: function (data) {
            unblockUI();
            $("#tab11default").html("");
            $("#tab11default").html(data);
            $(".client-inner-ul li").removeClass("active");
            $(ref).parent().addClass("active");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            unblockUI();
            handleErrors(textStatus);
        }
    });
}