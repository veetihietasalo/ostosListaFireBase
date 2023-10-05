import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Product"
          value={product}
          onChangeText={(text) => setProduct(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
      </View>
      <Button title="Save" onPress={saveItem} />
      <Text style={styles.title}>Shopping List</Text>
      <FlatList
        data={shoppingList}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{`${item.product}, ${item.amount}`}</Text>
            <TouchableOpacity onPress={() => deleteItem(item.key)}>
              <Text style={styles.deleteText}>Bought</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 90,
    backgroundColor: '#f8f8f8',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  listText: {
    fontSize: 16,
  },
  deleteText: {
    color: 'blue',
  },
});

export default App;
