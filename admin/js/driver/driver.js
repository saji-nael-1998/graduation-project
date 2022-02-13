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

    function setCreateDriverFormValidation() {

        $.get("../../../graduation-api/api/read.php/parks", function (data) {

            let parks = JSON.parse(data);

            $("#create-driver-form .parks-select").empty();
            $("#create-driver-form .parks-select").append(`<option value="">Select park...</option>`)
            $("#create-driver-form  .routes-select").append(`<option value="">Select route...</option>`)
            $("#create-driver-form  .taxis-select").append(`<option value="">Select taxi...</option>`)
            for (let x = 0; x < parks.data.length; x++) {
                let park = parks.data[x];
                //fill park select
                $("#create-driver-form .parks-select").append(`<option value="${park.park_id}">${park.park_name}</option>`);
            }


        });
        $("#create-driver-form .parks-select").click(function () {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;

            if (valueSelected == "") {
                $("#create-driver-form  .routes-select").empty();
                $("#create-driver-form  .routes-select").append(`<option value="">Select park...</option>`)

            } else {
                $.get(`../../../graduation-api/api/read.php/park/${valueSelected}/routes`, function (data) {
                    //clear select
                    $("#create-driver-form  .routes-select").empty();
                    $("#create-driver-form  .routes-select").append(`<option value="">Select park...</option>`)

                    let routes = JSON.parse(data);
                    for (let x = 0; x < routes.data.length; x++) {
                        let route = routes.data[x];
                        $("#create-driver-form .routes-select").append(`<option value="${route.route_id}">${route.dest}</option>`);
                    }
                });
            }

        });
        $("#create-driver-form .routes-select").click(function () {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;

            if (valueSelected == "") {
                $("#create-driver-form  .taxis-select").empty();
                $("#create-driver-form  .taxis-select").append(`<option value="">Select taxi...</option>`)

            } else {
                $.get(`../../../graduation-api/api/read.php/route/${valueSelected}/taxis`, function (data) {
                    //clear select
                    $("#create-driver-form  .taxis-select").empty();
                    $("#create-driver-form  .taxis-select").append(`<option value="">Select taxi...</option>`)

                    let taxis = JSON.parse(data);
                    for (let x = 0; x < taxis.data.length; x++) {
                        let taxi = taxis.data[x];
                        $("#create-driver-form .taxis-select").append(`<option value="${taxi.taxi_id}">${taxi.brand+" "+taxi.car_year+" "+taxi.plate_no}</option>`);
                    }
                });
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

        $('#create-driver-form').submit(function (e) {
            e.preventDefault();

        }).validate({
            rules: {
                park_id: {
                    required: true,

                },
                route_id: {
                    required: true,

                },
                taxi_id: {
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
                    number: true
                    /*,
                                        remote: {
                                            url: "../../../graduation-api/api/create.php/operator/isIDAvailable",
                                            type: "post",
                                            data: {
                                                id: function () {
                                                    return $("#create-operator-form input[name=ID]").val();
                                                }
                                            }
                                        }*/
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
                    isEmail: true
                    /*,
                                        remote: {
                                            url: "../../../graduation-api/api/create.php/operator/isEmailAvailable",
                                            type: "post",
                                            data: {
                                                email: function () {
                                                    return $("#create-operator-form input[name=email]").val();
                                                }
                                            }
                                        }*/
                },
                phoneNO: {
                    required: true,
                    minlength: 10,
                    maxlength: 10,
                    number: true,
                    isPhone: true,
                    /*
                                        remote: {
                                            url: "../../../graduation-api/api/create.php/operator/isPhoneAvailable",
                                            type: "post",
                                            data: {
                                                phone: function () {
                                                    return $("#create-operator-form input[name=phoneNO]").val();
                                                }
                                            }
                                        }*/

                },
                pass: {
                    required: true,
                    minlength: 6,
                    maxlength: 25
                },
                CPass: {
                    required: true,
                    equalTo: '#create-driver-form input[name=pass]'
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
                        url: '../../../graduation-api/api/create.php/driver/add',
                        type: 'POST',
                        data: formData,
                        success: function (data) {
                            alert(data)
                        },
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
        $('#create-driver-form button[type=button]').click(function () {
            $('#create-driver-form').trigger("reset");
        });
    }
    //call create form validation
    setCreateDriverFormValidation();

    function readFromDataBase() {
        $('#drivers-table').DataTable();
        $.get("../../../graduation-api/api/read.php/drivers", function (data) {

            let drivers = JSON.parse(data);
            for (let x = 0; x < drivers.data.length; x++) {
                let driver = drivers.data[x];
                let editBTN = `<button id="${driver.user_id}-e" class="btn btn-success"><i class="fas fa-edit"></i></button>`;
                let deleteBTN = `<button id="${driver.user_id}-d" class="mx-1 btn btn-danger"><i class="fas fa-trash-alt"></i></button>`;
                let container = `<div class="d-flex">${editBTN} ${deleteBTN}</div>`
                if (driver.taxi == 'empty') {
                    $('#drivers-table').dataTable().fnAddData([
                        driver.FName + " " + driver.LName, driver.email, driver.ID, 'empty', 'empty', 'empty', 'empty',
                        container
                    ]);

                } else {
                    if (driver.taxi.route == 'empty')
                        $('#drivers-table').dataTable().fnAddData([
                            driver.FName + " " + driver.LName, driver.email, driver.ID, driver.taxi.brand, driver.taxi.plate_no, 'empty', 'empty',
                            container
                        ]);
                    else
                        $('#drivers-table').dataTable().fnAddData([
                            driver.FName + " " + driver.LName, driver.email, driver.ID, driver.taxi.brand, driver.taxi.plate_no, driver.taxi.route.park_name, driver.taxi.route.dest,
                            container
                        ]);
                }


                $(`#${driver.user_id}-e`).click(function () {

                    $("#editModel").modal('show');
                    setOperatorForm(operator);
                });
                $(`#${driver.user_id}-d`).click(function () {

                    $.ajax({
                            method: "DELETE",
                            url: `../../../graduation-api/api/delete.php/operator/${driver.user_id}`,

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
            $(".profile-form-photo").css("background-image", `url("../../../graduation-api/upload/operator/` + operator.imagePath);
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