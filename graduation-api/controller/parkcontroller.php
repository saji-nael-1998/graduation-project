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
}
