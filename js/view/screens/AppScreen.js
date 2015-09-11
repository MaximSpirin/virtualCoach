/**
 * AppScreen
 */
(function (window) {
    //public variables
    //AppScreen.prototype.publicVar = "value";

    //static variable
    AppScreen.MAIN_MENU = "main_menu";


    //constructor
    function AppScreen(){
        // call constructor of the superclass
        this.Container_constructor();

        //private variables
        /*var _privateVar1 = "value1";
        var _privateVar2 = "value2";*/

        //public getters & setters ie properties
        /*this.getProp1 = function(){return _privateVar1;};
        this.getProp2 = function(){return _privateVar2;}*/

        console.log("AppScreen constructor fired!");
    }

    var p = createjs.extend(AppScreen, createjs.Container);

    /*p.draw = function(){
        this.Container_draw();
        //add custom logic here
    };*/

    // public functions
    /**
     * Destroys this instance of AppScreen.
     * All interactivity & other processes should be disabled here
     */
    AppScreen.prototype.destroy = function () {

    };

    //private functions
    /*function privateFunction(param) {

    }*/

    //public static method
    /*AppScreen.staticFunctionName = function(param1){
        //method body
    };*/


    window.AppScreen = createjs.promote(AppScreen, "Container");

}(window));