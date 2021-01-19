import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Animated } from 'react-native';
import { Input, Button, Overlay, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';

let yPosition = 0;
let currentIndex = 0;
const OPEN_HEIGHT = 350;
const CLOSED_HEIGHT = 100;

export default class Recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: this.loadMockRecipes(),
    };
  }

  async componentDidMount() {
    // prevents going back to signup page
    this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      // console.warn(e);
    });
  }

  loadMockRecipes() {
    return (
      [
        { id: 1, title: 'meatballs', description: 'a ball of meat' },
        { id: 2, title: 'pie', description: 'a circle of yum' },
        { id: 3, title: 'pizza', description: 'a circle of bread and meat' },
        { id: 4, title: 'meat load', description: 'a loaf of meat' },
        { id: 5, title: 'mashed potatoes', description: 'a mashed of potatoes' },
        { id: 6, title: 'meatballs', description: 'a ball of meat' },
        { id: 7, title: 'pie', description: 'a circle of yum' },
        { id: 8, title: 'pizza', description: 'a circle of bread and meat' },
        { id: 9, title: 'meat load', description: 'a loaf of meat' },
        { id: 10, title: 'mashed potatoes', description: 'a mashed of potatoes' },
      ]
    );
  }

  _renderItem = ({ item, index }) => {
    console.log('index: ', index);
    if (index === currentIndex) {
      return (
        <View style={styles.recipe}>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <Text style={styles.recipeDescription}>{item.description}</Text>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <Text style={styles.recipeDescription}>{item.description}</Text>
          <Text style={styles.recipeTitle}>{item.title}</Text>
          <Text style={styles.recipeDescription}>{item.description}</Text>
        </View>
      );
    }
    return (
      <View style={styles.recipe}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDescription}>{item.description}</Text>
      </View>
    );
  }

  handleScroll = (event) => {
    // console.log(event.nativeEvent.contentOffset.y);
    yPosition = event.nativeEvent.contentOffset.y;
    currentIndex = Math.ceil(yPosition/(250+(5*2)));
    console.log(currentIndex);
  }

  recipeList = () => {

  }

  render() {

    return (
      <SafeAreaView>
        <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />
        <View style={styles.container}>
          <View style={styles.carousel}>
            <ScrollView 
              snapToAlignment={"start"}
              snapToInterval={250+(5*2)}
              decelerationRate={"fast"}
              onScroll={this.handleScroll}
              scrollEventThrottle={100}
            >
              <FlatList
                data={this.state.recipes}
                renderItem={this._renderItem}
                keyExtractor={(recipe) => recipe.id.toString()}
              />
            </ScrollView>
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
    marginBottom: 0
  },
  carousel: {
    marginTop: 10,
  },
  recipe: {
    padding: 5,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    height: 250,
    marginVertical: 5,
    // flex: 1,
  },
  focusedRecipe: {
    height: 400,
  },
  unfocusedRecipe: {
    marginVertical: -50,
  },
  recipeTitle: {
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  slideStyle: {
    // flex: 1,
    marginVertical: 0,
  }
});
