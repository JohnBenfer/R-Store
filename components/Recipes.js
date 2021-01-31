import React, { createRef } from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Animated, TextInput, TouchableHighlight } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import { ScrollView, } from 'react-native-gesture-handler';
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
  searchRef = createRef();
  constructor(props) {
    super(props);
    this.state = {
      recipes: this.loadMockRecipes(),
      selectedRecipe: {},
      selectedIndex: 1,
      showSearch: false,
    };

  }

  async componentDidMount() {
    // prevents going back to signup page
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableHighlight style={{borderWidth: 2, borderColor: '#636363', borderRadius: 6, marginHorizontal: 7,}}>
          <Icon
            style={{alignSelf: 'center'}}
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
        { id: 21, title: 'meatballs', description: 'a ball of meat' },
        { id: 22, title: 'pie', description: 'a circle of yum' },
        { id: 23, title: 'pizza', description: 'a circle of bread and meat' },
        { id: 24, title: 'meat load', description: 'a loaf of meat' },
        { id: 25, title: 'mashed potatoes', description: 'a mashed of potatoes' },
        { id: 26, title: 'meatballs', description: 'a ball of meat' },
        { id: 27, title: 'pie', description: 'a circle of yum' },
        { id: 28, title: 'pizza', description: 'a circle of bread and meat' },
        { id: 29, title: 'meat load', description: 'a loaf of meat' },
        { id: 31, title: 'meatballs', description: 'a ball of meat' },
        { id: 32, title: 'pie', description: 'a circle of yum' },
        { id: 33, title: 'pizza', description: 'a circle of bread and meat' },
        { id: 34, title: 'meat load', description: 'a loaf of meat' },
        { id: 35, title: 'mashed potatoes', description: 'a mashed of potatoes' },
        { id: 36, title: 'meatballs', description: 'a ball of meat' },
        { id: 37, title: 'pie', description: 'a circle of yum' },
        { id: 38, title: 'pizza', description: 'a circle of bread and meat' },
        { id: 39, title: 'meat load', description: 'a loaf of meat' },
      ]
    );
  }

  createRecipe = () => {

    this.props.navigation.push("CreateRecipe", { });
  }

  searchPress = () => {
    this.setState({ showSearch: true });
    setTimeout(() => {
      this.searchRef.current.focus();
    }, 150);
  }

  handleRecipePress = (recipe, index) => {
    this.state.selectedRecipe !== recipe ? this.setState({ selectedRecipe: recipe }) : null;
    this.flatListRef.current.scrollToIndex({
      index: index
    });
    if (index + 1 === this.state.selectedIndex) {
      this.props.navigation.push("Recipe", {recipe: recipe});
    }
  }


  render() {
    let selectedIndex = 1;
    const { showSearch } = this.state;

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
          <Overlay
            isVisible={showSearch}
            onBackdropPress={() => this.setState({ showSearch: !showSearch })}
            overlayStyle={styles.overlayStyle}
            backdropStyle={{ opacity: 0.4, }}
          >
            <View>
              <TextInput
                style={{ width: '99%', alignSelf: 'center' }}
                autoFocus={false}
                ref={this.searchRef}
                onSubmitEditing={() => this.setState({ showSearch: false })}
                placeholder='Search...'
              />
            </View>
          </Overlay>
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
});
