if(sessionStorage.getItem("operator")!=null){
    let operator=JSON.parse(sessionStorage.getItem("operator"));
    $("#account-name").append(operator.FName+" "+operator.LName)

    $("#account-img").css("background-image",`url("../../../graduation-api/upload/operator/${operator.imagePath}")`)
}else{
    location.replace("../account/login.html");
}