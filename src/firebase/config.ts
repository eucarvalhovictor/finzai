import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";

export const firebaseConfig: FirebaseOptions = {
  "projectId": "studio-8717987235-2a7f1",
  "appId": "1:739608942736:web:3e3071cb333b5bb3202015",
  "apiKey": "AIzaSyBxx4ZiXzt67HIj4WS6X5SJN3d89uj99oc",
  "authDomain": "studio-8717987235-2a7f1.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "739608942736",
  "storageBucket": "studio-8717987235-2a7f1.appspot.com"
};

// Função de inicialização para ser usada no lado do servidor (Genkit flows)
export function initializeFirebase() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
}
