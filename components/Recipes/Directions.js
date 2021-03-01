import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

export default class Directions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedDirections: [],
    };
  }

  componentDidMount() {

  }

  directionChecked = (index) => {
    const { checkedDirections } = this.state;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    checkedDirections.push(index);
    this.setState({ checkedDirections: checkedDirections });
  }

  directionUnchecked = (index) => {
    const { checkedDirections } = this.state;
    checkedDirections.splice(checkedDirections.indexOf(index), 1);
    this.setState({ checkedDirections: checkedDirections });
  }

  render() {
    const { directions } = this.props;
    let directionsToReturn = [];
    directions.forEach((direction, index) => {
      let checked = this.state.checkedDirections.includes(index);
      directionsToReturn.push(
        <View key={index} style={{ backgroundColor: !checked ? '#e6e6e6' : '#f0f0f0', borderRadius: 10, marginVertical: 6, marginHorizontal: 10 }}>
          <View style={{ marginVertical: 8, marginLeft: 6, flexDirection: 'row' }}>
            <Text key={index} style={{ fontSize: 16, paddingRight: 35, color: !checked ? '#000' : '#737373' }}>
              {`${index + 1}. ${direction.title}`}
            </Text>
            <View style={{ position: 'absolute', right: 0, marginRight: 10, alignSelf: 'center' }}>
              {!checked ?
                (<Pressable onPress={() => this.directionChecked(index)} hitSlop={10}>
                  <Icon name='circle-thin' type='font-awesome' size={20} color='#6b6b6b' onPress={() => { this.directionChecked(index) }} />
                </Pressable>) :
                (<Pressable onPress={() => this.directionUnchecked(index)} hitSlop={10}>
                  <Icon name='check' type='ant-design' size={20} color='#42c930' onPress={() => { this.directionUnchecked(index) }} />
                </Pressable>)}
            </View>
          </View>
        </View>);
    });
    return directionsToReturn;
  }
}