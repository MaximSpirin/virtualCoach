/**
 * Class DefenderComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    //public variables
    DefenderComponent.prototype.shape;

    //static variable
    DefenderComponent.CIRCLE_RADIUS = 15;
    DefenderComponent.STD_WIDTH = 30;
    DefenderComponent.STD_HEIGHT = 30;


    //constructor
    function DefenderComponent() {
        //invoke constructor of superclass
        this.PresentationComponent_constructor();
        this.drawView();
    }

    //extend this class from a superclass
    var p = createjs.extend(DefenderComponent,PresentationComponent);

    p.drawView = function(){
        this.shape = new createjs.Shape();
        this.shape.graphics.beginFill("#FF0000");
        this.shape.graphics.drawCircle(DefenderComponent.CIRCLE_RADIUS,DefenderComponent.CIRCLE_RADIUS,DefenderComponent.CIRCLE_RADIUS);
        this.addChild(this.shape);
    };


    //Make aliases for all superclass methods: SuperClass_methodName
    window.DefenderComponent = createjs.promote(DefenderComponent, "PresentationComponent");


}(window));