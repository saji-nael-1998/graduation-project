$(document).ready(function () {
    $('#taxis-table').DataTable();
    //get current date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    //set current date

    $("#reqistration_date").attr("min", today);
    $.get("../../../graduation-api/api/read.php/taxis", function (data) {
        let taxis = JSON.parse(data);
        for (let x = 0; x < taxis.data.length; x++) {
            let taxi = taxis.data[x];

            let editBTN = `<button id="${taxi.taxi_id}-e" class="btn btn-success"><i class="fas fa-edit"></i></button>`;
            let deleteBTN = `<button id="${taxi.taxi_id}-d" class="mx-1 btn btn-danger"><i class="fas fa-trash-alt"></i></button>`;
            let container = `<div class="d-flex">${editBTN} ${deleteBTN}</div>`
            $('#taxis-table').dataTable().fnAddData([
                taxi.plate_no,
                taxi.brand,
                taxi.car_year,
                taxi.reqistration_date, taxi.park,
                taxi.dest,
                container
            ]);
            $(`#${taxi.taxi_id}-d`).click(function () {
                $.ajax({
                        method: "DELETE",
                        url: `../../../graduation-api/api/delete.php/route/${route.route_id}`,

                    })
                    .done(function (msg) {
                        location.reload();
                    });
            });
        }
    });
    //get all parks
    $.get("../../../graduation-api/api/read.php/parks", function (data) {

        let parks = JSON.parse(data);
        $("#parks-select").append(`<option value="">Select park...</option>`)
        for (let x = 0; x < parks.data.length; x++) {
            let park = parks.data[x];
            $("#parks-select").append(`<option value="${park.park_id}" selected>${park.park_name}</option>`);
        }
        //make the first option selected
        $("#parks-select").val($("#parks-select option:first").val());

    });
    $("#parks-select").click(function () {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        if (valueSelected == "") {
            $("#routes-select").empty();
        } else {
            $.get(`../../../graduation-api/api/read.php/park/${valueSelected}/routes`, function (data) {
                //clear select
                $("#routes-select").empty();
                let routes = JSON.parse(data);
                for (let x = 0; x < routes.data.length; x++) {
                    let route = routes.data[x];
                    $("#routes-select").append(`<option value="${route.route_id}">${route.dest}</option>`);
                }
            });
        }

    });

    //set submit rule
    $("#addTaxi").click(function () {
        function isText(inputtxt) {
            if (/^[a-zA-Z ]*$/g.test(inputtxt)) {
                return true;
            } else {
                return false;
            }
        }

        jQuery.validator.addMethod("isText", function (value, element) {
            return isText(value);
        }, "input must be letters only!!");
        $('#taxi-form').validate({
            rules: {

                "parks-select": {
                    required: true,

                },
                "routes-select": {
                    required: true

                },
                plate_no: {
                    required: true,
                    minlength: 7,
                    maxlength: 7,
                    number: true
                },
                brand: {
                    required: true,
                    isText: true
                },
                car_year: {
                    required: true,

                },
                reqistration_date: {
                    required: true,

                }

            },
            messages: {


            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            submitHandler: function (form) {

                let taxi = {
                    "route_id": $("#routes-select").val(),
                    "brand": $("#brand").val(),
                    "plate_no": $("#plate_no").val(),
                    "car_year": $("#car_year").val(),
                    "reqistration_date": $("#reqistration_date").val(),



                }

                $.post(`../../../graduation-api/api/create.php/route/${taxi.route_id}/taxi/add`, {

                        "taxi": taxi
                    }).done(function (data) {
                        location.reload();
                    })
                    .fail(function () {
                        alert("error");
                    });

            }

        });
    });

});