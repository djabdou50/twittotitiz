import React, {Component} from 'react';
import Card from './card';
import { graphql, Query, ApolloConsumer, Subscription  } from "react-apollo";
import { gql } from "apollo-boost";
import Notification from "./notification";

const getSelfies = gql`
query getSelfies( $offset : offsetInput){
  getSelfies(offset : $offset) {
    male {
      id
      gender
      text
      created_at
      screen_name
      media
    }
    female {
      id
      gender
      text
      created_at
      screen_name
      media
    }
  }
}
`;

const TWEETS_ADDED = gql`
subscription {
  tweetsAdded {
    id
    gender
    text
    created_at
    screen_name
    media
  }
}
`;



class Album extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bottom: false,
            next: 0,
            data: {},
            details: {
                active: false,
                data: {}
            },
            notification: {}
        };

        this.handleScroll = this.handleScroll.bind(this);
    }


    subsCompleted = (data) => {

        let newdata = {
            male: this.state.data.getSelfies.male,
            female: this.state.data.getSelfies.female,
        };

        if(data.subscriptionData.data.tweetsAdded.gender === "male"){
            newdata.male.unshift(data.subscriptionData.data.tweetsAdded)
        }
        if(data.subscriptionData.data.tweetsAdded.gender === "female"){
            newdata.female.unshift(data.subscriptionData.data.tweetsAdded)
        }

        let dataSelfies = {...this.state.data};
        dataSelfies.getSelfies = newdata;

        this.setState({data : dataSelfies });

        this.setState({notification : data.subscriptionData.data.tweetsAdded });

    };

    tweetsAdded = () => (
        <Subscription
            subscription={TWEETS_ADDED}
            onSubscriptionComplete={this.subsCompleted}
            onSubscriptionData={this.subsCompleted}
        >
            {({ data, loading }) => {

                return "";
            }}
        </Subscription>
    );

    /**
     * choose shortest column
     * @param elements
     * @returns {*|(function(*, *): *)}
     */
    getShortestCol(elements){
        return [].reduce.call( elements, (small, current) => {
            return small.getBoundingClientRect().height < current.getBoundingClientRect().height ? small : current;
        });
    }

    /**
     * my way to handle infinit scroll
     */
    handleScroll() {
        // //for a perfect page infinit loading ...
        let elements = document.getElementsByClassName("masonry");
        let short = this.getShortestCol(elements)
        // console.log(short)
        let rect;
        if(short){
            rect = short.getBoundingClientRect();
            // if "half port view height" near to bottom trigger load more
            if(rect.bottom <= (window.innerHeight * 2 || document.documentElement.clientHeight * 2)){
                if(!this.state.bottom){
                    // console.log("bottoooom")
                    this.setState({
                        bottom: true,
                        next: this.state.next +1,
                    });
                }

            }else{
                if(this.state.bottom){
                    // console.log("not bottom")
                    this.setState({
                        bottom: false
                    });
                }
            }

        }

    }

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    loadMore = () => {
        // console.log("next: " + this.state.next )
        let next = this.state.next;

        if(this.state.bottom){
            // console.log("query")
            return(<Query
                query={getSelfies}
                variables={{ "offset": {"offset": next} }}
                onCompleted={this.onFetched}>
                {({ loading, error, data }) => {

                    // console.log("next: " + next )
                    // console.log("data: " + loading )
                    if (loading) return(<div className="text-center"><h1>loading more ...</h1></div>);
                    if (error) return `Error! ${error}`;

                    return(
                        <div className="text-center">
                            <h1> ... </h1>
                        </div>
                    )
                }}
            </Query>)
        }else {
            return(
                <div className="text-center">
                    <h1> ... </h1>
                </div>
            )
        }

    };


    completed = data => {

        this.setState({
            data: data
        })
    };


    onFetched = data => {
        let newdata = {
            female : this.state.data.getSelfies.female.concat(data.getSelfies.female),
            male : this.state.data.getSelfies.male.concat(data.getSelfies.male),
        }

        let dataSelfies = {...this.state.data};
        dataSelfies.getSelfies = newdata;

        this.setState({
            data : dataSelfies
        });


    };

    renderDetails = (data) => {

        this.setState({
            details: {
                active: true,
                data: data
            }
        })
    };

    closeDetails = () => {
        this.setState({
            details:{
                active: false,
                data:this.state.details.data
            }
        })
    }

    details = () => {
        // console.log(this.state.details)

            return(
                <div className={this.state.details.active ? "details active" : "details" }>

                    <button type="button" className="close" aria-label="Close" onClick={()=>this.closeDetails()}>
                        <span aria-hidden="true">&times;</span>
                    </button>

                    <img src={this.state.details.data.media} alt=""/>

                    <div className="meta">
                        <div className="tweet">
                            {this.state.details.data.text}
                        </div>
                        <div className="date">{this.state.details.data.created_at}</div>
                        <a href={"https://twitter.com/" + this.state.details.data.screen_name} target="_blank" rel="noopener noreferrer">@{this.state.details.data.screen_name}</a>
                    </div>

                    <div className="overlay" onClick={()=>this.closeDetails()}>

                    </div>

                </div>
            );

    };

    album = () => (
        <Query query={getSelfies} onCompleted={this.completed}>
            {({ loading, error, data }) => {
                if (loading) return (<h1 className="text-center">Loading data ...</h1>);
                if (error) return `Error! ${error.message}`;

                return (
                    <ApolloConsumer>
                        {client => (

                            <div className="row">

                                <div className="col-6 card-c ">
                                    <div className="masonry">

                                        <Card selfies={this.state.data.getSelfies.female} renderdetails={data => this.renderDetails(data)}/>
                                        <span className="bottom female">bottom</span>

                                    </div>
                                </div>
                                <div className="col-6 card-c ">
                                    <div className="masonry">

                                        <Card selfies={this.state.data.getSelfies.male } renderdetails={data => this.renderDetails(data)}/>
                                        <span className="bottom male">bottom</span>


                                    </div>
                                </div>
                            </div>

                        )}
                    </ApolloConsumer>
                );
            }}
        </Query>
    );


    render() {
        // console.log(this.props)
        return (
            <div className="album py-5 bg-light">
                <div className="container">

                    <Notification
                        notification={this.state.notification}
                        handelClickNotification={data => this.renderDetails(data)}
                    />

                    {this.album()}

                    {this.loadMore()}

                    {this.tweetsAdded()}

                    {this.details()}

                </div>
            </div>
        );
    }
}

export default graphql(getSelfies)(Album);