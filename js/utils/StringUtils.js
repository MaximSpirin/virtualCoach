//##############################################################################
//
//##############################################################################

/**
 * StringUtils
 */
this.drillEditor = this.drillEditor || {};

(function () {
    "use strict";

    /**
     * Returns string representation of a number in a 2 digits format
     * @param	value
     * @return
     */
    StringUtils.convert22DigitsFormat = function(value){
        if (value < 10) {
            return "0" + value.toString();
        }
        return value.toString();
    };

    //constructor
    function StringUtils(){

    }

    /**
     * Turns milliseconds into a formatted string
     * @param milliseconds
     * @param format
     * @param omitZeroHrs
     * @returns {string}
     */
    StringUtils.formatTime = function(milliseconds, format, omitZeroHrs){
        //console.warn("drillEditor.StringUtils.formatTime:",milliseconds);
        var result = "",
            delimiter = ":",
            timeFormat = format ? format : "hh:mm:ss",
            hrs,
            min,
            sec;
        hrs = Math.floor(milliseconds/3600000);
        min = Math.floor((milliseconds - hrs*3600000)/60000);
        sec = Math.floor((milliseconds - hrs*3600000 - min*60000)/1000);

        if(!omitZeroHrs){
            result += String(hrs) + delimiter;
        }

        if(format=="hh:mm"){
            result += StringUtils.convert22DigitsFormat(min);
        } else { // use default hh:mm:ss format
            result += StringUtils.convert22DigitsFormat(min) + delimiter + StringUtils.convert22DigitsFormat(sec);
        }

        return result;
    };

    drillEditor.StringUtils = StringUtils;

}());