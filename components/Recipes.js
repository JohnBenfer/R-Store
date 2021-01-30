import React, { createRef } from 'react';
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
const DEFAULT_CARD_HEIGHT = 480;
const MARGIN = 12;
const BOTTOM_TABS = 90;
const CARD_HEIGHT = DEFAULT_CARD_HEIGHT + MARGIN * 2;
let oldY = 0;

export default class Recipes extends React.Component {
  y = new Animated.Value(0);
  flatListRef = createRef();
  constructor(props) {
    super(props);
    this.state = {
      recipes: this.loadMockRecipes(),
      selectedRecipe: {},
      selectedIndex: 1,
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
        { id: 11, title: 'meatballs', description: 'a ball of meat' },
        { id: 12, title: 'pie', description: 'a circle of yum' },
        { id: 13, title: 'pizza', description: 'a circle of bread and meat' },
        { id: 14, title: 'meat load', description: 'a loaf of meat' },
        { id: 15, title: 'mashed potatoes', description: 'a mashed of potatoes' },
        { id: 16, title: 'meatballs', description: 'a ball of meat' },
        { id: 17, title: 'pie', description: 'a circle of yum' },
        { id: 18, title: 'pizza', description: 'a circle of bread and meat' },
        { id: 19, title: 'meat load', description: 'a loaf of meat' },
        { id: 20, title: 'mashed potatoes', description: 'a mashed of potatoes' },
      ]
    );
  }

  handleRecipePress = (recipe, index) => {
    this.setState({ selectedRecipe: recipe });
    console.log(recipe);
    console.log(index);
    console.log(this.state.selectedIndex);
    this.flatListRef.current.scrollToIndex({
      index: index
    });
    if (index + 1 === this.state.selectedIndex) {
      console.log('entering recipe..');
    }
  }


  render() {
    let selectedIndex = 1;
    
    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: this.y } } }], {
      useNativeDriver: true,
      listener: (e) => {
        // console.log(e.nativeEvent.contentOffset.y);
        const oldIndex = this.state.selectedIndex;
        let currentY = e.nativeEvent.contentOffset.y;
        if (currentY > oldY) {
          // scrolling down
          selectedIndex = Math.ceil(currentY / CARD_HEIGHT) + 1;
          if (selectedIndex !== oldIndex) {
            this.setState({ selectedIndex: selectedIndex });
          }
        } else {
          // scrolling up
          selectedIndex = Math.floor(currentY / CARD_HEIGHT) + 1;
          if (selectedIndex !== oldIndex) {
            this.setState({ selectedIndex: selectedIndex });
          }
        }
        oldY = currentY;
      }
    });
    return (
      <SafeAreaView>
        <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />
        <View style={styles.container}>
          <AnimatedFlatList
            data={this.state.recipes}
            renderItem={({ index, item }) => (
              <RecipeCard index={index} y={this.y} recipe={item} selectedIndex={this.state.selectedIndex} selected={item.id === this.state.selectedRecipe?.id} handleRecipePress={this.handleRecipePress} />
            )}
            bounces={true}
            keyExtractor={(recipe) => recipe.id.toString()}
            scrollEventThrottle={16}
            {...{ onScroll }}
            snapToAlignment={"start"}
            snapToInterval={CARD_HEIGHT}
            decelerationRate={0.993}
            ref={this.flatListRef}
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
    marginBottom: 0,
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
