<?php
include_once("../config/dp.php");
include_once('../model/operator.php');
class OperatorController
{
    private $table = "operator";
    private $conn;
    function __construct()
    {
        $DBConnection = new DBConnection();
        $this->conn = $DBConnection->connect();
    }

    public function create($operator)
    {
        $sql = "INSERT INTO `user`( `FName`, `MName`, `LName`, `birthdate`, `ID`, `email`, `phoneNO`, `pass`, `street`, `city`) VALUES ('{$operator->getFName()}','{$operator->getMName()}','{$operator->getLName()}','{$operator->getBirthdate()}','{$operator->getID()}','{$operator->getEmail()}','{$operator->getPhoneNO()}','{$operator->getPass()}','{$operator->getStreet()}','{$operator->getCity()}')";
        $statement = $this->conn->prepare($sql);
        $statement->execute();
        $user_id = $this->conn->lastInsertId();
        $sql = "INSERT INTO `$this->table`(`user_id`, `park_id`) VALUES ($user_id,{$operator->getParkID()})";
        $statement = $this->conn->prepare($sql);
        $statement->execute();
        return $user_id;
    }

    public function update($operator)
    {
        $sql = "UPDATE `user` SET  FName='{$operator->getFName()}',MName='{$operator->getMName()}',LName='{$operator->getLName()}',birthdate='{$operator->getBirthdate()}',ID='{$operator->getID()}',email='{$operator->getEmail()}',phoneNO='{$operator->getPhoneNO()}',pass='{$operator->getPass()}',street='{$operator->getStreet()}',city='{$operator->getCity()}' where user_id={$operator->getUserID()}";

        $statement = $this->conn->prepare($sql);
        $statement->execute();
        $sql = "UPDATE `$this->table` SET  park_id={$operator->getParkID()} where user_id={$operator->getUserID()}";

        $statement = $this->conn->prepare($sql);
        $statement->execute();
    }
    public function read($userID)
    {
    }
    public function delete($userID)
    {
        $sql = $this->conn->prepare("UPDATE `user` set record_status='inactive' where user_id=$userID");
        $sql->execute();
    }
    public function readAll()
    {
        $sql = $this->conn->prepare("SELECT
        u.*,
        p.park_name,
        o.park_id
    FROM
        `park` p,
        `user` u,
        `operator` o
    WHERE
        u.record_status = 'active' AND
        p.record_status = 'active'AND
        u.user_id=o.user_id AND
        o.park_id=p.park_id");
        $sql->execute();
        $data['data'] = $sql->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }
    public function uploadPhoto($userID, $filename)
    {
        $sql = "UPDATE `user` SET  imagePath='$filename' where user_id=$userID";
        $statement = $this->conn->prepare($sql);
        $statement->execute();
    }
    public function isEmailAvaiable($data)
    {

        if (isset($data['id'])) {
            $email = $data['email'];
            $sql = $this->conn->prepare("select ifnull((select u.ID from user u , operator o  where u.record_status='active' and o.user_id=u.user_id and u.email = '$email'),'null') As id;");

            $sql->execute();
            $result['data'] = $sql->fetch(PDO::FETCH_ASSOC);

            if ($result['data']['id'] == "null") {
                return "true";
            } else {
                if ($result['data']['id'] == $data['id'])
                    return "true";
                else
                    return "false";
            }
        } else {

            $email = $data['email'];
            $sql = $this->conn->prepare("SELECT count(*) as flag from $this->table o , `user` u where o.user_id=u.user_id and  u.record_status='active' and u.email='$email' ");

            $sql->execute();
            $data['data'] = $sql->fetch(PDO::FETCH_ASSOC);

            if ($data['data']['flag'] == 0) {
                return "true";
            } else {
                return "false";
            }
        }
    }
    public function isIDAvaiable($data)
    {
        if (isset($data['email'])) {
            $id = $data['id'];
            $sql = $this->conn->prepare("select ifnull((select u.email from user u , operator o  where u.record_status='active' and o.user_id=u.user_id and u.ID = '$id'),'null') As email");

            $sql->execute();
            $result['data'] = $sql->fetch(PDO::FETCH_ASSOC);

            if ($result['data']['email'] == "null") {
                return "true";
            } else {
                if ($result['data']['email'] == $data['email'])
                    return "true";
                else
                    return "false";
            }
        } else {

            $id  = $data['id'];
            $sql = $this->conn->prepare("SELECT count(*) as flag from $this->table o , `user` u where o.user_id=u.user_id and  u.record_status='active' and u.ID='$id' ");

            $sql->execute();
            $data['data'] = $sql->fetch(PDO::FETCH_ASSOC);

            if ($data['data']['flag'] == 0) {
                return "true";
            } else {
                return "false";
            }
        }
    }
    public function isPhoneAvaiable($data)
    {
        if (isset($data['id'])) {
            $phone = $data['phone'];
            $sql = $this->conn->prepare("select ifnull((select u.ID from user u , operator o  where u.record_status='active' and o.user_id=u.user_id and u.phoneNO = '$phone'),'null') As id;");

            $sql->execute();
            $result['data'] = $sql->fetch(PDO::FETCH_ASSOC);

            if ($result['data']['id'] == "null") {
                return "true";
            } else {
                if ($result['data']['id'] == $data['id'])
                    return "true";
                else
                    return "false";
            }
        } else {
            $phone  = $data['phone'];
            $sql = $this->conn->prepare("SELECT count(*) as flag from $this->table o , `user` u where o.user_id=u.user_id and  u.record_status='active' and u.phoneNO='$phone' ");

            $sql->execute();
            $data['data'] = $sql->fetch(PDO::FETCH_ASSOC);

            if ($data['data']['flag'] == 0) {
                return "true";
            } else {
                return "false";
            }
        }
    }
    public function login($email, $pass)
    {
        $sql = "SELECT
        u.FName,
        u.LName,
        u.imagePath,
        u.user_id,
        p.park_id,
        IF(
            u.record_status = 'active',
            IF( p.record_status = 'active', 'yes', 'no'),
        'no'
        ) AS flag
    FROM
        `user` u,
        `operator` o,
        `park` p
    WHERE
        u.user_id = o.user_id AND p.park_id = o.park_id and u.email='$email' and u.pass='$pass'";

        $statement = $this->conn->prepare($sql);
        $statement->execute();
        $result =   $statement->fetch(PDO::FETCH_ASSOC);
        if (empty($result))
            $data['data']['proccess'] = 'failed';
        else {
            $data['data']['proccess'] = 'success';
            $data['data']['operator'] = $result;
        }
        return  $data;
    }
    public function ownEmail($email, $userID)
    {
        $sql = $this->conn->prepare("SELECT user.user_id as 'userID'  FROM user 
        INNER JOIN driver on driver.user_id=user.user_id AND user.record_status='active' and email='$email'");
        $sql->execute();
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($result)) {
            if ($result['userID'] == $userID) {
                return 'true';
            } else {
                return 'false';
            }
        }
    }
}
