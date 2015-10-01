/**
 * Class RectComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    /**************************************************** public variables *********************************************/
    RectComponent.prototype.outlineShape;

    //static variables
    RectComponent.MIN_WIDTH = 75;
    RectComponent.MIN_HEIGH = 50;

    /**************************************************** constructor **************************************************/
    function RectComponent() {
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(RectComponent, BaseComponentRenderer);

    /************************************************* overridden methods ***********************************************/

    p.initialize = function(){
        this.BaseComponentRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.addChild(this.outlineShape);

        this.widthRuler = new SizeHint();
        this.widthRuler.y = -14 - 3;
        this.addChild(this.widthRuler);

        this.heightRuler = new SizeHint();
        this.heightRuler.x = -14 - 3;
        this.heightRuler.rotation = -90;
        this.addChild(this.heightRuler);

        console.log("RectComponent.initialize()");
    };

    p.getContentBounds = function(){
        var contentPosInParentCS = this.localToLocal(0, 0, this.parent);
        var result = new createjs.Rectangle(contentPosInParentCS.x, contentPosInParentCS.y, this.rendererData.width, this.rendererData.height);
        return result;
    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();
        DrawingUtils.drawStrictSizeRectangle(this.outlineShape.graphics, 0, 0, renderData.getWidth(), renderData.getHeight(), 4, "#ffffff");
        /*this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;*/
        this.widthRuler.update(w, 14, Math.round(w * ApplicationModel.getInstance().mpp) + " m");

        this.heightRuler.update(h, 14, Math.round(h * ApplicationModel.getInstance().mpp) + " m");
        this.heightRuler.y = h;
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.RectComponent = createjs.promote(RectComponent,"BaseComponentRenderer");

    p.getMinimalSize = function(){
        return new createjs.Point(RectComponent.MIN_WIDTH, RectComponent.MIN_HEIGH);
    };


}(window));
