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
    const obj = JSON.parse(sessionStorage.getItem("operator"));

    function fillWorkdayTable() {
        $('#workday-table').DataTable();
        /* let viewBTN = `<button id="${taxi.user_id}-dv" class="btn btn-primary"><i class="fas fa-eye"></i></button>`;
         let container = `<div class="d-flex">${viewBTN}</div>`
         $('#drivers-table').dataTable().fnAddData([
             taxi.name, taxi.taxi,taxi.route,
             container
         ]);*/
        const dbRef = ref(getDatabase());
        let park_id = obj.park_id;
        get(child(dbRef, `days/`)).then((snapshot) => {
            if (snapshot.exists()) {
                let json = snapshot.val();
                for (let d in json) {
                    for (let p in json[d]) {
                        if (p == park_id) {
                            let workday = json[d][p].workday;
                            let viewBTN = `<button id="${d}-${p}-v" class="btn btn-primary"><i class="fas fa-eye"></i></button>`;
                            let container = `<div class="d-flex">${viewBTN}</div>`
                            if(workday.endTime==undefined)
                            $('#workday-table').dataTable().fnAddData([
                                d, workday.startTime, "still working",
                                container
                            ]);
                            else
                            $('#workday-table').dataTable().fnAddData([
                                d, workday.startTime, workday.endTime,
                                container
                            ]);


                            $(`#${d}-${p}-v`).click(function () {
                                let pa=json[d][p];
                                pa["parkID"] = p;
                                pa["date"] = d;
                                sessionStorage.setItem("park", JSON.stringify(pa));
                                location.replace("../statistics/statistics.html");
                            });
                        }
                    }
                }
            }

        }).catch((error) => {
            console.error(error);
        });
    }
    fillWorkdayTable();

    function fillDriverTable() {

        $('#drivers-table').DataTable();
        $.get(`../../../graduation-api/api/read.php/park/${obj.park_id}/taxis`, function (data) {
            let parkTaxis = JSON.parse(data);

            if (parkTaxis.data.process != 'failed') {
                for (let x = 0; x < parkTaxis.data.taxis.length; x++) {
                    let taxi = parkTaxis.data.taxis[x];
                    let viewBTN = `<button id="${taxi.user_id}-dv" class="btn btn-primary"><i class="fas fa-eye"></i></button>`;
                    let container = `<div class="d-flex">${viewBTN}</div>`
                    $('#drivers-table').dataTable().fnAddData([
                        taxi.name, taxi.taxi, taxi.route,
                        container
                    ]);
                    $(`#${taxi.user_id}-dv`).click(function () {
                        $("#editModel").modal('show');

                        setOperatorForm(taxi)
                    });
                }
            }

        });
    }

    function setOperatorForm(operator) {
        $.get("../../../graduation-api/api/read.php/driver", {
            userID: operator.user_id
        }, function (data) {

            let parks = JSON.parse(data);

            for (let key in parks.driver) {
                $(`#update-operator-form input[name=${key}]`).val(parks.driver[key]);
                if (key === "pass") {
                    $(`#update-operator-form input[name=CPass]`).val(parks.driver[key]);
                }
            }
            //set photo
            $(".profile-form-photo").css("background-image", `url("../../../graduation-api/upload/driver/` + parks.driver.imagePath);
        });

    }
    fillDriverTable();
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

    function setRoutesCount() {
        $.get(`../../../graduation-api/api/read.php/park/${obj.park_id}/routes`, function (data) {
            let routes = JSON.parse(data);
            $("#routes-count").empty().append(routes.data.length);
        });
    }
    setRoutesCount();
});