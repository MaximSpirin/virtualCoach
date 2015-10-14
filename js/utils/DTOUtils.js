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
        presentationDTO.playersCount = 1;
        presentationDTO.equipmentRequired = {};
        presentationDTO.activitiesRequired = {};
        presentationDTO.elements = [];

        for(var i=0; i<presentation.elements.length; i++){
            var elementDTO = DTOUtils.elementVOToDTO(presentation.elements[i]);
            presentationDTO.elements.push(elementDTO);
        }

        return presentationDTO;
    };

    DTOUtils.elementVOToDTO = function(elementVO){
        var result = {};

        result.id = elementVO.id;
        result.type = elementVO.type;
        result.width = elementVO.width;
        result.height = elementVO.height;
        result.position = {x: elementVO.position.x, y:elementVO.position.y};
        result.rotation = elementVO.rotation;

        switch (elementVO.type){
            case GraphicElementType.ATTACKER:
            case GraphicElementType.DEFENDER:
            case GraphicElementType.EXTRA_TEAM:
            case GraphicElementType.NEUTRAL_PLAYER:
            case GraphicElementType.CONE:
                    result.fillColor = elementVO.fillColor;
                break;

            case GraphicElementType.ARC:
                    result.arrowDirection =  elementVO.arrowDirection;
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