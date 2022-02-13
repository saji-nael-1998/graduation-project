$(document).ready(function () {
    $('#parks-table').DataTable();
    $.get("../../../graduation-api/api/read.php/parks", function (data) {
        let parks = JSON.parse(data);
        for (let x = 0; x < parks.data.length; x++) {
            let park = parks.data[x];
            let editBTN = `<button id="${park.park_id}-e" class="btn btn-success"><i class="fas fa-edit"></i></button>`;
            let deleteBTN = `<button id="${park.park_id}-d" class="mx-1 btn btn-danger"><i class="fas fa-trash-alt"></i></button>`;
            //let deleteBTN = `<a href="../../../graduation-api/api/delete.php/park/27" class="mx-1 btn btn-danger" role="button"><i class="fas fa-trash-alt"></i></a>`;
            let container = `<div class="d-flex">${editBTN} ${deleteBTN}</div>`
            $('#parks-table').dataTable().fnAddData([
                park.park_name, park.street + "," + park.city,
                container
            ]);
            $(`#${park.park_id}-d`).click(function () {
                $.ajax({
                        method: "DELETE",
                        url: `../../../graduation-api/api/delete.php/park/${park.park_id}`,

                    })
                    .done(function (msg) {
                        location.reload();
                    });
            });
        }
    });
    $("#addPark").click(function () {
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
        $('#park-form').validate({
            rules: {
                park_name: {
                    required: true,
                    isText: true
                },
                city: {
                    required: true,
                    isText: true
                },
                street: {
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
                let park = {
                    "park_name": $("#park_name").val(),
                    "street": $("#street").val(),
                    "city": $("#city").val()
                };

                $.post("../../../graduation-api/api/create.php/park/add", {

                        "park": park


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