importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
  apiKey: "TODO_REPLACE_WITH_YOUR_API_KEY", // Ideally this should be injected or hardcoded if env vars not available in SW
  authDomain: "mr-tecy.firebaseapp.com",
  projectId: "mr-tecy",
  storageBucket: "mr-tecy.firebasestorage.app",
  messagingSenderId: "305105286595", // Replace with your sender ID from console
  appId: "1:305105286595:web:..." // Replace with your app ID
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
