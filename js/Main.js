/**
 * App entry point
 */

$(document).ready(function(){

    console.log("Document ready");
    //init singletons
    window.applicationModel = ApplicationModel.getInstance();
    window.serviceLocator = ServiceLocator.getInstance();
    window.eventDispatcher = $("#appContainer");

    //create user object that will be stored as a property of window
    window.user = new User();
    //init easeljs stage
    window.stage = new createjs.Stage("appCanvas");

    showLoginScreen();
});

function showLoginScreen(){
    
}


