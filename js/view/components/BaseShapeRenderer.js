/**
 * Class BaseSpriteRenderer
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    //public variables
    BaseShapeRenderer.prototype._data;
    BaseShapeRenderer.prototype.needRender;
    BaseShapeRenderer.prototype.positionChanged;
    BaseShapeRenderer.prototype._x;
    BaseShapeRenderer.prototype._y;


    //static variable
    //BaseShapeRenderer.staticVar = "value";

    //constructor
    function BaseShapeRenderer() {
        //invoke constructor of superclass
        this.Shape_constructor();
        this.initialize();
    }

    //extend this class from a superclass
    var p = createjs.extend(BaseShapeRenderer,createjs.Shape);

    // protected functions
    p.render = function () {
        //to be overridden
    };

    p.initialize = function(){
        this.mouseDownHandler = this.on("mousedown", function(evt){

            /*this.selected = true;
            this.showSelection();
            Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_SELECTED,{data:this._data}));*/

            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        },this);

        this.pressMoveHandler = this.on("pressmove", function(evt){
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;
        });
    };

    p.showSelection = function(){

    };

    p.removeSelection = function(){

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

    };


    // public functions

    //private functions
    //function privateFunction(param) { }

    //public static method
    //BaseShapeRenderer.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.BaseShapeRenderer = createjs.promote(BaseShapeRenderer,"Shape");

}(window));