import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';

export default class Ingredients extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedIngredients: [],
    };
  }

  componentDidMount() {

  }

  ingredientChecked = (index) => {
    const { checkedIngredients } = this.state;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    checkedIngredients.push(index);
    this.setState({ checkedIngredients: checkedIngredients });
  }

  ingredientUnchecked = (index) => {
    const { checkedIngredients } = this.state;
    checkedIngredients.splice(checkedIngredients.indexOf(index), 1);
    this.setState({ checkedIngredients: checkedIngredients });
  }

  render() {
    const { ingredients } = this.props;
    let ingredientsToReturn = [];
    ingredients.forEach((ingredient, i) => {
      let checked = this.state.checkedIngredients.includes(i);
      ingredientsToReturn.push(
        <View key={i}>
          <View style={{ borderBottomWidth: 1, borderColor: '#cccccc', }} />
          <View style={{ flexDirection: 'row', marginVertical: 9, paddingHorizontal: 15, }}>
            <Text key={i} style={{ fontSize: 16, color: !checked ? '#000' : '#7d7d7d' }}>
              {ingredient.title}
            </Text>
            <View style={{ position: 'absolute', right: 0, marginRight: 10, alignSelf: 'center' }}>
              {!this.state.checkedIngredients.includes(i) ?
                (<Pressable onPress={() => this.ingredientChecked(i)} hitSlop={7}>
                  <Icon name='circle-thin' type='font-awesome' size={20} color='#6b6b6b' onPress={() => { this.ingredientChecked(i) }} />
                </Pressable>) :
                (<Pressable onPress={() => this.ingredientUnchecked(i)} hitSlop={7}>
                  <Icon name='check' type='ant-design' size={20} color='#42c930' onPress={() => { this.ingredientUnchecked(i) }} />
                </Pressable>)}
            </View>
          </View>
        </View>);
    });
    ingredientsToReturn.push(
      <View key={12345} style={{ borderBottomWidth: 1, borderColor: '#cccccc' }} />
    )
    return ingredientsToReturn;
  }
}