import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Image,
  Platform,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoPlayer from 'react-native-video-controls';
import {baseMediaURL} from '../../baseURL.json';
// Import RNFetchBlob for the file download
import BlobCourier from 'react-native-blob-courier';

import Icon from 'react-native-vector-icons/FontAwesome';

const GuidePannel = ({item, index}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItem, setModalItem] = useState({});
  const [storedData, setStoredData] = useState({});
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  let filePath = baseMediaURL + item.file;
//   console.log({filePath});
console.log({item});
  const dateData = item.date;
  const date = new Date(dateData);
  const dateString = date.toDateString();
  const timeString = date.toLocaleTimeString();
//   console.log({dateString, timeString});
  // check if the item is already in the downloaded list

//   console.log('stored data', storedData);
  useEffect(() => {
    const checkIfDownloaded = async () => {
      const downloaded = await AsyncStorage.getItem(`guide${item.file}`);
      console.log({downloaded});
      const data = JSON.parse(downloaded);
    //   console.log({downloaded});
    //   console.log({data});
      if (data) {
        setStoredData(data);
        // console.log({storedData});
      } else {
        setShowDownloadBtn(true);
      }
    };
    checkIfDownloaded();
  }, [showDownloadBtn]);

  useEffect(() => {
    if (storedData) {
      filePath = storedData.file;
    }
  }, [storedData]);
  // handle  stroage permission
  const requestRequiredPermissionsOnAndroidAsync = async () => {
    if (Platform.OS !== 'android') {
      return;
    }
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
    } catch (err) {
      console.warn(err);
    }
  };
  // download the file
  const handleDownload = async item => {
    requestRequiredPermissionsOnAndroidAsync();
    try {
      setIsDownloading(prevState => !prevState);
      if (item.fileType === 'mp4') {
        const request0 = {
          filename: `{item.file}_video.mp4`,
          method: 'GET',
          mimeType: 'video/mp4',
          url: filePath,
        };
        const fetchedResult = await BlobCourier.fetchBlob(request0);
        const file = await fetchedResult.data.absoluteFilePath;
        // console.log({fetchedResult});

        await AsyncStorage.setItem(
          `guide${item.file}`,
          JSON.stringify({
            file,
            fileType: item.fileType,
          }),
        );

        setStoredData({
          file,
          fileType: item.fileType,
        });
        setShowDownloadBtn(false);
        setIsDownloading(prevState => !prevState);
        setShowDownloadBtn(false);
        alert('Video Downloaded Successfully.');
      } else {
        const request0 = {
          filename: item.file,
          method: 'GET',
          mimeType: 'image/jpeg',
          url: filePath,
        };
        const fetchedResult = await BlobCourier.fetchBlob(request0);
        const file = await fetchedResult.data.absoluteFilePath;
        // console.log({file});
        // console.log({fetchedResult});
        await AsyncStorage.setItem(
          `guide${item.file}`,
          JSON.stringify({
            file,
            fileType: item.fileType,
          }),
        );
        setStoredData({
          file,
          fileType: item.fileType,
        });

        setIsDownloading(prevState => !prevState);
        setShowDownloadBtn(false);
        Alert.alert('Image Downloaded Successfully.');
      }
    } catch (e) {
    //   console.log('handleDownloadFile error', e);
      setIsDownloading(prevState => !prevState);
      setShowDownloadBtn(false);
      Alert.alert('Something went wrong. Please try again.');
    }
  };

  const handleView = () => {
    setModalVisible(true);
    setModalItem(storedData);
  };
//   console.log({storedData});

//   console.log(item.video);
  
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{index + 1}.</Text>
      <View>
        {item.fileType === 'png' || item.fileType === 'jpg' ? (
          <View style={styles.viewContainer}>
            <Image source={{uri: filePath}} style={styles.image} />
          </View>
        ) : (
          <View style={styles.viewContainer}>
            <View style={styles.videoIcon}>
              <Icon name="play-circle" size={40} color={colors.primary} solid />
            </View>
          </View>
        )}
      </View>
      <View style={{width: wp('45%')}}>
        <Text style={styles.brand}>{item.name}</Text>
        <Text style={styles.time}>
          {dateString}_{timeString}
        </Text>
        {/* <Text style={styles.brand}></Text> */}
      </View>
      <View>
        {showDownloadBtn ? (
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={() => handleDownload(item)}>
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => handleView()}>
            {storedData.fileType == 'png' || storedData.fileType == 'jpg' ? (
              <Text style={styles.buttonText}>View</Text>
            ) : (
              <Text style={styles.buttonText}>Play</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalView}>
          {modalItem.fileType == 'png' || modalItem.fileType == 'jpg' ? (
            <Image
              source={{uri: modalItem.file}}
              style={{width: wp('80%'), height: hp('40%')}}
            />
          ) : (
            <VideoPlayer
              source={{
                uri: modalItem.file,
              }}
              style={{width: wp('80%'), height: hp('50%')}}
            />
          )}

          <TouchableOpacity
            style={{
              ...styles.openButton,
              backgroundColor: colors.primary,
            }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={isDownloading} transparent={true}>
        <View style={styles.downModalContainer}>
          <Text style={styles.modalDownText}>Downloading</Text>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Modal>
    </View>
  );
};

export default GuidePannel;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  video: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('100%'),
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 2,
  },
  time: {
    fontSize: 12,
    color: 'gray',
    paddingVertical: 5,
  },
  brand: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  viewContainer: {
    width: wp('30%'),
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    marginTop: hp('30%'),
    backgroundColor: 'white',
    borderRadius: 10,
    height: hp('50%'),
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
    zIndex: 10,
  },
  openButton: {
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginTop: 10,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  downloadBtn: {
    backgroundColor: colors.primary,
    padding: 4,
    borderRadius: 5,
  },
  centeredView: {
    zIndex: 10,
  },
  videoIcon: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downModalContainer: {
    margin: 20,
    marginTop: hp('40%'),
    backgroundColor: 'white',
    borderRadius: 10,
    height: hp('20%'),
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDownText: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 12,
  },
});
