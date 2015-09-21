/**
 * PresentationViewEvent
 */
(function (window) {

    PresentationViewEvent.CREATE_RECTANGLE_CLICK = "create_rectangle_click";
    PresentationViewEvent.CREATE_SQUARE_CLICK = "create_square_click";
    PresentationViewEvent.ADD_VIDEO_ELEMENT = "add_video_element";

    //Each instance of this event will have an associated payload object
    PresentationViewEvent.prototype.payload = null;


    // constructor
    function PresentationViewEvent(type, payload, bubbles, cancelable){
        this.Event_constructor(type, bubbles, cancelable);

        if(payload == null || payload == undefined){
            payload = {};
        }
        this.payload = payload;

    }

    var p = createjs.extend(PresentationViewEvent, createjs.Event);

    window.PresentationViewEvent = createjs.promote(PresentationViewEvent, "Event");

}(window));
