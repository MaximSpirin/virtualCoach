/**
 * Class BallSupplyComponent
 * Created by maxim_000 on 10/9/2015.
 */
(function (window) {
    /******************* public variables *******************/
    BallSupplyComponent.prototype.ballIcon = null;

    /******************* static variables *******************/
    BallSupplyComponent.STD_WIDTH = 78;
    BallSupplyComponent.STD_HEIGHT = 26;

    /********************** constructor *********************/
    function BallSupplyComponent() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(BallSupplyComponent, BaseComponentRenderer);

    /******************** overridden methods ********************/
    p.initialize = function(){
        this.BaseComponentRenderer_initialize();

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.ballIcon = new createjs.Bitmap(Main.loadQueue.getResult("ball-supply-icon"));
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

    //BallSupplyComponent.staticFunctionName = function(param1){ //method body };


    //Make aliases for all superclass methods: SuperClass_methodName
    window.BallSupplyComponent = createjs.promote(BallSupplyComponent,"BaseComponentRenderer");


}(window));