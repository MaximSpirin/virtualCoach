//#########################################
// drillEditorApplication.js
//#########################################
this.drillEditor = this.drillEditor||{};

(function(){
  "use strict";

  /******************************************* public vars *********************************************/
  DrillEditorApplication.prototype.currentScreen = null;
  DrillEditorApplication.prototype.stage = null;
  DrillEditorApplication.prototype.presentationController = null;
  DrillEditorApplication.model = null;

  /******************************************* constructor ********************************************/

  function DrillEditorApplication(){

      this.Container_constructor();

      //init model
      this.applicationModel = ApplicationModel.getInstance();


      //service locator
      //this.serviceLocator = ServiceLocator.getInstance();

      //dispatcher
      this.eventDispatcher = Dispatcher.getInstance();

      //init presentation controller
      this.presentationController = PresentationController.getInstance();

      //add callback to proxy
      DrillEditorProxy.getDrillDataCallback = getDrillDataCallback;


      //subscribe to dispatcher events
      //window.eventDispatcher.on(ApplicationEvent.SHOW_EDITOR, showEditorHandler, this);
      this.eventDispatcher.on(ApplicationEvent.NEW_DRILL_BUTTON_CLICK, newDrillButtonClickHandler, this);
      this.eventDispatcher.on(ApplicationEvent.SHOW_SCREEN, showScreenHandler, this);
      this.eventDispatcher.on(ApplicationEvent.MAIN_MENU_LOAD_DRILL_CLICK, mainMenuLoadDrillClick, this);
      this.eventDispatcher.on(ApplicationEvent.LOAD_DRILL_BUTTON_CLICK, loadDrillFormLoadButtonClick, this);


      //create and init easeljs stage
      window.stage = new createjs.Stage("appCanvas");

      //proxy touch events(if running on touch device) into mouse events
      createjs.Touch.enable(window.stage);
      window.stage.mouseMoveOutside = true;

      //var supported = createjs.Touch.isSupported();
      //console.log('Touch supported = ',supported);

      //stage will call update() on every tick ie each 1/30 sec
      createjs.Ticker.addEventListener("tick", this.onTickHandler);

      window.stage.addChild(this);

      this.loadExternalAssets();

  }

  var p = createjs.extend(DrillEditorApplication, createjs.Container);

  /********************************** event handlers and callbacks *************************************/

  function getDrillDataCallback() {
      var presentationDTO = PresentationController.getInstance().getPresentationDTO();
      return presentationDTO;
  }

  function showScreenHandler(event){
      var screenId = event.payload.screenId;
      var params = event.payload.initParams;
      this.showAppScreen(screenId, params);
  }

  function newDrillButtonClickHandler(event){
     this.presentationController.createEmptyPresentation();
     this.showAppScreen(AppScreen.EDITOR);
  }

  function loadDrillFormLoadButtonClick(event) {
      var drillId = event.payload.drillId;
      //show progress bar form
      this.currentScreen.showForm(ProgressBarForm,{headerText:"Loading you drill..."});

      DrillEditorProxy.getDrillDataById(drillId, getDrillDataSuccess, getDrillDataFailure, this);


      function getDrillDataSuccess(drillDTO){
          this.presentationController.loadPresentation(drillDTO);
          this.showAppScreen(AppScreen.EDITOR);//  scope.currentScreen.removeForm();
      }

      function getDrillDataFailure(){
          this.currentScreen.removeForm();
          //TODO - show error message panel
      }
  }

  function mainMenuLoadDrillClick(event){
      this.currentScreen.showForm(ProgressBarForm,{headerText:"Loading your saved drills..."});
      DrillEditorProxy.getSavedDrills(getSavedDrillsSuccess, getSavedDrillsFailure, this);

      function getSavedDrillsSuccess(drills){
          console.log("Successfully loaded drills");
          ApplicationModel.getInstance().savedDrills = drills;
          this.currentScreen.removeForm();
          this.currentScreen.showForm(LoadDrillView,{
              positiveCallback: null,
              negativeCallback: null,
              callbackScope: this
          });
      }

      function getSavedDrillsFailure(errorMessage){
          console.log("Failed to load drills",errorMessage);
          this.currentScreen.removeForm();
          this.currentScreen.showForm(ErrorDialogForm,{
              errorMessage: errorMessage,
              positiveCallback: null,
              negativeCallback: null,
              callbackScope: this
          });
      }
  }

  DrillEditorApplication.prototype.onTickHandler = function(){
      if(this.stage){
          this.stage.update();
          // console.log("stage update!");
      }
  };

  DrillEditorApplication.prototype.onAssetLoadComplete = function(evt){
      this.applicationModel.assetsLoaded = true;
      console.log('Application assets loaded!');

      if(DrillEditorProxy.drillStartupData){
          this.applicationModel.appMode = ApplicationModel.EDIT_DRILL_APP_MODE;
          PresentationController.getInstance().loadPresentation(DrillEditorProxy.drillStartupData);
          this.showAppScreen(AppScreen.EDITOR);
      } else {
          this.applicationModel.appMode = ApplicationModel.NEW_DRILL_APP_MODE;
          this.showAppScreen(AppScreen.MAIN_MENU);
      }

  };

  DrillEditorApplication.prototype.onAssetLoadFailure = function(evt){
      this.applicationModel.assetsLoaded = false;
      console.log('Failed to load application assets!');
  };
  /**************************************** public function ******************************************/

  DrillEditorApplication.prototype.showAppScreen = function(screenID, initParams){
      //get screen init params if available
      var screenClass;

      // 1. remove prev screen and dispose it
      if(this.currentScreen && this.currentScreen.stage){
          this.currentScreen.destroy();
          this.removeChild(this.currentScreen);
      }

      // 2. define class for the new screen
      switch(screenID){
          case AppScreen.MAIN_MENU:
              screenClass = MainMenuScreen;
              break;

          case AppScreen.EDITOR:
              screenClass = Editor;
              break;
      }

      // 3. instantiate new screen and add it to display list
      if(!screenClass){
          console.error("Error: cant create a new app screen as screenClass in undefined!");
          return;
      }


      this.currentScreen = initParams ? new screenClass(initParams) : new screenClass();
      this.addChild(this.currentScreen);
  };

  DrillEditorApplication.prototype.loadExternalAssets = function(){
      //load all external files required by app
      var manifest = [
          {id:"main-menu-background", src:"img/background_2_800_600.jpg", type:createjs.AbstractLoader.IMAGE},
          {id:"rotation-icon", src:"img/rotating22.png", type:createjs.AbstractLoader.IMAGE},
          {id:"soccer-ball-icon", src:"img/soccer-ball-icon-32.png", type:createjs.AbstractLoader.IMAGE},
          {id:"ball-supply-icon", src:"img/ball-supply-icon-26.png", type:createjs.AbstractLoader.IMAGE},
          {id:"goal-component-icon", src:"img/goal_65_47.png", type:createjs.AbstractLoader.IMAGE}
      ];

      DrillEditorApplication.loadQueue = new createjs.LoadQueue(false, null, true);
      DrillEditorApplication.loadQueue.on("complete", this.onAssetLoadComplete, this);
      DrillEditorApplication.loadQueue.on("error", this.onAssetLoadFailure, this);
      DrillEditorApplication.loadQueue.loadManifest(manifest);
  };


  /**************************************** public static properties ************************************************/
  DrillEditorApplication.loadQueue = null;

  /********************************************** static methods ****************************************************/


  drillEditor.DrillEditorApplication =  DrillEditorApplication;
}());

