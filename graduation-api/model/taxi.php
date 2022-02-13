<?php
class Taxi{
    private $routeID;
    private $taxiID;
    private $brand;
    private $carYear;
    private $reqistrationDate;
    private $plateNO;
	public function getRouteID(){
		return $this->routeID;
	}

	public function setRouteID($routeID){
		$this->routeID = $routeID;
	}

	public function getTaxiID(){
		return $this->taxiID;
	}

	public function setTaxiID($taxiID){
		$this->taxiID = $taxiID;
	}

	public function getBrand(){
		return $this->brand;
	}

	public function setBrand($brand){
		$this->brand = $brand;
	}

	public function getCarYear(){
		return $this->carYear;
	}

	public function setCarYear($carYear){
		$this->carYear = $carYear;
	}

	public function getReqistrationDate(){
		return $this->reqistrationDate;
	}

	public function setReqistrationDate($reqistrationDate){
		$this->reqistrationDate = $reqistrationDate;
	}

	public function getPlateNO(){
		return $this->plateNO;
	}

	public function setPlateNO($plateNO){
		$this->plateNO = $plateNO;
	}
}
