/**
 * Class DribblingLineSegment
 * Created by maxim_000 on 10/5/2015.
 */
(function (window) {
    //public variables
    DribblingLineSegment.prototype.color = null;
    DribblingLineSegment.prototype.direction = null;
    DribblingLineSegment.prototype.curveShape = null;
    DribblingLineSegment.prototype.arrowShape = null;
    DribblingLineSegment.prototype.opaqueShape = null;

    //static variable
    DribblingLineSegment.STD_WIDTH = 47;
    DribblingLineSegment.STD_HEIGHT = 16;
    DribblingLineSegment.CURVE_Y = 5;

    //constructor
    function DribblingLineSegment(color, direction) {
        //invoke constructor of superclass
        this.Container_constructor();

        this.color = color;
        this.direction = direction;

        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(DribblingLineSegment, createjs.Container);

    p.initialize = function(){

        this.opaqueShape = new createjs.Shape();
        this.opaqueShape.graphics.beginFill("rgba(255,255,255,1)").drawRect(0,0,DribblingLineSegment.STD_WIDTH,DribblingLineSegment.STD_HEIGHT);
        this.opaqueShape.alpha=0.01;
        this.addChild(this.opaqueShape);

        this.curveShape = new createjs.Shape();
        this.curveShape.graphics.setStrokeStyle(3);
        this.curveShape.graphics.beginStroke(this.color);
        this.curveShape.graphics.moveTo(3, f(3));

        for(var i=3; i<DribblingLineSegment.STD_WIDTH; i++){
            this.curveShape.graphics.lineTo(i, f(i));
        }
        this.curveShape.y = DribblingLineSegment.CURVE_Y;
        this.addChild(this.curveShape);

        this.arrowShape = new createjs.Shape();
        this.arrowShape.graphics.beginFill(this.color).moveTo(6, 0).lineTo(6,14).lineTo(0,7).lineTo(6,0);
        this.addChild(this.arrowShape);


        /*this.zeroLine = new createjs.Shape();
        this.zeroLine.graphics.beginStroke("#0000FF").setStrokeStyle(1).moveTo(0,0).lineTo(DribblingLineSegment.STD_WIDTH, 0);
        this.zeroLine.graphics.moveTo(0,0).lineTo(0, DribblingLineSegment.STD_HEIGHT);
        this.addChild(this.zeroLine);*/

        var blurFilter = new createjs.BlurFilter(1, 1, 3);
        this.curveShape.filters = [blurFilter];

        var bounds = blurFilter.getBounds();
        this.curveShape.cache(-2+bounds.x, -2+bounds.y, 4+DribblingLineSegment.STD_WIDTH, 4+DribblingLineSegment.STD_HEIGHT);

        this.setBounds(0, 0, DribblingLineSegment.STD_WIDTH, DribblingLineSegment.STD_HEIGHT);

    };

    /************************************ private functions ************************************/
    function f(x) {
        return -4*Math.sin((x*8)*3.14/180) + DribblingLineSegment.CURVE_Y;
    }

    //Make aliases for all superclass methods: SuperClass_methodName
    window.DribblingLineSegment = createjs.promote(DribblingLineSegment,"Container");


}(window));