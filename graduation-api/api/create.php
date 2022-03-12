<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Slim\Http\UploadedFile;

require '../vendor/autoload.php';
require '../controller/parkcontroller.php';
require '../controller/routeController.php';
require '../controller/taxiController.php';
require '../controller/operatorController.php';
require '../controller/driverController.php';
require '../controller/workdayController.php';
$app = new \Slim\App;

//add park
$app->post('/park/add', function (Request $request, Response $response) {
    $postArr  = $request->getParsedBody();
    $parkData     = $postArr["park"];


    //create controller
    $parkController = new ParkController();

    //create park object
    $park = new Park();
    $park->setParkName($parkData['park_name']);
    $park->setParkStreet($parkData['street']);
    $park->setParkCity($parkData['city']);
    //add to database
    $parkController->create($park);

    $response->getBody()->write("done");
    return $response;
});
//add route 
$app->post('/park/{park_id}/route/add', function (Request $request, Response $response) {


    //get park id
    $parkID = $request->getAttribute('park_id');

    $postArr  = $request->getParsedBody();
    $parkRoutesData = $postArr["routes"];


    //create controller
    $routeController = new RouteController();
    for ($x = 0; $x < count($parkRoutesData); $x++) {
        $route = new Route();
        $route->setDest($parkRoutesData[$x]['dest']);
        $route->setParkID($parkID);
        //add to database
        $routeController->create($route);
    }
    $response->getBody()->write("done");
    return $response;
});
//add taxi
//add park
$app->post('/route/{route}/taxi/add', function (Request $request, Response $response) {
    //get route id
    $routeID = $request->getAttribute('route');
    $postArr  = $request->getParsedBody();
    $parkData     = $postArr["taxi"];


    //create controller
    $taxiController = new TaxiController();

    //create tati object
    $taxi = new Taxi();

    $taxi->setRouteID($routeID);
    $taxi->setPlateNO($parkData['plate_no']);
    $taxi->setBrand($parkData['brand']);
    $taxi->setCarYear($parkData['car_year']);
    $taxi->setReqistrationDate($parkData['reqistration_date']);
    //add taxi to database
    $taxiController->create($taxi);

    $response->getBody()->write("done");
    return $response;
});
$app->post('/operator/isEmailAvailable', function (Request $request, Response $response) {

    $postArr  = $request->getParsedBody();
   
    $data['email']=$postArr["email"];
 
   
    $operatorController = new OperatorController();
    $flag = $operatorController->isEmailAvaiable($data);
    $response->getBody()->write(json_encode($flag));
    return $response;
});
$app->post('/operator/isIDAvailable', function (Request $request, Response $response) {

    $postArr  = $request->getParsedBody();
   
    $data['id']=$postArr["id"];
 
    $operatorController = new OperatorController();
    $flag = $operatorController->isIDAvaiable($data);
    $response->getBody()->write(json_encode($flag));
    return $response;
});
$app->post('/operator/isPhoneAvailable', function (Request $request, Response $response) {

    $postArr  = $request->getParsedBody();
    $data['phone'] = $postArr["phone"]; 
    $operatorController = new OperatorController();
    $flag = $operatorController->isPhoneAvaiable($data);
    $response->getBody()->write(json_encode($flag));
    return $response;
});
$app->post('/operator/add', function (Request $request, Response $response, array $args) {
    $postArr  = $request->getParsedBody();
    $uploadedFiles = $request->getUploadedFiles();


    $operator = new Operator();
    $operator->setParkID($postArr['park_id']);
    $operator->setFName($postArr['FName']);
    $operator->setMName($postArr['MName']);
    $operator->setLName($postArr['LName']);
    $operator->setEmail($postArr['email']);
    $operator->setPhoneNO($postArr['phoneNO']);
    $operator->setID($postArr['ID']);
    $operator->setStreet($postArr['street']);
    $operator->setCity($postArr['city']);
    $operator->setPass($postArr['pass']);
    $operator->setBirthdate($postArr['birthdate']);
    //create controller 
    $operatorController = new OperatorController();
    $user_id = $operatorController->create($operator);
    //upload file
    $filename = moveUploadedFile("operator", $user_id, $uploadedFiles['imagePath']);
    $operatorController->uploadPhoto($user_id, $filename);
    
});
$app->post('/driver/add', function (Request $request, Response $response, array $args) {
    $postArr  = $request->getParsedBody();
    $uploadedFiles = $request->getUploadedFiles();
    $driver = new Driver();
    $driver->setTaxiID($postArr['taxi_id']);
    $driver->setFName($postArr['FName']);
    $driver->setMName($postArr['MName']);
    $driver->setLName($postArr['LName']);
    $driver->setEmail($postArr['email']);
    $driver->setPhoneNO($postArr['phoneNO']);
    $driver->setID($postArr['ID']);
    $driver->setStreet($postArr['street']);
    $driver->setCity($postArr['city']);
    $driver->setPass($postArr['pass']);
    $driver->setBirthdate($postArr['birthdate']);
    //create controller 
    $driverController = new driverController();
    $user_id = $driverController->create($driver);
    //upload file
    $filename = moveUploadedFile("driver", $user_id, $uploadedFiles['imagePath']);
    $driverController->uploadPhoto($user_id, $filename);
    
});
//check driver email 
$app->post('/driver/isEmailAvailable', function (Request $request, Response $response) {

    $postArr  = $request->getParsedBody();
   
    $email=$postArr["email"];
    $driverController = new driverController();
    $flag =  $driverController->isEmailAvaiable($email);
    $response->getBody()->write(json_encode($flag));
    return $response;
});
$app->post('/driver/isPhoneAvaiable', function (Request $request, Response $response) {
    $postArr  = $request->getParsedBody();
    $email=$postArr["phoneNO"];
    $driverController = new driverController();
    $flag =  $driverController->isPhoneAvaiable($email);
    $response->getBody()->write(json_encode($flag));
    return $response;
});
$app->post('/driver/isIDAvaiable', function (Request $request, Response $response) {
    $postArr  = $request->getParsedBody();
    $email=$postArr["ID"];
    $driverController = new driverController();
    $flag =  $driverController->isIDAvaiable($email);
    $response->getBody()->write(json_encode($flag));
    return $response;
});
//workday creation
$app->post('/workday/add', function (Request $request, Response $response, array $args) {
    $postArr  = $request->getParsedBody();

   //create object of workday
    $workday=new Workday();
    $workday->setUserID($postArr['userID']);
    $workday->setParkID($postArr['parkID']);
    $workday->setWorkdayDate($postArr['workdayDate']);
    $workday->setWorkdayStartTime($postArr['workdayStart']);
    $workday->setWorkdayEndTime($postArr['workdayEnd']);
    //create controller
    $workdayController=new  WorkdayController();
    $workdayController->create($workday);
    

});
function moveUploadedFile($role, $userID, UploadedFile $uploadedFile)
{
    $upload_directory_driver = '../upload/driver';
    $upload_directory_operator = '../upload/operator';

    if ($role == "operator") {
        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
        $basename = bin2hex(random_bytes(8)); // see http://php.net/manual/en/function.random-bytes.php
        $filename = sprintf('%s.%0.8s', $userID, $extension);
        $uploadedFile->moveTo($upload_directory_operator . DIRECTORY_SEPARATOR . $filename);
        return $filename;
    }
    if ($role == "driver") {
        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);
        $basename = bin2hex(random_bytes(8)); // see http://php.net/manual/en/function.random-bytes.php
        $filename = sprintf('%s.%0.8s', $userID, $extension);
        $uploadedFile->moveTo($upload_directory_driver . DIRECTORY_SEPARATOR . $filename);
        return $filename;
    }
}
$app->run();
