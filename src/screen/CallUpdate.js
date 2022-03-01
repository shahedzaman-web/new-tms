import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import {baseURL, baseMediaURL} from '../../baseURL';
import VideoPlayer from 'react-native-video-controls';
import AppScreen from '../components/AppScreen';
import AppTitle from '../components/AppTitle';
import BrandName from '../components/BrandName';
import colors from '../config/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {CheckBox} from 'react-native-elements';
import AuthContext from '../hooks/authContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddressContext from '../hooks/addressContext';
import LanguageContext from '../hooks/languageContext';

const CallUpdate = ({route, navigation}) => {
  const [pcmMaintenance, setPcmMaintenance] = useState(false);
  const [priceMaintenance, setPriceMaintenance] = useState(false);
  const [visibilityItem, setVisibilityItem] = useState(false);
  const [outletEnrolled, setOutletEnrolled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalViewVideo, setModalViewVideo] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stockAvailability, setStockAvailability] = useState([]);
  const [comment, setComment] = useState('');
  const [videoViewed, setVideoViewed] = useState(false);
  const [isBrandLoading, setIsBrandLoading] = useState(false);
  const [base64Image, setBase64Image] = useState('');
  const [image, setImage] = useState(null);
  const [filePath, setFilePath] = useState('');

  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;

  // console.log({stockAvailability});
  // console.log({route});

  const authContext = useContext(AuthContext);
  const addressContext = useContext(AddressContext);
  const {address} = addressContext;
  // console.log({pcmMaintenance});

  const fileName = route.params.communication;
  console.log({fileName});

  useEffect(() => {
    if (fileName) {
      setFilePath(baseMediaURL + fileName);
    }
  }, [filePath]);

  console.log({filePath});

  useEffect(() => {
    const fetchBrandData = async () => {
      setIsBrandLoading(true);
      const settings = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authContext.user,
        },
      };
      const response = await fetch(baseURL + '/app/brands/all', settings);
      const jsonData = await response.json();
      // console.log({jsonData});
      setStockAvailability(jsonData?.data);
      setIsBrandLoading(false);
    };
    fetchBrandData();
  }, []);

  const handleCapturePhoto = () => {
    setModalVisible(prevState => !prevState);
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      includeBase64: true,
      includeExif: true,
      width: 300,
      height: 200,
      cropping: true,
    }).then(image => {
      setBase64Image({
        image: {
          uri: `data:${image.mime};base64,` + image.data,
          width: image.width,
          height: image.height,
        },
        images: null,
      });
      setImage(image);
      setModalVisible(prevState => !prevState);
    });
  };
