import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Animated, Dimensions, Pressable, Image, ImageBackground } from 'react-native';
import { Input, Button, Overlay, Text } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

const DEFAULT_CARD_HEIGHT = 400;
const MARGIN = 12;
const BOTTOM_TABS = 90;
const CARD_HEIGHT = DEFAULT_CARD_HEIGHT + MARGIN * 2;
const { height: wHeight, width } = Dimensions.get("window");
const height = wHeight - 64;


const styles = StyleSheet.create({
  recipe: {
    padding: 0,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    // height: DEFAULT_CARD_HEIGHT,
    marginVertical: 0,
    width: width * 0.85,

  },
  card: {
    marginVertical: MARGIN,
    alignSelf: "center",
    overflow: 'hidden',
  },
  recipeTitle: {
    textAlign: 'center',
    padding: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  recipeDescription: {
    paddingHorizontal: 5
  },
  ingredients: {
    paddingHorizontal: 5,
  }

})
// props: recipe, y, index
// recipe: title, description, id
const RecipeCard = (props) => {
  const { recipe, index, selected, selectedIndex, y } = props;
  const position = Animated.subtract(index * CARD_HEIGHT, y);
  const isDisappearing = -CARD_HEIGHT;
  const isTop = 0;
  const isBottom = height - CARD_HEIGHT - BOTTOM_TABS;
  const isAppearing = height;
  const translateY = Animated.add(
    Animated.add(
      y,
      y.interpolate({
        inputRange: [0, 0.00001 + index * CARD_HEIGHT],
        outputRange: [0, -index * CARD_HEIGHT],
        extrapolateRight: "clamp",
      })
    ),
    position.interpolate({
      inputRange: [isDisappearing, isTop, isBottom, isAppearing],
      outputRange: [CARD_HEIGHT / 4, 20, 0, -30],
      extrapolate: "clamp",
    })
  );

  const scaleX = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.4, 1, 1, 0.6],
    extrapolate: "clamp",
  });

  const scaleY = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.4, 1, 1, 0.6],
    extrapolate: "clamp",
  });

  const opacity = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0, 1, 1, 0.7],
  });

  const renderIngredients = () => {
    return recipe.ingredients?.map((i, index) => <Text style={styles.ingredients} key={index}>{i.title}</Text>);
  }

  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateY }, { scaleX }, { scaleY }] }]}
      key={index}
    >
      <Pressable onPress={() => props.handleRecipePress(recipe, index)}>
        <View style={[styles.recipe, { height: DEFAULT_CARD_HEIGHT, backgroundColor: '#e6e6e6' }]}>
          <Text style={styles.recipeTitle}>{props.recipe.title}</Text>
          {recipe.images.length > 0 && (
            <ImageBackground source={{ uri: recipe.images[0] }} style={{ width: '100%', height: DEFAULT_CARD_HEIGHT-28, marginTop: -13, zIndex: -1}} >
              <LinearGradient colors={['#e6e6e6', '#FFFFFF00']} style={{ position: 'absolute', top: 0, height: 60, width: '100%' }} />
              <LinearGradient colors={['#FFFFFF00', '#e6e6e6']} style={{ position: 'absolute', bottom: 0, height: 60, width: '100%' }} />
            </ImageBackground>
          )}
          <Text style={styles.recipeDescription}>{props.recipe.description}</Text>
          {renderIngredients()}
        </View>
      </Pressable>
    </Animated.View>
  );

}

export default RecipeCard;