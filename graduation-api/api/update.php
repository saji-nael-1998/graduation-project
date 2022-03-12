<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
require '../controller/parkcontroller.php';
require '../controller/routeController.php';
require '../controller/operatorController.php';
require '../controller/workdayController.php';

$app = new \Slim\App;

//delete route
$app->put('/route/{route_id}', function ($request) {
    //get park id
    $routeID = $request->getAttribute('route_id');

    $puttArr  = $request->getParsedBody();
    $routeData = $puttArr["route"];

    //create route object
    $route = new Route();
    $route->setParkID($routeData['park_id']);
    $route->setRouteID($routeID);
    $route->setDest($routeData['dest']);
    //create route controller
    $routeController = new RouteController();
    $routeController->update($route);
});
//operator section


$app->put('/operator', function ($request) {
    
  
    $putArr  = $request->getParsedBody();
  
  
    $operator = new Operator();
    $operator->setUserID($putArr['user_id']);
    $operator->setParkID($putArr['park_id']);
    $operator->setFName($putArr['FName']);
    $operator->setMName($putArr['MName']);
    $operator->setLName($putArr['LName']);
    $operator->setEmail($putArr['email']);
    $operator->setPhoneNO($putArr['phoneNO']);
    $operator->setID($putArr['ID']);
    $operator->setStreet($putArr['street']);
    $operator->setCity($putArr['city']);
    $operator->setPass($putArr['pass']);
    $operator->setBirthdate($putArr['birthdate']);

   
    $operatorController = new OperatorController();
    $operatorController->update($operator);
});

$app->put('/workday/driver', function ($request) {
    
  
    $putArr  = $request->getParsedBody();
    $userID= $putArr['userID'];
    $workdayEnd= $putArr['workdayEnd'];
    $date= $putArr['date'];
    $work=new WorkdayController();
    $work->updateDriverWorkday($date,$userID,$workdayEnd);
});
$app->put('/operator/isEmailAvailable', function (Request $request, Response $response) {

    $putArr  = $request->getParsedBody();

    $data['email'] = $putArr["email"];
    $data['id'] = $putArr["id"];

    $operatorController = new OperatorController();

    $flag = $operatorController->isEmailAvaiable($data);

    $response->getBody()->write(json_encode($flag));
    return $response;
});
$app->put('/operator/isIDAvailable', function (Request $request, Response $response) {

    $putArr  = $request->getParsedBody();

    $data['email'] = $putArr["email"];
    $data['id'] = $putArr["id"];

    $operatorController = new OperatorController();

    $flag = $operatorController->isIDAvaiable($data);

    $response->getBody()->write(json_encode($flag));
    return $response;
});
$app->put('/operator/isPhoneAvailable', function (Request $request, Response $response) {

    $putArr  = $request->getParsedBody();

    $data['phone'] = $putArr["phone"];
    $data['id'] = $putArr["id"];

    $operatorController = new OperatorController();

    $flag = $operatorController->isPhoneAvaiable($data);

    $response->getBody()->write(json_encode($flag));
    return $response;
});
$app->run();
