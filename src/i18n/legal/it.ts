/**
 * Testi legali standard (italiano). `{email}` viene sostituito con l'email di contatto
 * impostata nell'area admin (Link e risultati → Email di contatto).
 * Testi generici: da far verificare se necessario.
 */
export type LegalSection = { title: string; paragraphs?: string[]; list?: string[] };
export type LegalDoc = { title: string; eyebrow: string; updated: string; intro?: string; sections: LegalSection[] };

const organizer =
  "Comitato d'organizzazione dei Campionati Regionali di atletica leggera Bellinzona 2027, per conto della Federazione Ticinese di Atletica Leggera (FTAL)";

export const privacy: LegalDoc = {
  eyebrow: "Protezione dei dati",
  title: "Informativa sulla privacy",
  updated: "21 novembre 2026",
  intro:
    "La protezione dei tuoi dati personali è importante per noi. Questa informativa spiega quali dati trattiamo quando visiti questo sito o ci contatti, per quali scopi e quali sono i tuoi diritti. Il trattamento avviene nel rispetto della Legge federale sulla protezione dei dati (LPD) e, se applicabile, del Regolamento generale sulla protezione dei dati dell'UE (RGPD).",
  sections: [
    {
      title: "1. Titolare del trattamento",
      paragraphs: [`${organizer}, Bellinzona (Svizzera).`, "Per qualsiasi domanda sulla protezione dei dati puoi scriverci a {email}."],
    },
    {
      title: "2. Dati trattati durante la visita del sito",
      paragraphs: [
        "Quando visiti il sito, il server di hosting registra automaticamente alcune informazioni tecniche (file di log): indirizzo IP, data e ora della richiesta, pagina visitata, tipo di browser e sistema operativo, sito di provenienza. Questi dati servono esclusivamente a garantire il funzionamento, la sicurezza e la stabilità del sito e non vengono usati per identificare i visitatori.",
        "Il sito non utilizza strumenti di analisi statistica, pubblicità o profilazione.",
      ],
    },
    {
      title: "3. Contatti",
      paragraphs: [
        "Se ci contatti via email o telefono trattiamo i dati che ci comunichi (ad esempio nome, indirizzo email, contenuto del messaggio) solo per rispondere alla tua richiesta e per l'eventuale collaborazione che ne deriva (ad esempio una sponsorizzazione).",
      ],
    },
    {
      title: "4. Atlete, atleti e risultati",
      paragraphs: [
        "Le iscrizioni alle gare non avvengono su questo sito, ma tramite il sistema di iscrizione online di Swiss Athletics, che ne è responsabile.",
        "Liste di partenza e risultati (nome, anno di nascita, società, categoria, prestazione) vengono pubblicati secondo i regolamenti di Swiss Athletics, come è consuetudine nelle competizioni di atletica leggera.",
      ],
    },
    {
      title: "5. Foto e video durante la manifestazione",
      paragraphs: [
        "Durante la manifestazione possono essere realizzate fotografie e riprese video, che possono essere pubblicate sul sito, sui canali di comunicazione degli organizzatori e dei partner e nei media, a scopo di documentazione e promozione dell'evento. Chi non desidera essere ripreso o desidera la rimozione di un'immagine può contattarci in qualsiasi momento a {email}.",
      ],
    },
    {
      title: "6. Fornitori di servizi",
      paragraphs: ["Per il funzionamento del sito ci avvaliamo dei seguenti fornitori, che trattano i dati solo su nostro incarico:"],
      list: [
        "Vercel Inc. (USA) – hosting del sito. La trasmissione di dati verso gli Stati Uniti avviene sulla base di garanzie adeguate (Swiss-U.S. Data Privacy Framework e/o clausole contrattuali standard).",
        "Supabase Inc. – banca dati dei contenuti del sito, con server situati in Svizzera (Zurigo).",
      ],
    },
    {
      title: "7. Link e contenuti esterni",
      paragraphs: [
        "Il sito contiene link a siti esterni (ad esempio Swiss Athletics, Google Maps, siti degli sponsor) e può mostrare pagine esterne incorporate, come i risultati in tempo reale. Quando apri un link o visualizzi un contenuto incorporato, il rispettivo fornitore può raccogliere dati secondo la propria informativa sulla privacy, sulla quale non abbiamo alcuna influenza.",
      ],
    },
    {
      title: "8. Cookie",
      paragraphs: ["Il sito utilizza solo cookie tecnicamente necessari. I dettagli si trovano nella pagina Cookie."],
    },
    {
      title: "9. Durata di conservazione",
      paragraphs: [
        "Conserviamo i dati personali solo per il tempo necessario agli scopi indicati o richiesto dalla legge. I file di log del server vengono cancellati automaticamente dopo un breve periodo; la corrispondenza viene conservata al massimo fino alla conclusione dell'evento e dei relativi obblighi amministrativi e contabili.",
      ],
    },
    {
      title: "10. Sicurezza",
      paragraphs: [
        "Adottiamo misure tecniche e organizzative adeguate per proteggere i dati da accessi non autorizzati, perdita o abuso. La connessione al sito è cifrata (HTTPS).",
      ],
    },
    {
      title: "11. I tuoi diritti",
      paragraphs: ["Nei limiti previsti dalla legge hai il diritto di:"],
      list: [
        "ottenere informazioni sui dati personali che ti riguardano;",
        "chiedere la rettifica di dati inesatti;",
        "chiedere la cancellazione o la limitazione del trattamento;",
        "opporti al trattamento;",
        "ricevere i tuoi dati in un formato di uso comune (portabilità);",
        "presentare reclamo all'Incaricato federale della protezione dei dati e della trasparenza (IFPDT) o, se risiedi nell'UE, all'autorità di controllo competente.",
      ],
    },
    {
      title: "12. Modifiche",
      paragraphs: [
        "Possiamo aggiornare questa informativa in qualsiasi momento. Fa stato la versione pubblicata su questa pagina.",
      ],
    },
  ],
};

