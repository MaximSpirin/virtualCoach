/**
 * Class ExtraTeamComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    //public variables
    ExtraTeamComponent.prototype.shape;

    //static variable
    ExtraTeamComponent.CIRCLE_RADIUS = 15;
    ExtraTeamComponent.STD_WIDTH = 30;
    ExtraTeamComponent.STD_HEIGHT = 30;


    //constructor
    function ExtraTeamComponent() {
        //invoke constructor of superclass
        this.PresentationComponent_constructor();
        this.drawView();
    }

    //extend this class from a superclass
    var p = createjs.extend(ExtraTeamComponent,PresentationComponent);

    p.drawView = function(){
        this.shape = new createjs.Shape();
        this.shape.graphics.beginFill("#373060");
        this.shape.graphics.drawCircle(ExtraTeamComponent.CIRCLE_RADIUS,ExtraTeamComponent.CIRCLE_RADIUS,ExtraTeamComponent.CIRCLE_RADIUS);
        this.addChild(this.shape);
    };


    //Make aliases for all superclass methods: SuperClass_methodName
    window.ExtraTeamComponent = createjs.promote(ExtraTeamComponent, "PresentationComponent");


}(window));