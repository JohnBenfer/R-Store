import React from 'react';
import PropTypes from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Image, ImageBackground, LayoutAnimation, TextInput, KeyboardAvoidingView } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import EditIngredients from './EditIngredients';
import EditDirections from './EditDirections';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import { Pressable } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { RecipesPath } from '../../Constants';
import { ScrollView } from 'react-native';

export default class EditRecipeModal extends React.Component {
  ingredientRef = React.createRef();
  photoListRef = React.createRef();

  constructor(props) {
    super(props);
    const ingredients = JSON.parse(JSON.stringify(props.recipe.ingredients));
    const directions = JSON.parse(JSON.stringify(props.recipe.directions));
    const images = JSON.parse(JSON.stringify(props.recipe.images));
    this.state = {
      images: images,
      title: props.recipe.title,
      description: props.recipe.description,
      ingredients: ingredients,
      directions: directions,
      titleError: false,
      descriptionError: false,
      titleChanged: false,
      descriptionChanged: false,
      ingredientsChanged: false,
      directionsChanged: false,
      imagesChanged: false,
    };
  }

  async componentDidMount() {

  }

  addImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      let images = this.state.images;
      images.push(result.uri);
      LayoutAnimation.easeInEaseOut();
      this.setState({ images: images, imagesChanged: true });
      setTimeout(() => this.photoListRef.current.scrollToIndex({ index: images.length - 1 }), 10);

    }
  }

  takeImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      let images = this.state.images;
      images.push(result.uri);
      LayoutAnimation.easeInEaseOut();
      this.setState({ images: images, imagesChanged: true });
      setTimeout(() => this.photoListRef.current.scrollToIndex({ index: images.length - 1 }), 1);
    }
  }

  saveRecipe = async () => {
    const { title, description, ingredients, directions, images } = this.state;
    const newRecipe = {
      id: this.props.recipe.id,
      title: title,
      description: description,
      ingredients: ingredients,
      directions: directions,
      images: images,
    }
    this.props.saveEditRecipe(newRecipe);
  }

  changeTitle = (text) => {
    if (text.length < 40) {
      this.setState({ titleError: false, title: text, titleChanged: true });
    } else {
      this.setState({ titleError: true, title: text, titleChanged: true });
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
    directions.forEach(item => {
      if (item.title.trim().length > 0) {
        blank = false;
      }
    });
    return blank;
  }

  render() {
    const { images, title, ingredients, directions, description, descriptionError, titleError, ingredientsChanged, directionsChanged, imagesChanged } = this.state;
    // console.log("boolean values:");
    // console.log(title !== this.props.recipe.title);
    // console.log(description !== this.props.recipe.description);
    // console.log(ingredientsChanged);
    // console.log(directionsChanged);
    // console.log(imagesChanged);
    return (
      <SafeAreaView>
        <View style={{ backgroundColor: '#fff' }}>
          <View style={[styles.row, { marginBottom: 15, marginTop: 10 }]}>
            <View style={styles.cancelButtonContainer}>
              <Button
                onPress={() => this.props.cancelEditPress()}
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
                disabled={
                  (titleError || descriptionError) ||
                  (title.length === 0 || this.allIngredientsBlank(ingredients) || this.allDirectionsBlank(directions)) ||
                  (title === this.props.recipe.title &&
                    description === this.props.recipe.description &&
                    !ingredientsChanged &&
                    !directionsChanged &&
                    !imagesChanged)
                }
              />
            </View>
          </View>
          <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={105} style={{}}>
            <ScrollView>
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
              </Text> : null}
              </View>
              <Text style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 15, fontSize: 16 }}>
                Description
          </Text>
              <View style={{ marginHorizontal: 15 }}>
                <TextInput
                  style={[styles.textInput, { width: '100%', fontSize: 14 }]}
                  onChangeText={(text) => this.setState({ description: text })}
                  value={description}
                />
              </View>
              <Text style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 15, fontSize: 16 }}>
                Ingredients
          </Text>
              <EditIngredients ingredients={ingredients} changeIngredients={(ingredients) => this.setState({ ingredients: ingredients, ingredientsChanged: true })} />
              <Text style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 15, fontSize: 16 }}>
                Directions
          </Text>
              <EditDirections directions={directions} changeDirections={(directions) => this.setState({ directions: directions, directionsChanged: true })} />

              <View style={[styles.row, styles.photoRow]}>
                <View style={{ marginTop: 0, width: '15%', justifyContent: 'center' }}>
                  <View style={{ margin: 0 }}>
                    <Pressable onPress={this.takeImage}>
                      <Icon type="ionicon" name="camera" size={25} color="#808080" reverse onPress={this.takeImage} />
                    </Pressable>
                  </View>
                  <View style={{ margin: 0 }}>
                    <Pressable onPress={this.addImage}>
                      <Icon type="MaterialIcons" name="insert-photo" size={25} color="#808080" reverse onPress={this.addImage} />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.photoList}>
                  {images?.length > 0 ? <FlatList
                    data={images}
                    horizontal
                    renderItem={(image, index) => {
                      return (
                        <View style={{ overflow: 'visible', paddingVertical: 5 }}>
                          <ImageBackground source={{ uri: image.item }} style={{ width: 190, height: 190, marginHorizontal: 5, overflow: 'visible' }}>
                            <Pressable style={{ width: 25, height: 25, position: 'absolute', top: -5, right: -5 }}>
                              <Button
                                onPress={() => {
                                  let newImages = images;
                                  newImages.splice(images.indexOf(image.item), 1)
                                  LayoutAnimation.easeInEaseOut();
                                  this.setState({ images: newImages, imagesChanged: true });
                                }}
                                title='x'
                                containerStyle={{ borderRadius: 20 }} titleStyle={{ fontSize: 14 }}
                                buttonStyle={{ backgroundColor: 'red', overflow: 'visible', marginTop: -7 }} />
                            </Pressable>
                          </ImageBackground>
                        </View>
                      );
                    }}
                    keyExtractor={(image, index) => index.toString()}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    snapToAlignment={"center"}
                    snapToInterval={200}
                    decelerationRate={0.993}
                    showsHorizontalScrollIndicator={false}
                    ref={this.photoListRef}
                  /> :
                    <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                      <Icon style={{}} type="MaterialIcons" name="insert-photo" size={165} color="#bfbfbf" onPress={this.addImage} />
                    </View>}
                </View>
              </View>
              <View style={{ height: 200 }}>

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
