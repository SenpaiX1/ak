window.completion = null;
window.akitude = null;
window.step = 0;
window.progression = "0.00000";
window.questionId = null;
window.question = null;
window.answer = null


async function getAuthData() {
    document.getElementById("qa").style.display = "none";
    document.getElementById("result").style.display = "none";
    document.getElementById("loading").style.display = "block";
    document.getElementById("cont").style.display = "none";

    try {
        let response
        try {
            response = await fetch('https://casualgames.pro/akinator-api/en/auth');
        } catch (e) {
            console.log("games-api=" + e)
        }

        const data = await response.json();
        const session = data.session;
        const signature = data.signature;
        const firstQuestion = data.firstQuestion;
        const errorCode = data.errorCode;

        window.session = session;
        window.signature = signature;
        window.firstQuestion = firstQuestion;

        const headingElement = document.getElementById('quastion');
        headingElement.textContent = firstQuestion;

        document.getElementById("qa").style.display = "block";
        document.getElementById("loading").style.display = "none";
        document.getElementById("cont").style.display = "block";

        if (!session || errorCode || session == "null") {
            document.getElementById("qa").style.display = "none";
            document.getElementById("error").style.display = "block";
        }

    } catch (error) {
        document.getElementById("qa").style.display = "none";
        document.getElementById("error").style.display = "block";
    }
}

async function chooseAnswer(step, progression, answer, session, signature) {
    const message = {
        type: 'IFRAME_CLICK',
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now() // ÐœÐ¾Ð¶Ð½Ð¾ Ð´Ð¾Ð±Ð°Ð²Ð¸Ñ‚ÑŒ Ð²Ñ€ÐµÐ¼Ñ ÐºÐ»Ð¸ÐºÐ°
    };
    window.parent.postMessage(message, '*');


    document.getElementById("qa").style.display = "none";
    document.getElementById("result").style.display = "none";
    document.getElementById("loading").style.display = "block";
    document.getElementById("cont").style.display = "none";

    window.answer = answer
    window.step = step;
    window.progression = progression;
    window.session = session;
    window.signature = signature;


    const req = '?step=' + step + '&progression=' + progression + '&sid=1&cm=true&answer=' + answer + '&step_last_proposition=&session=' + session + '&signature=' + signature
    try {
        let response
        try {
            response = await fetch('https://casualgames.pro/akinator-api/en/answer' + req);
        } catch (e) {
            console.log("games-api=" + e)
        }


        const data = await response.json();
        if (data.completion == "KO" || data.completion == undefined || data.completion == "") {
            console.log(data.completion)
            chooseAnswer(window.step, window.progression, window.answer, window.session, window.signature)
            return
        } else {
            window.completion = data.completion;
            window.akitude = data.akitude;
            window.step++;
            window.progression = data.progression;
            window.questionId = data.question_id;
            window.question = data.question;
            window.namePoposition = data.name_proposition;
            window.descriptionProposition = data.description_proposition;
            window.photo = data.photo;
        }

        const quastion = document.getElementById('quastion');
        quastion.textContent = window.question;

        if (window.question) {
            let questionLower = window.question.toLowerCase()
            if (questionLower.includes("insta") || questionLower.includes("face") || questionLower.includes("twitt")) {
                window.question = "ÐŸÐµÑ€ÑÐ¾Ð½Ð°Ð¶ Ð¸Ð¼ÐµÐµÑ‚ Ð¾Ñ‚Ð½Ð¾ÑˆÐµÐ½Ð¸Ðµ Ðº Ð·Ð°Ð¿Ñ€ÐµÑˆÑ‘Ð½Ð½Ð¾Ð¹ ÑÐ¾Ñ†. ÑÐµÑ‚Ð¸?"
            }
        }

        if (window.namePoposition) {
            if (
                window.namePoposition.includes("utin") ||
                window.descriptionProposition.includes("resident") ||
                window.descriptionProposition.includes("inister") ||
                window.descriptionProposition.includes("olitician") ||
                window.descriptionProposition.includes("olit") ||
                window.descriptionProposition.includes("ilitary") ||
                window.descriptionProposition.includes("eneral") ||
                window.descriptionProposition.includes("Twit") ||
                window.descriptionProposition.includes("ÐµÐºÑ€Ð¸Ñ‚Ð°Ñ€ÑŒ") ||
                window.descriptionProposition.includes("eader") ||
                window.descriptionProposition.includes("Face")


            ) {
                window.namePoposition = "I can't show you";
                window.descriptionProposition = "against the rules of the site";
                window.photo = "https://storage.yandexcloud.net/akinator2/images/ppp.jpg";
            }


            const namePoposition = document.getElementById('resultTitle');
            namePoposition.textContent = window.namePoposition;
            const descriptionProposition = document.getElementById('resultDesc');
            descriptionProposition.textContent = window.descriptionProposition;
            document.getElementById("quastion").style.display = "none";
            document.getElementById("answers").style.display = "none";

            const element = document.querySelector('.top-center-block');
            if (element) {
                element.style.display = 'none';
            }


            var imgElement = document.getElementById('photo');

            // Ð£ÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÐ¼ Ð½Ð¾Ð²Ð¾Ðµ Ð·Ð½Ð°Ñ‡ÐµÐ½Ð¸Ðµ Ð´Ð»Ñ Ð°Ñ‚Ñ€Ð¸Ð±ÑƒÑ‚Ð° src
            if (imgElement) {
                imgElement.src = window.photo; // Ð—Ð°Ð¼ÐµÐ½Ð¸Ñ‚Ðµ Ð½Ð° URL Ð½Ð¾Ð²Ð¾Ð³Ð¾ Ð¸Ð·Ð¾Ð±Ñ€Ð°Ð¶ÐµÐ½Ð¸Ñ
            }
            document.getElementById("result").style.display = "block";

        }


        //console.log(data)
        document.getElementById("qa").style.display = "block";
        document.getElementById("loading").style.display = "none";
        document.getElementById("cont").style.display = "block";


    } catch (error) {
        document.getElementById("qa").style.display = "none";
        document.getElementById("error").style.display = "block";
        document.getElementById("loading").style.display = "none";
        console.error('There was a problem with the fetch operation:', error);
    }

}


document.getElementById('startGame').addEventListener('click', function () {
    var hintElement = document.getElementById('hint');
    if (hintElement) {
        hintElement.remove();
    }
});






getAuthData();



