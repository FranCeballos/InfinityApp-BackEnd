import admin from "firebase-admin";
import config from "../config.js";

admin.initializeApp({
  credential: admin.credential.cert(config.firebase),
});

const db = admin.firestore();

class ContainerFirebase {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  async readOne(name) {
    try {
      const snapshot = await this.collection.where("name", "==", name).get();
      let snapshotArray = [];
      if (snapshot.empty) {
        throw new Error(`Document not found. Firebase.`);
      }
      snapshot.forEach((doc) => snapshotArray.push(doc.data()));
      return snapshotArray;
    } catch (err) {
      console.error(err);
    }
  }

  async readAll() {
    try {
      let snapshotArray = [];
      (await this.collection.get()).forEach((doc) =>
        snapshotArray.push(doc.data())
      );
      return snapshotArray;
    } catch (err) {
      console.error(err);
    }
  }

  async create(newEl) {
    try {
      await this.collection.doc().set(JSON.parse(JSON.stringify(newEl)));
      console.log(`Created new document in Firestore.`);
    } catch (err) {
      console.error(err);
    }
  }

  async updateOne(id, newEl) {
    try {
      await this.collection.doc(id).update(JSON.parse(JSON.stringify(newEl)));
      console.log(`Document with ID: ${id} updated. Firestore.`);
    } catch (err) {
      console.error(err);
    }
  }

  async deleteOne(id) {
    try {
      await this.collection.doc(id).delete();
    } catch (err) {
      console.error(err);
    }
  }

  async deleteAll() {
    try {
      throw new Error(`Method "deleteAll" not implemented. Firebase.`);
    } catch (err) {
      console.error(err);
    }
  }
}

export default ContainerFirebase;
