import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native-elements';

class CookbookCardSmall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    const { cookbook } = this.props;
    return (
      <View style={{ flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 5 }}>
        <View style={{justifyContent: 'center'}}>
          {cookbook.image ?
            <Image /> :
            <Image source={require('../../assets/cookbookicon.png')} style={{ width: 50, height: 50 }} />
          }
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: 'bold', paddingTop: 2, marginBottom: -2 }}>
            {cookbook.title}
          </Text>
          <View style={{paddingBottom: 4, }}>
            <Text style={{color: '#787878'}}>
              {`By ${cookbook.owner.firstName} ${cookbook.owner.lastName}`}
            </Text>
          </View>
          <Text>
            {cookbook.recipes?.length < 1 || !cookbook.recipes ? 'No' : cookbook.recipes?.length} {cookbook.recipes?.length === 1 ? 'Recipe' : 'Recipes'}
          </Text>
        </View>


      </View>
    );
  }
}

export default CookbookCardSmall;