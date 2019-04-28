import React, {Component} from 'react';
import { Subscription  } from "react-apollo";
import { gql } from "apollo-boost";

const TWEETS_ADDED = gql`
subscription {
   getTweets{
    text
    id
  }
}
`;

class Stream extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    subsCompleted = data => {
        let tweet = data.subscriptionData.data.getTweets
        let oldData = this.state.data;
        oldData.push(tweet);

        if(oldData.length > 6){
            oldData.shift();
        }
        this.setState({
            data : oldData
        })

    };

    tweetsAdded = () => (
        <Subscription
            subscription={TWEETS_ADDED}
            onSubscriptionData={this.subsCompleted}
        >
            {({ data, loading }) => {

                return (
                    <React.Fragment> {this.state.data.map( tweet => {
                    return(<p key={tweet.id}>{tweet.text}</p>)
                })}
                </React.Fragment>
                );
            }}
        </Subscription>
    );

    render() {

        return (<div className="stream">
            {this.tweetsAdded()}
        </div>);

    }
}

export default Stream;