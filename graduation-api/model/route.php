<?php
class Route
{

    private $routeID;
    private $parkID;
    private $src;
    private $dest;

    public function getRouteID()
    {
        return $this->routeID;
    }

    public function setRouteID($routeID)
    {
        $this->routeID = $routeID;
    }

    public function getParkID()
    {
        return $this->parkID;
    }

    public function setParkID($parkID)
    {
        $this->parkID = $parkID;
    }

    public function getSrc()
    {
        return $this->src;
    }

    public function setSrc($src)
    {
        $this->src = $src;
    }

    public function getDest()
    {
        return $this->dest;
    }

    public function setDest($dest)
    {
        $this->dest = $dest;
    }
}
