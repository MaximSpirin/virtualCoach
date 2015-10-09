/**
 * Class PlayerMovementLine
 * Created by maxim_000 on 10/9/2015.
 */
(function (window) {
    /******************* public variables *******************/
    //PlayerMovementLine.prototype.publicVar = "value";

    /******************* static variables *******************/
    //PlayerMovementLine.staticVar = "value";

    /********************** constructor *********************/
    function PlayerMovementLine() {
        //invoke constructor of superclass
        //this.SuperClass_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(PlayerMovementLine, BaseComponentRenderer);

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    //PlayerMovementLine.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.PlayerMovementLine = createjs.promote(PlayerMovementLine,"BaseComponentRenderer");

}(window));