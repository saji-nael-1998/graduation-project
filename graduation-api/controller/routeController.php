<?php
include_once("../config/dp.php");
include_once("../model/route.php");
class RouteController
{
    private $table = "route";
    private $conn;
    function __construct()
    {
        $DBConnection = new DBConnection();
        $this->conn = $DBConnection->connect();
    }

    public function create($route)
    {
        $sql = "INSERT INTO `$this->table`(park_id,src,dest) VALUES({$route->getParkID()},(select city from park where park_id={$route->getParkID()}),'{$route->getDest()}')";
        $statement = $this->conn->prepare($sql);
        $statement->execute();
    }
    public function read($routeID)
    {
        $sql = $this->conn->prepare("SELECT r.*,p.park_name,p.street,p.city  from $this->table r , `park` p where p.record_status='active' AND r.record_status='active' and r.park_id=p.park_id AND r.route_id=$routeID");
        $sql->execute();
        $data['route'] = $sql->fetch(PDO::FETCH_ASSOC);
        return  $data['route'];
    }
    public function update($route)
    {
        $sql = "UPDATE `$this->table` SET park_id={$route->getParkID()},dest='{$route->getDest()}' where route_id={$route->getRouteID()}";
        echo $sql;
        $statement = $this->conn->prepare($sql);
        $statement->execute();
    }
    public function delete($routeID)
    {
        $sql = $this->conn->prepare("UPDATE $this->table set record_status='inactive' where route_id=$routeID");
        $sql->execute();
    }
    public function readAll()
    {
        $sql = $this->conn->prepare("SELECT r.route_id,r.src,r.dest , p.park_name,p.park_id from $this->table r , `park` p where r.record_status='active' and p.record_status='active' and p.park_id=r.park_id ");

        $sql->execute();
        $data['data'] = $sql->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
    }
}
