/* eslint-disable */
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
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../config/colors';
import Signature from 'react-native-signature-canvas';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {TextInput} from 'react-native-gesture-handler';
import LocationContext from '../hooks/locationContext';
import {baseURL_Server2} from '../../baseURL';
const DistributionIncentive = () => {
  const [dropdown, setDropdown] = useState(null);
  const [outlet, setOutlet] = useState(null);
  const [salesPoint, setSalesPoint] = useState({});
  const languageContext = useContext(LanguageContext);
  const locationContext = useContext(LocationContext);
  const {location} = locationContext;
  const {toggleLanguage} = languageContext;
  const userInfoContext = useContext(UserInfoContext);
  const {userInfo} = userInfoContext;
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [base64Image1, setBase64Image1] = useState('');
  const [base64Image2, setBase64Image2] = useState('');
  const [signature1, setSignature1] = useState(null);
  const [signature2, setSignature2] = useState(null);
  const [viewSignatureModal1, setViewSignatureModal1] = useState(false);
  const [viewSignatureModal2, setViewSignatureModal2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [distributionData, setDistributionData] = useState(null);
  const [verifyOtpModal, setVerifyOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [submitOtpLoading, setSubmitOtpLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSignature1 = signature => {
    setSignature1(signature);
    setViewSignatureModal1(false);
  };

  const handleVerifyRetailer = async () => {
    try {
      if (image1 && image2 && signature1 && signature2) {
        setSubmitOtpLoading(true);
        const response = await axios.post(
          baseURL_Server2 + '/api/verifyRetailer',
          {
            retailerNumber: distributionData?.phone,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (response.status !== 200) {
          Alert.alert('Error', 'Something went wrong.');
        } else {
          setSubmitOtpLoading(false);
          setVerifyOtpModal(true);
        }
      } else {
        alert('Please Fill All Fields');
      }
    } catch (error) {
      alert(error.response.data);
    }
  };
  const handleSignature2 = signature => {
    setSignature2(signature);
    setViewSignatureModal2(false);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };
  useEffect(() => {
    if (userInfoContext.userInfo.outletCode) {
      setOutlet(userInfoContext.userInfo.outletCode);
    }
  }, [userInfoContext.userInfo.outletCode]);
  React.useEffect(() => {
    const getDistributionData = async () => {
      if (dropdown) {
        setLoading(true);
        const url = baseURL_Server2 + `/api/outlet-target-retailer/${dropdown}`;
        console.log({url});
        const response = await axios.get(url);
        console.log('response----------->', response);
        if (response.status === 200) {
          setDistributionData(response.data);
          setLoading(false);
        } else {
          Alert.alert('Error', 'Something went wrong');
        }
      }
    };
    getDistributionData();
  }, [dropdown]);

  const takePhotoFromCamera1 = () => {
    ImagePicker.openCamera({
      includeExif: true,
      includeBase64: true,
      includeExif: true,
      width: 300,
      height: 200,
      cropping: true,
    }).then(image => {
      setBase64Image1({
        image: {
          uri: `data:${image.mime};base64,` + image.data,
        },
        images: null,
      });
      setImage1(image);
    });
  };
  const takePhotoFromCamera2 = () => {
    ImagePicker.openCamera({
      includeExif: true,
      includeBase64: true,
      includeExif: true,
      width: 300,
      height: 200,
    }).then(image => {
      setBase64Image2({
        image: {
          uri: `data:${image.mime};base64,` + image.data,
        },
        images: null,
      });
      setImage2(image);
    });
  };

  const handleDistributionSubmit = async () => {
    const payload = {
      region: userInfo?.region[0]?.name,
      area: userInfo?.area[0]?.name,
      retailerName: distributionData?.name + '',
      retailerPhone: distributionData?.phone,
      retailerAddress: distributionData?.address,
      outletCode: dropdown,
      storeName: distributionData?.storeName,
      sales: distributionData?.totalSales,
      incentivesOne: distributionData?.incentivesOne,
      incentivesTwo: distributionData?.incentivesTwo,
      location: `${location.coords.latitude}, ${location.coords.longitude}`,
      territory: userInfo?.territory[0]?.name,
      salesPoint: salesPoint.name,
      proofPhotoOne: base64Image1?.image?.uri,
      proofPhotoTwo: base64Image2?.image?.uri,
      retailerSign: signature1,
      tmsSign: signature2,
      tms: userInfo.name,
      typedOtp: otp,
      createdAt: moment(new Date()).format('YYYY-MM-DD'),
    };

    try {
      setSubmitLoading(true);
      const response = await axios.post(
        'http://172.16.1.133:5000/api/verifyOTP',
        JSON.stringify(payload),
        {
          headers: {'Content-type': 'application/json'},
        },
      );
      if (response.status === 200) {
        alert(response.data?.message);
        setSubmitLoading(false);
        setVerifyOtpModal(false);
        setDropdown(null);
        setImage1(null)
        setImage2(null)
        setBase64Image1("")
        setBase64Image2("")
        setSignature1(null)
        setSignature2(null)
      } else {
        alert('Something went wrong.');
      }
    } catch (e) {
      console.log({e});
    }
  };

  const _renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
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
                    setDropdown(item.value), setSalesPoint(item.salesPoint);
                  }}
                  renderItem={item => _renderItem(item)}
                  textError="Error"
                />
              ) : (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
            </View>
          </View>
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            distributionData &&
            dropdown && (
              <View>
                <Text style={styles.titleText}>
                  {' '}
                  {toggleLanguage ? 'Retailer Name' : 'রিটেইলার নাম '}
                </Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.text}>{distributionData?.name}</Text>
                </View>
                <Text style={styles.titleText}>
                  {' '}
                  {toggleLanguage ? 'Retailer Phone' : 'রিটেইলার ফোন'}
                </Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.text}>{distributionData?.phone}</Text>
                </View>
                <Text style={styles.titleText}>
                  {' '}
                  {toggleLanguage ? 'Retailer Address' : 'রিটেইলার এড্রেস'}
                </Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.text}>{distributionData?.address}</Text>
                </View>
                <Text style={styles.titleText}>
                  {' '}
                  {toggleLanguage ? 'Store Name' : 'স্টোর নাম'}
                </Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.text}>{distributionData?.storeName}</Text>
                </View>
                <Text style={styles.titleText}>
                  {' '}
                  {toggleLanguage ? 'Sales Count' : 'সেলস কাউন্ট'}
                </Text>
                <View style={styles.infoContainer}>
                  <Text style={styles.text}>
                    {distributionData?.totalSales}
                  </Text>
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
                    onPress={() =>
                      setViewSignatureModal1(prevState => !prevState)
                    }>
                      {signature1 ? (
          <Image
            resizeMode={"contain"}
            style={{  width: wp('70%'),
            height: hp('16%'), }}
            source={{ uri: signature1 }}
          />
        ) : <Icon
        name="signature"
        size={100}
        color={colors.primary}
        solid
      />}
                    
                    <Text style={styles.modalBtnText}>
                      {toggleLanguage
                        ? 'Retailer Signature '
                        : 'রিটেইলার স্বাক্ষর'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.signatureBtn}
                    onPress={() => setViewSignatureModal2(true)}>
                    {signature2 ? (
          <Image
            resizeMode={"contain"}
            style={{  width: wp('70%'),
            height: hp('16%'), }}
            source={{ uri: signature2 }}
          />
        ) : <Icon
        name="signature"
        size={100}
        color={colors.primary}
        solid
      />}
                    <Text style={styles.modalBtnText}>
                      {toggleLanguage ? 'TMS Signature' : 'টিএমএস স্বাক্ষর'}
                    </Text>
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity
                      onPress={handleVerifyRetailer}
                      style={styles.submitBtn}>
                      <Text style={styles.submitBtnText}>
                        {submitOtpLoading && <ActivityIndicator color="#fff" />}
                        {toggleLanguage ? 'Verify Retailer' : 'জমা দিন'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={viewSignatureModal1}>
                    <View style={styles.modalContainer}>
                      <View style={styles.signatureInsideContainer}>
                        <Signature
                          onOK={handleSignature1}
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
                    visible={viewSignatureModal2}>
                    <View style={styles.modalContainer}>
                      <View style={styles.signatureInsideContainer}>
                        <Signature
                          onOK={handleSignature2}
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
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={verifyOtpModal}>
                    <View style={styles.otpModal}>
                      <View style={styles.closedBtnContainer}>
                        <TouchableOpacity
                          onPress={() => setVerifyOtpModal(false)}>
                          <AntIcon
                            name="closecircle"
                            size={24}
                            color={colors.primary}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.modalInsideContainer}>
                        <Text style={styles.titleTextModal}>
                          {toggleLanguage
                            ? 'Verify Retailer'
                            : 'ভেরিফাই রিটেলার'}
                        </Text>
                        <View style={styles.modalInputContainer}>
                          <Text style={styles.otpText}>
                            {toggleLanguage ? 'OTP Code' : 'অটিপি কোড'}
                          </Text>
                          <TextInput
                            style={styles.modalInput}
                            onChangeText={text => setOtp(text)}
                            value={otp}
                            placeholder={
                              toggleLanguage
                                ? 'Enter OTP Code'
                                : 'অটিপি কোড প্রবেশ করুন'
                            }
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDistributionSubmit()}
                          style={styles.submitBtnModal}>
                          <Text style={styles.submitBtnText}>
                            {submitLoading && (
                              <ActivityIndicator color="white" />
                            )}
                            {toggleLanguage ? 'Submit' : 'জমা দিন'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
            )
          )}
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
    width: wp('55%'),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    margin: 16,
    height: 50,
    paddingHorizontal: 8,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  textItem: {
    flex: 1,
    fontSize: 24,
    marginVertical: 5,
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
    flexDirection: 'row',
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
  otpModal: {
    margin: 16,
    top: hp('25%'),
    alignItems: 'center',
    width: wp('90%'),
    height: hp('38%'),
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 5,
    padding: 10,
  },
  modalInsideContainer: {
    paddingVertical: 12,
  },
  modalInputContainer: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  otpText: {
    fontWeight: 'bold',
  },

  titleTextModal: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 18,

    paddingVertical: 20,
  },
  submitBtnModal: {
    backgroundColor: colors.primary,
    padding: 10,
    width: wp('80%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  modalInput: {
    width: wp('55%'),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  closedBtnContainer: {
    width: wp('90%'),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 10,
  },
});
