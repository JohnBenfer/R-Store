import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Animated, Dimensions, Pressable } from 'react-native';
import { Input, Button, Overlay, Text } from 'react-native-elements';

const DEFAULT_CARD_HEIGHT = 480;
const MARGIN = 12;
const BOTTOM_TABS = 90;
const CARD_HEIGHT = DEFAULT_CARD_HEIGHT + MARGIN * 2;
const { height: wHeight, width } = Dimensions.get("window");
const height = wHeight - 64;


const styles = StyleSheet.create({
  recipe: {
    padding: 5,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    // height: DEFAULT_CARD_HEIGHT,
    marginVertical: 0,
    width: width*0.85,

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
        inputRange: [0, 0.00001+ index * CARD_HEIGHT],
        outputRange: [0, -index * CARD_HEIGHT],
        extrapolateRight: "clamp",
      })
    ),
    position.interpolate({
      inputRange: [isDisappearing, isTop, isBottom, isAppearing],
      outputRange: [CARD_HEIGHT/4, 20, 0, -CARD_HEIGHT / 6],
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
    return recipe.ingredients?.map((i, index) => <Text key={index}>{i.quantity + ' ' + i.title}</Text>);
  }

  return (
    <Animated.View
      style={[styles.card, {opacity, transform: [{ translateY }, { scaleX }, { scaleY }] }]}
      key={index}
    >
      <Pressable onPress={() => props.handleRecipePress(recipe, index)}>
        <View style={[styles.recipe, {height: DEFAULT_CARD_HEIGHT, backgroundColor: '#e6e6e6'}]}>
          <Text style={styles.recipeTitle}>{props.recipe.title}</Text>
          <Text style={styles.recipeDescription}>{props.recipe.description}</Text>
          {renderIngredients()}
        </View>
      </Pressable>
    </Animated.View>
  );

}

export default RecipeCard;