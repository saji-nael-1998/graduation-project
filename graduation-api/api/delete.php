<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
require '../controller/parkcontroller.php';
require '../controller/routeController.php';
require '../controller/operatorController.php';
$app = new \Slim\App;

//delete park
$app->delete('/park/{park_id}', function ($request) {
    //get park id
    $parkID = $request->getAttribute('park_id');
    $parkController = new ParkController();
    $parkController->delete($parkID);
});

//delete route
$app->delete('/route/{route_id}', function ($request) {
    //get route id
    $routeID = $request->getAttribute('route_id');
    $routeController = new RouteController();
    $routeController->delete($routeID);
});
//delete operator
$app->delete('/operator/{user_id}', function ($request) {
    //get route id
    $userID = $request->getAttribute('user_id');
   
   $operatorController = new OperatorController();
    $operatorController->delete($userID);
});


$app->run();
