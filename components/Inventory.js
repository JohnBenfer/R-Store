import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform } from 'react-native';
import { Input, Button, Overlay, Text } from 'react-native-elements';

export default class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
    };
  }

  /**
   * Receives the current user as this.props.route.params.user
   */
  async componentDidMount() {
    // prevents going back to signup page
    this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      // console.warn(e);
    });
  }


  render() {

    return (
      <SafeAreaView>
        <View>
          <Text>
            Hello Inventory
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
    backgroundColor: '#f2f2f2',
    marginBottom: 10
  }
});
