<?php
include_once("../config/dp.php");
include_once("../model/workday.php");
class WorkdayController
{
    private $table = "workday";
    private $conn;
    function __construct()
    {
        $DBConnection = new DBConnection();
        $this->conn = $DBConnection->connect();
    }

    public function create($workday)
    {
        $sql = "INSERT INTO `workday`(`user_id`, `park_id`,`workday_date`, `workday_start`) VALUES ({$workday->getUserID()},{$workday->getParkID()},'{$workday->getWorkdayDate()}','{$workday->getWorkdayStartTime()}')";
        
        $statement = $this->conn->prepare($sql);
       $statement->execute();
    }
    public function read($parkID)
    {
        $sql = $this->conn->prepare("SELECT * from $this->table where record_status='active' AND park_id=$parkID ");
        $sql->execute();
        $data['data'] = $sql->fetch(PDO::FETCH_ASSOC);
       return $data;
    }
    public function readWorkdayBySpecificDate($userID,$date)
    {
        $sql = $this->conn->prepare("SELECT * from $this->table where workday_date='$date' AND user_id=$userID ");
        $sql->execute();
        $result = $sql->fetch(PDO::FETCH_ASSOC);
        if(!empty( $result)){
            $data['data'] ['workday']=$result;
            $data['data']['process']='success';
        }else{
            $data['data']['process']='failed';

        }
        return $data;
    }
    public function update($park)
    {
    }
    public function delete($parkID)
    {
        $sql = $this->conn->prepare("UPDATE $this->table set record_status='inactive' where park_id=$parkID");
        $sql->execute();
    }
   

}
