import AsyncStorage from '@react-native-async-storage/async-storage';

const storeAuthToken = async authToken => {
  try {
    await AsyncStorage.setItem('authToken', authToken);
  } catch (error) {
    console.log('Error storing the auth token', error);
  }
};

const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.log('Error geting the auth token', error);
  }
};

const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.log('Error removing the auth token', error);
  }
};

export default {storeAuthToken, getAuthToken, removeAuthToken};
