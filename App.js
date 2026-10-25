import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text, ListItem } from 'react-native-elements';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, remove } from 'firebase/database';
import localList from './localList';

// Optional. Set in .env (see .env.example). Expo inlines EXPO_PUBLIC_ values into the JS bundle at build time,
// so each one has to be read as process.env.EXPO_PUBLIC_..., not through a variable name.
const env = {
  EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_DATABASE_URL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Without a full config (the course project is gone) the app runs in demo mode on a local list.
const missing = Object.keys(env).filter((name) => !env[name]);
const demoMode = missing.length > 0;
if (demoMode && missing.length < Object.keys(env).length) {
  console.warn(`Firebase config incomplete, missing ${missing.join(', ')}. Running in demo mode.`);
}

const firebaseConfig = {
  apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// The same three calls either way: Firebase when it's configured, the local list in demo mode.
let listStore;
if (demoMode) {
  listStore = {
    subscribe: (onData) => localList.onValue(onData),
    add: (item) => localList.push(item),
    remove: (key) => localList.remove(key),
  };
} else {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  listStore = {
    // onValue returns the unsubscribe function.
    subscribe: (onData, onError) => onValue(ref(database, 'shopping_list/'), (snapshot) => onData(snapshot.val()), onError),
    add: (item) => set(push(ref(database, 'shopping_list/')), item),
    remove: (key) => remove(ref(database, `shopping_list/${key}`)),
  };
}

const App = () => {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  // Returning the unsubscribe removes the listener with the component.
  useEffect(() => listStore.subscribe((data) => {
    const items = data ? Object.keys(data).map((key) => ({ key, ...data[key] })) : [];
    setShoppingList(items);
  }, (error) => Alert.alert('Could not load the list', error.message)), []);

  const saveItem = () => {
    if (!product.trim()) return;
    // The list updates locally right away, with Firebase the promise only settles when the server answers.
    listStore.add({ product: product.trim(), amount: amount.trim() })
      .catch((error) => Alert.alert('Save failed', error.message));
    setProduct('');
    setAmount('');
  };

  const deleteItem = (key) => {
    listStore.remove(key).catch((error) => Alert.alert('Delete failed', error.message));
  };

  return (
    <View style={styles.container}>
      {demoMode && <Text style={styles.demo}>Demo mode: data stays on this device.</Text>}
      <Input
        label="Product"
        value={product}
        onChangeText={(text) => setProduct(text)}
        containerStyle={styles.inputContainer}
      />
      <Input
        label="Amount"
        value={amount}
        onChangeText={(text) => setAmount(text)}
        containerStyle={styles.inputContainer}
      />
      <Button title="Save" onPress={saveItem} />
      <Text h4 style={styles.title}>Shopping List</Text>
      <Text style={styles.hintText}>Swipe to mark as bought</Text>
      <FlatList
        data={shoppingList}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <ListItem.Swipeable
            rightContent={
              <Button
                title="Bought"
                onPress={() => deleteItem(item.key)}
                buttonStyle={{ minHeight: '100%', backgroundColor: 'blue' }}
              />
            }
          >
            <ListItem.Content>
              <ListItem.Title>{`${item.product}, ${item.amount}`}</ListItem.Title>
            </ListItem.Content>
          </ListItem.Swipeable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  demo: {
    textAlign: 'center',
    color: '#b00020',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  title: {
    marginVertical: 20,
    textAlign: 'center',
  },
  hintText: {
    textAlign: 'center',
    marginBottom: 10,
    color: 'grey',
  },
});

export default App;