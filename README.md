# VoteIT [![Build Status](https://travis-ci.org/cthit/VoteIT.svg)](https://travis-ci.org/cthit/VoteIT)
A voting system for student Division Meeting (Sektionsmöte).

### Features
* Anonymous voting.
* Allows set amount of options to be accepted (eg, allow 3 options out of 5 to be accepted). So if the amount of allowed options is 2 and the options are "Agda", "Haskell" and "Erlang" both "Agda" and "Haskell" could be chosen. (personinval där en kommitté har limiterat antal platser)

### Physical requirements
* Scissor
* Own printer

### Technical requirements of the project
* Anonymity
* Security for man in the middle.
* Security for session hijacking.

## Usage

[Setup Instructions](https://github.com/cthit/VoteIT/wiki/Setup-Instructions-for-Vote-Counters)

or

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

[User Instructions](https://github.com/cthit/VoteIT/wiki/User-Instructions)

Server on heroku needs to be kept alive (sleeps after 30 mins of inactivity by default) using something like the following script:

```bash
SERVERNAME="sektionsmote-2015-12-07"
while true; do
	curl -s https://${SERVERNAME}.herokuapp.com/health-check
	sleep 60
done
```

## Development

### Software requirements
* node
* npm

### Build
* `npm start`
* `gulp`

### How to use Docker (optional)
* `docker build -t cthit/voteit .`
* `docker run cthit/voteit`
