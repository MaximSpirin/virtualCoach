/**
 * Class Form
 * Created by maxim_000 on 9/15/2015.
 */
(function (window) {
    //public variables
    Form.prototype.initParams;
    Form.prototype.positiveCallback;
    Form.prototype.negativeCallback;

    //static variable
    //Form.staticVar = "value";

    //constructor
    function Form(initParams) {
        //call superclass constructor
        this.Container_constructor();
        this.initParams = initParams ? initParams : {};
        this.positiveCallback = this.initParams.positiveCallback;
        this.negativeCallback = this.initParams.negativeCallback;

        //console.log("Form constructor");
        this.constructForm();
    }

    var p = createjs.extend(Form, createjs.Container);

    p.destroy = function(){
        //console.log("Form destroy");
        this.initParams = null;
        this.positiveCallback = null;
        this.negativeCallback = null;
      //to be overridden by successors
    };

    p.constructForm = function () {
        console.log("Form constructForm");
        //to be overridden by successors
    };


    // public functions
    //Form.prototype.publicFunction = function (param1) { };

    //private functions
    //function privateFunction(param) { }

    //public static method
    //Form.staticFunctionName = function(param1){ //method body };

    window.Form = createjs.promote(Form, "Container");

}(window));