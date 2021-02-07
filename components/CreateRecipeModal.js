import React from 'react';
import PropTypes from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Image, ImageBackground, LayoutAnimation, TextInput } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import { Pressable } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { RecipesPath } from '../Constants';
import { ScrollView } from 'react-native';

const propTypes = {
  addRecipe: PropTypes.func,
  cancelPress: PropTypes.func,
}
export default class Inventory extends React.Component {
  ingredientRef = React.createRef();
  photoListRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      title: '',
      description: '',
      ingredients: [{ title: '' }, { title: '' }],
      directions: ['', ''],
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
      this.setState({ images: images });
      setTimeout(() => this.photoListRef.current.scrollToIndex({index: images.length-1}), 10);
      
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
      this.setState({ images: images });
      setTimeout(() => this.photoListRef.current.scrollToIndex({index: images.length-1}), 1);
    }
  }

  saveRecipe = async () => {
    const { title, description, ingredients, directions, images } = this.state;
    let recipes;
    await FileSystem.readAsStringAsync(RecipesPath).then((res) => {
      recipes = JSON.parse(res);
    }).catch(() => {
      console.log('error reading recipes file');
    });
    const newRecipe = {
      id: this.props.generateId(),
      title: title,
      description: description,
      ingredients: ingredients,
      directions: directions,
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

  addIngredient = () => {
    const { ingredients } = this.state;
    ingredients.push({ title: '' });
    this.setState({ ingredients });
  }

  removeIngredient = (index) => {
    const { ingredients } = this.state;
    ingredients.splice(index, 1);
    this.setState({ ingredients });
  }

  handleIngredientChange = (text, index) => {
    let { ingredients } = this.state;
    ingredients[index].title = text;
    this.setState({ ingredients });
  }

  addDirection = () => {
    const { directions } = this.state;
    directions.push('');
    this.setState({ directions });
  }

  removeDirection = (index) => {
    const { directions } = this.state;
    directions.splice(index, 1);
    this.setState({ directions });
  }

  handleDirectionChange = (text, index) => {
    let { directions } = this.state;
    directions[index] = text;
    this.setState({ directions });
  }

  render() {
    const { images, title, ingredients, directions, description } = this.state;
    return (
      <SafeAreaView>
        <View style={{backgroundColor: '#fff'}}>
          <View style={[styles.row, {marginBottom: 15, marginTop: 10}]}>
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
                disabled={false}
              />
            </View>
          </View>
          <ScrollView>
            <Text style={{ marginTop: 5, marginBottom: 5, paddingHorizontal: 15, fontSize: 18, alignSelf: 'center', fontWeight: 'bold' }}>
              Recipe Name
          </Text>
            <View style={{ marginHorizontal: 15 }}>
              <TextInput
                style={[styles.textInput, { width: '100%', fontSize: 16 }]}
                autoFocus={true}
                onChangeText={(text) => this.setState({ title: text })}
              />
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
            {ingredients.map((ingredient, index) => (
              <View key={index} style={[styles.row, { marginHorizontal: 15 }]}>
                <TextInput
                  style={[styles.textInput, { width: '90%', fontSize: 14, marginBottom: 7 }]}
                  onChangeText={(text) => this.handleIngredientChange(text, index)}
                  value={ingredient.title}
                  onSubmitEditing={() => {
                    // index+1 === ingredients.length && this.addIngredient();
                  }}
                  key={index}
                />
                {index > 0 || ingredients.length > 1 ? (
                  <View style={{ marginTop: 6, marginLeft: 8 }}>
                    <Pressable onPress={() => this.removeIngredient(index)} hitSlop={10}>
                      <Icon name='md-close' type='ionicon' size={15} color='#000' />
                    </Pressable>
                  </View>
                ) : null}
              </View>
            ))}
            <Pressable onPress={this.addIngredient} hitSlop={5} style={{ alignSelf: 'center' }}>
              <Icon
                reverse
                size={15}
                name="md-add"
                type="ionicon"
                color='#2e7dd1'
                onPress={this.addIngredient}
              />
            </Pressable>


            <Text style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 15, fontSize: 16 }}>
              Directions
          </Text>
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
                  value={direction}
                  onSubmitEditing={() => {
                    index + 1 === ingredients.length && this.addDirection();
                  }}
                  key={index}
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
            <Pressable onPress={this.addDirection} hitSlop={5} style={{ alignSelf: 'center' }}>
              <Icon
                reverse
                size={15}
                name="md-add"
                type="ionicon"
                color='#2e7dd1'
                onPress={this.addDirection}
              />
            </Pressable>

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
                {images.length > 0 ? <FlatList
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
                                this.setState({ images: newImages });
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
            <View style={{ height: 300 }}>

            </View>
          </ScrollView>
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