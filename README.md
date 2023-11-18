# Monoclear.ai Web Service

Fill `.env` file with the correct constants.

Note that only Korean testing is implemented.
TODO: English testing

## How to test run Client

Based on Horizon UI (below).

```
pip install -r requirements.txt

npm install

npm run dev
```

For production build:

```
next build

next start
```

## How to run API Server

```
cd api

pip install -r requirements-api.txt

npm run fastapi-dev
```

## How to run Model Inference Server

Currently only integrated with leaderboard.

```
cd api

pip install -r requirements-testrun.txt

npm run testrun-dev
```

## How to run Message Notification Server

Currently only integrated with leaderboard.

```
cd api

pip install -r requirements-notify.txt

npm run notify-dev
```

## License

We release the code under GNU Affero General Public License Version 3 (AGPLv3) or any later version.
This is same as [Plausible](https://plausible.io/), [Dub](https://dub.co/) or other recent open-source software (incl. LLM software).

## Contact

Please contact admin@monoclear.ai for any queries.
