# VoteIT v2
A voting system for student Division Meeting(Student möte).
-----------------------------
###Requitements###
* USB-> USB-minium
* Sax
* Tillgång till skrivare
* rösträknare != justerare

###Requerements###
* Anonymity
* Security for man in the middle.
* Security for mansession hijacking.

###Structure###

###Setup###
* ALLA: Välj rösträknare med vanlig rösträkning
* RÖSTRÄKNARE: Få inlogning av styrit.
* RÖSTRÄKNARE: Byt lösen
* RÖSTRÄKNARE: Tryck på pluset i högra top hörnet
* RÖSTRÄKNARE: Create new app
* RÖSTRÄKNARE: Name Sektionsmöte-{datum} ex Setionsmote-2015-08-10
* RÖSTRÄKNARE: Sätt enviroment variable. key=dit super hemliga lösenord.
* RÖSTRÄKNARE: Gå in på addressen /admin
* RÖSTRÄKNARE: Logga in med dit super hemliga lösenord.
* RÖSTRÄKNARE: skriv in hur många perssoner det är på mötet +20,
* RÖSTRÄKNARE: skriv in hur många omröstningar det kommer att vara ~20
* RÖSTRÄKNARE: Ta sladden av styrit gå till en skrivare skriv ut med hjälp av den använd print knappen.
* RÖSTRÄKNARE: Dela pappret, Dela ut en pappers bit till varje persson.

###Voting###
* RÖSTRÄKNARE: Vid val sätt up rätt typ av omröstning.
* RÖSTRÄKNARE: Sätt tidgräns rekomenderas 15 min
* ALLA: Kommer att kunna se att det fins en omröstning
* ALLA: Tryck på vad ni röstar och skriv nummnret som är i hörnet.  

###End###
* RÖSTRÄKNARE: Kolla loggen av deploys
* RÖSTRÄKNARE: Destroya servern.
