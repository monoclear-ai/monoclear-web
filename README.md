# Monoclear.ai Web Service

Fill `.env` file with the correct constants.

Note that only Korean testing is implemented.
TODO: English testing

## How to test run Client

Based on Horizon UI (below).

```
pip install -r requirements.txt

npm run dev
```

For building and running:

```
npm run 

```

## How to run API Server

```
cd api

pip install -r requirements-api.txt

python index.py
```

## How to run Model Inference Server

Currently only integrated with leaderboard.

```
cd api

pip install -r requirements-testrun.txt

python entry_test_runner.py
```

## How to run Message Notification Server

Currently only integrated with leaderboard.

```
cd api

pip install -r requirements-notify.txt

python entry_notifier.py
```

## License

We release the code under GNU Affero General Public License Version 3 (AGPTv3) or any later version.
This is same as [Plausible](https://plausible.io/), [Dub](https://dub.co/) or other recent open-source software (incl. LLM software).