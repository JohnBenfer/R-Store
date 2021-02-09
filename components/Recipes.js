import React, { createRef } from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, FlatList, StatusBar, Platform, Animated, TextInput, TouchableHighlight, LayoutAnimation, Pressable } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import RecipeCard from './RecipeCard';
import CreateRecipeModal from './CreateRecipeModal';
import EditRecipeModal from './EditRecipeModal';
import Recipe from './Recipe';
import * as FileSystem from 'expo-file-system';
import { RecipesPath } from '../Constants';
import BottomSheet from 'reanimated-bottom-sheet';
import Constants from 'expo-constants';
import { DEFAULT_CARD_HEIGHT, CARD_HEIGHT, MARGIN } from '../Constants';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const BOTTOM_TABS = 90;
let oldY = 0;
const recipeHeight = Dimensions.get("window").height - Constants.statusBarHeight - 130;

export default class Recipes extends React.Component {
  y = new Animated.Value(0);
  flatListRef = createRef();
  searchRef = createRef();
  sheetRef = createRef();
  createRecipeRef = createRef();
  editRecipeRef = createRef();

  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      selectedRecipe: {},
      selectedIndex: 1,
      showSearch: false,
      searchText: '',
      displayRecipes: [],
      showFullRecipe: false,
      showCreateRecipe: false,
      showEditRecipe: false,
      favoriteRecipes: [],
    };

  }

  async componentDidMount() {

    this.getRecipes();
    // prevents going back to signup page
    this.props.navigation.setOptions({
      headerRight: () => (
        <Pressable style={{ borderWidth: 2, borderColor: '#636363', borderRadius: 6, marginHorizontal: 7, }} onPress={this.createRecipeModal} hitSlop={10}>
          <Icon
            style={{ alignSelf: 'center' }}
            name="md-add"
            type="ionicon"
            color='#919191'
            size={20}
            onPress={this.createRecipeModal}
          />
        </Pressable>
      ),
    });
    this.props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      // console.warn(e);
    });
  }

  getRecipes = () => {
    let favoriteRecipes = [];
    FileSystem.readAsStringAsync(RecipesPath).then((res) => {
      let r = JSON.parse(res).recipes.reverse();
      r.forEach((recipe) => {
        recipe.favorite ? favoriteRecipes.push(recipe) : null;
      });
      this.setState({ recipes: r, displayRecipes: this.sortRecipes(r, favoriteRecipes), favoriteRecipes: favoriteRecipes });
      // this.assignIds(r);
    });
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

  assignIds = async (recipes) => {
    let newRecipes = this.state.recipes;
    recipes.forEach((r) => {
      if (!r.id) {
        newRecipes[recipes.indexOf(r)].id = this.generateId(recipes);
      }
    });
    console.log(newRecipes);
    await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify({ recipes: newRecipes }));
  }

  generateId = (recipes) => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    const id = '_' + Math.random().toString(36).substr(2, 9);
    this.state.recipes.forEach(r => {
      r.id === id ? this.generateId() : null;
    });
    return id;
  }

  addRecipe = (recipe) => {
    let { recipes, displayRecipes } = this.state;
    recipes.unshift(recipe);
    // displayRecipes.push(recipe);
    setTimeout(() => this.flatListRef.current.scrollToIndex({ index: 0 }), 150);
    this.setState({ recipes: recipes });
  }

  addRecipeModal = (recipe) => {
    let { recipes, displayRecipes } = this.state;
    recipes.unshift(recipe);
    // displayRecipes.push(recipe);
    setTimeout(() => this.flatListRef.current.scrollToIndex({ index: 0 }), 150);
    this.setState({ recipes: recipes, displayRecipes: this.sortRecipes(recipes, this.state.favoriteRecipes) });
    this.createRecipeRef.current.snapTo(1);
  }

  sortRecipes = (recipes, favoriteRecipes) => {
    let unPinnedRecipes = [];
    recipes.forEach((r) => {
      if (!favoriteRecipes.includes(r)) {
        unPinnedRecipes.push(r);
      }
    });
    return favoriteRecipes.concat(unPinnedRecipes);
  }

  createRecipe = () => {
    this.props.navigation.push("CreateRecipe", { addRecipe: this.addRecipe });
  }

  createRecipeModal = () => {
    setTimeout(() => this.createRecipeRef.current.snapTo(0), 50);
    this.setState({ showCreateRecipe: true });
  }

  cancelPress = () => {
    this.createRecipeRef.current.snapTo(1);
  }

  searchPress = () => {
    this.setState({ showSearch: true });
    setTimeout(() => {
      this.searchRef.current.focus();
    }, 150);
  }

  editRecipe = () => {
    setTimeout(() => this.editRecipeRef.current.snapTo(0), 50);
    this.setState({ showEditRecipe: true });
  }

  saveEditRecipe = async (newRecipe) => {
    setTimeout(() => this.editRecipeRef.current.snapTo(1), 50);

    let {displayRecipes, favoriteRecipes} = this.state;
    let recipes;
    await FileSystem.readAsStringAsync(RecipesPath).then((res) => {
      recipes = JSON.parse(res).recipes;
    }).catch(() => {
      console.log('error reading recipes file');
    });
    let oldRecipeIndex = recipes.indexOf(recipes.find((r) => r.id === newRecipe.id));
    recipes[oldRecipeIndex] = newRecipe;
    // recipes[oldRecipeIndex].title = newRecipe.title;
    // recipes[oldRecipeIndex].description = newRecipe.description;
    // recipes[oldRecipeIndex].ingredients = newRecipe.ingredients;
    // recipes[oldRecipeIndex].directions = newRecipe.directions;
    // recipes[oldRecipeIndex].images = newRecipe.images;

    let oldDisplayRecipeIndex = displayRecipes.indexOf(displayRecipes.find((r) => r.id === newRecipe.id));
    // displayRecipes[oldDisplayRecipeIndex] = newRecipe;
    displayRecipes[oldDisplayRecipeIndex].title = newRecipe.title;
    displayRecipes[oldDisplayRecipeIndex].description = newRecipe.description;
    displayRecipes[oldDisplayRecipeIndex].ingredients = newRecipe.ingredients;
    displayRecipes[oldDisplayRecipeIndex].directions = newRecipe.directions;
    displayRecipes[oldDisplayRecipeIndex].images = newRecipe.images;

    displayRecipes = this.sortRecipes(displayRecipes, favoriteRecipes);
    // this.setState({ recipes: recipes, displayRecipes: displayRecipes});
    const newRecipes = {
      recipes: recipes
    };
    await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify(newRecipes));
  }

  cancelEditPress = () => {
    setTimeout(() => this.editRecipeRef.current.snapTo(1), 50);
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
      index: index,
      viewPosition: 0.5
    });
    // if (index + 1 === this.state.selectedIndex || index + 1 === this.state.displayRecipes.length) {
    // this.props.navigation.push("Recipe", { recipe: recipe });
    setTimeout(() => this.sheetRef.current.snapTo(0), 10);
    this.setState({ showFullRecipe: true });

    // }
  }

  handleRecipeLongPress = (recipe, index) => {
    console.log('long press!');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  deleteRecipe = (recipe) => {

  }

  handleRecipeFavoritePress = async (recipe, index) => {
    let { favoriteRecipes, displayRecipes } = this.state;
    let recipes;
    let newRecipe = recipe;
    await FileSystem.readAsStringAsync(RecipesPath).then((res) => {
      recipes = JSON.parse(res).recipes;
    }).catch(() => {
      console.log('error reading recipes file');
    });
    if (this.state.favoriteRecipes.includes(recipe)) {
      // unfavorite
      favoriteRecipes.splice(favoriteRecipes.indexOf(recipe), 1);
      recipes.find((r) => r.id === recipe.id).favorite = false;
      displayRecipes.find((r) => r.id === recipe.id).favorite = false;
    } else {
      // favorite
      favoriteRecipes.push(recipe);
      recipes.find((r) => r.id === recipe.id).favorite = true;
      displayRecipes.find((r) => r.id === recipe.id).favorite = true;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.linear();
    displayRecipes = this.sortRecipes(displayRecipes, favoriteRecipes);
    this.flatListRef.current.scrollToIndex({
      index: displayRecipes.indexOf(displayRecipes.find((r) => r.id === recipe.id)),
      viewPosition: 0.5
    });
    this.setState({ recipes: recipes, displayRecipes: displayRecipes, favoriteRecipes: favoriteRecipes });
    const newRecipes = {
      recipes: recipes
    };
    await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify(newRecipes));
  }

  renderContent = () => {
    const r = this.state.selectedRecipe;
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: recipeHeight,
        }}
      >
        <Recipe recipe={r} height={recipeHeight} editRecipe={this.editRecipe} />
      </View>);
  }

  renderCreateRecipe = () => {
    return <CreateRecipeModal addRecipe={this.addRecipeModal} cancelPress={this.cancelPress} generateId={this.generateId} />
  }

  renderEditRecipe = () => {
    return <EditRecipeModal saveEditRecipe={this.saveEditRecipe} cancelEditPress={this.cancelEditPress} recipe={this.state.selectedRecipe}/>
  }

  render() {
    let selectedIndex = 1;
    const { showSearch, recipes, displayRecipes, showFullRecipe } = this.state;

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
        {this.state.disabled ?
          <Pressable
            style={styles.disabledView}
            onPress={() => {
              this.sheetRef?.current?.snapTo(1);
              this.createRecipeRef?.current?.snapTo(1);
              this.setState({ disabled: false });
            }}
          /> : null}
        {this.state.showFullRecipe ?
          <BottomSheet
            ref={this.sheetRef}
            snapPoints={[recipeHeight - 0, 0]}
            borderRadius={20}
            renderContent={this.renderContent}
            initialSnap={1}
            enabledBottomInitialAnimation={true}
            onCloseStart={() => this.setState({ disabled: !this.state.showEditRecipe ? false : true })}
            onCloseEnd={() => this.setState({ showFullRecipe: !this.state.showEditRecipe ? false : true })}
            onOpenStart={() => this.setState({ disabled: true })}
            onOpenEnd={() => this.setState({ disabled: true })}
            renderHeader={() => (<View style={{ height: 40, alignItems: 'flex-end', justifyContent: 'flex-end' }}><View style={{ width: 80, justifyContent: 'flex-end', alignSelf: 'center', height: 6, borderRadius: 10, backgroundColor: '#000', marginBottom: 5 }}></View></View>)}
          /> : null}
        {this.state.showCreateRecipe ?
          <BottomSheet
            ref={this.createRecipeRef}
            snapPoints={[recipeHeight, 0]}
            borderRadius={20}
            renderContent={this.renderCreateRecipe}
            initialSnap={1}
            enabledBottomInitialAnimation={true}
            onCloseStart={() => this.setState({ disabled: !this.state.showEditRecipe ? false : true })}
            onCloseEnd={() => this.setState({ showCreateRecipe: false, disabled: !this.state.showEditRecipe ? false : true })}
            onOpenStart={() => this.setState({ disabled: true })}
            onOpenEnd={() => this.setState({ disabled: true })}
            renderHeader={() => (<View style={{ width: 80, justifyContent: 'center', alignSelf: 'center', height: 6, borderRadius: 10, backgroundColor: '#000', marginBottom: 5 }}></View>)}
          /> : null}
        {this.state.showEditRecipe ?
          <BottomSheet
            ref={this.editRecipeRef}
            snapPoints={[recipeHeight, 0]}
            borderRadius={20}
            renderContent={this.renderEditRecipe}
            initialSnap={1}
            enabledBottomInitialAnimation={true}
            onCloseEnd={() => this.setState({ showEditRecipe: false })}
            onOpenStart={() => this.setState({ disabled: true })}
            onOpenEnd={() => this.setState({ disabled: true })}
            renderHeader={() => (<View style={{ width: 80, justifyContent: 'center', alignSelf: 'center', height: 6, borderRadius: 10, backgroundColor: '#000', marginBottom: 5 }}></View>)}
          /> : null}
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
            <View style={{ position: 'absolute', right: 8, marginTop: 3 }}>
              <Button
                title='cancel'
                onPress={() => {
                  if (this.state.searchText && this.state.searchText.length > 0) {
                    this.flatListRef.current.scrollToIndex({ index: 0 });
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
              <RecipeCard
                index={index}
                y={this.y}
                recipe={item}
                selectedIndex={this.state.selectedIndex}
                selected={item.id === this.state.selectedRecipe?.id}
                handleRecipePress={this.handleRecipePress}
                handleRecipeLongPress={this.handleRecipeLongPress}
                handleRecipeFavoritePress={this.handleRecipeFavoritePress}
                favorite={item.favorite}
              />
            )}
            bounces={true}
            keyExtractor={(item, index) => index.toString()}
            scrollEventThrottle={16}
            {...{ onScroll }}
            snapToAlignment={"center"}
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
  disabledView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 10,
  },
  container: {
    backgroundColor: '#f0f0f0',
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
