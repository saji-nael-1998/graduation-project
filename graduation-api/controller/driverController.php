<?php
include_once("../config/dp.php");
include_once('../model/driver.php');
include_once('../controller/taxiController.php');
class driverController
{
    private $table = "driver";
    private $conn;
    function __construct()
    {
        $DBConnection = new DBConnection();
        $this->conn = $DBConnection->connect();
    }

    public function create($driver)
    {
        $sql = "INSERT INTO `user`( `FName`, `MName`, `LName`, `birthdate`, `ID`, `email`, `phoneNO`, `pass`, `street`, `city`) VALUES ('{$driver->getFName()}','{$driver->getMName()}','{$driver->getLName()}','{$driver->getBirthdate()}','{$driver->getID()}','{$driver->getEmail()}','{$driver->getPhoneNO()}','{$driver->getPass()}','{$driver->getStreet()}','{$driver->getCity()}')";
        $statement = $this->conn->prepare($sql);
        $statement->execute();
        $user_id = $this->conn->lastInsertId();
        $sql = "INSERT INTO `$this->table`(`user_id`, `taxi_id`) VALUES ($user_id,{$driver->getTaxiID()})";
        $statement = $this->conn->prepare($sql);
        $statement->execute();
        return $user_id;
    }

    public function update($driver)
    {
        $sql = "UPDATE `user` SET  FName='{$driver->getFName()}',MName='{$driver->getMName()}',LName='{$driver->getLName()}',birthdate='{$driver->getBirthdate()}',ID='{$driver->getID()}',email='{$driver->getEmail()}',phoneNO='{$driver->getPhoneNO()}',pass='{$driver->getPass()}',street='{$driver->getStreet()}',city='{$driver->getCity()}' where user_id={$driver->getUserID()}";

        $statement = $this->conn->prepare($sql);
        $statement->execute();
        $sql = "UPDATE `$this->table` SET  park_id={$driver->getParkID()} where user_id={$driver->getUserID()}";

        $statement = $this->conn->prepare($sql);
        $statement->execute();
    }
    public function read($userID)
    {
        $sql = $this->conn->prepare("SELECT u.*,d.taxi_id FROM `user` u , `driver` d WHERE d.user_id=u.user_id and u.record_status='active' and u.user_id='$userID'");
        $sql->execute();

        $data['driver'] = $sql->fetch(PDO::FETCH_ASSOC);

      
        //create object of controller
        $taxiController = new TaxiController();
        if (!empty($data['driver'])) {
            $taxiID = $data['driver']['taxi_id'];
            $taxi = $taxiController->read($taxiID);

            if (!empty($taxi))
                $data['driver']['taxi'] = $taxi;
            else
                $data['driver']['taxi'] = 'empty';

            return $data;
        } else {
            return $data['driver']['empty'];
        }
    }
    public function delete($userID)
    {
        $sql = $this->conn->prepare("UPDATE `user` set record_status='inactive' where user_id=$userID");
        $sql->execute();
    }
    public function readAll()
    {
        $sql = $this->conn->prepare("SELECT u.*,d.taxi_id FROM `user` u , `driver` d WHERE d.user_id=u.user_id and u.record_status='active'");
        $sql->execute();

        $data['data'] = $sql->fetchAll(PDO::FETCH_ASSOC);
        //create object of controller
        $taxiController = new TaxiController();
        for ($x = 0; $x < count($data['data']); $x++) {
            $taxiID = $data['data'][$x]['taxi_id'];
            $taxi = $taxiController->read($taxiID);

            if (!empty($taxi))
                $data['data'][$x]['taxi'] = $taxi;
            else
                $data['data'][$x]['taxi'] = 'empty';
        }
        return $data;
    }
    public function uploadPhoto($userID, $filename)
    {
        $sql = "UPDATE `user` SET  imagePath='$filename' where user_id=$userID";
        $statement = $this->conn->prepare($sql);
        $statement->execute();
    }

    public function login($email, $pass)
    {
        $sql = "SELECT
        USER.user_id
    FROM
        `user`
    INNER JOIN driver ON driver.user_id = USER.user_id AND USER.record_status = 'active' AND USER.email = '$email' and USER. pass = '$pass'";

        $statement = $this->conn->prepare($sql);
        $statement->execute();
        $result =   $statement->fetch(PDO::FETCH_ASSOC);


        if (empty($result))
            $data['data']['proccess'] = 'failed';
        else {

            $data['data'] = $this->read($result['user_id']);
            $data['data']['proccess'] = 'success';
        }
        return  $data;
    }
    public function ownEmail($email, $userID)
    {
        $sql = $this->conn->prepare("SELECT user.user_id as 'userID'  FROM user 
        INNER JOIN driver on driver.user_id=user.user_id AND user.record_status='active' and email='$email'");
        $sql->execute();
        $result = $sql->fetch(PDO::FETCH_ASSOC);
        if (!empty($result)) {
            if ($result['userID'] == $userID) {
                return 'true';
            } else {
                return 'false';
            }
        } else {
            return $this->isEmailAvaiable($email);
        }
    }
    public function isEmailAvaiable($email)
    {
        $sql = $this->conn->prepare("SELECT COUNT(*) as 'flag' FROM user 
        INNER JOIN driver on driver.user_id=user.user_id and user.record_status='active' and user.email='$email'");
        $sql->execute();
        $result = $sql->fetch(PDO::FETCH_ASSOC);
        if (!empty($result)) {
            if ($result['flag'] == 0) {
                return 'true';
            } else {
                return 'false';
            }
        }
    }
    public function ownPhoneNO($phoneNO, $userID)
    {
        $sql = $this->conn->prepare("SELECT user.user_id as 'userID'  FROM user 
        INNER JOIN driver on driver.user_id=user.user_id AND user.record_status='active' and phoneNO='$phoneNO'");
        $sql->execute();
        $result = $sql->fetch(PDO::FETCH_ASSOC);
        if (!empty($result)) {
            if ($result['userID'] == $userID) {
                return 'true';
            } else {
                return 'false';
            }
        } else {
            return $this->isPhoneAvaiable($phoneNO);
        }
    }
    public function isPhoneAvaiable($phoneNO)
    {
        $sql = $this->conn->prepare("SELECT COUNT(*) as 'flag' FROM user 
        INNER JOIN driver on driver.user_id=user.user_id and user.record_status='active' and user.phoneNO='$phoneNO'");
        $sql->execute();
        $result = $sql->fetch(PDO::FETCH_ASSOC);
        if (!empty($result)) {
            if ($result['flag'] == 0) {
                return 'true';
            } else {
                return 'false';
            }
        }
    }
    public function ownID($id, $userID)
    {
        $sql = $this->conn->prepare("SELECT user.user_id as 'userID'  FROM user 
        INNER JOIN driver on driver.user_id=user.user_id AND user.record_status='active' and ID='$id'");
        $sql->execute();
        $result = $sql->fetch(PDO::FETCH_ASSOC);
        if (!empty($result)) {
            if ($result['userID'] == $userID) {
                return 'true';
            } else {
                return 'false';
            }
        } else {
            return $this-> isIDAvaiable($id);
        }
    }
    public function isIDAvaiable($id)
    {
        $sql = $this->conn->prepare("SELECT COUNT(*) as 'flag' FROM user 
        INNER JOIN driver on driver.user_id=user.user_id and user.record_status='active' and user.ID='$id'");
        $sql->execute();
        $result = $sql->fetch(PDO::FETCH_ASSOC);
        if (!empty($result)) {
            if ($result['flag'] == 0) {
                return 'true';
            } else {
                return 'false';
            }
        }
    }
}
