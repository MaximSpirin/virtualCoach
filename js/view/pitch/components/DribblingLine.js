/**
 * Class DribblingLine
 * Created by maxim_000 on 9/18/2015.
 */
(function (window) {
    /**************************************************** public variables *********************************************/

    //static variables


    /**************************************************** constructor **************************************************/
    function DribblingLine() {
        this.BaseComponentRenderer_constructor();
    }

    //extend this class from a superclass
    var p = createjs.extend(DribblingLine, BaseComponentRenderer);

    /************************************************* overridden methods ***********************************************/

    p.initialize = function(){
        this.BaseComponentRenderer_initialize();

        console.log("DribblingLine.initialize()");

    };

    p.getBounds = function(){
        var result = new createjs.Rectangle(this._data.position.x, this._data.position.y, this._data.width, this._data.height);
        return result;
    };

    p.initialize = function(){
        this.container = new createjs.Container();
        this.addChild(this.container);


        //TODO implement move by dragging container
    };

    p.render = function(){

        //1. take VO width and calculate segment count
        var numSegments = Math.floor(this.rendererData.lineWidth/(DribblingLineSegment.STD_WIDTH+2));
        var initX = 0;
        for(var i=0; i<numSegments; i++){
            var segment = new DribblingLineSegment("#FFFFFF");
            segment.x = initX;
            segment.setBounds(0, 0, DribblingLineSegment.STD_WIDTH, DribblingLineSegment.STD_HEIGHT);
            this.container.addChild(segment);
            initX+=DribblingLineSegment.STD_WIDTH + 2;
        }

        this.container.rotation = this.rendererData.angle;
        this.container.setBounds(0,0,numSegments * (DribblingLineSegment.STD_WIDTH + 2),DribblingLineSegment.STD_HEIGHT);

    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.DribblingLine = createjs.promote(DribblingLine,"BaseComponentRenderer");

    p.getContentBounds = function(){
        var contentPosInParentCS = this.localToLocal(this.container._bounds.x, this.container._bounds.y, this.parent);
        var result = new createjs.Rectangle(contentPosInParentCS.x, contentPosInParentCS.y, this.container._bounds.width, this.container._bounds.height);
        return result;
    };


    p.getMinimalSize = function(){
        return new createjs.Point(DribblingLineSegment.STD_WIDTH, DribblingLineSegment.STD_HEIGHT);
    };


}(window));