export const cookie: LegalDoc = {
  eyebrow: "Protezione dei dati",
  title: "Cookie",
  updated: "21 novembre 2026",
  intro:
    "I cookie sono piccoli file di testo che un sito salva sul tuo dispositivo. Questo sito usa i cookie il meno possibile.",
  sections: [
    {
      title: "Cookie che utilizziamo",
      paragraphs: [
        "Il sito non utilizza cookie di analisi, di profilazione o pubblicitari e non traccia i visitatori.",
        "Utilizziamo esclusivamente cookie tecnicamente necessari per l'area riservata agli organizzatori: servono a mantenere l'accesso dopo il login e vengono eliminati alla disconnessione o alla loro scadenza. Per questi cookie non è richiesto il consenso.",
      ],
    },
    {
      title: "Contenuti di terzi",
      paragraphs: [
        "Alcune pagine possono mostrare contenuti di siti esterni (ad esempio i risultati in tempo reale) o rimandare a servizi come Google Maps. Questi fornitori possono impostare propri cookie, secondo le rispettive informative.",
      ],
    },
    {
      title: "Gestione dei cookie",
      paragraphs: [
        "Puoi bloccare o cancellare i cookie in qualsiasi momento dalle impostazioni del tuo browser. Il sito pubblico funziona anche senza cookie.",
      ],
    },
    {
      title: "Contatto",
      paragraphs: ["Per domande puoi scriverci a {email}."],
    },
  ],
};

export const legal: LegalDoc = {
  eyebrow: "Impressum",
  title: "Note legali",
  updated: "21 novembre 2026",
  sections: [
    {
      title: "Editore e responsabile dei contenuti",
      paragraphs: [`${organizer}.`, "Contatto: {email}."],
    },
    {
      title: "Esclusione di responsabilità",
      paragraphs: [
        "Le informazioni pubblicate su questo sito sono redatte con la massima cura. Gli organizzatori non garantiscono tuttavia che siano corrette, complete e aggiornate. Orari, programmi e informazioni pratiche possono cambiare: fanno stato le comunicazioni ufficiali degli organizzatori e di Swiss Athletics.",
        "È esclusa, nei limiti consentiti dalla legge, qualsiasi responsabilità per danni materiali o immateriali derivanti dall'accesso al sito, dall'uso o dal mancato uso delle informazioni pubblicate, da abusi della connessione o da problemi tecnici.",
      ],
    },
    {
      title: "Link esterni",
      paragraphs: [
        "Il sito contiene link a siti di terzi. Gli organizzatori non hanno alcuna influenza sui loro contenuti e declinano ogni responsabilità al riguardo. L'accesso e l'uso di tali siti avvengono a rischio dell'utente.",
      ],
    },
    {
      title: "Diritti d'autore e marchi",
      paragraphs: [
        "Testi, immagini, grafica, logo e altri contenuti del sito appartengono agli organizzatori o ai rispettivi titolari dei diritti. Qualsiasi riproduzione richiede l'autorizzazione scritta preventiva.",
        "I loghi e i marchi degli sponsor e dei partner sono proprietà dei rispettivi titolari.",
        "Base cartografica e foto aerea della mappa dell'impianto: © swisstopo.",
      ],
    },
    {
      title: "Protezione dei dati",
      paragraphs: ["Le informazioni sul trattamento dei dati personali si trovano nell'informativa sulla privacy."],
    },
  ],
};
