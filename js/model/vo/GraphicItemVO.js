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
    GraphicItemVO.prototype.width;
    GraphicItemVO.prototype.height;
    GraphicItemVO.prototype.selected;
    GraphicItemVO.prototype.rotation;


    //static variable
    //GraphicItemVO.staticVar = "value";

    //constructor
    function GraphicItemVO(id, type, position) {
        this.EventDispatcher_constructor();

        this.id = (id!=undefined && id!=null) ? id : "" ;
        this.type = (type!=undefined && type!=null) ? type : 0;
        this.position = (position!=undefined && position!=null) ? position : null;
        this.rotation = 0;
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
        if(this.width == value){
            return;
        }

        this.width = value;
    };

    GraphicItemVO.prototype.getWidth = function(){
        return this.width;
    };

    GraphicItemVO.prototype.setHeight = function(value){
        if(this.height == value){
            return;
        }

        this.height = value;
    };

    GraphicItemVO.prototype.getHeight = function(){
        return this.height;
    };

    GraphicItemVO.prototype.resize = function(w, h){
        this.width = w;
        this.height = h;
        this.dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_RESIZE));
    };

    GraphicItemVO.prototype.setRotation = function(value, changedByUser){
        this.rotation = value;
        this.dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_ROTATION_CHANGED));
    };

    //Make aliases for all superclass methods: SuperClass_methodName
    window.GraphicItemVO = createjs.promote(GraphicItemVO,"EventDispatcher");

}(window));