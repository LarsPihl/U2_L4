// Globala konstanter och variabler
// Städer och bilder
const allWords = ["Borgholm","Gränna","Gävle","Göteborg","Halmstad","Jönköping","Kalmar","Karlskrona","Kiruna","Ljungby","Malmö","Norrköping","Skara","Stockholm","Sundsvall","Umeå","Visby","Västervik","Växjö","Örebro"];	// Array med namn på städer
const allDescriptions = ["Kyrkan","Storgatan","Julbock","Operan","Picassoparken","Sofiakyrkan","Domkyrkan","Rosenbom","Stadshus","Garvaren","Stortorget","Spårvagn","Domkyrka","Rosenbad","Hotell Knaust","Storgatan","Stadsmur","Hamnen","Teater","Svampen"];	// Array med kort beskrivning av bilderna för städerna
// Element i gränssnittet
var startGameBtn;		// Referenser till start-knappen (button)
var checkAnswersBtn;	// Referens till knappen för att kontrollera svar (button)
var wordListElem;		// Referens till listan med de ord som kan dras (ul-elemntet)
var	wordElems;			// Array med referenser till elementen för de åtta orden (li-elemnten)
var imgElems;			// Array med referenser till elementen med de fyra bilderna (img)
var answerElems;		// Array med referenser till elementen för orden intill bilderna (p)
var correctElems;		// Array med referenser till element för rätta svar (p)
var largeImgElem;		// Referens till elementet med den stora bilden (img)
var msgElem; 			// Referens till div-element för utskrift av meddelanden (div)
// Element vid drag and drop
var dragWordElem;		// Det ord som dras (kan vara både li och p)
var i;                  // Variabel som används i loopar
// ------------------------------
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd.
// Initiering av globala variabler samt händelsehanterare.
function init() {
	// Referenser till element i gränssnittet
		startGameBtn = document.getElementById("startGameBtn");//Referens till startknappen.
		checkAnswersBtn = document.getElementById("checkAnswersBtn");//Referens till knappen för svarskontroll.
		wordListElem = document.getElementById("wordList").getElementsByTagName("ul")[0];/*Referens till ordlistan,
		indexeras med [0] då 'ul' ska nås och det hamnar i en array via 'getElementsByTagName'.*/
		wordElems = document.getElementById("wordList").getElementsByTagName("li");//Array med de olika listobjekten
		//i ordlistan.
		imgElems = document.getElementById("imgList").getElementsByTagName("img");//Array med bildobjekt.
		answerElems = document.getElementsByClassName("userAnswer");//Referens till användarens svar.
		correctElems = document.getElementsByClassName("correctAnswer");//Referens till korrekta svar.
		largeImgElem = document.getElementById("largeImg");//Referens till dokumentets stora bild.
		msgElem = document.getElementById("message");//Referens till div-område för utskrift till användaren.
	// Lägg på händelsehanterare
		startGameBtn.addEventListener("click",startGame);//Eventobjekt där klick på startknappen anropar funktionen 'startGame'.
		checkAnswersBtn.addEventListener("click",checkAnswers);//Eventobjekt där klick på svarskontrollsknappen anropar 'checkAnswers'.

		//Bildlistan genomsöks, när musen går över en av dem visas samma bild i rutan för en större bild via
		//funktionen 'showLargeImg'. När musen drar bort anropas istället 'hideLargeImg', vilket innebär
		//att den stora bilden ersätts av en 'tom' bild.
		for (i = 0; i < imgElems.length; i++) {
			imgElems[i].addEventListener("mouseenter",showLargeImg);
			imgElems[i].addEventListener("mouseleave",hideLargeImg);
		}
		
	// Aktivera/inaktivera knappar
	// Vid spelinitiering aktiveras startknappen och 'svartkontrollsknappen' inaktiveras.
		checkAnswersBtn.disabled = true;
		startGameBtn.disabled = false;

} // End init

window.addEventListener("load",init); // Se till att init aktiveras då sidan är inladdad
// ------------------------------
// Initiera spelet. Välj ord slumpmässigt. Visa ord och bilder.

