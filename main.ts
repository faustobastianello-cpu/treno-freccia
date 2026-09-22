// =====================================================
// TRENO - micro:bit (MakeCode JavaScript)
// Il treno porta una calamita. Quando una stazione lo rileva
// e gli chiede chi e', risponde con il proprio nome
// e mostra il nome della stazione.
// =====================================================

// --- CONFIGURAZIONE (cambiare per ogni treno) ---
const NOME_TRENO = "FRECCIA1"   // max 8 caratteri, maiuscole, senza spazi e senza ":"
const GRUPPO_RADIO = 42         // uguale su tutti i micro:bit
const SOGLIA_SEGNALE = -80      // dBm: ignora richieste da stazioni troppo lontane (da tarare)

let stazioneDaMostrare = ""
let ultimaStazione = ""
let istanteUltima = 0

radio.setGroup(GRUPPO_RADIO)
radio.setTransmitPower(1)       // potenza minima: parla solo con la stazione vicina
basic.showString(NOME_TRENO, 80)

// Richiesta della stazione: S:nomeStazione
radio.onReceivedString(function (messaggio) {
    let parti = messaggio.split(":")
    if (parti.length == 2 && parti[0] == "S") {
        if (radio.receivedPacket(RadioPacketProperty.SignalStrength) >= SOGLIA_SEGNALE) {
            let stazione = parti[1]
            radio.sendString("T:" + NOME_TRENO + ":" + stazione)   // risposta immediata
            // la stazione puo' ripetere la richiesta: il nome si mostra una volta sola
            if (stazione != ultimaStazione || input.runningTime() - istanteUltima > 5000) {
                ultimaStazione = stazione
                istanteUltima = input.runningTime()
                stazioneDaMostrare = stazione
            }
        }
    }
})

// Il display e' gestito qui, cosi' la scritta che scorre
// non blocca le risposte radio
basic.forever(function () {
    if (stazioneDaMostrare != "") {
        let s = stazioneDaMostrare
        stazioneDaMostrare = ""
        basic.showString(s, 80)
    } else {
        basic.showIcon(IconNames.Diamond)
        basic.pause(50)
    }
})
