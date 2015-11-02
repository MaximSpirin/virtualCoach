//##############################################################################
//
//##############################################################################

/**
 * Class RectVO
 * Created by maxim_000 on 9/21/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";


    //constructor
    /**
     * Model of the rectangle component
     *
     * @class RectVO
     * @param {Number} [id=0] Unique item id.
     * @param {createjs.Point} [position=null] Item position.
     * @param {Number} [width=0] Item width.
     * @param {Number} [height=0] Item height.
     * @constructor
     **/
    function RectVO(id, position, width, height) {
        //invoke constructor of superclass
        this.GraphicItemVO_constructor(id, drillEditor.GraphicElementType.RECTANGLE, position);
        this.setWidth(width);
        this.setHeight(height);
    }

    //extend this class from a superclass
    var p = createjs.extend(RectVO,drillEditor.GraphicItemVO);


    //Make aliases for all superclass methods: SuperClass_methodName
    drillEditor.RectVO = createjs.promote(RectVO,"GraphicItemVO");


}());