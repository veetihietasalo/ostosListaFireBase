import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Input, Button, Text, ListItem } from 'react-native-elements';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, remove } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyABPoc4f0jphGkj489YjCn6FspwZ4TiSCw",

  authDomain: "ostoslistafirebase-b4cb4.firebaseapp.com",

  databaseURL: "https://ostoslistafirebase-b4cb4-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "ostoslistafirebase-b4cb4",

  storageBucket: "ostoslistafirebase-b4cb4.appspot.com",

  messagingSenderId: "822726064824",

  appId: "1:822726064824:web:0dba567afc747d99c7524d",

  measurementId: "G-KR8SPCQBRQ"

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
    onValue(shoppingListRef, (snapshot) => {
      const data = snapshot.val();
      const items = data ? Object.keys(data).map((key) => ({ key, ...data[key] })) : [];
      setShoppingList(items);
    });
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