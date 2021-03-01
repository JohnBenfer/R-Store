import React from 'react';
import PropTypes from 'react';
import { StyleSheet, View, SafeAreaView, LayoutAnimation, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, Text } from 'react-native-elements';
import EditIngredients from './EditIngredients';
import EditDirections from './EditDirections';
import EditImages from './EditImages';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { RecipesPath } from '../../Constants';
import { ScrollView } from 'react-native';

const propTypes = {
  addRecipe: PropTypes.func,
  cancelPress: PropTypes.func,
}
export default class CreateRecipeModal extends React.Component {
  ingredientRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      title: '',
      description: '',
      ingredients: [{ title: '', groupId: 0 }, { title: '', groupId: 0 }],
      ingredientGroups: [{ id: 0, title: '' }],
      directions: [{ title: '', groupId: 0 }, { title: '', groupId: 0 }],
      directionGroups: [{ id: 0, title: '' }],
      titleError: false,
      descriptionError: false,
    };
  }

  saveRecipe = async () => {
    const { title, description, ingredients, directions, images, titleError, descriptionError } = this.state;
    const finalIngredients = ingredients.filter((ingredient) => ingredient.title.trim().length !== 0);
    const finalDirections = directions.filter((direction) => direction.title.trim().length !== 0);

    if (titleError || descriptionError) {
      return;
    }
    let recipes;
    await FileSystem.readAsStringAsync(RecipesPath).then((res) => {
      recipes = JSON.parse(res);
    }).catch(() => {
      console.log('error reading recipes file');
    });
    const newRecipe = {
      id: this.props.generateId(),
      title: title.trim(),
      description: description.trim(),
      ingredients: finalIngredients,
      directions: finalDirections,
      images: images,
    }
    const newRecipes = {
      recipes: [
        ...recipes.recipes,
        newRecipe
      ]
    };
    await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify(newRecipes));
    FileSystem.readAsStringAsync(RecipesPath).then((res) => {
    });
    this.props.addRecipe(newRecipe);
  }

  changeDirections = (directions) => {
    this.setState({ directions: directions });
  }

  changeIngredients = (ingredients) => {
    this.setState({ ingredients: ingredients });
  }

  changeTitle = (text) => {
    if (text.length < 40) {
      this.setState({ titleError: false, title: text });
    } else {
      this.setState({ titleError: true, title: text });
    }
  }

  allIngredientsBlank = (items) => {
    let blank = true;
    items.forEach(item => {
      if (item.title.trim().length > 0) {
        blank = false;
      }
    });
    return blank;
  }

  allDirectionsBlank = (directions) => {
    let blank = true;
    directions.forEach(direction => {
      if (direction.title.trim().length > 0) {
        blank = false;
      }
    });
    return blank;
  }

  render() {
    const { title, ingredients, directions, titleError, descriptionError } = this.state;
    return (
      <SafeAreaView>
        <View style={{ backgroundColor: '#fff', paddingBottom: 0 }}>
          <View style={[styles.row, { marginBottom: 15, marginTop: 10 }]}>
            <View style={styles.cancelButtonContainer}>
              <Button
                onPress={() => this.props.cancelPress()}
                title="Cancel"
                type="clear"
                titleStyle={styles.cancelButtonTitle}
                buttonStyle={{ backgroundColor: 'transparent' }}
              />
            </View>
            <View style={styles.saveButtonContainer}>
              <Button
                onPress={this.saveRecipe}
                title="Save"
                containerStyle={styles.saveButtonBorder}
                titleStyle={styles.saveButtonTitle}
                disabled={(titleError || descriptionError) || (title.length === 0 || this.allIngredientsBlank(ingredients) || this.allDirectionsBlank(directions))}
              />
            </View>
          </View>
          <View>
            <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={163} style={{}}>
              <ScrollView bounces={true}>
                <View>
                  <Text style={{ marginTop: 5, marginBottom: 5, paddingHorizontal: 15, fontSize: 18, alignSelf: 'center', fontWeight: 'bold' }}>
                    Recipe Name
                </Text>
                  <View style={{ marginHorizontal: 15 }}>
                    <TextInput
                      style={[styles.textInput, { width: '100%', fontSize: 16 }]}
                      autoFocus={true}
                      onChangeText={(text) => this.changeTitle(text)}
                      value={this.state.title}
                    />
                    {titleError ?
                      <Text style={{ color: 'red' }}>
                        Title is too long
                </Text> :
                      null}
                  </View>
                  <Text style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 15, fontSize: 16 }}>
                    Description
                </Text>
                  <View style={{ marginHorizontal: 15 }}>
                    <TextInput
                      style={[styles.textInput, { width: '100%', fontSize: 14 }]}
                      onChangeText={(text) => this.setState({ description: text })}
                    />
                  </View>
                  <Text style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 15, fontSize: 16 }}>
                    Ingredients
                </Text>
                  <EditIngredients ingredients={ingredients} changeIngredients={this.changeIngredients} />
                  <Text style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 15, fontSize: 16 }}>
                    Directions
                </Text>
                  <EditDirections directions={directions} changeDirections={this.changeDirections} />
                  <EditImages images={this.state.images} changeImages={(images) => this.setState({ images: images })} />
                  <View style={{ height: 200, paddingBottom: 0 }}></View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
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
  cancelButtonContainer: {
    width: '20%',
  },
  cancelButtonTitle: {
    fontSize: 14,
    marginVertical: -2,
  },
  saveButtonContainer: {
    width: '20%',
    position: 'absolute',
    right: 8,
  },
  saveButtonBorder: {
    borderRadius: 20,
  },
  saveButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: -2,
  },
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
