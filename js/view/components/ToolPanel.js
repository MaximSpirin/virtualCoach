/**
 * Class ToolPanel
 * Created by maxim_000 on 9/17/2015.
 */
(function (window) {
    //public variables
    ToolPanel.prototype.background;
    ToolPanel.prototype.componentWidth;
    ToolPanel.prototype.componentHeight;

    //static variable


    //constructor
    function ToolPanel(width, height) {
        this.Container_constructor();
        this.componentWidth = width;
        this.componentHeight = height;

        this.initialize();
    }

    var p = createjs.extend(ToolPanel, createjs.Container);

    p.initialize = function(){
        this.background = new createjs.Shape();
        this.background.graphics.beginFill("#dddddd").drawRect(0, 0, this.componentWidth, this.componentHeight);
        this.addChild(this.background);
    };

    window.ToolPanel = createjs.promote(ToolPanel,"Container");

}(window));