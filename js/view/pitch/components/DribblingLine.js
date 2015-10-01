/**
 * Class DribblingLine
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    /**************************************************** public variables *********************************************/
    DribblingLine.prototype.outlineShape;

    //static variables
    DribblingLine.MIN_WIDTH = 75;
    DribblingLine.MIN_HEIGH = 50;

    /**************************************************** constructor **************************************************/
    function DribblingLine() {
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(DribblingLine, BaseComponentRenderer);

    /************************************************* overridden methods ***********************************************/

    p.initialize = function(){
        this.BaseComponentRenderer_initialize();
        this.outlineShape = new createjs.Shape();
        this.addChild(this.outlineShape);

        console.log("DribblingLine.initialize()");

    };

    p.getBounds = function(){
        var result = new createjs.Rectangle(this._data.position.x, this._data.position.y, this._data.width, this._data.height);
        return result;
    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();
        DrawingUtils.drawStrictSizeRectangle(this.outlineShape.graphics, 0, 0, renderData.getWidth(), renderData.getHeight(), 4, "#ffffff");
        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;
        this.widthRuler.update(w, 14, Math.round(w * ApplicationModel.getInstance().mpp) + " m");

        this.heightRuler.update(h, 14, Math.round(h * ApplicationModel.getInstance().mpp) + " m");
        this.heightRuler.y = h;

    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.DribblingLine = createjs.promote(DribblingLine,"BaseComponentRenderer");

    p.getMinimalSize = function(){
        return new createjs.Point(DribblingLine.MIN_WIDTH, DribblingLine.MIN_HEIGH);
    };


}(window));
