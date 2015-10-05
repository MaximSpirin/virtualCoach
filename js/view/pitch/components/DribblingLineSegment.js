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

    //static variable
    DribblingLineSegment.STD_WIDTH = 47;
    DribblingLineSegment.STD_HEIGHT = 15;

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

        this.curveShape = new createjs.Shape();
        this.curveShape.graphics.setStrokeStyle(2);
        this.curveShape.graphics.beginStroke(this.color);
        this.curveShape.graphics.moveTo(3, f(3));

        for(var i=3; i<47; i++){
            this.curveShape.graphics.lineTo(i, f(i));
        }
        this.addChild(this.curveShape);

        this.arrowShape = new createjs.Shape();
        this.arrowShape.graphics.beginFill(this.color).moveTo(-6,7).lineTo(0,0).lineTo(-6, -7);
        this.arrowShape.rotation = -180;
        this.arrowShape.y = 2.5;
        this.arrowShape.x = 0;
        this.addChild(this.arrowShape);


        var blurFilter = new createjs.BlurFilter(1, 1, 3);
        this.curveShape.filters = [blurFilter];

        var bounds = blurFilter.getBounds();
        this.curveShape.cache(-5+bounds.x, -5+bounds.y, 10+DribblingLineSegment.STD_WIDTH, 10+DribblingLineSegment.STD_HEIGHT);

        this.setBounds(0, 0, DribblingLineSegment.STD_WIDTH, DribblingLineSegment.STD_HEIGHT);

        //this.cache(-10,-10,DribblingLineSegment.STD_WIDTH, DribblingLineSegment.STD_HEIGHT);
        //this.updateCache();
    };

    /************************************ private functions ************************************/
    function f(x) {
        //return 100*Math.sin((2*x)*3.14/180)+300;
        return -4*Math.sin((x*8)*3.14/180)+5;
    }

    //Make aliases for all superclass methods: SuperClass_methodName
    window.DribblingLineSegment = createjs.promote(DribblingLineSegment,"Container");


}(window));