//##############################################################################
//
//##############################################################################

/**
 * Class GraphicItemVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    //constructor
    function GraphicItemVO(id, type, position) {
        this.EventDispatcher_constructor();

        this.id = (id!=undefined && id!=null) ? id : "" ;
        this.type = (type!=undefined && type!=null) ? type : 0;
        this.position = (position!=undefined && position!=null) ? position : null;
        //this.rotation = 0;
    }

    //extend this class from a superclass
    var p = createjs.extend(GraphicItemVO, createjs.EventDispatcher);

    // public functions
    p.setSelected = function (value) {
        if(this.selected == value){
            return;
        }

        if(value){
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_SELECTED,{data:this}));
        } else {
            drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_DESELECTED,{data:this}));
        }

        this.selected = value;
    };

    /**
     * Sets x,y position on the screen
     * @param value A createjs.Point instance
     */
    p.setPosition = function(value){
        this.position = value;
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_POSITION_CHANGED));
    };

    p.getPosition = function(){
        return this.position;
    };


    p.setWidth = function(value){
        if(this.width == value){
            return;
        }

        this.width = value;
    };

    p.getWidth = function(){
        return this.width;
    };

    p.setHeight = function(value){
        if(this.height == value){
            return;
        }

        this.height = value;
    };

    p.getHeight = function(){
        return this.height;
    };

    p.resize = function(w, h){
        this.width = w;
        this.height = h;
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_RESIZE));
    };

    p.setRotation = function(value, changedByUser){
        this.rotation = value;
        this.dispatchEvent(new drillEditor.ApplicationEvent(drillEditor.ApplicationEvent.ELEMENT_ROTATION_CHANGED));
    };

    p.getDTO = function(){

    };

    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.GraphicItemVO = createjs.promote(GraphicItemVO,"EventDispatcher");

}());