function startGame() {

	let tempList = allWords.slice(0);//En kopia av 'allWords' skapas då element ska tas ur arrayen, men
	//arrayen senare ska vara fullständig. En kopia kan då tappa element, och originalet återstår istållet.
	let words = [];//Array för de städer som blir slumpmässigt utvalda.

	/*Ett slumptal väljs fyra gånger, som ges ett värde mellan 0 och sista index på kopian av 'allWords'.
	Det stadsord som ligger i 'tempList' på detta index läggs i arrayen 'words'. Den bild som motsvarar stadsordet 
	läggs i motsvarande bildruta. Stadsordet tas sedan ut ur 'tempList' så att samma stad ej väljs två gånger.*/
	for (i = 0; i < 4; i ++) {
		let r = Math.floor(Math.random() * tempList.length);//Variabel för slumptal.
		words.push(tempList[r]);
		let ix = allWords.indexOf(tempList[r]);//Det tillhörande indexet i allWords sätts i variabeln ix.
		tempList.splice(r,1);	
		imgElems[i].src = "img/" +  ix + ".jpg";
		imgElems[i].id = ix;//Bildens 'id' ges värdet av det tillhörande indexet i allWords. På detta sätt
		//kan bilden senare kopplas till rätt ord och beskrivning när svaren kontrolleras.
	}
	
	/*På samma sätt väljs fyra nya slumpmässiga stadsord ut, men inga bilder sätts då dessa är de stadsord
	som enbart är till som alternativ, ingen av dem kan generera ett rätt svar.*/
	for (i = 0; i < 4; i++) {
		let r = Math.floor(Math.random() * tempList.length);
		words.push(tempList[r]);
		tempList.splice(r,1);
	}

	words.sort();//Stadsorden sorteras i bokstavsordning, så att de ej ligger i samma ordning i ordlistan som bilderna.
	
	/*Ordlistan fylls med innehållet i 'words'. Orden sätts till dragbara. Funktionen 'dragstartWord' anropas
	när ett ord börjar dras, och funktionen 'dragendWord' anropas när ordet slutar dras.*/
	for (i = 0; i < words.length; i++) {
		wordElems[i].innerHTML = words[i];
		wordElems[i].draggable = true;
		wordElems[i].addEventListener("dragstart",dragstartWord);
		wordElems[i].addEventListener("dragend",dragendWord);
	}

	/*De ord som dragits till en bild genomsöks och sätts till dragbara på samma sätt som tidigare ordlista. Innehållet
	i dem och deras bredvidliggande paragrafer för rätta svart tömms efter en eventuell tidigare omgång.*/
	for (i = 0; i < answerElems.length; i++) {
		answerElems[i].draggable = true;
		answerElems[i].addEventListener("dragstart",dragstartWord);
		answerElems[i].addEventListener("dragend",dragendWord);
		answerElems[i].innerHTML = "";
		correctElems[i].innerHTML = "";
	}

	msgElem.innerHTML = "";//Meddelandet med antal poäng tas bort efter en eventuell tidigare omgång.
	checkAnswersBtn.disabled = false;//Facit-knapp aktiveras.
	startGameBtn.disabled = true;//Startknapp inaktiveras.

} // End startGame
// ------------------------------
// Visa förstorad bild
function showLargeImg() {
	largeImgElem.src = this.src;//Den stora bilden fylls med eventobjektet, i detta fall den bild som musen ligger över.
} // End showLargeImg
// ------------------------------
// Dölj förstorad bild
function hideLargeImg() {
	largeImgElem.src = "img/empty.png";//Den stora bilden fylls med en tom bild när musen tas bort.
} // End hideLargeImg
// ------------------------------
// Ett ord börjar dras. Spara data om elementet som dras. Händelsehanterare för drop zones
function dragstartWord(e) { // e är Event-objektet

	for (i = 0; i < imgElems.length; i++) {//Alla bildelement får ett eventobjekt för 'dragover' och 'drop',
		//där 'wordOverImg' respektive 'wordOverImg' anropas.
		imgElems[i].addEventListener("dragover",wordOverImg);
		imgElems[i].addEventListener("drop",wordOverImg);
	}

	//Samma sak tilldelas ordlistan som helhet.
	wordListElem.addEventListener("dragover",wordOverList);
	wordListElem.addEventListener("drop",wordOverList);
	dragWordElem = this;//Det ord som dras läggs i variabeln 'dragWordElem'.
	e.dataTransfer.setData("text",this.innerHTML);//Innehållet i variabeln läggs i 'dataTransfer' för att 
	//ge kompabilitet med alla webbläsare. 
	
} // End dragstartWord
// ------------------------------
// Drag-händelsen avslutas. Ta bort händelsehanterare på drop zones
function dragendWord() {/*När ett ord slutar dras tas 'EventListeners' bort från alla bilder och även ordlistan.*/

	for (i = 0; i < imgElems.length; i++) {
		imgElems[i].removeEventListener("dragover",wordOverImg);
		imgElems[i].removeEventListener("drop",wordOverImg);
		}
	
	wordListElem.removeEventListener("dragover",wordOverList);
	wordListElem.removeEventListener("drop",wordOverList);
	
} // End dragendWord
// ------------------------------
// Hantera händelserna dragover och drop, då ett ord släpps över en bild
function wordOverImg(e) { // e är Event-objektet

	e.preventDefault();//Förhindrar förinställt beteende för webbläsaren vid 'drag and drop'.

	if (e.type == "drop") {//Drag-ordet tömms när det släpps på en bild.
		dragWordElem.innerHTML = "";
		let dropWordElem = this.nextElementSibling;//Platsen där ordet ska hamna läggs i 'dropWordElem'.
		if (dropWordElem.innerHTML != "")//Om det redan finns ett ord där skickas det tillbaks till ordlistan
		//genom anrop till funktionen 'moveBackToList'.
			moveBackToList(dropWordElem.innerHTML);
			dropWordElem.innerHTML = e.dataTransfer.getData("text"); 
			//Innehållet i dataöverföringen läggs i 'dropWordElem' istället.
	}
	
} // End wordOverImg

