import React from 'react';
import PropTypes from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Image, ImageBackground, LayoutAnimation, TextInput } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import { Pressable } from 'react-native';

export default class EditIngredients extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  addIngredient = (groupId) => {
    const { ingredients } = this.props;
    ingredients.push({ title: '', groupId: groupId });
    this.props.changeIngredients(ingredients);
  }

  removeIngredient = (index) => {
    const { ingredients } = this.props;
    ingredients.splice(index, 1);
    this.props.changeIngredients(ingredients);
  }

  handleIngredientChange = (text, index) => {
    let { ingredients } = this.props;
    ingredients[index].title = text;
    this.props.changeIngredients(ingredients);
  }

  render() {
    const { ingredients } = this.props;
    return (
      <View>
        {
          ingredients.map((ingredient, index) => (
            <View key={index} style={[styles.row, { marginHorizontal: 15 }]}>
              <TextInput
                style={[styles.textInput, { width: '90%', fontSize: 14, marginBottom: 7 }]}
                onChangeText={(text) => this.handleIngredientChange(text, index)}
                value={ingredient.title}
                key={index}
                textContentType="oneTimeCode"
                importantForAutofill="no"
              />
              {index > 0 || ingredients.length > 1 ? (
                <View style={{ marginTop: 6, marginLeft: 8 }}>
                  <Pressable onPress={() => this.removeIngredient(index)} hitSlop={10}>
                    <Icon name='md-close' type='ionicon' size={15} color='#000' />
                  </Pressable>
                </View>
              ) : null}
            </View>
          ))
        }
        <Pressable onPress={() => this.addIngredient(0)} hitSlop={5} style={{ alignSelf: 'center' }}>
          <Icon
            reverse
            size={15}
            name="md-add"
            type="ionicon"
            color='#2e7dd1'
            onPress={() => this.addIngredient(0)}
          />
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: '#dbdbdb',
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 7
  }
});