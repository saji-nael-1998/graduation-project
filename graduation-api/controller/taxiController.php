<?php
include_once("../config/dp.php");
include_once("../model/taxi.php");
include_once('../controller/routeController.php');
class TaxiController
{
    private $table = "taxi";
    private $conn;
    function __construct()
    {
        $DBConnection = new DBConnection();
        $this->conn = $DBConnection->connect();
    }

    public function create($taxi)
    {
        $sql = "INSERT INTO `$this->table`(`reqistration_date`, `brand`, `car_year`, `plate_no`,  `route_id`) VALUES ('{$taxi->getReqistrationDate()}','{$taxi->getBrand()}',{$taxi->getCarYear()},{$taxi->getPlateNO()},{$taxi->getRouteID()})";
        echo $sql;
        $statement = $this->conn->prepare($sql);
        $statement->execute();
    }
    public function read($taxiID)
    {
        $sql = $this->conn->prepare("SELECT * from $this->table  where record_status='active' and  taxi_id=$taxiID  ");
        $sql->execute();
        $data['taxi'] = $sql->fetch(PDO::FETCH_ASSOC);
        if (!empty($data['taxi'])) {
            $routeController = new RouteController();
            $route = $routeController->read($data['taxi']['route_id']);
            if (!empty($route))
                $data['taxi']['route'] = $route;
            else   $data['taxi']['route'] = 'empty';
        }

        return  $data['taxi'];
    }
    public function update($park)
    {
    }
    public function delete($parkID)
    {
        $sql = $this->conn->prepare("UPDATE $this->table set record_status='inactive' where park_id=$parkID");
        $sql->execute();
    }
    public function readAll()
    {
        $sql = $this->conn->prepare("SELECT plate_no , brand,car_year,reqistration_date, 'empty' as 'dest','empty' as 'park' FROM `taxi` WHERE route_id is null AND record_status ='active'
        UNION
        SELECT plate_no , brand,car_year,reqistration_date,r.dest as 'dest' ,p.park_name as 'park' FROM `taxi` t , `route` r , `park` p WHERE t.route_id is  not null AND t.record_status ='active' AND r.record_status ='active' and r.route_id=t.route_id and p.park_id=r.park_id and p.record_status='active'
        ");
        $sql->execute();
        $data['data'] = $sql->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    }
    public function readAvailableTaxis($routeID)
    {
        $sql = $this->conn->prepare("SELECT * FROM taxi WHERE  NOT EXISTS (SELECT * FROM driver WHERE driver.taxi_id=taxi.taxi_id) AND taxi.record_status='active' and taxi.route_id=$routeID
        UNION
        SELECT * FROM taxi WHERE  EXISTS (SELECT * FROM driver WHERE driver.taxi_id=taxi.taxi_id AND driver.record_status='inactive') AND taxi.record_status='active' and taxi.route_id=$routeID
        
        ");
        $sql->execute();
        $data['data'] = $sql->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    }
}
