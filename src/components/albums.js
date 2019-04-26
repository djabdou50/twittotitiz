import React, {Component} from 'react';
import Card from './card';
import { graphql, Query, ApolloConsumer  } from "react-apollo";
import { gql } from "apollo-boost";

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



class Album extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bottom: false,
            next: 0,
            data: {},
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    handleScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;

        // //for a perfect page infinit loading ...
        // let element = document.getElementById("bottom");
        // let rect;
        // if(element){
        //     rect = element.getBoundingClientRect();
        //     console.log(rect.top, rect.right, rect.bottom, rect.left);
        // }
        //
        // if (
        //     rect.top >= 0 &&
        //     rect.left >= 0 &&
        //     rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
        //     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        // ) {
        //     console.log('In the viewport!');
        // } else {
        //     console.log('Not in the viewport... whomp whomp');
        // }
        //
        // console.log(window.pageYOffset)
        if (windowBottom >= docHeight - 150) {
            if(!this.state.bottom){
                // console.log("bottoooom")
                this.setState({
                    bottom: true,
                    next: this.state.next +1,
                });
            }

        } else {
            if(this.state.bottom){
                // console.log("not bottom")
                this.setState({
                    bottom: false
                });
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

        this.setState({data : dataSelfies });

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

                                <div className="col-lg-6">
                                    <div className="row">

                                        <Card selfies={this.state.data.getSelfies.female}/>

                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="row">

                                        <Card selfies={this.state.data.getSelfies.male}/>
                                        <span id="bottom">bottom</span>

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

                    {this.album()}

                    {this.loadMore()}

                </div>
            </div>
        );
    }
}

export default graphql(getSelfies)(Album);