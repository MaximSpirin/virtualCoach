/**
 * Class Editor
 * Created by maxim_000 on 9/14/2015.
 */
(function (window) {
    //public variables
    Editor.prototype.backgroundShape;
    Editor.prototype.exitButton;
    Editor.prototype.presentation;

    //static variable
    //Editor.staticVar = "value";

    //constructor
    function Editor(presentation) {

        this.presentation = presentation;

        // call constructor of the superclass
        this.AppScreen_constructor();

        //construct UI
        this.constructScreenUI();
        //initialize code
        this.initialize();

    }

    //create inheritance
    var p = createjs.extend(Editor, AppScreen);

    p.constructScreenUI = function(){
        //create bg
        this.backgroundShape = new createjs.Shape();
        this.backgroundShape.graphics.beginFill("#99CA3B").drawRect(0, 0, ApplicationModel.APP_WIDTH, ApplicationModel.APP_HEIGHT);
        this.addChild(this.backgroundShape);

        this.exitButton = new SimpleTextButton("Back", "25px Arial", "#000000" ,"#FFFFFF","#CCCCCC");
        this.exitButton.x = 10;
        this.exitButton.y = 10;
        this.exitButton.addEventListener("click",exitClickHandler);
        this.addChild(this.exitButton);

        //demo outline
        var pitchOutline = new createjs.Shape();
        pitchOutline.graphics.setStrokeStyle(1);
        pitchOutline.graphics.beginStroke("#FFFFFF").drawRect(0,0,780,400);
        pitchOutline.setBounds(10,70,780,500);
        pitchOutline.x = 10;

        pitchOutline.y = 70;
        this.addChild(pitchOutline);

        var pitchDemoText = new createjs.Text("Pitch area", "20px Arial", "#FFFFFF");
        pitchDemoText.x = pitchOutline.x + pitchOutline.getBounds().width/2 - pitchDemoText.getBounds().width/2;
        pitchDemoText.y = pitchOutline.y + pitchOutline.getBounds().height/2 - 20;
        this.addChild(pitchDemoText);

    };

    p.initialize = function(){
        if(!this.presentation.pitchWidth || !this.presentation.pitchHeight){
            //this.showForm(PitchDimensionsInput,{});

            var formElemBase = jQuery.parseHTML("<div id='pitch_dim_input_form' class='globalInputForm'/>");
            $("#appContainer").append(formElemBase);

            var headerElem = $("<h3>Please enter pitch dimensions</h3>");
            $(formElemBase).append(headerElem);


            var centerGroupDiv = jQuery.parseHTML("<div class='globalInputFormCenterGroup'/>");
            $(formElemBase).append(centerGroupDiv);


            var widthInputElem = jQuery.parseHTML("<div id='width_input_field' class='input-group globalInputField'>"+
            "<input type='text' class='form-control' placeholder='Pitch width'>" +
            "</div>");

            var heightInputElem = jQuery.parseHTML("<div id='height_input_field' class='input-group globalInputField'>" +
            "<input type='text' class='form-control' placeholder='Pitch height'>" +
            "</div>");

            //$("#pitch_dim_input_form").append(widthInputElem,heightInputElem);
            $(centerGroupDiv).append(widthInputElem,heightInputElem);

           var htmlElem = $(centerGroupDiv).get();

            var domElement = new createjs.DOMElement(htmlElem);
            this.addChild(domElement);

            console.log(domElement)

        }else{
            //TODO: visualize presentation data
        }
    };



    function exitClickHandler(evt){
        //TODO: exit properly from the edit mode - possible show an yes/no dialog
        window.main.showAppScreen(AppScreen.MAIN_MENU);
    }

    p.destroy = function(){
        this.AppScreen_destroy();

        //destroy things related to Editor
        this.exitButton.removeAllEventListeners();
        this.exitButton.destroy();

        console.log("Editor destroyed");
    };

    window.Editor = createjs.promote(Editor, "AppScreen");

}(window));