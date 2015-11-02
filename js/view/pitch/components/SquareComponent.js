//##############################################################################
//
//##############################################################################

/**
 * Class SquareComponent
 * Created by maxim_000 on 9/18/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /**************************************************** public variables ********************************************/
    //static variables
    SquareComponent.MIN_WIDTH = 75;
    SquareComponent.MIN_HEIGHT = 75;

    /**************************************************** constructor *************************************************/

    function SquareComponent() {
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(SquareComponent,drillEditor.RectComponent);

    /************************************************* overridden methods *********************************************/

    p.initialize = function(){
      this.RectComponent_initialize();
      console.log("SquareComponent.initialize()");
    };

    p.getMinimalSize = function(){
        return new createjs.Point(SquareComponent.MIN_WIDTH, SquareComponent.MIN_HEIGHT);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.SquareComponent = createjs.promote(SquareComponent,"RectComponent");

}());