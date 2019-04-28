import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Album from './components/album';
import './App.css';
import { ApolloProvider } from "react-apollo";
import client from './apolloClient';
import Stream from './components/stream';


function App() {
  return (
      <ApolloProvider client={client}>
        <div className="App">
            <header>

                <div className="navbar navbar-dark bg-dark box-shadow">
                    <div className="container d-flex justify-content-between">
                        <a href="#4" className="navbar-brand d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round" className="mr-2">
                                <path
                                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                            <strong>TwittoTitiz</strong>
                        </a>
                    </div>
                </div>
            </header>

            <main role="main">

                <section className="jumbotron text-center">
                    <div className="container">
                        <h1 className="jumbotron-heading">Twitto..Titiz</h1>
                        <p className="lead text-muted">This is a test of a Machine learning that analyses twitter hashtag #selfie stream,
                            and classifies images by gender: female (left columns) / male (right columns) </p>
                        <hr/>

                        <Stream/>

                    </div>
                </section>

                <Album/>

            </main>


                <footer className="text-muted">
                    <div className="container">
                        <p className="float-right">
                            <a href="https://twitter.com/bouziane_a">Get in touch ? </a>
                        </p>
                        <p>Thanks to OpenCV / TensorFlow / Flask for Image Recognition And Deep Learning micro service</p>
                        <p>React / Apollo(server/client) / Node Js for server, mongoDB & redis for persisting data & Docker to compose all that. </p>
                    </div>
                </footer>


        </div>
      </ApolloProvider>
  );
}

export default App;
