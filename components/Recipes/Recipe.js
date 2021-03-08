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
import AddToCookbook from '../Cookbooks/AddToCookbook';

const SINGLE_LINE_HEIGHT = 38;
let titleOverflow = false;
const width = Dimensions.get("window").width;
const recipeHeight = Dimensions.get("window").height - Constants.statusBarHeight - 130;
let oldX = 0;

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
      selectedImageIndex: 0,
      selectCookbookToggled: false,
    };
  }

  /**
   * Receives the current recipe as this.props.route.params.recipe
   */
  componentDidMount() {
    const { recipe } = this.props.route.params;
  }

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

  addToCookbook = () => {
    const { recipe } = this.props.route.params;
    this.setState({ selectCookbookToggled: true });
    this.toolTipRef?.current?.toggleTooltip();
  }

  cancelAddToCookbook = () => {
    this.setState({ selectCookbookToggled: false });
  }

  saveToCookbook = () => {
    this.setState({ selectCookbookToggled: false });
    
  }

  onScroll = (e) => {
    let selectedIndex = 1;
    const oldIndex = this.state.selectedImageIndex;
    let currentX = e.nativeEvent.contentOffset.x;
    if (currentX > oldX) {
      // scrolling right
      selectedIndex = Math.ceil(currentX / width) + 0;
      if (selectedIndex !== oldIndex) {
        this.setState({ selectedImageIndex: selectedIndex });
      }
    } else {
      // scrolling left
      selectedIndex = Math.floor(currentX / width) + 0;
      if (selectedIndex !== oldIndex) {
        this.setState({ selectedImageIndex: selectedIndex });
      }
    }
    oldX = currentX;


  }

  renderPagination = (imagesLength) => {
    const { selectedImageIndex } = this.state;
    let paginationComponent = [];
    if(imagesLength < 2) {
      return null;
    }
    for(let i = 0; i < imagesLength; i++) {
      if(i === selectedImageIndex || (selectedImageIndex > imagesLength-1 && i === imagesLength-1) || (selectedImageIndex < 0 && i === 0)) {
        paginationComponent.push(<View key={i} style={{ backgroundColor: '#fff', height: 9, width: 9, borderRadius: 5, marginLeft: 5 }} />);
      } else {
        paginationComponent.push(<View key={i} style={{ backgroundColor: '#969696', height: 9, width: 9, borderRadius: 5, marginLeft: 5 }} />);
      }
    }
    return (
    <View style={{ width: '100%', height: 20, backgroundColor: '#ffffff00', alignSelf: 'center', alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 5, position: 'absolute', top: 0, zIndex: 200, borderRadius: 10 }} >
      <View style={{ flexDirection: 'row', }}>
        {paginationComponent}
      </View>
    </View>
    );
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
          <Overlay isVisible={this.state.selectCookbookToggled} onBackdropPress={() => this.setState({ selectCookbookToggled: false }) } overlayStyle={{width: '90%', height: '60%', borderRadius: 10, padding: 0, overflow: 'hidden'}}>
            <AddToCookbook cancelAddToCookbook={this.cancelAddToCookbook} addToCookbook={this.saveToCookbook} />
          </Overlay>
        <ScrollView
          style={{ paddingBottom: 0, height: '100%', width: width }}
          stickyHeaderIndices={[0]}
        >
          {recipe.images?.length > 0 ?
            <View>
              {this.renderPagination(recipe.images?.length)}
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
                onScroll={this.onScroll}
              />
            </View>
            : null}
          <View style={[{ flexDirection: 'row', zIndex: 100, marginTop: titleOverflow && recipe.images?.length > 0 ? -80 : recipe.images?.length > 0 ? -50 : 0, paddingHorizontal: 10, paddingTop: recipe.images?.length > 0 ? 0 : 10, paddingRight: recipe.images?.length > 0 ? 0 : 0, backgroundColor: recipe.images?.length > 0 ? null : '#fff' }]}>
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
                <Text style={[styles.title, { color: recipe.images?.length > 0 ? 'white' : '#000', zIndex: 1000 }]} >
                  {recipe.title}
                </Text>
              </View>
              {recipe.images?.length > 0 ?
                <LinearGradient
                  colors={['transparent', '#000000']}
                  style={{ zIndex: 10, position: 'absolute', top: 0, height: 100, width: Dimensions.get("window").width, opacity: 0.8, marginTop: titleOverflow && recipe.images?.length > 0 ? -27 : -60, marginLeft: -10 }}
                /> :
                null}
            </View>
            <View style={{ position: 'absolute', right: 0, bottom: 0, marginBottom: 0, marginRight: 5, zIndex: 1000 }}>
              <View style={{ borderRadius: 20, overflow: 'hidden' }}>
                {!this.state.hideTooltip ? <Tooltip
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
                      <TouchableHighlight underlayColor="#000" style={styles.menuItem} onPress={this.addToCookbook}>
                        <View style={styles.menuItemTextContainer}>
                          <Text style={styles.menuItemText}>Add to Cookbook</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  }
                /> : null}
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
