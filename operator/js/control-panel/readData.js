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


function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}



const operator = JSON.parse(sessionStorage.getItem("operator"));



var table = $('#requests-table').DataTable();


function setParkInfo() {

    $.get(`../../../graduation-api/api/read.php/park/${operator.park_id}`, function (data) {

        let park = JSON.parse(data);
        park = park.data;
        $("#park-name").empty().append(park.park_name);
        $("#park-loc").empty().append(park.street + "," + park.city);
        $("#park-date").empty().append(getCurrentDate());
        /* $("#park-start-time").empty().append(park.workday.startTime);*/
    });

}
setParkInfo();

function setStatisticsInfo() {

    const driverShiftRef = ref(db, `days/${getCurrentDate()}/${operator.park_id}/`);
    onValue(driverShiftRef, (snapshot) => {

        if (snapshot.exists()) {
            let json = snapshot.val();

            if (json.drivers != undefined && Object.keys(json.drivers).length != 0) {
                $("#drivers-count").empty().append(Object.keys(json.drivers).length);
                $("#taxis-count").empty().append(Object.keys(json.drivers).length);
            } else {
                $("#drivers-count").empty().append(0);
                $("#taxis-count").empty().append(0);
            }
            if (json.routes != undefined && Object.keys(json.routes).length != 0) {
                $("#routes-count").empty().append(Object.keys(json.routes).length);

            }
            if (json.operators != undefined && Object.keys(json.operators).length != 0) {
                $("#operators-count").empty().append(Object.keys(json.operators).length);

            }

        }
    });

}
setStatisticsInfo();

var table = $('#requests-table').DataTable();

//requests
function setRequestTable() {


    const driverShiftRef = ref(db, `days/${getCurrentDate()}/${operator.park_id}/requests/`);
    onValue(driverShiftRef, (snapshot) => {

        table
            .clear()
            .draw();
        if (snapshot.exists()) {

            let requests = snapshot.val();
            for (let request in requests) {
                if (requests[request].requestStatus != 'pending')
                    continue;
                //read request title 
                if (requests[request].requestTitle == 'start shift') {
                    setStartWorkdayRequest(request, requests[request])
                } //read request title 
                if (requests[request].requestTitle == 'add to list') {
                    setAddToListRequest(request, requests[request])
                }
                if (requests[request].requestTitle == 'end shift') {

                    setEndWorkDayRequest(request, requests[request]);
                }

            }

        }
    });
}
setRequestTable();

function setStartWorkdayRequest(userID, request) {

    $.get(`../../../graduation-api/api/read.php/driver`, {
        userID: userID
    }, function (result) {
        //get data
        let data = JSON.parse(result);
        let driver = data.driver;
        let acceptBTN = `<button id="${userID}-t" class="btn btn-success"><i class="fas fa-check"></i></button>`;
        let rejectBTN = `<button id="${userID}-f" class="mx-1 btn btn-danger"><i class="fas fa-times"></i>        </button>`;

        let container = `<div class="d-flex">${acceptBTN}${rejectBTN}</div>`
        $('#requests-table').dataTable().fnAddData([
            driver.FName + " " + driver.LName, driver.taxi.route.dest, request.requestTitle, request.requestTime,
            container
        ]);
        $(`#${userID}-t`).click(function () {
            //get current time
            let currentTime = new Date().toLocaleTimeString();

            let workday = {
                "userID": userID,
                "parkID": operator.park_id,
                "workdayDate": getCurrentDate(),
                "workdayStart": currentTime,


            }
            $.ajax({
                method: "POST",
                url: '../../../graduation-api/api/create.php/workday/add',
                data: workday,
                success: function (data) {
                    console.log(data)
                }

            });



            //add to driver list 
            update(ref(db, `days/${getCurrentDate()}/${operator.park_id}/drivers/${userID}/`), {
                userID: userID,
                name: driver.FName + " " + driver.LName,
                taxi: driver.taxi.plate_no,
                route: driver.taxi.route.dest,
                routeID: driver.taxi.route.route_id,

                startTime: currentTime,
                imagePath: driver.imagePath,
                status: 'active'
            });
            //change request responed
            update(ref(db, `days/${getCurrentDate()}/${operator.park_id}/requests/${userID}/`), {
                requestStatus: "approved"
            });

        });
        $(`#${userID}-f`).click(function () {

        });
    });
}

