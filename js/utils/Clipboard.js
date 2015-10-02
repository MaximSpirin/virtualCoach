/**
 * Class Clipboard
 * Created by maxim_000 on 10/2/2015.
 */
(function (window) {
    //public variables
    //Clipboard.prototype.publicVar = "value";

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

    //Make aliases for all superclass methods: SuperClass_methodName
    //window.Clipboard = createjs.promote(Clipboard,"SuperClass");

    window.Clipboard = Clipboard;

}(window));