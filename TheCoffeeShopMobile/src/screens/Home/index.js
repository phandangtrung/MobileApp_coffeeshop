import 'react-native-gesture-handler';
import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  DrawerLayoutAndroid,
  ScrollView,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {SearchBar, SpeedDial} from 'react-native-elements';
import DropShadow from 'react-native-drop-shadow';
import LinearGradient from 'react-native-linear-gradient';
import {Picker} from '@react-native-picker/picker';
import styles from './style';
import {chooseBranch} from './actions/index';
import ProductTag from '../../components/productTag/index';
import {
  decreaseProduct,
  deleteProduct,
  increaseProduct,
  delallProduct,
} from '../../components/productTag/actions/index';
import ProductCart from '../../components/productCart/index';
import Loading from '../../components/loading/Loading';

import connect1 from '../../api/connect1.tsx';
import {connect} from 'react-redux';
import {serport, Backport} from '../../config/port';

const Home = (props) => {
  const [search, setsearch] = useState('');

  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [probyCate, setProByCate] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [brachpick, setbrachpick] = useState();
  useEffect(() => {
    fetchBranchList();
  }, []);
  const formatCurrency = (monney) => {
    const mn = String(monney);
    return mn
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + '.') + prev;
      });
  };
  const getListCategory = (productList) => {
    const apiURL = `${Backport}/categories`;
    setIsloading(true);
    fetch(apiURL)
      .then((res) => res.json())
      .then((resJson) => {
        setCategories(resJson.categories);
        return resJson.categories;
      })
      .then((_categories) => {
        getListProduct(_categories, productList);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };
  const [BraProList, setBraProList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [fakeproductList, setfakeProductList] = useState([]);
  const [dfSelect, setDfSelect] = useState('');

  const fetchBranchList = async () => {
    const apiproURL = `${Backport}/products`;
    const apibrURL = `${Backport}/branches`;
    let Brresponse;
    let Prresponse;
    fetch(apiproURL)
      .then((res) => res.json())
      .then((resJson) => {
        Prresponse = resJson.productList;
        fetch(apibrURL)
          .then((res) => res.json())
          .then((resJson) => {
            Brresponse = resJson.branches;
            let newBraL = [];
            Brresponse.map((bl) => {
              let newproLi = {...bl, listProduct: []};
              bl.listProduct.map((brpro) => {
                const found = Prresponse.find(
                  (element) => element._id === brpro._id,
                );
                newproLi.listProduct.push({...brpro, ...found});
              });
              newBraL.push(newproLi);
            });
            setBraProList(newBraL);
            setProductList(newBraL[0].listProduct);
            setDfSelect(String(newBraL[0].name));
            props.chooseBranch(newBraL[0]._id);
            console.log('>>newBraL', newBraL);
            getListCategory(newBraL[0].listProduct);
          });
      });
  };
  const getListProduct = (_categories, productList) => {
    // const apiURL = `${serport}/products`;
    // fetch(apiURL)
    //   .then((res) => res.json())
    //   .then((resJson) => {
    let productsByCat = {};
    productList.map((_product) => {
      let title = '';
      _categories.forEach((cate) => {
        // console.log(
        //   '>>cate._id',
        //   cate._id,
        //   '_product.categoryId',
        //   _product.categoryId,
        // );
        if (cate._id === _product.categoryId) {
          title = cate.name;
          // console.log('>>title', title);
        }
      });

      productsByCat = {
        ...productsByCat,
        [_product.categoryId]:
          _product.categoryId in productsByCat
            ? [
                ...productsByCat[_product.categoryId],
                {..._product, catName: title},
              ]
            : [{..._product, catName: title}],
      };
    });
    setProduct(productList);
    setProByCate(productsByCat);
    setIsloading(false);
    // })
    // .catch((error) => {
    //   console.log('Error: ', error);
    // });
  };

  const renderProduct = (proByCate) => {
    let viewArr = [];
    for (const id in proByCate) {
      viewArr.push(
        <View key={id}>
          <Text
            style={{
              zIndex: 999,
              color: 'white',
              fontFamily: 'Oswald-VariableFont_wght',
              fontSize: 25,
              paddingLeft: 20,
              paddingBottom: 10,
              textShadowRadius: 20,
            }}>
            {proByCate[id][0].catName}
          </Text>
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
              paddingRight: 20,
            }}
            style={{zIndex: 2}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            {proByCate[id].map((products) => (
              <ProductTag
                onclickProduct={() => onclickProduct(products)}
                color="red"
                key={products._id}
                id={products._id}
                name={products.name}
                description={products.description}
                prices={products.prices}
                imagesProduct={products.imagesProduct}
              />
            ))}
          </ScrollView>
        </View>,
      );
    }
    return viewArr;
  };

  const renderItem = ({item, index}) => {
    return (
      <View>
        <Text style={{color: 'black'}}>{item.name}</Text>
      </View>
    );
  };
  const drawer = useRef(null);
  const onclickProduct = (prod) => {
    props.navigation.navigate('Product', prod);
  };
  const navigationView = () => (
    <View style={{backgroundColor: 'white', paddingTop: 10}}>
      {props.cart.length === 0 ? (
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingTop: 50,
            }}>
            <Image
              source={require('../../img/emptycart.419d0783.png')}
              style={{width: 200, height: 200}}
            />
          </View>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 20,
              color: 'black',
              paddingBottom: 10,
            }}>
            {'Giỏ hàng trống'}
          </Text>

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 16,
                color: 'grey',
                width: '80%',
                paddingBottom: 30,
              }}>
              {'Bạn chưa thêm bất cứ sản phẩm nào vào giỏ hàng của mình'}
            </Text>
          </View>
        </View>
      ) : (
        <View>
          <ScrollView style={{height: '80%'}}>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: 'grey',
                }}>
                {'TÓM TẮT ĐƠN HÀNG'}
              </Text>
              {props.cart.map((product) => (
                <ProductCart
                  key={product.id}
                  name={product.name}
                  prices={product.prices}
                  quantity={product.quantity}
                  ondeleteProduct={() => props.deleteProduct(product)}
                  onincreaseProduct={() => props.increaseProduct(product)}
                  ondecreaseProduct={() => props.decreaseProduct(product)}
                />
              ))}
            </View>
          </ScrollView>
          <View
            style={{
              width: '100%',
              height: '20%',
              padding: 10,

              borderTopWidth: 0.3,
              borderColor: 'grey',
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                paddingBottom: 20,
              }}>
              <Text style={{fontSize: 18}}>{'Tổng cộng'}</Text>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {`${formatCurrency(props.totalprice)}đ`}
              </Text>
            </View>
            <View>
              <Button
                onPress={() => props.navigation.navigate('Checkout')}
                style={{fontSize: 20}}
                color="#ffb460"
                title="Đặt đơn"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition="right"
      renderNavigationView={navigationView}>
      <SafeAreaView style={{backgroundColor: '#ffd494', flex: 1}}>
        {isloading === true ? (
          <Loading />
        ) : (
          <ScrollView>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#8e9174', '#465a50']}
              style={{
                borderBottomRightRadius: 30,
                borderBottomLeftRadius: 30,
                flexDirection: 'column',
                height: 250,
                zIndex: 1,
                marginBottom: 0,
              }}>
              <View>
                <View style={styles.banner}>
                  <Text style={styles.title}>Coffee Time</Text>
                  <Text style={styles.ads_content}>
                    {
                      ' A good day starts with a good coffee. How do you want to start your day'
                    }
                  </Text>
                </View>
                <View>
                  <DropShadow
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      shadowOpacity: 0.8,
                      shadowRadius: 5,
                    }}>
                    <Image
                      source={{
                        uri:
                          'https://product.hstatic.net/1000392212/product/oq-web-pc-lycafe-01_6aadedde0e28446b9e6f1bbfe3988f9a_master.png',
                      }}
                      style={{
                        width: 170,
                        height: 170,

                        resizeMode: 'contain',
                        marginLeft: 210,
                        marginTop: -90,
                      }}
                    />
                  </DropShadow>
                </View>
                <View
                  style={{
                    paddingLeft: 20,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white', fontSize: 15}}>
                    {'Chi Nhánh'}
                  </Text>
                  <Picker
                    selectedValue={brachpick}
                    style={{height: 50, width: 270, color: 'white'}}
                    onValueChange={(itemValue, itemIndex) => {
                      const brfilt = BraProList.filter(
                        (br) => br._id === itemValue,
                      );
                      setProductList(brfilt);
                      props.chooseBranch(brfilt[0]._id);
                      console.log('>>brfilt', brfilt[0].listProduct);
                      getListCategory(brfilt[0].listProduct);
                      props.delallProduct();
                      setbrachpick(itemValue);
                    }}>
                    {BraProList.map((bl) => (
                      <Picker.Item
                        label={bl.location}
                        value={bl._id}
                        key={bl._id}
                      />
                    ))}
                    {/* <Picker.Item label="Nam" value="java" />
                    <Picker.Item label="Nữ" value="js" />
                    <Picker.Item label="Khác" value="js" /> */}
                  </Picker>
                </View>
              </View>
            </LinearGradient>

            {renderProduct(probyCate)}
          </ScrollView>
        )}

        {/* <FlatList
          data={product}
          renderItem={renderItem}
          keyExtractor={(item) => `key-${item._id}`}
        /> */}

        <TouchableOpacity onPress={() => drawer.current.openDrawer()}>
          <View
            style={{
              backgroundColor: '#ffb460',
              width: '100%',
              height: 40,
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: 20,
              paddingRight: 20,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
              }}>
              {'Xem giỏ hàng'}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 17,
              }}>
              {`${formatCurrency(props.totalprice)}đ`}
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </DrawerLayoutAndroid>
  );
};
const mapStateToProps = (state) => {
  return {
    cart: state.cart.cartAr,
    totalprice: state.cart.totalprice,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    deleteProduct: (product_current) =>
      dispatch(deleteProduct(product_current)),
    increaseProduct: (product_current) =>
      dispatch(increaseProduct(product_current)),
    decreaseProduct: (product_current) =>
      dispatch(decreaseProduct(product_current)),
    delallProduct: () => dispatch(delallProduct()),
    chooseBranch: (branch_current) => dispatch(chooseBranch(branch_current)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
