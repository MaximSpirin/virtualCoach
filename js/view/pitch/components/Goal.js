//##############################################################################
//
//##############################################################################

/**
 * Class Goal
 * Created by maxim_000 on 10/28/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    /******************* public variables *******************/
    //drillEditor.Goal.prototype.publicVar = "value";

    /******************* static variables *******************/
    Goal.STD_WIDTH = 65*0.75;
    Goal.STD_HEIGHT = 47*0.75;

    /********************** constructor *********************/
    function Goal() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(Goal, drillEditor.BaseComponentRenderer);

    /*********************************************** overridden methods ***********************************************/
    p.initialize = function() {
        this.BaseComponentRenderer_initialize();

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.goalIcon = new createjs.Bitmap(drillEditor.DrillEditorApplication.loadQueue.getResult("goal-component-icon"));
        this.goalIcon.setTransform(0, 0, 0.75, 0.75);
        this.goalIcon.x = -Goal.STD_WIDTH / 2;
        this.goalIcon.y = -Goal.STD_HEIGHT / 2;
        this.container.addChild(this.goalIcon);

        this.opaqueBackground = new createjs.Shape();
        this.opaqueBackground.graphics.beginFill("rgba(255,0,0,0.01)");
        this.opaqueBackground.graphics.drawRect( - Goal.STD_WIDTH/2, -Goal.STD_HEIGHT/2,Goal.STD_WIDTH, Goal.STD_HEIGHT);
        this.container.addChild(this.opaqueBackground);

        this.setBounds(-Goal.STD_WIDTH / 2, -Goal.STD_HEIGHT / 2, Goal.STD_WIDTH, Goal.STD_HEIGHT);

    };

    p.render = function(){
        this.container.rotation = this.rendererData.rotation;
    };

    p.getContentBounds = function(){
        var contentPositionInParentCS = this.localToLocal(-Goal.STD_WIDTH/2, -Goal.STD_HEIGHT/2, this.parent);
        var result = new createjs.Rectangle(contentPositionInParentCS.x,
                                                contentPositionInParentCS.y,
                                                this.rendererData.width,
                                                this.rendererData.height);
        return result;
    };

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.Goal = createjs.promote(Goal, "BaseComponentRenderer");

}());