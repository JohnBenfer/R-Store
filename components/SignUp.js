import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

let user;

class SignUp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
    this.props.navigation.navigate('Root', { });
  }


  render() {
    return (
      <SafeAreaView>
        <View>
          <Text>
            In SignUp
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    height: '100%',
  },
  button: {
    width: '100%',
    marginTop: 20,
    alignSelf: 'center',
  }
});

export default SignUp;