const obj = JSON.parse(sessionStorage.getItem("operator"));

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


function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}


$("#start").click(function () {
   
    //check if today is Registered
    isDayRegistered();
});


//checking day 
function isDayRegistered() {
    let today = getCurrentDate();
    const dbRef = ref(getDatabase());
    let park_id = obj.park_id;
    get(child(dbRef, `days/${today}/${park_id}`)).then((snapshot) => {
        if (snapshot.exists()) {
            let park = snapshot.val();
            if (checkParkStatus(park)) {
                if (checkOperatorStatus(park)) {
                    registerOperator(today, park_id);
                }else{
                    alert('there is an active operator')
                }
            } else {
                alert('park is inactive')
            }
        } else {
            registerPark(today, park_id)
        }
    }).catch((error) => {
        console.error(error);
    });
}

function registerPark(today, parkID) {
    let currentTime = new Date().toLocaleTimeString();


    $.get(`../../../graduation-api/api/read.php/park/${parkID}/routes`, function (data) {

        //register park
        update(ref(db, `days/${today}/${parkID}/`), {
            "workday": {
                "startTime": `${currentTime}`,
                "status": 'active'
            }
        });
        registerOperator(today, parkID);
        let routes = JSON.parse(data);
        if (routes.data.length != 0) {

            for (let counter = 0; counter < routes.data.length; counter++) {
                let route = routes.data[counter];
                registerRoute(today, parkID, route);
            }

        }
        //redirect to control panel
        location.replace("../park-control-panel/index.html");
    });


}

function registerRoute(today, parkID, route) {

    //register park
    update(ref(db, `days/${today}/${parkID}/routes/${route.route_id}`), {
        "routeID": `${route.route_id}`,
        "route": `${route.dest}`
    });


}

function registerOperator(today, parkID) {
    let operator = obj.user_id;
    let currentTime = new Date().toLocaleTimeString();

    //register park
    update(ref(db, `days/${today}/${parkID}/operators/${operator}`), {

        "id": `${operator}`,
        "name": obj.FName + " " + obj.LName,
        "startShiftTime": `${currentTime}`,
        "status": "active"

    });


}

function checkParkStatus(park) {

    if (park.workday.status == 'active') {
        return true;
    } else {
        alert('park is inactive');
    }

}

function checkOperatorStatus(park) {
    let operators = park.operators;
    let operator = obj.user_id;
    let flag = true;
    for (let operator in operators) {
       
        if (operators[operator].id == operator) {
            flag = false;
            if (operators[operator].status == 'active') {
                //redirect to control panel
                location.replace("../park-control-panel/index.html");
                
            } else {
                alert('you are inactive')
            }
        } else {
            if (operators[operator].status == 'active') {
              
                flag = false;
            }
        }

    }

    return flag;


}
function driversTable(){
    
}




/*
function getDayName(dateStr) {
    var date = new Date(dateStr);
    return date.getDay();
}

function getDays() {
    let data = [];


    const dbRef = ref(getDatabase());
    get(child(dbRef, `days/`)).then((snapshot) => {
        if (snapshot.exists()) {
            const days = snapshot.val();


            for (var p in days) {
                const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


                for (var k in days[p]) {


                    if (k === obj.park_name) {
                        let dayOfWeek = getDayName(p);
                        dayOfWeek = weekday[dayOfWeek];
                        let day = {
                            "date": `${p}`,
                            "day": `${dayOfWeek}`,
                            "status": `${days[p][k].status}`
                        }
                        data.push(day)

                    }

                }
            }
            data.sort(function (a, b) {
                return b.date.localeCompare(a.date);
            });
            setTable(data);
        }
    }).catch((error) => {
        console.error(error);
    });
    /*data.push(a)
    setTable(data);*/