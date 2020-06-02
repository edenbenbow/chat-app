# Chat App

**Version 1.0.0**

How to set up and use Chat App.


---

### Installation instructions

I. Local setup
1. Download the [latest version of Chat App](https://github.com/edenbenbow/chat-app)
2. In the project's root directory, run npm install: ```npm install```
3. Run npm: ``npm start``
4. Make sure you have the latest LTS node version installed
5. Install Expo Command Line Interface: ``npm install expo-cli --global`` 
6. Start Expo: ```expo start```
7. Download [Android Studio](https://developer.android.com/studio)

II. Firestore Cloud setup
1. Create a new Google account or use existing
2. Sign in to [Google Firebase](https://firebase.google.com/)
3. Create project
4. On dashboard, click "Create database"
5. In new collection, add data according to the [Gifted Chat "chat message" protocols](https://github.com/FaridSafi/react-native-gifted-chat#message-object) and save
6. From "Project Settings," click the "Firestore for Web" button
7. Copy the contents of the config object (from { apiKey:… to messagingSenderId:…}) in this modal
8. Open App.js file and create a constructor resembling the below, adding in your own config object:
```
if (!firebase.apps.length){
  firebase.initializeApp({
    apiKey: "AIzaSyCYhM7ZWoVZLLUD5xzpcepyID3B5w1sfuE",
    authDomain: "test-8b82a.firebaseapp.com",
    databaseURL: "https://test-8b82a.firebaseio.com",
    projectId: "test-8b82a",
    storageBucket: "test-8b82a.appspot.com",
    messagingSenderId: "202131758796"
  });
}
```
9. Copy in data from your config file
10. Install Firebase in your project: ``npm install --save firebase@7.9.0``

---

### Dependencies
   - @react-native-community/masked-view
   - @react-native-community/netinfo
   - base-64
   - cookies
   - expo
   - expo-image-picker
   - expo-location
   - expo-permissions
   - firebase
   - react
   - react-dom
   - react-native
   - react-native-gesture-handler
   - react-native-gifted-chat
   - react-native-keyboard-spacer
   - react-native-maps
   - react-native-reanimated
   - react-native-safe-area-context
   - react-native-safe-area-view
   - react-native-screens
   - react-native-web
   - react-navigation
   - react-navigation-stack
   - @babel/core
   - @typescript-eslint/eslint-plugin
   - @typescript-eslint/parser
   - babel-eslint
   - babel-preset-expo
   - eslint
   - eslint-config-airbnb
   - eslint-plugin-import
   - eslint-plugin-jsx-a11y
   - eslint-plugin-react
   - eslint-plugin-react-hooks
   - eslint-plugin-react-native
---

### Screenshots

<img src="https://github.com/edenbenbow/chat-app/blob/master/assets/chat-screen.png" width="200">   <img src="https://github.com/edenbenbow/chat-app/blob/master/assets/welcome-screen.png" width="200">


