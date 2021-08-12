import React, { createRef } from 'react';
import { StyleSheet, View, SafeAreaView, Dimensions, FlatList, StatusBar, Platform, Animated, TextInput, TouchableHighlight, LayoutAnimation, Pressable, Alert } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import { connect } from 'react-redux';
import { changeRecipes } from '../../redux/actions/changeRecipes';
import { changeCookbooks } from '../../redux/actions/changeCookbooks';
import { changeUser } from '../../redux/actions/changeUser';
import { bindActionCreators } from 'redux';
import RecipeCard from './RecipeCard';
import * as FileSystem from 'expo-file-system';
import * as SplashScreen from 'expo-splash-screen';
import { RecipesPath, UserPath, CookbooksPath } from '../../Constants';
import Constants from 'expo-constants';
import { DEFAULT_CARD_HEIGHT, CARD_HEIGHT, MARGIN } from '../../Constants';
import FiveCookbooks from '../../FiveCookbooks.json';
import * as Util from '../../Util';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const BOTTOM_TABS = 90;
let oldY = 0;
const recipeHeight = Dimensions.get("window").height - Constants.statusBarHeight - 130;

class Recipes extends React.Component {
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
      titleOverflow: false,
      navigating: false,
      goingBack: false,
    };

  }

  async componentDidMount() {

    this.props.changeCookbooks(FiveCookbooks);
    setTimeout(() => SplashScreen.hideAsync(), 500);
    this.getRecipes();
    console.log(this.props.user);
    // this.getCookbooks();

    // prevents going back to signup page
    this.props.navigation.setOptions({
      headerRight: () => (
        <Pressable style={{ borderWidth: 0, borderColor: '#636363', marginHorizontal: 7, }} onPress={this.createRecipe} hitSlop={10}>
          <Icon
            style={{ alignSelf: 'center' }}
            name="md-add"
            type="ionicon"
            color='#000'
            size={35}
            onPress={this.createRecipe}
          />
        </Pressable>
      ),
      headerLeft: () => (
        <Pressable style={{ borderWidth: 0, borderColor: '#636363', marginHorizontal: 7, }} onPress={this.logoutPress} hitSlop={10}>
          <Icon
            style={{ alignSelf: 'center' }}
            name="md-add"
            type="ionicon"
            color='#000'
            size={35}
            onPress={this.logoutPress}
          />
        </Pressable>
      ),
    });
    this.props.navigation.addListener('beforeRemove', (e) => {
      if(this.state.goingBack) {
        return;
      }
      e.preventDefault();
      // console.warn(e);
    });
  }

  logoutPress = () => {
    Alert.alert("Are you sure you want to logout?", null, [
      {
        text: "Cancel",
        onPress: () => this.setState({ goingBack: false }),
        style: "cancel"
      },
      {
        text: "Logout",
        onPress: this.logout
      }
    ],
    {cancelable: false } );
  }

  logout = async () => {
    await FileSystem.writeAsStringAsync(CookbooksPath, JSON.stringify({ cookbooks: [] }));
    await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify({ recipes: [] }));
    await FileSystem.deleteAsync(UserPath);
    this.setState({ goingBack: true }, () => this.props.navigation.goBack());
  }

  getRecipes = async () => {
    let favoriteRecipes = [];
    this.props.recipes.recipes?.forEach((recipe) => {
      recipe.favorite ? favoriteRecipes.push(recipe) : null;
    });
    this.setState({ displayRecipes: this.sortRecipes(this.props.recipes.recipes, favoriteRecipes), favoriteRecipes: favoriteRecipes });
  }

  addRecipe = async (recipe) => {
    let { recipes } = this.props.recipes;
    let recipeId;
    await Util.AddRecipeToDB(recipe, this.props.user.user.id, this.getRecipeIds()).then( async (id) => {
      console.log("recipe id in addRecipe");
      console.log(id);
      recipeId = id;
      recipe.id = recipeId;
      recipes.unshift(recipe);
      console.log('new recipe: ');
      console.log(recipe);
      this.setState({ displayRecipes: this.sortRecipes(recipes, this.state.favoriteRecipes) });
      this.props.changeRecipes(recipes);
      let oldRecipes;
      await FileSystem.readAsStringAsync(RecipesPath).then((res) => {
        oldRecipes = JSON.parse(res);
      }).catch(() => {
        console.log('error reading recipes file');
      });
      const newRecipes = {
        recipes: [
          ...oldRecipes.recipes,
          recipe
        ]
      };
      await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify(newRecipes));
      setTimeout(() => this.flatListRef.current.scrollToIndex({ index: this.state.favoriteRecipes.length, viewPosition: 0.5 }), 500);
    });
    if (!recipeId) {
      console.log('error creating recipe');
      return;
    }

  }

  sortRecipes = (recipes, favoriteRecipes) => {
    if(!recipes || recipes.length < 1) {
      return [];
    }
    let unPinnedRecipes = [];
    recipes?.forEach((r) => {
      if (!favoriteRecipes.find((fR) => fR.id === r.id)) {
        unPinnedRecipes.push(r);
      }
    });
    if (recipes.length !== favoriteRecipes.length + unPinnedRecipes.length) {
      console.warn('Error! Mismatch recipes in sort.');
    }
    return favoriteRecipes.concat(unPinnedRecipes);
  }

  createRecipe = () => {
    if (!this.state.navigating) {
      this.props.navigation.push("CreateRecipe", { generateId: this.generateId, addRecipe: this.addRecipe, });
    }
    this.setState({ navigating: true });
    setTimeout(() => {
      this.setState({ navigating: false });
    }, 1500)
  }

  searchPress = () => {
    this.setState({ showSearch: true });
    setTimeout(() => {
      this.searchRef.current.focus();
    }, 150);
  }

  saveEditRecipe = async (newRecipe) => {

    let { displayRecipes, favoriteRecipes } = this.state;
    let recipes;
    await FileSystem.readAsStringAsync(RecipesPath).then((res) => {
      recipes = JSON.parse(res).recipes;
    }).catch(() => {
      console.log('error reading recipes file');
    });
    let oldRecipeIndex = recipes.indexOf(recipes.find((r) => r.id === newRecipe.id));
    const oldRecipe = recipes[oldRecipeIndex];
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
    this.setState({ displayRecipes: displayRecipes });
    this.props.changeRecipes(recipes);
    const newRecipes = {
      recipes: recipes
    };

    const imagesChanged = oldRecipe.images === newRecipe.images;
    const oldRecipeImageLength = oldRecipe.images ? oldRecipe.images.length : 0;
    Util.EditRecipeInDB(newRecipe, imagesChanged, oldRecipeImageLength);
    await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify(newRecipes));
    // close and open recipe card to rerender updates
  }

  recipeSearch = (searchText) => {
    this.setState({ searchText: searchText });
    if (!searchText || searchText.length < 2) {
      if (this.state.displayRecipes && this.state.displayRecipes.length > 0) {
        this.flatListRef.current.scrollToIndex({ index: 0 });
      }
      LayoutAnimation.easeInEaseOut();
      this.setState({ displayRecipes: this.sortRecipes(this.props.recipes.recipes, this.state.favoriteRecipes) });
      return;
    }
    let text = searchText.toLowerCase().trim();
    let newRecipes = [];
    let newRecipes1 = [];
    let newRecipes2 = [];
    let newRecipes3 = [];
    let match = false;
    this.props.recipes.recipes?.forEach((recipe) => {
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

  cancelSearchPress = () => {
    if (this.state.searchText && this.state.searchText.length > 0) {
      setTimeout(() => this.flatListRef?.current?.scrollToIndex({ index: 0 }), 15);
    }
    this.searchRef.current.blur();
    const sortedRecipes = this.sortRecipes(this.props.recipes.recipes, this.state.favoriteRecipes);
    this.setState({ showSearch: false, displayRecipes: sortedRecipes, searchText: '' });
  }

  handleRecipePress = (recipe, index) => {
    this.state.selectedRecipe !== recipe ? this.setState({ selectedRecipe: recipe }) : null;
    this.flatListRef.current.scrollToIndex({
      index: index,
      viewPosition: 0.5
    });
    // if (index + 1 === this.state.selectedIndex || index + 1 === this.state.displayRecipes.length) {
    this.props.navigation.push("Recipe", { recipe: recipe, editRecipe: this.editRecipe, deleteRecipe: this.deleteRecipe, saveEditRecipe: this.saveEditRecipe });
    // setTimeout(() => this.sheetRef.current.snapTo(0), 50);
    this.setState({ showFullRecipe: true });

    // }
  }

  handleRecipeLongPress = (recipe, index) => {
    console.log('long press!');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  deleteRecipe = async (recipe) => {
    let { displayRecipes, favoriteRecipes } = this.state;
    let { recipes } = this.props.recipes;
    console.log('recipe delete');
    console.log(recipe.title);

    let oldRecipes;
    await FileSystem.readAsStringAsync(RecipesPath).then((res) => {
      oldRecipes = JSON.parse(res).recipes;
    }).catch(() => {
      console.log('error reading recipes file');
    });

    // close Recipe 
    // remove from file
    oldRecipes.splice(oldRecipes.indexOf(oldRecipes.find((r) => r.id === recipe.id)), 1);
    const newRecipes = {
      recipes: oldRecipes
    };
    let imageCount = 0;
    if(recipe.images?.length) {
      imageCount = recipe.images.length;
    }
    await Util.RemoveRecipeFromDB(recipe.id, this.props.user.user.id, this.getRecipeIds(), imageCount);
    await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify(newRecipes));
    // remove from displayRecipes state
    displayRecipes.splice(displayRecipes.indexOf(displayRecipes.find((r) => r.id === recipe.id)), 1);
    // remove from recipes state
    recipes.splice(recipes.indexOf(recipes.find((r) => r.id === recipe.id)), 1);
    // remove from favorite recipes
    favoriteRecipes.splice(favoriteRecipes.indexOf(favoriteRecipes.find((r) => r.id === recipe.id)), 1);
    this.setState({ displayRecipes: displayRecipes, favoriteRecipes: favoriteRecipes });
    this.props.changeRecipes(recipes);

  }

  getRecipeIds = () => {
    let ids = [];
    this.props.recipes.recipes?.forEach((recipe) => {
      ids.push(recipe.id);
    });
    console.log('ids in getRecipeIds');
    console.log(ids);
    return ids;
  }

  // ------------------------------------------------------------ needs refactored ------------------------------------------------------------ //
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
    this.setState({ displayRecipes: displayRecipes, favoriteRecipes: favoriteRecipes });
    this.props.changeRecipes(recipes);
    const newRecipes = {
      recipes: recipes
    };
    await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify(newRecipes));
  }

  render() {
    let selectedIndex = 1;
    const { showSearch, displayRecipes, showFullRecipe } = this.state;
    const { recipes } = this.props.recipes;

    const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: this.y } } }], {
      useNativeDriver: true,
    });
    return (
      <SafeAreaView>
        {this.state.disabled ?
          <Pressable
            style={styles.disabledView}
            onPress={() => {
              this.setState({ disabled: false });
            }}
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
              returnKeyType="search"
              clearButtonMode="always"
            />
            <View style={{ position: 'absolute', right: 8, marginTop: 3 }}>
              <Button
                title='cancel'
                onPress={this.cancelSearchPress}
                type="clear"
                titleStyle={styles.cancelButtonTitle}
                buttonStyle={{ backgroundColor: 'transparent' }}
              />
            </View>
          </View> : null}
          {recipes?.length > 0 ? <AnimatedFlatList
            data={displayRecipes}
            renderItem={({ index, item }) => (
              <RecipeCard
                index={index}
                y={this.y}
                recipe={item}
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
          /> : 
          <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 20, color: '#6e6e6e'}}>
              Create a recipe to get started
            </Text>
          </View>
          }
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

const mapStateToProps = (state) => {
  return ({
    recipes: state.recipes,
    cookbooks: state.cookbooks,
    user: state.user,
  });
}

const mapDispatchToProps = dispatch => {
  return (bindActionCreators({ changeRecipes, changeCookbooks, changeUser }, dispatch));
}

export default connect(mapStateToProps, mapDispatchToProps)(Recipes);



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
