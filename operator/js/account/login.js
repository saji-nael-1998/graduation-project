 const validateEmail = (email) => {
     return email.match(
         /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
     );
 };
 $("button[type=submit]").click(function (event) {
     event.preventDefault();
     let email = $("#email").val();
     let pass = $("#pass").val();
     let check = true;
     if (email.length == 0) {
         $("#emailHelp").empty();
         $("#emailHelp").append("enter your email !");
         check = false;
     } else {
         if (validateEmail(email)) {
             $("#emailHelp").empty();
         } else {
             $("#emailHelp").empty();
             $("#emailHelp").append("email is not valid !");
             check = false;
         }
     }

     if (pass.length < 6) {
         $("#passHelp").empty();
         $("#passHelp").append("password must be at least 6 digits !");
         check = false;
     } else {
         $("#passHelp").empty();
     }
     if (check) {
         $.get("../../../graduation-api/api/read.php/login/operator/", {
             email: email,
             pass: pass
         }, function (data) {

             let result = JSON.parse(data);
             if (result.data.proccess == 'failed') {
                 $("#emailHelp").empty();
                 $("#emailHelp").append("email is worng !");
             } else {
                 if (result.data.operator.flag == 'yes') {
                     sessionStorage.setItem("operator", JSON.stringify(result.data.operator));
                     location.replace('../dashboard/index.html');
                 } else {
                     $("#emailHelp").empty();
                     $("#emailHelp").append("email is not valid !");
                 }
             }
         });
     }
 });