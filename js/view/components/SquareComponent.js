/**
 * Class SquareComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    //public variables
    SquareComponent.prototype.outlineShape;

    //static variable
    SquareComponent.STD_WIDTH = 200;
    SquareComponent.STD_HEIGHT = 200;

    //constructor
    function SquareComponent() {
        this.PresentationComponent_constructor();
        //this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(SquareComponent,PresentationComponent);

    p.initialize = function(){
        this.PresentationComponent_initialize();

        this.outlineShape = new createjs.Shape();
        this.outlineShape.graphics.setStrokeStyle(4).beginStroke("#ffffff");
        this.outlineShape.graphics.drawRect(0,0,SquareComponent.STD_WIDTH, SquareComponent.STD_HEIGHT);
        this.addChild(this.outlineShape);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.SquareComponent = createjs.promote(SquareComponent,"PresentationComponent");


}(window));