//#########################################
// PresentationController.js
//#########################################
this.drillEditor = this.drillEditor||{};

(function() {
	"use strict";

  //public variables
  PresentationController.prototype.presentation = null;
  PresentationController.prototype.presentationView = null;
  PresentationController.prototype.dispatcher = null;
  //PresentationController.prototype.elements = null;
  PresentationController.prototype.selectedElement = null;
  PresentationController.prototype.componentsPallete = null;

  //static variable
  PresentationController.instance = null;

  /******************************************* constructor ****************************************/
  function PresentationController() {

      if(PresentationController.instance){
          throw new Error("Only one instance of PresentationController is allowed!");
      }

      initialize.call(this);
  }

  /**************************************** public methods ****************************************/

  /**
   * Sets presentation view ie Pitch instance
   * @param value
   */
  PresentationController.prototype.setView = function(value){
      this.presentationView = value;


  };
  /**
   * Creates a blank presentation and assigns it to presentation var
   */
  PresentationController.prototype.createEmptyPresentation = function(){
      this.presentation = new Presentation(Presentation.DEFAULT_ID);
  };


  /**
   * Sets current presentation
   * @param value
   */
  PresentationController.prototype.loadPresentation = function (presentationDTO) {
      this.presentation = DTOUtils.presentationDTOToVO(presentationDTO);

      this.selectedElement = null;

  };

  /**
   * Returns DTO of the current presentation.
   */
  PresentationController.prototype.getPresentationDTO = function(){

      if(!this.presentation){
          return null;
      }

      var canvas = document.getElementById('appCanvas');
      var imageDataString = null;
      var imageDataFormatPrefix = "data:image/png;base64,";

      if(this.presentationView){

          Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_SELECTED,{data:null}));
          window.stage.update();

          imageDataString = CanvasUtils.getCanvasSegmentData(canvas,
              this.presentationView.x,
              this.presentationView.y,
              this.presentationView.componentWidth,
              this.presentationView.componentHeight);

              //cut "data:image/png;base64," from the data string
              var dataFormatIndex = imageDataString.indexOf(imageDataFormatPrefix);

              if(dataFormatIndex>=0){
                  imageDataString = imageDataString.substr(dataFormatIndex + imageDataFormatPrefix.length);
              }
      }

      var presentationDTO = DTOUtils.presentationToDTO(this.presentation);
      presentationDTO.drillImageData = imageDataString ;
      presentationDTO.drillImageFormat = imageDataString ? imageDataFormatPrefix : null;
      return presentationDTO;
  };

  /*************************************** private functions *************************************/
  function initialize() {
      //init dispatcher
      this.dispatcher = Dispatcher.getInstance();
      this.dispatcher.on(PresentationViewEvent.CREATE_RECTANGLE_CLICK, createRectangleClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_SQUARE_CLICK, createSquareClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_ATTACKER_CLICK, createAttackerClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_DEFENDER_CLICK, createDefenderClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_EXTRA_TEAM_CLICK, createExtraClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_NEUTRAL_PLAYER_CLICK, createNeutralPlayerClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_CONE_CLICK, createConeClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_PLAYER_PATH_CLICK, createPlayerPathClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_BALL_PATH_CLICK, createBallPathClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_BALL_CLICK, createBallClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_BALLS_SUPPLY_CLICK, createBallsSupplyClickHandler , this);
      this.dispatcher.on(PresentationViewEvent.CREATE_ARC_CLICK, createArcClickHandler, this);
      this.dispatcher.on(PresentationViewEvent.CREATE_DRIBBLING_CLICK, createDribblingClickHandler, this);
      this.dispatcher.on(PresentationViewEvent.CREATE_GOAL_CLICK, createGoalClickHandler, this);

      this.dispatcher.on(PresentationViewEvent.COPY_ELEMENT_BUTTON_CLICK, copyElementClickHandler, this);
      this.dispatcher.on(PresentationViewEvent.PASTE_ELEMENT_BUTTON_CLICK, pasteElementClickHandler, this);
      this.dispatcher.on(PresentationViewEvent.BACK_BUTTON_CLICK, backButtonClickHandler, this);

      this.dispatcher.on(ApplicationEvent.ELEMENT_SELECTED, elementSelectedHandler, this);
      this.dispatcher.on(PresentationViewEvent.DELETE_ELEMENT, deleteElementHandler, this);
      this.dispatcher.on(PresentationViewEvent.SWAP_DIRECTIONS_BUTTON_CLICK, swapDirectionsClickHandler, this);
      this.dispatcher.on(ApplicationEvent.PITCH_VIEW_CREATED, pitchViewCreatedHandler, this);

  }

  function getElementDefaultPosition(width, height){
      var result = new createjs.Point(this.presentationView.componentWidth/2 - width/2, this.presentationView.componentHeight/2 - height/2);
      return result;
  }

  function addItemByModel(itemModel, addedByUser) {
      var elementRenderer = createElementRenderer(itemModel);
      elementRenderer.x = itemModel.position.x;
      elementRenderer.y = itemModel.position.y;
      if(addedByUser){
          this.presentationView.elementsLayer.addChild(elementRenderer);
          itemModel.depth = this.presentationView.elementsLayer.numChildren - 1;
          Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_SELECTED,{data:elementRenderer}));
          this.presentation.elements.push(itemModel);
      } else {
          var depth = Math.min(itemModel.depth, this.presentationView.elementsLayer.numChildren);
          this.presentationView.elementsLayer.addChildAt(elementRenderer, depth);
      }

      this.actualizePlayerNumbers();
      //this.elements.push(elementRenderer);

      this.presentationView.elementsLayer.addChild(this.transformTool);
  };

  function createElementRenderer(elementVO){
      switch (elementVO.type){
          case GraphicElementType.RECTANGLE:
              result = new RectComponent();
              break;

          case GraphicElementType.SQUARE:
              result = new SquareComponent();
              break;

          case GraphicElementType.ATTACKER:
          case GraphicElementType.DEFENDER:
          case GraphicElementType.EXTRA_TEAM:
          case GraphicElementType.NEUTRAL_PLAYER:
          case GraphicElementType.CONE:
              result = new PrimitiveShapeRenderer();
              break;

          case GraphicElementType.DRIBBLING_PLAYER:
              result = new DribblingLine();
              break;

          case GraphicElementType.PLAYER_MOVEMENT:
              result = new PlayerMovementLine();
              break;

          case GraphicElementType.BALL_MOVEMENT:
              result = new BallMovementLine();
              break;

          case GraphicElementType.BALL:
              result = new BallComponent();
              break;

          case GraphicElementType.BALLS_SUPPLY:
              result = new BallSupplyComponent();
              break;

          case GraphicElementType.ARCUATE_MOVEMENT:
              result = new ArchedArrow();
              break;

          case GraphicElementType.GOAL:
              result = new Goal();
              break;
      }

      var result;
      result.setRendererData(elementVO);

      return result;
  }

  PresentationController.prototype.cloneElementData = function (sourceElementData){

      var clonedElementData;
      var newId = createjs.UID.get();
      var clonedWidth =  sourceElementData.width;
      var clonedHeight =  sourceElementData.height;
      var clonedPosition = new createjs.Point(sourceElementData.position.x, sourceElementData.position.y);
      //TODO: optimize this
      clonedPosition.x+=10;
      clonedPosition.y+=10;


      var clonedRotation = sourceElementData.rotation;

      switch (sourceElementData.type){

          case GraphicElementType.RECTANGLE:
              clonedElementData = new RectVO(newId, clonedPosition, clonedWidth, clonedHeight);
              break;

          case GraphicElementType.SQUARE:
              clonedElementData = new SquareVO(newId, clonedPosition, clonedWidth, clonedHeight);
              break;


          case GraphicElementType.ATTACKER:
              clonedElementData = new AttackerVO(newId, clonedPosition, sourceElementData.radius);
              clonedElementData.fillColor = sourceElementData.fillColor;
              break;

          case GraphicElementType.DEFENDER:
              clonedElementData = new DefenderVO(newId, clonedPosition, sourceElementData.radius);
              clonedElementData.fillColor = sourceElementData.fillColor;
              break;

          case GraphicElementType.EXTRA_TEAM:
              clonedElementData = new ExtraTeamVO(newId, clonedPosition, sourceElementData.radius);
              clonedElementData.fillColor = sourceElementData.fillColor;
              break;

          case GraphicElementType.NEUTRAL_PLAYER:
              clonedElementData = new NeutralVO(newId, clonedPosition, sourceElementData.radius);
              clonedElementData.fillColor = sourceElementData.fillColor;
              break;

          case GraphicElementType.CONE:
              clonedElementData = new ConeVO(newId, clonedPosition, clonedWidth, clonedHeight);
              clonedElementData.fillColor = sourceElementData.fillColor;
              break;

          case GraphicElementType.ARCUATE_MOVEMENT:
              clonedElementData = new ArchedArrowVO(newId, clonedPosition,
                  clonedWidth, clonedHeight,
                  sourceElementData.arrowDirection, clonedRotation);
              break;

          case GraphicElementType.GOAL:
              clonedElementData = new GoalVO(newId,clonedPosition,clonedWidth, clonedHeight, clonedRotation);
              break;

          case GraphicElementType.DRIBBLING_PLAYER:
              var startPointCloned = new createjs.Point(sourceElementData.startPoint.x + 16, sourceElementData.startPoint.y + 16);
              var endPointCloned = new createjs.Point(sourceElementData.endPoint.x + 16, sourceElementData.endPoint.y + 16);
              clonedElementData = new DribblingLineVO(newId, startPointCloned, endPointCloned, sourceElementData.arrowDirection);
              break;

          case GraphicElementType.PLAYER_MOVEMENT:
              var startPointCloned = new createjs.Point(sourceElementData.startPoint.x + 16, sourceElementData.startPoint.y + 16);
              var endPointCloned = new createjs.Point(sourceElementData.endPoint.x + 16, sourceElementData.endPoint.y + 16);
              clonedElementData = new PlayerMovementVO(newId, startPointCloned, endPointCloned, sourceElementData.arrowDirection);
              break;

          case GraphicElementType.BALL_MOVEMENT:
              var startPointCloned = new createjs.Point(sourceElementData.startPoint.x + 16, sourceElementData.startPoint.y + 16);
              var endPointCloned = new createjs.Point(sourceElementData.endPoint.x + 16, sourceElementData.endPoint.y + 16);
              clonedElementData = new BallMovementVO(newId, startPointCloned, endPointCloned, sourceElementData.arrowDirection);
              break;

          case GraphicElementType.BALL:
              clonedElementData = new BallVO(newId, clonedPosition);
              break;

          case GraphicElementType.BALLS_SUPPLY:
              clonedElementData = new BallSupplyVO(newId, clonedPosition);
              break;

      }


      return clonedElementData
  };



  PresentationController.prototype.actualizePlayerNumbers = function(){
      this.presentation.elements.sort(MathUtils.compareNumeric);



      var atackersCount = 0;
      var defendersCount = 0;
      var extraCount = 0

      for(var j=0; j<this.presentation.elements.length; j++){
          var elementVO = this.presentation.elements[j];

          switch(elementVO.type){
              case GraphicElementType.ATTACKER:
                      atackersCount +=1;
                      elementVO.setPlayerNumber(atackersCount)
                  break;
                  case GraphicElementType.DEFENDER:
                      defendersCount +=1;
                      elementVO.setPlayerNumber(defendersCount)
                  break;
                  case GraphicElementType.EXTRA_TEAM:
                      extraCount +=1;
                      elementVO.setPlayerNumber(extraCount);
                  break;
          }

      }


      /*var playerNumber=1;
      for(var j=0; j<this.presentation.elements.length; j++){
          var elementVO = this.presentation.elements[j];
          if(elementVO.isPlayer && elementVO.type != GraphicElementType.NEUTRAL_PLAYER){
              elementVO.setPlayerNumber(playerNumber);
              playerNumber++;
          }
      }*/
  };

  /*************************************** event handler *****************************************/

  function pitchViewCreatedHandler(event){
      for(var i=0; i<this.presentation.elements.length; i++){
          var elementVO = this.presentation.elements[i];
          addItemByModel.call(this,elementVO,false);
      }
  }

  function swapDirectionsClickHandler(evt){
      if(this.selectedElement){
          this.selectedElement.rendererData.invertArrowDirection();
      }
  }

  function deleteElementHandler(evt){
      if(this.selectedElement){
          // 1. destroy element
          this.selectedElement.destroy();

          // 2. remove it from screen and from elements array
          if(this.selectedElement.stage){
              this.presentationView.elementsLayer.removeChild(this.selectedElement);
              var elementDataIndex = this.presentation.elements.indexOf(this.selectedElement.rendererData);//TODO substitute with Presentation.removeElementById
              this.presentation.elements.splice(elementDataIndex, 1);
          }

          // loop between VOs and update their depths according to the depth of the views
          for(var i=0; i<this.presentationView.elementsLayer.numChildren; i++){
              var childElement = this.presentationView.elementsLayer.getChildAt(i);
              childElement.rendererData.depth = i;


                 /* console.info("element %d typeof %d has index of %d",
                  childElement.rendererData.id, childElement.rendererData.type,
                  childElement.rendererData.depth);*/
          }

          this.actualizePlayerNumbers();

          this.selectedElement = null;

          //3. remove selection
          Dispatcher.getInstance().dispatchEvent(new ApplicationEvent(ApplicationEvent.ELEMENT_SELECTED,{data:null}));
      }
  }

  function elementSelectedHandler(evt){
      this.selectedElement = evt.payload.data;
  }

  function createRectangleClickHandler(event){
      var defaultRectangleWidth = 200;
      var defaultRectangleHeight = 100;
      var elemId = createjs.UID.get();
      var elemPosition = getElementDefaultPosition.call(this, defaultRectangleWidth, defaultRectangleHeight);
      var elementRendererData = new RectVO(elemId, elemPosition, defaultRectangleWidth, defaultRectangleHeight);
      addItemByModel.call(this, elementRendererData, true);
  }

  function createSquareClickHandler(presentationViewEvent){
      var defaultSquareWidth = 150;
      var defaultSquareHeight = 150;
      var elemId = createjs.UID.get();
      var elemPosition = getElementDefaultPosition.call(this, defaultSquareWidth, defaultSquareHeight);
      var elementRendererData = new SquareVO(elemId, elemPosition, defaultSquareWidth, defaultSquareHeight);
      addItemByModel.call(this, elementRendererData, true);
  }

  function createAttackerClickHandler(presentationViewEvent) {
      var defaultRadius = PrimitiveShapeRenderer.CIRCLE_COMPONENT_MIN_RADIUS;
      var elemId = createjs.UID.get();
      var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
      var elementRendererData = new AttackerVO(elemId, elemPosition, defaultRadius);
      elementRendererData.fillColor = "#382CBF";
      addItemByModel.call(this, elementRendererData, true);
  }

  function createDefenderClickHandler(presentationViewEvent) {
      var defaultRadius = 20;
      var elemId = createjs.UID.get();
      var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
      var elementRendererData = new DefenderVO(elemId, elemPosition, defaultRadius);
      elementRendererData.fillColor = "#F21818";
      addItemByModel.call(this, elementRendererData, true);
  }

  function createExtraClickHandler(presentationViewEvent) {
      var defaultRadius = 20;
      var elemId = createjs.UID.get();
      var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
      var elementRendererData = new ExtraTeamVO(elemId, elemPosition, defaultRadius);
      elementRendererData.fillColor = "#373060";
      addItemByModel.call(this, elementRendererData, true);
  }

  function createNeutralPlayerClickHandler(presentationViewEvent) {
      var defaultRadius = 20;
      var elemId = createjs.UID.get();
      var elemPosition = getElementDefaultPosition.call(this, defaultRadius*2, defaultRadius*2);
      var elementRendererData = new NeutralVO(elemId, elemPosition, defaultRadius);
      elementRendererData.fillColor = "#085429";
      addItemByModel.call(this, elementRendererData, true);
  }

  function createConeClickHandler(presentationViewEvent) {
      var defaultTriangleWidth = 30;
      var defaultTriangleHeight = 35;
      var elemId = createjs.UID.get();
      var elemPosition = getElementDefaultPosition.call(this, defaultTriangleWidth, defaultTriangleHeight);
      var elementRendererData = new ConeVO(elemId, elemPosition, defaultTriangleWidth, defaultTriangleHeight);
      elementRendererData.fillColor = "#FFEA04";
      addItemByModel.call(this, elementRendererData, true);
  }


  function createPlayerPathClickHandler(presentationViewEvent) {
      var elemId = createjs.UID.get();
      var defaultStripWidth = 150;
      var defaultStripHeight = PlayerMovementLine.STD_HEIGHT;

      var elementPosition = getElementDefaultPosition.call(this, defaultStripWidth, defaultStripHeight);
      elementPosition.y+=PlayerMovementLine.STD_HEIGHT/2;

      var startPoint = new createjs.Point(elementPosition.x, elementPosition.y);
      var endPoint = new createjs.Point(elementPosition.x + defaultStripWidth,  elementPosition.y);

      var elementRendererData = new PlayerMovementVO(elemId, startPoint, endPoint, ArrowDirection.LEFT);
      addItemByModel.call(this, elementRendererData, true);
  }

  function createBallPathClickHandler(presentationViewEvent) {
      var elemId = createjs.UID.get();
      var defaultStripWidth = 150;
      var defaultStripHeight = BallMovementLine.STD_HEIGHT;

      var elementPosition = getElementDefaultPosition.call(this, defaultStripWidth, defaultStripHeight);
      elementPosition.y+=BallMovementLine.STD_HEIGHT/2;

      var startPoint = new createjs.Point(elementPosition.x, elementPosition.y);
      var endPoint = new createjs.Point(elementPosition.x + defaultStripWidth,  elementPosition.y);

      var elementRendererData = new BallMovementVO(elemId, startPoint, endPoint, ArrowDirection.LEFT);
      addItemByModel.call(this, elementRendererData, true);
  }

  function createBallClickHandler(presentationViewEvent) {
      var elemId = createjs.UID.get();
      var elemPosition = getElementDefaultPosition.call(this, BallComponent.STD_WIDTH, BallComponent.STD_HEIGHT);
      var elementRendererData = new BallVO(elemId, elemPosition);
      addItemByModel.call(this, elementRendererData, true);
  }

  function createBallsSupplyClickHandler(presentationViewEvent) {
      var elemId = createjs.UID.get();
      var elemPosition = getElementDefaultPosition.call(this, BallSupplyComponent.STD_WIDTH, BallSupplyComponent.STD_HEIGHT);
      var elementRendererData = new BallSupplyVO(elemId, elemPosition);
      addItemByModel.call(this, elementRendererData, true);
  }

  function createArcClickHandler(presentationViewEvent){
      var defaultArrowDirection = ArrowDirection.LEFT;
      var defaultArcRotation = 0;
      var elemId = createjs.UID.get();
      var elementWidth =  ArchedArrow.STD_WIDTH;
      var elementHeight =  ArchedArrow.STD_HEIGHT;
      var elemPosition = getElementDefaultPosition.call(this, ArchedArrow.STD_WIDTH/2, ArchedArrow.STD_HEIGHT/2);
      var elementRendererData = new ArchedArrowVO(elemId, elemPosition, elementWidth, elementHeight, defaultArrowDirection, defaultArcRotation);
      addItemByModel.call(this, elementRendererData, true);

  }

  function createDribblingClickHandler(evt){
      var elemId = createjs.UID.get();
      var defaultStripWidth = DribblingLineSegment.STD_WIDTH*3;
      var defaultStripHeight = DribblingLineSegment.STD_HEIGHT;

      var elementPosition = getElementDefaultPosition.call(this, defaultStripWidth, defaultStripHeight);
      elementPosition.y+=DribblingLineSegment.STD_HEIGHT/2;

      var startPoint = new createjs.Point(elementPosition.x, elementPosition.y);
      var endPoint = new createjs.Point(elementPosition.x + defaultStripWidth,  elementPosition.y);

      var elementRendererData = new DribblingLineVO(elemId, startPoint, endPoint, ArrowDirection.LEFT);
      addItemByModel.call(this, elementRendererData, true);
  }

  function createGoalClickHandler(evt){
      var elemId = createjs.UID.get();
      var defaultRotation = 0;
      var defaultWidth = Goal.STD_WIDTH;
      var defaultHeight = Goal.STD_HEIGHT;
      var elementPosition = getElementDefaultPosition.call(this, defaultWidth, defaultHeight);
      var rendererData = new GoalVO(elemId, elementPosition ,defaultWidth, defaultHeight, defaultRotation);
      addItemByModel.call(this, rendererData, true);
  }

  function copyElementClickHandler(event){
      var clonedSourceData = this.cloneElementData(this.selectedElement.rendererData);
      Clipboard.data = clonedSourceData;
      this.dispatcher.dispatchEvent(new PresentationViewEvent(PresentationViewEvent.ELEMENT_COPIED_TO_CLIPBOARD,{data:clonedSourceData}));
  }

  function pasteElementClickHandler(event){
      if(Clipboard.data){
          var clonedElementData = this.cloneElementData(Clipboard.data);
          addItemByModel.call(this, clonedElementData, true);
      }
  }

  function backButtonClickHandler(event){
      //this.getPresentationDTO();
      this.setView(null);
      this.dispatcher.dispatchEvent(new ApplicationEvent(ApplicationEvent.SHOW_SCREEN,{screenId:AppScreen.MAIN_MENU}));
  }

  /*********************************** public static method *************************************/

  PresentationController.getInstance = function(){

      if(PresentationController.instance == null){
          PresentationController.instance = new PresentationController();
      }

      return PresentationController.instance;
  };

  PresentationController.createEmptyPresentation = function(){
      var id = "000000";
      var presentation = new Presentation(id);

      console.log("Created a new presentation with id= " + id);

      return presentation;
  };

    drillEditor.PresentationController =  PresentationController;
  }());
