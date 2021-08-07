import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {Backport} from '../../config/port';
import {delallProduct} from '../../components/productTag/actions/index';
import {connect} from 'react-redux';
const Paypal = (props) => {
  let myWebView;
  const [ordata, setordata] = useState({});
  useEffect(() => {
    // setordata(props.route.params);
    console.log('>>props.route.params', props.route.params.price);
    const fixpriceus = props.route.params.price * 0.000043;
    setordata(fixpriceus.toFixed(2));
  }, []);
  const onMessage = (data) => {
    //Prints out data that was passed.
    console.log(data);
    console.log('>>datap', props.route.params.datap);
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(props.route.params.datap),
    };
    fetch(`${Backport}/orders/create/order`, requestOptions)
      .then((response) => response.json())
      .then((datare) => {
        console.log('>>data', datare);
        props.delallProduct();
        props.navigation.navigate('SuccessPage');
      });
  };
  return (
    <WebView
      ref={(el) => (myWebView = el)}
      onLoadEnd={() => myWebView.postMessage(ordata)}
      source={{uri: 'https://tcspaypal.herokuapp.com/'}}
      javaScriptEnabled={true}
      onMessage={onMessage}
    />
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
    delallProduct: () => dispatch(delallProduct()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Paypal);
