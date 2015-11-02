//##############################################################################
// Dispatcher
//##############################################################################


/**
 * Class Dispatcher
 * Created by Maxim Spirin on 9/14/2015.
 */

this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";
    Dispatcher.instance = null;

    //constructor
    function Dispatcher() {
        if(Dispatcher.instance){
            throw  new Error("Only one instance of Dispatcher is allowed")
        }
    }

    Dispatcher.getInstance = function(){
        if(!Dispatcher.instance){
            Dispatcher.instance = new Dispatcher();
        }
        return Dispatcher.instance;
    };

    //create inheritance from EventDispatcher
    var p = createjs.extend(Dispatcher, createjs.EventDispatcher);


    drillEditor.Dispatcher = createjs.promote(Dispatcher,"EventDispatcher");

}());