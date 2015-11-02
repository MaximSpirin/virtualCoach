//##############################################################################
//
//##############################################################################

/**
 * Class drillEditor.ToolsPanel
 * Created by maxim_000 on 9/17/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    //public variables
    ToolsPanel.prototype.background = null;
    ToolsPanel.prototype.componentWidth = null;
    ToolsPanel.prototype.componentHeight = null;
    ToolsPanel.prototype.backButton = null;
    ToolsPanel.prototype.saveButton = null;
    ToolsPanel.prototype.dynamicButtons = null;
    ToolsPanel.prototype.dynamicButtonsInitX = null;

    //static variable
    ToolsPanel.PANEL_STD_HEIGHT = 50;
    ToolsPanel.BUTTON_INTERVAL = 10;


    //constructor
    function ToolsPanel(width, height) {
        this.Container_constructor();
        this.componentWidth = width;
        this.componentHeight = height;

        this.applicationModel = drillEditor.ApplicationModel.getInstance();
        this.initialize();
    }

    var p = createjs.extend(ToolsPanel, createjs.Container);

    p.initialize = function(){
        this.background = new createjs.Shape();
        this.background.graphics.beginFill("#dddddd").drawRect(0, 0, this.componentWidth, this.componentHeight);
        this.addChild(this.background);

        //init dynamic buttons array
        this.dynamicButtons = [];

        if(this.applicationModel.appMode == drillEditor.ApplicationModel.NEW_DRILL_APP_MODE){
            this.backButton = new drillEditor.SimpleTextButton("Back", "16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 50, 36);
            this.backButton.setBounds(0, 0, 50, 20);
            this.backButton.x = ToolsPanel.BUTTON_INTERVAL;
            this.backButton.y = 5;
            this.backButton.on("click",backClickListener,this);
            this.addChild(this.backButton);
            this.dynamicButtonsInitX = this.backButton.x + this.backButton.getBounds().width + ToolsPanel.BUTTON_INTERVAL;
        } else{
            this.dynamicButtonsInitX = ToolsPanel.BUTTON_INTERVAL;
        }



        this.swapDirectionsButton = new drillEditor.SimpleTextButton("Swap directions","16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 140, 36);
        this.swapDirectionsButton.setBounds(0,0,140,20);
        this.swapDirectionsButton.y = 5;
        this.swapDirectionsButton.on("click", swapDirectionsButtonClickHandler, this);

        this.copyButton = new drillEditor.SimpleTextButton("Copy","16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 60, 36);
        this.copyButton.setBounds(0,0,60,20);
        this.copyButton.y = 5;
        this.copyButton.on("click", copyButtonClickListener, this);

        this.deleteButton = new drillEditor.SimpleTextButton("Delete","16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 60, 36);
        this.deleteButton.setBounds(0,0,60,20);
        this.deleteButton.y = 5;
        this.deleteButton.on("click", deleteButtonClickListener, this);

        this.pasteButton = new drillEditor.SimpleTextButton("Paste","16px Arial", "#000000", "#FFFFFF", "#999999", "#0000FF", 60, 36);
        this.pasteButton.setBounds(0,0,60,20);
        this.pasteButton.y = 5;
        this.pasteButton.on("click", pasteButtonClickListener, this);

        drillEditor.Dispatcher.getInstance().on(drillEditor.ApplicationEvent.ELEMENT_SELECTED, elementSelectedHandler, this);
        drillEditor.Dispatcher.getInstance().on(drillEditor.PresentationViewEvent.ELEMENT_COPIED_TO_CLIPBOARD, elementCopiedToClipboardHandler, this);
    };


    p.updateDynamicButtons = function(selectedElementData){
        // remove existing buttons
        this.dynamicButtons.forEach(function(elem,index,sourceArray){
            if(elem.stage){
                this.removeChild(elem);
            }
        },this);
        //reset buttons array
        this.dynamicButtons = [];

        if(selectedElementData){

            switch(selectedElementData.type){
                case drillEditor.GraphicElementType.ARCUATE_MOVEMENT:
                case drillEditor.GraphicElementType.DRIBBLING_PLAYER:
                case drillEditor.GraphicElementType.PLAYER_MOVEMENT:
                case drillEditor.GraphicElementType.BALL_MOVEMENT:
                    this.dynamicButtons.push(this.swapDirectionsButton);
                    break;

            }

            this.dynamicButtons.push(this.copyButton);
            this.dynamicButtons.push(this.deleteButton);
        }

        if(drillEditor.Clipboard.data){
            this.dynamicButtons.push(this.pasteButton);
        }

        if(this.dynamicButtons.length>0){
            //reverse dyn buttons
            this.dynamicButtons.reverse();
            //add dyn buttonds to screen
            //var initX = this.backButton.x + this.backButton.getBounds().width + ToolsPanel.BUTTON_INTERVAL;
            var initX = this.dynamicButtonsInitX;
            this.dynamicButtons.forEach(function(elem, index, sourceArray){
                elem.x = initX;
                this.addChild(elem);
                initX += elem.getBounds().width + ToolsPanel.BUTTON_INTERVAL;
            },this);
        }

    };

    /********************************* event listeners **********************************/

    function backClickListener(){
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.BACK_BUTTON_CLICK));

        /*var presDTO = drillEditor.PresentationController.getInstance().getPresentationDTO();
        console.log(presDTO);*/
    }

    function copyButtonClickListener(event){
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.COPY_ELEMENT_BUTTON_CLICK));
    }

    function pasteButtonClickListener(event){
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.PASTE_ELEMENT_BUTTON_CLICK));
    }

    function elementCopiedToClipboardHandler(event){
        this.updateDynamicButtons(event.payload.data);
    }

    function elementSelectedHandler(evt){
        this.updateDynamicButtons(evt.payload.data && evt.payload.data.rendererData ? evt.payload.data.rendererData: null);
    }

    function deleteButtonClickListener(evt){
       drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.DELETE_ELEMENT));
    }

    function swapDirectionsButtonClickHandler(event){
        drillEditor.Dispatcher.getInstance().dispatchEvent(new drillEditor.PresentationViewEvent(drillEditor.PresentationViewEvent.SWAP_DIRECTIONS_BUTTON_CLICK));
    }

    drillEditor.ToolsPanel = createjs.promote(ToolsPanel,"Container");

}());