// ------------------------------
// Hantera händelserna dragover och drop, då ett ord släpps över listan med ord
function wordOverList(e) { // e är Event-objektet

	e.preventDefault();////Förhindrar förinställt beteende för webbläsaren vid 'drag and drop'.

	if (e.type == "drop") {//Om dragordet släpps på listan tömms dragordet på sitt innehåll.
		//Innehållet i dataöverföringen läggs tillbaks i ordlistan genom anrop till funktionen 'moveBackToList'.
		dragWordElem.innerHTML = "";
		moveBackToList(e.dataTransfer.getData("text"));
	}
	
} // End wordOverList
// ------------------------------
// Flytta tillbaks ordet till listan
function moveBackToList(word) { // word är det ord som ska flyttas tillbaks

	/*Ordlistan säks igenom när ett ord skickas tillbaks till listan. Om en plats är ledig läggs det tillbakaskickade
	ordet där och funktionen bryts, då inga fler lediga platser behöver hittas.*/
	for (i = 0; i < wordElems.length; i++) {
		if (wordElems[i].innerHTML == "") {
			wordElems[i].innerHTML = word;
			break;
		}
	} 

} // End moveBackToList
// ------------------------------
// Kontrollera användarens svar och visa de korrekta svaren
function checkAnswers() {

	/*Alla svarsparagrafer genomsöks, om någon av dem är tom skrivs ett felmeddelande ut och användaren
	skickas tillbaks till anropsplatsen.*/
	for (i = 0; i < answerElems.length; i++) {
		if (answerElems[i].innerHTML == "") {
			alert ("Dra först ord till alla bilder.");
			return;
		}
	}

	/*Innehållet i ordlistan tappar dragförmågan och de aktuella 'Eventlisteners' som hörde till dem tas bort.*/
	for (i = 0; i < wordElems.length; i++) {
		wordElems[i].draggable = false;
		wordElems[i].removeEventListener("dragstart",dragstartWord);
		wordElems[i].removeEventListener("dragend",dragendWord);
	}

	var points = 0;//Variabel för antal poäng, startvärde sätts till 0.

	/*Svarsordet tappar dragförmåga och de aktuella 'Eventlisteners' som hörde till dem tas bort.*/
	for (i = 0; i < answerElems.length; i++) {
		answerElems[i].draggable = false;
		answerElems[i].removeEventListener("dragstart",dragstartWord);
		answerElems[i].removeEventListener("dragend",dragendWord);
		let ix = imgElems[i].id; //En bilds insparade 'id' ger värdet av 'ix', vilket gör att tillhörande
		//stadsord och beskrivning kan hittas i 'allWords' och 'allDescriptions'.
		correctElems[i].innerHTML = allWords[ix] + " - " + allDescriptions[ix];
		//Den tillhörande paragrafen med rätts svar fylls med rätt stadsord och beskrvning.

		if (answerElems[i].innerHTML == allWords[ix]) {
			points++;//Om det givna svaret motsvarar rätt stadsord ges 1 poäng.
			correctElems[i].innerHTML += " - Rätt";//Efter faciturskriften skrivs ' - Rätt' ut.
		}
			
		else {//Om svaret är fel följs facitutskriften av ' - Fel'.
			correctElems[i].innerHTML += " - Fel";
		}
	}

	msgElem.innerHTML = "Du fick " + points + " poäng.";//Antal rätt skrivs ut.
	checkAnswersBtn.disabled = true;//Facitknappen inaktiveras.
	startGameBtn.disabled = false;//Startknappen aktiveras.

} // End checkAnswers
// ------------------------------