import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text, ListItem } from 'react-native-elements';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, remove } from 'firebase/database';

// Set in .env (see .env.example). Expo inlines EXPO_PUBLIC_ values into the JS bundle at build time,
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

const missing = Object.keys(env).filter((name) => !env[name]);
if (missing.length) {
  throw new Error(`Firebase config missing: ${missing.join(', ')}. Copy .env.example to .env, fill in the web app config from the Firebase console and restart Expo with \`npx expo start --clear\`.`);
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const App = () => {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    const shoppingListRef = ref(database, 'shopping_list/');
    // onValue returns the unsubscribe function, so the listener goes away with the component.
    return onValue(shoppingListRef, (snapshot) => {
      const data = snapshot.val();
      const items = data ? Object.keys(data).map((key) => ({ key, ...data[key] })) : [];
      setShoppingList(items);
    }, (error) => Alert.alert('Could not load the list', error.message));
  }, []);

  const saveItem = () => {
    const newRef = push(ref(database, 'shopping_list/'));
    set(newRef, { product, amount });
  };

  const deleteItem = (key) => {
    const itemRef = ref(database, `shopping_list/${key}`);
    remove(itemRef);
  };

  return (
    <View style={styles.container}>
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