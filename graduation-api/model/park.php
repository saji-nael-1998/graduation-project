<?php
class Park{
    
    private $parkID;
    private $parkName;
    private $parkStreet;
    private $parkCity;
	public function getParkID(){
		return $this->parkID;
	}

	public function setParkID($parkID){
		$this->parkID = $parkID;
	}

	public function getParkName(){
		return $this->parkName;
	}

	public function setParkName($parkName){
		$this->parkName = $parkName;
	}

	public function getParkStreet(){
		return $this->parkStreet;
	}

	public function setParkStreet($parkStreet){
		$this->parkStreet = $parkStreet;
	}

	public function getParkCity(){
		return $this->parkCity;
	}

	public function setParkCity($parkCity){
		$this->parkCity = $parkCity;
	}
}
