import React, { createRef } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Animated, TextInput, TouchableHighlight, LayoutAnimation } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import { ScrollView, } from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import RecipeCard from './RecipeCard';
import * as FileSystem from 'expo-file-system';
import {RecipesPath} from '../Constants';

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
  searchRef = createRef();
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      selectedRecipe: {},
      selectedIndex: 1,
      showSearch: false,
      searchText: '',
      displayRecipes: []
    };

  }

  async componentDidMount() {
    
    this.getRecipes();
    // prevents going back to signup page
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableHighlight style={{ borderWidth: 2, borderColor: '#636363', borderRadius: 6, marginHorizontal: 7, }}>
          <Icon
            style={{ alignSelf: 'center' }}
            name="md-add"
            type="ionicon"
            color='#919191'
            size={20}
            onPress={this.createRecipe}
          />
        </TouchableHighlight>
      ),
    });
    this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      // console.warn(e);
    });
  }

  getRecipes = () => {
    FileSystem.readAsStringAsync(RecipesPath).then((res) => {
      let r = JSON.parse(res).recipes.reverse();
      this.setState({ recipes: r, displayRecipes: r });
    })
  }

  loadMockRecipes() {
    return (
      [
        {
          id: 1,
          title: 'meatballs',
          description: 'a ball of meat',
          ingredients: [{ quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' }, { quantity: '1 c.', title: 'ground beef' }, { quantity: '1/3 c.', title: 'bread crumbs' },],
          directions: ['Add the meat', 'add the bread crumbs', 'add seasoning', 'mix togehter', 'form balls', 'bake 30 minutes at 350'],
        },
        { id: 2, title: 'pie', description: 'a circle of yum' },
        { id: 3, title: 'pizza', description: 'a circle of bread and meat' },
        { id: 4, title: 'meat load', description: 'a loaf of meat' },
        { id: 5, title: 'mashed potatoes', description: 'a mashed of potatoes' },
        { id: 6, title: 'meatballs', description: 'a ball of meat' },
        { id: 7, title: 'pie', description: 'a circle of yum' },
        { id: 8, title: 'pizza', description: 'a circle of bread and meat' },
        { id: 9, title: 'meat load', description: 'a loaf of meat' },
        { id: 10, title: 'mashed potatoes', description: 'a mashed of potatoes' },
        { id: 11, title: 'roasted chicken', description: 'a whole bird' },
        { id: 12, title: 'cbr pizza', description: 'a pizza with cbr', ingredients: [{ quantity: '1 c.', title: 'chicken' }, { quantity: '1/2 c.', title: 'bacon' }] },
        { id: 13, title: 'enchilada', description: 'tortilla with chicken and cheese' },
        // { id: 14, title: 'meat load', description: 'a loaf of meat' },
        // { id: 15, title: 'mashed potatoes', description: 'a mashed of potatoes' },
        // { id: 16, title: 'meatballs', description: 'a ball of meat' },
        // { id: 17, title: 'pie', description: 'a circle of yum' },
        // { id: 18, title: 'pizza', description: 'a circle of bread and meat' },
        // { id: 19, title: 'meat load', description: 'a loaf of meat' },
        // { id: 20, title: 'mashed potatoes', description: 'a mashed of potatoes' },
        // { id: 21, title: 'meatballs', description: 'a ball of meat' },
        // { id: 22, title: 'pie', description: 'a circle of yum' },
        // { id: 23, title: 'pizza', description: 'a circle of bread and meat' },
        // { id: 24, title: 'meat load', description: 'a loaf of meat' },
        // { id: 25, title: 'mashed potatoes', description: 'a mashed of potatoes' },
        // { id: 26, title: 'meatballs', description: 'a ball of meat' },
        // { id: 27, title: 'pie', description: 'a circle of yum' },
        // { id: 28, title: 'pizza', description: 'a circle of bread and meat' },
        // { id: 29, title: 'meat load', description: 'a loaf of meat' },
        // { id: 31, title: 'meatballs', description: 'a ball of meat' },
        // { id: 32, title: 'pie', description: 'a circle of yum' },
        // { id: 33, title: 'pizza', description: 'a circle of bread and meat' },
        // { id: 34, title: 'meat load', description: 'a loaf of meat' },
        // { id: 35, title: 'mashed potatoes', description: 'a mashed of potatoes' },
        // { id: 36, title: 'meatballs', description: 'a ball of meat' },
        // { id: 37, title: 'pie', description: 'a circle of yum' },
        // { id: 38, title: 'pizza', description: 'a circle of bread and meat' },
        // { id: 39, title: 'meat load', description: 'a loaf of meat' },
      ]
    );
  }

  addRecipe = (recipe) => {
    let {recipes, displayRecipes} = this.state;
    recipes.unshift(recipe);
    // displayRecipes.push(recipe);
    this.setState({ recipes: recipes });
  }

  createRecipe = () => {

    this.props.navigation.push("CreateRecipe", {addRecipe: this.addRecipe});
  }

  searchPress = () => {
    this.setState({ showSearch: true });
    setTimeout(() => {
      this.searchRef.current.focus();
    }, 150);
  }

  recipeSearch = (searchText) => {
    this.setState({ searchText: searchText });
    if (!searchText || searchText.length < 2) {
      if (this.state.displayRecipes && this.state.displayRecipes.length > 0) {
        this.flatListRef.current.scrollToIndex({ index: 0 });
      }
      LayoutAnimation.easeInEaseOut();
      this.setState({ displayRecipes: this.state.recipes });
      return;
    }
    let text = searchText.toLowerCase().trim();
    let newRecipes = [];
    let newRecipes1 = [];
    let newRecipes2 = [];
    let newRecipes3 = [];
    let match = false;
    this.state.recipes.forEach((recipe) => {
      match = false;
      if (recipe.title.toLowerCase().startsWith(text)) {
        newRecipes.push(recipe);
        match = true;
      } else if (recipe.title.toLowerCase().includes(text)) {
        newRecipes1.push(recipe);
        match = true;
      } else {
        recipe.ingredients?.some((i) => {
          if (i.title.toLowerCase().includes(text)) {
            newRecipes2.push(recipe);
            match = true;
            return true;
          }
        });
        if (!match && recipe.description.toLowerCase().includes(text)) {
          newRecipes3.push(recipe);
        }
      }
    });
    newRecipes = newRecipes.concat(newRecipes1, newRecipes2, newRecipes3);
    LayoutAnimation.easeInEaseOut();
    this.setState({ displayRecipes: newRecipes });
  }

  handleRecipePress = (recipe, index) => {
    this.state.selectedRecipe !== recipe ? this.setState({ selectedRecipe: recipe }) : null;
    this.flatListRef.current.scrollToIndex({
      index: index
    });
    if (index + 1 === this.state.selectedIndex) {
      this.props.navigation.push("Recipe", { recipe: recipe });
    }
  }


  render() {
    let selectedIndex = 1;
    const { showSearch, recipes, displayRecipes } = this.state;

    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: this.y } } }], {
      useNativeDriver: true,
      listener: (e) => {
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
          {showSearch ? <View style={[styles.searchBar, styles.row]}>
            <TextInput
              style={{ width: '83%', backgroundColor: '#ebebeb', borderRadius: 5, padding: 3, paddingLeft: 7 }}
              autoFocus={false}
              ref={this.searchRef}
              onSubmitEditing={() => {
                this.searchRef.current.blur();
                !this.state.searchText || this.state.searchText.length < 1 ? this.setState({ showSearch: false }) : null;
              }
              }
              placeholder='Search...'
              onChangeText={this.recipeSearch}
            />
            <View style={{ position: 'absolute', right: 8, marginTop: 3}}>
              <Button
                title='cancel'
                onPress={() => {
                  if (this.state.searchText && this.state.searchText.length > 0) {
                    this.flatListRef.current.scrollToIndex({index: 0});
                  }
                  this.searchRef.current.blur();
                  this.setState({ showSearch: false, displayRecipes: this.state.recipes, searchText: '' });
                }}
                type="clear"
                titleStyle={styles.cancelButtonTitle}
                buttonStyle={{ backgroundColor: 'transparent' }}
              />
            </View>
          </View> : null}
          <AnimatedFlatList
            data={displayRecipes}
            renderItem={({ index, item }) => (
              <RecipeCard index={index} y={this.y} recipe={item} selectedIndex={this.state.selectedIndex} selected={item.id === this.state.selectedRecipe?.id} handleRecipePress={this.handleRecipePress} />
            )}
            bounces={true}
            keyExtractor={(item, index) => index.toString()}
            scrollEventThrottle={16}
            {...{ onScroll }}
            snapToAlignment={"start"}
            snapToInterval={CARD_HEIGHT}
            decelerationRate={0.993}
            ref={this.flatListRef}
          />
        </View>
        <View style={styles.button}>
          <Icon
            reverse
            name="md-search"
            type="ionicon"
            color={'#bdbdbd'}
            onPress={this.searchPress}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    marginBottom: 0,
    height: '100%',
  },
  button: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 0,
    paddingRight: 5,
    marginBottom: 5,
  },
  overlayStyle: {
    width: '90%',
    borderRadius: 4,
    borderColor: 'black',
    borderWidth: 2,
    position: 'absolute',
    top: 0,
    marginTop: 200,
  },
  searchBar: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  cancelButtonTitle: {
    fontSize: 14,
    marginVertical: 0,
  },
});
