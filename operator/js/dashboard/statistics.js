$.get("../../controller/ParkController.php?f=getDashBoardStatistic&parkID=1", function (data) {

  let dataCount=JSON.parse(data)
  $("#operator-count").empty();
  $("#operator-count").append(dataCount.operatorCount);

  $("#route-count").empty();
  $("#route-count").append(dataCount.routeCount);

  $("#taxi-count").empty();
  $("#taxi-count").append(dataCount.taxiCount);
  
});