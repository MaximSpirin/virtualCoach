/**
 * Class ArchedArrow
 * Created by maxim_000 on 9/27/2015.
 */
(function (window) {
    /************************************************* public variables ***********************************************/
    ArchedArrow.prototype.arcShape = null;
    ArchedArrow.prototype.arrowShape = null;
    ArchedArrow.prototype.container = null;
    ArchedArrow.prototype.opaqueBackground = null;

    /************************************************* static variables ***********************************************/
    ArchedArrow.STD_WIDTH = 60;
    ArchedArrow.STD_HEIGHT = 24;
    ArchedArrow.STROKE_SIZE = 3;
    ArchedArrow.STROKE_COLOR = "#ffffff";

    /************************************************** constructor ***************************************************/
    function ArchedArrow() {
        //invoke constructor of superclass
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(ArchedArrow, BaseComponentRenderer);

    /*********************************************** overridden methods ***********************************************/
    p.initialize = function(){
        this.BaseComponentRenderer_initialize();

        this.container = new createjs.Container();
        /*this.container.regX = -ArchedArrow.STD_WIDTH / 2;
        this.container.regY = -ArchedArrow.STD_HEIGHT / 2;*/
        this.addChild(this.container);

        this.opaqueBackground = new createjs.Shape();
        this.opaqueBackground.graphics.beginFill("rgba(255,0,0,0.01)");
        this.opaqueBackground.graphics.drawRect( - ArchedArrow.STD_WIDTH/2, -ArchedArrow.STD_HEIGHT/2,ArchedArrow.STD_WIDTH, ArchedArrow.STD_HEIGHT);
        this.container.addChild(this.opaqueBackground);

        this.arcShape = new createjs.Shape();
        this.container.addChild(this.arcShape);

        this.startPoint = new createjs.Point( ArchedArrow.STD_WIDTH/2, ArchedArrow.STD_HEIGHT/2);
        this.endPoint = new createjs.Point( - ArchedArrow.STD_WIDTH/2, ArchedArrow.STD_HEIGHT/2);
        this.cp1 = new createjs.Point(this.startPoint.x - 10, -ArchedArrow.STD_HEIGHT/2-6);
        this.cp2 = new createjs.Point(this.endPoint.x + 10, -ArchedArrow.STD_HEIGHT/2-6);

        /*this.startPoint = new createjs.Point( ArchedArrow.STD_WIDTH, ArchedArrow.STD_HEIGHT);
        this.endPoint = new createjs.Point( 0, ArchedArrow.STD_HEIGHT);
        this.cp1 = new createjs.Point(this.startPoint.x - 10, -6);
        this.cp2 = new createjs.Point(this.endPoint.x + 10, -6);*/


        this.arcShape.graphics.setStrokeStyle(ArchedArrow.STROKE_SIZE);
        this.arcShape.graphics.beginStroke(ArchedArrow.STROKE_COLOR);
        this.arcShape.graphics.moveTo(this.startPoint.x, this.startPoint.y);
        this.arcShape.graphics.bezierCurveTo(this.cp1.x, this.cp1.y, this.cp2.x, this.cp2.y, this.endPoint.x, this.endPoint.y);

        this.arrowShape = new createjs.Shape();
        this.arrowShape.graphics.beginFill("#ffffff").moveTo(-6,7).lineTo(1,0).lineTo(-6, -7);
        this.container.addChild(this.arrowShape);

        this.drawArrow(Math.atan2((this.endPoint.y - this.cp2.y),(this.endPoint.x - this.cp2.x)));

        /*var demoShape = new createjs.Shape();
        demoShape.graphics.beginFill("#00FF00").drawCircle(0,0,5);
        demoShape.x = 0;
        demoShape.y = 0;
        this.addChild(demoShape);*/


        this.setBounds(-ArchedArrow.STD_WIDTH / 2,-ArchedArrow.STD_HEIGHT / 2, ArchedArrow.STD_WIDTH, ArchedArrow.STD_HEIGHT);



        console.log("ArchedArrow.initialize()");

    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();

        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;

        this.container.rotation = this.getRendererData().rotation;
    };

    p.drawArrow = function(radian){
        var degree = (radian/ Math.PI * 180) + 10;
        this.arrowShape.x = this.endPoint.x;
        this.arrowShape.y = this.endPoint.y;
        this.arrowShape.rotation = degree;
    };

    p.getContentBounds = function(){
        var contentPosInParentCS = this.localToLocal(- ArchedArrow.STD_WIDTH/2, - ArchedArrow.STD_HEIGHT/2, this.parent);
        var result = new createjs.Rectangle(contentPosInParentCS.x, contentPosInParentCS.y, this.rendererData.width, this.rendererData.height);
        return result;
    };

    /************************************************* public methods *************************************************/




    /************************************************** event handlers ************************************************/




    /************************************************** static methods ************************************************/

    //Make aliases for all superclass methods: SuperClass_methodName
    window.ArchedArrow = createjs.promote(ArchedArrow,"BaseComponentRenderer");

}(window));