//driver card 
function setAddToListRequest(userID, request) {

    $.get(`../../../graduation-api/api/read.php/driver`, {
        userID: userID
    }, function (result) {
        //get data
        let data = JSON.parse(result);
        let driver = data.driver;
        let acceptBTN = `<button id="${userID}-t" class="btn btn-success"><i class="fas fa-check"></i></button>`;
        let rejectBTN = `<button id="${userID}-f" class="mx-1 btn btn-danger"><i class="fas fa-times"></i>        </button>`;

        let container = `<div class="d-flex">${acceptBTN}${rejectBTN}</div>`
        $('#requests-table').dataTable().fnAddData([
            driver.FName + " " + driver.LName, driver.taxi.route.dest, request.requestTitle, request.requestTime,
            container
        ]);
        $(`#${userID}-t`).click(function () {
            let d = {
                name: driver.FName + " " + driver.LName,
                "imagePath": driver.imagePath,
                userID: userID,
                "taxi": driver.taxi.plate_no,
                "route": driver.taxi.route.dest
            }

            //change request responed
            let currentTime = new Date().toLocaleTimeString();
            update(ref(db, `days/${getCurrentDate()}/${operator.park_id}/routes/${driver.taxi.route.route_id}/drivers/`), {
                [userID]: {
                    "approvedTime": currentTime,
                    "requestTime": request.requestTime
                }
            });
            //remove request
            remove(ref(db, `days/${getCurrentDate()}/${operator.park_id}/requests/${userID}`));
        });
        $(`#${userID}-f`).click(function () {

        });
    });
}

function setEndWorkDayRequest(userID, request) {

    $.get(`../../../graduation-api/api/read.php/driver`, {
        userID: userID
    }, function (result) {
        //get data
        let data = JSON.parse(result);
        let driver = data.driver;
        let acceptBTN = `<button id="${userID}-tw" class="btn btn-success"><i class="fas fa-check"></i></button>`;
        let rejectBTN = `<button id="${userID}-fw" class="mx-1 btn btn-danger"><i class="fas fa-times"></i>        </button>`;

        let container = `<div class="d-flex">${acceptBTN}${rejectBTN}</div>`
        $('#requests-table').dataTable().fnAddData([
            driver.FName + " " + driver.LName, driver.taxi.route.dest, request.requestTitle, request.requestTime,
            container
        ]);
        $(`#${userID}-tw`).click(function () {



            const dbRef = ref(getDatabase());

            let currentTime = new Date().toLocaleTimeString();

            $.ajax({
                method: "PUT",
                url: '../../../graduation-api/api/update.php/workday/driver',
                data: {
                    workdayEnd: currentTime,
                    userID: userID,
                    date: getCurrentDate()
                }

            });
            //change request responed
            update(ref(db, `days/${getCurrentDate()}/${operator.park_id}/drivers/${userID}`), {
                status: "inactive",
                workdayEnd: currentTime
            });
            //remove request
            remove(ref(db, `days/${getCurrentDate()}/${operator.park_id}/requests/${userID}`));


        });
        $(`#${userID}-fw`).click(function () {

        });
    });
}

//drivers
function setDriverList() {
    const driverShiftRef = ref(db, `days/${getCurrentDate()}/${operator.park_id}/drivers/`);
    onValue(driverShiftRef, (snapshot) => {
        $("#drivers").empty();

        //fill driver list
        if (snapshot.exists()) {
            let drivers = snapshot.val();
            for (let driver in drivers) {
                if (!$(`#driver driver-list-${driver}`).length) {
                    $("#drivers").append(driverTemplate(drivers[driver]));
                }
            }
        }
    });
}

