import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform } from 'react-native';
import { Input, Button, Overlay, Text } from 'react-native-elements';

export default class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: props.route.params.recipe,
    };
  }

  /**
   * Receives the current user as this.props.route.params.user
   */
  async componentDidMount() {
    console.log(this.state.recipe.title);
  }


  render() {
    const {recipe} = this.state;
    return (
      <SafeAreaView>
        <View>
          <Text style={styles.title}>
            {recipe.title}
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
  },
  title: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
  }
});
