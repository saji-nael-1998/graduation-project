import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
    getDatabase,
    onValue,
    ref,
    set,
    get,
    child,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcgd7L-Qi_r8sMGu-C_r-VpRWhFQkkPv4",
    authDomain: "final-project-533d7.firebaseapp.com",
    projectId: "final-project-533d7",
    storageBucket: "final-project-533d7.appspot.com",
    messagingSenderId: "666735050862",
    appId: "1:666735050862:web:637053cdd421a6771ba67f"
};
const app = initializeApp(firebaseConfig);

const db = getDatabase();

$(document).ready(function () {



    function fillWorkdayTable() {
        $('#workday-table').DataTable({
            lengthMenu: [5]
        });
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
    function setOperatorCount() {
        $.get("../../../graduation-api/api/read.php/operators", function (data) {
            let operators = JSON.parse(data);
            $("#operators-count").empty().append(operators.data.length);
        });
    }
    setOperatorCount();

    function setTaxiCount() {
        $.get("../../../graduation-api/api/read.php/taxis", function (data) {
            let taxis = JSON.parse(data);
            $("#taxis-count").empty().append(taxis.data.length);
        });
    }
    setTaxiCount();

    function setDriverCount() {
        $.get("../../../graduation-api/api/read.php/drivers", function (data) {
            let drivers = JSON.parse(data);
            $("#drivers-count").empty().append(drivers.data.length);
        });
    }
    setDriverCount();
    //set workday table
    function workdayTable() {
        const driverShiftRef = ref(db, `days/${getCurrentDate()}/`);
        onValue(driverShiftRef, (snapshot) => {
            $('#workday-table')
            .clear()
            .draw();
            if (snapshot.exists()) {

                let json = snapshot.val();

                for (let park in json) {
                    $.get("../../../graduation-api/api/read.php/park/" + park, function (data) {
                        let park = JSON.parse(data);

                        park = park.data;
                        let viewBTN = `<button id="${park.park_id}-wv" class="btn btn-primary"><i class="fas fa-eye"></i></button>`;
                        let container = `<div class="d-flex">${viewBTN}</div>`
                        $('#workday-table').dataTable().fnAddData([
                            park.park_name, park.street + "," + park.city,
                            container
                        ]);
                        $(`#${park.park_id}-wv`).click(function () {
                           alert(2)
                        });

                    });
                }
            }
        });
    }
    workdayTable();

    function getCurrentDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }

});