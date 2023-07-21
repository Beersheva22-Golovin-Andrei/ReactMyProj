// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF8ewI7DMNmkfRxZxjSes6M1ru4nK5NjQ",
  authDomain: "my-commercial-app-5fd5b.firebaseapp.com",
  projectId: "my-commercial-app-5fd5b",
  storageBucket: "my-commercial-app-5fd5b.appspot.com",
  messagingSenderId: "325592334774",
  appId: "1:325592334774:web:03daf75083667594ed8117"
};

const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;