import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, ImageBackground, StatusBar, Platform, ScrollView, Dimensions } from 'react-native';
import { Input, Button, Overlay, Text } from 'react-native-elements';

export default class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /**
   * Receives the current user as this.props.route.params.user
   */
  async componentDidMount() {

  }


  render() {
    const { recipe } = this.props;
    return (
      <View style={{ height: this.props.height }}>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {recipe.title}
          </Text>
        </View>
        <ScrollView>
          <Text>
            {recipe.description}
          </Text>


          {recipe.images.length > 0 ? <FlatList
            data={recipe.images}
            horizontal
            renderItem={(image, index) => {
              return (
                <View style={{ overflow: 'visible', paddingVertical: 5 }}>
                  <ImageBackground source={{ uri: image.item }} style={{ width: 190, height: 190, marginHorizontal: 5, overflow: 'visible' }}>
                  </ImageBackground>
                </View>
              );
            }}
            keyExtractor={(image, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            snapToAlignment={"center"}
            snapToInterval={200}
            decelerationRate={0.993}
            showsHorizontalScrollIndicator={false}
            ref={this.photoListRef}
          /> : null}

                
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#f2f2f2',
    marginBottom: 10
  },
  title: {
    fontSize: 30,
    color: 'black',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  titleContainer: {
    height: 50,
    borderBottomWidth: 1,
    width: Dimensions.get("window").width,
    marginLeft: -16,
  }
});
