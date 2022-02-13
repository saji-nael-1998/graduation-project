<?php
class Driver
{
    private $taxiID;
    private $userID;
    private $FName;
    private $MName;
    private $LName;
    private $phoneNO;
    private $email;
    private $ID;
    private $street;
    private $city;
    private $imagePath;
    private $birthdate;
    private $pass;
    public function getTaxiID()
    {
        return $this->taxiID;
    }

    public function setTaxiID($taxiID)
    {
        $this->taxiID = $taxiID;
    }

    public function getUserID()
    {
        return $this->userID;
    }

    public function setUserID($userID)
    {
        $this->userID = $userID;
    }

    public function getFName()
    {
        return $this->FName;
    }

    public function setFName($FName)
    {
        $this->FName = $FName;
    }

    public function getMName()
    {
        return $this->MName;
    }

    public function setMName($MName)
    {
        $this->MName = $MName;
    }

    public function getLName()
    {
        return $this->LName;
    }

    public function setLName($LName)
    {
        $this->LName = $LName;
    }

    public function getPhoneNO()
    {
        return $this->phoneNO;
    }

    public function setPhoneNO($phoneNO)
    {
        $this->phoneNO = $phoneNO;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getID()
    {
        return $this->ID;
    }

    public function setID($ID)
    {
        $this->ID = $ID;
    }

    public function getStreet()
    {
        return $this->street;
    }

    public function setStreet($street)
    {
        $this->street = $street;
    }

    public function getCity()
    {
        return $this->city;
    }

    public function setCity($city)
    {
        $this->city = $city;
    }

    public function getImagePath()
    {
        return $this->imagePath;
    }

    public function setImagePath($imagePath)
    {
        $this->imagePath = $imagePath;
    }

    public function getBirthdate()
    {
        return $this->birthdate;
    }

    public function setBirthdate($birthdate)
    {
        $this->birthdate = $birthdate;
    }

    public function getPass()
    {
        return $this->pass;
    }

    public function setPass($pass)
    {
        $this->pass = $pass;
    }
}
