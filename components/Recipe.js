import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, ImageBackground, StatusBar, Platform, ScrollView, Dimensions, Pressable, TouchableHighlight } from 'react-native';
import { Input, Button, Overlay, Text, Icon, Tooltip } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

export default class Inventory extends React.Component {
  toolTipRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      checkedIngredients: [],
      checkedDirections: [],
    };
  }

  /**
   * Receives the current user as this.props.route.params.user
   */
  async componentDidMount() {

  }

  ingredientChecked = (index) => {
    const { checkedIngredients } = this.state;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    checkedIngredients.push(index);
    this.setState({ checkedIngredients: checkedIngredients });
  }

  ingredientUnchecked = (index) => {
    const { checkedIngredients } = this.state;
    checkedIngredients.splice(checkedIngredients.indexOf(index), 1);
    this.setState({ checkedIngredients: checkedIngredients });
  }

  directionChecked = (index) => {
    const { checkedDirections } = this.state;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    checkedDirections.push(index);
    this.setState({ checkedDirections: checkedDirections });
  }

  directionUnchecked = (index) => {
    const { checkedDirections } = this.state;
    checkedDirections.splice(checkedDirections.indexOf(index), 1);
    this.setState({ checkedDirections: checkedDirections });
  }

  renderIngredients() {
    const { recipe } = this.props;
    let ingredients = [];
    recipe.ingredients.forEach((ingredient, i) => {
      let checked = this.state.checkedIngredients.includes(i);
      ingredients.push(
        <View key={i}>
          <View style={{ borderBottomWidth: 1, borderColor: '#cccccc', }} />
          <View style={{ flexDirection: 'row', marginVertical: 9, paddingHorizontal: 15, }}>
            <Text key={i} style={{ fontSize: 16, color: !checked ? '#000' : '#7d7d7d' }}>
              {ingredient.title}
            </Text>
            <View style={{ position: 'absolute', right: 0, marginRight: 10, alignSelf: 'center' }}>
              {!this.state.checkedIngredients.includes(i) ?
                (<Pressable onPress={() => this.ingredientChecked(i)} hitSlop={7}>
                  <Icon name='circle-thin' type='font-awesome' size={20} color='#6b6b6b' onPress={() => { this.ingredientChecked(i) }} />
                </Pressable>) :
                (<Pressable onPress={() => this.ingredientUnchecked(i)} hitSlop={7}>
                  <Icon name='check' type='ant-design' size={20} color='#42c930' onPress={() => { this.ingredientUnchecked(i) }} />
                </Pressable>)}
            </View>
          </View>
        </View>);
    });
    ingredients.push(
      <View key={12345} style={{ borderBottomWidth: 1, borderColor: '#cccccc' }} />
    )
    return ingredients;
  }

  renderDirections() {
    const { recipe } = this.props;
    let directions = [];
    recipe.directions.forEach((direction, index) => {
      let checked = this.state.checkedDirections.includes(index);
      directions.push(
        <View key={index} style={{ backgroundColor: !checked ? '#e6e6e6' : '#f0f0f0', borderRadius: 10, marginVertical: 6, marginHorizontal: 10 }}>
          <View style={{ marginVertical: 8, marginLeft: 6, flexDirection: 'row' }}>
            <Text key={index} style={{ fontSize: 16, paddingRight: 35, color: !checked ? '#000' : '#737373' }}>
              {`${index + 1}. ${direction}`}
            </Text>
            <View style={{ position: 'absolute', right: 0, marginRight: 10, alignSelf: 'center' }}>
              {!checked ?
                (<Pressable onPress={() => this.directionChecked(index)} hitSlop={10}>
                  <Icon name='circle-thin' type='font-awesome' size={20} color='#6b6b6b' onPress={() => { this.directionChecked(index) }} />
                </Pressable>) :
                (<Pressable onPress={() => this.directionUnchecked(index)} hitSlop={10}>
                  <Icon name='check' type='ant-design' size={20} color='#42c930' onPress={() => { this.directionUnchecked(index) }} />
                </Pressable>)}
            </View>
          </View>
        </View>);
    });
    return directions;
  }

  render() {
    const { recipe } = this.props;
    return (
      <View style={{ height: this.props.height, paddingBottom: 15 }}>
        <ScrollView
          style={{ width: Dimensions.get("window").width, marginLeft: -16, marginTop: -17, }}
          stickyHeaderIndices={[0]}
        >
          {recipe.images.length > 0 ? <FlatList
            data={recipe.images}
            horizontal
            renderItem={(image, index) => {
              return (
                <View style={{ overflow: 'visible', paddingVertical: 0 }}>
                  <ImageBackground source={{ uri: image.item }} style={{ width: Dimensions.get("window").width, height: 400, marginHorizontal: 0, overflow: 'visible' }}>
                    {/* <LinearGradient colors={['transparent', '#000000']} style={{ position: 'absolute', bottom: 0, height: 100, width: '100%', opacity: 0.8 }} /> */}
                  </ImageBackground>
                </View>
              );
            }}
            keyExtractor={(image, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            snapToAlignment={"center"}
            snapToInterval={Dimensions.get("window").width + (0 * 2)}
            decelerationRate={0.993}
            showsHorizontalScrollIndicator={false}
            ref={this.photoListRef}
          /> : <View></View>}
          <View style={[{ flexDirection: 'row', zIndex: 100, marginTop: recipe.title.length > 30 && recipe.images.length > 0 ? -80 : recipe.images.length > 0 ? -50 : 15, paddingHorizontal: 10, paddingRight: 70 }]}>
            <View>
              <Text style={[styles.title, { color: recipe.images.length > 0 ? 'white' : '#000', zIndex: 100 }]}>
                {recipe.title}
              </Text>
              {recipe.images.length > 0 ? <LinearGradient colors={['transparent', '#000000']} style={{ zIndex: 10, position: 'absolute', top: 0, height: 100, width: Dimensions.get("window").width, opacity: 0.8, marginTop: -60, marginLeft: -10 }} /> : null}
            </View>
            <View style={{ position: 'absolute', right: 0, bottom: 0, marginBottom: 0, marginRight: 5 }}>
              {/* <Button
                onPress={() => this.props.editRecipe(recipe)}
                title="edit"
                type="clear"
                titleStyle={{}}
                buttonStyle={{ backgroundColor: 'transparent', }} /> */}
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
                        onPress={() => {
                          this.toolTipRef.current.toggleTooltip();
                          this.props.editRecipe(recipe);
                        }}>
                        <View style={styles.menuItemTextContainer}>
                          <Text style={styles.menuItemText}>Edit</Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight underlayColor="#000" style={styles.menuItem} onPress={() => console.log('delete')}>
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
                onPress={() => this.toolTipRef.current.toggleTooltip()}
              />
            </View>
          </View>
          <View style={{ zIndex: 100, backgroundColor: 'white' }}>
            <Text style={{ margin: 15, marginTop: 25, alignSelf: 'center', textAlign: 'center' }}>
              {recipe.description}
            </Text>
            <Text style={[styles.subtitle, { marginBottom: 7 }]}>
              Ingredients
          </Text>
            {this.renderIngredients()}
            <Text style={[styles.subtitle, { marginTop: 20 }]}>
              Directions
          </Text>
            {this.renderDirections()}
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
    alignSelf: 'center',
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
});
