(function ohMyVoltaire() {    
    var CSS_CLICK_SPAN = ".pointAndClickSpan";
    var ID_BTN_NEXT = "#btn_question_suivante";
    var VALIDATE_INTERVAL = 10000;
    var cheatsheet = [DUDE_REPLACE_THE_PONEY_MAN];
    setInterval(function() {

        function findBestMatch(sentence) {
            var bestCorrection = null;
            for(var i = 0; i < cheatsheet.length; i++) {
                var currentCorrection = cheatsheet[i];
                if(sentence.indexOf(currentCorrection.Begin) !== -1 && sentence.indexOf(currentCorrection.End) !== -1) {
                    bestCorrection = currentCorrection;
                }
            }
            return bestCorrection;
        }

        console.log("batch starting...");

        var fullSentence = "";
        $(CSS_CLICK_SPAN).each(function(index) {
            fullSentence = fullSentence + $(this).context.firstChild.data;          
        });
        fullSentence = fullSentence.replace(",", "");

        console.log("sentence found: " + fullSentence);
        console.log("finding best match");   

        var bestMatch = findBestMatch(fullSentence);
        if(bestMatch === null) {
            console.log("cannot find answer, be sure to check before saying that there is not mistake");
        }
        else {  
            console.log(bestMatch);

            var wrongWord = fullSentence.replace(bestMatch.Begin, "").replace(bestMatch.End, "").trim();

            console.log(wrongWord);

            var splittedSentence = fullSentence.match(/(\S+)/g);
            var splittedWrongWord = wrongWord.split(/([^A-z\u0041-\u00FF]+)/g);
            
            console.log(splittedWrongWord);
            console.log(splittedSentence);

            var sentenceSpans = $(CSS_CLICK_SPAN);
            var spansLength = sentenceSpans.length;

            for(var i = 0; i < spansLength - splittedWrongWord.length; i++) {
                for(var j = 0; j < splittedWrongWord.length; j++) {            
                    var currentSpan = sentenceSpans[i];
                    var currentWrongPart = splittedWrongWord[j];    
                    var spanValue = currentSpan.firstChild.data;
                    console.log("check : span=" + spanValue + " wrong=" + currentWrongPart);
                    if(spanValue !== currentWrongPart) 
                        break;                    
                    console.log("GOOD : span=" + spanValue + " wrong=" + currentWrongPart);
                    if(j === splittedWrongWord.length - 1) {
                        currentSpan.click();
                        $(ID_BTN_NEXT)[0].click();
                        return;
                    }                      
                }
            }
        }
    }, VALIDATE_INTERVAL);   

})();