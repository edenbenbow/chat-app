//import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import React, { Component } from 'react';

export default class HelloWorld extends Component {

    constructor(props) {
        super(props);
        this.state = { text: '' };
    }

    alertMyText (input = []) {
        Alert.alert(input.text);
    }

    render() {
        return (
            <View style={{flex:1, justifyContent:'center'}}>
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    placeholder='Type here ...'
                />
                <Text>You wrote: {this.state.text}</Text>
                <Button
                    onPress={() => {
                        this.alertMyText({text: this.state.text});
                    }}
                    title="Press Me"
                />
                <ScrollView>
                    <Text style={{fontSize:110}}>This text is so big! And so long! You have to scroll!</Text>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    box1: {
        flex:10,
        backgroundColor: 'blue'
    },
    box2: {
        flex:120,
        backgroundColor: 'red'
    },
    box3: {
        flex:50,
        backgroundColor: 'green'
    }
});

{/*export default class App extends React.Component {
  render() {
    return (
        <View>
          <Text style={styles.blue}>Hello World!</Text>
          <Text style={styles.bigRed}>How are you?</Text>
          <Text style={[styles.blue, styles.bigRed]}>I'm feeling blue!</Text>
          <View style={styles.box}></View>
        </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  blue: {
    color: 'blue',
    fontWeight: '600',
  },
  bigRed: {
    color: 'red',
    fontSize: 30,
  },
  bigRedBold: {
    color: 'red',
    fontSize: 30,
    fontWeight: '600',
  },
  box: {
    width: 60,
    height: 60,
    backgroundColor: 'blue',
  }
})\*/}


