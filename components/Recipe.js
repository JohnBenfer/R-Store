import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, ImageBackground, StatusBar, Platform, ScrollView, Dimensions, Pressable, TouchableHighlight, Image } from 'react-native';
import { Input, Button, Overlay, Text, Icon, Tooltip } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import EditRecipeModal from './EditRecipeModal';
import Ingredients from './Ingredients';
import Directions from './Directions';
import BottomSheet from 'reanimated-bottom-sheet';
import Constants from 'expo-constants';

const SINGLE_LINE_HEIGHT = 38;
let titleOverflow = false;
const width = Dimensions.get("window").width;
const recipeHeight = Dimensions.get("window").height - Constants.statusBarHeight - 130;

export default class Inventory extends React.Component {
  toolTipRef = React.createRef();
  titleRef = React.createRef();
  editRecipeRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      checkedIngredients: [],
      checkedDirections: [],
      titleOverflow: false,
      viewMarginTop: 15,
      showEditRecipe: false,
    };
  }

  /**
   * Receives the current recipe as this.props.route.params.recipe
   */
  componentDidMount() {
    const { recipe } = this.props.route.params;
  }

  // ingredientChecked = (index) => {
  //   const { checkedIngredients } = this.state;
  //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  //   checkedIngredients.push(index);
  //   this.setState({ checkedIngredients: checkedIngredients });
  // }

  // ingredientUnchecked = (index) => {
  //   const { checkedIngredients } = this.state;
  //   checkedIngredients.splice(checkedIngredients.indexOf(index), 1);
  //   this.setState({ checkedIngredients: checkedIngredients });
  // }

  // directionChecked = (index) => {
  //   const { checkedDirections } = this.state;
  //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  //   checkedDirections.push(index);
  //   this.setState({ checkedDirections: checkedDirections });
  // }

  // directionUnchecked = (index) => {
  //   const { checkedDirections } = this.state;
  //   checkedDirections.splice(checkedDirections.indexOf(index), 1);
  //   this.setState({ checkedDirections: checkedDirections });
  // }

  // renderIngredients() {
  //   const { recipe } = this.props.route.params;
  //   let ingredients = [];
  //   recipe.ingredients.forEach((ingredient, i) => {
  //     let checked = this.state.checkedIngredients.includes(i);
  //     ingredients.push(
  //       <View key={i}>
  //         <View style={{ borderBottomWidth: 1, borderColor: '#cccccc', }} />
  //         <View style={{ flexDirection: 'row', marginVertical: 9, paddingHorizontal: 15, }}>
  //           <Text key={i} style={{ fontSize: 16, color: !checked ? '#000' : '#7d7d7d' }}>
  //             {ingredient.title}
  //           </Text>
  //           <View style={{ position: 'absolute', right: 0, marginRight: 10, alignSelf: 'center' }}>
  //             {!this.state.checkedIngredients.includes(i) ?
  //               (<Pressable onPress={() => this.ingredientChecked(i)} hitSlop={7}>
  //                 <Icon name='circle-thin' type='font-awesome' size={20} color='#6b6b6b' onPress={() => { this.ingredientChecked(i) }} />
  //               </Pressable>) :
  //               (<Pressable onPress={() => this.ingredientUnchecked(i)} hitSlop={7}>
  //                 <Icon name='check' type='ant-design' size={20} color='#42c930' onPress={() => { this.ingredientUnchecked(i) }} />
  //               </Pressable>)}
  //           </View>
  //         </View>
  //       </View>);
  //   });
  //   ingredients.push(
  //     <View key={12345} style={{ borderBottomWidth: 1, borderColor: '#cccccc' }} />
  //   )
  //   return ingredients;
  // }

  // renderDirections() {
  //   const { recipe } = this.props.route.params;
  //   let directions = [];
  //   recipe.directions.forEach((direction, index) => {
  //     let checked = this.state.checkedDirections.includes(index);
  //     directions.push(
  //       <View key={index} style={{ backgroundColor: !checked ? '#e6e6e6' : '#f0f0f0', borderRadius: 10, marginVertical: 6, marginHorizontal: 10 }}>
  //         <View style={{ marginVertical: 8, marginLeft: 6, flexDirection: 'row' }}>
  //           <Text key={index} style={{ fontSize: 16, paddingRight: 35, color: !checked ? '#000' : '#737373' }}>
  //             {`${index + 1}. ${direction.title}`}
  //           </Text>
  //           <View style={{ position: 'absolute', right: 0, marginRight: 10, alignSelf: 'center' }}>
  //             {!checked ?
  //               (<Pressable onPress={() => this.directionChecked(index)} hitSlop={10}>
  //                 <Icon name='circle-thin' type='font-awesome' size={20} color='#6b6b6b' onPress={() => { this.directionChecked(index) }} />
  //               </Pressable>) :
  //               (<Pressable onPress={() => this.directionUnchecked(index)} hitSlop={10}>
  //                 <Icon name='check' type='ant-design' size={20} color='#42c930' onPress={() => { this.directionUnchecked(index) }} />
  //               </Pressable>)}
  //           </View>
  //         </View>
  //       </View>);
  //   });
  //   return directions;
  // }

  renderEditRecipe = () => {
    return <EditRecipeModal saveEditRecipe={this.saveEditRecipe} cancelEditPress={this.cancelEditPress} recipe={this.props.route.params.recipe} />
  }

  cancelEditPress = () => {
    setTimeout(() => this.editRecipeRef?.current?.snapTo(1), 10);
    this.setState({ showEditRecipe: false });
  }

  saveEditRecipe = (recipe) => {
    console.log(recipe);
    setTimeout(() => {
      this.editRecipeRef?.current?.snapTo(1);
      setTimeout(() => this.setState({ showEditRecipe: false }), 150);
    }, 250);

    this.props.route.params.saveEditRecipe(recipe);
  }

  editRecipe = () => {
    setTimeout(() => this.editRecipeRef.current.snapTo(0), 150);
    this.setState({ showEditRecipe: true });
    this.toolTipRef.current.toggleTooltip();
  }

  deleteRecipe = () => {
    this.toolTipRef.current.toggleTooltip();
    this.props.route.params.deleteRecipe(this.props.route.params.recipe);
    this.props.navigation.goBack();
  }

  render() {
    const { recipe } = this.props.route.params;
    return (
      <View style={{ height: '100%' }}>
        {this.state.disabled ?
          <Pressable
            style={styles.disabledView}
            onPress={() => {
              this.editRecipeRef?.current?.snapTo(1);
              this.setState({ disabled: false });
            }}
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
        <ScrollView
          style={{ paddingBottom: 0, height: '100%', width: width }}
          stickyHeaderIndices={[0]}
        >
          {recipe.images.length > 0 ?
            <View>
              <FlatList
                data={recipe.images}
                horizontal
                renderItem={(image, index) => {
                  return (
                    <View style={{ width: width }}>
                      <ImageBackground source={{ uri: image.item }} style={{ width: width, height: 400, marginHorizontal: 0, overflow: 'visible' }} />
                    </View>
                  );
                }}
                keyExtractor={(image, index) => index.toString()}
                contentContainerStyle={{ paddingHorizontal: 0 }}
                snapToAlignment={"center"}
                snapToInterval={Dimensions.get("window").width + (0 * 2)}
                decelerationRate={0.993}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            : null}
          <View style={[{ flexDirection: 'row', zIndex: 100, marginTop: titleOverflow && recipe.images.length > 0 ? -80 : recipe.images.length > 0 ? -50 : 0, paddingHorizontal: 10, paddingTop: recipe.images.length === 0 ? 10 : 0, paddingRight: recipe.images.length > 0 ? 0 : 0, backgroundColor: recipe.images.length === 0 ? '#fff' : null }]}>
            <View>
              <View
                style={{ zIndex: 100, paddingRight: 70 }}
                ref={this.titleRef}
                onLayout={(event) => {
                  if (event.nativeEvent.layout.height > SINGLE_LINE_HEIGHT) {
                    titleOverflow = true;
                    this.setState({ titleOverflow: true });
                  }
                }}>
                <Text style={[styles.title, { color: recipe.images.length > 0 ? 'white' : '#000', zIndex: 1000 }]} >
                  {recipe.title}
                </Text>
              </View>
              {recipe.images.length > 0 ?
                <LinearGradient
                  colors={['transparent', '#000000']}
                  style={{ zIndex: 10, position: 'absolute', top: 0, height: 100, width: Dimensions.get("window").width, opacity: 0.8, marginTop: titleOverflow && recipe.images.length > 0 ? -27 : -60, marginLeft: -10 }}
                /> :
                null}
            </View>
            <View style={{ position: 'absolute', right: 0, bottom: 0, marginBottom: 0, marginRight: 5, zIndex: 1000 }}>
              <View style={{ borderRadius: 20, overflow: 'hidden' }}>
                <Tooltip
                  ref={this.toolTipRef}
                  withOverlay={false}
                  withPointer={false}
                  pointerColor="#fff"
                  containerStyle={styles.menuContainer}
                  skipAndroidStatusBar
                  popover={
                    <View>
                      <TouchableHighlight
                        underlayColor="#000"
                        style={styles.menuItem}
                        onPress={this.editRecipe}>
                        <View style={styles.menuItemTextContainer}>
                          <Text style={styles.menuItemText}>Edit</Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight underlayColor="#000" style={styles.menuItem} onPress={this.deleteRecipe}>
                        <View style={styles.menuItemTextContainer}>
                          <Text style={styles.menuItemText}>Delete</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  }
                />
              </View>
              <Icon
                name="dots-three-horizontal"
                type="entypo"
                size={11}
                color="#fff"
                reverse
                reverseColor="#000"
                onPress={() => { this.toolTipRef.current.toggleTooltip() }}
              />
            </View>
          </View>
          <View style={{ zIndex: 100, backgroundColor: 'white' }}>
            {recipe.description?.length > 0 || recipe.images?.length > 0 ? <Text style={{ margin: 15, marginTop: 25, alignSelf: 'center', textAlign: 'center' }}>
              {recipe.description}
            </Text> :
              <View style={{ marginTop: 10, borderTopWidth: 1, marginHorizontal: 10, borderColor: '#ccc' }} />}
            <Text style={[styles.subtitle, { marginBottom: 7 }]}>
              Ingredients
            </Text>
            <Ingredients ingredients={recipe.ingredients} />
            <Text style={[styles.subtitle, { marginTop: 20 }]}>
              Directions
            </Text>
            <Directions directions={recipe.directions} />
            <View style={{ height: 70 }}>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    color: 'black',
    // alignSelf: 'center',
    // textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#6b6b6b'
    // alignSelf: 'center'
  },
  menuContainer: {
    // overflow: 'hidden',
    marginTop: -20,
    backgroundColor: 'transparent',
    // borderRadius: 10,
    // height: 70
  },
  menuItem: {
    width: 150,
    height: 35,
    borderRadius: 10,
    marginBottom: 5,
  },
  menuItemTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    borderRadius: 10
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 0,
  },
  disabledView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 10,
  },
});
