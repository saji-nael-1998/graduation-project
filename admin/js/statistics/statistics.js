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
    $('#parks-table').DataTable();
    $.get("../../../graduation-api/api/read.php/parks", function (data) {
        let parks = JSON.parse(data);
        for (let x = 0; x < parks.data.length; x++) {
            let park = parks.data[x];
            let viewBTN = `<button id="${park.park_id}-v" class="btn btn-primary"><i class="fas fa-eye"></i></button>`;
            //let deleteBTN = `<a href="../../../graduation-api/api/delete.php/park/27" class="mx-1 btn btn-danger" role="button"><i class="fas fa-trash-alt"></i></a>`;
            let container = `<div class="d-flex">${viewBTN} </div>`
            $('#parks-table').dataTable().fnAddData([
                park.park_name, park.street + "," + park.city,
                container
            ]);
            $(`#${park.park_id}-v`).click(function () {
                getData(park.park_id);
            });


        }
    });

    function getData(parkID) {
        $("#statistics_box").modal('show');
        $("#showStatistics").click(function () {
            let selectedDate = $("#selectedDate").val();
            if (selectedDate.length == 0) {
                $("#selectedDateError").append("you must select a date!");
            }else{
                const dbRef = ref(getDatabase());
                get(child(dbRef, `days/${selectedDate}/${parkID}`)).then((snapshot) => {
                 
                    if (snapshot.exists()) {
                        let json = snapshot.val();
                        json["parkID"]=parkID;
                        json["date"]=selectedDate;
                       sessionStorage.setItem("park",  JSON.stringify(json));
                       location.replace("statistics.html");
                    }else{
                        $("#selectedDateError").empty().append("no data!");
    
                    }
    
                }).catch((error) => {
                    console.error(error);
                });
    
            }
        });
    }
   
});