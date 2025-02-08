## Monum Mobile App (Expo)

This is the mobile app for Monum, a platform for citizens to share their places and experiences.

## Local Development (Expo Go)

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app (be sure to use the Expo Go - "s" to switch between the Expo Go and Expo Dev apps)

   ```bash
    npx expo start
   ```

3. Press "i" to open the app in the iOS simulator

4. Press "a" to open the app in the Android simulator

5. Press "w" to open the app in the web browser

6. Press "r" to reload the app

## Local Development (Expo Dev Server)

1. Install dependencies

   ```bash
   npm install
   ```

2. Install the Expo CLI

   ```bash
   npm install -g eas-cli
   ```

3. Login to Expo

   ```bash
   eas login
   ```

4. Create a new dev app for iOS

   ```bash
   eas build --profile development-simulator --platform ios
   ```

5. Create a new dev app for Android

   ```bash
   eas build --profile development-simulator --platform android
   ```

6. Start the app (be sure to use the Expo development - "s" to switch between the Expo Go and Expo Dev apps)

   ```bash
    npx expo start
   ```

7. Press "i" to open the app in the iOS simulator

8. Press "a" to open the app in the Android simulator

9. Press "w" to open the app in the web browser

10. Press "r" to reload the app

## Deploying to the App Store

1. Install the Expo CLI

   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo

   ```bash
   eas login
   ```

3. Build the app for iOS

   ```bash
   eas build --profile production --platform ios
   ```

4. Submit the app to the App Store

   ```bash
   eas submit -p ios
   ```

## Deploying to the Play Store

1. Install the Expo CLI

   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo

   ```bash
   eas login
   ```

3. Be sure to have "playstore-credentials.json" file in the root folder

4. Build the app for Android

   ```bash
   eas build --profile production --platform android
   ```

5. Submit the app to the App Store

   ```bash
   eas submit -p android
   ```

## Deploying to Web

1. Install the Expo CLI

   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo

   ```bash
   eas login
   ```

3. Build the app for Web and deploy to Netlify

   ```bash
   npx expo export --platform web && cp -R public/.well-known dist/.well-known && netlify deploy --dir dist --prod
   ```
