/**
 * Class AttackerComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    //public variables
    AttackerComponent.prototype.shape;

    //static variable
    AttackerComponent.CIRCLE_RADIUS = 15;
    AttackerComponent.STD_WIDTH = 30;
    AttackerComponent.STD_HEIGHT = 30;


    //constructor
    function AttackerComponent() {
        //invoke constructor of superclass
        this.PresentationComponent_constructor();
        this.drawView();
    }

    //extend this class from a superclass
    var p = createjs.extend(AttackerComponent,PresentationComponent);

    p.drawView = function(){
        this.shape = new createjs.Shape();
        this.shape.graphics.beginFill("#382CBF");
        this.shape.graphics.drawCircle(AttackerComponent.CIRCLE_RADIUS,AttackerComponent.CIRCLE_RADIUS,AttackerComponent.CIRCLE_RADIUS);
        this.addChild(this.shape);
    };


    //Make aliases for all superclass methods: SuperClass_methodName
    window.AttackerComponent = createjs.promote(AttackerComponent, "PresentationComponent");


}(window));