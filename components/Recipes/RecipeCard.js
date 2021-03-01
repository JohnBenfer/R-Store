import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Animated, Dimensions, Pressable, Image, ImageBackground } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { DEFAULT_CARD_HEIGHT, CARD_HEIGHT, MARGIN } from '../../Constants';

const BOTTOM_TABS = 90;
const { height: wHeight, width } = Dimensions.get("window");
const height = wHeight - 64;


const styles = StyleSheet.create({
  recipe: {
    padding: 0,
    borderWidth: 1.5,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: '#fff',
    // height: DEFAULT_CARD_HEIGHT,
    marginVertical: 0,
    width: width * 0.85,

  },
  card: {
    marginVertical: MARGIN,
    alignSelf: "center",
    overflow: 'hidden',
    width: width * 0.9,
  },
  recipeTitle: {
    textAlign: 'center',
    padding: 5,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : '',
    color: '#fff',
    zIndex: 1000,
    // position: 'absolute',
    // top: 0,
    alignSelf: 'center',
    marginTop: 5,
    paddingHorizontal: 48,
  },
  titleNoPicture: {
    textAlign: 'center',
    padding: 5,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : '',
    color: '#000',
    zIndex: 100,
    marginTop: 5,
  },
  recipeDescription: {
    paddingHorizontal: 5
  },
  ingredients: {
    paddingHorizontal: 20,
    marginTop: 10,
  }

})
// props: recipe, y, index
// recipe: title, description, id
const RecipeCard = (props) => {
  const { recipe, index, selected, y } = props;
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
      outputRange: [-CARD_HEIGHT / 4, 20, 0, -30],
      extrapolate: "clamp",
    })
  );

  const scaleX = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.6],
    extrapolate: "clamp",
  });

  const scaleY = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.6],
    extrapolate: "clamp",
  });

  const opacity = position.interpolate({
    inputRange: [isDisappearing + 100, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.7],
  });

  const renderIngredients = () => {
    return recipe.ingredients?.map((i, index) => <Text style={{ marginBottom: 5, color: '#636363' }} key={index}>{i.title}</Text>);
  }

  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateY }, { scaleX }, { scaleY }] }]}
      key={index}
    >
      <Pressable onPress={() => props.handleRecipePress(recipe, index)} onLongPress={() => props.handleRecipeLongPress(recipe, index)} delayLongPress={250}>

        {recipe.images.length > 0 ? (
          <ImageBackground source={{ uri: recipe.images[0] }} style={{ width: '100%', height: DEFAULT_CARD_HEIGHT, overflow: 'hidden' }} imageStyle={{ borderRadius: 30, overflow: 'hidden' }} >
            <View style={{ overflow: 'hidden', borderRadius: 30, }}>
              <LinearGradient colors={['#000', 'transparent']} style={{ overflow: 'hidden', height: 110, width: '100%', opacity: 0.8, borderTopLeftRadius: 30, borderTopRightRadius: 30 }} >
                <View style={{flexDirection: 'row', alignSelf: 'center', width: '100%', alignItems: 'center', justifyContent: 'center', opacity: 1, zIndex: 1000}}>
                  <Text style={styles.recipeTitle}>{props.recipe.title}</Text>
                  <View style={{ position: 'absolute', right: 0, marginRight: 15, zIndex: 1000, opacity: 1, top: 0, marginTop: 15 }}>
                    <Pressable onPress={() => props.handleRecipeFavoritePress(recipe, index)} hitSlop={10}>
                      {!props.favorite ? <Icon name='hearto' type='antdesign' size={20} color='#fff' /> : <Icon name='heart' type='antdesign' size={20} color='red' />}
                    </Pressable>
                  </View>
                </View>
              </LinearGradient>
            </View>
            <View style={{ overflow: 'hidden', borderRadius: 30, marginTop: DEFAULT_CARD_HEIGHT - 110 - 130 }}>
              <LinearGradient colors={['transparent', '#000']} style={{ overflow: 'hidden', height: 130, width: '100%', opacity: 0.7, borderTopLeftRadius: 30, borderTopRightRadius: 30 }} />
              <Text style={{ position: 'absolute', bottom: 0, marginBottom: 10, paddingHorizontal: 10, color: '#ebebeb', alignSelf: 'center' }}>{props.recipe.description}</Text>
            </View>
          </ImageBackground>
        ) : (
            <View style={{ width: '100%', height: DEFAULT_CARD_HEIGHT, overflow: 'hidden', borderWidth: 1, borderRadius: 30, backgroundColor: '#fff', borderColor: '#ccc' }}>
              <View style={{ flexDirection: 'row', alignSelf: 'center', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[styles.titleNoPicture, { color: '#000', paddingHorizontal: 48 }]}>{props.recipe.title}</Text>
                <View style={{ position: 'absolute', right: 0, marginRight: 15, top: 0, marginTop: 15 }}>
                  <Pressable onPress={() => props.handleRecipeFavoritePress(recipe, index)} hitSlop={10}>
                    {!props.favorite ? <Icon name='hearto' type='antdesign' size={20} /> : <Icon name='heart' type='antdesign' size={20} color='red' />}
                  </Pressable>
                </View>
              </View>
              <View style={{ borderTopWidth: 1, borderBottomWidth: props.recipe.description?.length > 0 ? 1 : 0, marginVertical: 7, paddingVertical: 10, marginHorizontal: 15, borderColor: '#ccc' }}>
                {props.recipe.description?.length > 0 ? <Text style={{ color: '#000', alignSelf: 'flex-start', fontSize: 15, }}>{props.recipe.description}</Text> : null}
              </View>
              <View style={styles.ingredients}>
                {renderIngredients()}
              </View>
            </View>
          )}
        {/* {recipe.images.length > 0 && (
            <Image source={{ uri: recipe.images[0] }} style={{ width: '100%', height: DEFAULT_CARD_HEIGHT-37, borderBottomRightRadius: 7, borderBottomLeftRadius: 7}}/>
          )} */}
      </Pressable>
    </Animated.View>
  );

}

export default RecipeCard;