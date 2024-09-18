import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Veri ekleme
export const addData = async (name, price) => {
  try {
    const docRef = await addDoc(collection(db, "menuItems"), {
      name: name,
      price: price,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Veri okuma
export const getData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "menuItems"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
};
