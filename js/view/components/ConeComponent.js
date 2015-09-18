/**
 * Class ConeComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    //public variables
    ConeComponent.prototype.shape;

    //static variable
    ConeComponent.STD_WIDTH = 30;
    ConeComponent.STD_HEIGHT = 30;


    //constructor
    function ConeComponent() {
        //invoke constructor of superclass
        this.PresentationComponent_constructor();
        this.drawView();
    }

    //extend this class from a superclass
    var p = createjs.extend(ConeComponent,PresentationComponent);

    p.drawView = function(){
        this.shape = new createjs.Shape();
        this.shape.graphics.beginFill("#FFFF4C");
        this.shape.graphics.moveTo(ConeComponent.STD_WIDTH/2, 0);
        this.shape.graphics.lineTo(ConeComponent.STD_WIDTH, ConeComponent.STD_HEIGHT);
        this.shape.graphics.lineTo(0, ConeComponent.STD_HEIGHT);
        this.shape.graphics.lineTo(ConeComponent.STD_WIDTH/2, 0);
        this.addChild(this.shape);
    };


    //Make aliases for all superclass methods: SuperClass_methodName
    window.ConeComponent = createjs.promote(ConeComponent, "PresentationComponent");


}(window));