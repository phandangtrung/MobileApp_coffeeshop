import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  cart_tag: {
    height: 50,
    width: 300,
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    flexDirection: 'row',
    borderStyle: 'dashed',
    justifyContent: 'space-between',
    backgroundColor: '#ffb460',

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2.22,
    shadowOpacity: 0.22,
    shadowColor: '#000',

    elevation: 3,

    borderRadius: 13,
  },

  text_cart: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default styles;
