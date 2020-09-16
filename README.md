# VoteIT [![Build Status](https://travis-ci.org/cthit/VoteIT.svg)](https://travis-ci.org/cthit/VoteIT)
A voting system for student Division Meeting (Sektionsmöte). Rewritten to accommodate online voting due to Covid-19. The old version can be found in the `master-physical`. 

### Features
* Anonymous voting via Gamma authentication.
* Allows set amount of options to be accepted (eg, allow 3 options out of 5 to be accepted). So if the amount of allowed options is 2 and the options are "Agda", "Haskell" and "Erlang" both "Agda" and "Haskell" could be chosen. (personinval där en kommitté har limiterat antal platser)

### Techincal requirements
* [Gamma](https://github.com/cthit/gamma)

## Usage

[Setup Instructions](https://github.com/cthit/VoteIT/wiki/Setup-Instructions-for-Vote-Counters)

[User Instructions](https://github.com/cthit/VoteIT/wiki/User-Instructions)

Server on heroku needs to be kept alive (sleeps after 30 mins of inactivity by default) using something like the following script:

```bash
SERVERNAME="sektionsmote-2020-13-37"
while true; do
	curl -s https://${SERVERNAME}.herokuapp.com/health-check
	sleep 60
done
```

## Development

### Software requirements
* node
* npm
* docker

### Start development
From root:
* `docker-compose up` Starts Gamma locally. Wait until Gamma is fully up and running on `http://localhost:3000`.
* `npm install && npm run dev`. Starts up the backend part of VoteIT.
* `cd client && yarn install && yarn start`. Starts upp the frontend part of VoteIt. 

Sign in with the cid: `dbarnevi` and password: `password`. To enter as the counter. Check `http://localhost:3000` to find more cids to use for mock votings. Every account has by default the password: `password`. 

Please not that `npm run start` exists so that Heroku can run both the backend and serve the frontend at the same time.



