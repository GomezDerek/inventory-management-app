import { initializeApp } from 'firebase/app';
import { getFireStore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
const firebaseConfig = {
  apiKey: "AIzaSyAqUeJ6cC-6uExWoJbcQLJEJb11XU6jNSY",
  authDomain: "inventory-management-app-d38d8.firebaseapp.com",
  projectId: "inventory-management-app-d38d8",
  storageBucket: "inventory-management-app-d38d8.appspot.com",
  messagingSenderId: "426252549689",
  appId: "1:426252549689:web:05bedcad5bf10f6fc597e8",
  measurementId: "G-NJ9NECTXQ5"
};
const app = initializeApp(firebaseConfig);
const firestore = getFireStore(app);
const analytics = getAnalytics(app);
export { firestore };
