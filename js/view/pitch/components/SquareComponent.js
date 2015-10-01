/**
 * Class SquareComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    /**************************************************** public variables ********************************************/
    //static variables
    SquareComponent.MIN_WIDTH = 75;
    SquareComponent.MIN_HEIGHT = 75;

    /**************************************************** constructor *************************************************/

    function SquareComponent() {
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(SquareComponent,RectComponent);

    /************************************************* overridden methods *********************************************/

    p.initialize = function(){
      this.RectComponent_initialize();
      console.log("SquareComponent.initialize()");
    };

    p.getMinimalSize = function(){
        return new createjs.Point(SquareComponent.MIN_WIDTH, SquareComponent.MIN_HEIGHT);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.SquareComponent = createjs.promote(SquareComponent,"RectComponent");

}(window));