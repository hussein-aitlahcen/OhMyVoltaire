(function ohMyVoltaire() {    
    var CSS_CLICK_SPAN = ".pointAndClickSpan";
    var VALIDATE_INTERVAL = 10000;
    var cheatsheet = [DUDE_REPLACE_THE_PONEY_MAN];
    setInterval(function() {

        function findBestMatch(sentence) {
            var bestCorrection = null;
            for(var i = 0; i < cheatsheet.length; i++) {
                var currentCorrection = cheatsheet[i];
                if(sentence.indexOf(currentCorrection.Begin.trim()) !== -1 && sentence.indexOf(currentCorrection.End.trim()) !== -1) {
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
            console.log("sentence is good, nothing to correct");
        }
        else {  
            var wrongWord = fullSentence.replace(bestMatch.Begin).replace(bestMatch.End);
            var splittedSentence = fullSentence.match(/\b(\w+)\b/g);
            var wrongIndex = splittedSentence.indexOf(wrongWord);
            console.log(splittedSentence);
            console.log("wrong word index: " + wrongIndex);
            $(CSS_CLICK_SPAN).each(function(index) {
                if(index == wrongIndex) {
                    console.log("DUDE I FOUND: index=" + index + " word=" + $(this).context.firstChild.data);
                }
            });
            console.log(bestMatch);
        }
    }, VALIDATE_INTERVAL);   

})();