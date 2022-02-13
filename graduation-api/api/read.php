<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
require '../controller/parkcontroller.php';
require '../controller/routeController.php';
require '../controller/taxiController.php';
require '../controller/operatorController.php';
require '../controller/driverController.php';
require '../controller/workdayController.php';

$app = new \Slim\App;
//get specific park
$app->get('/park/{park}', function (Request $request, Response $response) {
    $park = $request->getAttribute('park');
    $parkController = new ParkController();
    $data = $parkController->read($park);
    $response->getBody()->write($data);
    return $response;
});

//get all parks
$app->get('/parks', function (Request $request, Response $response) {
    $parkController = new ParkController();
    $data = $parkController->readAll();
    $response->getBody()->write($data);
    return $response;
});
//get specific park
$app->get('/park/{park}/routes', function (Request $request, Response $response) {
    $park = $request->getAttribute('park');
    $parkController = new ParkController();
    $data = $parkController->readParkRoutes($park);
    $response->getBody()->write($data);
    return $response;
});
//get all routes
$app->get('/routes', function (Request $request, Response $response) {
    $routeController = new RouteController();
    $data =  $routeController->readAll();
    $response->getBody()->write($data);
    return $response;
});
//get all available taxis
$app->get('/route/{route}/taxis', function (Request $request, Response $response) {
    $routeID = $request->getAttribute('route');
    $taxiController = new TaxiController();
    $data =  $taxiController->readAvailableTaxis($routeID);
    $response->getBody()->write($data);
    return $response;
});

//taxis section
$app->get('/taxis', function (Request $request, Response $response) {
    $taxoController = new TaxiController();
    $data =  $taxoController->readAll();
    $response->getBody()->write($data);
    return $response;
});

$app->get('/operators', function (Request $request, Response $response) {
    $operatorController = new OperatorController();
    $data =  $operatorController->readAll();
    $response->getBody()->write(json_encode($data));
    return $response;
});
$app->get('/drivers', function (Request $request, Response $response) {
    $driverController = new DriverController();
    $data =  $driverController->readAll();
    $response->getBody()->write(json_encode($data));
    return $response;
});
$app->get('/login/operator/', function (Request $request, Response $response) {
    $email =$_GET['email'];
    $pass = $_GET['pass'];



    $operatorController = new OperatorController();
    $data =  $operatorController->login($email, $pass);
    $response->getBody()->write(json_encode($data));
    return $response;
});
$app->get('/login/driver', function (Request $request, Response $response) {
    $email =$_GET['email'];
    $pass = $_GET['pass'];



    $driverController = new DriverController();
    $data =  $driverController->login($email, $pass);
    $response->getBody()->write(json_encode($data));
    return $response;
});
//get  driver
$app->get('/driver', function (Request $request, Response $response) {
    $userID =$_GET['userID'];
    $driverController = new DriverController();
    $data =  $driverController->read($userID);
    $response->getBody()->write(json_encode($data));
    return $response;
});
//get  workday for driver
$app->get('/workday/driver', function (Request $request, Response $response) {
    $userID =$_GET['userID'];
    $date =$_GET['date'];

    $wordayController = new WorkdayController();
    $data =  $wordayController->readWorkdayBySpecificDate($userID,$date);
    $response->getBody()->write(json_encode($data));
    return $response;
});
$app->run();

