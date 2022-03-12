let parkData = JSON.parse(sessionStorage.getItem("park"));
//set park information 
function setParkInfo() {

    $.get(`../../../graduation-api/api/read.php/park/${parkData.parkID}`, function (data) {

        let park = JSON.parse(data);
        park = park.data;
        $("#park-name").empty().append(park.park_name);
        $("#park-loc").empty().append(park.street + "," + park.city);
        $("#park-date").empty().append(parkData.date);
        $("#park-start-time").empty().append(parkData.workday.startTime);
        if (parkData.workday.endTime == undefined) {
            $("#park-end-time").empty().append("still working");

        }else{
            $("#park-end-time").empty().append(parkData.workday.endTime);
 
        }
    });

    $("#routes-count").empty().append(Object.keys(parkData.routes).length);
    $("#drivers-count").empty().append(Object.keys(parkData.drivers).length);
    $("#taxis-count").empty().append(Object.keys(parkData.drivers).length);

}
setParkInfo();

function setDriverTable() {
    $('#drivers-table').DataTable({

    });
    for (let d in parkData.drivers) {
        let driver = parkData.drivers[d];
        if (driver.workdayEnd == undefined) {
            $('#drivers-table').dataTable().fnAddData([
                driver.name, driver.route, driver.taxi, driver.startTime, "still working"



            ]);

        } else {
            $('#drivers-table').dataTable().fnAddData([
                driver.name, driver.route, driver.taxi, driver.startTime, driver.workdayEnd
            ]);
        }

    }

}
setDriverTable();

function setOperatorTable() {
    $('#operator-table').DataTable({
        lengthMenu: [5]
    });
    for (let p in parkData.operators) {
        let operator = parkData.operators[p];
        if (operator.endShiftTime == undefined) {
            $('#operator-table').dataTable().fnAddData([
                operator.name, operator.startShiftTime, "still working"


            ]);
        } else {
            $('#operator-table').dataTable().fnAddData([
                operator.name, operator.startShiftTime, operator.endShiftTime
            ]);
        }

    }

}
setOperatorTable();

function setTripTable() {
    $('#trips-table').DataTable({
        lengthMenu: [5]
    });
    let routes = [];
    for (let r in parkData.routes) {
      let  route = {
            "routeID": r,
            "route": parkData.routes[r].route,
            "totalTrip": 0
            ,
            "totalRider":0
        }
        routes[r]=route;
    }
    for (let r in parkData.recentTrips) {
        let routeTrip = parkData.recentTrips[r];
        let tripCounter = 0;
        let riderCounter=0;
        for (let d in routeTrip) {
            let driver = parkData.drivers[d];

            for (let t in routeTrip[d]) {
                let trip = routeTrip[d][t];
                $('#trips-table').dataTable().fnAddData([
                    driver.name, driver.route, driver.taxi, trip.startTime, trip.endTime, trip.totalRider


                ]);
                riderCounter+=parseInt(trip.totalRider);
                tripCounter++;

            }
        }
        routes[r].totalTrip=tripCounter;
        routes[r].totalRider=riderCounter;


    }
    for(let route in routes){
        setRouteLabel(routes[route])

    }

}

setTripTable();

function setRouteLabel(route) {
    let template1 = ` <li style="background-color:#242424 ; color: white;" class="list-group-item d-flex justify-content-between align-items-center">
   ${route.route}
    <span class="badge badge-primary badge-pill">${route.totalTrip}</span>
  </li>`;
    $("#routes-details").append(template1);

    let template2 = ` <li style="background-color:#242424 ; color: white;" class="list-group-item d-flex justify-content-between align-items-center">
    ${route.route}
     <span class="badge badge-primary badge-pill">${route.totalRider}</span>
   </li>`;
     $("#routes-total-rider-details").append(template2);
}