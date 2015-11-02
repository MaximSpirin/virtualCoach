//##############################################################################
//
//##############################################################################

/**
 * Class BaseSpriteRenderer
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    BaseComponentRenderer.prototype._data = null;
    BaseComponentRenderer.prototype.needRender = null;
    BaseComponentRenderer.prototype.positionChanged = null;
    BaseComponentRenderer.prototype._x = null;
    BaseComponentRenderer.prototype._y = null;
    BaseComponentRenderer.rendererData = null;
    BaseComponentRenderer.container = null;
    BaseComponentRenderer.dispatcher = null;


    //static variable
    //BaseComponentRenderer.staticVar = "value";

    //constructor
    function BaseComponentRenderer() {
        //invoke constructor of superclass
        this.Container_constructor();
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(BaseComponentRenderer,createjs.Container);

    // protected functions
    p.f = function () {
        //to be overridden
    };

    p.initialize = function(){

        this.dispatcher = drillEditor.Dispatcher.getInstance();

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.BaseComponentRenderer_mouseDownHandler = this.on("mousedown", function(evt){
            //console.log("mousedown");
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:this}));
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        },this);

        this.BaseComponentRenderer_pressMoveHandler = this.on("pressmove", function(evt){
            //console.log("pressmove");
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;

            this._data.position.setValues(this.x, this.y);

            this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_MOVE));
        });


    };

    p.render = function(){
        // TO BE OVERRIDDEN AND EXTENDED BY SUCCESSORS
    };

    /*
    Returns minimal size of this component in pixels
     */
    p.getMinimalSize = function(){
        //to be overridden
    };

    p.getBounds = function(){
        var result = new createjs.Rectangle(this._data.position.x, this._data.position.y, this._data.width, this._data.height);
        return result;
    };

    /**
     * Destroys all interactivity in this instance.
     * To be overridden and extended by successors.
     */
    p.destroy = function(){
        this.off("mousedown", this.BaseComponentRenderer_mouseDownHandler);
        this.off("pressmove", this.BaseComponentRenderer_pressMoveHandler);

        this.removeData();
    };

    p.setRendererData = function(value){
        if(this._data == value){
            return;
        }

        if(this._data){
            this.removeData();
        }

        this._data = value;
        this.rendererData = value;

        if(this._data){
            this.addData();
            this.invalidateGraphic();
            this.onPositionChanged();
        }

    };

    p.getRendererData = function(){
        return this._data;
    };

    p.invalidateGraphic = function(){
        this.needRender = true;
        this.render();
    };

    p.onPositionChanged = function(event){

    };

    p.removeData = function(){
        if(this._data){
            this._data.off(drillEditor.ApplicationEvent.ELEMENT_RESIZE, this.BaseComponentRenderer_elementResizeHandler);
            this._data.off(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED, this.graphicPropertyChangeHandler);
        }
    };

    p.addData = function(){
        //add listeners to the updated rendererData
        this.BaseComponentRenderer_elementResizeHandler = this._data.on(drillEditor.ApplicationEvent.ELEMENT_RESIZE, this.render, this);
        this.BaseComponentRenderer_graphicPropertyChanged = this._data.on(drillEditor.ApplicationEvent.GRAPHIC_PROPERTY_CHANGED, this.graphicPropertyChangeHandler, this);
    };

    p.graphicPropertyChangeHandler = function(evt){
        //TO BE OVERRIDDEN AND EXTENDED BY SUCCESSORS
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.BaseComponentRenderer = createjs.promote(BaseComponentRenderer,"Container");

}());