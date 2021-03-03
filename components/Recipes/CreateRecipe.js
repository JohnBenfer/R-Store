import React from 'react';
import PropTypes from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Image, ImageBackground, LayoutAnimation, TextInput, KeyboardAvoidingView } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import { Pressable } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { RecipesPath } from '../../Constants';
import { ScrollView } from 'react-native';
import EditDirections from './EditDirections';
import EditImages from './EditImages';
import EditIngredients from './EditIngredients';

const propTypes = {
  addRecipe: PropTypes.func,
  cancelPress: PropTypes.func,
}
export default class CreateRecipeModal extends React.Component {
  ingredientRef = React.createRef();
  photoListRef = React.createRef();
  descriptionRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      title: '',
      description: '',
      ingredients: [{ title: '' }, { title: '' }],
      directions: [{ title: '', groupId: 0 }, { title: '', groupId: 0 }],
      titleError: false,
      descriptionError: false,
    };
  }

  async componentDidMount() {

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
      id: this.props.route.params.generateId(),
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

    this.props.route.params.addRecipe(newRecipe);
    this.props.navigation.goBack();
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

  cancelPress = () => {
    this.props.navigation.goBack();
  }

  render() {
    const { images, title, ingredients, directions, description, titleError, descriptionError } = this.state;
    return (
      <SafeAreaView>
        <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />
        <View style={{ backgroundColor: '#fff' }}>
          <View style={[styles.row, { marginBottom: 15, marginTop: 10 }]}>
            <View style={styles.cancelButtonContainer}>
              <Button
                onPress={this.cancelPress}
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
          <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={46} style={{}}>
            <ScrollView bounces={true}>
              <Text style={{ marginTop: 5, marginBottom: 5, paddingHorizontal: 15, fontSize: 18, alignSelf: 'center', fontWeight: 'bold' }}>
                Recipe Name
          </Text>
              <View style={{ marginHorizontal: 15 }}>
                <TextInput
                  style={[styles.textInput, { width: '100%', fontSize: 16 }]}
                  autoFocus={true}
                  onChangeText={(text) => this.changeTitle(text)}
                  value={this.state.title}
                  onSubmitEditing={() => this.descriptionRef.current.focus()}
                  returnKeyType="next"
                />
                {titleError ?
                  <Text style={{ color: 'red' }}>
                    Title is too long
              </Text> : null}
              </View>
              <Text style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 15, fontSize: 16 }}>
                Description
          </Text>
              <View style={{ marginHorizontal: 15 }}>
                <TextInput
                  style={[styles.textInput, { width: '100%', fontSize: 14 }]}
                  onChangeText={(text) => this.setState({ description: text })}
                  ref={this.descriptionRef}
                  multiline={true}
                />
              </View>
              <Text style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 15, fontSize: 16 }}>
                Ingredients
          </Text>
              <EditIngredients ingredients={ingredients} changeIngredients={(ingredients) => this.setState({ ingredients: ingredients })} />


              <Text style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 15, fontSize: 16 }}>
                Directions
          </Text>
              <EditDirections directions={directions} changeDirections={(directions) => this.setState({ directions: directions })} />
              <EditImages images={this.state.images} changeImages={(images) => this.setState({ images: images })} />
              <View style={{ height: 100 }}>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  photoList: {
    height: 200,
    marginVertical: 10,
    paddingVertical: 10,
    marginLeft: 10,
    width: Dimensions.get("window").width * 0.85 - 10,
    borderWidth: 0,
    backgroundColor: '#dbdbdb',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'center'
  },
  photoRow: {
    marginTop: 10,
    marginLeft: 5,
    paddingHorizontal: 0,

  },
  textInput: {
    backgroundColor: '#dbdbdb',
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 7
  }
});
