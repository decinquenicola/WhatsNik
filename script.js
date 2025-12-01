console.log('I love you, S.')
// PUNTO E VIRGOLA NON OBBLIGATORIO

// Si possono assegnare alle variabili proprio dei pezzi di pagina!

// OPERAZIONI DI PREPARAZIONE

//Recupero elementi di interesse della pagina
const input = document.querySelector('input')
const button = document.querySelector('button')
const chatBox = document.querySelector('.chat-box')

//Preparazione dei messaggi iniziali: ARRAY

const messages = []
addMessage('rec', 'Ciao amorcitooo, dimmi tutto!')

// PREPARAZIONE API

const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAkqjAoYPHg4Zk4VUylcfHauUws405Vpn4'

const systemPrompt = "Sei Nicola, soprannominato Nik dalla tua ragazza. Rispondi in italiano, in maniera sempre affettuosa e comprensiva, dato che sei il ragazzo e l'amore della sua vita. Cerca sempre di risolvere problemi cercando le soluzioni migliori e mostrando tantissimo affetto. Mantieni le risposte brevi e spontanee. Chiama il tuo interlocutore (la tua ragazza Sabrina) sempre e solo con nomignomli quali amorcito e patata. Usa anche emoji e cuori!"

// OPERAZIONI DI USER INTERACTION

// L'user interagisce con il pulsante una volta scritto il messaggio (EVENTI)

input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        button.click();  // scatena lo stesso listener registrato sul bottone
    }
});

button.addEventListener('click', function(){
    //Recupero testo nella box
    const insertedText = input.value.trim();

    //Lo inserisco e visualizzo tra i messaggi
    //Controllando che non sia vuoto!!!
    if (insertedText === '') return

    addMessage('sent',insertedText)

// Svuoto casella

input.value = '';

//riporto focus

input.focus()

//scorro più basso possibile

chatBox.scrollTop = chatBox.scrollHeight

getAnswer()

})

function showMessages(){
       // ole ole ole ole Svuoto la chattt
chatBox.innerHTML = '';

// Creazione dei fumetti per i messaggi: FOR...OF

for(const message of messages){
    chatBox.innerHTML += `
    <div class="chat-row ${message.type}">
                <div class="chat-message">
                    <p>${message.text}</p>
                    <time datetime="${message.time}">
                        ${message.time}
                    </time>
                </div>
            </div>`
}
}

function addMessage(messageType, messageText){
    const newMessage = {
        type : messageType,
        text: messageText,
        time: new Date().toLocaleString()
    }

    messages.push(newMessage)

 showMessages()
}

// IMPLEMENTAZIONE AI

// Funzione per formattare la chat in formato gradito a Gemini

function formatChat(){
    const formattedChat = []

    for (const message of messages){
        formattedChat.push({
            parts: [{ text: message.text}],
            role: message.type === 'sent' ? 'user' : 'model'
        })
    }

    formattedChat.unshift({
        role: 'user',
        parts: [{text: systemPrompt}]
    })

    return formattedChat
}

async function getAnswer(){
    const chatForGemini = formatChat()

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, // JAVASCRIPT OBJECT NOTATION
        body: JSON.stringify({contents: chatForGemini})
    })

    const data = await response.json();

    const answer = data.candidates[0].content.parts[0].text

    addMessage('rec', answer)

}