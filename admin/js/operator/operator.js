$(document).ready(function () {
    //validation section
    function isPhone(phone) {
        var patt1 = /^059|^056/g;
        var result = phone.match(patt1);
        if (result) {
            return true;
        } else {
            return false;
        }
    }

    function isEmail(email)

    {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {

            return (true)
        }

        return (false)

    }

    function isText(inputtxt) {
        if (/^[a-zA-Z ]*$/g.test(inputtxt)) {

            return true;
        } else {
            return false;
        }
    }

    function isImage(filename) {

        var ext = filename.split('.').pop();
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
            case "jpeg":
                //etc
                return true;
        }
        return false;
    }

    function setCreateOperatorFormValidation() {

        $.get("../../../graduation-api/api/read.php/parks", function (data) {

            let parks = JSON.parse(data);

            $("#create-operator-form .parks-select").empty();
            $("#create-operator-form .parks-select").append(`<option value="">Select park...</option>`)
            for (let x = 0; x < parks.data.length; x++) {
                let park = parks.data[x];
                //fill park select
                $("#create-operator-form .parks-select").append(`<option value="${park.park_id}">${park.park_name}</option>`);
            }


        });
        jQuery.validator.addMethod("isImage", function (value, element) {

            return isImage(value);
        }, "Only PNG , JPEG , JPG, GIF File Allowed!!");
        jQuery.validator.addMethod("isText", function (value, element) {
            return isText(value);
        }, "input must be letters only!!");
        jQuery.validator.addMethod("isEmail", function (value, element) {
            return isEmail(value);
        }, "enter valid email!!");
        jQuery.validator.addMethod("isPhone", function (value, element) {

            return isPhone(value);
        }, "enter valid phone!!");

        $('#create-operator-form').submit(function (e) {
            e.preventDefault();

        }).validate({
            rules: {
                park_id: {
                    required: true,

                },
                FName: {
                    required: true,
                    isText: true

                },
                MName: {
                    required: true,
                    isText: true
                },

                LName: {
                    required: true,
                    isText: true

                },

                ID: {
                    required: true,
                    minlength: 9,
                    maxlength: 9,
                    number: true,
                    remote: {
                        url: "../../../graduation-api/api/create.php/operator/isIDAvailable",
                        type: "post",
                        data: {
                            id: function () {
                                return $("#create-operator-form input[name=ID]").val();
                            }
                        }
                    }
                },
                street: {
                    required: true,
                    isText: true

                },
                city: {
                    required: true,
                },
                birthdate: {
                    required: true,
                    date: true,

                },
                imagePath: {
                    required: true,
                    isImage: true
                },
                email: {
                    required: true,
                    isEmail: true,
                    remote: {
                        url: "../../../graduation-api/api/create.php/operator/isEmailAvailable",
                        type: "post",
                        data: {
                            email: function () {
                                alert(2)
                                return $("#create-operator-form input[name=email]").val();
                            }
                        }
                    }
                },
                phoneNO: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    number: true,
                    isPhone: true,
                    remote: {
                        url: "../../../graduation-api/api/create.php/operator/isPhoneAvailable",
                        type: "post",
                        data: {
                            phone: function () {
                                return $("#create-operator-form input[name=phoneNO]").val();
                            }
                        }
                    }

                },
                pass: {
                    required: true,
                    minlength: 6,
                    maxlength: 25
                },
                CPass: {
                    required: true,
                    equalTo: '#create-operator-form input[name=pass]'
                }

            },
            messages: {

                phoneNO: {
                    minlength: "phone must be at least 10 number long",
                    maxlength: "phone must be at least 10 number long",
                    number: "phone must be only numbers",
                    isPhone: "phone must start with 059 or 056"
                },
                ID: {
                    minlength: "phone must be at least 9 number long",
                    maxlength: "phone must be at least 9 number long",
                    number: "phone must be only numbers"
                },
                email: {
                    remote: "username already in use"
                }

            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            submitHandler: function (form) {

                let formData = new FormData(form);
                $.ajax({
                        url: '../../../graduation-api/api/create.php/operator/add',
                        type: 'POST',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false
                    }).done(function (data) {
                        location.reload();
                    })
                    .fail(function () {
                        alert("error");
                    });;

            }
        });
        $('#create-operator-form button[type=button]').click(function () {
            $('#create-operator-form').trigger("reset");
        });
    }
    //call create form validation
    setCreateOperatorFormValidation();

    function readFromDataBase() {
        $('#operators-table').DataTable();
        $.get("../../../graduation-api/api/read.php/operators", function (data) {

            let operators = JSON.parse(data);
            for (let x = 0; x < operators.data.length; x++) {
                let operator = operators.data[x];
                let editBTN = `<button id="${operator.user_id}-e" class="btn btn-success"><i class="fas fa-edit"></i></button>`;
                let deleteBTN = `<button id="${operator.user_id}-d" class="mx-1 btn btn-danger"><i class="fas fa-trash-alt"></i></button>`;
                let container = `<div class="d-flex">${editBTN} ${deleteBTN}</div>`
                $('#operators-table').dataTable().fnAddData([
                    operator.FName + " " + operator.LName, operator.email, operator.ID, operator.park_name,
                    container
                ]);

                $(`#${operator.user_id}-e`).click(function () {

                    $("#editModel").modal('show');
                    setOperatorForm(operator);
                });
                $(`#${operator.user_id}-d`).click(function () {

                    $.ajax({
                            method: "DELETE",
                            url: `../../../graduation-api/api/delete.php/operator/${operator.user_id}`,

                        })
                        .done(function (msg) {
                            location.reload();
                        });
                });
            }
        });
    }
    readFromDataBase();

    function setOperatorForm(operator) {
        $.get("../../../graduation-api/api/read.php/parks", function (data) {

            let parks = JSON.parse(data);

            $("#update-operator-form .parks-select").empty();
            for (let x = 0; x < parks.data.length; x++) {
                let park = parks.data[x];
                //fill park select
                $("#update-operator-form .parks-select").append(`<option value="${park.park_id}">${park.park_name}</option>`);
            }
            //set the park of operator
            if (operator.park_id != 0)
                $("#update-operator-form .parks-select").val(operator.park_id)
            for (let key in operator) {
                $(`#update-operator-form input[name=${key}]`).val(operator[key]);
                if (key === "pass") {
                    $(`#update-operator-form input[name=CPass]`).val(operator[key]);
                }
            }
            //set photo
            
            $("#update-operator-form .profile-form-photo").css("background-image", `url("../../../graduation-api/upload/operator/` + operator.imagePath);
        });
        $('#update-operator-form').submit(function (e) {
            e.preventDefault();

        }).validate({
            rules: {
                park_id: {
                    required: true,

                },
                FName: {
                    required: true,
                    isText: true

                },
                MName: {
                    required: true,
                    isText: true
                },

                LName: {
                    required: true,
                    isText: true

                },

                ID: {
                    required: true,
                    minlength: 9,
                    maxlength: 9,
                    number: true,
                    remote: {
                        url: "../../../graduation-api/api/update.php/operator/isIDAvailable",
                        type: "put",
                        data: {
                            id: function () {
                                return $("#update-operator-form input[name=ID]").val();
                            },
                            email: function () {
                                return $("#update-operator-form input[name=email]").val();
                            }
                        }
                    }
                },
                street: {
                    required: true,
                    isText: true

                },
                city: {
                    required: true,
                },
                birthdate: {
                    required: true,
                    date: true,

                },
                imagePath: {
                    required: true,
                    isImage: true
                },
                email: {
                    required: true,
                    isEmail: true,
                    remote: {
                        url: "../../../graduation-api/api/update.php/operator/isEmailAvailable",
                        type: "put",
                        data: {
                            email: function () {
                                return $("#update-operator-form input[name=email]").val();
                            },
                            id: function () {
                                return $("#update-operator-form input[name=ID]").val();
                            }
                        }
                    }
                },
                phoneNO: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    number: true,
                    isPhone: true,
                    remote: {
                        url: "../../../graduation-api/api/update.php/operator/isPhoneAvailable",
                        type: "put",
                        data: {
                            phone: function () {
                                return $("#update-operator-form input[name=phoneNO]").val();
                            },
                            id: function () {
                                return $("#update-operator-form input[name=ID]").val();
                            }
                        }
                    }

                },
                pass: {
                    required: true,
                    minlength: 6,
                    maxlength: 25
                },
                CPass: {
                    required: true,
                    equalTo: '#update-operator-form input[name=pass]'
                }

            },
            messages: {

                phoneNO: {
                    minlength: "phone must be at least 10 number long",
                    maxlength: "phone must be at least 10 number long",
                    number: "phone must be only numbers",
                    isPhone: "phone must start with 059 or 056"
                },
                ID: {
                    minlength: "phone must be at least 9 number long",
                    maxlength: "phone must be at least 9 number long",
                    number: "phone must be only numbers"
                },
                email: {
                    remote: "username already in use"
                }

            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            submitHandler: function (form) {

                let data = $(form).serializeArray();
                let op = {
                    "user_id": operator.user_id
                }
                for (let x = 0; x < data.length; x++) {

                    op[data[x].name] = data[x].value
                }

                $.ajax({
                    method: "PUT",
                    url: '../../../graduation-api/api/update.php/operator',
                    data: op

                }).done(function (msg) {
                    location.reload();
                });;

            }
        });
    }
});