# VoteIT v2
A voting system for student Division Meeting (Sektionsmöte).
-----------------------------

###Features###
* Anonymous voting.
* Allows set amount of options to be accepted (eg, allow 3 options out of 5 to be accepted). So if the amount of allowed options is 2 and the options are "Agda", "Haskell" and "Erlang" both "Agda" and "Haskell" could be chosen. (personinval där en kommitté har limiterat antal platser)

###Physical requirements###
* USB-> USB Type B
* Scissor
* Access to printer
* Vote counter != adjustor (justerare)

###Technical requirements of the project###
* Anonymity
* Security for man in the middle.
* Security for session hijacking.

###Structure###

###Setup###
* ALL: Elect _Vote counters_ with ordinary vote counting (Välj rösträknare med vanlig rösträkning)
* Vote counter: Be assigned a heroku account by StyrIT.
* Vote counter: Reset password
* Vote counter: Press the plus button in the top right corner
* Vote counter: Create new app
* Vote counter: Choose the name: Sektionsmote-{datum} eg Sektionsmote-2015-08-10
* Vote counter: Create enviroment variable. KEY='your super secret password'.
* Vote counter: Go to the url + /admin
* Vote counter: Log in with your super secret password.
* Vote counter: Count the number of people that are eligible to vote on the meeting and add a buffer for people that are late (eg 20)
* Vote counter: Count the max number of hidden votes and add a buffer for good measure
* Vote counter: Print out the one-time-use codes (But not through print.chalmers.se or chalmers.it)
* Vote counter: Distribute the codes to the people in the meeting through a random measure eg all codes in a bowl and the voter picks one in the bowl.

###Voting###
* Vote counter: When its time for election choose the right type and options
* Vote counter: Pick a time limit, 15 min is recommended
* ALL: Will see that there is an election
* ALL: Choose the option(s) that you want and enter the one-time-use code for the election

###End###
* Vote counter: Check the log for suspicions activity eg more deployments
* Vote counter: Destroy the server

##Development##

###Software requirement###
* Node
* npm

###build###
* gulp serve
* gulp
