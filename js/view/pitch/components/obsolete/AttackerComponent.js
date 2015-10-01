/**
 * Class AttackerComponent
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    /**************************************************** public variables *********************************************/
    AttackerComponent.prototype.outlineShape;


    /**************************************************** static variables ********************************************/
    AttackerComponent.STD_RADIUS = 20;
    AttackerComponent.MIN_SIZE = 20;
    AttackerComponent.FILL_COLOR = "#382CBF";


    /**************************************************** constructor **************************************************/

    function AttackerComponent() {
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(AttackerComponent,BaseComponentRenderer);

    /************************************************* overridden methods ***********************************************/


    p.initialize = function(){
        this.BaseComponentRenderer_initialize();

        /*var zeroPoint = new createjs.Shape();
        zeroPoint.graphics.beginFill("#00FF00").drawCircle(0,0,3);
        this.addChild(zeroPoint);*/

        this.outlineShape = new createjs.Shape();
        this.container.addChild(this.outlineShape);

        console.log("AttackerComponent.initialize()");
    };

    p.render = function(){
        var renderData = this.getRendererData();
        var w = renderData.getWidth();
        var h = renderData.getHeight();

        this.x = renderData.getPosition().x;
        this.y = renderData.getPosition().y;

        this.outlineShape.graphics.clear();
        this.outlineShape.graphics.beginFill(AttackerComponent.FILL_COLOR);
        this.outlineShape.graphics.drawCircle(0, 0, w/2);
        this.outlineShape.setBounds(-w/2, -h/2, w, h);

    };

    p.getContentBounds = function(){
        var contentPosInParentCS = this.localToLocal(this.outlineShape._bounds.x, this.outlineShape._bounds.y, this.parent);
        var result = new createjs.Rectangle(contentPosInParentCS.x, contentPosInParentCS.y, this.outlineShape._bounds.width, this.outlineShape._bounds.height);
        return result;
    };


    p.getMinimalSize = function(){
        return new createjs.Point(AttackerComponent.MIN_SIZE, AttackerComponent.MIN_SIZE);
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.AttackerComponent = createjs.promote(AttackerComponent, "BaseComponentRenderer");


}(window));