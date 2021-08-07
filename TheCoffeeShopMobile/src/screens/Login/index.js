import 'react-native-gesture-handler';
import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  DrawerLayoutAndroid,
  ScrollView,
  Button,
  TouchableOpacity,
  Modal,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import DropShadow from 'react-native-drop-shadow';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../../config/context';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import CommentTag from '../../components/commentTag/index';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Avatar, Card, Input, Overlay} from 'react-native-elements';
import {Backport} from '../../config/port';
const Login = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isoverlay, setisoverlay] = useState(false);
  const [account, setAccount] = useState({us: '', pw: ''});
  const [signupacc, setsignupacc] = useState({
    email: '',
    fName: '',
    password: '',
  });
  const [isoverlaysucc, setisoverlaysucc] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [isloadingsu, setIsloadingsu] = useState(false);
  const {signIn} = React.useContext(AuthContext);

  const onchangKey = (usname, password) => {
    if (password === ' ') {
      setAccount({...account, us: usname});
    } else setAccount({...account, pw: password});
  };
  const onchangKeySignup = (usname, fullname, password) => {
    console.log(`usn ${usname} fullname ${fullname} pass ${password}`);
    if (usname !== ' ') {
      setsignupacc({...signupacc, email: usname});
    }
    if (fullname !== ' ') {
      setsignupacc({...signupacc, fName: fullname});
    }
    if (password !== ' ') {
      setsignupacc({...signupacc, password: password});
    }
  };
  const onSignup = () => {
    if (
      signupacc.email === ' ' ||
      signupacc.fName === ' ' ||
      signupacc.password === ' '
    )
      console.log('>>>chua dien day du');
    else {
      setIsloadingsu(true);
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(signupacc),
      };
      fetch(`${Backport}/users/signup`, requestOptions)
        .then((response) => response.json())
        .then((datare) => {
          console.log('>>data', datare);
          setIsloadingsu(false);
          toggleOverlay();
          toggleOverlaysucc();
        });
    }
  };
  GoogleSignin.configure({
    webClientId:
      '161356782679-supo9tgvceuf5u8ts0d0su6d3eg4sckf.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });
  const GsignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('>>userInfo', userInfo);
      signIn('kaitrung99@gmail.com', 'Abc@123');
    } catch (error) {
      console.log('error', error);
      signIn('kaitrung99@gmail.com', 'Abc@123');
    }
  };
  const loginHandle = () => {
    // setIsloading(true);
    console.log('>>ac', account);
    setIsloading(true);
    signIn(account.us, account.pw);
    setIsloading(false);
  };
  const toggleOverlay = () => {
    setisoverlay(!isoverlay);
  };
  const toggleOverlaysucc = () => {
    setisoverlaysucc(!isoverlaysucc);
  };
  return (
    <ImageBackground
      style={{
        flex: 1,
        width: '100%',
        height: 570,
        opacity: 0.9,
        alignItems: 'center',
      }}
      source={require('../../img/05a902c987f2ef1988a8432b49687ad8.jpg')}>
      <View style={{height: 150, flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={require('../../img/LogoCoffee-Shop.png')}
          style={{width: 187, height: 70}}
        />
      </View>
      <View
        style={{
          height: 320,
          // flexDirection: 'row',
          backgroundColor: '#ffffff',
          width: '80%',
          borderRadius: 10,
          opacity: 0.9,
        }}>
        <View style={{width: '100%', padding: 10}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              color: '#4a507a',
            }}>
            {'Đăng nhập'}
          </Text>
        </View>
        <View style={{width: '100%', alignItems: 'center', flex: 1}}>
          <View style={{width: '90%'}}>
            <Input
              placeholder="Tên đăng nhập"
              leftIcon={
                <FontAwesome5
                  style={{color: 'white', fontSize: 20, color: 'grey'}}
                  name={'envelope'}
                  solid
                />
              }
              onChangeText={(values) => onchangKey(values, ' ')}
            />
          </View>
          <View style={{width: '90%'}}>
            <Input
              placeholder="Mật khẩu"
              leftIcon={
                <FontAwesome5
                  style={{color: 'white', fontSize: 20, color: 'grey'}}
                  name={'lock'}
                  solid
                />
              }
              onChangeText={(values) => onchangKey(' ', values)}
              secureTextEntry={true}
            />
          </View>

          {!isloading ? (
            <TouchableOpacity
              style={{
                width: '100%',
                height: 45,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              onPress={() => {
                loginHandle();
              }}>
              <View
                style={{
                  width: '75%',
                  height: 45,
                  backgroundColor: '#4a507a',
                  borderRadius: 20,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {'Đăng nhập'}
                </Text>
                {/* <ActivityIndicator size="large" color="#ffff" /> */}
              </View>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                width: '100%',
                height: 45,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '75%',
                  height: 45,
                  backgroundColor: '#4a507a',
                  borderRadius: 20,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../img/post-loader.gif')}
                  style={{width: 130, height: 130}}
                />
                {/* <ActivityIndicator size="large" color="#ffff" /> */}
              </View>
            </View>
          )}

          <View style={{paddingTop: 20}}></View>
          <View
            style={{
              width: '63%',
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 10,
              marginBottom: 10,
            }}>
            <TouchableOpacity onPress={() => GsignIn()}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '97%',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: 'grey'}}>{'Đăng nhập bằng Google'}</Text>
                <Image
                  source={require('../../img/google-2981831-2476479.png')}
                  style={{width: 20, height: 20}}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          paddingTop: 20,
          flexDirection: 'row',
          width: '71%',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 15, color: 'white'}}>
          {'Bạn không có tài khoản?'}
        </Text>
        <TouchableOpacity onPress={toggleOverlay}>
          <Text
            style={{
              fontSize: 15,
              color: '#e07c58',
              textDecorationLine: 'underline',
              fontStyle: 'italic',
            }}>
            {'Đăng ký ngay'}
          </Text>
        </TouchableOpacity>
      </View>
      <Overlay isVisible={isoverlay} onBackdropPress={toggleOverlay}>
        <View
          style={{
            width: 300,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              color: '#4a507a',
            }}>
            {'Đăng ký'}
          </Text>
          <Input
            placeholder="Email"
            leftIcon={
              <FontAwesome5
                style={{color: 'white', fontSize: 20, color: 'grey'}}
                name={'envelope'}
                solid
              />
            }
            onChangeText={(values) => onchangKeySignup(values, ' ', ' ')}
          />
          <Input
            placeholder="Họ và tên"
            leftIcon={
              <FontAwesome5
                style={{color: 'white', fontSize: 20, color: 'grey'}}
                name={'address-card'}
                solid
              />
            }
            onChangeText={(values) => onchangKeySignup(' ', values, ' ')}
          />
          <Input
            placeholder="Mật khẩu"
            leftIcon={
              <FontAwesome5
                style={{color: 'white', fontSize: 20, color: 'grey'}}
                name={'lock'}
                solid
              />
            }
            onChangeText={(values) => onchangKeySignup(' ', ' ', values)}
            secureTextEntry={true}
          />
          {isloadingsu ? (
            <View
              style={{
                width: '100%',
                height: 45,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '75%',
                  height: 45,
                  backgroundColor: '#4a507a',
                  borderRadius: 20,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../img/post-loader.gif')}
                  style={{width: 130, height: 130}}
                />
                {/* <ActivityIndicator size="large" color="#ffff" /> */}
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                width: '100%',
                height: 45,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              onPress={onSignup}>
              <View
                style={{
                  width: '75%',
                  height: 45,
                  backgroundColor: '#4a507a',
                  borderRadius: 20,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  {'Đăng ký'}
                </Text>
                {/* <ActivityIndicator size="large" color="#ffff" /> */}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Overlay>
      <Overlay isVisible={isoverlaysucc} onBackdropPress={toggleOverlaysucc}>
        <View
          style={{
            width: 250,
            height: 100,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              textAlign: 'center',
              color: 'grey',
            }}>
            {'Đăng ký thành công, xác nhận email để hoàn tất'}
          </Text>
        </View>
      </Overlay>
    </ImageBackground>
  );
};
export default Login;
