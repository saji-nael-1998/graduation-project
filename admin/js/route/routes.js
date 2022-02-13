$(document).ready(function () {
    $('#routes-table').DataTable();
    $.get("../../../graduation-api/api/read.php/routes", function (data) {

        let routes = JSON.parse(data);
        for (let x = 0; x < routes.data.length; x++) {
            let route = routes.data[x];
            let editBTN = `<button id="${route.route_id}-e" class="btn btn-success"><i class="fas fa-edit"></i></button>`;
            let deleteBTN = `<button id="${route.route_id}-d" class="mx-1 btn btn-danger"><i class="fas fa-trash-alt"></i></button>`;
            let container = `<div class="d-flex">${editBTN} ${deleteBTN}</div>`
            $('#routes-table').dataTable().fnAddData([
                route.park_name, route.src, route.dest,
                container
            ]);

            $(`#${route.route_id}-e`).click(function () {
                displayRoute(route)

            });
            $(`#${route.route_id}-d`).click(function () {

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

    function displayRoute(route) {
        $("#choosen-route").modal('show');
        $("#choosen-route input[name=dest]").val(route.dest);
        $.get("../../../graduation-api/api/read.php/parks", function (data) {

            let parks = JSON.parse(data);

            $("#choosen-route .parks-select").empty();
            for (let x = 0; x < parks.data.length; x++) {
                let park = parks.data[x];
                //fill park select
                $("#choosen-route .parks-select").append(`<option value="${park.park_id}">${park.park_name}</option>`);
            }
            //set the park of route
            $("#choosen-route .parks-select").val(route.park_id)
        });
        $("#updateRoute").click(function () {
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
            $('#u-route-form').validate({
                rules: {
                    park_id:{
                        required: true
                    },
                    dest: {
                        required: true,
                        isText: true
                    }

                },
                messages: {


                },
                errorPlacement: function (error, element) {
                    error.insertAfter(element);
                },
                submitHandler: function (form) {


                    $.ajax({
                            method: "PUT",
                            url: `../../../graduation-api/api/update.php/route/${route.route_id}`,
                            data: {
                                "route": {
                                    "route_id": route.route_id,
                                    "park_id": $("#choosen-route .parks-select").val(),
                                    "dest": $("#choosen-route input[name=dest]").val()
                                }
                            }
                        })
                        .done(function (msg) {
                            location.reload();
                        });


                }

            });
        });


    }
    $.get("../../../graduation-api/api/read.php/parks", function (data) {

        let parks = JSON.parse(data);
        $("#parks-select").empty();
        for (let x = 0; x < parks.data.length; x++) {
            let park = parks.data[x];
            $("#parks-select").append(`<option value="${park.park_id}">${park.park_name}</option>`);
        }
    });
  
    $("#addRoute").click(function () {
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
        $('#route-form').validate({
            rules: {
                park_id:{
                    required: true
                },
                dest: {
                    required: true,
                    isText: true
                }

            },
            messages: {


            },
            errorPlacement: function (error, element) {
                error.insertAfter(element);
            },
            submitHandler: function (form) {



                $.post(`../../../graduation-api/api/create.php/park/${$("#parks-select").val()}/route/add`, {

                        "routes": [{

                            "dest": $("#dest").val()
                        }]
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