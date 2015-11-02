//##############################################################################
//
//##############################################################################

/**
 * Class Clipboard
 * Created by maxim_000 on 10/2/2015.
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    //static variable
    Clipboard.instance = null;

    //constructor
    function Clipboard() {
       if(Clipboard.instance){
           throw new Error("Only one instance of Clipboard is allowed!");
       }
    }

    //public static method
    Clipboard.getInstance = function(){
         if(!Clipboard.instance){
             Clipboard.instance = new Clipboard();
         }
        return Clipboard.instance;
    };

    Clipboard.data = null;


    drillEditor.Clipboard = Clipboard;

}());