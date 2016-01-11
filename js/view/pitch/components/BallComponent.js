//##############################################################################
//
//##############################################################################

/**
 * Class BallComponent
 * Created by maxim_000 on 10/9/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    BallComponent.prototype.ballIcon = null;

    /******************* static variables *******************/
    //BallComponent.STD_WIDTH = 32;
    BallComponent.STD_WIDTH = 24;
    //BallComponent.STD_HEIGHT = 32;
    BallComponent.STD_HEIGHT = 24;

    /********************** constructor *********************/
    function BallComponent() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(BallComponent, drillEditor.BaseComponentRenderer);

    /******************** overridden methods ********************/
    p.initialize = function(){
        this.BaseComponentRenderer_initialize();

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.ballIcon = new createjs.Bitmap(drillEditor.DrillEditorApplication.loadQueue.getResult("soccer-ball-icon"));

        var rdata = this.getRendererData();

        this.ballIcon.setTransform(0,0,0.75,0.75);
        this.container.addChild(this.ballIcon);
    };

    p.render = function(){

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

    //drillEditor.BallComponent.staticFunctionName = function(param1){ //method body };


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BallComponent = createjs.promote(BallComponent,"BaseComponentRenderer");


}());