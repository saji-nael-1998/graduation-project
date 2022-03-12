<?php
include_once("../config/dp.php");
include_once("../model/park.php");
class ParkController
{
    private $table = "park";
    private $conn;
    function __construct()
    {
        $DBConnection = new DBConnection();
        $this->conn = $DBConnection->connect();
    }

    public function create($park)
    {
        $sql = "INSERT INTO `$this->table`(park_name,street,city) VALUES('{$park->getParkName()}','{$park->getParkStreet()}','{$park->getParkCity()}')";
        $statement = $this->conn->prepare($sql);
        $statement->execute();
    }
    public function read($parkID)
    {
        $sql = $this->conn->prepare("SELECT * from $this->table where record_status='active' AND park_id=$parkID ");
        $sql->execute();
        $data['data'] = $sql->fetch(PDO::FETCH_ASSOC);
        echo json_encode($data);
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
        $sql = $this->conn->prepare("SELECT * from $this->table where record_status='active'");

        $sql->execute();
        $data['data'] = $sql->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    }
    public function readParkRoutes($parkID)
    {
        $sql = $this->conn->prepare("SELECT r.route_id , r.dest from $this->table p , `route` r where p.record_status='active' and r.record_status='active'  AND p.park_id=r.park_id and p.park_id=$parkID ");
        $sql->execute();
        $data['data'] = $sql->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    }
    public function readParkTaxis($parkID)
    {
        $sql = $this->conn->prepare("SELECT user.user_id,CONCAT(user.FName, ' ', user.LName) AS name,taxi.plate_no as taxi
        , route.dest as route FROM user
INNER JOIN driver on driver.user_id=user.user_id and user.record_status='active'
INNER JOIN taxi on taxi.taxi_id=driver.taxi_id and taxi.record_status='active'
INNER JOIN route on taxi.route_id=route.route_id and route.record_status='active' AND route.park_id=$parkID
       ;");
        $sql->execute();
       $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($result)) {
            $data['data']['taxis'] = $result;
            $data['data']['process'] = 'success';
        }else{
            $data['data']['taxis'] = 'empty';
            $data['data']['process'] = 'failed';
        }
        echo json_encode($data);
        //return $result;
    }
}
