//##############################################################################
// DrawingUtils
//##############################################################################

/**
 * Class drillEditor.DrawingUtils
 * Created by maxim_000 on 9/18/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    //constructor
    function DrawingUtils() {

    }

    DrawingUtils.drawStrictSizeRectangle = function(graphics, rectX, rectY ,resultedWidth, resultedHeight, lineSize, lineColor, lineAlpha, fillColor, fillAlpha){
        var rectStartX  = rectX + lineSize / 2;
        var rectStartY = rectY + lineSize / 2;
        var rectWidth = resultedWidth - lineSize;
        var rectHeight = resultedHeight - lineSize;
        var cornerRadius = 25;

        //trace("rectX=", rectStartX, "w=", rectWidth);

        graphics.clear();

        if (lineSize)
        {
            graphics.setStrokeStyle(lineSize);
            graphics.beginStroke(lineColor);
        }

        if (fillAlpha)
        {
            //graphics.beginFill(fillColor, fillAlpha);
            graphics.beginFill(fillColor);
        }

        if (lineSize || fillAlpha)
        {
            //graphics.drawRoundRectComplex(rectStartX, rectStartY, rectWidth, rectHeight, cornerRadius, cornerRadius, cornerRadius, cornerRadius);
            graphics.drawRect(rectStartX, rectStartY, rectWidth, rectHeight);

        }
        graphics.endFill();
    };

    drillEditor.DrawingUtils = DrawingUtils;

}());