import 'react-native-gesture-handler';
import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  Modal,
  Picker,
} from 'react-native';
import {Avatar, Card, Input, Icon, Overlay} from 'react-native-elements';
import {connect} from 'react-redux';
import ProductCheckout from '../../components/productCheckout/index';
import {Backport} from '../../config/port';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const Checkout = (props) => {
  const formatCurrency = (monney) => {
    const mn = String(monney);
    return mn
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + '.') + prev;
      });
  };
  const formatDate = (date) => {
    const dateT = new Date(date);
    return (
      dateT.getDate() + '.' + (dateT.getMonth() + 1) + '.' + dateT.getFullYear()
    ); //prints expected format.
  };
  const [Isloading, setIsloading] = useState(false);
  const [fakeprice, setfakeprice] = useState(0);
  const [price, setprice] = useState(0);
  const [couponList, setCouponList] = useState([]);
  const [addRess, setaddRess] = useState('Nhập địa chỉ nhận hàng');
  const [inputadd, setinputadd] = useState('');
  const [visible, setVisible] = useState(false);
  const [plphone, setplphone] = useState(false);
  const [pladdr, setpladdr] = useState(false);
  const [ischeckadd, setischeckadd] = useState({
    loading: false,
    availabledi: true,
  });
  const MAPBOX_TOKEN =
    'pk.eyJ1IjoidHJ1bmdwaGFuOTkiLCJhIjoiY2txZmI3cDl5MG42ODJvc2N1emRqcndqYyJ9.-QdtnY-bLP8PSXMwwXuQEA';
  const toggleOverlay = () => {
    setVisible(!visible);
    setischeckadd({...ischeckadd, availabledi: true});
  };
  const toggleplOverlay = () => {
    setplphone(!visible);
  };
  const togglepladdrOverlay = () => {
    setpladdr(!visible);
  };

  const getlocatefa = (addressi) => {
    setischeckadd({...ischeckadd, loading: true});
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/"${addressi}".json?access_token=${MAPBOX_TOKEN}`,
    )
      .then((response) => response.json())
      .then(function (responseJson) {
        setinputadd(addRess);

        console.log('>>responseloca', responseJson.features[0].center);
        let addrcus = {
          latitude: responseJson.features[0].center[1],
          longitude: responseJson.features[0].center[0],
        };
        checkdistance(addrcus, branchLocate);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const checkdistance = (addone, addtwo) => {
    fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${addone.longitude},${addone.latitude};${addtwo.longitude},${addtwo.latitude}.json?access_token=${MAPBOX_TOKEN}`,
      {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      },
    )
      .then((response) => response.json())
      .then((responseloca) => {
        const distance = responseloca.routes[0].distance / 1000;
        console.log('distance', distance);
        setischeckadd({...ischeckadd, loading: false});
        if (distance <= 10) {
          setischeckadd({...ischeckadd, availabledi: true});
          setVisible(false);
        } else {
          setischeckadd({...ischeckadd, availabledi: false});
          setinputadd('');
          setaddRess('Nhập địa chỉ nhận hàng');
        }
        // setVisible(false);
        // distance > 10 ? openNotificationWithIcon("error") : setpaymodal(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const getuserinfo = async () => {
    if (inputadd === '') {
      togglepladdrOverlay();
    } else {
      const apiURL = `${Backport}/users/myUser`;
      const userToken = await AsyncStorage.getItem('userToken');
      fetch(apiURL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          const dataorder = {
            customerName: responseJson.users.fName,
            customerPhone: responseJson.users?.phone,
            customerAddress: inputadd,
            totalPrices: price,
            couponCodeId: couponcodeID,
            userId: responseJson.users._id,
            branchId: props.branchID,
          };
          if (dataorder.customerPhone === undefined) {
            toggleplOverlay();
          } else {
            saveordata(dataorder);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const saveordata = (data) => {
    let customproli = [];
    props.cart.map((pc) => {
      const newprobj = {product_id: pc.id, quantity: pc.quantity};
      customproli.push(newprobj);
    });
    props.navigation.navigate('Paypal', {
      price: price,
      datap: {...data, productList: customproli},
    });
    // const apiURL = `${Backport}/orders/create/order`;
    // fetch(apiURL, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     ...data,
    //     productList: customproli,
    //   }),
    // });
    // console.log('>>customproli', customproli);
  };
  const getListCode = () => {
    const apiURL = `${Backport}/couponCode/discount/user`;

    setIsloading(true);
    fetch(apiURL)
      .then((res) => res.json())
      .then((resJson) => {
        console.log('>>Abcd');
        setCouponList(resJson.couponcode);
        console.log('>>resJson.couponcode', resJson.couponcode);
        setIsloading(false);
        return resJson.couponcode;
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };
  const [couponcodeID, setcouponcodeID] = useState('');
  const [branchLocate, setbranchLocate] = useState({
    latitude: 0,
    longitude: 0,
  });
  const addCode = (code) => {
    const percentage = code.percentage;
    setcouponcodeID(code._id);
    const disprice = fakeprice - fakeprice * (percentage / 100);
    setprice(disprice);
  };
  useEffect(() => {
    getListCode();
    setfakeprice(props.totalprice);
    setprice(props.totalprice);
    const apiURL = `${Backport}/branches`;
    fetch(apiURL)
      .then((res) => res.json())
      .then((resJson) => {
        const brachcurren = resJson.branches.filter(
          (bc) => bc._id === props.branchID,
        );
        console.log('>>brachcurren[0].location', brachcurren[0].location);
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/"${brachcurren[0].location}".json?access_token=${MAPBOX_TOKEN}`,
        )
          .then((response) => response.json())
          .then(function (responseJson) {
            console.log('>>brach locate', responseJson.features[0].center);
            setbranchLocate({
              latitude: responseJson.features[0].center[1],
              longitude: responseJson.features[0].center[0],
            });
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  }, []);
  return (
    <SafeAreaView
      style={{
        // backgroundColor: 'white',
        height: '100%',
        backgroundColor: '#f7f9fa',
      }}>
      <ScrollView>
        <View style={{width: '100%', paddingLeft: 15, paddingRight: 15}}>
          {/* <View style={{height: 80}}>
            <View style={{height: 20, width: '100%', paddingTop: 20}}>
              <View>
                <FontAwesome5
                  style={{color: 'white', fontSize: 25, color: 'grey'}}
                  name={'arrow-left'}
                  solid
                />
              </View>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 22,
                    fontWeight: 'bold',
                    color: 'grey',
                  }}>
                  {'Thanh toán'}
                </Text>
              </View>
            </View>
          </View> */}

          <View
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
              height: 160,
              borderRadius: 0.5,
              marginTop: 20,
              paddingRight: 10,

              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,

              elevation: 3,
            }}>
            <View
              style={{
                width: '100%',
                height: 70,
                paddingTop: 20,
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  style={{fontSize: 18, fontStyle: 'italic', color: 'grey'}}>
                  {`Loại sản phẩm: ${props.cart.length}`}
                </Text>
              </View>
              {/* <View>
                <FontAwesome5
                  style={{color: '#ffb460', fontSize: 20}}
                  name={'trash-alt'}
                  solid
                />
              </View> */}
            </View>
            <ScrollView
              style={{paddingLeft: 10, paddingRight: 10}}
              horizontal={true}>
              {props.cart.map((pro) => (
                <View
                  key={pro.id}
                  style={{
                    height: 70,
                    width: 250,
                    paddingRight: 20,
                    marginRight: 5,
                  }}>
                  <ProductCheckout
                    name={pro.name}
                    prices={pro.prices}
                    quantity={pro.quantity}
                    imagesProduct={pro.imagesProduct}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        <Card>
          <Card.Title
            style={{
              width: '100%',

              textAlign: 'left',
            }}>
            <View
              style={{
                width: 300,
                height: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 17, color: 'grey', fontStyle: 'italic'}}>
                {'Địa chỉ'}
              </Text>
              <TouchableOpacity onPress={toggleOverlay}>
                <Text style={{fontSize: 17, color: '#ffb460'}}>
                  {'Thay đổi'}
                </Text>
              </TouchableOpacity>
            </View>
          </Card.Title>
          <Card.Divider />
          <Text style={{color: 'grey', lineHeight: 20}}>{addRess}</Text>
        </Card>
        <Card>
          <Card.Title
            style={{
              width: '100%',

              textAlign: 'left',
            }}>
            <View
              style={{
                width: 300,
                height: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 17, color: 'grey', fontStyle: 'italic'}}>
                {'Mã giảm giá'}
              </Text>
            </View>
          </Card.Title>
          <Card.Divider />
          <ScrollView
            style={{backgroundColor: 'white', height: 75}}
            horizontal={true}>
            {Isloading === false ? (
              couponList.map((coupon) => (
                <View
                  key={coupon._id}
                  style={{
                    height: 70,
                    width: 270,

                    borderRadius: 5,

                    flexDirection: 'row',
                    marginRight: 15,
                  }}>
                  <View
                    style={{
                      width: '75%',
                      backgroundColor: '#e79b4e',
                      borderBottomRightRadius: 10,
                      borderTopRightRadius: 10,
                      paddingLeft: 10,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,

                      elevation: 5,
                    }}>
                    <View
                      style={{
                        width: '100%',
                        backgroundColor: 'white',
                        height: 70,

                        borderBottomRightRadius: 10,
                        borderTopRightRadius: 10,
                      }}>
                      <View style={{paddingLeft: 10, paddingTop: 5}}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: 'grey',
                            textTransform: 'uppercase',
                          }}>
                          {coupon.content}
                        </Text>
                        <Text style={{fontWeight: 'bold', paddingTop: 3}}>
                          {`Giảm ${coupon.percentage}% cho đơn`}
                        </Text>
                        <Text
                          style={{fontSize: 12, color: 'grey', paddingTop: 5}}>
                          {`HSD: ${formatDate(coupon.endTime)}`}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      height: 70,
                      width: '25%',
                      backgroundColor: 'white',
                      borderBottomRightRadius: 5,
                      borderTopRightRadius: 5,
                      borderBottomLeftRadius: 10,
                      borderTopLeftRadius: 10,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,

                      elevation: 5,

                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <TouchableOpacity onPress={() => addCode(coupon)}>
                      <View>
                        <Text style={{color: '#ffb460', fontWeight: 'bold'}}>
                          {'Chọn'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Image
                source={require('../../img/id-loading-5.gif')}
                style={{width: 300, height: 80}}
              />
            )}
          </ScrollView>
        </Card>
        <Card style={{borderRadius: 20}}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{fontSize: 17, fontWeight: 'bold'}}>{'Tổng'}</Text>
            </View>
            <View>
              <Text style={{fontSize: 17}}>{`${formatCurrency(price)}đ`}</Text>
            </View>
          </View>
        </Card>

        <View style={{padding: 15}}>
          <Button
            onPress={() => {
              getuserinfo();
            }}
            style={{fontSize: 20}}
            color="#ffb460"
            title="Thanh Toán"
          />
        </View>

        <View style={{height: 5}}></View>
      </ScrollView>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text style={{fontSize: 17, color: 'grey', fontStyle: 'italic'}}>
          {'Thay đổi địa chỉ'}
        </Text>
        <View style={{paddingTop: 10, width: 300, height: 160}}>
          <Input
            onChangeText={(value) => setaddRess(value)}
            placeholder="Nhập địa chỉ"
          />
          {!ischeckadd.availabledi && (
            <Text
              style={{
                textAlign: 'center',
                marginBottom: 10,
                fontStyle: 'italic',
                opacity: 0.5,
              }}>
              {'Địa chỉ quá xa chi nhánh đã chọn'}
            </Text>
          )}

          {/* <Button
            onPress={() => getlocatefa(addRess)}
            color="#ffb460"
            title="OK"
          /> */}
          {ischeckadd.loading ? (
            <View
              style={{
                width: '100%',
                height: 20,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '75%',
                  height: 45,
                  backgroundColor: '#ffb460',
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
                height: 20,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              onPress={() => getlocatefa(addRess)}>
              <View
                style={{
                  width: '75%',
                  height: 45,
                  backgroundColor: '#ffb460',
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
                  {'OK'}
                </Text>
                {/* <ActivityIndicator size="large" color="#ffff" /> */}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Overlay>
      <Overlay isVisible={plphone} onBackdropPress={toggleplOverlay}>
        <View
          style={{
            width: 200,
            height: 100,
            justifyContent: 'center',
          }}>
          <View style={{width: '100%', paddingBottom: 20}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
                color: '#ffae5d',
              }}>
              {'Cập nhật số điện thoại để đặt hàng'}
            </Text>
          </View>

          <Button
            color="#ffae5d"
            title="OK"
            onPress={() => setplphone(false)}
          />
        </View>
      </Overlay>
      <Overlay isVisible={pladdr} onBackdropPress={togglepladdrOverlay}>
        <View
          style={{
            width: 200,
            height: 100,
            justifyContent: 'center',
          }}>
          <View style={{width: '100%', paddingBottom: 20}}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 15,
                textAlign: 'center',
                color: '#ffae5d',
              }}>
              {'Vui lòng nhập địa chỉ nhận hàng'}
            </Text>
          </View>

          <Button color="#ffae5d" title="OK" onPress={() => setpladdr(false)} />
        </View>
      </Overlay>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return {
    cart: state.cart.cartAr,
    totalprice: state.cart.totalprice,
    branchID: state.branch.branchID,
  };
};

export default connect(mapStateToProps, {})(Checkout);
