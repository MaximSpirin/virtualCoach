/**
 * Class ConeComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    /**************************************************** public variables *********************************************/
    ConeComponent.prototype.outlineShape;

    //static variables
    ConeComponent.FILL_COLOR = "#FFEA04";

    /**************************************************** constructor **************************************************/
    function ConeComponent() {
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(ConeComponent, BaseComponentRenderer);

    /************************************************* overridden methods ***********************************************/

    p.initialize = function(){
        this.BaseComponentRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.addChild(this.outlineShape);
        console.log("ConeComponent.initialize()");
    };

    p.render = function(){

        var renderData = this.getRendererData();

        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;

        var w = renderData.getWidth();
        var h = renderData.getHeight();

        this.outlineShape.graphics.beginFill(ConeComponent.FILL_COLOR);
        this.outlineShape.graphics.lineTo(0, h);
        this.outlineShape.graphics.lineTo(w, h);
        this.outlineShape.graphics.lineTo(w/2,0);
        this.outlineShape.graphics.lineTo(w/2, 0);

    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.ConeComponent = createjs.promote(ConeComponent,"BaseComponentRenderer");

    p.getMinimalSize = function(){
      //  return new createjs.Point(ConeComponent.MIN_WIDTH, ConeComponent.MIN_HEIGH);
    };


}(window));
