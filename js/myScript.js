/**
 * Created by danielgontar on 4/8/2016.
 */
(function() { // begin scoping
        var model = {}; // creating namespace
        model.qdiv = document.getElementById("mainElement");
        model.totalQuestionAmount = 13; // Amount of questions in storage (server side).
        model.questionAmount = 6; // Amount of questions in this quiz
        model.currentQuestionCounter = -1; // Setting up counter to -1 , It's prompted to 0 first thing in function showNexrQuestion
        model.startTime;
        model.totalUserScore = 0;
        var button = document.getElementById("startBtn");
        button.addEventListener("click", startquiz);
        function startquiz() {
            model.qdiv.innerHTML = "";
            model.userAnswers = []; // array of user's answer indices (from radio input type).
            loadquestions(); // ulploading questions
        }
        function loadquestions(){
                $.getJSON("data.json", loadComplete); //relative URL to the JSON file.
        }
        function loadComplete(data) {
            model.questions = []; // array of questions strings.
            model.questionIndices = []; // array of randomised question indices. length = model.questionAmount. 0,1,..,8
            model.answers = [];   // array of answer strings
            model.correctAnswers = []; // array of correct answers indices.
            for (var i=0;i<model.totalQuestionAmount;i++) // pushing all question strings from json to array.
            {
                model.questions.push(data[i].question);
            }
            for (var i=0;i<model.totalQuestionAmount;i++) // pushing all arrays of answer strings from json to array.
            {
                model.answers.push(data[i].answers);
            }
            for (var i=0;i<model.totalQuestionAmount;i++) // pushing all correct answers indices from json to array
            {
                model.correctAnswers.push(data[i].correct_answer);
            }
            randomiseQuestions();
        }
        function randomiseQuestions(){
            var num; // var that holds the randomised numbers in each iteration
            model.questionIndices.push(Math.floor(Math.random() * (model.totalQuestionAmount)));
            var check; // boolean flag that checks if the number was already randomised before
            while (model.questionIndices.length < model.questionAmount){
                check = false;
                num = Math.floor(Math.random() * (model.totalQuestionAmount)); // randomises numbers between 0 - model.totalQuestionAmount
                for (var j = 0; j<model.questionIndices.length; j++)
                {
                    if (num == model.questionIndices[j]) // does the randomised number allready exists in model.questionIndices
                    {
                        check=true;
                    }
                }
                if (!check){        // number wasn't randomised before
                    model.questionIndices.push(num);
                }
            }
            model.startTime = new Date();
            showNextQuestion()
        }
        // Displaying next question + qdiv with answers as radio boxes
        function showNextQuestion() {
            model.currentQuestionCounter++;
            model.qdiv.innerHTML = "";
            var curQuestion = model.questions[model.questionIndices[model.currentQuestionCounter]]; // retrive the question from model.questions with index number that exist in model.questionIndices
            var questionHeadLine = document.createElement("h3");
            questionHeadLine.innerHTML = "Question #" + (model.currentQuestionCounter+1) + " Out of " + (model.questionAmount) + "&nbsp &nbsp &nbsp" +
                "&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp"+ Math.floor((new Date() - model.startTime)/1000).toFixed(1) + "(sec)";
            questionHeadLine.className = "questionHeadLine";
            var questionBody = document.createElement("h2");
            questionBody.className = "questionBody";
            questionBody.innerHTML = curQuestion;
            model.qdiv.appendChild(questionHeadLine);
            model.qdiv.appendChild(questionBody);
            model.qdiv.style.display = "block";
            // loop on array answers of current question , each element of model.answers array is an array of answers
            for (var i = 0; i < model.answers[model.questionIndices[model.currentQuestionCounter]].length; i++) {
                var answer = document.createElement("p");
                answer.innerHTML = "<label><input type='radio' name='answers'>" + model.answers[model.questionIndices[model.currentQuestionCounter]][i] + "</label>";
                model.qdiv.appendChild(answer);
            }
            // creating next button only if counter < number of questions
            if (model.currentQuestionCounter < (model.questionAmount-1)) {
                var nextButton = document.createElement("button");
                nextButton.innerHTML = "Next";
                nextButton.id = "nextButton";
                nextButton.className = "Button";
                model.qdiv.appendChild(nextButton);
                nextButton.addEventListener("click", nextClicked);
            }
            if (model.currentQuestionCounter == model.questionAmount-1) // create finish button quiz
            {
                var finishButton = document.createElement("button");
                finishButton.innerHTML = "Done";
                finishButton.id = "finishButton";
                finishButton.className = "Button";
                model.qdiv.appendChild(finishButton);
                finishButton.addEventListener("click", finishQuiz);
            }
            // creating prev button only if counter > 0
            if (model.currentQuestionCounter > 0) {
                var prevButton = document.createElement("button");
                prevButton.innerHTML = "Prev";
                prevButton.id = "prevButton";
                prevButton.className="Button";
                model.qdiv.appendChild(prevButton);
                prevButton.addEventListener("click", showPrevQuestion);
            }

            // checks if user check radio button and records his answer if condition is true , invokes showNextQuestion function.
        }
        function nextClicked()
        {
            if(checkRadio())
            {
                model.qdiv.innerHTML = "";
                showNextQuestion();
            }
        }
        function checkRadio(){
            var inp = document.getElementsByName('answers'); // creating a var that holds a node list object
            var selected = false;
            for (var i = 0; i < inp.length; i++)
            {
                if(inp[i].checked)
                {
                    model.userAnswers[model.currentQuestionCounter] = i; // user answer is stored.
                    selected = true;
                }
            }
            return selected;
        }
        function showPrevQuestion() {  // going back in questions
            model.currentQuestionCounter--;
            model.qdiv.innerHTML = "";
            var curQuestion = model.questions[model.questionIndices[model.currentQuestionCounter]];
            var questionHeadLine = document.createElement("h3");
            questionHeadLine.innerHTML = "Question #" + (model.currentQuestionCounter+1) + " Out of " + (model.questionAmount) + "&nbsp &nbsp &nbsp" +
                "&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp"+ Math.floor((new Date() - model.startTime)/1000).toFixed(1) + "(sec)";
            questionHeadLine.className = "questionHeadLine";
            var questionBody = document.createElement("h2");
            questionBody.className = "questionBody";
            questionBody.innerHTML = curQuestion;
            model.qdiv.appendChild(questionHeadLine);
            model.qdiv.appendChild(questionBody);
            model.qdiv.style.display = "block";
            for (var i = 0; i < model.answers[model.questionIndices[model.currentQuestionCounter]].length; i++) {
                var answer = document.createElement("p");
                answer.innerHTML = "<label><input type='radio' name='answers'>" + model.answers[model.questionIndices[model.currentQuestionCounter]][i] + "</label>";
                model.qdiv.appendChild(answer);
            }
            if (model.currentQuestionCounter < model.questionAmount) {
                var nextButton = document.createElement("button");
                nextButton.innerHTML = "Next";
                nextButton.id = "nextButton";
                nextButton.className="Button";
                model.qdiv.appendChild(nextButton);
                nextButton.addEventListener("click", nextClicked);
            }
            // creating prev button only if counter > 0
            if (model.currentQuestionCounter > 0) {
                var prevButton = document.createElement("button");
                prevButton.innerHTML = "Prev";
                prevButton.id = "prevButton";
                prevButton.className="Button";
                model.qdiv.appendChild(prevButton);
                prevButton.addEventListener("click", showPrevQuestion);
            }
        }
        function finishQuiz(){
            // calculating user's total score
            if(checkRadio())
            {
                for (var i = 0 ; i<model.questionAmount; i++)
                {
                    if (model.userAnswers[i]==model.correctAnswers[model.questionIndices[i]]){
                        model.totalUserScore++;
                    }
                }
                model.qdiv.innerHTML = "";
                var finishHeadLine = document.createElement("h3");
                finishHeadLine.innerHTML ="You have finished the Quiz !<br>" +
                    "Total Time: "+Math.floor((new Date() - model.startTime)/1000).toFixed(1) + "(sec)";
                finishHeadLine.className = "questionHeadLine";
                var finishBody = document.createElement("h2");
                finishBody.className = "questionBody";
                finishBody.innerHTML = "Your score is "+ Math.floor(model.totalUserScore*100/model.questionAmount)+"%<br><br>" +
                    "You have answered: "+model.totalUserScore+" Out of: "+ model.questionAmount;
                model.qdiv.appendChild(finishHeadLine);
                model.qdiv.appendChild(finishBody);
                model.qdiv.style.display = "block";
                var resltButton = document.createElement("button");
                resltButton.innerHTML = "Summary";
                resltButton.id = "resltButton";
                resltButton.className = "resButton";
                model.qdiv.appendChild(resltButton);
                resltButton.addEventListener("click", showResults);
            }
        }
        function showResults(){
            model.qdiv.innerHTML = "";
            var resultsHeadLine = document.createElement("h3");
            resultsHeadLine.innerHTML = "Your answers in comparison to the correct answers:";
            resultsHeadLine.className = "questionHeadLine";
            model.qdiv.appendChild(resultsHeadLine);
            for (var i = 0;i<model.questionAmount;i++){
                if (model.userAnswers[i] == model.correctAnswers[model.questionIndices[i]]){   // checking if user's answer = correct answer
                    var userAnswer = document.createElement("p");
                    userAnswer.innerHTML = (i+1) + ")Your answer: "+model.answers[model.questionIndices[i]][model.userAnswers[i]]+"&nbsp &nbsp <b>That is correct!</b><br>"; // model.answers is array of arrays
                    userAnswer.className = "questionBody";
                    model.qdiv.appendChild(userAnswer);
                }
                else                                                                           // user has done a mistake
                {
                    var userAnswer = document.createElement("p");
                    userAnswer.innerHTML = (i+1) +") Your answer: "+model.answers[model.questionIndices[i]][model.userAnswers[i]]+
                        " <br><b>correct answer:"+
                         model.answers[model.questionIndices[i]][model.correctAnswers[model.questionIndices[i]]]+"</b>";
                    userAnswer.className = "questionBody";
                    model.qdiv.appendChild(userAnswer);
                }
            }
            model.qdiv.style.display = "block";
        }
    }
)();

