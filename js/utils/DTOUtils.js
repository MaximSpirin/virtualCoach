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