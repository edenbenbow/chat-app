import { View, Platform } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import KeyboardSpacer from 'react-native-keyboard-spacer'


import React, { Component } from 'react';

export default class Chat extends Component {

    // Name for nav
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.name,
        };
    };

    state = {
        messages: []
    };

    // Adding message props
    componentDidMount() {
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'How are you doing?',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: 'You have entered chat',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }

    // Called when user sends a message
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    //Changes background color of message bubble

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#000'
                    }
                }}
            />
        )
    }

    render() {
        return (
                <View style={{backgroundColor: this.props.navigation.state.params.color, flex: 1}}>
            <GiftedChat
                renderBubble={this.renderBubble.bind(this)}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
                {Platform.OS === 'android' ? <KeyboardSpacer /> : null }
            </View>
        )
    }}
