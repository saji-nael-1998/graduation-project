<?php

class Workday{
    private $userID;
    private $parkID;
    private $workdayDate;
    private $workdayStartTime;
    private $workdayEndTime;
    public function getUserID(){
		return $this->userID;
	}

	public function setUserID($userID){
		$this->userID = $userID;
	}
    public function getParkID(){
		return $this->parkID;
	}

	public function setParkID($parkID){
		$this->parkID = $parkID;
	}
	public function getWorkdayDate(){
		return $this->workdayDate;
	}

	public function setWorkdayDate($workdayDate){
		$this->workdayDate = $workdayDate;
	}

	public function getWorkdayStartTime(){
		return $this->workdayStartTime;
	}

	public function setWorkdayStartTime($workdayStartTime){
		$this->workdayStartTime = $workdayStartTime;
	}

	public function getWorkdayEndTime(){
		return $this->workdayEndTime;
	}

	public function setWorkdayEndTime($workdayEndTime){
		$this->workdayEndTime = $workdayEndTime;
	}
}
