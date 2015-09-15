/**
 * AppScreen
 */
(function (window) {
    //public variables

    AppScreen.prototype.form = null;  //reference to the form that is currently on the screen

    //static variable
    AppScreen.MAIN_MENU = "main_menu";
    AppScreen.EDITOR = "editor";


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
        removeCurrentForm(this);
    };

    AppScreen.prototype.showForm = function (formClass, initParams){
        showForm(this, formClass, initParams);
    };


    //private functions
    function removeCurrentForm(thisScope) {
        if(thisScope.form){
            thisScope.form.destroy();
            if(thisScope.contains(thisScope.form)){
                thisScope.removeChild(thisScope.form);
            }
        }
        thisScope.form = null;
    }

    function showForm(scope, formClass, initParams){
        //1. remove an exitsting form if present
        removeCurrentForm(scope);
        //2.create instance of form object
        var form = new formClass(initParams);
        //3. add new form to the top of DL
        scope.addChild(form);
    }


    //public static method
    /*AppScreen.staticFunctionName = function(param1){
        //method body
    };*/


    window.AppScreen = createjs.promote(AppScreen, "Container");

}(window));