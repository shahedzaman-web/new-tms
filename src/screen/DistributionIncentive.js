import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AppScreen from '../components/AppScreen';
import LanguageContext from '../hooks/languageContext';
import AppTitle from '../components/AppTitle';
import {Dropdown} from 'react-native-element-dropdown';
import UserInfoContext from '../hooks/userInfoContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../config/colors';
import Signature from 'react-native-signature-canvas';
import Icon from 'react-native-vector-icons/FontAwesome5';
const DistributionIncentive = () => {
  const [dropdown, setDropdown] = useState(null);
  const [outlet, setOutlet] = useState(null);
  const languageContext = useContext(LanguageContext);
  const {toggleLanguage} = languageContext;
  const userInfoContext = useContext(UserInfoContext);
  const [base64Image1, setBase64Image1] = useState('');
  const [base64Image2, setBase64Image2] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [signature1, setSignature1] = useState(null);
  const [signature2, setSignature2] = useState(null);
  const [viewSignatureModal1, setViewSignatureModal1] = useState(false);
  const [viewSignatureModal2, setViewSignatureModal2] = useState(false);

  const handleOK = signature => {
    console.log(signature);
    setSignature1(signature);
    setViewSignatureModal1(false);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const style = `.m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }`;

  useEffect(() => {
    if (userInfoContext.userInfo.outletCode) {
      setOutlet(userInfoContext.userInfo.outletCode);
    }
  }, [userInfoContext.userInfo.outletCode]);

  const takePhotoFromCamera1 = () => {
    ImagePicker.openCamera({
      includeBase64: true,
      includeExif: true,
      width: 300,
      height: 200,
      cropping: true,
    }).then(image => {
      setBase64Image1({
        image: {
          uri: `data:${image.mime};base64,` + image.data,
          width: image.width,
          height: image.height,
        },
        images: null,
      });
      setImage1(image);
    });
  };
  const takePhotoFromCamera2 = () => {
    ImagePicker.openCamera({
      includeBase64: true,
      includeExif: true,
      width: 300,
      height: 200,
      cropping: true,
    }).then(image => {
      setBase64Image2({
        image: {
          uri: `data:${image.mime};base64,` + image.data,
          width: image.width,
          height: image.height,
        },
        images: null,
      });
      setImage2(image);
    });
  };
  return (
    <AppScreen>
      <ScrollView>
        <AppTitle
          title={
            toggleLanguage
              ? 'Distribution Incentive'
              : 'ডিস্ট্রিবিউশন ইন্সেন্টিভ '
          }
        />
        <View style={styles.container}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.titleText}>
              {toggleLanguage ? 'Outlet Code' : 'আউটলেট কোড'}
            </Text>
            <View style={{width: wp('60%'), marginLeft: 5}}>
              {outlet ? (
                <Dropdown
                  placeholderStyle={styles.placeholderStyle}
                  style={styles.dropdown}
                  containerStyle={styles.shadow}
                  data={outlet}
                  placeholder="Select item"
                  search
                  searchPlaceholder="Search..."
                  labelField="label"
                  valueField="value"
                  label="Dropdown"
                  placeholder={dropdown ? dropdown : 'Select outlet'}
                  value={dropdown}
                  onChange={item => {
                    setDropdown(item.value);
                    // console.log('selected', item);
                  }}
                  renderItem={item => _renderItem(item)}
                  textError="Error"
                />
              ) : (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
            </View>
          </View>
          <View>
            <Text style={styles.titleText}>
              {' '}
              {toggleLanguage ? 'Retailer Name' : 'রিটেইলার নাম '}
            </Text>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Name</Text>
            </View>
            <Text style={styles.titleText}>
              {' '}
              {toggleLanguage ? 'Retailer Phone' : 'রিটেইলার ফোন'}
            </Text>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>0123456789</Text>
            </View>
            <Text style={styles.titleText}>
              {' '}
              {toggleLanguage ? 'Retailer Address' : 'রিটেইলার এড্রেস'}
            </Text>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Name</Text>
            </View>
            <Text style={styles.titleText}>
              {' '}
              {toggleLanguage ? 'Store Name' : 'স্টোর নাম'}
            </Text>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Name</Text>
            </View>
            <Text style={styles.titleText}>
              {' '}
              {toggleLanguage ? 'Total Sales' : 'টোটাল সেলস '}
            </Text>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Name</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 10,
              }}>
              <View>
                <Text style={styles.titleText}>
                  {' '}
                  {toggleLanguage ? 'Proof Photo 1' : 'প্রথম প্রুফ ফটো'}
                </Text>
                <TouchableOpacity
                  style={styles.takePhotoBtn}
                  onPress={takePhotoFromCamera1}>
                  <Image
                    source={
                      image1
                        ? {uri: image1.path}
                        : require('../assets/image/cam.png')
                    }
                    style={styles.image}
                  />
                  <Text style={styles.modalBtnText}>
                    {toggleLanguage ? 'Take Photo' : 'ছবি তুলুন'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.titleText}>
                  {' '}
                  {toggleLanguage ? 'Proof Photo 2' : 'দ্বিতীয় প্রুফ ফটো'}
                </Text>
                <TouchableOpacity
                  style={styles.takePhotoBtn}
                  onPress={takePhotoFromCamera2}>
                  <Image
                    source={
                      image2
                        ? {uri: image2.path}
                        : require('../assets/image/cam.png')
                    }
                    style={styles.image}
                  />
                  <Text style={styles.modalBtnText}>
                    {toggleLanguage ? 'Take Photo' : 'ছবি তুলুন'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.signatureContainer}>
              <Text style={styles.titleText}>
                {toggleLanguage ? 'Signature1' : 'স্বাক্ষর'}
              </Text>
              <TouchableOpacity
                style={styles.signatureBtn}
                onPress={() => setViewSignatureModal1(prevState => !prevState)}>
                <Icon
                  name="signature"
                  size={100}
                  color={colors.primary}
                  solid
                />
                <Text style={styles.modalBtnText}>
                  {toggleLanguage ? 'Retailer Signature ' : 'রিটেইলার স্বাক্ষর'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signatureBtn}
                onPress={() => setViewSignatureModal2(true)}>
                <Icon
                  name="signature"
                  size={100}
                  color={colors.primary}
                  solid
                />
                <Text style={styles.modalBtnText}>
                  {toggleLanguage ? 'TMS Signature' : 'টিএমএস স্বাক্ষর'}
                </Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity style={styles.submitBtn}>
                  <Text style={styles.submitBtnText}>
                    {toggleLanguage ? 'Submit' : 'জমা দিন'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={viewSignatureModal1}
                onRequestClose={() => {
                  setViewSignatureModal1(prevState => !prevState);
                }}>
                <View style={styles.modalContainer}>
                  <View style={styles.signatureInsideContainer}>
                    <Signature
                      onOK={handleOK}
                      onEmpty={handleEmpty}
                      descriptionText="Sign"
                      // clear button text
                      clearText="Clear"
                      // save button text
                      confirmText="Save"
                      // String, webview style for overwrite default style, all style: https://github.com/YanYuanFE/react-native-signature-canvas/blob/master/h5/css/signature-pad.css
                      webStyle={`.m-signature-pad--footer
                        .button {
                          background-color: red;
                          color: #FFF;
                        }`}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() =>
                      setViewSignatureModal1(prevState => !prevState)
                    }>
                    <Text style={styles.modalBtnText}>
                      {toggleLanguage ? 'Close Modal' : 'বন্ধ করুন'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={viewSignatureModal1}
                onRequestClose={() => {
                  setViewSignatureModal2(prevState => !prevState);
                }}>
                <View style={styles.modalContainer}>
                  <View style={styles.signatureInsideContainer}>
                    <Signature
                      onOK={handleOK}
                      onEmpty={handleEmpty}
                      descriptionText="Sign"
                      // clear button text
                      clearText="Clear"
                      // save button text
                      confirmText="Save"
                      webStyle={`.m-signature-pad--footer
                        .button {
                          background-color: red;
                          color: #FFF;
                        }`}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => setViewSignatureModal2(false)}>
                    <Text style={styles.modalBtnText}>
                      {toggleLanguage ? 'Close Modal' : 'বন্ধ করুন'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </View>
        </View>
      </ScrollView>
    </AppScreen>
  );
};

export default DistributionIncentive;

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  dropdownContainer: {flexDirection: 'row', alignItems: 'center', margin: 5},
  dropdown: {
    width: wp('60%'),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    margin: 16,
    height: 50,
    paddingHorizontal: 8,
  },
  titleText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 18,
    paddingVertical: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    height: 50,
    marginVertical: 10,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  takePhotoBtn: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    width: wp('40%'),
    height: hp('16%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  image: {width: 60, height: 60},
  signatureContainer: {},
  modalContainer: {
    margin: 16,

    alignItems: 'center',
    width: wp('90%'),
    height: hp('65%'),
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 5,
  },
  signatureInsideContainer: {
    width: wp('80%'),
    height: hp('55%'),

    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalBtn: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  modalBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signatureBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    width: wp('90%'),
    height: hp('20%'),
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: 'center',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    padding: 10,
    width: wp('90%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