function driverTemplate(driver) {
    let template = `
    <div id="driver-list-${driver.userID}" style="background-color:#424040" class="d-flex px-2 driver-card">
        <div><img class="driver-img" src="../../../graduation-api/upload/driver/${driver.imagePath}" width="100"/></div>

        <div class="d-flex flex-column px-2">
                 <span class="driver-name">${driver.name}</span>
                 <span class="driver-taxi">${driver.taxi}</span>
                 <span class="driver-taxi">${driver.route}</span>
        </div>
    </div>
    `;
    $(`d-${driver.userID}`).css("background-image", `url("../../../graduation-api/upload/driver/${driver.userID}")`)
    return template;
}

function driverListTemplate2(driver) {
    let template = `
    
    <div id="route-in-out-${driver.userID}"  class="d-flex flex-column px-2 driver-card">
        <div class="d-flex ">
        <div><img class="driver-img" src="../../../graduation-api/upload/driver/${driver.imagePath}" width="100"/></div>
        <div class="d-flex flex-column px-2">
                    <div class="d-flex flex-column px-2">
                        <span class="driver-name">${driver.name}</span>
                        <span class="driver-taxi">${driver.taxi}</span>
                        

                    </div>
                    
                    
            </div>
        </div>
        
    </div>
    `;

    return template;
}



setDriverList();
//route
function setRouteList() {

    const dbRef = ref(getDatabase());

    get(child(dbRef, `days/${getCurrentDate()}/${operator.park_id}/routes`)).then((snapshot) => {
        $("#routes").empty();
        //fill driver list
        if (snapshot.exists()) {
            let routes = snapshot.val();
            for (let route in routes) {
                $("#routes").append(radioButtonTemplate(routes[route].route, route));
            }
            let radio = $('input[name="route"]'),
                choice = '';

            radio.change(function (e) {
                var selValue = $('input[name=route]:checked').val();

                setLists(selValue)
                setInOrOutList(selValue);
            });
        }
    }).catch((error) => {
        console.error(error);
    });


}

setRouteList();

function setLists(routeID) {

    const driverShiftRef = ref(db, `days/${getCurrentDate()}/${operator.park_id}/routes/${routeID}/drivers`);
    onValue(driverShiftRef, (snapshot) => {
        $("#drivers-list").empty();
        if (snapshot.exists()) {

            let json = snapshot.val();
            let requests = [];
            for (let d in json) {
                let driverRequest = {
                    userID: d,
                    requestTime: json[d].approvedTime
                }
                requests.push(driverRequest);

            }

            requests.sort(function (a, b) {
                return a.requestTime.localeCompare(b.requestTime);
            });
            for (let request in requests) {
                let userID = requests[request].userID;
                const dbRef = ref(getDatabase());
                get(child(dbRef, `days/${getCurrentDate()}/${operator.park_id}/drivers/${userID}`)).then((snapshot) => {

                    let json = snapshot.val();
                    let driver = {
                        userID: json.userID,
                        taxi: json.taxi,
                        name: json.name,

                        imagePath: json.imagePath
                    }
                    if (!$(`#route-driver-list-${json.userID}`).length) {
                        $("#drivers-list").append(driverListTemplate(driver));
                    }

                    $(`#tT-${driver.userID}`).click(function () {
                        get(child(dbRef, `days/${getCurrentDate()}/${operator.park_id}/drivers/${driver.userID}`)).then((snapshot) => {
                            //fill driver list
                            if (snapshot.exists()) {
                                let json = snapshot.val();
                                let currentTime = new Date().toLocaleTimeString();
                                update(ref(db, `days/${getCurrentDate()}/${operator.park_id}/trips/${routeID}/${driver.userID}`), {

                                    "start": currentTime,
                                    "inPark": "yes",
                                    "dest": json.route,
                                    "currentDest": json.route,
                                    "currentRider": 0,
                                    "totalRider": 0
                                });
                            }
                        }).catch((error) => {
                            console.error(error);
                        });

                        //remove request
                        remove(ref(db, `days/${getCurrentDate()}/${operator.park_id}/routes/${routeID}/drivers/${driver.userID}`));
                    });
                    $(`#tF-${driver.userID}`).click(function () {

                    });
                }).catch((error) => {
                    console.error(error);
                });
            }


        }
    });

}

