/**
 * Class GraphicItemVO
 * Created by maxim_000 on 9/21/2015.
 */
(function (window) {
    //public variables
    GraphicItemVO.prototype.type;
    GraphicItemVO.prototype.selected;
    GraphicItemVO.prototype.id;
    GraphicItemVO.prototype.depth;
    GraphicItemVO.prototype._width;
    GraphicItemVO.prototype._height;
    GraphicItemVO.prototype.selected;


    //static variable
    //GraphicItemVO.staticVar = "value";

    //constructor
    function GraphicItemVO(id, type, position) {
        this.EventDispatcher_constructor();

        this.id = (id!=undefined && id!=null) ? id : "" ;
        this.type = (type!=undefined && type!=null) ? type : 0;
        this.position = (position!=undefined && position!=null) ? position : null;

    }

    //extend this class from a superclass
    var p = createjs.extend(GraphicItemVO, createjs.EventDispatcher);

    // public functions
    GraphicItemVO.prototype.setSelected = function (value) {
        if(this.selected == value){
            return;
        }

        if(value){
            Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_SELECTED,{data:this}));
        }else{
            Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_DESELECTED,{data:this}));
        }

        this.selected = value;
    };

    /**
     * Sets x,y position on the screen
     * @param value A createjs.Point instance
     */
    GraphicItemVO.prototype.setPosition = function(value){
        this.position = value;
        this.dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_POSITION_CHANGED));
    };

    GraphicItemVO.prototype.getPosition = function(){
        return this.position;
    };


    GraphicItemVO.prototype.setWidth = function(value){
        if(this._width == value){
            return;
        }

        this._width = value;
    };

    GraphicItemVO.prototype.getWidth = function(){
        return this._width;
    };

    GraphicItemVO.prototype.setHeight = function(value){
        if(this._height == value){
            return;
        }

        this._height = value;
    };

    GraphicItemVO.prototype.getHeight = function(){
        return this._height;
    };

    //private functions
    //function privateFunction(param) { }

    //public static method
    //GraphicItemVO.staticFunctionName = function(param1){ //method body };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.GraphicItemVO = createjs.promote(GraphicItemVO,"EventDispatcher");

}(window));