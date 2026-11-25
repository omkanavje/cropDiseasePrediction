# CropCare AI

A mobile app that identifies crop diseases from a photo of a plant leaf and tells you how to treat them.

## How it works

The app runs in two stages:

1. **Detection.** You take a photo or pick one from your gallery. A trained model analyzes the leaf image and predicts which disease it is.
2. **Remedy lookup.** The predicted disease name is matched and the remedies are shown

## Features

- Capture a leaf photo with the camera or choose one from the gallery
- Disease prediction from the image
- Treatment and remedy suggestions for the detected disease
- Scan history
- User profile

## Tech stack

- React Native with Expo
- TypeScript
- Expo Router for navigation
- Python for the remedy lookup
- `<model framework, e.g. TensorFlow / PyTorch>` for disease detection

## Getting started

### Prerequisites

- Node.js and npm
- Python 3 (for the remedy script)
- Expo Go on your phone, or an Android/iOS emulator

### Run the app

```bash
npm install
npx expo start
```

Then open it in [Expo Go](https://expo.dev/go), an [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/), or an [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/).

### Run the remedy script

```bash
python <script_name>.py
```

## Project structure

```
src/app/            App screens (file-based routing with Expo Router)
<path>/             Detection model
<path>/remedies.json  Disease-to-remedy data
<path>/<script>.py  Script that looks up the remedy for a disease
```

## Status

The app screens are in place. Model integration and the remedy backend are still being connected. `<update this as things change>`

## Contributing

This is a team project. To contribute, fork the repo, create a branch, and open a pull request.
