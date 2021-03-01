import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, ImageBackground, StatusBar, Platform, ScrollView, Dimensions, Pressable, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import { Input, Button, Overlay, Text, Icon, Tooltip } from 'react-native-elements';
import FiveCookbooks from '../../FiveCookbooks.json';
import CookbookCardSmall from './CookbookCardSmall';

export default class AddToCookbook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCookbookIds: [],
    }
  }

  handleCookbookPress = (id) => {
    let { selectedCookbookIds } = this.state;
    if (selectedCookbookIds.includes(id)) {
      selectedCookbookIds.splice(selectedCookbookIds.indexOf(id), 1);
    } else {
      selectedCookbookIds.push(id);
    }
    this.setState({ selectedCookbookIds: selectedCookbookIds });
  }

  renderCookbooks = () => {
    let cookbooks = FiveCookbooks.map((cookbook, index) => {
      const backgroundColor = this.state.selectedCookbookIds.includes(cookbook.id) ? '#d6ebff' : 'white';
      return (
        <View key={cookbook.id} style={{ borderTopWidth: 1, backgroundColor: backgroundColor }}>
          <Pressable onPress={() => this.handleCookbookPress(cookbook.id)}>
            <CookbookCardSmall cookbook={cookbook} />
          </Pressable>
        </View>
      );
    });
    cookbooks.push(<View style={{ borderTopWidth: 1 }} />);
    return cookbooks;
  }


  render() {

    return (
      <View style={{}}>
        <View style={[styles.row, { marginBottom: 15, marginTop: 8 }]}>
          <View style={styles.cancelButtonContainer}>
            <Button
              onPress={() => this.props.cancelAddToCookbook()}
              title="Cancel"
              type="clear"
              titleStyle={styles.cancelButtonTitle}
              buttonStyle={{ backgroundColor: 'transparent' }}
            />
          </View>
          <View style={styles.saveButtonContainer}>
            <Button
              onPress={this.props.addToCookbook}
              title="Add"
              containerStyle={styles.saveButtonBorder}
              titleStyle={styles.saveButtonTitle}
              disabled={this.state.selectedCookbookIds.length < 1}
            />
          </View>
        </View>
        <View style={{ height: '100%', backgroundColor: 'white' }}>
          <ScrollView bounces={true} style={{backgroundColor: 'white'}}>
            {this.renderCookbooks()}
          </ScrollView>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  cancelButtonContainer: {
    width: 100,
    alignItems: 'flex-start',
    marginLeft: 3,
  },
  row: {
    flexDirection: 'row',
  },
  cancelButtonTitle: {
    fontSize: 14,
    marginVertical: -2,
  },
  saveButtonContainer: {
    width: '20%',
    position: 'absolute',
    right: 5,
  },
  saveButtonBorder: {
    borderRadius: 20,
  },
  saveButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: -2,
  },
});