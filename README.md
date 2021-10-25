
# Deliveries Management App
###Coding challenge from Paack

## Install and run
```
cd CodingChallenge
yarn && yarn jetify
cd ios && pod install

👉 iOS
Open CodingChallenge.xcworkspace from XCode and run the CodingChallenge target.

👉 Android
Open `CodingChallenge/android` on Android Studio and run the app on an emulator/device.
```

### Run tests
```
yarn test
```

### TypeScript & Linter
```
yarn check-linter && yarn check-typescript
```

### Libraries used

- Type safety: `typescript`
- Navigation: `react-navigation`
- State management: `redux, rxjs, redux-observable, redux-persist, reselect`
- Internationalization: `react-i18next`
