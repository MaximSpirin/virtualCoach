//##############################################################################
//
//##############################################################################

/**
 * Class BallSupplyComponent
 * Created by maxim_000 on 10/9/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    BallSupplyComponent.prototype.ballIcon = null;

    /******************* static variables *******************/
    BallSupplyComponent.STD_WIDTH = Math.floor(78*0.8);
    //BallSupplyComponent.STD_WIDTH = 78;
    BallSupplyComponent.STD_HEIGHT = Math.floor(26*0.8);
    //BallSupplyComponent.STD_HEIGHT = 26;

    /********************** constructor *********************/
    function BallSupplyComponent() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(BallSupplyComponent, drillEditor.BaseComponentRenderer);

    /******************** overridden methods ********************/
    p.initialize = function(){
        this.BaseComponentRenderer_initialize();

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.ballIcon = new createjs.Bitmap(drillEditor.DrillEditorApplication.loadQueue.getResult("ball-supply-icon"));
        this.ballIcon.setTransform(0,0,0.8,0.8);
        this.container.addChild(this.ballIcon);
    };

    p.getContentBounds = function(){
        var contentPositionInParentCS =
            this.localToLocal(0,0, this.parent);
        var result = new createjs.Rectangle(contentPositionInParentCS.x,
            contentPositionInParentCS.y, this.rendererData.width, this.rendererData.height);

        return result;
    };

    /********************** private methods *********************/


    /********************** event handlers **********************/



    /******************** public static method ******************/

    //drillEditor.BallSupplyComponent.staticFunctionName = function(param1){ //method body };


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BallSupplyComponent = createjs.promote(BallSupplyComponent,"BaseComponentRenderer");


}());