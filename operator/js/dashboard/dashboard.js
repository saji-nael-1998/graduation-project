$(document).ready(function () {
    function fillWorkdayTable() {
        $('#workday-table').DataTable();
    }
    fillWorkdayTable();

    function fillParkTable() {
        $('#parks-table').DataTable();
        $.get("../../../graduation-api/api/read.php/parks", function (data) {
            let parks = JSON.parse(data);
            $("#parks-count").empty().append(parks.data.length);
            for (let x = 0; x < parks.data.length; x++) {
                let park = parks.data[x];
                let viewBTN = `<button id="${park.park_id}-v" class="btn btn-primary"><i class="fas fa-eye"></i></button>`;
                let container = `<div class="d-flex">${viewBTN}</div>`
                $('#parks-table').dataTable().fnAddData([
                    park.park_name, park.street + "," + park.city,
                    container
                ]);
                $(`#${park.park_id}-v`).click(function () {
                   alert(2)
                });
            }
        });
    }
    fillParkTable();
    //statistics section
    function setOperatorCount(){
        $.get("../../../graduation-api/api/read.php/operators", function (data) {
            let operators = JSON.parse(data);
            $("#operators-count").empty().append(operators.data.length);
        });
    }
    setOperatorCount();
    function setTaxiCount(){
        $.get("../../../graduation-api/api/read.php/taxis", function (data) {
            let taxis = JSON.parse(data);
            $("#taxis-count").empty().append(taxis.data.length);
        });
    }
    setTaxiCount();
    function setDriverCount(){
        $.get("../../../graduation-api/api/read.php/drivers", function (data) {
            let drivers = JSON.parse(data);
            $("#drivers-count").empty().append(drivers.data.length);
        });
    }
    setDriverCount();
});