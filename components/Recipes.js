import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Animated, Dimensions } from 'react-native';
import { Input, Button, Overlay, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import RecipeCard from './RecipeCard';

let yPosition = 0;
let currentIndex = 0;
const OPEN_HEIGHT = 350;
const CLOSED_HEIGHT = 100;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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
        // { id: 6, title: 'meatballs', description: 'a ball of meat' },
        // { id: 7, title: 'pie', description: 'a circle of yum' },
        // { id: 8, title: 'pizza', description: 'a circle of bread and meat' },
        // { id: 9, title: 'meat load', description: 'a loaf of meat' },
        // { id: 10, title: 'mashed potatoes', description: 'a mashed of potatoes' },
      ]
    );
  }

  handleScroll = (event) => {
    // console.log(event.nativeEvent.contentOffset.y);
    yPosition = event.nativeEvent.contentOffset.y;
    currentIndex = Math.ceil(yPosition / (250 + (5 * 2)));
    console.log(currentIndex);
  }

  

  render() {
    const y = new Animated.Value(0);
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
      useNativeDriver: true,
    });
    return (
      <SafeAreaView>
        <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />
        <View style={styles.container}>
          <AnimatedFlatList
            data={this.state.recipes}
            renderItem={({ index, item }) => (
              <RecipeCard index={index} y={y} recipe={item} selected={false} />
            )}
            bounces={false}
            keyExtractor={(recipe) => recipe.id.toString()}
            scrollEventThrottle={16}
            {...{ onScroll }}
          />
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
