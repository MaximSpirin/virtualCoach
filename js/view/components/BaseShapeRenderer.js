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
    }

    //extend this class from a superclass
    var p = createjs.extend(BaseShapeRenderer,createjs.Shape);

    // protected functions
    BaseShapeRenderer.prototype.render = function () {
        //to be overridden
    };


    BaseShapeRenderer.setRendererData = function(value){
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

    BaseShapeRenderer.invalidateGraphic = function(){

    };

    BaseShapeRenderer.onPositionChanged = function(event){

    };

    BaseShapeRenderer.removeData = function(){

    };

    BaseShapeRenderer.addData = function(){
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