function setInOrOutList(routeID) {
    $("#in-list").empty();
    $("#out-list").empty();

    const driverShiftRef = ref(db, `days/${getCurrentDate()}/${operator.park_id}/trips/${routeID}/`);
    onValue(driverShiftRef, (snapshot) => {

        if (snapshot.exists()) {
            let inList = [];
            let outList = [];
            let json = snapshot.val();
            for (let d in json) {

                let trip = json[d];
                const dbRef = ref(getDatabase());
                get(child(dbRef, `days/${getCurrentDate()}/${operator.park_id}/drivers/${d}`)).then((snapshot) => {

                    let json = snapshot.val();
                    let driver = {
                        userID: json.userID,
                        taxi: json.taxi,
                        name: json.name,
                        imagePath: json.imagePath
                    }

                    if (trip.inPark == 'yes') {
                        inList.push(driver);
                    } else {
                        outList.push(driver);


                    }

                    if (inList.length == 0) {
                        $("#in-list").children().addClass("d-none");
                    } else {
                        $("#in-list").children().addClass("d-none");

                        for (let d in inList) {
                            let driver = inList[d];
                            if (document.getElementById(`route-in-out-${driver.userID}`)) {
                                $(`#in-list #route-in-out-${driver.userID}`).removeClass("d-none");
                            } else {
                                $("#in-list").append(driverListTemplate2(driver));
                            }

                        }

                    }

                    if (outList.length == 0) {

                        $("#out-list").children().addClass("d-none");
                    } else {
                        $("#out-list").children().addClass("d-none");
                        for (let d in outList) {
                            let driver = outList[d];
                            if (!$(`#out-list #route-in-out-${driver.userID}`).length) {
                                $("#out-list").append(driverListTemplate2(driver));
                            } else {
                                $(`#out-list #route-in-out-${driver.userID}`).removeClass("d-none");
                            }
                        }

                    }


                }).catch((error) => {
                    console.error(error);
                });
            }
        } else {
            $("#in-list").children().addClass("d-none");


        }
    });

}

function radioButtonTemplate(route, routeID) {
    let template = `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="route"  value="${routeID}">
                        <label class="form-check-label" for="route">
                        ${route}
                        </label>
                    </div>
    `;
    return template;
}

function driverListTemplate(driver) {
    let template = `
    
    <div id="route-driver-list-${driver.userID}" class="d-flex flex-column px-2 driver-card">
        <div class="d-flex ">
            <div><img class="driver-img" src="../../../graduation-api/upload/driver/${driver.imagePath}" width="100"/></div>
            <div class="d-flex flex-column px-2">
                    <div class="d-flex flex-column px-2">
                        <span class="driver-name">${driver.name}</span>
                        <span class="driver-taxi">${driver.taxi}</span>
                     
                    </div>
                    
                    
            </div>
        </div>
        <div class="d-flex justify-content-end my-1 py-1">
            <button id="tT-${driver.userID}" style="height:30px" class="btn btn-success p-0 px-3 mx-1">start</button>
            <button id="tF-${driver.userID}" style="height:30px" class="btn btn-danger p-0 px-3">cancel</button>

        </div>
    </div>
    `;

    return template;
}

function endWorkday() {
    const dbRef = ref(getDatabase());

    get(child(dbRef, `days/${getCurrentDate()}/${operator.park_id}/`)).then((snapshot) => {

        let json = snapshot.val();
        let flag = true;


        if (json.trips != undefined) {
            flag = false;
        }
        for (let r in json.routes) {
            let route = json.routes[r];
            if (route.drivers != undefined) {
                flag = false;
                break;
            }
        }
        if (flag) {
            let currentTime = new Date().toLocaleTimeString();
            update(ref(db, `days/${getCurrentDate()}/${operator.park_id}/operators/${operator.user_id}`), {

                "endShiftTime": currentTime,
               
               "status":"inactive"
            });
            update(ref(db, `days/${getCurrentDate()}/${operator.park_id}/workday`), {

                "endTime": currentTime,
               
               "status":"inactive"
            });
        } else {
            alert("there is some operation still processing")
        }



    });



}
$("#endWorkDayBTN").click(endWorkday);