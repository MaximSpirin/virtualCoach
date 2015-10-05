/**
 * Class BaseSpriteRenderer
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    //public variables
    BaseComponentRenderer.prototype._data;
    BaseComponentRenderer.prototype.needRender;
    BaseComponentRenderer.prototype.positionChanged;
    BaseComponentRenderer.prototype._x;
    BaseComponentRenderer.prototype._y;
    BaseComponentRenderer.rendererData;
    BaseComponentRenderer.container;


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

        this.container = new createjs.Container();
        this.addChild(this.container);

        this.mouseDownHandler = this.on("mousedown", function(evt){
            Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_SELECTED,{data:this}));
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        },this);

        this.pressMoveHandler = this.on("pressmove", function(evt){
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;

            this._data.position.setValues(this.x, this.y);

            this.dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_MOVE));
        });

        console.log("BaseComponentRenderer.initialize()");
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

    p.destroy = function(){
        this.off(this.mouseDownHandler);
        this.off(this.pressMoveHandler);
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

    };

    p.addData = function(){
        //add listeners to the updated rendererData
        this._data.on(ApplicationEvent.ELEMENT_RESIZE, this.render, this);
    };


    // public functions

    //private functions
    //function privateFunction(param) { }

    //public static method
    //BaseComponentRenderer.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.BaseComponentRenderer = createjs.promote(BaseComponentRenderer,"Container");

}(window));