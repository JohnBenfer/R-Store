import React from 'react';
import PropTypes from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Image, ImageBackground, LayoutAnimation, TextInput } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { Pressable } from 'react-native';

export default class EditDirections extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  addDirection = (groupId) => {
    const { directions } = this.props;
    directions.push({ title: '', groupId: groupId });
    this.props.changeDirections(directions);
  }

  removeDirection = (index) => {
    const { directions } = this.props;
    directions.splice(index, 1);
    this.props.changeDirections(directions);
  }

  handleDirectionChange = (text, index) => {
    let { directions } = this.props;
    directions[index].title = text;
    this.props.changeDirections(directions);
  }

  render() {
    const { directions } = this.props;
    return (
      <View>
        {directions.map((direction, index) => (
          <View key={index} style={[styles.row, { marginHorizontal: 15 }]}>
            <View style={{ width: 20 }}>
              <Text style={{ marginTop: 5 }}>
                {`${index + 1}.`}
              </Text>
            </View>
            <TextInput
              style={{ width: Dimensions.get("window").width * 0.9 - 45, backgroundColor: '#dbdbdb', borderRadius: 5, padding: 5, paddingHorizontal: 7, fontSize: 14, marginBottom: 7 }}
              onChangeText={(text) => this.handleDirectionChange(text, index)}
              value={direction.title}
              onSubmitEditing={() => {
                // index + 1 === ingredients.length && this.addDirection();
              }}
              key={index}
              multiline={true}
            />
            {index > 0 || directions.length > 1 ? (
              <View style={{ marginTop: 6, marginLeft: 8 }}>
                <Pressable onPress={() => this.removeDirection(index)} hitSlop={10}>
                  <Icon name='md-close' type='ionicon' size={15} color='#000' />
                </Pressable>
              </View>
            ) : null}
          </View>
        ))}
        <Pressable onPress={() => this.addDirection(0)} hitSlop={5} style={{ alignSelf: 'center' }}>
          <Icon
            reverse
            size={15}
            name="md-add"
            type="ionicon"
            color='#2e7dd1'
            onPress={() => this.addDirection(0)}
          />
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row"
  },
  textInput: {
    backgroundColor: '#dbdbdb',
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 7
  }
});