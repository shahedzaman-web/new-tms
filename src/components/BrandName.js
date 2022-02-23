import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import {CheckBox} from 'react-native-elements';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../config/colors';
import LanguageContext from '../hooks/languageContext';

const BrandName = ({item, setStockAvailability, stockAvailability}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [getValue, setGetValue] = useState(0);

  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;

  useEffect(() => {
    const indexToUpdate = stockAvailability.findIndex(
      x => x.name === item.name,
    );

    // console.log({indexToUpdate});
    const updatedData = [...stockAvailability]; // creates a copy of the array
    updatedData[indexToUpdate].quantity = getValue;

    updatedData.forEach(x => delete x.__v);
    updatedData.forEach(x => delete x._id);
    // console.log({updatedData});
    setStockAvailability(updatedData);
    // console.log({stockAvailability});
  }, [getValue]);

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: wp('60%'),
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 4,
          
        }}>
          <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: wp('20%'),
          }}>

        <Text style={{fontWeight: '500', fontSize: 12}}>{item.name}</Text>
          </View>
        <CheckBox
          size={16}
          containerStyle={{
            backgroundColor: 'transparent',
            borderWidth: 0,
            padding: 0,
            margin: 0,
          }}
          center
          title={toggleLanguage ? 'Yes' : 'হ্যাঁ'}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checkedColor={colors.primary}
          checked={toggleCheckBox === true}
          onPress={() => setToggleCheckBox(prevState => !prevState)}
        />

        <CheckBox
          size={16}
          containerStyle={{
            backgroundColor: 'transparent',
            borderWidth: 0,
            padding: 0,
            margin: 0,
          }}
          center
          title={toggleLanguage ? 'No' : 'না'}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checkedColor={colors.primary}
          checked={toggleCheckBox === false}
          onPress={() => setToggleCheckBox(prevState => !prevState)}
        />

        {toggleCheckBox && (
          <TouchableOpacity
            style={styles.smallTextBox}
            onPress={() => setModalVisible(true)}>
            <Text style={{fontSize: 12, color: 'gray'}}>{getValue}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          <View style={styles.row}>
            <Text>{toggleLanguage ? "Quantity" : "পরিমাণ"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Value"
              onChangeText={text => setGetValue(text)}
            />
          </View>
          <Pressable
            style={styles.button}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.buttonText}>     {toggleLanguage ? "Submit" : "সাবমিট"}</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default BrandName;

const styles = StyleSheet.create({
  smallTextBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 6,
  },
  modalView: {
    margin: 20,
    marginTop: hp('40%'),
    backgroundColor: 'white',
    borderRadius: 10,
    height: hp('20%'),
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 6,
    width: wp('60%'),
    height: hp('5%'),
  },
  button: {
    marginTop: hp('2%'),
    backgroundColor: colors.primary,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    zIndex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
