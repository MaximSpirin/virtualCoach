/**
 * Class ArchedArrow
 * Created by maxim_000 on 9/27/2015.
 */
(function (window) {
    /************************************************* public variables ***********************************************/
    //ArchedArrow.prototype.publicVar = "value";

    /************************************************* static variables ***********************************************/
    ArchedArrow.STD_WIDTH = 60;
    ArchedArrow.STD_HEIGHT = 20;

    /************************************************** constructor ***************************************************/
    function ArchedArrow() {
        //invoke constructor of superclass
        this.BaseShapeRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(ArchedArrow, BaseShapeRenderer);

    /*********************************************** overridden methods ***********************************************/
    p.initialize = function(){
        this.BaseShapeRenderer_initialize();
        console.log("ArchedArrow.initialize()");
    };

    p.render = function(){

    };

    /************************************************* public methods *************************************************/




    /************************************************** event handlers ************************************************/




    /************************************************** static methods ************************************************/

    //Make aliases for all superclass methods: SuperClass_methodName
    window.ArchedArrow = createjs.promote(ArchedArrow,"BaseShapeRenderer");

}(window));