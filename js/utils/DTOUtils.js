/**
 * Class DTOUtils
 * Created by maxim_000 on 10/14/2015.
 */
(function (window) {
    /******************* public variables *******************/
    //DTOUtils.prototype.publicVar = "value";

    /******************* static variables *******************/
    //DTOUtils.staticVar = "value";

    /********************** constructor *********************/
    function DTOUtils() {
        //invoke constructor of superclass
        //this.SuperClass_constructor();
    }

    //extend this class from a superclass
    //var p = createjs.extend(DTOUtils,SuperClass);

    /******************** private methods *******************/


    /******************** event handlers ********************/


    /******************* public static method ***************/

    DTOUtils.presentationDTOToVO = function(presentationDTO){
        var presentation = new Presentation(presentationDTO.id);
        presentation.pitchWidth = presentationDTO.pitchWidth;
        presentation.pitchHeight = presentationDTO.pitchHeight;
        presentation.elements = [];

        for(var i=0; i<presentationDTO.elements.length; i++){
            var elementDTO = presentationDTO.elements[i];
            var elementVO = DTOUtils.elementDTOToVO(elementDTO);
            presentation.elements.push(elementVO);
        }

        return presentation;
    };

    DTOUtils.elementDTOToVO = function(elementDTO){
        var elementVO;
        var elementPosition = new createjs.Point(elementDTO.position.x, elementDTO.position.y);

        switch (elementDTO.type){
            case GraphicElementType.RECTANGLE:
                elementVO = new RectVO(elementDTO.id, elementPosition, elementDTO.width, elementDTO.height);
                break;

            case GraphicElementType.SQUARE:
                elementVO = new SquareVO(elementDTO.id, elementPosition, elementDTO.width, elementDTO.height);
                break;

            case GraphicElementType.ATTACKER:
                elementVO = new AttackerVO(elementDTO.id, elementPosition, elementDTO.width/2);
                elementVO.fillColor = elementDTO.fillColor;
                break;

            case GraphicElementType.DEFENDER:
                elementVO = new DefenderVO(elementDTO.id, elementPosition, elementDTO.width/2);
                elementVO.fillColor = elementDTO.fillColor;
                break;

            case GraphicElementType.EXTRA_TEAM:
                elementVO = new ExtraTeamVO(elementDTO.id, elementPosition, elementDTO.width/2);
                elementVO.fillColor = elementDTO.fillColor;
                break;

            case GraphicElementType.NEUTRAL_PLAYER:
                elementVO = new NeutralVO(elementDTO.id, elementPosition, elementDTO.width/2);
                elementVO.fillColor = elementDTO.fillColor;
                break;

            case GraphicElementType.CONE:
                elementVO = new ConeVO(elementDTO.id, elementPosition, elementDTO.width, elementDTO.height);
                elementVO.fillColor = elementDTO.fillColor;
                break;

            case GraphicElementType.ARCUATE_MOVEMENT:
                elementVO = new ArchedArrowVO(elementDTO.id, elementPosition,
                    elementDTO.width, elementDTO.height,
                    elementDTO.arrowDirection, elementDTO.rotation);
                break;

            case GraphicElementType.GOAL:
                    elementVO = new GoalVO(elementDTO.id, elementPosition, elementDTO.width, elementDTO.height, elementDTO.rotation);
                break;

            case GraphicElementType.DRIBBLING_PLAYER:
                var startPointCloned = new createjs.Point(elementDTO.startPoint.x, elementDTO.startPoint.y);
                var endPointCloned = new createjs.Point(elementDTO.endPoint.x, elementDTO.endPoint.y);
                elementVO = new DribblingLineVO(elementDTO.id, startPointCloned, endPointCloned, elementDTO.arrowDirection);
                break;

            case GraphicElementType.PLAYER_MOVEMENT:
                var startPointCloned = new createjs.Point(elementDTO.startPoint.x, elementDTO.startPoint.y);
                var endPointCloned = new createjs.Point(elementDTO.endPoint.x, elementDTO.endPoint.y);
                elementVO = new PlayerMovementVO(elementDTO.id, startPointCloned, endPointCloned, elementDTO.arrowDirection);
                break;

            case GraphicElementType.BALL_MOVEMENT:
                var startPointCloned = new createjs.Point(elementDTO.startPoint.x, elementDTO.startPoint.y);
                var endPointCloned = new createjs.Point(elementDTO.endPoint.x, elementDTO.endPoint.y);
                elementVO = new BallMovementVO(elementDTO.id, startPointCloned, endPointCloned, elementDTO.arrowDirection);
                break;

            case GraphicElementType.BALL:
                elementVO = new BallVO(elementDTO.id, elementPosition);
                break;

            case GraphicElementType.BALLS_SUPPLY:
                elementVO = new BallSupplyVO(elementDTO.id, elementPosition);
                break;
        }

        if(elementVO){
            elementVO.id = elementDTO.id;
            elementVO.position = new createjs.Point(elementVO.position.x, elementVO.position.y)
        }

        return elementVO;
    };


    DTOUtils.presentationToDTO = function(presentation){
        var presentationDTO = {};
        presentationDTO.drillId = presentation.id;
        presentationDTO.pitchWidth = presentation.pitchWidth;
        presentationDTO.pitchHeight = presentation.pitchHeight;
        presentationDTO.playersCount = 0;
        presentationDTO.equipmentRequired = {cones:0, balls:0, ballSupply:0};
        presentationDTO.activitiesRequired = {playerDribbling:0, playerMovement:0,  ballMovement:0 };
        presentationDTO.elements = [];

        for(var i=0; i<presentation.elements.length; i++){
            var elementVO = presentation.elements[i];
            var elementDTO = DTOUtils.elementVOToDTO(elementVO);
            presentationDTO.elements.push(elementDTO);

            if(elementVO.isPlayer==true){
                presentationDTO.playersCount +=1 ;
            }else if(elementVO.isEquipment==true){
                switch (elementVO.type){
                    case GraphicElementType.CONE:
                            presentationDTO.equipmentRequired.cones +=1;
                        break;

                    case GraphicElementType.BALL:
                            presentationDTO.equipmentRequired.balls +=1;
                        break;

                    case GraphicElementType.BALLS_SUPPLY:
                            presentationDTO.equipmentRequired.ballSupply +=1;
                        break
                }
            }else if(elementVO.isActivity==true){
                switch(elementVO.type){
                    case GraphicElementType.PLAYER_MOVEMENT:
                    case GraphicElementType.ARCUATE_MOVEMENT:
                            presentationDTO.activitiesRequired.playerMovement +=1;
                        break;

                    case GraphicElementType.BALL_MOVEMENT:
                            presentationDTO.activitiesRequired.ballMovement +=1;
                        break;
                    case GraphicElementType.DRIBBLING_PLAYER:
                            presentationDTO.activitiesRequired.playerDribbling +=1;
                        break;
                }
            }
        }

        return presentationDTO;
    };

    DTOUtils.elementVOToDTO = function(elementVO){
        var result = {};

        result.id = elementVO.id;
        result.type = elementVO.type;

        result.position = {x: elementVO.position.x, y:elementVO.position.y};


        switch (elementVO.type){
            case GraphicElementType.ATTACKER:
            case GraphicElementType.DEFENDER:
            case GraphicElementType.EXTRA_TEAM:
            case GraphicElementType.NEUTRAL_PLAYER:
            case GraphicElementType.CONE:
                    result.width = elementVO.width;
                    result.height = elementVO.height;
                    result.fillColor = elementVO.fillColor;
                break;

            case GraphicElementType.ARCUATE_MOVEMENT:
                    result.width = elementVO.width;
                    result.height = elementVO.height;
                    result.arrowDirection =  elementVO.arrowDirection;
                    result.rotation = elementVO.rotation;
                break;

            case GraphicElementType.GOAL:
                result.width = elementVO.width;
                result.height = elementVO.height;
                result.rotation = elementVO.rotation;
                break;

            case GraphicElementType.DRIBBLING_PLAYER:
            case GraphicElementType.PLAYER_MOVEMENT:
            case GraphicElementType.BALL_MOVEMENT:
                result.startPoint = {x:elementVO.startPoint.x, y:elementVO.startPoint.y};
                result.endPoint = {x:elementVO.endPoint.x, y:elementVO.endPoint.y};
                result.arrowDirection = elementVO.arrowDirection;


        }

        return result;
    };



    window.DTOUtils = DTOUtils;

}(window));