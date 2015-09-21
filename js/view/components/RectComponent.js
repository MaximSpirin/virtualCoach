/**
 * Class RectComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    //public variables
    RectComponent.prototype.outlineShape;

    //static variable
    RectComponent.STD_WIDTH = 200;
    RectComponent.STD_HEIGHT = 100;

    //constructor
    function RectComponent() {
        this.PresentationComponent_constructor();
        //this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(RectComponent,BaseShapeRenderer);

    p.initialize = function(){
        this.PresentationComponent_initialize();

        this.componentWidth = RectComponent.STD_WIDTH;
        this.componentHeight = RectComponent.STD_HEIGHT;

        this.outlineShape = new createjs.Shape();
       // this.outlineShape.graphics.setStrokeStyle(4).beginStroke("#ffffff");
       // this.outlineShape.graphics.drawRect(0,0,RectComponent.STD_WIDTH, RectComponent.STD_HEIGHT);
        this.addChild(this.outlineShape);
        DrawingUtils.drawStrictSizeRectangle(this.outlineShape.graphics,0,0,RectComponent.STD_WIDTH, RectComponent.STD_HEIGHT,4,"#ffffff");
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.RectComponent = createjs.promote(RectComponent,"BaseShapeRenderer");


}(window));