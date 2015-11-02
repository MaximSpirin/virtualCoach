/**
 * JS Class snippet
 */
(function (window) {
    //public variables
    ClassName.prototype.publicVar = "value";

    //static variable
    ClassName.staticVar = "value";

    //constructor
    function ClassName(){
        //private variables
        var _privateVar1 = "value1";
        var _privateVar2 = "value2";

        //public getters & setters ie properties
        this.getProp1 = function(){return _privateVar1;};
        this.getProp2 = function(){return _privateVar2;}
    }

    // public functions
    ClassName.prototype.publicFunction = function (param1) {

    };

    //private functions
    function privateFunction(param) {

    }

    //public static method
    ClassName.staticFunctionName = function(param1){
        //method body
    };

    drillEditor.ClassName = ClassName;

}());