console.log({image})

  // const choosePhotoFromLibrary = () => {
  //   ImagePicker.openPicker({
  //     width: 300,
  //     height: 200,

  //     includeBase64: true,
  //     includeExif: true,
  //   }).then(image => {
  //     setBase64Image({
  //       image: {
  //         uri: `data:${image.mime};base64,` + image.data,
  //         width: image.width,
  //         height: image.height,
  //       },
  //       images: null,
  //     });
  //     setImage(image);
  //     setModalVisible(prevState => !prevState);
  //   });
  // };
  // console.log({base64Image})
  const handleViewVideoCloseBtn = () => {
    setModalViewVideo(prevState => !prevState);
    setVideoViewed(true);
  };
  // console.log(toggleCheckBox);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const url = baseURL + `/app/tms/${route.params.dropdown}`;

      const response = await axios.post(
        url,
        {
          pcmMaintenance,
          priceMaintenance,
          visibilityItem,
          address,
          outletEnrolled,
          stockAvailability: stockAvailability.map(sav => ({
            brandName: sav.name,
            quantity: sav.quantity,
          })),
          comment,
          photo: base64Image,
        },
        {
          headers: {
            Authorization: authContext.user,
          },
        },
      );
      const data = response.data;
      console.log({data});

      data.code === 201 && setSuccessModal(true);

      setIsLoading(false);
    } catch (err) {
      console.log({err});
      console.log(err.response);
      Alert.alert('Error', 'Something went wrong');
      setIsLoading(false);
    }
  };
  const handleSuccessModalClose = () => {
    setSuccessModal(false);
    navigation.navigate('Home');
  };

  return (
    <AppScreen>
      <ScrollView>
        <AppTitle title={toggleLanguage ? 'Call Update' : 'কল আপডেট'} />
        <View style={styles.container}>
          <View style={styles.box}>
            <View style={styles.textBox}>
              <Text style={styles.boxText}>
                {toggleLanguage ? 'PCM Maintenance' : 'পিসিএম মেইনটেনেন্স'}{' '}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: wp('30%'),
                alignItems: 'center',
              }}>
              <CheckBox
                center
                checked={pcmMaintenance}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={colors.primary}
                onPress={() => setPcmMaintenance(!pcmMaintenance)}
              />
              <Text style={{color: colors.primary, fontWeight: '600'}}>
                {toggleLanguage ? 'Yes' : 'হ্যাঁ'}
              </Text>
              <CheckBox
                center
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={colors.primary}
                checked={pcmMaintenance === false}
                onPress={() => setPcmMaintenance(!pcmMaintenance)}
              />
              <Text style={{color: colors.primary, fontWeight: '600'}}>
                {toggleLanguage ? 'No' : 'না'}
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.textBox}>
              <Text style={styles.boxText}>
                {toggleLanguage
                  ? 'Price Compliance maintenance'
                  : 'প্রাইস কম্পিলিয়ান্স মেইনটেনেন্স'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: wp('30%'),
                alignItems: 'center',
              }}>
              <CheckBox
                center
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={colors.primary}
                checked={priceMaintenance}
                onPress={() => setPriceMaintenance(!priceMaintenance)}
              />
              <Text style={{color: colors.primary, fontWeight: '600'}}>
                {toggleLanguage ? 'Yes' : 'হ্যাঁ'}
              </Text>
              <CheckBox
                center
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={colors.primary}
                checked={priceMaintenance === false}
                onPress={() => setPriceMaintenance(!priceMaintenance)}
              />
              <Text style={{color: colors.primary, fontWeight: '600'}}>
                {' '}
                {toggleLanguage ? 'No' : 'না'}
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.textBox}>
              <Text style={styles.boxText}>
                {toggleLanguage
                  ? 'Visibility item maintenance'
                  : 'ভিসিবিলিটি আইটেম মেইনটেনেন্স'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: wp('30%'),
                alignItems: 'center',
              }}>
              <CheckBox
                center
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={colors.primary}
                checked={visibilityItem}
                onPress={() => setVisibilityItem(!visibilityItem)}
              />
              <Text style={{color: colors.primary, fontWeight: '600'}}>
                {toggleLanguage ? 'Yes' : 'হ্যাঁ'}
              </Text>
              <CheckBox
                center
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={colors.primary}
                checked={visibilityItem === false}
                onPress={() => setVisibilityItem(!visibilityItem)}
              />
              <Text style={{color: colors.primary, fontWeight: '600'}}>
                {' '}
                {toggleLanguage ? 'No' : 'না'}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.textBox}>
              <Text style={styles.boxText}>
                {toggleLanguage ? '  Outlet Enrolled' : 'আউটলেট নথিভুক্ত'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                width: wp('30%'),
                alignItems: 'center',
              }}>
              <CheckBox
                center
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={colors.primary}
                checked={outletEnrolled}
                onPress={() => setOutletEnrolled(!outletEnrolled)}
              />
              <Text style={{color: colors.primary, fontWeight: '600'}}>
                {toggleLanguage ? 'Yes' : 'হ্যাঁ'}
              </Text>
              <CheckBox
                center
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor={colors.primary}
                checked={outletEnrolled === false}
                onPress={() => setOutletEnrolled(!outletEnrolled)}
              />
              <Text style={{color: colors.primary, fontWeight: '600'}}>
                {' '}
                {toggleLanguage ? 'No' : 'না'}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.bigTextBox}>
              <Text style={[styles.boxText, styles.textCenter]}>
                {toggleLanguage ? 'Stock Availability' : 'স্টক অভায়লাবিলিটি'}
              </Text>
              <Text
                style={{fontWeight: '500', fontSize: 12, textAlign: 'center'}}>
                {toggleLanguage
                  ? '(if yes Entry count)'
                  : '(যদি হ্যাঁ এন্ট্রি গণনা)'}
              </Text>
            </View>
            <View style={{width: wp('100%')}}>
              {isBrandLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                stockAvailability.map((item, index) => (
                  <BrandName
                    item={item}
                    key={index}
                    setStockAvailability={setStockAvailability}
                    stockAvailability={stockAvailability}
                  />
                ))
              )}
            </View>
          </View>
          <View style={styles.commentBox}>
            <Text style={styles.commentText}>
              {toggleLanguage ? 'Comment' : 'কমেন্ট'}
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Write your comment here & click Submit"
            placeholderTextColor="gray"
            multiline={true}
            numberOfLines={4}
            onChangeText={text => setComment(text)}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <TouchableOpacity style={styles.card} onPress={handleCapturePhoto}>
              {image ? (
                <View
                  style={{
                    margin: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={{uri: image.path}}
                    style={{width: 60, height: 60, borderRadius: 30}}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      paddingVertical: 8,
                      fontWeight: '600',
                    }}>
                    {toggleLanguage
                      ? 'Successfully Photo Captured'
                      : 'সফলভাবে ছবি তোলা হয়েছে'}
                  </Text>
                </View>
              ) : (
                <>
                  <Image
                    source={require('../assets/image/cam.png')}
                    style={{width: 70, height: 70}}
                  />
                  <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                    {toggleLanguage ? 'Capture Photo' : 'ছবি ক্যাপচার করুন'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => setModalViewVideo(prevState => !prevState)}>
              <Image
                source={require('../assets/image/wallet.png')}
                style={{width: 70, height: 70, borderRadius: 35}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  paddingVertical: 8,
                  fontWeight: '600',
                }}>
                {toggleLanguage ? 'Communication' : 'কমিউনিকেশন'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row-reverse'}}>
            {image && videoViewed ? (
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                {isLoading && <ActivityIndicator size="small" color="white" />}
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {toggleLanguage ? 'Submit' : 'Submit'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.disableSubmitBtn} disabled={true}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {toggleLanguage ? 'Submit' : 'সাবমিট'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <View style={styles.modalTextBox}>
              <Text style={styles.modalText}>
                {toggleLanguage ? 'Upload Photo' : 'ছবি আপলোড'}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={takePhotoFromCamera}>
                <Text style={styles.modalBtnText}>
                  {toggleLanguage ? 'Take Photo' : 'ছবি তুলুন'}
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.modalBtn}
                onPress={choosePhotoFromLibrary}>
                <Text style={styles.modalBtnText}>
                {toggleLanguage ? "Choose From Library" : "লাইব্রেরি থেকে বাছাই কর"}
                  </Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setModalVisible(prevState => !prevState)}>
                <Text style={styles.modalBtnText}>
                  {toggleLanguage ? 'Close' : 'বন্ধ করুন'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={successModal}>
        <View style={styles.modalContainer}>
          <View style={{alignItems: 'center'}}>
            <Icon name="check-circle" size={100} color="#2ECC71" solid />
            <View style={styles.modalBox}>
              <Text style={styles.successTitle}>
                {toggleLanguage ? 'Submit Success' : 'সাবমিট সাকসেস'}
              </Text>
              <Text style={styles.successText}>
                {toggleLanguage
                  ? 'Your feedback has been successfully submitted.'
                  : 'আপনার ফিডব্যাক সফলভাবে জমা দেওয়া হয়েছে.'}
              </Text>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={handleSuccessModalClose}>
                <Text style={styles.modalBtnText}>
                  {toggleLanguage ? 'Close' : 'বন্ধ করুন'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={modalViewVideo}>
        <View style={styles.modalView}>
          {filePath ? (
            <VideoPlayer
              source={{
                uri: "http://bandhan.fifo-tech.com/app/media/EAS_Advocacy_Final1641374139097.mp4",
              }}
              style={{width: wp('80%'), height: hp('50%')}}
            />
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '80%',
                height: '80%',
              }}>
              <Icon
                name="exclamation-circle"
                size={100}
                color={colors.primary}
                solid
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginVertical: 20,
                  color: colors.primary,
                }}>
                {toggleLanguage
                  ? 'No Video Found!'
                  : 'কোন ভিডিও পাওয়া যায়নি!'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={{
              ...styles.openButton,
              backgroundColor: colors.primary,
            }}
            onPress={handleViewVideoCloseBtn}>
            <Text style={styles.textStyle}>
              {toggleLanguage ? 'Close' : 'বন্ধ করুন'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </AppScreen>
  );
};

export default CallUpdate;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    zIndex: -1,
  },
  box: {
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBox: {
    backgroundColor: colors.primary,
    padding: 19,
    width: wp('60%'),
  },
  boxText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bigTextBox: {
    backgroundColor: colors.primary,
    padding: 28,
    width: wp('34%'),
  },
  smallTextBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 6,
  },
  textCenter: {
    textAlign: 'center',
  },
  commentBox: {
    backgroundColor: colors.primary,
    padding: 6,
    width: wp('25%'),
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  commentText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    height: hp('10%'),
    padding: 10,
  },
  card: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderWidth: 1,
    borderColor: colors.primary,
    height: hp('18%'),
    width: '45%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 12,
  },
  modalContainer: {
    margin: 20,
    marginTop: hp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    height: hp('40%'),
    padding: 20,
    elevation: 5,
    zIndex: 10,
  },
  modalBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextBox: {
    marginVertical: 12,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
  },
  modalBtn: {
    backgroundColor: colors.primary,
    padding: 10,
    width: wp('50%'),
    marginVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  modalBtnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disableSubmitBtn: {
    backgroundColor: '#979797',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    marginVertical: 10,
  },
  successText: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
  },
  modalView: {
    margin: 20,
    marginTop: hp('10%'),
    backgroundColor: 'white',
    borderRadius: 10,
    height: hp('40%'),
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',

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
});
